# ShopLite 商城 H5 示例

一个纯前端（HTML/CSS/JS）的小型商城示例，包含：商品列表、购物车抽屉、数量修改、结算表单。适合直接部署到 GitHub Pages。

## 本地预览

将文件放到任意静态服务器根目录（或直接在 IDE 里打开 `index.html`）。

## 部署到 GitHub（GitHub Pages）

1. 在 GitHub 新建仓库（例如 `shoplite-h5`）。
2. 在本地初始化并推送：

```bash
git init
git add .
git commit -m "init: shoplite h5"
git branch -M main
git remote add origin https://github.com/<你的用户名>/shoplite-h5.git
git push -u origin main
```

3. 打开仓库 Settings → Pages：
   - `Build and deployment` → `Source` 选择 `Deploy from a branch`。
   - `Branch` 选择 `main`，`/ (root)`。
   - 保存后，等待几分钟，访问 `https://<你的用户名>.github.io/shoplite-h5/`。

> 备选方式：使用 `gh-pages` 分支（不需要构建，本项目是纯静态）。

```bash
git subtree push --prefix . origin gh-pages
# 或者：
# npm i -g gh-pages && gh-pages -d .
```

发布成功后页面入口为 `index.html`。

## 自定义

- 修改 `js/app.js` 中 `products` 数组即可更换商品与价格。
- 样式在 `css/style.css`，可调整栅格列数、配色与交互。

