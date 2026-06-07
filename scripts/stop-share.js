const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PID_FILE = path.join(ROOT, "data", "share.pid");

async function main() {
  let pid = 0;
  try {
    pid = Number((await fs.readFile(PID_FILE, "utf8")).trim());
  } catch (error) {
    console.log("没有找到后台共享进程。");
    return;
  }

  if (!pid) {
    console.log("后台共享 PID 无效。");
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
    await fs.rm(PID_FILE, { force: true });
    console.log(`已停止 Meowney 后台共享：${pid}`);
  } catch (error) {
    await fs.rm(PID_FILE, { force: true });
    console.log("后台共享进程已经不在了。");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
