<template>
    <div class="mine">
        <div class="wrap user-con flex-center">
            <div class="userAvatar">
                <open-data type="userAvatarUrl" ></open-data>
            </div>
            
            <div class="content flex-center">
                <div class="username">
                    <open-data type="userNickName"></open-data>
                </div>
            </div>
        </div>
        <div class="divide"></div>
        <div class="section-2 wrap">
            <div class="flex-center order-title font-bold">
                我的订单
            </div>
            <div class="nav flex-center-between">
                <a href="/pages/order/list?type=0" hover-class="none">
                    <div class="nav-item flex-column-center">
                        <div class="nav-item-img flex-center-center">
                            <div class="num" v-if="orders.not_used && orders.not_used != 0">{{orders.not_used}}</div>
                            <img src="/static/images/order.png"  class="nav-item-img-icon" mode="aspectFit"/>
                        </div>
                        <div class="nav-item-title font-bold">待参加</div>
                    </div>
                </a>
                <a href="/pages/order/list?type=1" hover-class="none">
                     <div class="nav-item flex-column-center">
                        <div class="nav-item-img flex-center-center">
                            <div class="num" v-if="orders.unpay && orders.unpay != 0">{{orders.unpay}}</div>
                            <img src="/static/images/order.png"  class="nav-item-img-icon" mode="aspectFit"/>
                        </div>
                        <div class="nav-item-title font-bold">待付款</div>
                    </div>
                </a>
                <a href="/pages/order/list?type=2" hover-class="none">
                     <div class="nav-item flex-column-center">
                        <div class="nav-item-img flex-center-center">
                            <div class="num" v-if="orders.is_used && orders.is_used != 0">{{orders.is_used}}</div>
                            <img src="/static/images/order.png"  class="nav-item-img-icon" mode="aspectFit"/>
                        </div>
                        <div class="nav-item-title font-bold">已使用</div>
                    </div>
                </a>
            </div>
        </div>
        <div class="divide"></div>
        <div class="section-3">
            <a href="/pages/income/index" class="wrap" hover-class="none">
                <div class="order-cell flex-center-between">
                    <div class="flex-center">
                        <div class="title">分享收益</div>
                    </div>
                    <div class="flex-center order-cell-link">
                        <div class="primary-color font-13 font-bold">¥ {{orders.sumPlus}}</div>
                        <div class="arrow right"></div>
                    </div>
                </div>
            </a>
            <a href="/pages/mine/love-list" class="wrap" hover-class="none">
                <div class="order-cell flex-center-between">
                    <div class="flex-center">
                        <div class="title">我的收藏</div>
                    </div>
                    <div class="flex-center order-cell-link">
                        <div class="content font-13 font-bold">{{orders.collectCount}}</div>
                        <div class="arrow right"></div>
                    </div>
                </div>
            </a>
            <a href="/pages/mine/invite" class="wrap" hover-class="none">
                <div class="order-cell flex-center-between">
                    <div class="flex-center">
                        <div class="title">诚邀好友</div>
                    </div>
                    <div class="flex-center order-cell-link">
                        <div class="arrow right"></div>
                    </div>
                </div>
            </a>
            <a href="/pages/mine/cooperation" class="wrap" hover-class="none">
                <div class="order-cell flex-center-between">
                    <div class="flex-center">
                        <div class="title">项目合作</div>
                    </div>
                    <div class="flex-center order-cell-link">
                        <div class="arrow right"></div>
                    </div>
                </div>
            </a>
            <a href="/pages/mine/about" class="wrap" hover-class="none">
                <div class="order-cell flex-center-between">
                    <div class="flex-center">
                        <div class="title">关于我们</div>
                    </div>
                    <div class="flex-center order-cell-link">
                        <div class="arrow right"></div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {    
            loaded : false,
            userInfo : {},
            orders : {},
        }
    },
    computed:{
        // phoneHide(){
        //     var tel = "13122223333";
        //     var reg = /^(\d{3})\d{6}(\d{2})$/;
        //     tel = tel.replace(reg, "$1***$2");
        //     return tel
        // }
    },
    components: {

    },

    methods: {
        async getUser(){
            var result = await this.$http.post('/api/product/member-info',{openid:this.openid});
        },
        async getOrders(){
            var orders = await this.$http.post('/api/product/orders',{openid:this.openid});
            if(orders){  //已经注册过
                orders.sumPlus = orders.sumPlus || 0;
                orders.sumPlus = this.formatMoney(orders.sumPlus);
                this.orders = orders
            } 
        }
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        
    },
    onShow(){
        this.getOrders()
    }
}
</script>

<style scoped lang="less">
     @import "~@/assets/styles/mine.less";
</style>
