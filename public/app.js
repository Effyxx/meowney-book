const defaultCategories = [
  "住房",
  "水电 Utilities",
  "食品杂货",
  "外食/咖啡",
  "旅行度假",
  "网购杂项",
  "衣服鞋包",
  "护肤美妆",
  "家居日用",
  "医疗健康",
  "订阅服务",
  "礼物社交",
  "电子数码",
  "其他"
];

const hiddenCandidateCategories = [
  "公共交通",
  "打车/租车",
  "停车过路",
  "车辆养护",
  "娱乐游戏",
  "运动健身",
  "宠物",
  "保险金融",
  "学习成长",
  "家政维修",
  "证件税费"
];

const categories = [...defaultCategories, ...hiddenCandidateCategories];

const defaultPeople = ["Me"];
let payerOptions = [...defaultPeople];

const quickExpenseTemplates = [
  "咖啡",
  "午饭",
  "外卖",
  "停车",
  "CVS 药",
  "理发",
  "bakery",
  "鲜花"
];

const categoryDefaults = {
  "住房": ["房租/居住", "必须"],
  "水电 Utilities": ["水电气", "必须"],
  "食品杂货": ["日常食品", "必须"],
  "外食/咖啡": ["餐饮", "可优化"],
  "公共交通": ["通勤/出行", "必须"],
  "打车/租车": ["临时出行", "可优化"],
  "停车过路": ["停车/过路", "必须"],
  "车辆养护": ["用车维护", "必须"],
  "旅行度假": ["旅行杂项", "可优化"],
  "网购杂项": ["待细分", "可优化"],
  "衣服鞋包": ["服饰", "可优化"],
  "护肤美妆": ["个人护理", "可优化"],
  "家居日用": ["日用/收纳", "可优化"],
  "医疗健康": ["药品/保健", "必须"],
  "订阅服务": ["软件/会员", "可优化"],
  "礼物社交": ["礼物/社交", "可优化"],
  "电子数码": ["配件", "可优化"],
  "娱乐游戏": ["娱乐", "可优化"],
  "运动健身": ["运动", "可优化"],
  "宠物": ["宠物", "必须"],
  "保险金融": ["保险/金融", "必须"],
  "学习成长": ["学习", "可优化"],
  "家政维修": ["家政/维修", "可优化"],
  "证件税费": ["证件/政府费用", "必须"],
  "其他": ["小额消费", "可优化"]
};

const personalCategorySet = new Set(["衣服鞋包", "护肤美妆", "医疗健康", "娱乐游戏", "运动健身", "学习成长"]);

const categoryInkVars = {
  "住房": "var(--cat-housing-ink)",
  "水电 Utilities": "var(--cat-utilities-ink)",
  "水电网络": "var(--cat-utilities-ink)",
  "水电网手机": "var(--cat-utilities-ink)",
  "手机话费": "var(--cat-subscription-ink)",
  "食品杂货": "var(--cat-grocery-ink)",
  "外食/咖啡": "var(--cat-eating-ink)",
  "外食咖啡": "var(--cat-eating-ink)",
  "公共交通": "var(--cat-public-transit-ink)",
  "打车/租车": "var(--cat-rideshare-ink)",
  "打车租车": "var(--cat-rideshare-ink)",
  "停车过路": "var(--cat-parking-ink)",
  "车辆养护": "var(--cat-vehicle-ink)",
  "旅行度假": "var(--cat-travel-ink)",
  "网购杂项": "var(--cat-shopping-ink)",
  "衣服鞋包": "var(--cat-fashion-ink)",
  "护肤美妆": "var(--cat-beauty-ink)",
  "家居日用": "var(--cat-home-ink)",
  "医疗健康": "var(--cat-health-ink)",
  "订阅服务": "var(--cat-subscription-ink)",
  "礼物社交": "var(--cat-gift-ink)",
  "鲜花": "var(--cat-gift-ink)",
  "电子数码": "var(--cat-digital-ink)",
  "娱乐游戏": "var(--cat-entertainment-ink)",
  "运动健身": "var(--cat-fitness-ink)",
  "宠物": "var(--cat-pet-ink)",
  "保险金融": "var(--cat-insurance-ink)",
  "学习成长": "var(--cat-learning-ink)",
  "家政维修": "var(--cat-house-service-ink)",
  "证件税费": "var(--cat-admin-fees-ink)",
  "其他": "var(--cat-other-ink)",
  "其余": "var(--cat-other-ink)"
};

function categoryInk(category) {
  return categoryInkVars[normalizeCategory(category)] || categoryInkVars[category] || "var(--cat-other-ink)";
}

const streamlineIcons = {
  dashboard: "/assets/streamline/dashboard-browser-gauge.png",
  layout: "/assets/streamline/dashboard-layout.png",
  add: "/assets/streamline/add-sign-bold.png",
  clipboard: "/assets/streamline/copy-paste-clipboard.png",
  checklist: "/assets/streamline/checklist.png",
  edit: "/assets/streamline/edit-pencil-2.png",
  editCompact: "/assets/streamline/edit-pencil-2.png",
  write: "/assets/streamline/edit-pen-write-paper.png",
  receipt: "/assets/streamline/form-edition-clipboard.png",
  receiptLine: "/assets/streamline/receipt-line.png",
  pending: "/assets/streamline/form-edition-clipboard-check.png",
  note: "/assets/streamline/form-edition-clipboard-write.png",
  file: "/assets/streamline/form-edition-file-attach.png",
  image: "/assets/streamline/form-edition-image-attach.png",
  calendar: "/assets/streamline/calendar-grid.png",
  date: "/assets/streamline/calendar-date.png",
  flash: "/assets/streamline/connect-flash.png",
  filter: "/assets/streamline/filter.png",
  home: "/assets/streamline/home.png",
  homeLiving: "/assets/streamline/advertising-brochure-house.png",
  groceryProduce: "/assets/streamline/farming-crop-carrot-star.png",
  grocery: "/assets/streamline/shop-cart.png",
  shirtPlain: "/assets/streamline/shirt-plain-1.png",
  coffee: "/assets/streamline/coffee-shop.png",
  restaurantDishes: "/assets/streamline/restaurant-dishes.png",
  gift: "/assets/streamline/gift.png",
  health: "/assets/streamline/health-services.png",
  beautyMakeup: "/assets/streamline/dating-lipstick-makeup.png",
  phonePlain: "/assets/streamline/phone-plain.png",
  subscriptionMedia: "/assets/streamline/folder-media.png",
  donationGift: "/assets/streamline/donation-charity-donate-gift.png",
  flowerFocusMacro: "/assets/streamline/focus-macro.png",
  carRetro: "/assets/streamline/car-retro-2.png",
  gameMushroom: "/assets/streamline/video-game-mario-mushroom-1.png",
  taxi: "/assets/streamline/navigation-taxi-pin-location.svg",
  travelGlobe: "/assets/streamline/travel-paper-plane-globe.png",
  landmarkLombard: "/assets/streamline/landmark-lombard-street-califronia-united-state-america.svg",
  shoppingBag: "/assets/streamline/e-commerce-cart-monitor-keyboard.png"
};

const navItems = [
  { id: "dashboard", label: "总览", icon: "dashboard" },
  { id: "text", label: "入账", icon: "write" },
  { id: "transactions", label: "流水", icon: "receiptLine" },
  { id: "recurring", label: "固定支出", icon: "homeLiving" },
  { id: "report", label: "月末报告", icon: "layout" }
];

const entryViewIds = new Set(["text", "capture", "import"]);

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

let store = null;
let currentView = "dashboard";
let selectedImageDataUrl = "";
let selectedFileName = "";
let selectedImportFileName = "";
let selectedImportImageDataUrl = "";
let currentParsed = null;
let authMode = "setup";
let budgetEditing = false;
let voiceRecognition = null;
let selectedDashboardNecessity = "";
let selectedTransactionId = "";
let syncEntryDoodlePosition = () => {};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatMoney(value) {
  return money.format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

const categoryIcons = {
  "住房": "homeLiving",
  "水电 Utilities": "homeLiving",
  "食品杂货": "groceryProduce",
  "外食/咖啡": "restaurantDishes",
  "外食咖啡": "restaurantDishes",
  "公共交通": "carRetro",
  "打车/租车": "carRetro",
  "打车租车": "carRetro",
  "停车过路": "carRetro",
  "车辆养护": "flash",
  "旅行度假": "travelGlobe",
  "网购杂项": "shoppingBag",
  "衣服鞋包": "shirtPlain",
  "护肤美妆": "beautyMakeup",
  "家居日用": "homeLiving",
  "医疗健康": "health",
  "手机话费": "phonePlain",
  "订阅服务": "subscriptionMedia",
  "礼物社交": "donationGift",
  "鲜花": "flowerFocusMacro",
  "电子数码": "flash",
  "娱乐游戏": "gameMushroom",
  "运动健身": "health",
  "宠物": "gift",
  "保险金融": "clipboard",
  "学习成长": "write",
  "家政维修": "homeLiving",
  "证件税费": "file",
  "其他": "receipt",
  "其余": "receipt"
};

function categoryIcon(category) {
  return categoryIcons[category] || categoryIcons[normalizeCategory(category)] || categoryIcons["其他"];
}

function looksLikeFlowerLabel(value) {
  return /(鲜花|花束|买花|flower|flowers|florist|bouquet)/i.test(String(value || ""));
}

function expenseIconCategory(item) {
  const label = [item?.name, item?.category, item?.subcategory]
    .filter(Boolean)
    .join(" ");
  if (looksLikeFlowerLabel(label)) return "鲜花";
  return item?.category || "其他";
}

function itemIcon(item) {
  return categoryIcon(expenseIconCategory(item));
}

function streamlineIcon(iconKey, className = "streamline-icon") {
  const src = streamlineIcons[iconKey] || streamlineIcons.receipt;
  return `<img class="${className}" src="${src}" width="24" height="24" alt="" aria-hidden="true" decoding="async">`;
}

function actionIconLabel(label, iconKey = "edit") {
  return streamlineIcon(iconKey, "button-label-icon");
}

function categoryBadgeTilt(category) {
  const chars = Array.from(String(category || "其他"));
  const score = chars.reduce((total, char) => total + char.codePointAt(0), 0);
  return [-3, -2, -1, 1, 2, 3][score % 6];
}

function merchantAvatar(name, category = "其他") {
  const label = `${normalizeCategory(category)}图标`;
  return `
    <span
      class="merchant-avatar category-avatar"
      style="--avatar-ink:${categoryInk(category)}; --badge-tilt:${categoryBadgeTilt(category)}deg"
      role="img"
      aria-label="${escapeAttr(label)}"
      title="${escapeAttr(label)}"
    >${streamlineIcon(categoryIcon(category), "streamline-icon category-icon")}</span>
  `;
}

function transactionAvatarCategory(transaction, items = transaction?.items || []) {
  const source = String(transaction?.source || "").toLowerCase();
  const scenario = String(transaction?.scenario || "");
  const phoneContext = [
    transaction?.merchant,
    transaction?.tripName,
    ...(items || []).flatMap((item) => [item.name, item.subcategory, item.category])
  ].filter(Boolean).join(" ");
  if (looksLikePhoneBillLabel(phoneContext)) return "手机话费";
  if (looksLikeFlowerLabel(phoneContext)) return "鲜花";
  if (source === "ecommerce" || scenario === "网购") return "网购杂项";
  if (source === "grocery") return "食品杂货";
  if (source === "travel" || scenario === "旅行") return "旅行度假";
  return topGroups(items || [], (item) => item.category)[0]?.[0] || "其他";
}

function transactionDisplayName(transaction, items = transaction?.items || []) {
  const merchant = String(transaction?.merchant || "").trim();
  if (merchant) return merchant;
  const tripName = String(transaction?.tripName || "").trim();
  if (tripName) return tripName;
  const firstItem = (items || []).find((item) => String(item?.name || "").trim());
  return String(firstItem?.name || "").trim() || "未命名";
}

function transactionTripMetaPart(transaction, displayName) {
  const tripName = String(transaction?.tripName || "").trim();
  return tripName && tripName !== displayName ? tripName : "";
}

function looksLikePhoneBillLabel(value) {
  return /(手机话费|手机费|话费|手机套餐|phone bill|mobile bill|cell bill|wireless bill|verizon|t-mobile|at&t)/i.test(String(value || ""));
}

function recurringAvatarCategory(item) {
  const category = item?.category || "其他";
  const label = `${item?.name || ""} ${category}`.toLowerCase();
  if (looksLikePhoneBillLabel(label)) return "手机话费";
  if (categoryIcon(category) === "homeLiving") return category;
  if (/(房租|rent|水电|电费|水费|燃气|煤气|天然气|utilities|utility|electric|water|gas|网络|网费|wifi|internet|home internet)/i.test(label)) {
    return "住房";
  }
  return category;
}

function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function monthFromDate(date) {
  return String(date || "").slice(0, 7);
}

function itemAmount(item) {
  return Number(item.amount || 0);
}

function setStatus(text) {
  $("#saveStatus").textContent = text;
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

function peopleFromStore(targetStore = store) {
  const people = uniquePeople(targetStore?.people);
  return people.length ? people : [...defaultPeople];
}

function syncPayerOptions(targetStore = store) {
  const people = peopleFromStore(targetStore);
  payerOptions = people.length > 1 ? ["共同", ...people] : [...people];
  return payerOptions;
}

function isSinglePersonLedger(targetStore = store) {
  return peopleFromStore(targetStore).length <= 1;
}

function defaultPayer(targetStore = store) {
  const people = peopleFromStore(targetStore);
  return people.length <= 1 ? people[0] : "共同";
}

function normalizePerson(value, targetStore = store) {
  const people = peopleFromStore(targetStore);
  const trimmed = String(value || "").trim();
  if (trimmed === "我") return people[0] || defaultPeople[0];
  if (trimmed === "对方") return people[1] || people[0] || defaultPeople[0];
  if (!trimmed) return defaultPayer(targetStore);
  if (people.length <= 1) return people[0] || defaultPeople[0];
  if (trimmed === "共同") return "共同";
  if (people.some((person) => person === trimmed)) return trimmed;
  return trimmed;
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

function normalizeStoreParticipants(targetStore) {
  let changed = false;
  const assign = (object, field) => {
    if (!object || !(field in object)) return;
    const normalized = normalizePerson(object[field], targetStore);
    if (normalized !== object[field]) {
      object[field] = normalized;
      changed = true;
    }
  };

  const people = peopleFromStore(targetStore);
  if (JSON.stringify(targetStore.people || []) !== JSON.stringify(people)) {
    targetStore.people = people;
    changed = true;
  }
  syncPayerOptions(targetStore);
  (targetStore.transactions || []).forEach((transaction) => {
    assign(transaction, "payer");
    (transaction.items || []).forEach((item) => assign(item, "owner"));
  });
  (targetStore.pendingReceipts || []).forEach((receipt) => {
    assign(receipt.transaction, "payer");
    (receipt.items || []).forEach((item) => assign(item, "owner"));
  });
  (targetStore.recurring || []).forEach((item) => assign(item, "payer"));
  return changed;
}

function normalizeStoreCategories(targetStore) {
  let changed = false;
  const assign = (object, context = {}) => {
    if (!object || !("category" in object)) return;
    const normalized = normalizeCategory(object.category, { ...context, ...object });
    if (normalized !== object.category) {
      object.category = normalized;
      changed = true;
    }
  };

  (targetStore.transactions || []).forEach((transaction) => {
    (transaction.items || []).forEach((item) => assign(item, { merchant: transaction.merchant }));
  });
  (targetStore.pendingReceipts || []).forEach((receipt) => {
    (receipt.items || []).forEach((item) => assign(item, { merchant: receipt.transaction?.merchant }));
  });
  (targetStore.recurring || []).forEach((item) => assign(item));
  return changed;
}

function normalizeStoreTextScenarios(targetStore) {
  let changed = false;
  (targetStore.transactions || []).forEach((transaction) => {
    if (transaction?.source !== "text" || transaction.scenario !== "网购") return;
    const text = [
      transaction.merchant,
      transaction.tripName,
      ...(transaction.items || []).map((item) => item.name)
    ].filter(Boolean).join(" ");
    const shouldReclassifyRetailText = hasInPersonRetailCue(text) && !hasOnlineShoppingCue(text);
    if (shouldReclassifyRetailText) {
      (transaction.items || []).forEach((item) => {
        const currentCategory = normalizeCategory(item.category || "其他", {
          merchant: transaction.merchant,
          name: item.name
        });
        if (currentCategory !== "网购杂项") return;
        const next = classifyTextExpense([item.name, transaction.merchant].filter(Boolean).join(" "));
        const nextCategory = normalizeCategory(next.category, {
          merchant: transaction.merchant,
          name: item.name
        });
        if (nextCategory === "网购杂项" || nextCategory === "其他") return;
        item.category = nextCategory;
        item.subcategory = next.subcategory || categoryDefault(nextCategory).subcategory;
        item.necessity = next.necessity || categoryDefault(nextCategory).necessity;
        changed = true;
      });
    }
    const firstCategory = normalizeCategory(transaction.items?.[0]?.category || "其他", {
      merchant: transaction.merchant,
      name: transaction.items?.[0]?.name
    });
    const nextScenario = inferScenario(firstCategory, text);
    if (nextScenario !== transaction.scenario) {
      transaction.scenario = nextScenario;
      changed = true;
    }
  });
  return changed;
}

function normalizeStoreSettings(targetStore) {
  let changed = false;
  if (!targetStore.settings || typeof targetStore.settings !== "object") {
    targetStore.settings = {};
    changed = true;
  }
  if (!Array.isArray(targetStore.settings.learnedRules)) {
    targetStore.settings.learnedRules = [];
    changed = true;
  }
  return changed;
}

function usedCategories() {
  if (!store) return new Set();
  const used = new Set();
  const add = (category, context = {}) => used.add(normalizeCategory(category, context));
  (store.transactions || []).forEach((transaction) => {
    (transaction.items || []).forEach((item) => add(item.category, { ...item, merchant: transaction.merchant }));
  });
  (store.pendingReceipts || []).forEach((receipt) => {
    (receipt.items || []).forEach((item) => add(item.category, { ...item, merchant: receipt.transaction?.merchant }));
  });
  (store.recurring || []).forEach((item) => add(item.category, item));
  return used;
}

function visibleCategories(selected) {
  const visible = new Set(defaultCategories);
  usedCategories().forEach((category) => visible.add(category));
  if (selected) visible.add(normalizeCategory(selected));
  return categories.filter((category) => visible.has(category));
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers
  });
  const text = await response.text();
  const payload = text ? tryParseJson(text) : null;
  if (!response.ok) {
    const error = new Error(payload?.error || text || "REQUEST FAILED");
    error.status = response.status;
    throw error;
  }
  return payload;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function showAuthScreen(status, message = "") {
  authMode = status?.configured ? "login" : "setup";
  $("#startScreen")?.classList.add("hidden");
  $("#appShell").classList.add("hidden");
  $("#authScreen").classList.remove("hidden");
  $("#authSubtitle").textContent = "";
  $("#authLabel").textContent = "PASSWORD";
  $("#authSubmitButton").textContent = "OPEN BOOK";
  const usernameInput = $("#authUsername");
  if (usernameInput && !usernameInput.value) {
    usernameInput.value = localStorage.getItem("meowney-login-name") || "";
  }
  $("#authPassword").autocomplete = authMode === "setup" ? "new-password" : "current-password";
  $("#authPassword").value = "";
  $("#authConfirmGroup").classList.add("hidden");
  $("#authPasswordConfirm").required = false;
  $("#authPasswordConfirm").value = "";
  $("#authMessage").textContent = message;
  (usernameInput && !usernameInput.value ? usernameInput : $("#authPassword")).focus();
}

function showAppShell() {
  $("#startScreen")?.classList.add("hidden");
  $("#authScreen").classList.add("hidden");
  $("#appShell").classList.remove("hidden");
}

function showStartScreen() {
  $("#startScreen")?.classList.remove("hidden");
  $("#authScreen").classList.add("hidden");
  $("#appShell").classList.add("hidden");
}

async function checkAuth() {
  try {
    const status = await api("/api/auth/status");
    if (status.authenticated) {
      showAppShell();
      return true;
    }
    showAuthScreen(status);
    return false;
  } catch (error) {
    showAuthScreen({ configured: true }, "LOCAL SERVER IS NOT REPLYING. MAKE SURE NPM START IS STILL RUNNING.");
    return false;
  }
}

async function openBookFromStart() {
  const button = $("#startOpenButton");
  if (button) button.disabled = true;
  const authenticated = await checkAuth();
  if (authenticated) {
    await loadStore();
    switchView("dashboard");
  }
  if (button) button.disabled = false;
}

async function enterAfterAuth() {
  localStorage.removeItem("family-ledger-store");
  showAppShell();
  await loadStore();
  switchView(currentView || "dashboard");
}

async function submitAuth(event) {
  event.preventDefault();
  const username = $("#authUsername")?.value.trim() || "";
  const password = $("#authPassword").value;
  const passwordConfirm = $("#authPasswordConfirm").value;
  if ($("#authPasswordConfirm").required && password !== passwordConfirm) {
    $("#authMessage").textContent = "PASSWORDS DO NOT MATCH.";
    $("#authPasswordConfirm").focus();
    return;
  }
  $("#authSubmitButton").disabled = true;
  $("#authMessage").textContent = "";
  try {
    if (username) localStorage.setItem("meowney-login-name", username);
    await api(authMode === "setup" ? "/api/auth/setup" : "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    await enterAfterAuth();
  } catch (error) {
    $("#authMessage").textContent = error.message;
  } finally {
    $("#authSubmitButton").disabled = false;
  }
}

async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // The local session can still be cleared visually if the request fails.
  }
  store = null;
  showAuthScreen({ configured: true }, "SIGNED OUT.");
}

async function handleAuthError(error) {
  if (error.status === 401 || error.status === 403) {
    const status = await api("/api/auth/status").catch(() => ({ configured: true }));
    showAuthScreen(status, error.message);
    return true;
  }
  return false;
}

async function apiWithAuth(path, options = {}) {
  try {
    return await api(path, options);
  } catch (error) {
    if (await handleAuthError(error)) return null;
    throw error;
  }
}

async function loadStore() {
  try {
    store = await apiWithAuth("/api/state");
    if (!store) return;
    const participantsChanged = normalizeStoreParticipants(store);
    const categoriesChanged = normalizeStoreCategories(store);
    const scenariosChanged = normalizeStoreTextScenarios(store);
    const settingsChanged = normalizeStoreSettings(store);
    if (participantsChanged || categoriesChanged || scenariosChanged || settingsChanged) {
      const next = await apiWithAuth("/api/state", {
        method: "POST",
        body: JSON.stringify(store)
      });
      if (next) store = next;
    }
    localStorage.removeItem("family-ledger-store");
    setStatus("已连接受保护账本");
  } catch (error) {
    setStatus("加载失败");
    alert(`加载账本失败：${error.message}`);
  }
}

async function saveStore() {
  store.updatedAt = new Date().toISOString();
  try {
    const next = await apiWithAuth("/api/state", {
      method: "POST",
      body: JSON.stringify(store)
    });
    if (!next) return;
    store = next;
    setStatus("已保存");
  } catch (error) {
    setStatus("保存失败");
    alert(`保存失败：${error.message}`);
  }
  render();
}

function buildNav() {
  const nav = $("#nav");
  nav.innerHTML = "";
  navItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.view = item.id;
    button.innerHTML = `<span class="nav-icon">${streamlineIcon(item.icon, "streamline-icon nav-streamline-icon")}</span><span>${item.label}</span>`;
    button.addEventListener("click", () => switchView(item.id));
    nav.appendChild(button);
  });
}

function bindAutoHidingNav() {
  const nav = $("#nav");
  if (!nav) return;
  let lastScrollY = window.scrollY;
  let ticking = false;

  const revealNav = () => {
    nav.classList.remove("nav-collapsed");
  };

  const updateNav = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    if (Math.abs(delta) >= 8) {
      if (delta > 0 && currentScrollY > 90) nav.classList.add("nav-collapsed");
      else nav.classList.remove("nav-collapsed");
      lastScrollY = currentScrollY;
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNav);
  }, { passive: true });
  window.addEventListener("resize", revealNav);
  nav.addEventListener("pointerdown", revealNav);
}

function navViewId(viewId) {
  return entryViewIds.has(viewId) ? "text" : viewId;
}

function viewLabel(viewId) {
  if (entryViewIds.has(viewId)) return "入账";
  return navItems.find((item) => item.id === viewId)?.label || "总览";
}

function updateEntryModeTabs() {
  $$("[data-entry-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.entryView === currentView);
  });
}

function switchView(viewId) {
  if (!$(`#view-${viewId}`)) return;
  currentView = viewId;
  $$(".view").forEach((view) => view.classList.remove("active"));
  $(`#view-${viewId}`).classList.add("active");
  const activeNav = navViewId(viewId);
  $$(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeNav);
  });
  const pageTitle = $("#pageTitle");
  const pageHeadingRow = pageTitle?.closest(".page-heading-row");
  const isEntryView = entryViewIds.has(viewId);
  const isTransactionsView = viewId === "transactions";
  const titlelessViews = ["dashboard", "transactions", "recurring", "report"];
  pageTitle.textContent = viewLabel(viewId);
  pageTitle.classList.toggle("visually-hidden-title", isEntryView || titlelessViews.includes(viewId));
  pageHeadingRow?.classList.toggle("is-dashboard", viewId === "dashboard");
  pageHeadingRow?.classList.toggle("is-transactions", isTransactionsView);
  pageHeadingRow?.classList.toggle("is-recurring", viewId === "recurring");
  pageHeadingRow?.classList.toggle("is-report", viewId === "report");
  $("#entryHeadingDoodle")?.classList.toggle("hidden", !entryViewIds.has(viewId));
  $("#overviewHeadingDoodle")?.classList.toggle("hidden", viewId !== "dashboard");
  $("#transactionsHeadingDoodle")?.classList.toggle("hidden", viewId !== "transactions");
  $("#fixedHeadingDoodle")?.classList.toggle("hidden", viewId !== "recurring");
  $("#reportHeadingDoodle")?.classList.toggle("hidden", viewId !== "report");
  updateEntryModeTabs();
  $("#nav")?.classList.remove("nav-collapsed");
  if (viewId === "text") requestAnimationFrame(syncEntryDoodlePosition);
  render();
}

function allConfirmedTransactions() {
  return store.transactions.filter((transaction) => transaction.status === "confirmed");
}

function currentMonthTransactions() {
  const key = currentMonthKey();
  return allConfirmedTransactions().filter((transaction) => transaction.date?.startsWith(key));
}

function recurringAsMonthlyTransactions() {
  return store.recurring
    .filter((item) => item.active)
    .map((item) => ({
      id: item.id,
      date: `${currentMonthKey()}-${String(item.dueDay || 1).padStart(2, "0")}`,
      merchant: item.name,
      scenario: "固定账单",
      recurring: true,
      total: Number(item.amount || 0),
      items: [
        {
          id: `${item.id}_monthly`,
          name: item.name,
          amount: Number(item.amount || 0),
          category: item.category,
          subcategory: "固定支出",
          necessity: item.necessity,
          owner: inferOwnerForExpense(item.category, item.payer, item.name),
          recurring: true
        }
      ]
    }));
}

function analysisItems() {
  return itemsForMonth(currentMonthKey());
}

function isRecurringFixedExpense(item) {
  return Boolean(item?.recurring) || (item?.scenario === "固定账单" && item?.subcategory === "固定支出");
}

function sum(items, selector = (item) => item.amount) {
  return items.reduce((total, item) => total + Number(selector(item) || 0), 0);
}

function groupedBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item) || "其他";
    acc[key] = (acc[key] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
}

function topGroups(items, keyFn) {
  return Object.entries(groupedBy(items, keyFn))
    .sort((a, b) => b[1] - a[1]);
}

function normalizedRuleKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryDefault(category) {
  const normalized = normalizeCategory(category);
  const [subcategory, necessity] = categoryDefaults[normalized] || categoryDefaults["其他"];
  return { category: normalized, subcategory, necessity };
}

function learnedClassification(text) {
  const key = normalizedRuleKey(text);
  if (!key || !store?.settings?.learnedRules?.length) return null;
  const rules = store.settings.learnedRules;
  const match = rules.find((rule) => {
    const ruleKey = normalizedRuleKey(rule.keyword);
    if (!ruleKey) return false;
    return key === ruleKey || (ruleKey.length >= 2 && (key.includes(ruleKey) || ruleKey.includes(key)));
  });
  if (!match) return null;
  const fallback = categoryDefault(match.category);
  return {
    category: normalizeCategory(match.category),
    subcategory: match.subcategory || fallback.subcategory,
    necessity: match.necessity || fallback.necessity,
    owner: match.owner ? normalizePerson(match.owner) : ""
  };
}

function rememberLearnedRule(keyword, classification) {
  const key = normalizedRuleKey(keyword);
  if (!store || !key || !classification?.category) return;
  normalizeStoreSettings(store);
  const fallback = categoryDefault(classification.category);
  const nextRule = {
    keyword: key,
    category: normalizeCategory(classification.category),
    subcategory: classification.subcategory || fallback.subcategory,
    necessity: classification.necessity || fallback.necessity,
    owner: classification.owner ? normalizePerson(classification.owner) : "",
    updatedAt: new Date().toISOString()
  };
  const rules = store.settings.learnedRules;
  const index = rules.findIndex((rule) => normalizedRuleKey(rule.keyword) === key);
  if (index >= 0) rules[index] = { ...rules[index], ...nextRule };
  else rules.unshift(nextRule);
  store.settings.learnedRules = rules.slice(0, 80);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const textMerchantAliases = [
  ["amazon fresh", "Amazon Fresh"],
  ["whole foods", "Whole Foods"],
  ["trader joe's", "Trader Joe's"],
  ["trader joe", "Trader Joe's"],
  ["h mart", "H Mart"],
  ["rite aid", "Rite Aid"],
  ["blue bottle", "Blue Bottle"],
  ["uber eats", "Uber Eats"],
  ["home depot", "Home Depot"],
  ["costco", "Costco"],
  ["target", "Target"],
  ["qfc", "QFC"],
  ["safeway", "Safeway"],
  ["uwajimaya", "Uwajimaya"],
  ["cvs", "CVS"],
  ["walgreens", "Walgreens"],
  ["starbucks", "Starbucks"],
  ["amazon", "Amazon"],
  ["sephora", "Sephora"],
  ["ulta", "Ulta"],
  ["nordstrom", "Nordstrom"],
  ["uniqlo", "Uniqlo"],
  ["zara", "Zara"],
  ["aritzia", "Aritzia"],
  ["ikea", "IKEA"],
  ["lowes", "Lowe's"]
].sort((a, b) => b[0].length - a[0].length);

function splitLeadingTextMerchant(text) {
  const value = String(text || "").trim();
  for (const [alias, merchant] of textMerchantAliases) {
    const pattern = new RegExp(`^${escapeRegExp(alias)}(?:\\s+|(?=[\\u4e00-\\u9fff]))(.+)$`, "i");
    const match = value.match(pattern);
    if (match?.[1]?.trim()) {
      return { merchant, itemName: match[1].trim() };
    }
  }
  return { merchant: "", itemName: value };
}

function merchantDefaultClassification(text) {
  const value = String(text || "").toLowerCase();
  const merchantRules = [
    [["costco", "whole foods", "amazon fresh", "trader joe", "qfc", "safeway", "h mart", "uwajimaya"], ["食品杂货", "日常食品", "必须"]],
    [["cvs", "walgreens", "rite aid", "pharmacy"], ["医疗健康", "药品/保健", "必须"]],
    [["sephora", "ulta"], ["护肤美妆", "个人护理", "可优化"]],
    [["nordstrom", "uniqlo", "zara", "aritzia"], ["衣服鞋包", "服饰", "可优化"]],
    [["steam", "nintendo", "playstation", "xbox"], ["娱乐游戏", "游戏", "可优化"]],
    [["starbucks", "blue bottle"], ["外食/咖啡", "饮品", "可优化"]],
    [["uber eats", "doordash"], ["外食/咖啡", "外卖", "可优化"]],
    [["amazon.com", "target.com", "etsy", "ebay", "amazon"], ["网购杂项", "待细分", "可优化"]]
  ];
  for (const [needles, result] of merchantRules) {
    if (needles.some((needle) => value.includes(needle))) {
      return { category: result[0], subcategory: result[1], necessity: result[2] };
    }
  }
  return null;
}

function classifyTextExpense(text) {
  const value = String(text || "").toLowerCase();
  const learned = learnedClassification(value);
  if (learned) return learned;
  const rules = [
    [["咖啡豆", "咖啡粉", "挂耳咖啡", "速溶咖啡", "冷萃咖啡包", "coffee beans", "ground coffee", "instant coffee"], ["食品杂货", "咖啡豆/饮品", "必须"]],
    [["奶茶", "咖啡", "星巴克", "coffee", "tea", "drink"], ["外食/咖啡", "饮品", "可优化"]],
    [["bakery", "pastry", "croissant", "bread", "cake", "dessert", "面包", "可颂", "蛋糕", "甜点", "甜品", "烘焙"], ["外食/咖啡", "甜点/面包", "可优化"]],
    [["午饭", "晚饭", "早饭", "外卖", "餐", "饭", "restaurant", "lunch", "dinner"], ["外食/咖啡", "餐饮", "可优化"]],
    [["公交", "公车", "地铁", "轻轨", "orca", "link", "metro", "sounder", "streetcar", "ferry", "water taxi"], ["公共交通", "通勤/出行", "必须"]],
    [["uber", "lyft", "taxi", "出租", "打车", "租车", "zipcar", "turo", "car rental"], ["打车/租车", "临时出行", "可优化"]],
    [["停车", "parking", "toll", "good to go", "520", "过桥", "过路", "罚单"], ["停车过路", "停车/过路", "必须"]],
    [["油", "加油", "gas", "车险", "汽车保险", "保养", "修车", "汽车维修", "洗车", "轮胎", "tabs", "车牌", "驾照", "driver license"], ["车辆养护", "用车维护", "必须"]],
    [["水果", "苹果", "香蕉", "橙子", "草莓", "蓝莓", "蔬菜", "肉", "牛奶", "鸡蛋", "买菜", "菜钱", "超市", "grocery", "apple", "apples", "banana", "bananas", "orange", "oranges", "strawberry", "strawberries", "blueberry", "blueberries"], ["食品杂货", "日常食品", "必须"]],
    [["cvs", "walgreens", "rite aid", "pharmacy", "prescription", "rx", "medicine", "medication", "drug", "pain reliever", "ibuprofen", "acetaminophen", "tylenol", "advil", "allergy", "benadryl", "zyrtec", "claritin", "cold medicine", "cough", "vitamin", "supplement", "first aid", "bandage", "药", "药房", "处方", "处方药", "非处方药", "感冒药", "止痛药", "布洛芬", "退烧", "过敏药", "维生素", "保健品", "创可贴", "绷带", "急救"], ["医疗健康", "药品/保健", "必须"]],
    [["洗衣液", "洗衣粉", "洗衣凝珠", "laundry detergent", "laundry pods", "detergent", "storage", "organizer", "bins", "container", "hanger", "bedding", "towel", "洗衣", "纸巾", "清洁", "收纳", "储物", "衣架", "床品", "毛巾", "家居"], ["家居日用", "日用/收纳", "可优化"]],
    [["理发", "剪发", "发型", "美发", "haircut", "barber", "hair salon", "护肤", "防晒", "面膜", "精华", "口红", "唇膏", "唇釉", "粉底", "眼影", "腮红", "睫毛膏", "眼线", "眉笔", "散粉", "香水", "化妆品", "彩妆", "skincare", "makeup", "cosmetic", "lipstick", "lip gloss", "foundation", "mascara", "eyeliner", "blush", "perfume"], ["护肤美妆", "个人护理", "可优化"]],
    [["usb", "cable", "charger", "adapter", "phone case", "keyboard", "mouse", "headphone", "earbuds", "数据线", "充电器", "转接头", "手机壳", "键盘", "鼠标", "耳机"], ["电子数码", "配件", "可优化"]],
    [["衣服", "上衣", "裤", "裙", "外套", "鞋", "包", "shirt", "shoe", "bag"], ["衣服鞋包", "服饰", "可优化"]],
    [["清洁服务", "保洁", "地毯清洗", "carpet cleaning", "维修", "安装", "搬家", "mover", "dry cleaning", "干洗"], ["家政维修", "家政/维修", "可优化"]],
    [["鲜花", "花束", "买花", "flower", "flowers", "florist", "bouquet"], ["家居日用", "鲜花", "可优化"]],
    [["机票", "飞机票", "航班", "airfare", "flight ticket", "flight", "airline", "delta", "alaska airlines", "united airlines", "american airlines", "southwest"], ["旅行度假", "机票/交通", "可优化"]],
    [["门票", "酒店", "旅行", "纪念品"], ["旅行度假", "旅行杂项", "可优化"]],
    [["电影", "演唱会", "展览", "博物馆", "游戏", "steam", "switch", "playstation", "xbox", "dlc", "桌游", "密室"], ["娱乐游戏", "娱乐", "可优化"]],
    [["健身", "瑜伽", "游泳", "攀岩", "滑雪", "球场", "gym", "fitness", "yoga", "pool", "climbing"], ["运动健身", "运动", "可优化"]],
    [["宠物", "猫粮", "狗粮", "猫砂", "兽医", "vet", "grooming", "pet insurance", "pet license"], ["宠物", "宠物", "必须"]],
    [["租客保险", "车险", "人寿", "伞险", "信用卡年费", "银行手续费", "报税", "tax software", "accountant"], ["保险金融", "保险/金融", "必须"]],
    [["课程", "证书", "考试", "书", "kindle", "workshop", "class", "course", "book"], ["学习成长", "学习", "可优化"]],
    [["护照", "签证", "移民", "公证", "政府", "证件", "passport", "visa", "uscis", "notary"], ["证件税费", "证件/政府费用", "必须"]],
    [["手机话费", "手机费", "话费", "手机套餐", "phone bill", "mobile bill", "cell bill", "wireless bill", "verizon", "t-mobile", "at&t", "家庭网络", "网费", "网络", "internet", "wifi", "home internet", "internet bill", "wifi bill", "comcast", "xfinity", "ziply", "spectrum", "centurylink", "frontier"], ["订阅服务", "通信/网络", "必须"]],
    [["订阅", "chatgpt", "claude", "netflix", "spotify"], ["订阅服务", "软件/会员", "可优化"]],
    [["水电", "电费", "水费", "燃气", "煤气", "天然气", "垃圾费", "污水", "下水道", "utility", "utilities", "electric", "electricity", "water bill", "sewer", "trash", "garbage", "waste"], ["水电 Utilities", "水电气", "必须"]]
  ];
  for (const [needles, result] of rules) {
    if (needles.some((needle) => value.includes(needle))) {
      return { category: result[0], subcategory: result[1], necessity: result[2] };
    }
  }
  const merchantDefault = merchantDefaultClassification(value);
  if (merchantDefault) return merchantDefault;
  return { category: "其他", subcategory: "小额消费", necessity: "可优化" };
}

function inferPayerFromText(text) {
  const value = normalizedRuleKey(text);
  const people = peopleFromStore();
  if (people.length <= 1) return people[0] || defaultPayer();
  const matched = people.find((person) => value.includes(normalizedRuleKey(person)));
  if (matched) return matched;
  return "";
}

function stripPayerFromExpenseName(name) {
  let value = String(name || "").trim();
  peopleFromStore()
    .slice()
    .sort((a, b) => b.length - a.length)
    .forEach((person) => {
      const escaped = escapeRegExp(person);
      value = value
        .replace(new RegExp(`^${escaped}\\s*的?\\s*`, "i"), "")
        .replace(new RegExp(`\\s*的?\\s*${escaped}$`, "i"), "")
        .trim();
    });
  return value;
}

function parseTextExpense(raw) {
  const text = String(raw || "").trim();
  const amountMatch = text.match(/(?:\$|¥|￥)?\s*(\d+(?:\.\d{1,2})?)\s*(?:块|元|刀|美元|usd|rmb)?\s*$/i);
  const amount = amountMatch ? Number(amountMatch[1]) : 0;
  const name = amountMatch ? text.slice(0, amountMatch.index).trim() : text;
  const cleanName = stripPayerFromExpenseName(name || text || "小额消费") || name || text || "小额消费";
  const merchantParts = splitLeadingTextMerchant(cleanName);
  const itemName = merchantParts.itemName || cleanName;
  return {
    name: itemName,
    merchant: merchantParts.merchant,
    amount,
    payer: inferPayerFromText(text),
    ...classifyTextExpense(itemName)
  };
}

function hasOnlineShoppingCue(text) {
  const value = String(text || "").toLowerCase();
  if (/(^|[^a-z])amazon(?!\s+fresh)([^a-z]|$)/i.test(value)) return true;
  return [
    "网购",
    "网上",
    "线上",
    "订单",
    "快递",
    "配送",
    "online",
    "order",
    "shipping",
    "delivery",
    "amazon.com",
    "target.com",
    "etsy",
    "ebay"
  ].some((keyword) => value.includes(keyword));
}

function hasInPersonRetailCue(text) {
  const value = String(text || "").toLowerCase();
  return [
    "target",
    "costco",
    "whole foods",
    "trader joe",
    "qfc",
    "safeway",
    "h mart",
    "uwajimaya",
    "cvs",
    "walgreens",
    "rite aid"
  ].some((keyword) => value.includes(keyword));
}

function inferScenario(category, text = "") {
  const normalizedCategory = normalizeCategory(category, { name: text, merchant: text });
  if (normalizedCategory === "旅行度假") return "旅行";
  if (hasOnlineShoppingCue(text)) return "网购";
  if (normalizedCategory === "网购杂项" && !hasInPersonRetailCue(text)) return "网购";
  return "日常";
}

function inferOwnerForExpense(category, payer, name = "") {
  const normalizedPayer = normalizePerson(payer);
  const people = peopleFromStore();
  if (!people.includes(normalizedPayer)) return defaultPayer();
  const classification = learnedClassification(name);
  if (classification?.owner) return normalizePerson(classification.owner);
  return personalCategorySet.has(normalizeCategory(category)) ? normalizedPayer : defaultPayer();
}

function applyClientRulesToParsed(parsed) {
  const payer = normalizePerson(parsed?.transaction?.payer || "共同");
  (parsed.items || []).forEach((item) => {
    const learned = learnedClassification(item.name);
    if (learned) {
      item.category = learned.category;
      item.subcategory = learned.subcategory;
      item.necessity = learned.necessity;
      if (learned.owner) item.owner = learned.owner;
    }
    item.category = normalizeCategory(item.category, item);
    if (!item.subcategory) item.subcategory = categoryDefault(item.category).subcategory;
    if (!item.necessity) item.necessity = categoryDefault(item.category).necessity;
    if (!item.owner || item.owner === "共同") item.owner = inferOwnerForExpense(item.category, payer, item.name);
  });
  return parsed;
}

function transactionItemSum(transaction) {
  return sum(transaction.items || []);
}

function transactionAdjustmentItem(transaction) {
  const total = Number(transaction.total || 0);
  const itemTotal = transactionItemSum(transaction);
  const diff = Number((total - itemTotal).toFixed(2));
  if (Math.abs(diff) < 0.01) return null;
  return {
    id: `${transactionStableId(transaction)}_adjustment`,
    name: diff > 0 ? "未分配金额" : "折扣/差额",
    quantity: "",
    amount: diff,
    category: "其他",
    subcategory: "税费/差额",
    necessity: diff > 0 ? "可优化" : "必须",
    owner: "共同",
    confidence: 1,
    adjustment: true
  };
}

function transactionItemsWithAdjustment(transaction) {
  const items = (transaction.items || []).map((item) => ({ ...item }));
  const adjustment = transactionAdjustmentItem(transaction);
  return adjustment ? [...items, adjustment] : items;
}

function allTransactionItems() {
  return allConfirmedTransactions().flatMap((transaction) =>
    transactionItemsWithAdjustment(transaction).map((item) => ({
      ...item,
      transactionId: transaction.id,
      merchant: transaction.merchant,
      scenario: transaction.scenario,
      payer: normalizePerson(transaction.payer || "共同"),
      tripName: transaction.tripName || "",
      date: transaction.date
    }))
  );
}

function recurringItemsForMonth(month) {
  return store.recurring
    .filter((item) => item.active)
    .map((item) => ({
      id: `${item.id}_${month}`,
      name: item.name,
      amount: Number(item.amount || 0),
      category: item.category,
      subcategory: "固定支出",
      necessity: item.necessity,
      owner: inferOwnerForExpense(item.category, item.payer, item.name),
      merchant: item.name,
      scenario: "固定账单",
      payer: normalizePerson(item.payer || "共同"),
      recurring: true,
      date: `${month}-${String(item.dueDay || 1).padStart(2, "0")}`
    }));
}

function itemsForMonth(month) {
  const transactionItems = allTransactionItems().filter((item) => monthFromDate(item.date) === month);
  if (month === currentMonthKey()) return [...transactionItems, ...recurringItemsForMonth(month)];
  return transactionItems;
}

function monthTotals() {
  const totals = {};
  allTransactionItems().forEach((item) => {
    const month = monthFromDate(item.date);
    if (!month) return;
    totals[month] = (totals[month] || 0) + itemAmount(item);
  });
  const current = currentMonthKey();
  totals[current] = sum(itemsForMonth(current));
  return totals;
}

function previousMonthAverage() {
  const current = currentMonthKey();
  const values = Object.entries(monthTotals())
    .filter(([month]) => month && month !== current)
    .map(([, amount]) => amount)
    .filter((amount) => amount > 0);
  const average = values.length ? values.reduce((total, amount) => total + amount, 0) / values.length : 0;
  return { average, count: values.length };
}

function weekIndexInMonth(date) {
  const day = Number(String(date || "").slice(8, 10));
  if (!Number.isFinite(day) || day <= 0) return 1;
  return Math.min(5, Math.ceil(day / 7));
}

function isMonthEndEvening(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return tomorrow.getDate() === 1 && date.getHours() >= 20;
}

function renderBudgetControl(budget) {
  const budgetForm = $("#budgetForm");
  const budgetDisplay = $("#budgetEditButton");
  const budgetDisplayText = $("#budgetDisplayText");
  const budgetInput = $("#monthlyBudgetInput");
  if (!budgetForm || !budgetDisplay || !budgetDisplayText || !budgetInput) return;

  budgetForm.classList.toggle("hidden", !budgetEditing);
  budgetDisplay.classList.toggle("hidden", budgetEditing);
  budgetDisplayText.textContent = budget ? formatMoney(budget) : "未设置";
  if (document.activeElement !== budgetInput) {
    budgetInput.value = budget ? String(Number(budget.toFixed(2))) : "";
  }
}

function startBudgetEdit() {
  budgetEditing = true;
  const budget = Number(store?.settings?.monthlyBudget || 0);
  renderBudgetControl(budget);
  $("#monthlyBudgetInput")?.focus();
}

function transactionRecordsForMonth(month) {
  const records = allConfirmedTransactions().filter((transaction) => monthFromDate(transaction.date) === month);
  if (month !== currentMonthKey()) return records;
  return [
    ...records,
    ...store.recurring.filter((item) => item.active).map((item) => ({
      id: `${item.id}_${month}`,
      date: `${month}-${String(item.dueDay || 1).padStart(2, "0")}`,
      merchant: item.name,
      scenario: "固定账单",
      payer: normalizePerson(item.payer || "共同"),
      total: Number(item.amount || 0),
      recurring: true,
      items: [{
        id: `${item.id}_monthly`,
        name: item.name,
        amount: Number(item.amount || 0),
        category: item.category,
        subcategory: "固定支出",
        necessity: item.necessity,
        owner: inferOwnerForExpense(item.category, item.payer, item.name),
        recurring: true
      }]
    }))
  ];
}

function listRow(title, meta, amount = "") {
  return `
    <div class="list-row">
      <div>
        <strong>${escapeHtml(title)}</strong>
        ${meta ? `<span class="meta">${escapeHtml(meta)}</span>` : ""}
      </div>
      ${amount ? `<span class="amount">${escapeHtml(amount)}</span>` : ""}
    </div>
  `;
}

function dashboardBudgetPace(total, budget) {
  if (!budget) {
    return {
      budget,
      spendPercent: 0,
      timePercent: 0,
      paceLabel: "未设置",
      budgetDiff: 0
    };
  }

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const day = Math.max(1, now.getDate());
  const timePercent = Math.round((day / daysInMonth) * 100);
  const spendPercent = Math.round((total / budget) * 100);
  const budgetDiff = budget - total;
  const paceFast = spendPercent > timePercent + 10;
  const paceLabel = total > budget ? "已超" : paceFast ? "偏快" : "正常";
  return { budget, spendPercent, timePercent, paceLabel, budgetDiff };
}

function dashboardInsightLines({ total, budget, fixedTotal, livingItems, livingTotal, flex, optional }) {
  const pace = dashboardBudgetPace(total, budget);
  if (!total) return ["这个月还没有入账，先记第一笔就好。"];

  const lines = [];
  if (!budget) {
    lines.push(`本月已记录 ${formatMoney(total)}，还没有设置预算。`);
  } else if (pace.budgetDiff >= 0) {
    lines.push(`已用预算 ${pace.spendPercent}%，还剩 ${formatMoney(pace.budgetDiff)}，节奏${pace.paceLabel}。`);
  } else {
    lines.push(`预算已经超出 ${formatMoney(Math.abs(pace.budgetDiff))}，先别急，看看弹性支出。`);
  }

  if (fixedTotal > 0) {
    lines.push(`固定支出已入账 ${formatMoney(fixedTotal)}，所以总额看起来会偏重。`);
  } else {
    const topCategory = topGroups(livingItems, (item) => item.category)[0];
    if (topCategory) {
      const topPercent = livingTotal ? Math.round((topCategory[1] / livingTotal) * 100) : 0;
      lines.push(`生活开销里 ${topCategory[0]} 最多，占 ${topPercent}%。`);
    }
  }

  const focusCategories = topGroups(livingItems.filter((item) => item.necessity === "可优化"), (item) => item.category)
    .slice(0, 2)
    .map(([category]) => category);
  if (flex > 0 && focusCategories.length) {
    lines.push(`可优化先看 ${focusCategories.join("、")}，不用逐笔翻完整账单。`);
  } else if (optional > 0) {
    lines.push(`非必要支出 ${formatMoney(optional)}，月底看月报再决定要不要收紧。`);
  } else {
    lines.push("今天不用展开明细，月底看月报就够了。");
  }

  return lines.slice(0, 3);
}

function renderDashboardInsight(context) {
  const copy = $("#dashboardInsightCopy");
  if (!copy) return;
  copy.innerHTML = dashboardInsightLines(context).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function openDashboardInsight() {
  const popover = $("#dashboardInsightPopover");
  const button = $("#dashboardInsightButton");
  if (!popover || !button) return;
  popover.classList.remove("hidden");
  button.setAttribute("aria-expanded", "true");
}

function closeDashboardInsight() {
  const popover = $("#dashboardInsightPopover");
  const button = $("#dashboardInsightButton");
  if (!popover || !button) return;
  popover.classList.add("hidden");
  button.setAttribute("aria-expanded", "false");
}

function toggleDashboardInsight() {
  const popover = $("#dashboardInsightPopover");
  if (!popover || popover.classList.contains("hidden")) openDashboardInsight();
  else closeDashboardInsight();
}

function ownerTotals(items) {
  syncPayerOptions();
  return payerOptions.reduce((totals, owner) => {
    totals[owner] = sum(items.filter((item) => normalizePerson(item.owner || defaultPayer()) === owner));
    return totals;
  }, {});
}

function renderProjectSummary() {
  const list = $("#projectSummaryList");
  if (!list) return;
  const projectTotals = currentMonthTransactions()
    .filter((transaction) => transaction.tripName)
    .reduce((acc, transaction) => {
      acc[transaction.tripName] = (acc[transaction.tripName] || 0) + Number(transaction.total || 0);
      return acc;
    }, {});
  const projects = Object.entries(projectTotals).sort((a, b) => b[1] - a[1]);
  $("#projectSummaryHint").textContent = "";
  if (!projects.length) {
    list.innerHTML = `<div class="dashboard-mini-empty">还没有项目/旅行</div>`;
    return;
  }
  list.innerHTML = projects.slice(0, 4).map(([project, amount], index) => `
    <button class="dashboard-mini-card dashboard-project-card" type="button" data-project="${escapeAttr(project)}" aria-label="查看 ${escapeAttr(project)} 的流水" style="--card-tilt:${index % 2 ? 0.32 : -0.28}deg">
      <span>${escapeHtml(project)}</span>
      <strong>${formatMoney(amount)}</strong>
    </button>
  `).join("");
  list.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = button.dataset.project;
      switchView("transactions");
      $("#monthFilter").value = currentMonthKey();
      $("#categoryFilter").value = "all";
      $("#payerFilter").value = "all";
      $("#scenarioFilter").value = "all";
      $("#projectFilter").value = project;
      renderTransactions();
    });
  });
}

function necessityTitle(necessity) {
  if (necessity === "必须") return "必须花明细";
  if (necessity === "可优化") return "可优化明细";
  if (necessity === "非必要") return "非必要明细";
  return "明细";
}

function renderNecessityDetails(items) {
  const panel = $("#necessityDetailPanel");
  const list = $("#necessityDetailList");
  if (!panel || !list) return;

  $$("[data-necessity-filter]").forEach((button) => {
    const active = button.dataset.necessityFilter === selectedDashboardNecessity;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  panel.classList.toggle("hidden", !selectedDashboardNecessity);
  if (!selectedDashboardNecessity) {
    list.innerHTML = "";
    return;
  }

  const detailItems = items
    .filter((item) => item.necessity === selectedDashboardNecessity)
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  const detailTotal = sum(detailItems);
  $("#necessityDetailTitle").textContent = necessityTitle(selectedDashboardNecessity);
  $("#necessityDetailTotal").textContent = `${detailItems.length} 项 · ${formatMoney(detailTotal)}`;

  if (!detailItems.length) {
    list.innerHTML = `<div class="empty-state compact-empty"><strong>还没有这类支出</strong></div>`;
    return;
  }

  list.innerHTML = detailItems.map((item) => {
    const owner = normalizePerson(item.owner || "共同");
    const merchant = item.merchant && item.merchant !== item.name ? item.merchant : "";
    const meta = [item.date, merchant, item.category, item.recurring ? "固定支出" : item.scenario, owner].filter(Boolean).join(" · ");
    return `
      <div class="list-row dashboard-detail-row" data-category="${escapeAttr(item.category)}">
        <div>
          <strong>${escapeHtml(item.name || item.merchant || "未命名")}</strong>
          <span class="meta">${escapeHtml(meta)}</span>
        </div>
        <span class="amount">${formatMoney(item.amount)}</span>
      </div>
    `;
  }).join("");
}

function toggleDashboardNecessity(necessity) {
  selectedDashboardNecessity = selectedDashboardNecessity === necessity ? "" : necessity;
  renderDashboard();
}

function renderDashboard() {
  const items = analysisItems();
  const livingItems = items.filter((item) => !isRecurringFixedExpense(item));
  const fixedItems = items.filter(isRecurringFixedExpense);
  const total = sum(items);
  const livingTotal = sum(livingItems);
  const fixedTotal = sum(fixedItems);
  const must = sum(items.filter((item) => item.necessity === "必须"));
  const flex = sum(items.filter((item) => item.necessity === "可优化"));
  const optional = sum(items.filter((item) => item.necessity === "非必要"));
  const budget = Number(store.settings?.monthlyBudget || 0);

  $("#totalExpense").textContent = formatMoney(total);
  if ($("#mustExpense")) $("#mustExpense").textContent = formatMoney(must);
  if ($("#flexExpense")) $("#flexExpense").textContent = formatMoney(flex);
  if ($("#optionalExpense")) $("#optionalExpense").textContent = formatMoney(optional);
  const budgetDiff = budget - total;
  $("#budgetHint").textContent = budget
    ? budgetDiff >= 0
      ? formatMoney(budgetDiff)
      : `-${formatMoney(Math.abs(budgetDiff))}`
    : "未设置";
  renderBudgetControl(budget);
  const budgetProgressFill = $("#budgetProgressFill");
  const budgetProgressPercent = $("#budgetProgressPercent");
  if (budgetProgressFill) {
    const budgetPercent = budget ? Math.round((total / budget) * 100) : 0;
    const clampedBudgetPercent = Math.min(Math.max(budgetPercent, budget ? 3 : 0), 100);
    budgetProgressFill.style.width = `${clampedBudgetPercent}%`;
    budgetProgressFill.dataset.percent = String(budgetPercent);
    budgetProgressFill.dataset.status = budget && total > budget ? "over" : budgetPercent > 80 ? "watch" : "ok";
    budgetProgressFill.parentElement?.setAttribute("aria-label", budget ? `已用预算 ${budgetPercent}%` : "未设置预算");
    budgetProgressFill.parentElement?.style.setProperty("--budget-progress-percent", `${clampedBudgetPercent}%`);
    if (budgetProgressPercent) {
      budgetProgressPercent.textContent = budget ? `${budgetPercent}%` : "";
      budgetProgressPercent.dataset.status = budgetProgressFill.dataset.status;
      budgetProgressPercent.classList.toggle("hidden", !budget);
    }
  }
  $("#monthLabel").textContent = formatMoney(livingTotal);
  $("#transactionCount").textContent = `${currentMonthTransactions().length} 笔`;
  if ($("#fixedSpendTotal")) $("#fixedSpendTotal").textContent = formatMoney(fixedTotal);
  if ($("#fixedSpendStrip")) $("#fixedSpendStrip").classList.toggle("hidden", !fixedTotal);
  renderDashboardInsight({ total, budget, fixedTotal, livingItems, livingTotal, flex, optional });
  renderProjectSummary();

  const categoryBars = $("#categoryBars");
  categoryBars.innerHTML = "";
  const groups = topGroups(livingItems, (item) => item.category).slice(0, 8);
  if (!groups.length) {
    categoryBars.innerHTML = `<div class="empty-state"><strong>还没有生活开销</strong></div>`;
  } else {
    groups.forEach(([category, amount]) => {
      const percent = livingTotal ? Math.round((amount / livingTotal) * 100) : 0;
      const row = document.createElement("div");
      row.className = "bar-row";
      row.dataset.category = category;
    row.innerHTML = `
        <div class="bar-row-header">
          <strong>${escapeHtml(category)}</strong>
          <span>${formatMoney(amount)} · ${percent}%</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(percent, 3)}%"></div></div>
      `;
      categoryBars.appendChild(row);
    });
  }

  const recent = $("#recentTransactions");
  recent.innerHTML = "";
  const transactions = currentMonthTransactions()
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 6);
  if (!transactions.length) {
    recent.innerHTML = `<div class="empty-state"><strong>还没有流水</strong></div>`;
  } else {
    transactions.forEach((transaction) => {
      const row = document.createElement("div");
      row.className = "list-row with-avatar";
      const displayName = transactionDisplayName(transaction);
      const meta = [transaction.date, transaction.scenario, transactionTripMetaPart(transaction, displayName), `${transaction.items?.length || 0} 个明细`].filter(Boolean).join(" · ");
      const dominantCategory = transactionAvatarCategory(transaction);
      row.innerHTML = `
        <div class="merchant-line">
          ${merchantAvatar(displayName, dominantCategory)}
          <div class="list-row-left">
            <strong>${escapeHtml(displayName)}</strong>
            <span class="meta">${escapeHtml(meta)}</span>
          </div>
        </div>
        <span class="amount">${formatMoney(transaction.total)}</span>
      `;
      recent.appendChild(row);
    });
  }
}

async function saveMonthlyBudget(event) {
  event.preventDefault();
  if (!store) return;
  const value = Math.max(0, Number($("#monthlyBudgetInput").value || 0));
  store.settings = {
    ...(store.settings || {}),
    monthlyBudget: value
  };
  store.demo = false;
  budgetEditing = false;
  await saveStore();
}

function settingsModeText(people = peopleFromStore()) {
  return people.length <= 1 ? `一人模式 · ${people[0]}` : `多人模式 · ${people.length} 人`;
}

function renderPeopleSettingsRows(people = peopleFromStore()) {
  const list = $("#peopleSettingsList");
  const hint = $("#peopleSettingsHint");
  if (!list || !hint) return;
  list.innerHTML = people.map((person, index) => `
    <label class="person-setting-row">
      <span>${index + 1}</span>
      <input name="person" value="${escapeHtml(person)}" placeholder="Name" required>
      <button class="symbol-button person-remove-button" type="button" data-action="remove-person" aria-label="删除成员">×</button>
    </label>
  `).join("");
  hint.textContent = settingsModeText(people);
  list.querySelectorAll("[data-action='remove-person']").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPeople = Array.from(list.querySelectorAll("input[name='person']"))
        .filter((input) => input !== button.closest(".person-setting-row")?.querySelector("input"))
        .map((input) => input.value);
      renderPeopleSettingsRows(uniquePeople(nextPeople).length ? uniquePeople(nextPeople) : [...defaultPeople]);
    });
  });
}

function readPeopleSettings() {
  return uniquePeople(Array.from($("#peopleSettingsList")?.querySelectorAll("input[name='person']") || []).map((input) => input.value));
}

function addPersonSettingRow() {
  const people = readPeopleSettings();
  people.push("");
  renderPeopleSettingsRows(people.length ? people : [...defaultPeople, ""]);
  const inputs = $$("#peopleSettingsList input[name='person']");
  inputs[inputs.length - 1]?.focus();
}

function openSettingsSheet() {
  closeDashboardInsight();
  renderPeopleSettingsRows();
  $("#settingsSheet")?.classList.remove("hidden");
  $("#settingsButton")?.setAttribute("aria-expanded", "true");
  $("#peopleSettingsList input[name='person']")?.focus();
}

function closeSettingsSheet() {
  $("#settingsSheet")?.classList.add("hidden");
  $("#settingsButton")?.setAttribute("aria-expanded", "false");
}

function migratePeopleReferences(targetStore, oldPeople, nextPeople) {
  const renameMap = new Map();
  oldPeople.forEach((oldName, index) => {
    const nextName = nextPeople[index];
    if (oldName && nextName && oldName !== nextName) renameMap.set(oldName, nextName);
  });
  const validPeople = new Set(nextPeople);
  const fallback = nextPeople.length <= 1 ? nextPeople[0] : "共同";
  const normalizeReference = (value) => {
    const current = String(value || "").trim();
    const renamed = renameMap.get(current) || current;
    if (renamed === "共同" && nextPeople.length > 1) return "共同";
    if (validPeople.has(renamed)) return renamed;
    return fallback;
  };
  const assign = (object, field) => {
    if (!object || !(field in object)) return;
    object[field] = normalizeReference(object[field]);
  };
  (targetStore.transactions || []).forEach((transaction) => {
    assign(transaction, "payer");
    (transaction.items || []).forEach((item) => assign(item, "owner"));
  });
  (targetStore.pendingReceipts || []).forEach((receipt) => {
    assign(receipt.transaction, "payer");
    (receipt.items || []).forEach((item) => assign(item, "owner"));
  });
  (targetStore.recurring || []).forEach((item) => assign(item, "payer"));
}

async function savePeopleSettings(event) {
  event.preventDefault();
  if (!store) return;
  const nextPeople = readPeopleSettings();
  const hint = $("#peopleSettingsHint");
  if (!nextPeople.length) {
    if (hint) hint.textContent = "至少保留 1 个成员";
    $("#peopleSettingsList input[name='person']")?.focus();
    return;
  }
  const oldPeople = peopleFromStore();
  migratePeopleReferences(store, oldPeople, nextPeople);
  store.people = nextPeople;
  syncPayerOptions(store);
  normalizeStoreParticipants(store);
  store.demo = false;
  closeSettingsSheet();
  await saveStore();
}

function populateCategorySelect(select, selected) {
  const normalizedSelected = normalizeCategory(selected);
  select.innerHTML = visibleCategories(normalizedSelected).map((category) => `<option ${category === normalizedSelected ? "selected" : ""}>${category}</option>`).join("");
}

function populatePayerSelect(select, selected = "共同") {
  if (!select) return;
  syncPayerOptions();
  const normalized = normalizePerson(selected);
  select.innerHTML = payerOptions.map((payer) => `<option value="${escapeAttr(payer)}" ${payer === normalized ? "selected" : ""}>${escapeHtml(payer)}</option>`).join("");
  select.value = payerOptions.includes(normalized) ? normalized : defaultPayer();
  select.disabled = isSinglePersonLedger();
  select.closest("label")?.classList.toggle("single-payer-field", isSinglePersonLedger());
}

function categorySelectOptions(selected) {
  const normalizedSelected = normalizeCategory(selected);
  return visibleCategories(normalizedSelected)
    .map((category) => `<option value="${escapeAttr(category)}" ${category === normalizedSelected ? "selected" : ""}>${escapeHtml(category)}</option>`)
    .join("");
}

function payerSelectOptions(selected = "共同") {
  syncPayerOptions();
  const normalized = normalizePerson(selected);
  return payerOptions
    .map((payer) => `<option value="${escapeAttr(payer)}" ${payer === normalized ? "selected" : ""}>${escapeHtml(payer)}</option>`)
    .join("");
}

function payerSelectDisabledAttr() {
  return isSinglePersonLedger() ? ' disabled aria-disabled="true"' : "";
}

function scenarioSelectOptions(selected = "日常") {
  return ["日常", "网购", "旅行", "固定账单"]
    .map((scenario) => `<option value="${escapeAttr(scenario)}" ${scenario === selected ? "selected" : ""}>${escapeHtml(scenario)}</option>`)
    .join("");
}

function refreshCategorySelect(select, fallback) {
  if (!select) return;
  const current = normalizeCategory(select.value || fallback);
  populateCategorySelect(select, current);
  select.value = current;
}

function refreshCategoryControls() {
  refreshCategorySelect($("#textExpenseCategory"), "外食/咖啡");
  refreshCategorySelect($("#recurringForm")?.elements.namedItem("category"), "订阅服务");
}

function refreshPayerControls() {
  syncPayerOptions();
  populatePayerSelect($("#textExpensePayer"), $("#textExpensePayer")?.value || defaultPayer());
  populatePayerSelect($("#importPayer"), $("#importPayer")?.value || defaultPayer());
  populatePayerSelect($("#recurringForm")?.elements.namedItem("payer"), $("#recurringForm")?.elements.namedItem("payer")?.value || defaultPayer());
}

function parseUiRefs() {
  if (currentView === "import") {
    return {
      empty: $("#importParseEmpty"),
      result: $("#importParseResult"),
      badge: $("#importConfidenceBadge")
    };
  }
  return {
    empty: $("#parseEmpty"),
    result: $("#parseResult"),
    badge: $("#confidenceBadge")
  };
}

function bindParsedInputs(root, parsed) {
  root.querySelectorAll("[data-transaction]").forEach((input) => {
    const update = () => {
      const field = input.dataset.transaction;
      parsed.transaction[field] = input.type === "number" ? Number(input.value || 0) : input.value;
      if (field === "total" || field === "tax" || field === "discount") validateTotals(root, parsed);
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
}

function renderItemRows(container, parsed, root) {
  container.innerHTML = "";
  const header = document.createElement("div");
  header.className = "item-row header";
  header.innerHTML = "<span>商品</span><span>数量</span><span>金额</span><span>分类</span><span>细分</span><span>必要性</span><span>归属</span><span></span>";
  container.appendChild(header);

  parsed.items.forEach((item, index) => {
    const template = $("#itemRowTemplate").content.cloneNode(true);
    const row = template.querySelector(".item-row");
    row.querySelectorAll("[data-field]").forEach((input) => {
      const field = input.dataset.field;
      if (field === "category") {
        item[field] = normalizeCategory(item[field], item);
        populateCategorySelect(input, item[field]);
      }
      if (field === "owner") {
        item[field] = normalizePerson(item[field] || inferOwnerForExpense(item.category, parsed.transaction?.payer, item.name));
        populatePayerSelect(input, item[field]);
      }
      input.value = item[field] ?? "";
      const updateItem = () => {
        item._touchedFields = {
          ...(item._touchedFields || {}),
          [field]: true
        };
        item[field] = input.type === "number" ? Number(input.value || 0) : input.value;
        if (field === "category") {
          item.category = normalizeCategory(item.category, item);
          const fallback = categoryDefault(item.category);
          item.subcategory = item.subcategory || fallback.subcategory;
          item.necessity = item.necessity || fallback.necessity;
        }
        validateTotals(root, parsed);
      };
      input.addEventListener("input", updateItem);
      input.addEventListener("change", updateItem);
    });
    row.querySelector(".remove-item").addEventListener("click", () => {
      parsed.items.splice(index, 1);
      renderParsedResult(parsed);
    });
    container.appendChild(row);
  });
}

function validateTotals(root, parsed) {
  const itemSum = sum(parsed.items);
  const expected = Number(parsed.transaction.total || 0);
  const difference = Number((expected - itemSum - Number(parsed.transaction.tax || 0) + Number(parsed.transaction.discount || 0)).toFixed(2));
  const badge = root.querySelector("[data-total-check]");
  if (!badge) return;
  if (Math.abs(difference) <= 1) {
    badge.textContent = `金额基本匹配：明细 ${formatMoney(itemSum)}`;
    badge.className = "pill";
  } else {
    badge.textContent = `待核对：总额和明细差 ${formatMoney(difference)}`;
    badge.className = "pill warning";
  }
}

function renderParsedResult(parsed) {
  currentParsed = parsed;
  const { empty, result, badge } = parseUiRefs();
  empty.classList.add("hidden");
  result.classList.remove("hidden");
  badge.classList.remove("hidden");
  badge.textContent = "已识别";

  const payerSelect = `
    <select data-transaction="payer"${payerSelectDisabledAttr()}>
      ${payerOptions.map((value) => `<option value="${escapeAttr(value)}" ${value === normalizePerson(parsed.transaction.payer) ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
    </select>
  `;
  const scenarioSelect = `
    <select data-transaction="scenario">
      ${["日常", "网购", "旅行", "固定账单"].map((value) => `<option ${value === parsed.transaction.scenario ? "selected" : ""}>${value}</option>`).join("")}
    </select>
  `;
  const compactParsed = currentView === "import" || currentView === "capture";
  const transactionFields = compactParsed
    ? `
      <div class="import-order-editor">
        <label>商家<input data-transaction="merchant" value="${escapeHtml(parsed.transaction.merchant || "")}"></label>
        <label>日期<input data-transaction="date" type="date" value="${escapeHtml(parsed.transaction.date || "")}"></label>
        <label>总金额<input data-transaction="total" type="number" step="0.01" value="${parsed.transaction.total || 0}"></label>
        <label class="import-address-field">门店地址<input data-transaction="storeAddress" value="${escapeHtml(parsed.transaction.storeAddress || "")}" placeholder="可选"></label>
      </div>
      <details class="import-more-fields">
        <summary>更多字段</summary>
        <div class="form-grid">
          <label>税费<input data-transaction="tax" type="number" step="0.01" value="${parsed.transaction.tax || 0}"></label>
          <label>折扣<input data-transaction="discount" type="number" step="0.01" value="${parsed.transaction.discount || 0}"></label>
          <label>旅行/项目<input data-transaction="tripName" value="${escapeHtml(parsed.transaction.tripName || "")}" placeholder="可选"></label>
          <label>付款人${payerSelect}</label>
          <label>场景${scenarioSelect}</label>
        </div>
      </details>
    `
    : `
      <div class="form-grid">
        <label>日期<input data-transaction="date" type="date" value="${escapeHtml(parsed.transaction.date || "")}"></label>
        <label>商家<input data-transaction="merchant" value="${escapeHtml(parsed.transaction.merchant || "")}"></label>
        <label>门店地址<input data-transaction="storeAddress" value="${escapeHtml(parsed.transaction.storeAddress || "")}" placeholder="可选"></label>
        <label>总金额<input data-transaction="total" type="number" step="0.01" value="${parsed.transaction.total || 0}"></label>
        <label>税费<input data-transaction="tax" type="number" step="0.01" value="${parsed.transaction.tax || 0}"></label>
        <label>折扣<input data-transaction="discount" type="number" step="0.01" value="${parsed.transaction.discount || 0}"></label>
        <label>旅行/项目<input data-transaction="tripName" value="${escapeHtml(parsed.transaction.tripName || "")}" placeholder="可选"></label>
        <label>付款人${payerSelect}</label>
        <label>场景${scenarioSelect}</label>
      </div>
    `;

  result.innerHTML = `
    <form class="transaction-form ${compactParsed ? "compact-parsed-form" : ""}">
      ${transactionFields}
      <div class="panel-heading">
        <h3>商品明细</h3>
        <span data-total-check class="pill">金额校验</span>
      </div>
      <div class="items-editor" data-items-editor></div>
      <div class="result-actions">
        <button class="icon-button pencil-action-button" data-action="add-item" type="button" title="添加明细" aria-label="添加明细">${actionIconLabel("添加明细")}</button>
        <button class="ghost-button" data-action="save-pending" type="button">存到待确认</button>
        <button class="primary-button" data-action="confirm-parsed" type="button">确认入账</button>
      </div>
    </form>
  `;
  bindParsedInputs(result, parsed);
  renderItemRows(result.querySelector("[data-items-editor]"), parsed, result);
  validateTotals(result, parsed);

  result.querySelector('[data-action="add-item"]').addEventListener("click", () => {
    parsed.items.push({
      id: uid("item"),
      name: "新明细",
      quantity: "1",
      amount: 0,
      category: "其他",
      subcategory: "待细分",
      necessity: "可优化",
      owner: "共同",
      confidence: 0.5
    });
    renderParsedResult(parsed);
  });
  result.querySelector('[data-action="save-pending"]').addEventListener("click", async () => {
    await savePending(parsed);
    renderPending();
  });
  result.querySelector('[data-action="confirm-parsed"]').addEventListener("click", async () => {
    await confirmParsed(parsed);
    switchView("transactions");
  });
}

function learnFromParsedItems(parsed) {
  (parsed.items || []).forEach((item) => {
    const touched = item._touchedFields || {};
    if (!(touched.category || touched.subcategory || touched.necessity || touched.owner)) return;
    rememberLearnedRule(item.name, {
      category: item.category,
      subcategory: item.subcategory,
      necessity: item.necessity,
      owner: item.owner
    });
  });
}

function cleanParsedItem(item) {
  const {
    _touchedFields,
    ...publicItem
  } = item;
  return publicItem;
}

async function savePending(parsed) {
  parsed.transaction.payer = normalizePerson(parsed.transaction.payer);
  parsed.items.forEach((item) => {
    item.owner = normalizePerson(item.owner);
  });
  const pending = {
    id: parsed.receipt?.id || uid("receipt"),
    createdAt: new Date().toISOString(),
    provider: parsed.provider,
    confidence: parsed.confidence,
    warnings: parsed.warnings || [],
    receipt: parsed.receipt,
    transaction: { ...parsed.transaction, status: "pending" },
    items: parsed.items.map(cleanParsedItem)
  };
  const existingIndex = store.pendingReceipts.findIndex((entry) => entry.id === pending.id);
  if (existingIndex >= 0) store.pendingReceipts[existingIndex] = pending;
  else store.pendingReceipts.unshift(pending);
  await saveStore();
}

async function confirmParsed(parsed) {
  learnFromParsedItems(parsed);
  const transaction = {
    ...parsed.transaction,
    id: parsed.transaction.id || uid("txn"),
    payer: normalizePerson(parsed.transaction.payer),
    total: Number(parsed.transaction.total || sum(parsed.items)),
    tax: Number(parsed.transaction.tax || 0),
    discount: Number(parsed.transaction.discount || 0),
    status: "confirmed",
    createdAt: new Date().toISOString(),
    receipt: parsed.receipt || null,
    items: parsed.items.map((item) => ({
      ...cleanParsedItem(item),
      id: item.id || uid("item"),
      owner: normalizePerson(item.owner),
      amount: Number(item.amount || 0)
    }))
  };
  store.transactions.unshift(transaction);
  store.pendingReceipts = store.pendingReceipts.filter((entry) => entry.id !== parsed.receipt?.id);
  store.demo = false;
  await saveStore();
}

async function parseReceipt() {
  const button = $("#parseButton");
  button.disabled = true;
  button.title = "识别中";
  button.setAttribute("aria-label", "识别中");
  button.setAttribute("aria-busy", "true");
  try {
    const tripName = $("#receiptTripName").value.trim();
    const payload = {
      text: $("#receiptText").value,
      tripName,
      payer: defaultPayer(),
      people: peopleFromStore(),
      imageDataUrl: selectedImageDataUrl,
      fileName: selectedFileName
    };
    const parsed = await apiWithAuth("/api/parse-receipt", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (!parsed) return;
    renderParsedResult(applyClientRulesToParsed(parsed));
  } catch (error) {
    alert(`识别失败：${error.message}`);
  } finally {
    button.disabled = false;
    button.title = "识别";
    button.setAttribute("aria-label", "识别");
    button.removeAttribute("aria-busy");
  }
}

function sourceTypeForImport(platform) {
  const value = String(platform || "").toLowerCase();
  if (["whole foods", "amazon fresh", "instacart"].some((name) => value.includes(name))) return "grocery";
  if (["booking", "booking.com", "airbnb", "expedia", "hotels.com", "marriott", "hilton", "hyatt"].some((name) => value.includes(name))) return "travel";
  return "ecommerce";
}

function merchantForImport(platform) {
  return platform;
}

function selectedImportPlatform() {
  const platform = $("#importPlatform").value;
  if (platform !== "其他") return platform;
  return $("#importCustomPlatform").value.trim();
}

function updateImportPlatformCustom() {
  const isCustom = $("#importPlatform").value === "其他";
  $("#importCustomPlatform").classList.toggle("hidden", !isCustom);
  $("#importCustomPlatform").required = isCustom;
  if (!isCustom) $("#importCustomPlatform").value = "";
  if (isCustom) $("#importCustomPlatform").focus();
}

function switchImportMode(mode) {
  const isUpload = mode === "upload";
  $("#importPastePanel").classList.toggle("hidden", isUpload);
  $("#importUploadPanel").classList.toggle("hidden", !isUpload);
  $$("#view-import [data-import-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.importMode === mode);
  });
}

function switchCaptureMode(mode) {
  const isText = mode === "text";
  $("#receiptUploadPanel").classList.toggle("hidden", isText);
  $("#receiptTextPanel").classList.toggle("hidden", !isText);
  $$("#view-capture [data-capture-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.captureMode === mode);
  });
}

async function parseOnlineImport() {
  const button = $("#parseImportButton");
  button.disabled = true;
  button.title = "识别中";
  button.setAttribute("aria-label", "识别中");
  button.setAttribute("aria-busy", "true");
  try {
    const platform = selectedImportPlatform();
    if (!platform) {
      alert("请先填写真实的平台名字，例如 Booking、Airbnb 或 Etsy。");
      $("#importCustomPlatform").focus();
      return;
    }
    const text = $("#importText").value.trim();
    const payload = {
      sourceType: sourceTypeForImport(platform),
      sourcePlatform: platform,
      merchant: merchantForImport(platform),
      payer: normalizePerson($("#importPayer").value),
      people: peopleFromStore(),
      tripName: $("#importTripName").value.trim(),
      text,
      imageDataUrl: selectedImportImageDataUrl,
      fileName: selectedImportFileName
    };
    if (!payload.text && !payload.imageDataUrl) {
      alert("先上传文件、截图，或粘贴订单内容。");
      return;
    }
    const parsed = await apiWithAuth("/api/parse-receipt", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (!parsed) return;
    renderParsedResult(applyClientRulesToParsed(parsed));
  } catch (error) {
    alert(`导入失败：${error.message}`);
  } finally {
    button.disabled = false;
    button.title = "识别";
    button.setAttribute("aria-label", "识别");
    button.removeAttribute("aria-busy");
  }
}

async function saveTextExpense(event) {
  event.preventDefault();
  const raw = $("#textExpenseInput").value.trim();
  const amount = Number($("#textExpenseAmount").value || 0);
  if (!raw || amount <= 0) {
    alert("请输入消费内容和大于 0 的金额。");
    return;
  }

  const parsed = parseTextExpense(raw);
  const name = parsed.name;
  const merchant = parsed.merchant || name;
  const category = $("#textExpenseCategory").value;
  const classification = classifyTextExpense(name);
  const manualCategory = normalizeCategory(category) !== normalizeCategory(parsed.category);
  const fallback = manualCategory ? categoryDefault(category) : classification;
  const subcategory = fallback.subcategory;
  const necessity = fallback.necessity;
  const payer = normalizePerson($("#textExpensePayer").value);
  const owner = parsed.owner || inferOwnerForExpense(category, payer, name);
  const tripName = $("#textExpenseTripName").value.trim();
  const date = $("#textExpenseDate").value || todayKey();
  if (manualCategory) {
    rememberLearnedRule(name, {
      category,
      subcategory,
      necessity,
      owner
    });
  }
  const transaction = {
    id: uid("txn_text"),
    date,
    merchant,
    source: "text",
    scenario: inferScenario(category, [merchant, name, raw].filter(Boolean).join(" ")),
    tripName,
    payer,
    total: amount,
    tax: 0,
    discount: 0,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: uid("item_text"),
        name,
        quantity: "1",
        amount,
        category,
        subcategory,
        necessity,
        owner,
        confidence: 1
      }
    ]
  };
  store.transactions.unshift(transaction);
  store.demo = false;
  $("#textExpenseForm").reset();
  resetTextExpenseDefaults();
  await saveStore();
  switchView("transactions");
}

function applyTextExpenseGuess() {
  const parsed = parseTextExpense($("#textExpenseInput").value);
  if (parsed.amount > 0) $("#textExpenseAmount").value = parsed.amount;
  populateCategorySelect($("#textExpenseCategory"), parsed.category);
  $("#textExpenseCategory").value = parsed.category;
  if (parsed.payer) $("#textExpensePayer").value = parsed.payer;
}

function applyQuickTemplate(template) {
  const input = $("#textExpenseInput");
  input.value = template;
  applyTextExpenseGuess();
  input.focus();
  if (!$("#textExpenseAmount").value) $("#textExpenseAmount").focus();
}

function renderQuickTemplates() {
  const row = $("#quickTemplateRow");
  if (!row) return;
  row.innerHTML = quickExpenseTemplates.map((template) => `
    <button class="template-chip" type="button" data-template="${escapeAttr(template)}">${escapeHtml(template)}</button>
  `).join("");
  row.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => applyQuickTemplate(button.dataset.template));
  });
}

function setVoiceStatus(text) {
  const status = $("#voiceStatus");
  if (status) status.textContent = text;
}

function startVoiceExpense() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceStatus("这个浏览器暂不支持语音输入。");
    return;
  }
  if (voiceRecognition) {
    voiceRecognition.stop();
    voiceRecognition = null;
    setVoiceStatus("");
    return;
  }
  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = "zh-CN";
  voiceRecognition.interimResults = false;
  voiceRecognition.maxAlternatives = 1;
  setVoiceStatus("正在听...");
  voiceRecognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    if (!transcript) return;
    $("#textExpenseInput").value = transcript;
    applyTextExpenseGuess();
    setVoiceStatus("已填入语音内容");
    if (!$("#textExpenseAmount").value) $("#textExpenseAmount").focus();
  };
  voiceRecognition.onerror = () => {
    setVoiceStatus("没听清，换打字也可以。");
  };
  voiceRecognition.onend = () => {
    voiceRecognition = null;
    setTimeout(() => {
      if (!voiceRecognition) setVoiceStatus("");
    }, 1600);
  };
  voiceRecognition.start();
}

function resetTextExpenseDefaults() {
  $("#textExpenseDate").value = todayKey();
  populateCategorySelect($("#textExpenseCategory"), "外食/咖啡");
  populatePayerSelect($("#textExpensePayer"), defaultPayer());
  $("#textExpensePayer").value = defaultPayer();
  $("#textExpenseTripName").value = "";
}

function renderPending() {
  $$(".entry-pending-count").forEach((count) => {
    count.textContent = `${store.pendingReceipts.length} 张`;
  });

  $$(".entry-pending-list").forEach((list) => {
    list.innerHTML = "";
    if (!store.pendingReceipts.length) {
      list.innerHTML = `<div class="empty-state entry-pending-empty"><strong>暂无待确认</strong></div>`;
      return;
    }

    store.pendingReceipts.forEach((entry) => {
      const card = document.createElement("div");
      card.className = "receipt-card entry-pending-receipt";
      const image = entry.receipt?.imageDataUrl ? `<img class="thumbnail" src="${entry.receipt.imageDataUrl}" alt="票据缩略图">` : "";
      const displayName = transactionDisplayName(entry.transaction, entry.items);
      const meta = [entry.transaction.date, entry.transaction.scenario, transactionTripMetaPart(entry.transaction, displayName), `${entry.items.length} 个明细`].filter(Boolean).join(" · ");
      const dominantCategory = transactionAvatarCategory(entry.transaction, entry.items);
      card.innerHTML = `
        <div class="receipt-card-header">
          <div class="merchant-line">
            ${merchantAvatar(displayName, dominantCategory)}
            <div class="list-row-left">
              <strong>${escapeHtml(displayName)}</strong>
              <span class="meta">${escapeHtml(meta)}</span>
            </div>
          </div>
          <span class="amount">${formatMoney(entry.transaction.total)}</span>
        </div>
        ${image ? `<div class="receipt-card-media">${image}</div>` : ""}
        <div class="receipt-card-actions">
          <button class="icon-button pencil-action-button" data-action="edit" type="button" title="继续编辑" aria-label="继续编辑">${actionIconLabel("继续编辑")}</button>
          <button class="primary-button" data-action="confirm" type="button">确认入账</button>
          <button class="danger-button" data-action="delete" type="button">删除</button>
        </div>
      `;
      card.querySelector('[data-action="edit"]').addEventListener("click", () => {
        currentParsed = entry;
        switchView(entry.receipt?.sourcePlatform ? "import" : "capture");
        renderParsedResult(entry);
      });
      card.querySelector('[data-action="confirm"]').addEventListener("click", async () => {
        await confirmParsed(entry);
      });
      card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
        store.pendingReceipts = store.pendingReceipts.filter((item) => item.id !== entry.id);
        await saveStore();
      });
      list.appendChild(card);
    });
  });
}

function formatMonthLabel(month) {
  const [year, monthNumber] = String(month || "").split("-");
  if (!year || !monthNumber) return "未知月份";
  const currentYear = String(new Date().getFullYear());
  return year === currentYear ? `${Number(monthNumber)} 月` : `${year} 年 ${Number(monthNumber)} 月`;
}

function formatDateLabel(date) {
  const raw = String(date || "");
  const [year, month, day] = raw.split("-");
  if (!year || !month || !day) return raw || "未写日期";
  const dateObject = new Date(`${raw}T12:00:00`);
  const weekday = Number.isNaN(dateObject.getTime()) ? "" : dateObject.toLocaleDateString("zh-CN", { weekday: "short" });
  const currentYear = String(new Date().getFullYear());
  const prefix = year === currentYear ? `${Number(month)} 月 ${Number(day)} 日` : `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
  return [prefix, weekday].filter(Boolean).join(" ");
}

function transactionSearchText(transaction) {
  return [
    transaction.merchant,
    transaction.storeAddress,
    transaction.date,
    transaction.scenario,
    transaction.tripName,
    normalizePerson(transaction.payer || "共同"),
    ...(transaction.items || []).flatMap((item) => [item.name, item.category, item.subcategory, item.owner])
  ].filter(Boolean).join(" ").toLowerCase();
}

function transactionVisibleAmount(transaction, category) {
  if (category === "all") return Number(transaction.total || 0);
  return sum(transactionItemsWithAdjustment(transaction).filter((item) => item.category === category));
}

function transactionStableId(transaction) {
  return transaction.id || [transaction.date, transaction.merchant, transaction.total, transaction.createdAt].filter(Boolean).join("|");
}

function findTransactionIndex(transactionId) {
  return store.transactions.findIndex((entry) => transactionStableId(entry) === transactionId);
}

function cloneTransaction(transaction) {
  return JSON.parse(JSON.stringify(transaction || {}));
}

function defaultItemNameForCategory(category, subcategory = "", context = {}) {
  const normalized = normalizeCategory(category, { subcategory });
  const text = `${normalized} ${subcategory}`.toLowerCase();
  if (normalized === "打车/租车") return context?.scenario === "旅行" || context?.tripName || /租车|rental|turo|zipcar/.test(text) ? "租车" : "打车";
  if (normalized === "外食/咖啡") return /咖啡|饮品|drink|coffee/.test(text) ? "咖啡" : "餐饮";
  if (normalized === "旅行度假") return /住宿|酒店|airbnb|cabin|hotel/.test(text) ? "住宿" : "旅行支出";
  if (normalized === "食品杂货") return "食品杂货";
  if (normalized === "家居日用") return "家居日用";
  if (normalized === "医疗健康") return "药品/医疗";
  if (normalized === "公共交通") return "公共交通";
  if (normalized === "停车过路") return "停车";
  if (normalized === "车辆养护") return /加油|gas|fuel/.test(text) ? "加油" : "车辆养护";
  if (normalized === "证件税费") return "证件费用";
  if (normalized === "衣服鞋包") return "服饰";
  if (normalized === "护肤美妆") return "个人护理";
  if (normalized === "娱乐游戏") return "娱乐";
  if (normalized === "运动健身") return "运动";
  if (normalized === "礼物社交") return "礼物社交";
  if (normalized === "学习成长") return "学习";
  if (normalized === "保险金融") return "保险金融";
  if (normalized === "订阅服务") return "订阅服务";
  if (normalized === "电子数码") return "电子数码";
  return normalized || "明细";
}

function normalizeItemName(name, category, subcategory, context = {}) {
  const value = String(name || "").trim();
  return value && value !== "未命名" ? value : defaultItemNameForCategory(category, subcategory, context);
}

function normalizeEditedTransaction(transaction) {
  transaction.payer = normalizePerson(transaction.payer || "共同");
  transaction.total = Number(transaction.total || 0);
  transaction.tax = Number(transaction.tax || 0);
  transaction.discount = Number(transaction.discount || 0);
  transaction.status = "confirmed";
  transaction.items = (transaction.items || []).map((item) => {
    const category = normalizeCategory(item.category, item);
    const defaults = categoryDefault(category);
    const subcategory = String(item.subcategory || defaults.subcategory).trim() || defaults.subcategory;
    return {
      id: item.id || uid("item"),
      name: normalizeItemName(item.name, category, subcategory, transaction),
      quantity: String(item.quantity || "1").trim() || "1",
      amount: Number(item.amount || 0),
      category,
      subcategory,
      necessity: String(item.necessity || defaults.necessity).trim() || defaults.necessity,
      owner: normalizePerson(item.owner || "共同"),
      confidence: Number(item.confidence || 1)
    };
  });
  return transaction;
}

async function deleteTransaction(transaction) {
  const transactionId = transactionStableId(transaction);
  if (!confirm(`确定删除「${transactionDisplayName(transaction)}」这笔支出吗？`)) return;
  store.transactions = store.transactions.filter((entry) => transactionStableId(entry) !== transactionId);
  selectedTransactionId = "";
  store.demo = false;
  await saveStore();
}

function transactionEditItemRow(item, index) {
  const category = normalizeCategory(item.category, item);
  const owner = normalizePerson(item.owner || "共同");
  return `
    <div class="transaction-edit-item" data-index="${index}" data-item-id="${escapeAttr(item.id || "")}">
      <input data-field="name" value="${escapeHtml(item.name || "")}" placeholder="名称" aria-label="明细名称">
      <input data-field="amount" type="number" step="0.01" value="${Number(item.amount || 0)}" aria-label="明细金额">
      <select data-field="category" aria-label="明细分类">${categorySelectOptions(category)}</select>
      <select data-field="owner" aria-label="明细归属"${payerSelectDisabledAttr()}>${payerSelectOptions(owner)}</select>
      <button class="symbol-button transaction-edit-remove" data-action="remove-edit-item" type="button" title="删除明细" aria-label="删除明细">×</button>
    </div>
  `;
}

function bindTransactionEditForm(form, draft, transactionId, category) {
  const recalculateEditTotal = () => {
    const itemSum = sum(Array.from(form.querySelectorAll(".transaction-edit-item")), (row) =>
      Number(row.querySelector('[data-field="amount"]').value || 0)
    );
    const tax = Number(form.elements.namedItem("tax").value || 0);
    const discount = Number(form.elements.namedItem("discount").value || 0);
    form.elements.namedItem("total").value = Number((itemSum + tax - discount).toFixed(2));
  };

  const syncItemsFromRows = () => {
    draft.items = Array.from(form.querySelectorAll(".transaction-edit-item")).map((row) => {
      const categoryValue = normalizeCategory(row.querySelector('[data-field="category"]').value);
      const defaults = categoryDefault(categoryValue);
      return {
        id: row.dataset.itemId || uid("item"),
        name: row.querySelector('[data-field="name"]').value,
        quantity: "1",
        amount: Number(row.querySelector('[data-field="amount"]').value || 0),
        category: categoryValue,
        subcategory: defaults.subcategory,
        necessity: defaults.necessity,
        owner: normalizePerson(row.querySelector('[data-field="owner"]').value),
        confidence: 1
      };
    });
  };

  form.querySelectorAll("[data-action='remove-edit-item']").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".transaction-edit-item").remove();
      recalculateEditTotal();
    });
  });

  form.querySelectorAll('.transaction-edit-item [data-field="amount"], input[name="tax"], input[name="discount"]').forEach((input) => {
    input.addEventListener("input", recalculateEditTotal);
    input.addEventListener("change", recalculateEditTotal);
  });

  form.querySelector("[data-action='add-edit-item']").addEventListener("click", () => {
    syncItemsFromRows();
    draft.items.push({
      id: uid("item"),
      name: "",
      quantity: "1",
      amount: 0,
      category: "其他",
      subcategory: categoryDefault("其他").subcategory,
      necessity: categoryDefault("其他").necessity,
      owner: normalizePerson(draft.payer || "共同"),
      confidence: 1
    });
    draft.total = Number(form.elements.namedItem("total").value || draft.total || 0);
    renderTransactionEditForm(draft, category, transactionId);
  });

  form.querySelector("[data-action='cancel-edit-transaction']").addEventListener("click", () => {
    const index = findTransactionIndex(transactionId);
    renderTransactionDetail(index >= 0 ? store.transactions[index] : null, category);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncItemsFromRows();
    draft.merchant = form.elements.namedItem("merchant").value.trim() || "未命名";
    draft.date = form.elements.namedItem("date").value || todayIso();
    draft.total = Number(form.elements.namedItem("total").value || sum(draft.items));
    draft.tax = Number(form.elements.namedItem("tax").value || 0);
    draft.discount = Number(form.elements.namedItem("discount").value || 0);
    draft.payer = normalizePerson(form.elements.namedItem("payer").value);
    draft.scenario = form.elements.namedItem("scenario").value || "日常";
    draft.tripName = form.elements.namedItem("tripName").value.trim();
    draft.storeAddress = form.elements.namedItem("storeAddress").value.trim();
    draft.updatedAt = new Date().toISOString();

    const index = findTransactionIndex(transactionId);
    if (index < 0) return;
    const normalized = normalizeEditedTransaction(draft);
    store.transactions[index] = normalized;
    selectedTransactionId = transactionStableId(normalized);
    store.demo = false;
    await saveStore();
  });
}

function renderTransactionEditForm(transaction, category, originalTransactionId = transactionStableId(transaction)) {
  const paper = $("#transactionDetailPaper");
  if (!paper) return;
  const draft = cloneTransaction(transaction);
  draft.items = draft.items || [];
  const itemRows = draft.items.map(transactionEditItemRow).join("");

  paper.innerHTML = `
    <form class="transaction-detail-edit-form">
      <div class="transaction-detail-edit-head">
        <strong>编辑流水</strong>
        <div class="transaction-detail-actions">
          <button class="symbol-button" data-action="cancel-edit-transaction" type="button" title="取消" aria-label="取消">×</button>
          <button class="symbol-button save-symbol-button" type="submit" title="保存" aria-label="保存">✓</button>
        </div>
      </div>
      <div class="transaction-edit-grid">
        <label>商家<input name="merchant" value="${escapeHtml(draft.merchant || "")}"></label>
        <label>日期<input name="date" type="date" value="${escapeHtml(draft.date || "")}"></label>
        <label>总金额<input name="total" type="number" step="0.01" value="${Number(draft.total || 0)}"></label>
        <label>付款人<select name="payer"${payerSelectDisabledAttr()}>${payerSelectOptions(draft.payer)}</select></label>
        <label>场景<select name="scenario">${scenarioSelectOptions(draft.scenario)}</select></label>
        <label>旅行/项目<input name="tripName" value="${escapeHtml(draft.tripName || "")}" placeholder="可选"></label>
        <label>税费<input name="tax" type="number" step="0.01" value="${Number(draft.tax || 0)}"></label>
        <label>折扣<input name="discount" type="number" step="0.01" value="${Number(draft.discount || 0)}"></label>
        <label class="transaction-edit-wide">门店地址<input name="storeAddress" value="${escapeHtml(draft.storeAddress || "")}" placeholder="可选"></label>
      </div>
      <div class="transaction-edit-items">
        <div class="transaction-edit-items-head">
          <strong>明细</strong>
          <button class="symbol-button" data-action="add-edit-item" type="button" title="添加明细" aria-label="添加明细">+</button>
        </div>
        ${itemRows || `<div class="transaction-detail-empty">没有明细</div>`}
      </div>
    </form>
  `;

  bindTransactionEditForm(paper.querySelector("form"), draft, originalTransactionId, category);
}

function renderTransactionDetail(transaction, category) {
  const paper = $("#transactionDetailPaper");
  if (!paper) return;
  if (!transaction) {
    paper.innerHTML = `<div class="transaction-detail-empty">选择一笔流水</div>`;
    return;
  }

  const payer = normalizePerson(transaction.payer || "共同");
  const filteredItems = (transaction.items || []).filter((item) => category === "all" || item.category === category);
  const visibleAmount = transactionVisibleAmount(transaction, category);
  const adjustment = category === "all" ? transactionAdjustmentItem(transaction) : null;
  const detailMeta = [formatDateLabel(transaction.date), payer].filter(Boolean).join(" · ");
  const storeAddress = String(transaction.storeAddress || "").trim();
  const displayName = transactionDisplayName(transaction, filteredItems);
  const itemRows = filteredItems.map((item) => {
    const iconCategory = expenseIconCategory(item);
    const itemLabel = [item.name, item.category, item.subcategory, normalizePerson(item.owner || "共同"), formatMoney(item.amount)]
      .filter(Boolean)
      .join(", ");
    return `
      <div class="transaction-detail-item" data-category="${escapeAttr(item.category)}" style="--category-ink:${categoryInk(iconCategory)}" aria-label="${escapeAttr(itemLabel)}">
        <span class="receipt-category-mark">${streamlineIcon(itemIcon(item), "receipt-category-icon")}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="receipt-leader" aria-hidden="true"></span>
        <span class="amount">${formatMoney(item.amount)}</span>
      </div>
    `;
  }).join("");
  const transactionId = transactionStableId(transaction);

  paper.innerHTML = `
    <div class="transaction-detail-head">
      <div>
        <span class="receipt-kicker">Meowney Receipt</span>
        <h3>${escapeHtml(displayName)}</h3>
        <span class="receipt-meta">${escapeHtml(detailMeta)}</span>
        ${storeAddress ? `<p class="transaction-detail-address">${escapeHtml(storeAddress)}</p>` : ""}
      </div>
      <div class="transaction-detail-actions">
        <button class="symbol-button" data-action="edit-transaction" type="button" title="编辑" aria-label="编辑">✎</button>
        <button class="symbol-button danger-symbol-button" data-action="delete-transaction" type="button" title="删除" aria-label="删除">×</button>
      </div>
    </div>
    <div class="transaction-detail-list">
      ${itemRows || `<div class="transaction-detail-empty">没有明细</div>`}
    </div>
    ${adjustment ? `
      <div class="transaction-detail-adjustment">
        <span>明细差额</span>
        <strong>${formatMoney(adjustment.amount)}</strong>
      </div>
    ` : ""}
    <div class="transaction-detail-total">
      <span>合计</span>
      <strong>${formatMoney(visibleAmount)}</strong>
    </div>
  `;

  paper.querySelector('[data-action="edit-transaction"]').addEventListener("click", () => {
    renderTransactionEditForm(transaction, category, transactionId);
  });
  paper.querySelector('[data-action="delete-transaction"]').addEventListener("click", () => {
    deleteTransaction(transaction);
  });
}

function updateFilters() {
  const monthFilter = $("#monthFilter");
  const currentMonth = currentMonthKey();
  const selectedMonth = monthFilter.value || currentMonth;
  const months = [...new Set([currentMonth, ...allConfirmedTransactions().map((transaction) => monthFromDate(transaction.date)).filter(Boolean)])]
    .sort((a, b) => String(b).localeCompare(String(a)));
  monthFilter.innerHTML = `<option value="all">全部月份</option>${months.map((month) => `<option value="${escapeAttr(month)}">${escapeHtml(formatMonthLabel(month))}</option>`).join("")}`;
  monthFilter.value = selectedMonth === "all" || months.includes(selectedMonth) ? selectedMonth : currentMonth;

  const filter = $("#categoryFilter");
  const current = filter.value || "all";
  const filterCategories = visibleCategories(current === "all" ? "" : current);
  filter.innerHTML = `<option value="all">全部分类</option>${filterCategories.map((category) => `<option value="${escapeAttr(category)}">${escapeHtml(category)}</option>`).join("")}`;
  filter.value = current === "all" || filterCategories.includes(current) ? current : "all";

  const payerFilter = $("#payerFilter");
  const currentPayer = payerFilter.value || "all";
  payerFilter.innerHTML = `<option value="all">全部付款人</option>${payerOptions.map((payer) => `<option value="${escapeAttr(payer)}">${escapeHtml(payer)}</option>`).join("")}`;
  payerFilter.value = currentPayer === "all" || payerOptions.includes(currentPayer) ? currentPayer : "all";

  const projectFilter = $("#projectFilter");
  const currentProject = projectFilter.value || "all";
  const projects = [...new Set(allConfirmedTransactions().map((transaction) => transaction.tripName).filter(Boolean))].sort();
  projectFilter.innerHTML = `<option value="all">全部项目</option>${projects.map((project) => `<option value="${escapeAttr(project)}">${escapeHtml(project)}</option>`).join("")}`;
  projectFilter.value = currentProject === "all" || projects.includes(currentProject) ? currentProject : "all";
}

function renderTransactions() {
  updateFilters();
  const month = $("#monthFilter").value || "all";
  const category = $("#categoryFilter").value || "all";
  const payerFilter = $("#payerFilter").value || "all";
  const scenario = $("#scenarioFilter").value || "all";
  const project = $("#projectFilter").value || "all";
  const search = normalizedRuleKey($("#transactionSearch").value);
  let transactions = allConfirmedTransactions().slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (month !== "all") transactions = transactions.filter((transaction) => monthFromDate(transaction.date) === month);
  if (scenario !== "all") transactions = transactions.filter((transaction) => transaction.scenario === scenario);
  if (project !== "all") transactions = transactions.filter((transaction) => transaction.tripName === project);
  if (payerFilter !== "all") transactions = transactions.filter((transaction) => normalizePerson(transaction.payer || "共同") === payerFilter);
  if (category !== "all") transactions = transactions.filter((transaction) => transaction.items?.some((item) => item.category === category));
  if (search) transactions = transactions.filter((transaction) => normalizedRuleKey(transactionSearchText(transaction)).includes(search));
  $("#transactionListTotal").textContent = `${transactions.length} 笔 · ${formatMoney(sum(transactions, (transaction) => transactionVisibleAmount(transaction, category)))}`;

  const list = $("#transactionList");
  list.innerHTML = "";
  if (!transactions.length) {
    list.innerHTML = `<div class="empty-state"><strong>没有匹配流水</strong></div>`;
    selectedTransactionId = "";
    renderTransactionDetail(null, category);
    return;
  }

  const selectedTransaction = transactions.find((transaction) => transactionStableId(transaction) === selectedTransactionId) || transactions[0];
  selectedTransactionId = transactionStableId(selectedTransaction);

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date || "未写日期";
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  Object.entries(groupedTransactions).forEach(([date, dayTransactions]) => {
    const dayGroup = document.createElement("section");
    dayGroup.className = "transaction-day-group";
    dayGroup.innerHTML = `
      <div class="transaction-day-header">
        <strong>${escapeHtml(formatDateLabel(date))}</strong>
        <span>${dayTransactions.length} 笔 · ${formatMoney(sum(dayTransactions, (transaction) => transactionVisibleAmount(transaction, category)))}</span>
      </div>
    `;

    dayTransactions.forEach((transaction) => {
      const card = document.createElement("button");
      const transactionId = transactionStableId(transaction);
      card.className = "transaction-card";
      card.type = "button";
      card.dataset.transactionId = transactionId;
      card.setAttribute("aria-pressed", transactionId === selectedTransactionId ? "true" : "false");
      if (transactionId === selectedTransactionId) card.classList.add("active");
      const filteredItems = (transaction.items || []).filter((item) => category === "all" || item.category === category);
      const visibleAmount = transactionVisibleAmount(transaction, category);
      const payer = normalizePerson(transaction.payer || "共同");
      const dominantCategory = transactionAvatarCategory(transaction, filteredItems);
      const displayName = transactionDisplayName(transaction, filteredItems);
      const categoryChips = topGroups(filteredItems, (item) => item.category).slice(0, 2).map(([itemCategory]) => `
        <span class="category-pill" style="--category-ink:${categoryInk(itemCategory)}">${escapeHtml(itemCategory)}</span>
      `).join("");
      const transactionMeta = [transaction.scenario, transactionTripMetaPart(transaction, displayName), payer, `${filteredItems.length || 0} 个明细`].filter(Boolean).join(" · ");
      card.innerHTML = `
        <div class="transaction-header">
          <div class="transaction-main merchant-line">
            ${merchantAvatar(displayName, dominantCategory)}
            <div class="merchant-copy">
              <strong>${escapeHtml(displayName)}</strong>
              <span class="meta">${escapeHtml(transactionMeta)}</span>
            </div>
          </div>
          <div class="transaction-category-pills">${categoryChips}</div>
          <span class="amount">${formatMoney(visibleAmount)}</span>
        </div>
      `;
      card.addEventListener("click", () => {
        selectedTransactionId = transactionId;
        list.querySelectorAll(".transaction-card").forEach((element) => {
          const active = element.dataset.transactionId === selectedTransactionId;
          element.classList.toggle("active", active);
          element.setAttribute("aria-pressed", active ? "true" : "false");
        });
        renderTransactionDetail(transaction, category);
      });
      dayGroup.appendChild(card);
    });

    list.appendChild(dayGroup);
  });

  renderTransactionDetail(selectedTransaction, category);
}

async function removeRecurringItem(item) {
  if (!confirm(`确定删除「${item.name}」这个固定支出吗？`)) return;
  store.recurring = store.recurring.filter((entry) => entry !== item);
  store.demo = false;
  await saveStore();
}

function renderRecurringEditForm(row, item) {
  row.classList.add("recurring-row-editing");
  row.innerHTML = `
    <form class="recurring-edit-form">
      <div class="recurring-edit-grid">
        <label>
          名称
          <input name="name" required value="${escapeAttr(item.name)}">
        </label>
        <label>
          分类
          <select name="category" required></select>
        </label>
        <label>
          月金额
          <input name="amount" required type="number" min="0" step="0.01" value="${Number(item.amount || 0)}">
        </label>
        <label>
          扣款日
          <input name="dueDay" required type="number" min="1" max="31" value="${Number(item.dueDay || 1)}">
        </label>
        <label>
          付款人
          <select name="payer"></select>
        </label>
        <label>
          必要性
          <select name="necessity">
            <option>必须</option>
            <option>可优化</option>
            <option>非必要</option>
          </select>
        </label>
      </div>
      <label class="recurring-active-check">
        <input name="active" type="checkbox" ${item.active ? "checked" : ""}>
        启用这个固定支出
      </label>
      <div class="recurring-edit-actions">
        <button class="icon-button pencil-action-button" type="submit" title="保存" aria-label="保存">${actionIconLabel("保存")}</button>
        <button class="ghost-button" data-action="cancel" type="button">取消</button>
        <button class="danger-button" data-action="delete" type="button">删除</button>
      </div>
    </form>
  `;

  const form = row.querySelector(".recurring-edit-form");
  populateCategorySelect(form.elements.namedItem("category"), item.category);
  populatePayerSelect(form.elements.namedItem("payer"), item.payer || "共同");
  form.elements.namedItem("necessity").value = item.necessity || "必须";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    item.name = String(data.get("name") || "").trim();
    item.category = String(data.get("category") || "其他");
    item.amount = Math.max(0, Number(data.get("amount") || 0));
    item.dueDay = Math.min(31, Math.max(1, Number(data.get("dueDay") || 1)));
    item.payer = normalizePerson(data.get("payer") || "共同");
    item.necessity = String(data.get("necessity") || "必须");
    item.active = form.elements.namedItem("active").checked;
    store.demo = false;
    await saveStore();
  });

  row.querySelector('[data-action="cancel"]').addEventListener("click", renderRecurring);
  row.querySelector('[data-action="delete"]').addEventListener("click", () => removeRecurringItem(item));
}

function renderRecurring() {
  const monthlyTotal = sum(store.recurring.filter((item) => item.active));
  $("#recurringTotal").textContent = `${formatMoney(monthlyTotal)} / 月`;
  const list = $("#recurringList");
  list.innerHTML = "";
  if (!store.recurring.length) {
    list.innerHTML = `<div class="empty-state"><strong>还没有固定支出</strong></div>`;
  } else {
    store.recurring.forEach((item) => {
      const row = document.createElement("div");
      row.className = "recurring-row";
      row.dataset.category = item.category;
      row.innerHTML = `
        <div class="recurring-main merchant-line">
          ${merchantAvatar(item.name, recurringAvatarCategory(item))}
          <div class="recurring-copy">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="meta">${escapeHtml(item.category)}${item.active ? "" : " · 暂停"}</span>
          </div>
        </div>
        <div class="recurring-side">
          <div class="amount">${formatMoney(item.amount)}</div>
          <div class="recurring-actions">
            <button class="ghost-button symbol-button" data-action="edit" type="button" title="编辑" aria-label="编辑 ${escapeAttr(item.name)}">${streamlineIcon("editCompact", "button-streamline-icon")}</button>
            <button class="ghost-button symbol-button" data-action="toggle" type="button" title="${item.active ? "暂停" : "启用"}" aria-label="${item.active ? "暂停" : "启用"} ${escapeAttr(item.name)}">${item.active ? "⏸" : "▶"}</button>
            <button class="danger-button symbol-button" data-action="delete" type="button" title="删除" aria-label="删除 ${escapeAttr(item.name)}">×</button>
          </div>
        </div>
      `;
      row.querySelector('[data-action="edit"]').addEventListener("click", () => renderRecurringEditForm(row, item));
      row.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
        item.active = !item.active;
        await saveStore();
      });
      row.querySelector('[data-action="delete"]').addEventListener("click", () => removeRecurringItem(item));
      list.appendChild(row);
    });
  }
}

function previousMonths() {
  const current = currentMonthKey();
  return [...new Set(allTransactionItems().map((item) => monthFromDate(item.date)).filter(Boolean))]
    .filter((month) => month !== current)
    .sort();
}

function previousCategoryAverages() {
  const months = previousMonths();
  const totals = {};
  months.forEach((month) => {
    const monthItems = itemsForMonth(month).filter((item) => !isRecurringFixedExpense(item));
    const byCategory = groupedBy(monthItems, (item) => item.category);
    Object.entries(byCategory).forEach(([category, amount]) => {
      totals[category] = (totals[category] || 0) + amount;
    });
  });
  return {
    count: months.length,
    averages: Object.fromEntries(Object.entries(totals).map(([category, amount]) => [category, amount / Math.max(months.length, 1)]))
  };
}

function shareNoise(seed) {
  const value = Math.sin(seed * 999.37) * 10000;
  return value - Math.floor(value);
}

function sharePoint(cx, cy, radius, angleDeg) {
  const angle = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function shareArcPoints(cx, cy, radius, startDeg, endDeg, seed, jitter = 1.8) {
  const sweep = Math.max(0.1, endDeg - startDeg);
  const steps = Math.max(5, Math.min(48, Math.round(sweep / 7)));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const angleJitter = (shareNoise(seed + index * 1.9) - 0.5) * 1.45;
    const radiusJitter = (shareNoise(seed + index * 2.7) - 0.5) * jitter +
      Math.sin(t * Math.PI * 4 + seed) * jitter * 0.36;
    return sharePoint(cx, cy, radius + radiusJitter, startDeg + sweep * t + angleJitter);
  });
}

function sharePath(points, close = true) {
  if (!points.length) return "";
  const lines = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
  return `${lines.join(" ")}${close ? " Z" : ""}`;
}

function shareCirclePath(cx, cy, radius, seed) {
  const points = Array.from({ length: 72 }, (_, index) => {
    const angle = (index / 72) * 360;
    const radiusJitter = (shareNoise(seed + index * 2.3) - 0.5) * 3.4 +
      Math.sin(index * 0.68 + seed) * 1.25;
    return sharePoint(cx, cy, radius + radiusJitter, angle);
  });
  return sharePath(points, true);
}

function shareSegmentPath(startPercent, endPercent, index, outerRadius = 110, innerRadius = 38) {
  const start = startPercent * 3.6;
  const end = endPercent * 3.6;
  const sweep = end - start;
  const gap = sweep > 8 ? Math.min(0.18, sweep * 0.01) : 0.03;
  const startDeg = start + gap;
  const endDeg = Math.max(startDeg + 0.6, end - gap);
  const outer = shareArcPoints(120, 120, outerRadius, startDeg, endDeg, 100 + index * 17, 3.85);
  const inner = shareArcPoints(120, 120, innerRadius, startDeg, endDeg, 200 + index * 19, 2.85).reverse();
  return sharePath([...outer, ...inner], true);
}

function shareBlobPath(cx, cy, rx, ry, rotationDeg, seed) {
  const rotation = (rotationDeg * Math.PI) / 180;
  const points = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2;
    const wobble = 1 +
      (shareNoise(seed + index * 2.1) - 0.5) * 0.34 +
      Math.sin(index * 1.3 + seed) * 0.055;
    const localX = Math.cos(angle) * rx * wobble;
    const localY = Math.sin(angle) * ry * wobble;
    return {
      x: cx + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: cy + localX * Math.sin(rotation) + localY * Math.cos(rotation)
    };
  });
  return sharePath(points, true);
}

function shareWavyStrokePath(cx, cy, length, rotationDeg, seed) {
  const rotation = (rotationDeg * Math.PI) / 180;
  const normal = rotation + Math.PI / 2;
  const halfLength = length / 2;
  const x1 = cx - Math.cos(rotation) * halfLength;
  const y1 = cy - Math.sin(rotation) * halfLength;
  const x2 = cx + Math.cos(rotation) * halfLength;
  const y2 = cy + Math.sin(rotation) * halfLength;
  const lift = (shareNoise(seed + 2.6) - 0.5) * 3.4;
  const controlX = cx + Math.cos(normal) * lift;
  const controlY = cy + Math.sin(normal) * lift;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function shareCrayonPatches(index, startPercent, endPercent) {
  const patches = [];
  const startDeg = startPercent * 3.6;
  const endDeg = endPercent * 3.6;
  const sweep = Math.max(0.1, endDeg - startDeg);
  const count = sweep < 11 ? 1 : Math.min(5, Math.max(2, Math.round(sweep / 27) + 1));

  for (let patchIndex = 0; patchIndex < count; patchIndex += 1) {
    const seed = 940 + index * 71 + patchIndex * 23;
    const t = (patchIndex + 0.5) / count;
    const angleJitter = (shareNoise(seed) - 0.5) * Math.min(14, sweep * 0.32);
    const angle = startDeg + sweep * t + angleJitter;
    const radius = 43 + shareNoise(seed + 5.8) * 60;
    const point = sharePoint(120, 120, radius, angle);
    const rx = 12 + shareNoise(seed + 9.2) * 15;
    const ry = 6 + shareNoise(seed + 13.4) * 10;
    const rotation = angle + 72 + (shareNoise(seed + 17.6) - 0.5) * 34;
    const className = patchIndex % 3 === 0
      ? "share-crayon-patch share-crayon-highlight"
      : patchIndex % 3 === 1
        ? "share-crayon-patch share-crayon-shade"
        : "share-crayon-patch";
    patches.push(`<path class="${className}" d="${shareBlobPath(point.x, point.y, rx, ry, rotation, seed)}"></path>`);
  }

  const icingCount = sweep < 18 ? 1 : Math.min(2, Math.max(1, Math.round(sweep / 52)));
  for (let icingIndex = 0; icingIndex < icingCount; icingIndex += 1) {
    const seed = 1410 + index * 83 + icingIndex * 31;
    const t = (icingIndex + 0.58) / icingCount;
    const angle = startDeg + sweep * t + (shareNoise(seed) - 0.5) * Math.min(18, sweep * 0.28);
    const point = sharePoint(120, 120, 45 + shareNoise(seed + 4.2) * 55, angle);
    const rx = 12 + shareNoise(seed + 8.1) * 13;
    const ry = 5 + shareNoise(seed + 12.4) * 7;
    const rotation = angle + 78 + (shareNoise(seed + 16.7) - 0.5) * 42;
    patches.push(`<path class="share-icing-patch" d="${shareBlobPath(point.x, point.y, rx, ry, rotation, seed)}"></path>`);
  }

  const sprinkleCount = sweep < 18 ? 1 : Math.min(6, Math.max(2, Math.round(sweep / 28)));
  for (let sprinkleIndex = 0; sprinkleIndex < sprinkleCount; sprinkleIndex += 1) {
    const seed = 1840 + index * 97 + sprinkleIndex * 29;
    const t = (sprinkleIndex + 0.45) / sprinkleCount;
    const angle = startDeg + sweep * t + (shareNoise(seed) - 0.5) * Math.min(16, sweep * 0.24);
    const point = sharePoint(120, 120, 44 + shareNoise(seed + 5.5) * 58, angle);
    const length = 5.6 + shareNoise(seed + 9.3) * 6;
    const rotation = angle + 96 + (shareNoise(seed + 13.7) - 0.5) * 66;
    patches.push(`<path class="share-sprinkle" d="${shareWavyStrokePath(point.x, point.y, length, rotation, seed)}"></path>`);
  }

  return patches.join("");
}

function renderShareDonutSvg(shares, total) {
  let cursor = 0;
  const segments = shares.map((share, index) => {
    const start = cursor;
    const percent = total ? (share.amount / total) * 100 : 100 / Math.max(shares.length, 1);
    cursor += percent;
    const path = shareSegmentPath(start, cursor, index);
    const clipId = `share-slice-${index}`;
    const fill = escapeAttr(categoryInk(share.category));
    return `
      <clipPath id="${clipId}"><path d="${path}"></path></clipPath>
      <path class="share-slice" data-share-index="${index}" data-share-category="${escapeAttr(share.category)}" d="${path}" fill="${fill}"></path>
      <g class="share-slice-texture" data-share-index="${index}" clip-path="url(#${clipId})" style="--share-color:${fill}">${shareCrayonPatches(index, start, cursor)}</g>
    `;
  }).join("");

  return `
    <svg class="share-donut-svg" viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <defs>${segments.match(/<clipPath[\s\S]*?<\/clipPath>/g)?.join("") || ""}</defs>
      <path class="share-donut-bread" fill-rule="evenodd" d="${shareCirclePath(120, 120, 115, 501)} ${shareCirclePath(120, 120, 30, 601)}"></path>
      <g class="share-slices">${segments.replace(/<clipPath[\s\S]*?<\/clipPath>/g, "")}</g>
      <path class="share-donut-outer-sketch" d="${shareCirclePath(120, 120, 115, 301)}"></path>
      <path class="share-donut-inner-sketch" d="${shareCirclePath(120, 120, 31, 401)}"></path>
    </svg>
  `;
}

function renderCategoryShare(items, total) {
  const chart = $("#categoryShareChart");
  const groups = topGroups(items, (item) => item.category);
  if (!groups.length) {
    chart.innerHTML = `<div class="empty-state"><strong>暂无生活开销</strong></div>`;
    return;
  }

  const visibleLimit = groups.length <= 8 ? groups.length : 6;
  const top = groups.slice(0, visibleLimit).map(([category, amount]) => ({ category, label: category, amount }));
  const restGroups = groups.slice(visibleLimit);
  const restAmount = restGroups.reduce((amount, [, value]) => amount + value, 0);
  const restSummary = restGroups.slice(0, 3).map(([category]) => category).join("、");
  const restLabel = restGroups.length > 3 ? `其余：${restSummary}等` : `其余：${restSummary}`;
  const restDetail = restGroups.map(([category, amount]) => `${category} ${formatMoney(amount)}`).join("，");
  const shares = restAmount > 0
    ? [...top, { category: "其余", label: restLabel, amount: restAmount, detail: restDetail }]
    : top;

  chart.innerHTML = `
    <div class="share-donut-layout">
      <div class="share-donut" aria-label="类别占比甜甜圈">
        ${renderShareDonutSvg(shares, total)}
      </div>
      <div class="share-legend">
        ${shares.map((share, index) => {
          const percent = total ? Math.round((share.amount / total) * 100) : 0;
          const dataCategory = share.category === "其余" ? "" : ` data-category="${escapeAttr(share.category)}"`;
          const shareLabel = share.label || share.category;
          const shareDetail = share.detail || `${shareLabel} ${formatMoney(share.amount)}`;
          const tilt = (index % 2 ? 0.22 : -0.18) + (index % 3) * 0.08;
          return `
            <div class="share-legend-row"${dataCategory} data-share-index="${index}" role="button" tabindex="0" aria-label="${escapeAttr(`${shareLabel} ${percent}% ${formatMoney(share.amount)} ${shareDetail}`)}" title="${escapeAttr(shareDetail)}" style="--share-color: ${escapeAttr(categoryInk(share.category))}; --row-tilt: ${tilt.toFixed(2)}deg">
              <span class="share-dot" aria-hidden="true"></span>
              <strong>${escapeHtml(shareLabel)}</strong>
              <span class="share-percent">${percent}%</span>
              <span class="share-amount">${formatMoney(share.amount)}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
  attachCategoryShareInteractions(chart);
}

function attachCategoryShareInteractions(chart) {
  const slices = Array.from(chart.querySelectorAll(".share-slice"));
  const textures = Array.from(chart.querySelectorAll(".share-slice-texture"));
  const rows = Array.from(chart.querySelectorAll(".share-legend-row"));
  let pinnedIndex = "";

  const setActive = (index, pinned = false) => {
    const activeIndex = String(index);
    if (pinned) pinnedIndex = pinnedIndex === activeIndex ? "" : activeIndex;
    const targetIndex = pinned ? pinnedIndex : activeIndex;
    chart.classList.toggle("share-has-active", Boolean(targetIndex));
    [...slices, ...textures, ...rows].forEach((element) => {
      const active = targetIndex && element.dataset.shareIndex === targetIndex;
      element.classList.toggle("is-active", Boolean(active));
      element.classList.toggle("is-dimmed", Boolean(targetIndex && !active));
      if (element.classList.contains("share-legend-row")) {
        element.setAttribute("aria-pressed", active ? "true" : "false");
      }
    });
  };

  const restorePinned = () => {
    if (pinnedIndex) setActive(pinnedIndex);
    else {
      chart.classList.remove("share-has-active");
      [...slices, ...textures, ...rows].forEach((element) => {
        element.classList.remove("is-active", "is-dimmed");
        if (element.classList.contains("share-legend-row")) element.setAttribute("aria-pressed", "false");
      });
    }
  };

  [...slices, ...rows].forEach((element) => {
    const index = element.dataset.shareIndex;
    ["mouseenter", "pointerenter", "mouseover"].forEach((eventName) => {
      element.addEventListener(eventName, () => setActive(index));
    });
    ["mouseleave", "pointerleave"].forEach((eventName) => {
      element.addEventListener(eventName, restorePinned);
    });
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      setActive(index, true);
    });
  });

  rows.forEach((row) => {
    row.addEventListener("focus", () => setActive(row.dataset.shareIndex));
    row.addEventListener("blur", restorePinned);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActive(row.dataset.shareIndex, true);
      }
      if (event.key === "Escape") {
        pinnedIndex = "";
        restorePinned();
      }
    });
  });

  chart.addEventListener("click", () => {
    pinnedIndex = "";
    restorePinned();
  });
}

function renderWeeklyChart(items) {
  const weeks = [1, 2, 3, 4, 5].map((week) => ({
    week,
    amount: sum(items.filter((item) => weekIndexInMonth(item.date) === week))
  }));
  const max = Math.max(...weeks.map((week) => week.amount), 1);
  $("#weeklySpendChart").innerHTML = weeks.map((week) => {
    const height = Math.max(8, Math.round((week.amount / max) * 160));
    return `
      <div class="week-bar">
        <div class="week-amount">${formatMoney(week.amount)}</div>
        <div class="week-track"><div class="week-fill" style="height:${height}px"></div></div>
        <strong>第 ${week.week} 周</strong>
      </div>
    `;
  }).join("");
}

function renderHistoryComparison(items) {
  const currentByCategory = groupedBy(items, (item) => item.category);
  const { count, averages } = previousCategoryAverages();
  const historyMonthCount = $("#historyMonthCount");
  if (historyMonthCount) historyMonthCount.textContent = `${count} 个月历史`;
  const rows = Object.entries(currentByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  if (!rows.length) {
    $("#historyComparison").innerHTML = `<div class="empty-state"><strong>暂无数据</strong></div>`;
    return;
  }
  if (!count) {
    $("#historyComparison").innerHTML = `<div class="empty-state"><strong>还没有历史平均</strong></div>`;
    return;
  }
  $("#historyComparison").innerHTML = rows.map(([category, amount]) => {
    const average = averages[category] || 0;
    const delta = amount - average;
    const deltaText = average ? `${delta >= 0 ? "高于" : "低于"}月均 ${formatMoney(Math.abs(delta))}` : "历史月均为 0";
    const percent = average ? Math.round((amount / average) * 100) : 100;
    return `
      <div class="history-row" data-category="${escapeAttr(category)}">
        <div>
          <strong>${escapeHtml(category)}</strong>
          <span class="meta">本月 ${formatMoney(amount)} · 月均 ${formatMoney(average)}</span>
        </div>
        <div class="history-meter">
          <span>${deltaText}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(Math.max(percent, 3), 100)}%"></div></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderVisualReport(items, total, livingItems, livingTotal, fixedTotal) {
  const { average, count } = previousMonthAverage();
  const delta = total - average;
  const topCategory = topGroups(livingItems, (item) => item.category)[0];
  $("#reportTotalExpense").textContent = formatMoney(total);
  $("#reportAverageExpense").textContent = count ? formatMoney(average) : "$0.00";
  $("#reportHistoryDelta").textContent = count
    ? `${delta >= 0 ? "高于" : "低于"}历史月均 ${formatMoney(Math.abs(delta))}`
    : "";
  $("#reportAverageHint").textContent = count ? `基于过去 ${count} 个月` : "暂无历史平均";
  $("#reportTopCategory").textContent = topCategory?.[0] || "暂无";
  $("#reportTopCategoryAmount").textContent = topCategory ? formatMoney(topCategory[1]) : "$0.00";
  $("#categoryShareHint").textContent = formatMoney(livingTotal);
  $("#reportFixedSpendTotal").textContent = formatMoney(fixedTotal);
  $("#reportFixedSpendStrip").classList.toggle("hidden", !fixedTotal);
  renderCategoryShare(livingItems, livingTotal);
  renderWeeklyChart(livingItems);
  renderHistoryComparison(livingItems);
}

function readableTopCategoryBody(topCategory, topMerchant, livingTotal) {
  if (!topCategory) return "暂无。";
  const [category, amount] = topCategory;
  const percent = livingTotal ? Math.round((amount / livingTotal) * 100) : 0;
  const merchant = topMerchant?.[0] || "";
  const genericMerchants = ["Weekend Trip", "Trip Receipt", "Monthly Bills", "小额消费"];

  if (category === "旅行度假") {
    return merchant && !genericMerchants.includes(merchant)
      ? `这个月生活开销里，旅行/出行最多，主要花在 ${merchant}。`
      : `这个月生活开销里，旅行/出行最多，占 ${percent}%。`;
  }

  if (merchant && !genericMerchants.includes(merchant)) {
    return `这个月生活开销里，${category}花得最多；其中 ${merchant} 花得最多。`;
  }

  return `这个月生活开销里，${category}花得最多，占 ${percent}%。`;
}

function generateReport() {
  const items = analysisItems();
  const livingItems = items.filter((item) => !isRecurringFixedExpense(item));
  const fixedItems = items.filter(isRecurringFixedExpense);
  const total = sum(items);
  const livingTotal = sum(livingItems);
  const fixedTotal = sum(fixedItems);
  const must = sum(livingItems.filter((item) => item.necessity === "必须"));
  const flex = sum(livingItems.filter((item) => item.necessity === "可优化"));
  const optional = sum(livingItems.filter((item) => item.necessity === "非必要"));
  const topCategory = topGroups(livingItems, (item) => item.category)[0];
  const topMerchant = topGroups(livingItems, (item) => item.merchant)[0];
  const optionalItems = livingItems.filter((item) => item.necessity === "非必要").sort((a, b) => b.amount - a.amount).slice(0, 3);
  const subscriptions = livingItems.filter((item) => item.category === "订阅服务");
  const grocery = livingItems.filter((item) => item.category === "食品杂货");
  const eatingOut = livingItems.filter((item) => item.category === "外食/咖啡");
  const focusCategoryTotals = ["外食/咖啡", "网购杂项", "旅行度假"]
    .map((category) => [category, sum(livingItems.filter((item) => item.category === category))])
    .filter(([, amount]) => amount > 0);
  const ownership = ownerTotals(livingItems);
  const ownershipKeys = [...payerOptions];
  const ownershipTotal = sum(ownershipKeys, (owner) => ownership[owner] || 0);
  const projectTotals = currentMonthTransactions()
    .filter((transaction) => transaction.tripName)
    .reduce((acc, transaction) => {
      acc[transaction.tripName] = (acc[transaction.tripName] || 0) + Number(transaction.total || 0);
      return acc;
    }, {});
  const topProject = Object.entries(projectTotals).sort((a, b) => b[1] - a[1])[0];

  $("#reportMonth").textContent = currentMonthKey();
  renderVisualReport(items, total, livingItems, livingTotal, fixedTotal);
  const report = $("#monthlyReport");
  if (!livingItems.length) {
    report.innerHTML = `<div class="empty-state"><strong>还没有生活开销</strong></div>`;
    return;
  }

  const lines = [
    {
      title: "生活开销",
      category: topCategory?.[0] || "其他",
      amount: livingTotal,
      summary: fixedTotal ? `固定支出另计 ${formatMoney(fixedTotal)}` : `必须项占 ${livingTotal ? Math.round((must / livingTotal) * 100) : 0}%`,
      body: fixedTotal ? `固定支出另计 ${formatMoney(fixedTotal)}。` : `必须项占 ${livingTotal ? Math.round((must / livingTotal) * 100) : 0}%。`,
      details: [
        `生活开销合计 ${formatMoney(livingTotal)}，这里不含固定支出。`,
        `必须 ${formatMoney(must)}，可优化 ${formatMoney(flex)}，非必要 ${formatMoney(optional)}。`,
        fixedTotal ? `固定支出另计 ${formatMoney(fixedTotal)}。` : ""
      ]
    },
    {
      title: "最大类别",
      category: topCategory?.[0] || "其他",
      amount: topCategory?.[1] || 0,
      summary: topCategory ? `${topCategory[0]}占 ${livingTotal ? Math.round((topCategory[1] / livingTotal) * 100) : 0}%` : "暂无类别",
      body: readableTopCategoryBody(topCategory, topMerchant, livingTotal),
      details: [
        readableTopCategoryBody(topCategory, topMerchant, livingTotal),
        topCategory ? `${topCategory[0]}合计 ${formatMoney(topCategory[1])}，占生活开销 ${livingTotal ? Math.round((topCategory[1] / livingTotal) * 100) : 0}%。` : "",
        topMerchant ? `最大商家/项目：${topMerchant[0]} ${formatMoney(topMerchant[1])}。` : ""
      ]
    },
    {
      title: "可优化",
      category: topCategory?.[0] || "其他",
      amount: flex,
      summary: flex ? `弹性支出 ${formatMoney(flex)}` : "弹性支出很少",
      body: flex ? `弹性支出 ${formatMoney(flex)}，先看外食、网购和旅行。` : "这个月弹性支出很少。",
      details: [
        flex ? `可优化支出合计 ${formatMoney(flex)}。` : "这个月弹性支出很少。",
        focusCategoryTotals.length ? `重点类别：${focusCategoryTotals.map(([category, amount]) => `${category} ${formatMoney(amount)}`).join("、")}。` : "",
        "可优化不是不该花，只是下月最值得先复盘。"
      ]
    },
    {
      title: "明显可省",
      category: "礼物社交",
      amount: optional,
      summary: optional ? `非必要 ${formatMoney(optional)}` : "非必要不多",
      body: optionalItems.length
        ? `优先看 ${optionalItems.map((item) => `${item.name} ${formatMoney(item.amount)}`).join("、")}。`
        : "非必要支出不多。",
      details: optionalItems.length
        ? [
            `非必要支出合计 ${formatMoney(optional)}。`,
            `优先看 ${optionalItems.map((item) => `${item.name} ${formatMoney(item.amount)}`).join("、")}。`
          ]
        : ["非必要支出不多，保持现在的节奏就好。"]
    }
  ];

  if (topProject) {
    const projectDetail = Object.entries(projectTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => `${name} ${formatMoney(amount)}`)
      .join("、");
    lines.push({
      title: "项目/旅行",
      category: "旅行度假",
      amount: topProject[1],
      summary: topProject[0],
      body: `${topProject[0]} 本月花了 ${formatMoney(topProject[1])}。`,
      details: [
        `${topProject[0]} 是本月最大的项目/旅行支出，合计 ${formatMoney(topProject[1])}。`,
        projectDetail ? `项目排行：${projectDetail}。` : ""
      ]
    });
  }

  if (peopleFromStore().length > 1 && ownershipTotal > 0) {
    const ownershipSummary = ownershipKeys
      .map((owner) => `${owner} ${Math.round((ownership[owner] / ownershipTotal) * 100)}%`)
      .join(" · ");
    const ownershipDetails = ownershipKeys.map((owner) =>
      `${owner} ${formatMoney(ownership[owner] || 0)}，占 ${ownershipTotal ? Math.round(((ownership[owner] || 0) / ownershipTotal) * 100) : 0}%。`
    );
    lines.push({
      title: "归属拆分",
      category: "其他",
      amount: ownershipTotal,
      summary: ownershipSummary,
      body: ownershipKeys.map((owner) => `${owner} ${formatMoney(ownership[owner] || 0)}`).join("，") + "。",
      details: ownershipDetails
    });
  }

  if (subscriptions.length) {
    lines.push({
      title: "订阅检查",
      category: "订阅服务",
      amount: sum(subscriptions),
      summary: `${subscriptions.length} 项订阅`,
      body: "月底只检查一件事：这个月有没有实际用到。",
      details: [
        `订阅服务合计 ${formatMoney(sum(subscriptions))}。`,
        `本月订阅：${subscriptions.slice(0, 5).map((item) => `${item.name} ${formatMoney(item.amount)}`).join("、")}。`,
        subscriptions.length > 5 ? `还有 ${subscriptions.length - 5} 项没有列出。` : ""
      ]
    });
  }

  if (sum(eatingOut) > sum(grocery) * 0.35) {
    lines.push({
      title: "外食提醒",
      category: "外食/咖啡",
      amount: sum(eatingOut),
      summary: `外食 ${formatMoney(sum(eatingOut))}`,
      body: "外食偏高，下月少一次餐厅就能看出变化。",
      details: [
        `外食/咖啡合计 ${formatMoney(sum(eatingOut))}。`,
        `食品杂货合计 ${formatMoney(sum(grocery))}。`,
        "如果想微调，下月少一次餐厅就能看出变化。"
      ]
    });
  }

  const budget = Number(store.settings?.monthlyBudget || total);
  const recommendedFlex = Math.max(0, Math.round(flex * 0.9));
  const recommendedOptional = Math.max(0, Math.round(optional * 0.7));
  lines.push({
    title: "下月预算",
    category: "其他",
    amount: budget,
    summary: `建议预算 ${formatMoney(budget)}`,
    body: `可优化上限 ${formatMoney(recommendedFlex)}，非必要上限 ${formatMoney(recommendedOptional)}。`,
    details: [
      `下月总预算 ${formatMoney(budget)}。`,
      `可优化上限 ${formatMoney(recommendedFlex)}，非必要上限 ${formatMoney(recommendedOptional)}。`
    ]
  });

  const sketchMarks = [
    { text: "○", size: 22, right: 16, bottom: 13, tilt: -12 },
    { text: "*", size: 14, right: 31, bottom: 20, tilt: 10 },
    { text: "->", size: 13, right: 11, bottom: 17, tilt: 5 },
    { text: "!", size: 20, right: 24, bottom: 11, tilt: -7 },
    { text: "○", size: 17, right: 36, bottom: 16, tilt: 11 },
    { text: "*", size: 18, right: 18, bottom: 23, tilt: -14 },
    { text: "->", size: 12, right: 29, bottom: 12, tilt: -4 },
    { text: "!", size: 16, right: 13, bottom: 22, tilt: 8 }
  ];
  const tapeStyles = {
    0: { left: 21, width: 46, tilt: -5 },
    2: { right: 18, width: 38, tilt: 6 },
    5: { left: 42, width: 52, tilt: 3 }
  };
  report.innerHTML = lines.map((line, index) => {
    const category = line.category || "其他";
    const detailId = `report_detail_${index}`;
    const details = (line.details?.length ? line.details : [line.body]).filter(Boolean);
    const sketch = sketchMarks[index % sketchMarks.length];
    const tape = tapeStyles[index];
    const tilt = ((index % 2 ? 0.7 : -0.55) + (index % 3) * 0.11).toFixed(2);
    const tapeVars = tape
      ? `; --tape-left:${typeof tape.left === "number" ? `${tape.left}px` : "auto"}; --tape-right:${typeof tape.right === "number" ? `${tape.right}px` : "auto"}; --tape-width:${tape.width}px; --tape-tilt:${tape.tilt}deg`
      : "";
    return `
    <div class="report-line-block" style="--category-ink:${categoryInk(category)}; --note-tilt:${tilt}deg; --mark-size:${sketch.size}px; --mark-right:${sketch.right}px; --mark-bottom:${sketch.bottom}px; --mark-tilt:${sketch.tilt}deg${tapeVars}">
      <button class="report-line" type="button" data-report-toggle data-category="${escapeAttr(category)}" aria-expanded="false" aria-controls="${escapeAttr(detailId)}">
        ${tape ? `<span class="report-tape-corner" aria-hidden="true"></span>` : ""}
        <span class="report-sketch-mark" aria-hidden="true">${escapeHtml(sketch.text)}</span>
        <span class="report-line-copy">
          <strong>${escapeHtml(line.title)}</strong>
          <p>${escapeHtml(line.summary || line.body)}</p>
        </span>
        <span class="amount">${formatMoney(line.amount)}</span>
        <span class="report-expand-mark" aria-hidden="true"></span>
      </button>
      <div class="report-line-detail" id="${escapeAttr(detailId)}" hidden>
        ${details.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
      </div>
    </div>
  `;
  }).join("");
}

function bindMonthlyReportDetails() {
  const report = $("#monthlyReport");
  report.addEventListener("click", (event) => {
    const button = event.target.closest("[data-report-toggle]");
    if (!button || !report.contains(button)) return;

    const detail = document.getElementById(button.getAttribute("aria-controls"));
    const block = button.closest(".report-line-block");
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    block?.classList.toggle("expanded", !expanded);
    if (detail) detail.hidden = expanded;
  });
}

function renderMonthEndBanner() {
  const show = store && isMonthEndEvening();
  $("#monthEndBanner").classList.toggle("hidden", !show);
}

function render() {
  if (!store) return;
  syncPayerOptions();
  renderMonthEndBanner();
  renderDashboard();
  renderPending();
  renderTransactions();
  renderRecurring();
  generateReport();
  refreshCategoryControls();
  refreshPayerControls();
}

function bindFileInput() {
  $("#receiptFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    selectedFileName = file.name;
    $("#fileName").textContent = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      selectedImageDataUrl = String(reader.result || "");
      if (file.type.startsWith("image/")) {
        $("#imagePreview").src = selectedImageDataUrl;
      } else {
        $("#imagePreview").removeAttribute("src");
      }
      $("#previewWrap").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function bindImportFileInput() {
  $("#importFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    selectedImportFileName = file.name;
    selectedImportImageDataUrl = "";
    $("#importFileName").textContent = file.name;
    $("#importPreviewWrap").classList.remove("hidden");

    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        selectedImportImageDataUrl = value;
      } else {
        $("#importText").value = value;
      }
    };

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}

function bindRecurringForm() {
  const form = $("#recurringForm");
  populateCategorySelect(form.elements.namedItem("category"), "订阅服务");
  populatePayerSelect(form.elements.namedItem("payer"), defaultPayer());
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    store.recurring.unshift({
      id: uid("rec"),
      name: data.get("name"),
      category: data.get("category"),
      amount: Number(data.get("amount") || 0),
      cycle: "每月",
      dueDay: Number(data.get("dueDay") || 1),
      payer: normalizePerson(data.get("payer") || defaultPayer()),
      necessity: data.get("necessity"),
      active: true
    });
    store.demo = false;
    form.reset();
    populateCategorySelect(form.elements.namedItem("category"), "订阅服务");
    populatePayerSelect(form.elements.namedItem("payer"), defaultPayer());
    await saveStore();
  });
}

function bindTextExpenseForm() {
  resetTextExpenseDefaults();
  renderQuickTemplates();
  $("#textExpenseForm").addEventListener("submit", saveTextExpense);
  $("#textExpenseInput").addEventListener("input", applyTextExpenseGuess);
  $("#voiceExpenseButton").addEventListener("click", startVoiceExpense);
}

function bindEntryDoodleDrag() {
  const doodle = $("#entryHeadingDoodle");
  const track = doodle?.closest(".text-expense-input-wrap");
  if (!doodle || !track) return;

  const storageKey = "meowney-entry-doodle-position";
  let dragState = null;
  let resizeFrame = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const canMeasure = () => Boolean(track.getClientRects().length && doodle.getClientRects().length);
  const maxLeft = () => Math.max(0, track.clientWidth - doodle.offsetWidth);
  const currentLeft = () => clamp(doodle.offsetLeft, 0, maxLeft());

  const readStoredRatio = () => {
    try {
      const stored = window.localStorage?.getItem(storageKey);
      if (stored == null) return null;
      const value = Number(stored);
      return Number.isFinite(value) ? clamp(value, 0, 1) : null;
    } catch (error) {
      return null;
    }
  };

  const storeRatio = (ratio) => {
    try {
      window.localStorage?.setItem(storageKey, clamp(ratio, 0, 1).toFixed(4));
    } catch (error) {
      // Dragging should keep working even when browser storage is unavailable.
    }
  };

  const updateAria = (ratio) => {
    const percent = Math.round(clamp(ratio, 0, 1) * 100);
    doodle.setAttribute("aria-valuenow", String(percent));
    doodle.setAttribute("aria-valuetext", `${percent}%`);
  };

  const setLeft = (left, shouldPersist = false) => {
    if (!canMeasure()) return;
    const max = maxLeft();
    const nextLeft = clamp(left, 0, max);
    const ratio = max ? nextLeft / max : 0;
    track.style.setProperty("--entry-doodle-left", `${nextLeft.toFixed(1)}px`);
    updateAria(ratio);
    if (shouldPersist) storeRatio(ratio);
  };

  const applyStoredPosition = () => {
    if (!canMeasure()) return;
    const storedRatio = readStoredRatio();
    if (storedRatio === null) {
      track.style.removeProperty("--entry-doodle-left");
      updateAria(maxLeft() ? currentLeft() / maxLeft() : 0);
      return;
    }
    setLeft(storedRatio * maxLeft());
  };

  syncEntryDoodlePosition = applyStoredPosition;

  doodle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !canMeasure()) return;
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startLeft: currentLeft(),
      lastX: event.clientX
    };
    doodle.classList.add("is-dragging");
    document.body.classList.add("entry-doodle-dragging");
    doodle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  const moveDrag = (clientX) => {
    if (!dragState) return;
    dragState.lastX = clientX;
    setLeft(dragState.startLeft + clientX - dragState.startX);
  };

  const finishDragAt = (clientX, pointerId = null) => {
    if (!dragState) return;
    if (pointerId !== null && dragState.pointerId !== pointerId) return;
    setLeft(dragState.startLeft + clientX - dragState.startX, true);
    const releasePointerId = dragState.pointerId;
    dragState = null;
    doodle.classList.remove("is-dragging");
    document.body.classList.remove("entry-doodle-dragging");
    if (releasePointerId !== null && doodle.hasPointerCapture(releasePointerId)) {
      doodle.releasePointerCapture(releasePointerId);
    }
  };

  const finishDrag = (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    finishDragAt(event.clientX, event.pointerId);
  };

  const cancelDrag = () => {
    if (!dragState) return;
    finishDragAt(dragState.lastX, dragState.pointerId);
  };

  doodle.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    moveDrag(event.clientX);
    event.preventDefault();
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    moveDrag(event.clientX);
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragState) return;
    moveDrag(event.clientX);
  });

  window.addEventListener("mouseup", (event) => {
    if (!dragState) return;
    finishDragAt(event.clientX);
  });

  doodle.addEventListener("pointerup", finishDrag);
  doodle.addEventListener("pointercancel", finishDrag);
  doodle.addEventListener("lostpointercapture", cancelDrag);
  window.addEventListener("blur", cancelDrag);

  doodle.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || !canMeasure()) return;
    const step = event.shiftKey ? 24 : 10;
    const nextLeft = {
      ArrowLeft: currentLeft() - step,
      ArrowRight: currentLeft() + step,
      Home: 0,
      End: maxLeft()
    }[event.key];
    setLeft(nextLeft, true);
    event.preventDefault();
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(applyStoredPosition);
  });
}

function bindGlobalActions() {
  $("#authForm").addEventListener("submit", submitAuth);
  $$("[data-entry-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.entryView));
  });
  $("#parseButton").addEventListener("click", parseReceipt);
  $$("#view-capture [data-capture-mode]").forEach((button) => {
    button.addEventListener("click", () => switchCaptureMode(button.dataset.captureMode));
  });
  switchCaptureMode("upload");
  populatePayerSelect($("#importPayer"), defaultPayer());
  $("#parseImportButton").addEventListener("click", parseOnlineImport);
  $("#importPlatform").addEventListener("change", updateImportPlatformCustom);
  $$("#view-import [data-import-mode]").forEach((button) => {
    button.addEventListener("click", () => switchImportMode(button.dataset.importMode));
  });
  updateImportPlatformCustom();
  switchImportMode("paste");
  $("#openReportButton").addEventListener("click", () => switchView("report"));
  $("#logoutButton").addEventListener("click", logout);
  $("#budgetEditButton").addEventListener("click", startBudgetEdit);
  $("#budgetForm").addEventListener("submit", saveMonthlyBudget);
  $("#settingsButton").addEventListener("click", openSettingsSheet);
  $("#settingsCloseButton").addEventListener("click", closeSettingsSheet);
  $("#settingsCancelButton").addEventListener("click", closeSettingsSheet);
  $("#addPersonButton").addEventListener("click", addPersonSettingRow);
  $("#peopleSettingsForm").addEventListener("submit", savePeopleSettings);
  $("#dashboardInsightButton").addEventListener("click", toggleDashboardInsight);
  $("#dashboardInsightCloseButton").addEventListener("click", closeDashboardInsight);
  $("#dashboardInsightCollapseButton").addEventListener("click", closeDashboardInsight);
  $("#dashboardInsightReportButton").addEventListener("click", () => {
    closeDashboardInsight();
    switchView("report");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDashboardInsight();
      closeSettingsSheet();
    }
  });
  $("#transactionSearch").addEventListener("input", renderTransactions);
  $("#monthFilter").addEventListener("change", renderTransactions);
  $("#categoryFilter").addEventListener("change", renderTransactions);
  $("#payerFilter").addEventListener("change", renderTransactions);
  $("#scenarioFilter").addEventListener("change", renderTransactions);
  $("#projectFilter").addEventListener("change", renderTransactions);
}

async function init() {
  buildNav();
  bindAutoHidingNav();
  bindFileInput();
  bindImportFileInput();
  bindRecurringForm();
  bindTextExpenseForm();
  bindEntryDoodleDrag();
  bindMonthlyReportDetails();
  bindGlobalActions();
  setInterval(renderMonthEndBanner, 60 * 1000);
  $("#startOpenButton")?.addEventListener("click", openBookFromStart);
  await openBookFromStart();
}

init();
