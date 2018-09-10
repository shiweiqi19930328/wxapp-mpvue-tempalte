<template>
    <block v-if="loaded">
        <div class="pay-result">
            <div class="header flex-center error">
                <img src="/static/images/pay-error.png"  class="pay-result-icon"/>
                <div class="header-desc flex-column-between">
                    <div class="font-17 font-bold">付款失败</div>
                    <div class="font-11">请查看您的钱包余额</div>
                </div>
            </div>
            <div class="order-detail">
                <div class="flex-start-between title">
                    <div class="title-color font-15 font-bold">{{detail.tickets.ticket_title}}</div>
                    <navigator :url="'/pages/activity-detail/activity-detail?id='+detail.tickets.ticket_id">
                        <button class="detail-btn">详情</button>
                    </navigator>
                </div>
                <div class="line  font-12">{{detail.tickets.address}}</div>
                <div class="line  font-12">{{detail.ticketTime.time_name}}</div>
                <div class="line  font-12">{{detail.levels.level_name}} X {{detail.num}}</div>
                <div class="flex-center-between detail-footer">
                    <div class="flex-center  font-12">
                        <div class="margin-right-15">{{detail.name}}</div>
                        <div>{{detail.phone}}</div>
                    </div>
                    <div class="title-color font-14 font-bold">未扣费</div>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section">
                <div class="title">温馨提示</div>
                <div class="content font-12">
                    <div>1.如需发票请跟客服人员沟通</div>
                    <div>2.节假日或活动期间，价格可能有波动，需要提前预约确认</div>
                    <div>3.本活动截止日期为{{detail.end_time_format}}</div>
                </div>
            </div>
            <div class="phone-con" @click="callPhone('4009832000')">客服电话：4009832000</div>
            <div class="btn-group">
                <button class="primary-linear btn" @click="gopay">重新支付</button>
                <button class="btn second" @click="toTab('/pages/index/index')">返回首页</button>
            </div>
        </div>
    </block>
</template>

<script>
import dayjs from 'dayjs'
export default {
    data () {
    return {
            detail : {}
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
       async getData(){
            var detail = await this.$http.post('/api/product/error-pay',{order_id:this.order_id});
            var end_time_format = dayjs(detail.tickets.end_time).format('YYYY年MM月DD日');
            detail.end_time_format = end_time_format;
            this.detail = detail;
            this.loaded = true
       },
       gopay(){
            var order_id = this.order_id;
            this.pay(order_id)
       }
    },
    onPullDownRefresh(){
        
    },
    created(){
        
    },
    watch : {
        
    },
    onLoad(){
        // 
        this.order_id = this.$root.$mp.query.order_id || 69;
        this.getData()
    },
    onUnload(){
        this.loaded = false
    },
    onShow(){
        
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "../../assets/styles/pay-result.less";
</style>
