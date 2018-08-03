// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import system from './modules/system'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        openid : '',
    },
    mutations: {
        saveOpenid(state,openid){
            state.openid = openid
        },
    },
    modules: {
        system
    }
})

export default store
