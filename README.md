# Meowney Book

这是一个本地优先的个人/家庭记账 App 原型。第一版重点不是让你手动录 15 个商品，而是把流程做成：

1. 上传小票或订单截图
2. App 自动生成交易和商品明细
3. 你确认或轻微修改
4. 入账后自动进入分类统计和月末报告

## 怎么启动

在这个文件夹里运行：

```bash
npm start
```

然后打开：

```text
http://localhost:3000
```

数据会保存在本地的 `data/store.json`，不会上传到云端。`data/` 已经被 `.gitignore` 忽略，推到 GitHub 时不会默认带上自己的账本、密码哈希或登录 session。

第一次打开时，App 会要求你设置一个家庭访问密码。密码不会明文保存；服务器只会在 `data/auth.json` 里保存密码哈希。登录后会记住当前设备 30 天；刷新页面或重启 `npm run share` 后通常不用重新输入密码。点“退出”会清掉当前设备登录状态。

## 当前能做什么

- 看本月总览、分类占比、最近流水
- 上传小票或订单截图
- 直接用文字记一笔小额消费，例如 `奶茶 5`
- 用本地演示解析生成待确认账单
- 编辑商品明细、分类、金额、必要性
- 确认入账或存到待确认
- 维护每月固定支出
- 生成可视化月报：总支出、类别比例、历史平均对比、每周柱状图
- 每月最后一天晚上 8 点后，在 App 内提醒查看月报
- 家庭访问密码保护和退出登录
- 在总览页设置账本成员；一人账本会固定付款人，多人账本会自动显示“共同 + 成员名”

## 真正接入 AI

当前没有配置 API key 时，会使用本地演示解析。后端已经预留了 OpenAI Responses API 图片识别接口。

启动前设置环境变量即可尝试真实 AI 识别：

```bash
OPENAI_API_KEY=你的_key npm start
```

也可以指定模型：

```bash
OPENAI_API_KEY=你的_key OPENAI_MODEL=gpt-5.4-mini npm start
```

真实版本建议继续加：

- 小票 OCR/图片识别准确率评估
- 订单邮件导入
- 银行或信用卡 CSV 导入
- 两个人各自账户和共同账户拆分
- 月末报告调用大模型生成自然语言建议

## 私人账本和公共版本

建议把自己的使用版本和准备发布给其他用户的版本分在不同 Git 分支上维护。公共版本只提交代码、静态资源和文档；本机的 `data/` 目录继续留在电脑上，不提交到 GitHub。

## 给异地伴侣访问

推荐用 Tailscale。它会让你和伴侣进入同一个私人网络，账本不需要公开到整个互联网。

### 第一次设置

1. 你和伴侣都安装 Tailscale。
   - Mac 推荐从 Tailscale 官网下载安装包：https://tailscale.com/download/mac
   - 如果用 Homebrew，也可以在你自己的 Terminal 里运行：`brew install --cask tailscale-app`
   - 安装过程可能会要求输入 macOS 管理员密码，并在系统设置里允许 VPN/网络扩展。
2. 你们登录同一个 Tailscale 账号，或你在 Tailscale 管理后台邀请伴侣加入同一个 tailnet。
3. 你在这台电脑上运行：

```bash
npm run share
```

4. 终端里会显示本机地址和伴侣访问地址。本机始终可以用 `http://127.0.0.1:3000`，把 Tailscale 地址发给伴侣。
   - 如果 Tailscale Serve 已启用，会是 `https://...ts.net`
   - 如果 Serve 没启用，会自动改用 `http://100.x.x.x:3000`
5. 伴侣先打开并登录 Tailscale，再在浏览器打开这个地址。
6. 进入账本时，还需要输入你设置的家庭访问密码。

### 停止共享

如果只想停止账本服务，按 `Ctrl+C`。

如果你启用了 Tailscale Serve，并且想关闭 Tailscale 的共享规则，运行：

```bash
tailscale serve reset
```

注意：你的电脑需要保持开机、Tailscale 在线、`npm run share` 正在运行，伴侣才能访问。`http://100.x.x.x:3000` 是 Tailscale 私网地址，不是公开互联网地址。
