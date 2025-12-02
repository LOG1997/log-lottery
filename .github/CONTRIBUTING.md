# 怎么为本项目做贡献

你好！很高兴你为本项目做贡献。在提交您的贡献时，请务必阅读以下指南：

## PR检查表

- 该项目主要的工作分支有`main`和`dev`
  - `main`分支包含的是已经发布的功能，请勿提交PR到`main`分支。
  - 如要贡献代码，请从`dev`分支拉取代码，该分支一般包含最新待上线的功能。
  - 你的代码提交（添加新功能、修复bug、优化性能等）需要发起PR到`dev`分支
  - 请尽可能地在您的PR请求中描述清楚添加的功能或者修复的问题
  - 在一个PR中有多个小提交是没问题的，但请确保每个提交都包含一个清晰的提交信息。
  - 请确保您的提交信息遵循[Conventional Commits](https://www.conventionalcommits.org/)规范。

## 开发设置

推荐使用`pnpm`来进行包的管理。

克隆仓库后，运行：

```bash
pnpm install  # 安装依赖
```

## 运行脚本

### `pnpm dev`

启动开发服务器

```bash
pnpm dev
```

### `pnpm build`

构建项目

```bash
pnpm build
```

### `pnpm build:file`

打包后的项目可以直接通过html文件的形式直接在浏览器打开

```bash
pnpm build:file
```

### `pnpm lint:fix`

修复eslint格式错误

```bash
pnpm lint:fix
```

## 项目结构

src目录下基本放置了所有的代码文件，其中最主要的是

- `views`：存放页面代码
- `components`：存放组件代码
- `utils`：存放工具函数
- `layout`: 页面布局
- `locales`: 国际化
- `router`: 路由配置
- `store`: 状态管理
- `types`: 类型定义

## 感谢

感谢您为本项目做出贡献
