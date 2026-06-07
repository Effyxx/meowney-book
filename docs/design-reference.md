# 设计参考：手绘账本风格

这个项目后续页面默认参考 `docs/rough-js-design-reference.html` 和 `docs/font-design-reference.html`。除非明确要求换风格，页面应保持“米白纸张 + 棕色墨迹 + Rough.js 手绘框 + 快乐体中文 + 可爱手绘英文 + 系统数字”的视觉方向。

## 整体气质

- 像手账/草稿纸上的家庭记账工具，亲近、轻量、有一点手作感。
- 不做厚重商务仪表盘，不做大面积深色或强科技感界面。
- 内容仍然要清晰、实用，手绘效果作为边框和选中态装饰，不影响可读性。

## 基础视觉

- 文字主色：`#352f2a`
- 次级文字：`#6f6256`、`#6b5c4f`
- 背景：`#fbf7ed`，叠加浅白蒙层和横向纸纹线
- 重点暖色：`#c99b58`、`#b98539`、`#9b651e`、`#c99544`
- 填充色：偏米白、浅黄、浅棕，常用半透明色值，例如 `rgba(255, 253, 247, 0.88)`、`rgba(255, 246, 214, 0.66)`

## 字体规则

- 默认中文风格字体：`"ZCOOL KuaiLe"`（站酷快乐体）。
- 默认英文字体：`"Patrick Hand"`，回退到 `"Comic Sans MS"`、`"Marker Felt"`、`"Segoe Print"` 等手绘风字体。
- 数字、金额、百分比、日期、表格数据和输入框内容也使用同一套手绘字体，避免卡片和流水里的数字跳回系统字体。
- 推荐混排：中文标题和正文使用快乐体，英文和数字使用可爱的手绘体；特殊高密度表格以后再单独决定是否切回系统数字。
- 字距：中文/英文正文默认 `0.02em`，标题默认 `0.03em`；数字金额保持 `0`，避免读数松散。
- 典型 CSS：

```css
.font-hand {
  font-family:
    "Patrick Hand", "Comic Sans MS", "Marker Felt", "Segoe Print",
    "ZCOOL KuaiLe", "PingFang SC", "Microsoft YaHei", cursive, sans-serif;
}

.font-number {
  font-family:
    "Patrick Hand", "Comic Sans MS", "Marker Felt", "Segoe Print",
    "ZCOOL KuaiLe", "PingFang SC", "Microsoft YaHei", cursive, sans-serif;
  font-variant-numeric: tabular-nums;
}
```

## 布局原则

- 页面容器宽度参考：`width: min(1120px, calc(100% - 32px))`
- 桌面端卡片网格：三列，`gap: 18px`
- 移动端：单列，顶部导航换行靠左
- 标题可以大一些，但字距保持 `0`，不要使用负字距
- 卡片和控件保留足够内边距，参考卡片 `padding: 24px`

## 手绘框实现

- 原始参考使用 Rough.js `4.6.6`。
- 手绘框挂在元素自身内部的绝对定位 SVG 上：元素加 `.rough-box` 和 `data-rough`。
- SVG 作为背景层：`position: absolute; inset: 0; z-index: -1; pointer-events: none;`
- 使用固定 `seed`，保证刷新后线条不乱跳。
- 圆角矩形用 path 生成，开启 `preserveVertices: true`。

## Rough.js 风格 Preset

| 名称 | 用途 | 重点参数 |
| --- | --- | --- |
| `single-soft` | 普通信息卡 | `radius: 30`, `stroke: #c99b58`, `strokeWidth: 1.7`, `roughness: 0.95`, `seed: 11`, 单笔触 |
| `single-strong` | 较重要卡片 | `radius: 24`, `stroke: #b98539`, `strokeWidth: 2.4`, `roughness: 1.55`, `seed: 12`, 单笔触 |
| `single-wild` | 重点模块 | `stroke: #9b651e`, `strokeWidth: 3`, `roughness: 2.25`, `bowing: 2`, `seed: 13` |
| `multi-soft` | 柔和双线 | `stroke: #c99b58`, `strokeWidth: 1.45`, `roughness: 0.85`, `seed: 21`, 多笔触 |
| `multi-strong` | 草稿感模块 | `stroke: #ad7427`, `strokeWidth: 2.1`, `roughness: 1.5`, `seed: 22`, 多笔触 |
| `inner-border` | 装饰性卡片 | 外框加一条浅色内框，内框 `seed + 100` |
| `no-fill` | 覆盖在已有背景上 | `fill: transparent`, `stroke: #8f6c3b`, `strokeWidth: 2.4` |
| `hachure-fill` | 视觉存在感最强 | `fillStyle: hachure`, `fill: rgba(224, 185, 110, 0.42)` |
| `marker-fill` | 提示/选中态 | `stroke: #e0b96e`, `fill: rgba(255, 244, 205, 0.62)` |
| `nav-active` | 顶部导航当前项 | `radius: 14`, `stroke: #c99544`, `fill: rgba(255, 235, 166, 0.74)` |
| `tag-*` | 标签、小胶囊 | `radius: 14`, `stroke: #ddb781`, `fill: rgba(255, 244, 221, 0.68)` |

## 使用建议

- 普通内容卡片优先用 `single-soft` 或 `multi-soft`。
- 重要支出、提醒、月报入口可用 `single-strong`、`marker-fill` 或 `inner-border`。
- 少量强调才用 `single-wild` 和 `hachure-fill`，避免页面太吵。
- 导航选中态用 `nav-active`，标签类元素用 `tag-*`。
- 手绘框应服务于层级，不要给所有元素都加边框。
