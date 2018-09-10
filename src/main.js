// 框架缺陷 需要修改源码  详情见  ===》    https://github.com/Meituan-Dianping/mpvue/issues/639

import Vue from 'vue'
import App from './App'
// 微信api全部promise化，并且挂载到原型上$wx
import WXP from 'minapp-api-promise'
Vue.prototype.$wx = WXP
// vuex
import store from '@/store/store'
Vue.prototype.$store = store
// 封装表单检验
import validate from '@/utils/validate'
// 全局混入
import globalMixin from '@/mixin/global'
Vue.mixin(globalMixin)
// http请求
import fly from '@/http/fly'
Vue.prototype.$http = fly

Vue.prototype.$validate = validate
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
