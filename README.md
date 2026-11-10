# 小宇家电维修 · 空调上门维修单页官网

面向本地家电维修小店的单页官网：六屏内容、手机优先响应式、在线咨询表单、基础 SEO 与微信分享卡片。纯静态，不用构建、不用服务器，改文案只改 `index.html`。

- **线上地址**：https://dablexy.github.io/ac-repair-site/
- **技术栈**：HTML5 + CSS3 + 原生 JavaScript（无框架、无依赖、无构建）
- **页面构成**：首屏 / 服务项目 / 维修案例 / 师傅介绍 / 常见问题 / 联系方式与表单

> 本仓库为前端作品演示：品牌、案例与配图为示例，联系方式为作者本人。页面页脚保留「练习项目」声明，不提供真实上门维修服务。

## 本地预览

不要直接双击 `index.html`（`file://` 下表单请求会被浏览器拦），起个本地服务：

```bash
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 目录结构

```
.
├─ index.html          六屏内容与全部文案，区块顺序 = 访客从上往下滑的顺序
├─ assets/
│  ├─ css/style.css    手机优先，768px / 1024px 两个断点往上加
│  ├─ js/main.js       FAQ 折叠、表单校验、防连点、悬浮条避让
│  └─ img/             hero / case1-3 / master（JPEG）+ qr.png + share.jpg
└─ README.md
```

## 功能

| 功能 | 说明 |
|---|---|
| 响应式 | 320–1440 七档宽度实测无横向滚动 |
| FAQ 折叠 | 默认收起，点击展开 |
| 表单校验 | 称呼 / 11 位手机号 / 情况描述，逐项提示，出错自动聚焦第一项 |
| 防连点 | 提交后按钮禁用 10 秒 |
| 咨询三通道 | 电话 `tel:` 直拨、微信二维码、在线表单 |
| 分享卡片 | `og:title` / `og:description` / `og:image`（1200×630） |

## 表单接收

`assets/js/main.js` 里的 `FORM_ENDPOINT` 为空时是演示模式，页面会明写「这条信息并没有真的发出去」。接真实收信只改这一行：

```js
var FORM_ENDPOINT = "https://formspree.io/f/你的表单ID";
```

Formspree 免费版 50 条/月，一个小店的咨询量足够。

## 部署

静态托管，任选其一：GitHub Pages（当前使用）、EdgeOne Pages、客户自有 Nginx。

GitHub Pages：Settings → Pages → 分支 `main` → 目录 `/(root)`。构建完成后地址是 `https://<用户名>.github.io/<仓库名>/`。

上线后必须把 `index.html` 的 `og:image` 换成绝对地址 `https://你的域名/assets/img/share.jpg`，否则微信转发没有图。

## 图片来源

5 张场景图为 AI 生成的示意图，仅用于版式演示。交付真实商户时必须换成商户提供或自行拍摄的照片，**同名覆盖即可，代码不用改**。

## 许可

页面代码可自由参考。品牌名、案例与图片不随代码授权，请勿直接用于商业宣传。
