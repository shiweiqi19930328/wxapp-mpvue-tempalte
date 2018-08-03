# wxapp-mpvue-template

> A Mpvue project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

多个mpvue项目开发实践下来，抽象出来的快速启动项目
重中之重： 框架缺陷 需要修改源码  详情见  ===》    https://github.com/Meituan-Dianping/mpvue/issues/639
1.css处理器 less
2.http 请求 flyio，并且封装好拦截器，并挂载到vue原型属性$http上
3.自己写的表单校验，内置了很多常见校验，并挂载到vue原型属性$validate上
4.全局混入mixin定义，主要对微信api进行再封装，简化调用
5.util里面内置了很多常见的静态方法，比如金额格式化等
6.还有安装了day.js，轻量级的时间处理库，根据需求可以按需使用,文档见https://github.com/iamkun/dayjs/blob/master/docs/zh-cn/README.zh-CN.md
7.微信所有api全都promise话，并挂载到vue原型属性$wx上
8.个人样式库，assets目录下
9.static目录下，放置图片和微信原生组件，不经过webpack处理
10.components目录下简单的组件封装（因为不支持具名slot），所以只能封装一些简单组件。实践中发现，也不支持循环引用组件（那种props传入循环中的变量的情况）
11.框架缺陷 需要修改源码  详情见  ===》    https://github.com/Meituan-Dianping/mpvue/issues/639
12.架构中已经配置了babel,es6=>es5,开发者工具的es6转es5可以关闭
13.日历插件，极点日历==》https://github.com/czcaiwj/calendar
14.富文本解析组件 mpvue-wxParse ==> https://github.com/F-loat/mpvue-wxParse
