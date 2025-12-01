<div align="center">
    <a href="https://log1997.github.io/log-lottery/">
        <img src="./static/images/lottery.png" width="100" height="100" />
    </a>

# log-lottery 🚀🚀🚀🚀

[![MIT](https://img.shields.io/github/package-json/v/log1997/log-lottery)](https://github.com/LOG1997/log-lottery)
[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/LOG1997/log-lottery)
[![github](https://img.shields.io/badge/Author-log1997-blue.svg)](https://github.com/log1997)
[![vue3](https://img.shields.io/badge/VUE-3-green.svg)](https://github.com/log1997)
[![build](https://img.shields.io/github/actions/workflow/status/log1997/log-lottery/node.js.yml)](https://github.com/log1997)

</div>

log-lottery是一个可配置可定制化的抽奖应用，炫酷3D球体，可用于年会抽奖等活动，支持奖品、人员、界面、图片音乐配置。

> 如果进入网站遇到图片无法显示或有报错的情况，请先到【全局配置】-【界面配置】菜单中点击【重置所有数据】按钮清除数据后进行更新。

> 该项目将在近期进行**内部代码重构**及**开发新功能**，预计元旦节前三天上线新版本。

## 要求

使用PC端最新版Chrome或Edge浏览器。

访问地址：

<https://to2026.xyz/log-lottery>

or

<https://log1997.github.io/log-lottery/>

## TODO

- [x] 🕍 炫酷3D球体，年会抽奖必备，开箱即用
- [x] 💾 本地持久化存储
- [x] 🎁 奖品奖项配置
- [x] 👱 抽奖名单设置管理
- [x] 🎼 播放背景音乐
- [x] 🖼️ excel表格导入人员名单、抽奖结果使用excel导出
- [x] 🎈 可增加临时抽奖
- [x] 🧨 国际化多语言
- [x] 🍃 更换背景图片
- [x] 🚅 添加docker构建
- [x] 😘 弹幕（开发中）
- [ ] 🧵 卡片组成多种形状

...
需要更多功能或发现bug请留言[issues](https://github.com/LOG1997/log-lottery/issues)

## 详细介绍

### 配置参与人员

于人员配置管理界面下载excel模板，按要求填好数据后导入即可。

### 配置奖项

于奖项配置管理界面添加奖项后，自定义修改名称、抽取人数、是否全员参加、图片显示。

### 界面配置

可自定义配置标题、列数、卡片颜色、首页图案等。

### 图片和音乐管理

上传图片或音乐即可，数据使用indexdb在浏览器本地进行存储。

## 预览

首页

![image_home](./static/images/home.png)

![image_home_prize_list](./static//images/home_prizelist.png)

抽奖

![image_lottery](./static/images/lottery-enter.png)

![image_lottery_done](./static/images/lottery-done.png)

配置

![image_config_person_all](./static/images/config_personall.png)

![image_config_prize_list](./static/images/config_prize.png)

![image_config_view](./static/images/config-view.png)

![image_config_pattern](./static/images/config_pattern.png)

图片音乐配置

![image_config_img](./static/images/image_config.png)

![image_music](./static/images/music_music.png)

## 技术

- vue3
- threejs
- indexdb
- pinia
- daisyui

## 开发

安装依赖

```bash
pnpm i
or
npm install
```

开发运行

```bash
pnpm dev
or
npm run dev
```

打包

```bash
pnpm build
or
npm run build
```

若想直接以打开html文件的方式运行，请执行以下命令进行打包。打包完成后在dist目录中直接打开index.html即可。

```bash
pnpm build:file
or
npm run build:file
```

> 项目思路来源于 <https://github.com/moshang-xc/lottery>

## Docker支持

构建镜像

```bash
docker build -t log-lottery .
```

运行容器

```bash
docker run -d -p 9279:80 log-lottery
```

容器运行成功后即可在本地通过<http://localhost:9279/log-lottery/>访问

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LOG1997/log-lottery&type=Date)](https://star-history.com/#LOG1997/log-lottery&Date)

## License

[MIT](http://opensource.org/licenses/MIT)
