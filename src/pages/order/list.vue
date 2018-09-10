<template>
    <block>
        <div class="order">
            <div class="wrap">
                <tabs-bar :width="670" :default-size="5" :options="tabbar" v-model="tabActive"></tabs-bar>
            </div>
            <swiper :duration="duration" :current="tabActive" class="swiper" @change="swiperChange" >
                <!-- 待参加 -->
                <swiper-item class="slide-item">
                    <scroll-view scroll-y class="scroll-view">
                        <div class="wrap card-con" v-if="needUse.length > 0">
                            <!-- 根据时间剩余是否3天以内 切换颜色 warn white -->
                            <div 
                                class="card   font-12" 
                                :class="item.leftTime <= 3 ? 'warn':'white'"
                                v-for="(item,index) in  needUse"
                                :key="index"
                            >
                                <div class="desc">
                                    <div class="title flex-center-between">
                                        <div class="order-num">订单号：{{item.order_key}}</div>
                                        <div class="color-active from ellipsis" v-if="item.gift">“{{item.gift}}”赠送</div>
                                    </div>
                                    <div class="content">
                                        <img :src="item.tickets.ticket_img"  mode="aspectFill" class="card-img">
                                        <div class="content-text flex-column-between">
                                            <div class="color-content">
                                                <div class="ellipsis font-bold line">{{item.tickets.ticket_title}}</div>
                                                <div class="ellipsis line">套餐：{{item.levels.level_name}}</div>
                                                <div class="ellipsis line">数量：{{item.num}}张</div>
                                                <div class="ellipsis line">合计：¥{{item.totalFormat}}</div>
                                            </div>
                                            <div class="font-bold active-time">有效日期：{{item.end_time_format}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer flex-center-between">
                                    <div class="flex-center" v-if="item.leftTime > 0">
                                        <img :src="item.leftTime <= 3 ? '/static/images/time-warn.png':'/static/images/time.png'"  class="footer-img">
                                        <div class="footer-time">还剩{{item.leftTime}}天</div>
                                    </div>
                                    <div class="flex-center" v-else>
                                        <img src="/static/images/time-warn.png"  class="footer-img">
                                        <div class="footer-time">已过期</div>
                                    </div>
                                    <div class="flex-center footer-btn-group" v-if="item.leftTime > 0">
                                        <button class="footer-btn" @click="drawImg2(item)" open-type="getUserInfo" @getuserinfo="getuserinfo">转赠好友</button>
                                        <button class="footer-btn" @click="drawImg(item)">分享返利</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <loadmore :no-data="needUseLoaded && needUse.length == 0" no-data-text="暂无数据"
                        :no-more-data="needUseLoaded" no-more-data-text=""></loadmore>
                    </scroll-view>
                </swiper-item>
                <swiper-item class="slide-item">
                    <!-- 待付款 -->
                     <scroll-view scroll-y class="scroll-view">
                        <div class="wrap card-con" v-if="needPayFormat.length > 0">
                            <div 
                                class="card   font-12 blue"
                                v-for="(item,index) in  needPayFormat"
                                :key="index"
                            >
                                <div class="desc">
                                    <div class="title flex-center-between">
                                        <div class="order-num">订单号：{{item.order_key}}</div>
                                        <!--<div class="color-active from">“宝妈咪哄”赠送</div> -->
                                    </div>
                                    <div class="content">
                                        <img :src="item.tickets.ticket_img"  mode="aspectFill" class="card-img">
                                        <div class="content-text flex-column-between">
                                            <div class="color-content">
                                                <div class="ellipsis font-bold line">{{item.tickets.ticket_title}}</div>
                                                <div class="ellipsis line">套餐：{{item.levels.level_name}}</div>
                                                <div class="ellipsis line">数量：{{item.num}}张</div>
                                                <div class="ellipsis line">合计：¥{{item.totalFormat}}</div>
                                            </div>
                                            <div class="font-bold active-time">有效日期：{{item.end_time_format}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer flex-center-between">
                                    <div class="flex-center">
                                        <div class="footer-time">{{item.leftMinSecond.min}}分{{item.leftMinSecond.second}}秒自动取消</div>
                                    </div>
                                    <div class="flex-center">
                                        <button class="footer-btn" @click="pay(item.order_id)">去付款</button>
                                        <button class="footer-btn" @click="drawImg(item)">分享返利</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <loadmore :no-data="needPayLoaded && needPayFormat.length == 0" no-data-text="暂无数据"
                        :no-more-data="needPayLoaded" no-more-data-text=""></loadmore>
                    </scroll-view>
                </swiper-item>
                <!-- 已使用 -->
                <swiper-item class="slide-item">
                    <scroll-view scroll-y class="scroll-view">
                        <div class="wrap card-con" v-if="usedOrder.length > 0">
                            <div 
                                class="card   font-12 white" 
                                v-for="(item,index) in  usedOrder" 
                                :key="index"
                            >
                                <div class="desc">
                                    <div class="title flex-center-between">
                                        <div class="order-num">订单号：{{item.order_key}}</div>
                                        <div class="from ellipsis" style="color:#ffa106;" v-if="item.giveopens && item.giveopens.member_name">赠予“{{item.giveopens.member_name}}”</div>
                                        <div class="color-active from ellipsis" v-else-if="item.gift">“{{item.gift}}”赠送</div>
                                    </div>
                                    <div class="content">
                                        <img :src="item.tickets.ticket_img"  mode="aspectFill" class="card-img">
                                        <div class="content-text flex-column-between">
                                            <div class="color-content">
                                                <div class="ellipsis font-bold line">{{item.tickets.ticket_title}}</div>
                                                <div class="ellipsis line">套餐：{{item.levels.level_name}}</div>
                                                <div class="ellipsis line">数量：{{item.num}}张</div>
                                                <div class="ellipsis line">合计：¥{{item.totalFormat}}</div>
                                            </div>
                                            <div class="font-bold active-time">有效日期：{{item.end_time_format}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer flex-center-between">
                                    <div class="flex-center">
                                        <button class="footer-btn ghost" @click="deleteOrder(item,index)" style="margin-left: 0">删除</button>
                                    </div>
                                    <div class="flex-center" v-if="item.leftTime > 0">
                                        <navigator :url="'/pages/activity/detail?id='+item.tickets.ticket_id" hover-class="none">
                                            <button class="footer-btn">再次订购</button>
                                        </navigator>
                                        <button class="footer-btn" @click="drawImg(item)">分享返利</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <loadmore 
                        :no-data="usedOrderLoaded && usedOrder.length == 0" no-data-text="暂无数据"
                        :no-more-data="usedOrderLoaded" no-more-data-text="">
                        </loadmore>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </div>
        <div class="modal" :class="deleteShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container delete-order-modal ">
                <div class="content font-18 primary-color font-bold">
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
            <canvas canvas-id="invite-order" style="width: 295px;height: 390px;"  class="canvas"></canvas>
        </div>
    </block>
</template>

<script>
import tabsBar from '@/components/tabs-bar'
import loadmore from '@/components/loadmore'
import {dayDiff,secondDiff} from '@/utils/index'
import dayjs from 'dayjs'
export default {
    components: {
        tabsBar,
        loadmore
    },
    data () {
        return {
            tabbar : [
                '待参加',
                '待付款',
                '已使用',
            ],
            tabActive : 0,
            duration : 0,
            needUse : [],//待参加列表
            needUseLoaded : false,
            needPay : [],//待付款列表
            needPayLoaded : false,
            usedOrder : [],//已使用列表
            usedOrderLoaded : false,
            inviteImg : '',//保存分享海报
            deleteShow : false,
            deleteItem : '',
            deleteIteming : false,
            currentTime:dayjs()
        }
    },
    computed:{
        // 待付款提取金额格式化和倒计时，并且剩余大于0 才显示
        needPayFormat(){
            var list = [];
            this.needPay.forEach(
                (item)=>{
                    var totalFormat = this.formatMoney(item.total)
                    var end_time_format = dayjs(item.tickets.end_time).format('YYYY.MM.DD')
                    // 获取创建时间和当前时间的秒数差
                    var leftTime = secondDiff(item.created_at,this.currentTime)
                    var leftMinSecond = this.getLeft(leftTime)
                    if(leftTime > -5*60){
                        list.push({
                            ...item,
                            end_time_format,
                            totalFormat,
                            leftTime,
                            leftMinSecond
                        })
                    } 
                }
            )
            return list
        },
        
    },
    
    watch : {
        
    },
    methods: {
        swiperChange(e){
            // 滑动触发的才去更新active
            if(e.mp.detail.source == 'touch'){
                this.tabActive = e.mp.detail.current;
            } 
        },
         // 删除订单 =》 显示 取消 确定
        deleteOrder(item,index){
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
            this.$http.post('/api/product/soft-delete',{order_id:this.deleteItem.order_id}).then(
                ()=>{
                    this.deleteShow = false;
                    this.getUsedOrder();
                    this.deleteIteming = false;
                },
                ()=>{
                     this.deleteIteming = false;
                }
            )
        },
        // 待参加
        async getNeedUse(){
            var postData = {
                openid : this.openid,
                order_state : 1,
                is_use : 0
            }
            var needUse = await this.$http.post('/api/product/order-list',postData)
            // 待使用提取金额格式化和剩余时间，并且提取时间大于0的
            this.needUse = needUse.map(
                (item)=>{
                    var totalFormat = this.formatMoney(item.total)
                    var end_time_format = dayjs(item.tickets.end_time).format('YYYY.MM.DD')
                    // 获取创建时间和当前时间的秒数差
                    var leftTime = dayDiff(item.tickets.end_time+' 23:59:59')
                    return {
                        ...item,
                        totalFormat,
                        end_time_format,
                        leftTime
                    }
                }
            )
            this.needUseLoaded = true;
        },
        // 待付款
        async getNeedPay(){
            var postData = {
                openid : this.openid,
                order_state : 0,
                is_use : ''
            }
            var needPay = await this.$http.post('/api/product/order-list',postData);
            this.needPay = needPay;
            this.needPayLoaded = true;
        },
        // 获取剩余分和秒
        getLeft(passSecond){
            // 以半小时为基准，计算剩余秒和分
            var left = 5*60+passSecond;
            var min = Math.floor(left/60);
            var second = left % 60;
            return {
                min,
                second
            }
        },
        // 已使用
        async getUsedOrder(){
            var postData = {
                openid : this.openid,
                order_state : 1,
                is_use : 1
            }
            var usedOrder = await this.$http.post('/api/product/order-list',postData);
            // 已使用金额格式化
            this.usedOrder = usedOrder.map(
                (item)=>{
                    var totalFormat = this.formatMoney(item.total);
                    var end_time_format = dayjs(item.tickets.end_time).format('YYYY.MM.DD');
                    // 获取创建时间和当前时间的秒数差
                    var leftTime = dayDiff(item.tickets.end_time+' 23:59:59');
                    console.log(leftTime)
                    return {
                        ...item,
                        totalFormat,
                        end_time_format,
                        leftTime
                    }
                }
            )
            
            this.usedOrderLoaded = true;
            
        },
        // 动态获取数据，避免频繁的去切换获取数据，不如每次页面显示的时候初始化一次
        getData(){
            this.getNeedUse()
            this.getNeedPay()
            this.getUsedOrder()
        },
        async drawImg(item){
            this.showLoading('海报制作中')
            // 折扣价
            var minPrice = this.formatMoney(item.tickets.ticket_min)
            var qrimg = await this.$http.post('/api/product/qrcode',{path:`/pages/activity/detail?share_openid=${this.openid}&id=${item.tickets.ticket_id}`});
            var canvas_id ='invite-order';
            this.drawShare(canvas_id,item.tickets.ticket_img,item.tickets.ticket_title,minPrice,qrimg,(inviteImg)=>{
                this.inviteImg = inviteImg;
                this.hideLoading();
                this.previewImage(this.inviteImg)
            })
        },
        async drawImg2(item){
            this.showLoading('转赠海报制作中')
            // 票价
            var totalPrice = this.formatMoney(item.total)
            var qrimg = await this.$http.post('/api/product/qrcode',{path:`/pages/rebate/friend-order?shareopenid=${this.openid}&order_id=${item.order_id}`});
            var canvas_id ='invite-order';
            this.drawShare2(canvas_id,item.tickets.ticket_img,item.tickets.ticket_title,totalPrice,qrimg,(inviteImg)=>{
                this.inviteImg = inviteImg;
                this.hideLoading();
                this.previewImage(this.inviteImg)
            })
        },
    },
    onPullDownRefresh(){
        
    },
    created(){
        // 定时器，每秒去获取一下最新时间,为了减少性能消耗，只当时待付款 才去更新
        setInterval(()=>{
            if(this.tabActive == 1 && this.needPay.length > 0){
                this.currentTime = dayjs()
            }
        },1000)
    },
    
    onLoad(){
        this.tabActive = this.$root.$mp.query.type;
        this.duration = 500;
    },
    onShow(){
        this.getData();
    },
    onUnload(){
        
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "~@/assets/styles/order.less";
</style>
