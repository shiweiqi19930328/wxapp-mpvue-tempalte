<template>
    <block>
        <div class="income-index">
            <div class="section-1 primary-linear">
                <div class="flex-start-between header">
                    <div class="font-12">高级会员所需充值总额</div>
                    <a href="/pages/vip/shop" hover-class="none">
                        <button class="tag">专属店铺</button>
                    </a>
                    <!-- <button class="tag vip" v-else>普通用户</button> -->
                </div>
                <div class="font-18 font-bold">¥ {{amount}}</div>
                <div class="font-13 can-get">已充值：¥ {{sum}}</div>
                <div class="footer flex-center-center">
                    <a href="/pages/vip/pay" hover-class="none">
                        <button class="btn">继续充值</button>
                    </a>
                    <a href="/pages/vip/list" hover-class="none">
                        <button class="btn">查看明细</button>
                    </a>
                </div>
            </div>
            <div class="section-2 color-content font-12">
                <div class="font-14 title-color title font-bold">高级会员特权</div>
                <div class="contnet">
                    <div>1.通过您分享的入口进入小程序的用户将永久成为您的客户，他们消费后您将获得返利。</div>
                    <div>2.通过您分享的入口进入小程序的用户将永久成为您的客户，他们消费后您将获得返利。</div>
                    <div>3.通过您分享的入口进入小程序的用户将永久成为您的客户，他们消费后您将获得返利。</div>
                    <div>4.通过您分享的入口进入小程序的用户将永久成为您的客户，他们消费后您将获得返利。</div>
                </div>
            </div>
            <div class="section-2 color-content font-12">
                <div class="font-14 title-color title font-bold">温馨提示</div>
                <div class="contnet">
                    <div  @click="callPhone('0755-4849384')">如有疑问可随时拨打客服电话0755-4849384咨询办理</div>
                </div>
            </div>
        </div>
    </block>
</template>

<script>
export default {
    data () {
        return {
            amount : 0,
            sum : 0,
            isVip : false,
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
        async getData(){
            var {amount=0,sum=0,isVip} = await this.$http.post('/api/product/amount',{openid:this.openid});
            this.amount = amount;
            this.sum = sum;
            this.isVip = isVip;
        }
    },
    onPullDownRefresh(){
        
    },
    created(){
        
    },
    watch : {
        
    },
    onLoad(){
        
    },
    onShow(){
        this.getData()
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "~@/assets/styles/income-index.less";
    .tag{
        height:20px;
        line-height:20px;
        text-align:center;
        border-radius:8px;
        background-color:transparent;
        padding: 0 8px;
        color:#fff;
        font-size:12px;
        border:1rpx solid #fff;
        &.vip{
            border-color: #fb5178;
            color: #fb5178;
        }
    }
</style>
