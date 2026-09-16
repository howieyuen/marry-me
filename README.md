# marriage-proposal

一封「会滚动的电子情书」求婚静态网页，部署于 GitHub Pages，通过私密链接发送给女方，她独自打开后随滚动读完两人的故事，最终落到求婚一刻。

仓库：`howieyuen/marriage-proposal`

## 目录结构

```
docs/design.md              设计文档（页面结构 / 视觉系统 / 交互 / 隐私方案）
prototype/                  交互原型（brainstorm 阶段产物）
  prototype.template.html   原型模板（图片位用 {{IMG_*}} 占位）
  build_prototype.py        从本地私人相册压缩内联生成可预览的 prototype.html
  prototype.html            生成产物（内联真实照片，不建议入公开库）
```

开发阶段将新增正式站点文件：`index.html` / `css/` / `js/` / `assets/img/` / `scripts/optimize.py` / `robots.txt`（见 `docs/design.md` §8）。

## 构建原型

```bash
python3 prototype/build_prototype.py
open prototype/prototype.html
```

> 脚本读取 `~/privacy/{婚纱,素材}` 下的真实照片；原始高清图**不入库**。

## 隐私

详见 `docs/design.md` §6 / §9。要点：GitHub Pages 为公开托管，入场门只是前端小机关、**非真正加密**；原始高清图与 `~/privacy` 不提交；正式站点仅提交压缩图。
