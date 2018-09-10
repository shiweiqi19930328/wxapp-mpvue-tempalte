<template>
    <block>
        <div class="income-index">
            <div class="section-1 primary-linear">
                <div class="flex-start-between header">
                    <div class="font-12">返现总收益</div>
                    <a href="/pages/income/list" hover-class="none">
                        <button class="btn">明细</button>
                    </a>
                </div>
                <div class="font-18 font-bold">¥ {{detail.total}}</div>
                <div class="font-13 can-get">可提现收入：¥ {{detail.sumPlus}}</div>
                <div class="footer flex-center-center">
                    <a href="/pages/income/withdraw" hover-class="none">
                        <button class="btn">提现</button>
                    </a>
                    <a href="/pages/income/account-settings" hover-class="none">
                        <button class="btn">账户设置</button>
                    </a>
                </div>
            </div>
            <div class="section-2 color-content font-12">
                <div class="font-14 title-color title font-bold">申请提现注意事项</div>
                <div class="contnet">
                    <div>1.待提现金额：还未进行财务结算的订单收入总额</div>
                    <div>2.可提现金额：已进行过财务结算的订单收入总额</div>
                    <div>3.每月7-10日可申提现，1-6日为财务和对结算日起</div>
                    <div>4.可提现余额应大与100才能提现</div>
                    <div>5.每月7-10日仅可提现截止上个月的订单收入</div>
                    <div>6.提现前，请先填写收款银行和工作单位等信息</div>
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
            detail : {}
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
        async getData(){
            var detail = await this.$http.post('/api/product/sum-money',{openid:this.openid});
            this.detail = detail;
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
</style>
