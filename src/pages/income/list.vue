<template>
    <block>
        <div class="income">
            <div class="section-1 bg-primary">
                <div class="income-con notice-primary-color flex-center-between">
                    <div class="income-type flex-column-between">
                        <div class="font-12">{{detail.total}}</div>
                        <div class="font-11">返现总额</div>
                    </div>
                    <div class="income-type flex-column-between">
                        <div class="font-12">{{detail.sumPlus}}</div>
                        <div class="font-11">可提现</div>
                    </div>
                    <div class="income-type flex-column-between">
                        <div class="font-12">{{detail.sumSub}}</div>
                        <div class="font-11">已返现</div>
                    </div>
                    <div class="income-type flex-column-between no-border">
                        <div class="font-12">{{detail.moneying}}</div>
                        <div class="font-11">提现中</div>
                    </div>
                </div>
            </div>
            <div class="wrap tab-bar-con">
                <tabs-bar :width="670" :default-size="5" :options="tabbar" v-model="tabActive"></tabs-bar>
            </div>
            <swiper :duration="duration" :current="tabActive" class="swiper" @change="swiperChange">
                <!-- 已返现 -->
                <swiper-item class="slide-item">
                    <scroll-view scroll-y class="scroll-view"   @scrolltolower="rebateList_loadmore">
                       <div class="empty" v-if="rebateList.loaded && rebateList.total == 0">
                           <div>暂无已返现记录</div>
                           <button class="primary-linear btn" @click="toTab('/pages/rebate/index')">去推广返现</button>
                       </div>
                       <div class="wrap card-con" v-else>
                            <div class="card flex-center-between" v-for="(item,index) in rebateList.list" :key="index">
                                <div class="content">
                                    <div class="font-14 color-title title">好友“{{item.shop_name}}”付款</div>
                                    <div class="font-12 time">{{item.created_at}}</div>
                                </div>
                                <div class="font-14 primary-color">+{{item.price}}</div>
                            </div>
                            <loadmore :no-data="fasle" :no-more-data="rebateList.loaded && rebateList.total <= rebateList.list.length" no-more-data-text="没有更多数据啦"></loadmore>
                        </div>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="slide-item">
                    <!-- 已提现 -->
                    <scroll-view scroll-y class="scroll-view"   @scrolltolower="withdrawList_loadmore">
                        <div class="empty" v-if="withdrawList.loaded && withdrawList.total == 0">
                           <div>暂无已提现记录</div>
                           <button class="primary-linear btn" @click="toTab('/pages/rebate/index')">去推广返现</button>
                       </div>
                        <div class="wrap card-con" v-else>
                            <div class="card flex-center-between" v-for="(item,index) in withdrawList.list" :key="index">
                                <div class="content">
                                    <div class="font-14 color-title title">提现</div>
                                    <div class="font-12 time">{{item.created_at}}</div>
                                </div>
                                <div class="font-14" style="color: #454545;">-{{item.price}}</div>
                            </div>
                            <loadmore :no-data="fasle" :no-more-data="withdrawList.loaded && withdrawList.total <= withdrawList.list.length" no-more-data-text="没有更多数据啦"></loadmore>
                        </div>
                    </scroll-view>
                </swiper-item>
                <!-- 提现中 -->
                <swiper-item class="slide-item">
                    <!-- 已提现 -->
                    <scroll-view scroll-y class="scroll-view"   @scrolltolower="recordListing_loadmore">
                        <div class="empty" v-if="recordListing.loaded && recordListing.total == 0">
                           <div>暂无提现中记录</div>
                           <button class="primary-linear btn" @click="toTab('/pages/rebate/index')">去推广返现</button>
                        </div>
                        <div class="wrap card-con" v-else>
                            <div class="card flex-center-between" v-for="(item,index) in recordListing.list" :key="index">
                                <div class="content">
                                    <div class="font-14 color-title title">提现中</div>
                                    <div class="font-12 time">{{item.create_at}}</div>
                                </div>
                                <div class="font-14" style="color:#fb5178;">-{{item.money}}</div>
                            </div>
                            <loadmore :no-data="fasle" :no-more-data="recordListing.loaded && recordListing.total <= recordListing.list.length" no-more-data-text="没有更多数据啦"></loadmore>
                        </div>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </div>
    </block>
</template>

<script>
import tabsBar from '@/components/tabs-bar'
import loadmore from '@/components/loadmore'
export default {
    components: {
        tabsBar,
        loadmore
    },
    data () {
        return {
            detail : {},
            tabbar : [
                '已返现',
                '已提现',
                '提现中',
            ],
            tabActive : 0,
            duration : 0,
            // 提现中
            recordListingSearch : {
                pageNumber : 1,
                pageSize : 10,
            },

            recordListing : {
                total : 0,
                loaded : false,
                list : []
            },
            // 返现
            rebateListSearch : {
                pageNumber : 1,
                pageSize : 10,
                type : 1
            },
            rebateList : {
                total : 0,
                loaded : false,
                list : []
            },
            // 提现
            withdrawListSearch : {
                pageNumber : 1,
                pageSize : 10,
                type : 0
            },

            withdrawList : {
                total : 0,
                loaded : false,
                list : []
            },
        }
    },
    computed:{
        
    },
    methods: {
        swiperChange(e){
            // 滑动触发的才去更新active
            if(e.mp.detail.source == 'touch'){
                this.tabActive = e.mp.detail.current;
            } 
        },
        // 提现中
        async getRecordListing(){
            this.recordListing.list = [];
            this.recordListingSearch.pageNumber = 1;
            this.recordListing.loaded = false;
            var searchData = {...this.recordListingSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-listing',searchData);
            this.recordListing = {
                total : data.total,
                list : data.data,
                loaded : true
            };
        },
        async recordListing_loadmore(){
            if(!this.recordListing.loaded || this.recordListing.total <= this.recordListing.list.length){
                return
            }
            this.recordListing.loaded = false;
            this.recordListingSearch.pageNumber = this.recordListingSearch.pageNumber + 1;
            var searchData = {...this.recordListingSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-listing',searchData);
            this.recordListing = {
                total : data.total,
                list : this.recordListing.list.concat(data.data),
                loaded : true
            };
        },
        // 返现
        async getRebateList(){
            this.rebateList.list = [];
            this.rebateListSearch.pageNumber = 1;
            this.rebateList.loaded = false;
            var searchData = {...this.rebateListSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-list',searchData);
            this.rebateList = {
                total : data.total,
                list : data.data,
                loaded : true
            };
        },
        async rebateList_loadmore(){
            if(!this.rebateList.loaded || this.rebateList.total <= this.rebateList.list.length){
                return
            }
            this.rebateList.loaded = false;
            this.rebateListSearch.pageNumber = this.rebateListSearch.pageNumber + 1;
            var searchData = {...this.rebateListSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-listing',searchData);
            this.rebateList = {
                total : data.total,
                list : this.rebateList.list.concat(data.data),
                loaded : true
            };
        },
        // 提现
        async getWithdrawList(){
            this.withdrawList.list = [];
            this.withdrawListSearch.pageNumber = 1;
            this.withdrawList.loaded = false;
            var searchData = {...this.withdrawListSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-list',searchData);
            this.withdrawList = {
                total : data.total,
                list : data.data,
                loaded : true
            };
        },
        async withdrawList_loadmore(){
            if(!this.withdrawList.loaded || this.withdrawList.total <= this.withdrawList.list.length){
                return
            }
            this.withdrawList.loaded = false;
            this.withdrawListSearch.pageNumber = this.withdrawListSearch.pageNumber + 1;
            var searchData = {...this.withdrawListSearch,openid:this.openid};
            var data = await this.$http.post('/api/product/record-listing',searchData);
            this.withdrawList = {
                total : data.total,
                list : this.withdrawList.list.concat(data.data),
                loaded : true
            };
        },
        async getData(){
            this.getRebateList()
            this.getWithdrawList()
            this.getRecordListing()
            var detail = await this.$http.post('/api/product/sum-money',{openid:this.openid});
            if(!detail.moneying){
                detail.moneying = 0
            }
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
        this.duration = 500;
    },
    onUnload(){
        this.recordListing = {
            total : 0,
            loaded : false,
            list : []
        }
        this.rebateList = {
            total : 0,
            loaded : false,
            list : []
        }
        this.withdrawList = {
            total : 0,
            loaded : false,
            list : []
        }
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
