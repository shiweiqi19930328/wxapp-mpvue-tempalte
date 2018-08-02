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
1.css处理器 less
2.http 请求 flyio，并且封装好拦截器，并挂载到vue原型属性$http上
3.自己写的表单校验，内置了很多常见校验，并挂载到vue原型属性$validate上
4.全局混入mixin定义，主要对微信api进行再封装，简化调用
5.util里面内置了很多常见的静态方法，比如金额格式化等
6.还有安装了day.js，轻量级的时间处理库，根据需求可以按需使用
7.微信所有api全都promise话，并挂载到vue原型属性$wx上
