<template>
    <block>
        <div class="income">
            <div class="empty" v-if="loaded && total == 0">
               <div>暂无充值记录</div>
               <button class="primary-linear btn" @click="replaceLink('/pages/vip/pay')">去充值</button>
            </div>
            <div class="wrap card-con" v-else>
                <div class="card flex-center-between" v-for="(item,index) in list" :key="index">
                    <div class="content">
                        <div class="font-14 color-title title">提现</div>
                        <div class="font-12 time">{{item.created_at}}</div>
                    </div>
                    <div class="font-14" style="color: #454545;">-{{item.price}}</div>
                </div>
                <loadmore :no-data="fasle" :no-more-data="loaded && total <= list.length" no-more-data-text="没有更多数据啦"></loadmore>
            </div>
        </div>
    </block>
</template>

<script>
import loadmore from '@/components/loadmore'
export default {
    components: {
        loadmore
    },
    data () {
        return {
            searchData : {
                pageSize : 10,
                pageNumber : 1,
                openid:''
            },
            list : [],
            total : 0
        }
    },
    computed:{
        
    },
    methods: {
        async getData(){
            this.list = [];
            this.searchData.pageNumber =  1;
            this.loaded = false;
            var {data=[],total=0} = await this.$http.post('/api/product/recharge-record',this.searchData);
            this.list = data;
            this.total = total * 1;
            this.loaded = true;
            wx.stopPullDownRefresh();
        },
        async loadmore(){
            if(!this.loaded || this.total <= this.list.length){
                return
            }
            this.searchData.pageNumber = this.searchData.pageNumber + 1;
            this.loaded = false;
            var {data=[],total=0} = await this.$http.post('/api/product/recharge-record',this.searchData);
            this.list = this.list.concat(data);
            this.total = total * 1;
            this.loaded = true;
        },
    },
    onPullDownRefresh(){
        this.getData()
    },
    onReachBottom(){
        this.loadmore()
    },
    created(){
        
    },
    watch : {
        
    },
    onLoad(){
        this.searchData.openid = this.openid;
    },
    onUnload(){
        
    },
    onShow(){
        this.getData()
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "~@/assets/styles/income.less";
</style>
