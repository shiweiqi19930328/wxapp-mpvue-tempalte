<template>
    <block v-if="loaded">
        <div class="friend-order">
            <div class="logo-con">
                <img src="/static/images/logo.png"  class="logo-img" mode="aspectFit">
            </div>
            <div class="card">
                <div class="card-wrap">
                    <div class="title" v-if="result == 1">
                        <div>系统检测到您尚未注册麦兜兜，</div>
                        <div>请先完成注册</div>
                    </div>
                    <div class="title" v-else-if="result == 2">
                        <div>很抱歉，您慢了一拍</div>
                        <div>赠票已被其他人领取</div>
                    </div>
                     <div class="title" v-else-if="result == 3">
                        <div>恭喜您！</div>
                        <div>收到{{detail.member_name}}的赠票</div>
                    </div>
                    
                    <!-- <div class="color-line"></div> -->
                    <div class="flex-center-center">
                        <div class="card-content flex-column-between">
                            <img :src="detail.tickets.ticket_img"  mode="aspectFill" class="card-img">
                            <div class="zan-ellipsis title font-bold" style="text-align: left">{{detail.tickets.ticket_title}}</div>
                            <div>套餐：{{detail.ticketTime.time_name}} {{detail.levels.level_name}}</div>
                            <div>数量：{{detail.num}}张</div>
                            <div>
                                <span>合计：¥{{detail.total}}</span>
                                <span class="color-active"> (已支付)</span>
                            </div>
                            <div class="font-bold end-time">有效日期：{{detail.end_time_format}}</div>
                        </div>
                    </div>
                </div>
                <div class="line-dash flex-center-between">
                    <div class="dot left"></div>
                    <div class="line"></div>
                    <div class="dot right"></div>
                </div>
                <div class="footer">
                    <button class="btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo" v-if="result == 1">请先登录</button>
                    <button class="btn" @click="goIndex" v-else-if="result == 2">其他活动</button>
                    <button class="btn" @click="goOrder" v-else-if="result == 3">查看订单</button>
                </div>
            </div>
        </div>
    </block>
</template>

<script>
import dayjs from 'dayjs'
export default {
    data () {
        return {    
            loaded : false,
            userInfo : {},
            detail : {},
            result : '',
            order_id : '',
            shareopenid : ''
        }
    },

    components: {
        
    },

    methods: {
        goIndex(){
            wx.switchTab({
                url: '/pages/index/index'
            })
        },
        goOrder(){
            var order_id = this.order_id;
            wx.navigateTo({
                url: `/pages/pay-success/pay-success?order_id=${order_id}`
            })
        },
        getuserinfo(e){
            this.userInfo = e.mp.detail.userInfo;
            this.register()
        },
        async register(){
            var postData = {
                openid:this.openid,
                nickname : this.userInfo.nickName,
                headimgurl : this.userInfo.avatarUrl
            }
            var result = await this.$http.post('/api/new-ticket/register',postData);
            this.getData()
        },
        async getData(){
            this.showLoading();
            var postData = {
                openid : this.openid,
                order_id : this.order_id,
                shareopenid : this.shareopenid
            }
            // var postData = {
            //     openid : 'asdasd',
            //     order_id : 2,
            //     shareopenid : this.openid
            // };

            // 领取赠品   返回1的话 就是未注册   返回2的话  就是已被领取   3的话就是领取成功
            var result = await this.$http.post('/api/product/give-order',postData);
            this.result = result;
            console.log(result)
            
           
            var detail = await this.$http.post('/api/product/order-info',{order_id : this.order_id,openid:this.shareopenid});
            // var detail = await this.$http.post('/api/product/order-info',{order_id : 2,openid:this.openid});
            var end_time_format = dayjs(detail.tickets.end_time).format('YYYY年MM月DD日');
            detail.end_time_format = end_time_format;
            this.detail = detail;
            this.loaded = true;
            this.hideLoading();
        }
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        // 获取 转赠的订单id  和   转赠人的openid
        this.order_id = this.$root.$mp.query.order_id;
        this.shareopenid = this.$root.$mp.query.shareopenid;
        console.log(this.$root.$mp.query)
        this.getData()
    },
    onUnload(){
        this.loaded = false
    }
}
</script>

<style  lang="less">
    @import "../../assets/styles/friend-order.less";
</style>
