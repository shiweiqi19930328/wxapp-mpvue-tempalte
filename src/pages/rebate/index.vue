<template>
    <block>
        <div class="rebate" v-if="pageLoaded">
            <div class="tab-bar-con">
                <tabs-bar :width="670" :default-size="5" :options="tabsBarOptions" v-model="tabActive"></tabs-bar>
            </div>
            <div class="wrap card-con">
                <a  
                    v-for="(item,index) in listFormat"
                    :key="index"
                    :href="'/pages/activity/detail?id='+item.tickets.ticket_id"
                    hover-class="none"
                >
                    <div class="card flex-center">
                        <img :src="item.tickets.ticket_img"  mode="aspectFill" class="img">
                        <div class="content color-content flex-column-between">
                            <div class="flex-column">
                                <div class="title ellipsis-l2 font-bold">{{item.tickets.ticket_title}}</div>
                                <div class="tips-con">
                                    <div class="tip" v-if="item.tickets.age">
                                        {{item.tickets.age}}
                                    </div>
                                    <div class="tip" v-for="(tip,tipIndex) in  item.tickets.tagcentre" :key="tipIndex" v-if="item.tickets.tagcentre">
                                        {{tip.tag_name}}
                                    </div>
                                </div>
                            </div>
                            <div class="flex-end-between">
                                <div>
                                    <div class="money">¥{{item.moneyFormat}}起</div>
                                    <div class="rebate-money font-bold">返利{{item.tickets.ticket_commission}}元/次</div>
                                </div>
                                <div class="primary-linear btn  flex-column-center-between" @click.stop="drawImg(item)">
                                    <div>分享</div>
                                    <div class="divide"></div>
                                    <div>海报</div>
                                </div>
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
        <page-loading v-else></page-loading>
        <div class="hide-invite">
            <img :src="inviteImg" class="inviteImg" @click="previewImage(inviteImg)">
            <canvas canvas-id="invite-rebate" style="width: 295px;height: 390px;"  class="canvas"></canvas>
        </div>
    </block>
    
</template>

<script>
import pageLoading from '@/components/page-loading'
import loadmore from '@/components/loadmore'
import tabsBar from '@/components/tabs-bar'
export default {
    components: {
        pageLoading,
        loadmore,
        tabsBar
    },
    data () {
        return {
            tabbar : [],
            tabActive:0,
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
            inviteImg : '',
            loaded : false,
            pageLoaded : false
        }
    },
    computed:{
        listFormat(){
            var list = this.list.map((item)=>{
                var moneyFormat = this.formatMoney(item.tickets.ticket_min);
                return {
                    ...item,
                    moneyFormat
                }
            })
            return list
        },
        // 转化tab组件所需数组格式
        tabsBarOptions(){
            var options =this.tabbar.map(item=>item.position_name)
            return options
        }
    },
    watch : {
        // tab切换
        tabActive(val){
            if(!this.loaded){
                return
            }
            this.searchData.type_id = this.tabbar[val].id;
            this.getData();
        }
    },
    methods: {
        async getTabs(){
            var tabbar = await this.$http.get('/api/product/all-label');
            this.tabbar = tabbar;
            this.searchData.position = this.tabbar[0].id;
            this.getData()
        },
        async getData(){
            this.list = [];
            this.searchData.pageNumber =  1;
            this.loaded = false;
            var {data,total} = await this.$http.post('/api/product/listdata',this.searchData);
            this.total = total * 1;
            this.list = data;
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
            this.total = total * 1;
            this.list = this.list.concat(data);
            this.loaded = true;
        },
        async drawImg(item){
            this.inviteImg = '';
            this.showLoading('海报制作中')
            // 折扣价
            var minPrice = this.formatMoney(item.tickets.ticket_min)
            var qrimg = await this.$http.post('/api/product/qrcode',{path:`/pages/activity-detail/activity-detail?share_openid=${this.openid}&id=${item.tickets.ticket_id}`});
            var course_num = `共${item.tickets.course_num}期`
            var canvas_id ='invite-rebate';
            this.drawShare(canvas_id,item.tickets.ticket_img,item.tickets.ticket_title,minPrice,qrimg,(inviteImg)=>{
                this.inviteImg = inviteImg;
                this.hideLoading();
                this.previewImage(this.inviteImg)
            })
        }
    },
    onPullDownRefresh(){
        this.getData()
    },
    onReachBottom(){
        this.loadmore()
    },
    created(){
        
    },
    onLoad(){
        this.getTabs()
    },
    onUnload(){
        
    },
    onShow(){
        
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "~@/assets/styles/rebate.less";
</style>
