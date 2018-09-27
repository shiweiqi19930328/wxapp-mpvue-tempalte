// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import system from './modules/system'
Vue.use(Vuex)
// oxkhN5e1ZASGBCKJydcqyQEENPwQ
const store = new Vuex.Store({
    state: {
        openid : '',
        agent_openid : '',
        token:'',
        user:null,
        share : {},
        isRegister : false
    },
    mutations: {
        saveShare(state,share){
            state.share = share
        },
        saveOpenid(state,openid){
            state.openid = openid
        },
        save_agent_openid(state,openid){
            state.agent_openid = openid
        },
        saveToken(state,token){
            state.token = token
        },
        saveUser(state,user){
            state.user = user
        },
        hasRegister(state){
            state.isRegister = true;
        },
    },
    modules: {
        system
    }
})

export default store
