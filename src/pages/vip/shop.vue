<template>
    <block>
        <div class="love-list">
            <a 
                v-for="(item,index) in list" 
                :key="index" 
                :href="'/pages/activity/detail?id='+item.tickets.ticket_id" 
                hover-class="none"
            >
                <div class="love flex-center">
                    <img :src="item.tickets.ticket_img" class="love-img" mode="aspectFill">
                    <div class="content flex-column-between">
                        <div>
                            <div class="font-14  title ellipsis-l2">{{item.tickets.ticket_title}}</div>
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
                            <div class="font-14 primary-color">¥{{item.tickets.ticket_min_format}}</div>
                            <div class="flex-center">
                                <button class="btn ghost" @click.stop="deleteLove(item,index)">删除</button>
                                <button class="btn active" @click.stop="drawImg(item)">分享</button>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <loadmore 
            :no-data="loaded && total == 0" no-data-text="暂无数据" 
            :no-more-data="loaded && total <= list.length" no-more-data-text="没有更多数据啦"
        > 
        </loadmore>
        <div class="modal" :class="deleteShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container delete-order-modal ">
                <div class="content font-18 font-bold primary-color">
                    <div> 确定删除</div>
                    <div class="ellipsis" v-if="deleteItem && deleteItem.tickets">{{deleteItem.tickets.ticket_title}}</div>
                </div>
                <div class="footer flex-center">
                    <div class="btn cancel" @click="cancel">取消</div>
                    <div class="btn" @click="deleteConfirm">确定</div>
                </div>
            </div>
        </div>
        <div class="hide-invite">
            <img :src="inviteImg" class="inviteImg" @click="previewImage(inviteImg)">
            <canvas canvas-id="invite-love-list" style="width: 295px;height: 390px;"  class="canvas" ></canvas>
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
            // 搜索条件
            searchData : {
                pageSize : 10,
                pageNumber : 1,
                openid : ''
            },
            // 列表数据
            list : [],
            // 总数
            total : 0,
            // 分享海报
            inviteImg : '',
            // 删除收藏
            deleteShow : false,
            deleteItem : '',
            deleteIteming : false,
        }
    },
    methods: {
        // 获取数据
       async getData(){
            this.searchData.pageNumber =  1;
            this.loaded = false;
            var {data,total} = await this.$http.post('/api/product/shop-list',this.searchData);
            for(var i =0,len=data.length;i<len;i++){
                data[i].tickets.ticket_min_format = this.formatMoney(data[i].tickets.ticket_min);
            }
            this.list = data;
            this.total = total * true;
            this.loaded = true;
            wx.stopPullDownRefresh();
        },
        // 加载更多
        async loadmore(){
            if(!this.loaded || this.total <= this.list.length){
                return
            }
            this.searchData.pageNumber = this.searchData.pageNumber + 1;
            this.loaded = false;
            var {data,total} = await this.$http.post('/api/product/shop-list',this.searchData);
            for(var i =0,len=data.length;i<len;i++){
                data[i].tickets.ticket_min_format = this.formatMoney(data[i].tickets.ticket_min);
            }
            this.list = this.list.concat(data);
            this.total = total * true;
            this.loaded = true;
        },
        // 删除收藏 =》显示 取消 确定
        deleteLove(item,index){
            this.deleteShow = true;
            this.deleteItem = item;
        },
        cancel(){
            this.deleteShow = false
        },
        deleteConfirm(){
            if(this.deleteIteming){
                return
            }
            this.deleteIteming = true;
            this.$http.post('/api/product/delete-shop',{ids:[this.deleteItem.id],openid:this.openid}).then(
                (res)=>{
                    this.getData();
                    this.deleteShow = false;
                    this.deleteIteming = false;
                },
                (error)=>{
                    this.deleteIteming = false;
                }
            )
        },
        // 推广海报
        async drawImg(item){
            this.showLoading('海报制作中')
            // 折扣价
            var minPrice = this.formatMoney(item.tickets.ticket_min)
            var qrimg = await this.$http.post('/api/product/qrcode',{path:`/pages/activity/detail?share_openid=${this.openid}&id=${item.tickets.ticket_id}`});
            var canvas_id ='invite-love-list';
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
    onLoad(){
        
    },
    onUnload(){
       
    },
    onShow(){
        this.searchData.openid = this.openid;
        this.getData()
    },
}
</script>

<style  lang="less">
    @import "~@/assets/styles/love-list.less";
</style>
