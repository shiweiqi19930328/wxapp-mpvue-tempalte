<template>
    <block>
        <div class="wrap">
            <div class="sarch-con flex-center">
                <div class="flex-center sarch-input-con">
                    <icon  type="search" size="14" class="icon"></icon>
                    <input placeholder="请输入演出名称、场馆"  class="flex-1 search-input"   confirm-type="search" v-model.lazy="key"/>
                </div>
                <div class="align-right location flex-1" @click="clear">取消</div>
            </div>
        </div>
        <div v-if="key && searchLoaded">
            <div class="no-search-list" v-if="searchList.length == 0">
                <div>很抱歉～没有搜到”{{key}}“相关信息。</div>
                <div>请取消，重新搜索。</div>
            </div>
            <div v-else class="wrap">
                <a class="search-list-item" hover-class="none"
                v-for="(item,index) in searchList" :key="index"
                :href="'/pages/activity/detail?id='+item.ticket_id"
                >
                    <div class="title zan-ellipsis">{{item.ticket_title}}</div>
                    <div class="flex-center-between">
                        <div>{{item.place}}</div>
                        <div>{{item.timeRange}}</div>
                    </div>
                </a>
            </div>
        </div>
        <div v-else style="padding-left: 20px;">
            <div class="group">
                <div class="title">历史搜索</div>
                <div class="flex-center search-tips" v-if="record && record.length > 0">
                    <div class="search-tip zan-ellipsis" 
                    v-for="(item,index) in record" :key="index"
                    @click="setKey(item)"
                    >{{item}}</div>
                </div>
                <div v-else class="no-search-tips">
                    没有历史记录
                </div>
            </div>
            <div class="group">
                <div class="title">热门搜索</div>
                <div class="flex-center search-tips">
                    <div class="search-tip zan-ellipsis" 
                    v-for="(item,index) in hotwords" :key="index"
                    @click="setKey(item)"
                    >{{item}}</div>
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
            key : '',
            pageNumber : 1,
            pageSize : 20,
            record : [],
            hotwords : [],
            searchList : [],
            searchLoaded : false
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
       async getData(){
            var requests = [
                this.$http.get('/api/product/hotwords'),
                this.$http.post('/api/product/search-record',{openid:this.openid}),
            ]
            var [hotwords,record] = await Promise.all(requests);
            this.hotwords = hotwords;
            this.record = record;
            this.loaded = true;
        },
        clear(){
            this.key = '';
            this.getData();
        },
        setKey(key){
            this.key = key
        },
        async search(){
            this.searchLoaded = false;
            var postData = {
                key : this.key,
                pageNumber : this.pageNumber,
                pageSize : this.pageSize,
                openid : this.openid
            };
            var searchList = await this.$http.post('/api/product/search-list',postData);
            searchList.forEach((item)=>{
                item.timeRange = dayjs(item.start_time).format('YYYY.MM.DD')+'~'+dayjs(item.end_time).format('YYYY.MM.DD')
            })
            this.searchList = searchList;
            this.searchLoaded = true
        }
    },
    onPullDownRefresh(){
        
    },
    onReachBottom(){
        
    },
    created(){
        
    },
    watch : {
        key(val){
            if(val){
                this.pageNumber = 1; 
                this.search();
            } 
        }
    },
    onLoad(){
        
    },
    onUnload(){
        this.key = ''
    },
    onShow(){
        if(!this.key){
            this.getData()
        }
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    .no-search-list{
        font-size:14px;
        color:#aeacad;
        line-height:21px;
        margin-top: 23px;
        text-align: center;
    }
    .search-list-item{
        padding-top: 15px;
        padding-bottom: 15px;
        color:#aeacad;
        font-size: 12px;
        border-bottom:1px solid #dbdade;
        .title{
            font-size: 15px;
            color: #2e2e2e;
            font-weight: 500;
            margin-bottom: 6px;
        }
    }
    .group{
        margin-top: 30px;
        font-size:14px;
        color:#4a4a4a;
        .title{
            font-size:17px;
            color:#2e2e2e;
            font-weight: bold;
            margin-bottom: 17px;
        }
        .search-tips{
            flex-wrap : wrap;
            .search-tip{
                border:1rpx solid #dbdade;
                border-radius:6px;
                width:75px;
                height:30px;
                margin-bottom: 9px;
                margin-right: 9px;
                line-height: 30px;
                text-align: center;
            }
        }
        .no-search-tips{
            padding-top: 3px;
        }
    }
</style>
