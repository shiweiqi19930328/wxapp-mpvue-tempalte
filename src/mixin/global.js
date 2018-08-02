import {formatCurrency} from '@/utils/index'

// 全局混入
const mixin = {
    data(){
        return {
            // 全局混入初始化字段
            loaded : false,
        }
    },
    methods:{
        getuserinfo(e){
            this.userInfo = e.mp.detail.userInfo;
        },
        showToast(title){
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 2000
            })
        },
        setWxTitle(title){
            wx.setNavigationBarTitle({
                title
            });
        },
        showLoading(title=''){
            wx.showLoading({
                title,
                mask : true
            })
        },
        hideLoading(){
            wx.hideLoading()
        },
        formatMoney : formatCurrency,
        callPhone(phone){
            wx.makePhoneCall({
                phoneNumber: phone
            })
        },
        previewImage(img,urls){
            wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: urls?urls:[img] // 需要预览的图片http链接列表
            })
        },
        
        /**
         *  路由跳转再封装
         *  -----------------start
         */

        // 跳转页面
        toLink(url){
            wx.navigateTo({
                url
            })
        },
        //重定向
        replaceLink(url){
            wx.redirectTo({
                url
            })
        },
        // 切换tab页
        toTab(url){
            wx.switchTab({
                url
            })
        },
        // 回退
        back(delta){
            wx.navigateBack({
                delta
            })
        },
        //重启
        relauch(url){
            wx.reLaunch({
                url
            })
        },
        /**
         *  路由跳转再封装
         *  ------------------end
         */
       
    },
    computed:{
        openid(){
            return this.$store.state.openid
        }
    },
    watch:{
        
    }

}
export default mixin