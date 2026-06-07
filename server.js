const http = require("http");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { promisify } = require("util");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const SESSION_COOKIE = "family_ledger_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const DEFAULT_PEOPLE = ["Me"];
const scrypt = promisify(crypto.scrypt);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function requestPath(url) {
  return new URL(url, "http://localhost").pathname;
}

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf("=");
      if (separator === -1) return cookies;
      const key = decodeURIComponent(part.slice(0, separator));
      const value = decodeURIComponent(part.slice(separator + 1));
      cookies[key] = value;
      return cookies;
    }, {});
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function readSessionStore() {
  try {
    const raw = await fs.readFile(SESSIONS_FILE, "utf8");
    const store = JSON.parse(raw);
    return {
      version: 1,
      sessions: Array.isArray(store.sessions) ? store.sessions : []
    };
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, sessions: [] };
    throw error;
  }
}

async function writeSessionStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function clearExpiredSessions(store = null) {
  const currentStore = store || await readSessionStore();
  const now = Date.now();
  const sessions = currentStore.sessions.filter((session) => session.expiresAt > now);
  const changed = sessions.length !== currentStore.sessions.length;
  const next = { version: 1, sessions };
  if (changed) await writeSessionStore(next);
  return next;
}

async function readAuthConfig() {
  try {
    const raw = await fs.readFile(AUTH_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function hashPassword(password, salt) {
  const hash = await scrypt(password, salt, 64);
  return hash.toString("hex");
}

async function writeAuthConfig(password) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const salt = crypto.randomBytes(16).toString("hex");
  const now = new Date().toISOString();
  const auth = {
    version: 1,
    salt,
    hash: await hashPassword(password, salt),
    createdAt: now,
    updatedAt: now
  };
  await fs.writeFile(AUTH_FILE, JSON.stringify(auth, null, 2), "utf8");
  return auth;
}

async function verifyPassword(password, auth) {
  if (!auth?.salt || !auth?.hash) return false;
  const expected = Buffer.from(auth.hash, "hex");
  const actual = Buffer.from(await hashPassword(password, auth.salt), "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

async function createSession(res) {
  const store = await clearExpiredSessions();
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  store.sessions.push({
    tokenHash: hashToken(token),
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  });
  await writeSessionStore(store);
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  );
}

async function clearSession(req, res) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (token) {
    const tokenHash = hashToken(token);
    const store = await readSessionStore();
    const sessions = store.sessions.filter((session) => session.tokenHash !== tokenHash);
    await writeSessionStore({ version: 1, sessions });
  }
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

async function isAuthenticated(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return false;
  const store = await clearExpiredSessions();
  const tokenHash = hashToken(token);
  return store.sessions.some((session) => session.tokenHash === tokenHash && session.expiresAt > Date.now());
}

function defaultStore() {
  const month = monthKey();
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    demo: true,
    people: [...DEFAULT_PEOPLE],
    transactions: [
      {
        id: "txn_demo_grocery",
        date: `${month}-03`,
        merchant: "Costco",
        source: "grocery",
        scenario: "日常",
        payer: "Me",
        total: 126.42,
        tax: 4.81,
        discount: 0,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        items: [
          { id: "item_demo_1", name: "Chicken Thighs", quantity: "1 pack", amount: 18.99, category: "食品杂货", subcategory: "肉类", necessity: "必须", owner: "Me", confidence: 0.91 },
          { id: "item_demo_2", name: "Strawberries", quantity: "2 boxes", amount: 13.98, category: "食品杂货", subcategory: "水果", necessity: "必须", owner: "Me", confidence: 0.9 },
          { id: "item_demo_3", name: "Spinach", quantity: "1 bag", amount: 4.49, category: "食品杂货", subcategory: "蔬菜", necessity: "必须", owner: "Me", confidence: 0.88 },
          { id: "item_demo_4", name: "Laundry Pods", quantity: "1", amount: 22.99, category: "家居日用", subcategory: "清洁用品", necessity: "可优化", owner: "Me", confidence: 0.86 }
        ]
      },
      {
        id: "txn_demo_amazon",
        date: `${month}-08`,
        merchant: "Amazon",
        source: "ecommerce",
        scenario: "网购",
        payer: "Me",
        total: 84.17,
        tax: 6.18,
        discount: 0,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        items: [
          { id: "item_demo_5", name: "Storage Bins", quantity: "2", amount: 32.99, category: "家居日用", subcategory: "收纳", necessity: "可优化", owner: "Me", confidence: 0.89 },
          { id: "item_demo_6", name: "Sunscreen", quantity: "1", amount: 17.5, category: "护肤美妆", subcategory: "防晒", necessity: "可优化", owner: "Me", confidence: 0.9 },
          { id: "item_demo_7", name: "Phone Cable", quantity: "1", amount: 12.99, category: "电子数码", subcategory: "配件", necessity: "必须", owner: "Me", confidence: 0.84 }
        ]
      },
      {
        id: "txn_demo_trip",
        date: `${month}-15`,
        merchant: "Weekend Trip",
        source: "travel",
        scenario: "旅行",
        payer: "Me",
        total: 428.6,
        tax: 0,
        discount: 0,
        status: "confirmed",
        tripName: "周末短途",
        createdAt: new Date().toISOString(),
        items: [
          { id: "item_demo_8", name: "Hotel", quantity: "1 night", amount: 218, category: "旅行度假", subcategory: "住宿", necessity: "可优化", owner: "Me", confidence: 0.92 },
          { id: "item_demo_9", name: "Dinner", quantity: "1", amount: 86.4, category: "外食/咖啡", subcategory: "餐厅", necessity: "可优化", owner: "Me", confidence: 0.89 },
          { id: "item_demo_10", name: "Parking", quantity: "1", amount: 24, category: "停车过路", subcategory: "停车", necessity: "必须", owner: "Me", confidence: 0.88 },
          { id: "item_demo_11", name: "Souvenirs", quantity: "1", amount: 46.2, category: "礼物社交", subcategory: "纪念品", necessity: "非必要", owner: "Me", confidence: 0.82 }
        ]
      }
    ],
    pendingReceipts: [],
    recurring: [
      { id: "rec_demo_rent", name: "房租", category: "住房", amount: 2600, cycle: "每月", dueDay: 1, payer: "Me", necessity: "必须", active: true },
      { id: "rec_demo_utilities", name: "水电气", category: "水电 Utilities", amount: 180, cycle: "每月", dueDay: 10, payer: "Me", necessity: "必须", active: true },
      { id: "rec_demo_internet", name: "家庭网络", category: "订阅服务", amount: 65, cycle: "每月", dueDay: 12, payer: "Me", necessity: "必须", active: true },
      { id: "rec_demo_phone", name: "手机话费", category: "订阅服务", amount: 96, cycle: "每月", dueDay: 18, payer: "Me", necessity: "必须", active: true },
      { id: "rec_demo_ai", name: "AI 订阅", category: "订阅服务", amount: 75, cycle: "每月", dueDay: 20, payer: "Me", necessity: "可优化", active: true }
    ],
    settings: {
      currency: "USD",
      monthlyBudget: 5200,
      learnedRules: []
    }
  };
}

function looksLikeSubscriptionService(record) {
  return includesAny(record, [
    "订阅",
    "手机话费",
    "手机费",
    "话费",
    "手机套餐",
    "phone bill",
    "mobile bill",
    "cell bill",
    "wireless bill",
    "verizon",
    "t-mobile",
    "at&t",
    "家庭网络",
    "网络",
    "网费",
    "internet",
    "wifi",
    "home internet",
    "internet bill",
    "wifi bill",
    "comcast",
    "xfinity",
    "ziply",
    "spectrum",
    "centurylink",
    "frontier"
  ]);
}

function categoryText(record) {
  return [
    record?.name,
    record?.merchant,
    record?.subcategory,
    record?.description
  ].filter(Boolean).join(" ").toLowerCase();
}

function includesAny(record, words) {
  const text = categoryText(record);
  return words.some((word) => text.includes(word));
}

function normalizeCategory(category, context = {}) {
  if (category === "外食咖啡") {
    return "外食/咖啡";
  }
  if (category === "打车租车") {
    return "打车/租车";
  }
  if (category === "手机话费") {
    return "订阅服务";
  }
  if (category === "水电网络" || category === "水电网手机") {
    return looksLikeSubscriptionService(context) ? "订阅服务" : "水电 Utilities";
  }
  if (category === "交通用车") {
    if (includesAny(context, ["公交", "公车", "地铁", "轻轨", "link", "orca", "metro", "sounder", "streetcar", "ferry", "water taxi"])) return "公共交通";
    if (includesAny(context, ["uber", "lyft", "taxi", "出租", "打车", "租车", "zipcar", "turo", "gig car", "car rental"])) return "打车/租车";
    if (includesAny(context, ["停车", "parking", "toll", "good to go", "520", "过桥", "过路", "罚单", "ticket"])) return "停车过路";
    return "车辆养护";
  }
  return category || "其他";
}

function normalizeStoreCategories(store) {
  let changed = false;
  const assign = (object, context = {}) => {
    if (!object || !("category" in object)) return;
    const normalized = normalizeCategory(object.category, { ...context, ...object });
    if (normalized !== object.category) {
      object.category = normalized;
      changed = true;
    }
  };

  (store.transactions || []).forEach((transaction) => {
    (transaction.items || []).forEach((item) => assign(item, { merchant: transaction.merchant }));
  });
  (store.pendingReceipts || []).forEach((receipt) => {
    (receipt.items || []).forEach((item) => assign(item, { merchant: receipt.transaction?.merchant }));
  });
  (store.recurring || []).forEach((item) => assign(item));
  return changed;
}

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const store = JSON.parse(raw);
    if (normalizeStoreCategories(store)) return await writeStore(store);
    return store;
  } catch (error) {
    const store = defaultStore();
    await writeStore(store);
    return store;
  }
}

async function writeStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const next = { ...store, updatedAt: new Date().toISOString() };
  normalizeStoreCategories(next);
  await fs.writeFile(STORE_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(text)
  });
  res.end(text);
}

function safeJoinStatic(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const relative = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, relative));
  if (!filePath.startsWith(PUBLIC_DIR)) return null;
  return filePath;
}

function uniquePeople(values) {
  const seen = new Set();
  return (values || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key) || value === "共同") return false;
      seen.add(key);
      return true;
    });
}

function peopleFromPayload(payload = {}) {
  const people = uniquePeople(payload.people);
  return people.length ? people : DEFAULT_PEOPLE;
}

function defaultPayerForPeople(people) {
  return people.length <= 1 ? people[0] : "共同";
}

function normalizePerson(value, people = DEFAULT_PEOPLE) {
  const normalizedPeople = uniquePeople(people);
  const activePeople = normalizedPeople.length ? normalizedPeople : DEFAULT_PEOPLE;
  const trimmed = String(value || "").trim();
  if (trimmed === "我") return activePeople[0] || DEFAULT_PEOPLE[0];
  if (trimmed === "对方") return activePeople[1] || activePeople[0] || DEFAULT_PEOPLE[0];
  if (!trimmed) return defaultPayerForPeople(activePeople);
  if (activePeople.length <= 1) return activePeople[0] || DEFAULT_PEOPLE[0];
  if (trimmed === "共同") return "共同";
  if (activePeople.includes(trimmed)) return trimmed;
  return trimmed;
}

function normalizePlatform(value) {
  return String(value || "").trim();
}

function moneyFromCell(value) {
  const clean = String(value || "")
    .replace(/[,$]/g, "")
    .replace(/^usd\s*/i, "")
    .trim();
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(clean)) return null;
  const amount = Number(clean);
  return Number.isFinite(amount) ? amount : null;
}

function amountFromText(line) {
  const normalized = String(line || "").replace(/,/g, "");
  const matches = normalized.match(/(?:\$|USD\s*)?(-?\d+(?:\.\d{1,2})?)\s*$/i);
  if (!matches) return null;
  const value = Number(matches[1]);
  return Number.isFinite(value) ? value : null;
}

function normalizeName(line) {
  return String(line || "")
    .replace(/(?:\$|USD\s*)?-?\d[\d,]*(?:\.\d{1,2})?\s*$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/^[-*•\d.\s]+/, "")
    .trim();
}

function parseDelimitedLine(line) {
  const delimiter = line.includes("\t") ? "\t" : line.includes(",") ? "," : "";
  if (!delimiter) return [];
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells.map((value) => value.replace(/^"|"$/g, "").trim()).filter(Boolean);
}

function isSummaryLine(name) {
  return /^(order\s*)?(subtotal|total|tax|sales tax|estimated tax|balance|change|refund|discount|promotion|promo|grand total)$/i.test(String(name || "").trim());
}

function parseReceiptLine(line) {
  if (/^\s*(?:[A-Z][a-z]+\s+\d{1,2},\s*\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\s*$/.test(line)) {
    return null;
  }
  if (/\b(ordered|order date|delivered|placed|purchased|date)\b/i.test(line) && /\b\d{4}\b/.test(line)) {
    return null;
  }

  const cells = parseDelimitedLine(line);
  if (cells.length >= 3) {
    let amountIndex = -1;
    let amount = null;
    for (let index = cells.length - 1; index >= 0; index -= 1) {
      amount = moneyFromCell(cells[index]);
      if (amount !== null) {
        amountIndex = index;
        break;
      }
    }
    if (amountIndex >= 0) {
      const candidates = cells
        .slice(0, amountIndex)
        .filter((cell) => !moneyFromCell(cell) && !/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cell));
      const name = candidates.slice().reverse().find((cell) => /[A-Za-z\u4e00-\u9fa5]/.test(cell)) || candidates[0] || "";
      if (name && !isSummaryLine(name)) return { line, amount, name: normalizeName(name) || name };
    }
  }

  const amount = amountFromText(line);
  const name = normalizeName(line);
  if (amount === null || !name || isSummaryLine(name)) return null;
  return { line, amount, name };
}

function dateFromLines(lines) {
  const monthNames = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
  };
  const pad = (value) => String(value).padStart(2, "0");
  for (const line of lines) {
    const numeric = line.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
    if (numeric) return `${numeric[1]}-${pad(numeric[2])}-${pad(numeric[3])}`;

    const named = line.match(/\b([A-Z][a-z]+)\s+(\d{1,2}),\s*(\d{4})\b/);
    if (named && monthNames[named[1].toLowerCase()]) {
      return `${named[3]}-${pad(monthNames[named[1].toLowerCase()])}-${pad(named[2])}`;
    }
  }
  return todayIso();
}

function storeAddressFromLines(lines) {
  const streetPattern = /\b\d{1,6}\s+[A-Za-z0-9 .#'/-]+?\b(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|way|ln|lane|pike|pl|place|ct|court|hwy|highway|trail|ter|terrace|cir|circle|pkwy|parkway)\b(?:\s+(?:ne|nw|se|sw|n|s|e|w))?\b/i;
  const cityStateZipPattern = /\b[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!streetPattern.test(line)) continue;

    const addressParts = [line];
    const nextLine = lines[index + 1] || "";
    if (cityStateZipPattern.test(nextLine)) addressParts.push(nextLine);
    return addressParts.join(", ");
  }

  return "";
}

function looksLikeGroceryPlatform(platform) {
  return ["whole foods", "amazon fresh", "instacart"].includes(String(platform || "").toLowerCase());
}

function looksLikeFoodDeliveryPlatform(platform) {
  return ["uber eats", "doordash"].includes(String(platform || "").toLowerCase());
}

function looksLikePharmacyPlatform(platform) {
  return ["cvs", "walgreens", "rite aid", "pharmacy"].includes(String(platform || "").toLowerCase());
}

function inferReceiptSourceType(payload, lines, platform) {
  const text = [
    platform,
    payload.merchant,
    payload.fileName,
    payload.text,
    ...lines.slice(0, 8)
  ].filter(Boolean).join(" ").toLowerCase();

  if (/\b(airbnb|booking|expedia|hotel|hotels\.com|marriott|hilton|hyatt|inn|motel|rental car|car rental|turo|zipcar)\b/.test(text) || /酒店|住宿|租车|旅行|旅馆/.test(text)) {
    return "travel";
  }
  if (/\b(rent|utility|utilities|xfinity|comcast|ziply|spectrum|centurylink|verizon|t-mobile|at&t|invoice|statement)\b/.test(text) || /房租|水电|电费|水费|燃气|网费|手机话费|账单/.test(text)) {
    return "bill";
  }
  if (/\b(cvs|walgreens|rite aid|pharmacy|rx|prescription)\b/.test(text) || /药店|处方|药房/.test(text)) {
    return "pharmacy";
  }
  if (/\b(trader joe'?s|costco|whole foods|safeway|qfc|fred meyer|grocery|market|supermarket|produce)\b/.test(text) || /超市|买菜|食品|杂货/.test(text)) {
    return "grocery";
  }
  if (/\b(amazon|target|etsy|ebay|sephora|nordstrom|order|shipment|delivery|online)\b/.test(text) || /订单|网购|快递|配送/.test(text)) {
    return "ecommerce";
  }
  return "receipt";
}

function scenarioForReceipt(sourceType, platform) {
  if (sourceType === "travel") return "旅行";
  if (sourceType === "bill") return "固定账单";
  if (["grocery", "pharmacy", "receipt"].includes(sourceType) || looksLikeGroceryPlatform(platform) || looksLikeFoodDeliveryPlatform(platform) || looksLikePharmacyPlatform(platform)) return "日常";
  return "网购";
}

function classifyItem(name, sourceType) {
  const text = name.toLowerCase();
  const rules = [
    [["chicken", "beef", "pork", "salmon", "fish", "steak", "肉", "牛", "鸡", "鱼", "虾"], ["食品杂货", "肉类", "必须"]],
    [["apple", "banana", "straw", "berry", "orange", "grape", "fruit", "水果", "草莓", "苹果", "香蕉"], ["食品杂货", "水果", "必须"]],
    [["spinach", "lettuce", "broccoli", "tomato", "vegetable", "veg", "菜", "蔬菜", "菠菜", "西兰花"], ["食品杂货", "蔬菜", "必须"]],
    [["milk", "yogurt", "cheese", "egg", "eggs", "乳", "奶", "鸡蛋"], ["食品杂货", "乳制品/蛋", "必须"]],
    [["snack", "chips", "cookie", "chocolate", "零食", "薯片", "巧克力"], ["食品杂货", "零食", "非必要"]],
    [["coffee beans", "ground coffee", "instant coffee", "咖啡豆", "咖啡粉", "挂耳咖啡", "速溶咖啡"], ["食品杂货", "咖啡豆/饮品", "必须"]],
    [["bakery", "pastry", "croissant", "bread", "cake", "dessert", "面包", "可颂", "蛋糕", "甜点", "甜品", "烘焙"], ["外食/咖啡", "甜点/面包", "可优化"]],
    [["flower", "flowers", "florist", "bouquet", "鲜花", "花束", "买花"], ["家居日用", "鲜花", "可优化"]],
    [["pharmacy", "prescription", "rx", "medicine", "medication", "drug", "pain reliever", "ibuprofen", "acetaminophen", "tylenol", "advil", "allergy", "benadryl", "zyrtec", "claritin", "cold medicine", "cough", "vitamin", "supplement", "first aid", "bandage", "药", "处方", "处方药", "非处方药", "感冒药", "止痛药", "布洛芬", "退烧", "过敏药", "维生素", "保健品", "创可贴", "绷带", "急救"], ["医疗健康", "药品/保健", "必须"]],
    [["detergent", "laundry", "paper towel", "toilet", "clean", "storage", "organizer", "bins", "container", "hanger", "bedding", "towel", "洗衣", "清洁", "纸巾", "收纳", "储物", "衣架", "床品", "毛巾"], ["家居日用", "日用/收纳", "可优化"]],
    [["shirt", "dress", "jeans", "shoe", "bag", "coat", "衣", "鞋", "包"], ["衣服鞋包", "服饰", "可优化"]],
    [["serum", "cream", "sunscreen", "cleanser", "lotion", "skincare", "makeup", "cosmetic", "lipstick", "lip gloss", "foundation", "mascara", "eyeliner", "blush", "perfume", "护肤", "防晒", "面霜", "精华", "口红", "唇膏", "唇釉", "粉底", "眼影", "腮红", "睫毛膏", "眼线", "眉笔", "散粉", "香水", "化妆品", "彩妆"], ["护肤美妆", "护肤/彩妆", "可优化"]],
    [["usb", "cable", "charger", "adapter", "phone case", "keyboard", "mouse", "headphone", "earbuds", "电子", "数据线", "充电器", "转接头", "手机壳", "键盘", "鼠标", "耳机"], ["电子数码", "配件", "可优化"]],
    [["hotel", "airbnb", "inn", "住宿", "酒店"], ["旅行度假", "住宿", "可优化"]],
    [["flight ticket", "airfare", "flight", "airline", "delta", "alaska airlines", "united airlines", "american airlines", "southwest", "机票", "飞机票", "航班"], ["旅行度假", "机票/交通", "可优化"]],
    [["ticket", "tickets", "entrance fee", "admission", "park pass", "门票", "入园", "公园票"], ["旅行度假", "门票", "可优化"]],
    [["bus", "train", "orca", "link", "metro", "sounder", "streetcar", "ferry", "water taxi", "公交", "公车", "地铁", "轻轨"], ["公共交通", "通勤/出行", "必须"]],
    [["uber", "lyft", "taxi", "zipcar", "turo", "car rental", "出租", "打车", "租车"], ["打车/租车", "临时出行", "可优化"]],
    [["parking", "toll", "good to go", "520", "停车", "过桥", "过路", "罚单"], ["停车过路", "停车/过路", "必须"]],
    [["gas", "fuel", "insurance", "maintenance", "car wash", "tire", "tabs", "driver license", "油", "加油", "车险", "汽车保险", "保养", "修车", "汽车维修", "洗车", "轮胎", "车牌", "驾照"], ["车辆养护", "用车维护", "必须"]],
    [["restaurant", "dinner", "lunch", "coffee", "餐", "咖啡", "奶茶"], ["外食/咖啡", "餐饮", "可优化"]],
    [["movie", "cinema", "concert", "museum", "game", "steam", "switch", "playstation", "xbox", "board game", "电影", "演唱会", "展览", "博物馆", "游戏", "桌游", "密室"], ["娱乐游戏", "娱乐", "可优化"]],
    [["gym", "fitness", "yoga", "pool", "climbing", "ski", "健身", "瑜伽", "游泳", "攀岩", "滑雪", "球场"], ["运动健身", "运动", "可优化"]],
    [["pet", "vet", "grooming", "pet insurance", "pet license", "宠物", "猫粮", "狗粮", "猫砂", "兽医"], ["宠物", "宠物", "必须"]],
    [["renters insurance", "life insurance", "umbrella insurance", "annual fee", "bank fee", "tax software", "accountant", "租客保险", "人寿", "伞险", "信用卡年费", "银行手续费", "报税"], ["保险金融", "保险/金融", "必须"]],
    [["course", "class", "book", "kindle", "workshop", "exam", "课程", "证书", "考试", "书"], ["学习成长", "学习", "可优化"]],
    [["cleaning service", "carpet cleaning", "dry cleaning", "mover", "repair", "installation", "清洁服务", "保洁", "地毯清洗", "干洗", "搬家", "维修", "安装"], ["家政维修", "家政/维修", "可优化"]],
    [["passport", "visa", "uscis", "notary", "license fee", "护照", "签证", "移民", "公证", "政府", "证件"], ["证件税费", "证件/政府费用", "必须"]],
    [["phone bill", "mobile bill", "cell bill", "wireless bill", "verizon", "t-mobile", "at&t", "手机话费", "手机费", "话费", "手机套餐", "家庭网络", "网费", "网络", "internet", "wifi", "home internet", "internet bill", "wifi bill", "comcast", "xfinity", "ziply", "spectrum", "centurylink", "frontier"], ["订阅服务", "通信/网络", "必须"]],
    [["subscription", "openai", "chatgpt", "claude", "netflix", "spotify", "订阅"], ["订阅服务", "软件/会员", "可优化"]],
    [["rent", "房租"], ["住房", "房租", "必须"]],
    [["utilities", "utility", "electric", "electricity", "water bill", "sewer", "trash", "garbage", "waste", "水电", "电费", "水费", "燃气", "煤气", "天然气", "垃圾费", "污水", "下水道"], ["水电 Utilities", "水电气", "必须"]]
  ];
  for (const [needles, result] of rules) {
    if (needles.some((needle) => text.includes(needle))) {
      return { category: result[0], subcategory: result[1], necessity: result[2] };
    }
  }
  if (sourceType === "travel") return { category: "旅行度假", subcategory: "杂项", necessity: "可优化" };
  if (sourceType === "grocery") return { category: "食品杂货", subcategory: "待细分", necessity: "必须" };
  if (sourceType === "pharmacy") return { category: "医疗健康", subcategory: "药品/保健", necessity: "必须" };
  if (sourceType === "ecommerce") return { category: "网购杂项", subcategory: "待细分", necessity: "可优化" };
  return { category: "其他", subcategory: "待细分", necessity: "可优化" };
}

function sampleForSource(sourceType) {
  const samples = {
    grocery: {
      merchant: "Whole Foods",
      total: 73.86,
      tax: 2.4,
      items: [
        ["Ground Beef", "1 pack", 16.99],
        ["Organic Apples", "1 bag", 7.49],
        ["Broccoli", "2 bunches", 5.58],
        ["Greek Yogurt", "1", 6.99],
        ["Dish Soap", "1", 4.99]
      ]
    },
    ecommerce: {
      merchant: "Amazon",
      total: 96.28,
      tax: 7.12,
      items: [
        ["Under Sink Organizer", "1", 28.99],
        ["Sunscreen SPF 50", "2", 31.98],
        ["Cotton T-shirt", "1", 18.19],
        ["USB-C Cable", "1", 9.99]
      ]
    },
    pharmacy: {
      merchant: "CVS",
      total: 24.79,
      tax: 0,
      items: [
        ["Cold Medicine", "1", 12.99],
        ["Vitamin C", "1", 8.49],
        ["Bandages", "1", 3.31]
      ]
    },
    travel: {
      merchant: "Trip Receipt",
      total: 312.74,
      tax: 0,
      items: [
        ["Hotel", "1 night", 168],
        ["Dinner", "1", 72.44],
        ["Parking", "1", 21],
        ["Souvenirs", "1", 36.3],
        ["Coffee", "2", 15]
      ]
    },
    bill: {
      merchant: "Monthly Bills",
      total: 145,
      tax: 0,
      items: [
        ["Internet", "1 month", 65],
        ["Phone Plan", "2 lines", 80]
      ]
    }
  };
  return samples[sourceType] || samples.grocery;
}

function localParseReceipt(payload) {
  const sourcePlatform = normalizePlatform(payload.sourcePlatform);
  const pastedText = (payload.text || "").trim();
  const lines = pastedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sourceType = payload.sourceType || inferReceiptSourceType(payload, lines, sourcePlatform);
  const amountLines = lines
    .map(parseReceiptLine)
    .filter(Boolean)
    .filter((entry) => entry.amount > 0);

  const sample = sampleForSource(sourceType);
  const parsedItems = amountLines.length >= 2
    ? amountLines.map((entry) => [entry.name, "1", entry.amount])
    : sample.items;

  const totalLine = lines.find((line) => /(^|\s)(order\s*)?total(\s|:|$)/i.test(line) && amountFromText(line) !== null);
  const taxLine = lines.find((line) => /(^|\s)(sales\s*)?tax(\s|:|$)/i.test(line) && amountFromText(line) !== null);
  const subtotal = parsedItems.reduce((sum, item) => sum + Number(item[2] || 0), 0);
  const tax = taxLine ? amountFromText(taxLine) : amountLines.length >= 2 ? 0 : sample.tax;
  const total = totalLine ? amountFromText(totalLine) : Number((subtotal + tax).toFixed(2));

  const merchantLine = lines.find((line) => !amountFromText(line) && line.length > 2 && line.length < 40);
  const merchant = payload.merchant || sourcePlatform || merchantLine || (amountLines.length >= 2 ? "" : sample.merchant);
  const scenario = scenarioForReceipt(sourceType, sourcePlatform);
  const date = dateFromLines(lines);
  const people = peopleFromPayload(payload);
  const payer = normalizePerson(payload.payer, people);
  const storeAddress = String(payload.storeAddress || storeAddressFromLines(lines)).trim();

  return {
    provider: "demo",
    confidence: amountLines.length >= 2 ? 0.78 : 0.62,
    warnings: [
      amountLines.length >= 2
        ? "这是本地启发式解析，适合先体验确认流程；接入 OpenAI key 后可直接识别图片内容。"
        : "当前没有真实 OCR，已根据场景生成演示明细；接入 OpenAI key 后会读取你上传的图片。"
    ],
    receipt: {
      id: `receipt_${Date.now()}`,
      fileName: payload.fileName || "uploaded-receipt",
      sourceType,
      sourcePlatform,
      imageDataUrl: payload.imageDataUrl || "",
      createdAt: new Date().toISOString()
    },
    transaction: {
      id: `txn_${Date.now()}`,
      date,
      merchant,
      source: sourceType,
      scenario,
      payer,
      storeAddress,
      total: Number(total.toFixed(2)),
      tax: Number((tax || 0).toFixed(2)),
      discount: 0,
      status: "pending",
      tripName: String(payload.tripName || "").trim()
    },
    items: parsedItems.map(([name, quantity, amount], index) => {
      const classification = classifyItem(name, sourceType);
      return {
        id: `item_${Date.now()}_${index}`,
        name,
        quantity,
        amount: Number(Number(amount || 0).toFixed(2)),
        category: classification.category,
        subcategory: classification.subcategory,
        necessity: classification.necessity,
        owner: "共同",
        confidence: amountLines.length >= 2 ? 0.78 : 0.64
      };
    })
  };
}

const receiptSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    provider: { type: "string" },
    confidence: { type: "number" },
    warnings: { type: "array", items: { type: "string" } },
    transaction: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string" },
        merchant: { type: "string" },
        storeAddress: { type: "string" },
        source: { type: "string" },
        scenario: { type: "string" },
        payer: { type: "string" },
        total: { type: "number" },
        tax: { type: "number" },
        discount: { type: "number" },
        tripName: { type: "string" }
      },
      required: ["date", "merchant", "storeAddress", "source", "scenario", "payer", "total", "tax", "discount", "tripName"]
    },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          quantity: { type: "string" },
          amount: { type: "number" },
          category: { type: "string" },
          subcategory: { type: "string" },
          necessity: { type: "string" },
          owner: { type: "string" },
          confidence: { type: "number" }
        },
        required: ["name", "quantity", "amount", "category", "subcategory", "necessity", "owner", "confidence"]
      }
    }
  },
  required: ["provider", "confidence", "warnings", "transaction", "items"]
};

function extractResponseText(response) {
  if (typeof response.output_text === "string") return response.output_text;
  const chunks = [];
  for (const output of response.output || []) {
    for (const content of output.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
      if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }
  return chunks.join("\n");
}

async function parseWithOpenAI(payload) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  const people = peopleFromPayload(payload);
  const payerOptions = people.length > 1 ? ["共同", ...people] : [...people];

  const content = [
    {
      type: "input_text",
      text: [
        "你是一个家庭记账 App 的票据识别助手。",
        "请从小票、订单截图或用户粘贴的订单文字中提取结构化记账数据。",
        "分类必须适合家庭账本：住房、水电 Utilities、食品杂货、外食/咖啡、公共交通、打车/租车、停车过路、车辆养护、旅行度假、网购杂项、衣服鞋包、护肤美妆、家居日用、医疗健康、订阅服务、礼物社交、电子数码、娱乐游戏、运动健身、宠物、保险金融、学习成长、家政维修、证件税费、其他。手机话费和家庭网络归入订阅服务；水费、电费、燃气、垃圾/污水等 utilities 归入水电 Utilities。机票、飞机票、航班、airfare、flight 默认归入旅行度假。",
        "必要性只能是：必须、可优化、非必要。",
        `付款人和使用者只能是：${payerOptions.join("、")}。无法判断时用 ${defaultPayerForPeople(people)}。`,
        "如果是纸质小票或门店小票，请提取交易发生门店的完整地址到 transaction.storeAddress，例如街道、城市、州和邮编；没有看到地址就填空字符串，不要猜。",
        "请你根据票据内容自行判断 transaction.source 和 transaction.scenario；用户上传小票前不会手动选择消费场景。",
        payload.sourceType ? `系统给出的来源线索是：${payload.sourceType}。这是辅助线索，不要覆盖票据内容本身。` : "系统没有给出来源线索。",
        payload.sourcePlatform ? `用户选择的导入来源是：${payload.sourcePlatform}。` : "用户没有选择具体导入来源。",
        payload.payer ? `用户指定付款人是：${normalizePerson(payload.payer, people)}。transaction.payer 必须使用这个值。` : "用户没有指定付款人。",
        payload.tripName ? `用户指定的旅行/项目是：${payload.tripName}。transaction.tripName 必须使用这个值。` : "用户没有指定旅行/项目。",
        "如果内容来自 Whole Foods、Amazon Fresh、Instacart 或其他 groceries 电子小票，场景通常是日常，商品按食品杂货/家居日用等真实品类拆分；不要把整笔都放进网购杂项。",
        "如果内容来自 CVS、Walgreens、Rite Aid 或其他 pharmacy，药品、处方、维生素、急救用品归入医疗健康；零食、饮料、纸巾等仍按真实用途分类。",
        "如果内容来自 Amazon、Target、Sephora、Nordstrom 等网购订单，请尽量按每个商品真实用途分类，不确定时再用网购杂项。",
        "订单邮件里可能有订单号、配送费、tip、折扣、税费、总价；总价、税费和折扣填到 transaction，商品行填到 items。配送费、服务费、tip 可以作为单独 item 保留。",
        payload.text ? `用户补充文字：\n${payload.text}` : "用户没有补充文字。",
        "金额用数字；不确定的字段给合理猜测，并在 warnings 中说明。"
      ].join("\n")
    }
  ];

  if (payload.imageDataUrl) {
    content.push({
      type: "input_image",
      image_url: payload.imageDataUrl
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      input: [
        {
          role: "user",
          content
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "receipt_parse",
          strict: true,
          schema: receiptSchema
        }
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${message}`);
  }

  const result = await response.json();
  const text = extractResponseText(result);
  const parsed = JSON.parse(text);
  return {
    ...parsed,
    provider: "openai",
    receipt: {
      id: `receipt_${Date.now()}`,
      fileName: payload.fileName || "uploaded-receipt",
      sourceType: payload.sourceType || parsed.transaction?.source || "receipt",
      sourcePlatform: normalizePlatform(payload.sourcePlatform),
      imageDataUrl: payload.imageDataUrl || "",
      createdAt: new Date().toISOString()
    },
    transaction: {
      id: `txn_${Date.now()}`,
      status: "pending",
      ...parsed.transaction,
      payer: payload.payer ? normalizePerson(payload.payer, people) : normalizePerson(parsed.transaction?.payer, people),
      tripName: String(payload.tripName || parsed.transaction?.tripName || "").trim(),
      storeAddress: String(parsed.transaction?.storeAddress || "").trim()
    },
    items: parsed.items.map((item, index) => {
      const nextItem = {
        id: `item_${Date.now()}_${index}`,
        ...item
      };
      nextItem.category = normalizeCategory(nextItem.category, {
        ...nextItem,
        merchant: parsed.transaction?.merchant
      });
      return nextItem;
    })
  };
}

async function handleApi(req, res) {
  const pathname = requestPath(req.url);

  if (pathname === "/api/auth/status" && req.method === "GET") {
    const auth = await readAuthConfig();
    return sendJson(res, 200, {
      configured: Boolean(auth),
      authenticated: Boolean(auth && await isAuthenticated(req))
    });
  }

  if (pathname === "/api/auth/setup" && req.method === "POST") {
    try {
      const existing = await readAuthConfig();
      if (existing) return sendJson(res, 409, { error: "Family password is already set." });
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const password = String(payload.password || "");
      if (password.length < 8) return sendJson(res, 400, { error: "Password must be at least 8 characters." });
      await writeAuthConfig(password);
      await createSession(res);
      return sendJson(res, 200, { configured: true, authenticated: true });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    try {
      const auth = await readAuthConfig();
      if (!auth) return sendJson(res, 400, { error: "Family password has not been set yet." });
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const ok = await verifyPassword(String(payload.password || ""), auth);
      if (!ok) return sendJson(res, 401, { error: "Password is incorrect." });
      await createSession(res);
      return sendJson(res, 200, { configured: true, authenticated: true });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    await clearSession(req, res);
    return sendJson(res, 200, { authenticated: false });
  }

  const auth = await readAuthConfig();
  if (!auth) {
    return sendJson(res, 403, { error: "Set the family password first." });
  }

  if (auth && !await isAuthenticated(req)) {
    return sendJson(res, 401, { error: "Enter the family password first." });
  }

  if (pathname === "/api/state" && req.method === "GET") {
    return sendJson(res, 200, await ensureStore());
  }

  if (pathname === "/api/state" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const store = JSON.parse(body || "{}");
      return sendJson(res, 200, await writeStore(store));
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (pathname === "/api/parse-receipt" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      let parsed = null;
      let aiError = "";
      try {
        parsed = await parseWithOpenAI(payload);
      } catch (error) {
        aiError = error.message;
      }
      if (!parsed) parsed = localParseReceipt(payload);
      if (aiError) parsed.warnings = [...(parsed.warnings || []), `真实 AI 调用失败，已切换到本地演示解析：${aiError}`];
      return sendJson(res, 200, parsed);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  return sendJson(res, 404, { error: "Not found" });
}

async function handleStatic(req, res) {
  const filePath = safeJoinStatic(req.url);
  if (!filePath) return sendText(res, 403, "Forbidden");
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return sendText(res, 404, "Not found");
    }
    return sendText(res, 500, error.message);
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      return await handleApi(req, res);
    }
    return await handleStatic(req, res);
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Meowney Book 没有启动：${HOST}:${PORT} 已经被占用。`);
    console.error(`如果你只是想打开账本，试试 http://127.0.0.1:${PORT}`);
    console.error("如果旧服务卡住了，先停止旧的 Meowney 进程，再重新运行 npm start。");
    process.exit(1);
  }

  if (error.code === "EACCES" || error.code === "EPERM") {
    console.error(`Meowney Book 没有启动：当前环境不允许监听 ${HOST}:${PORT}。`);
    console.error(`本地打开请用默认启动：npm start，然后访问 http://127.0.0.1:${PORT}`);
    process.exit(1);
  }

  console.error(`Meowney Book 启动失败：${error.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const localUrl = `http://127.0.0.1:${PORT}`;
  if (HOST === "0.0.0.0") {
    console.log(`Family Ledger AI is running at ${localUrl}`);
    console.log(`Network access is listening on port ${PORT}.`);
  } else {
    console.log(`Family Ledger AI is running at http://${HOST}:${PORT}`);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY is not set. Receipt parsing will use the local demo parser.");
  }
});
