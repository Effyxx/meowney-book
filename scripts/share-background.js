const fs = require("fs");
const fsp = require("fs/promises");
const net = require("net");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const PID_FILE = path.join(DATA_DIR, "share.pid");
const LOG_FILE = path.join(DATA_DIR, "share.log");
const PORT = String(process.env.PORT || "3000");
const LISTEN_HOST = process.env.HOST || "0.0.0.0";

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    timeout: 15000,
    env: {
      ...process.env,
      TAILSCALE_BE_CLI: "1"
    }
  });
}

function commandOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

function getTailscaleIp() {
  const result = run("tailscale", ["ip", "-4"]);
  const output = commandOutput(result);
  if (result.error || result.status !== 0 || /failed|error|not logged in|not running|stopped/i.test(output)) {
    return "";
  }
  return output.split(/\s+/).find(Boolean) || "";
}

function isPortOpen(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 1200 });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

async function readPid() {
  try {
    return Number((await fsp.readFile(PID_FILE, "utf8")).trim());
  } catch (error) {
    return 0;
  }
}

function isProcessAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

async function stopTrackedProcess(pid) {
  try {
    process.kill(pid, "SIGTERM");
  } catch (error) {
    // The PID file can outlive the process; removing it is enough.
  }
  await fsp.rm(PID_FILE, { force: true });
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const accessHost = getTailscaleIp();
  if (!accessHost) {
    console.error("Tailscale 还没有准备好。请先打开 Tailscale App 并登录。");
    process.exit(1);
  }

  await fsp.mkdir(DATA_DIR, { recursive: true });
  const pid = await readPid();
  const existingShared = isProcessAlive(pid) && await isPortOpen(accessHost, Number(PORT));
  if (existingShared) {
    if (await isPortOpen("127.0.0.1", Number(PORT))) {
      console.log(`Meowney 已经在后台运行：${pid}`);
      console.log(`本机访问：http://127.0.0.1:${PORT}`);
      console.log(`共享访问：http://${accessHost}:${PORT}`);
      return;
    }

    console.log("检测到旧版后台共享只监听 Tailscale 地址，正在重启以恢复本机访问。");
    await stopTrackedProcess(pid);
    await pause(500);
  }

  const logFd = fs.openSync(LOG_FILE, "a");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: {
      ...process.env,
      HOST: LISTEN_HOST,
      PORT
    }
  });
  child.unref();
  await fsp.writeFile(PID_FILE, `${child.pid}\n`, "utf8");
  console.log(`Meowney 已后台启动：${child.pid}`);
  console.log(`本机访问：http://127.0.0.1:${PORT}`);
  console.log(`共享访问：http://${accessHost}:${PORT}`);
  console.log(`日志：${LOG_FILE}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
