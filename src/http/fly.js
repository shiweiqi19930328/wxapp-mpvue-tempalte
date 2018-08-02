import Fly from 'flyio'
import {baseURL} from './config'
import store from '@/store/store'
import getOpenid from './newFly'
import {errorAction,hideErrorAction} from './errorAction'

const fly = new Fly()
// 配置baseUrl
fly.config.baseURL= baseURL

//请求拦截器
fly.interceptors.request.use((config,promise)=>{
    //给所有请求添加自定义header
    if(!store.state.openid){
        // 请求队列  需等待openid返回
        fly.lock();
        return getOpenid().then(
            (data)=>{
                config.headers.openid = store.state.openid;
                fly.unlock();
                return config;
            }
        )
    }else{
        config.headers.openid = store.state.openid;
        return config;
    }
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        let code = response.data.code;
        if(code == 200){
            return Promise.resolve(response.data.data)
        }else{
            if(response.request.hideError){
                // 不需要提示错误信息的情况
                return hideErrorAction()
            }else{
                var msg = response.data.msg || '未知错误';
                return errorAction(msg)
            } 
        }
    },
    (err) => {
        if(err.request.hideError){
            // 不需要提示错误信息的情况
            return hideErrorAction()
        }else{
            return errorAction()
        }
    },
)
export default fly
