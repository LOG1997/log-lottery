# Vue3 + Vite4 + Element + Windicss + Bootstrap

## 文件夹介绍
### 🅰️api
request.ts文件为axios封装，可在此拦截操作请求和回复
### 🆒components
组件文件夹，存放公共组件，如SvgIcon图标组件、Table表格组件等
### 👀hooks
封装hooks函数，公共函数的提取
### 🪪icons
存放图标组件，图标组件使用vite插件vite-plugin-svg-icon引入
```ts
plugins[
    ...
          createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      ...
]
```
使用时在组件内按如下方法使用即可
```ts
    <svg-icon :name="'menu'" class="svgMenu cursor-pointer"></svg-icon>
```
### 🏬layout
整体的的布局组件，在router文件中根路径下引入。
包含Header、Main、Footer组件，布局使用了bootstrap的响应式布局
如菜单列表的写法
```ts
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <!-- <span class="navbar-toggler-icon"></span> -->
          <svg-icon :name="'open'"></svg-icon>
        </button>
        <div
          class="nav-list collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li
              class="nav-item"
              v-for="item in navList.data"
              :key="item.id"
              @click="skip(item.url)"
            >
              <a class="nav-link active" aria-current="page" href="#">{{
                item.name
              }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
```
使用媒体查询监听屏幕宽度自适应调整布局
如Header组件中，屏幕宽度大于1200px时始终保持headeer栏宽度为200px
```css
//  @/layout/components/Header.vue
@media screen and (min-width: 1200px) {
  .header-container {
    width: 1200px;
    margin: 0 auto;
  }
}
```


其中Main组件中写入
```ts
      <router-view class="main-container-content"></router-view>
```
### 🏳️‍⚧️router
路由管理，使用history模式
### 🛒store
状态管理，使用pinia
### 🍟style
存放样式文件，模板里主要存放的是主题文件，使用scss。
文件中的函数以及样式在main.ts中引入过后即可使用
### 🥅types
定义的类型和接口
### 🎊views
界面组件
### 🙈App.vue
界面入口
### 🧵Main.ts
项目入口文件
### 🗽env文件
根据不同环境配置的路径地址，常量名称必须是`VITE_***`格式，在vite项目中引入时的方式为`import.meta.env.VITE_***`。
还需要在`vite.config.ts`文件中设置才可引用，具体见文件
### 🪔vite.config.ts
配置了icons的引入、elemnet的按需引入和自动注册、element图标的使用、windicss的引入、符号别名的设置、server的设置。

### 📦在.env文件中修改链接
