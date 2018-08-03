import Fly from 'flyio'
import {baseURL} from './config'
import Vue from 'vue'
import store from '@/store/store'
const vm = new Vue({})

const newFly = new Fly()
// 配置baseUrl
newFly.config.baseURL= baseURL

// 获取openid
async function getOpenid(){
    var {code} = await vm.$wx.login();
    var {data : openid} = await newFly.post('/api/new-ticket/openid',{code});
    store.commit('saveOpenid',openid);  
    return openid
}

export default getOpenid
