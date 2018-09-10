<template>
    <block>
        <div class="activity-list" v-show="pageLoaded">
            <searchBar @on-change="searchChange"></searchBar>
            <div class="wrap">
                <a 
                    hover-class="none"
                    v-for="(item,index) in listFormat" 
                    :key="index"
                    :href="'/pages/activity/detail?id='+item.tickets.ticket_id"
                >
                    <div class="activity flex-center">
                        <div class="pay-con">
                            已报名{{item.tickets.sales_num}}人
                        </div>
                        <img :src="item.tickets.ticket_img" class="activity-img" mode="aspectFill">
                        <div class="content flex-column-between">
                            <div>
                                <div class="font-14 title font-bold ellipsis-l2">
                                    {{item.tickets.ticket_title}}
                                </div>
                                <div class="tips-con">
                                    <div class="tip" v-if="item.tickets.age">
                                        {{item.tickets.age}}
                                    </div>
                                    <div class="tip" v-for="(tip,tipIndex) in  item.tickets.tagcentre" :key="tipIndex" v-if="item.tickets.tagcentre">
                                        {{tip.tag_name}}
                                    </div>
                                </div>
                            </div>
                            <div class="flex-end">
                                <div class="font-14 primary-color font-bold">¥{{item.ticket_min_format}}</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <loadmore 
                :no-data="loaded && total == 0" no-data-text="暂无活动" 
                :no-more-data="loaded && total <= list.length" no-more-data-text="暂无更多活动"
            > 
            </loadmore>
        </div>
        <page-loading v-if="!pageLoaded"></page-loading>
    </block>
</template>

<script>
import searchBar from '@/components/searchbar'
import pageLoading from '@/components/page-loading'
import loadmore from '@/components/loadmore'
export default {
    data () {
        return {
            searchData : {
                pageSize : 10,
                pageNumber : 1,
                age : '',
                time : '',
                position : '',
                sort : ''
            },
            list : [],
            total : 0,
            pageLoaded : false
        }
    },
    computed:{
        listFormat(){
            var listFormat = this.list.map((item)=>{
                return {
                    ...item,
                    ticket_min_format : this.formatMoney(item.tickets.ticket_min),
                    ticket_max_format : this.formatMoney(item.tickets.ticket_max),
                }
            })
            return listFormat
        }
    },
    components: {
        searchBar,
        pageLoading,
        loadmore
    },

    methods: {
        searchChange(form){
            this.searchData = {...this.searchData,...form}
            this.getData()
        },
        async getData(){
            this.list = [];
            this.searchData.pageNumber =  1;
            this.loaded = false;
            var {data,total} = await this.$http.post('/api/product/listdata',this.searchData);
            this.list = data;
            this.total = total * 1;
            this.loaded = true;
            this.pageLoaded = true;
            wx.stopPullDownRefresh();
        },
        async loadmore(){
            if(!this.loaded || this.total <= this.list.length){
                return
            }
            this.searchData.pageNumber = this.searchData.pageNumber + 1;
            this.loaded = false;
            var {data,total} = await this.$http.post('/api/product/listdata',this.searchData);
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
        this.searchData.position = this.$root.$mp.query.id;
        var title = this.$root.$mp.query.name
        this.setWxTitle(title)
    },
    onUnload(){
        this.pageLoaded = false;
    },
    onShow(){
        
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "~@/assets/styles/activity-list.less";
</style>
