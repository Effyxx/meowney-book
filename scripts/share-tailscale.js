const { spawn, spawnSync } = require("child_process");

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.stdio || "pipe",
    timeout: options.timeout || 15000,
    env: {
      ...process.env,
      TAILSCALE_BE_CLI: "1"
    }
  });
}

function commandOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

function failed(result) {
  const output = commandOutput(result);
  return result.error || result.status !== 0 || /failed|error|not logged in|not running|stopped/i.test(output);
}

function printFailure(prefix, result) {
  console.error(prefix);
  if (result.error) console.error(result.error.message);
  const output = commandOutput(result);
  if (output) console.error(output);
}

function getTailnetInfo() {
  const result = run("tailscale", ["status", "--json"]);
  if (!failed(result)) {
    try {
      const status = JSON.parse(result.stdout);
      const dnsName = status.Self?.DNSName?.replace(/\.$/, "");
      const ip = status.Self?.TailscaleIPs?.find((value) => value.includes(".")) || status.Self?.TailscaleIPs?.[0] || "";
      return { dnsName, ip };
    } catch (error) {
      // Fall through to `tailscale ip`.
    }
  }

  const ipResult = run("tailscale", ["ip", "-4"]);
  if (!failed(ipResult)) {
    const ip = commandOutput(ipResult).split(/\s+/).find(Boolean) || "";
    return { dnsName: "", ip };
  }

  return { dnsName: "", ip: "" };
}

function parseServeUrl() {
  const info = getTailnetInfo();
  if (info.dnsName) return `https://${info.dnsName}`;
  if (info.ip) return `https://${info.ip}`;
  return "";
}

function directUrl(info) {
  if (info.dnsName) return `http://${info.dnsName}:3000`;
  if (info.ip) return `http://${info.ip}:3000`;
  return "";
}

function startServer(host) {
  return spawn(process.execPath, ["server.js"], {
    stdio: "inherit",
    env: {
      ...process.env,
      HOST: host,
      PORT: process.env.PORT || "3000"
    }
  });
}

function printDirectFallback(info, serve) {
  const url = directUrl(info);
  console.log("Tailscale Serve 没有启用，已改用 Tailscale 私网直连。");
  console.log("本机访问：http://127.0.0.1:3000");
  if (url) {
    console.log(`伴侣在 Tailscale 登录后访问：${url}`);
  } else {
    console.log("没有自动读到 Tailscale IP。你可以在 Tailscale App 里复制 IPv4，然后访问：http://<IPv4>:3000");
  }
  console.log("这个地址只给同一个 Tailscale 网络里的设备使用。");
  const output = commandOutput(serve);
  const enableUrl = output.match(/https:\/\/login\.tailscale\.com\/\S+/)?.[0];
  if (enableUrl) {
    console.log(`以后如果想用 https://...ts.net 漂亮地址，可以打开这里启用 Serve：${enableUrl}`);
  }
  console.log("");
}

function main() {
  const info = getTailnetInfo();
  if (!info.ip && !info.dnsName) {
    const status = run("tailscale", ["status"]);
    printFailure("Tailscale 还没有准备好。请先打开 Tailscale App，登录，并允许它添加 VPN/网络配置。", status);
    process.exit(1);
  }

  const serve = run("tailscale", ["serve", "--bg", "3000"], { timeout: 8000 });
  let host = "127.0.0.1";

  if (failed(serve)) {
    if (!info.ip) {
      printDirectFallback(info, serve);
      console.error("没有读到 Tailscale IPv4，不能启动私网直连。请在 Tailscale App 里复制 IPv4 后告诉我。");
      process.exit(1);
    }
    host = process.env.HOST || "0.0.0.0";
    printDirectFallback(info, serve);
  } else {
    const url = parseServeUrl();
    console.log("Tailscale 共享已开启。");
    console.log("本机访问：http://127.0.0.1:3000");
    if (url) console.log(`伴侣在 Tailscale 登录后访问：${url}`);
    console.log("关闭共享：tailscale serve reset");
    console.log("");
  }

  const server = startServer(host);

  server.on("exit", (code) => {
    process.exit(code || 0);
  });
}

main();
