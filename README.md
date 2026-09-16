# marriage-proposal

一封「会滚动的电子情书」求婚静态网页，部署于 GitHub Pages，通过私密链接发送给女方，她独自打开后随滚动读完两人的故事，最终落到求婚一刻。

- 仓库：`howieyuen/marriage-proposal`
- 站点：`https://howieyuen.github.io/marriage-proposal/`

## 目录结构

```
index.html            页面结构：入场门 + 10 章节 + 成功层 + 结尾
css/style.css         视觉系统与布局（清透暖调）
js/
  gate.js             入场门答案规范化 / 匹配（含单测）
  counter.js          在一起天数计算（含单测）
  reveal.js           IntersectionObserver 滚动淡入
  proposal.js         求婚按钮：躲避 + 我愿意 → 成功层 + 花瓣
  music.js            背景音乐开关
  main.js             入口装配
tests/                node --test 单测（gate / counter）
scripts/optimize.py   从本地私人相册用 sips 生成 assets/img（独立压缩图）
assets/img/           压缩后的照片（随站点公开）
robots.txt / .nojekyll
prototype/            交互原型（brainstorm 阶段产物，仅供参考）
```

> 设计文档与开发计划在本地 `docs/`（`design.md` / `plan.md`），含私人信息，已通过 `.gitignore` 排除，不随公开仓库发布。

## 本地预览

ES Module 需经 http 访问（`file://` 会被浏览器 CORS 拦截）：

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

## 测试

```bash
node --test        # 纯逻辑单测（gate / counter），零依赖，需 Node ≥ 18
```

## 重新生成图片

```bash
python3 scripts/optimize.py    # 读取 ~/privacy/{婚纱,素材}，输出 assets/img/*.jpg
```

> 原始高清图与 `~/privacy` **不入库**，仅提交压缩图。

## 隐私

GitHub Pages 为公开托管，入场门只是前端小机关、**非真正加密**（足以防无关的人误看，但勿当安全边界）。不主动扩散链接即可。
