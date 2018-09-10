<template>
    <block>
        <div class="activity-detail" v-if="loaded">
            <swiper 
                :indicator-dots="true" indicator-active-color="#4a4949"  indicator-color="#f9f9f9"
                :autoplay="true" :circular="true" :interval="5000" :duration="1000">
                <block v-for="(item,index) in detail.banners" :key="index">
                    <swiper-item>
                        <img :src="item.banner_name"  class="banner" mode="aspectFill"/>
                    </swiper-item>
                </block>
            </swiper>
            <div class="base-info wrap">
                <div class="font-15 font-bold title">{{detail.ticket_title}}</div>
                <div class="font-12  desc">{{detail.ticket_introduce}}</div>
                <div class="flex-center price-con">
                    <div class="font-16 color-active new-price">¥{{newPrice}}</div>
                    <div class="font-12 old-price">原价¥{{oldPrice}}</div>
                </div>
                <div class="tips-con border-color">
                    <div class="tip" v-if="detail.age">
                        {{detail.age}}
                    </div>
                    <div class="tip" v-for="(tip,tipIndex) in  detail.tagcentre" :key="tipIndex" v-if="detail.tagcentre">
                        {{tip.tag_name}}
                    </div>
                </div>
                <div class="tuiguang-btn font-14 flex-center-center primary-linear" @click="drawImg">
                    <div class="text">
                        分享返利
                    </div>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section-2 flex-center-between wrap">
                <div class="content">
                    <div class="color-content title">{{detail.address}}</div>
                    <div class="color-content">{{detail.place}}</div>
                </div>
                <img src="/static/images/location.png"  class="location-img" @click="showLocation"/>
            </div>
            <div class="divide"></div>
            <div class="section-3 wrap">
                <div class="color-content title">报名须知</div>
                <wxParse :content="detail.notice" v-if="detail.show_info"></wxParse>
            </div>
            <div class="divide"></div>
            <div class="section-3 wrap">
                <div class="color-content title">演出信息</div>
                <wxParse :content="detail.show_info" v-if="detail.show_info"></wxParse>
            </div>
            <div class="divide"></div>
            <div class="section-3 wrap">
                <div class="color-content title">演出介绍</div>
                <wxParse :content="detail.ticket_info" v-if="detail.show_info"></wxParse>
            </div>
            <div class="footer wrap flex-center-between font-13" :class="isIphoneX?'fix-iphonex':''">
                <div class="footer-content flex-center">
                    <button class="flex-center contact" open-type="contact">
                        <img src="/static/images/kefu.png"  class="footer-img"/>
                        <div>客服</div>
                    </button>
                    <div class="split"></div>
                    <div class="flex-center" @click="collection">
                        <img :src="isCollect ? '/static/images/shoucang-checked.png' : '/static/images/shoucang.png'"  class="footer-img"/>
                        <div>收藏</div>
                    </div>
                </div>
                <button class="bg-linear baoming-btn" @click="goPay" open-type="getUserInfo" @getuserinfo="getuserinfo">立刻报名</button>
            </div>
        </div>
        <page-loading v-else></page-loading>
        <div class="hide-invite">
            <img :src="inviteImg" class="inviteImg" @click="previewImage(inviteImg)">
            <canvas canvas-id="invite" style="width: 295px;height: 390px;"  class="canvas" ></canvas>
        </div>
    </block>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import pageLoading from '@/components/page-loading'
export default {
    components: {
        wxParse,
        pageLoading
    },
    data () {
        return {
            ticket_id : '',
            detail : {},
            loaded : false,
            isCollect : false,
            isCollecting : false,
            inviteImg : '',
        }
    },
    computed:{
        oldPrice(){
            return this.formatMoney(this.detail.ticket_max)
        },
        newPrice(){
            return this.formatMoney(this.detail.ticket_min)
        }
    },
    methods: {
        showLocation(){
            var longitude = this.detail.coordinate.split(',')[0] * true;
            var latitude = this.detail.coordinate.split(',')[1] * true;
            wx.openLocation({
                longitude,  //经度
                latitude, //纬度
            })
        },
        goPay(){
            var url = `/pages/pay/index?id=${this.ticket_id}`
            wx.navigateTo({url})
        },
        // 收藏
        async collection(){
            if(this.isCollecting){
                return
            }
            this.isCollecting = true;
            // 取反收藏接口
            if(this.isCollect){
                var result = await this.$http.post('/api/product/delete-collect',{ids:[this.isCollect],openid:this.openid});
                if(result){
                    this.isCollect = false
                }else{
                    this.showToast('取消收藏失败')
                }
                
            }else{
                var isCollect = await this.$http.post('/api/product/collect-data',{ticket_id:this.ticket_id,openid:this.openid});
                if(isCollect){
                    this.isCollect = isCollect
                    this.showToast('收藏成功')
                }else{
                    this.showToast('收藏失败')
                }
            }
            this.isCollecting = false;
        },
        async getData(){
            var requests = [
                this.$http.post('/api/product/data-info',{ticket_id:this.ticket_id}),
                this.$http.post('/api/product/is-collect',{ticket_id:this.ticket_id,openid:this.openid})
            ]
            var [detail,isCollect] =  await Promise.all(requests)
            this.loaded = true;
            this.detail = detail;
            this.isCollect = isCollect;
            this.setWxTitle(this.detail.ticket_title);
        },
        async drawImg(){
            this.showLoading('海报制作中')
            // 折扣价
            var minPrice = this.formatMoney(this.detail.ticket_min)
            var qrimg = await this.$http.post('/api/product/qrcode',{path:`/pages/activity/detail?share_openid=${this.openid}&id=${this.ticket_id}`});
            var canvas_id ='invite';
            this.drawShare(canvas_id,this.detail.ticket_img,this.detail.ticket_title,minPrice,qrimg,(inviteImg)=>{
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
        this.ticket_id = this.$root.$mp.query.id;
        var share_openid = this.$root.$mp.query.share_openid;
        if(share_openid){
            this.$store.commit('saveShare',{share_openid,ticket_id:this.ticket_id});  
        }
        this.getData()
    },
    onUnload(){
        this.loaded = false;
        this.showDraw = false;
        this.inviteImg = ''
    },
    onShow(){
        
    },
    mounted () {
        
    },
    onShareAppMessage(){
        return {
            title: this.detail.ticket_title,
            path:'/pages/activity/detail?id='+this.detail.ticket_id,
            imageUrl:this.detail.ticket_img
        }
    }
}
</script>

<style  lang="less">
    @import "~@/assets/styles/activity-detail.less";
    @import url("~mpvue-wxparse/src/wxParse.css");
</style>
