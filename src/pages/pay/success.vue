<template>
    <block v-if="loaded">
        <div class="pay-result" >
            <div class="header flex-center">
                <img src="/static/images/pay-success.png"  class="pay-result-icon"/>
                <div class="header-desc flex-column-between">
                    <div class="font-17 font-bold">付款成功</div>
                    <div class="font-11">订单号：{{detail.order_key}}</div>
                </div>
            </div>
            <div class="order-detail">
                <div class="flex-start-between title">
                    <div class="font-15 font-bold">{{detail.tickets.ticket_title}}</div>
                    <a :href="'/pages/activity/detail?id='+detail.tickets.ticket_id" hover-class="none">
                        <button class="detail-btn">详情</button>
                    </a>
                </div>
                <div class="line  font-12">{{detail.tickets.address}}</div>
                <div class="line  font-12">{{detail.ticketTime.time_name}}</div>
                <div class="line  font-12">{{detail.levels.level_name}} X {{detail.num}}</div>
                <div class="flex-center-between detail-footer">
                    <div class="flex-center  font-12">
                        <div class="margin-right-15">{{detail.name}}</div>
                        <div>{{detail.phone}}</div>
                    </div>
                    <div class="title-color font-14 font-bold">合计：¥{{totalFormat}}</div>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section">
                <div class="title">温馨提示</div>
                <div class="content  font-12">
                    <div>1.如需发票请跟客服人员沟通</div>
                    <div>2.节假日或活动期间，价格可能有波动，需要提前预约确认</div>
                    <div>3.本活动截止日期为{{detail.end_time_format}}</div>
                </div>
            </div>
            <div class="phone-con" @click="callPhone('4009832000')">客服电话：4009832000</div>
            <div class="btn-group">
                <button class="first btn" @click="drawImg">分享好友购买 即获<span class="rebate_money">{{detail.tickets.ticket_commission}}</span>
                元返利</button>
                <button class="btn second" @click="toTab('/pages/index/index')">返回首页</button>
            </div>
        </div>
        <div class="hide-invite">
            <img :src="inviteImg" class="inviteImg" @click="previewImage(inviteImg)">
            <canvas canvas-id="invite-success" style="width: 295px;height: 390px;"  class="canvas" ></canvas>
        </div>
    </block>
</template>

<script>
import dayjs from 'dayjs'
export default {
    data () {
    return {
            order_id : '',
            detail : {},
            loaded : false,
            inviteImg : '',
        }
    },
    computed:{
        totalFormat(){
            return this.formatMoney(this.detail.total)
        }
    },
    components: {
        
    },

    methods: {
        async getData(){
            var detail = await this.$http.post('/api/product/success-pay',{order_id:this.order_id});
            var end_time_format = dayjs(detail.tickets.end_time).format('YYYY年MM月DD日');
            detail.end_time_format = end_time_format;
            this.detail = detail;
            this.loaded = true
       },
       async drawImg(){
            this.showLoading('海报制作中')
            // 折扣价
            var minPrice = this.formatMoney(this.detail.tickets.ticket_min)
            var qrimg = await this.$http.post('/api/product/qrcode',
                {path:`/pages/activity-detail/activity-detail?share_openid=${this.openid}&id=${this.detail.tickets.ticket_id}`});
            var canvas_id ='invite-success';
            this.drawShare(canvas_id,this.detail.tickets.ticket_img,this.detail.tickets.ticket_title,minPrice,qrimg,(inviteImg)=>{
                this.inviteImg = inviteImg;
                this.hideLoading();
                this.previewImage(this.inviteImg)
                
            })
        },
    },
    onPullDownRefresh(){
        
    },
    created(){
        
    },
    watch : {
        
    },
    onLoad(){
        // || 36 
        this.order_id = this.$root.$mp.query.order_id;
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
    @import "~@/assets/styles/pay-result.less";
</style>
