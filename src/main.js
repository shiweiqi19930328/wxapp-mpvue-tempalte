import Vue from 'vue'
import App from './App'
import fly from './http/fly'
import WXP from 'minapp-api-promise'
import store from './store/store'
import globalMixin from '@/mixin/global'
import validate from './utils/validate'

// http请求
Vue.prototype.$http = fly
// 微信api全部promise化
Vue.prototype.$wx = WXP
// vuex
Vue.prototype.$store = store
// 封装表单检验
Vue.prototype.$validate = validate
// 全局混入
Vue.mixin(globalMixin)
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
// 这个字段走 app.json
config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: ['^pages/index/main'],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black'
        }
    }
}
