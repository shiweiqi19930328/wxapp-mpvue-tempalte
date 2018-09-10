<template>
	<block>
        <div class="index" v-if="loaded">
            <div class="wrap">
                <div class="sarch-con flex-center-between">
                    <div class="location flex-1 font-bold">深圳</div>
                    <a class="flex-center sarch-input-con"  href="/pages/index/search">
                        <icon  type="search" size="15" class="icon"></icon>
                        <input placeholder="请输入演出名称、场馆"  class="flex-1 search-input" disabled  confirm-type="search"/>
                    </a>
                </div>
            </div>
            <div class="wrap nav flex-center-between">
                <a 
                    hover-class="none"
                    v-for="(nav,index) in navs" 
                    :key="index"
                    :href="'/pages/activity/list?id='+nav.id+'&name='+nav.position_name"
                >
                    <div class="nav-item flex-column-center">
                        <div class="nav-item-img flex-center-center primary-linear">
                            <img :src="nav.position_img"  class="nav-item-img-icon" mode="aspectFit"/>
                        </div>
                        <div class="nav-item-title font-bold">{{nav.position_name}}</div>
                    </div>
                </a>
            </div>
            <div class="wrap main-activity flex-center-between">
                <a class="card flex-center-between" :href="'/pages/activity/list?id=10&name=限时折扣'" hover-class="none">
                    <div>
                        <div class="title font-bold">
                            限时折扣
                        </div>
                        <div class="desc">海量演出享低价</div>
                    </div>
                    <img src="/static/images/discount-icon.png"  class="icon" mode="aspectFit"/>
                </a>
                <div class="card flex-center-between" @click="toTab('/pages/rebate/index')">
                    <div>
                        <div class="title font-bold">
                            分享返利
                        </div>
                        <div class="desc">开心分享又挣钱</div>
                    </div>
                    <img src="/static/images/rebate-icon.png"  class="icon" mode="aspectFit"/>
                </div>
            </div>
            <div class="other-activity  bg-primary">
                <div class="header flex-end-between wrap">
                    <div class="title font-bold">近期热门</div>
                    <div class="more font-bold">
                        <a  href="/pages/activity/list?id=1&name=近期热门" hover-class="none">更多…</a>
                    </div>
                </div>
                <scroll-view scroll-x class="hot-card-scroll-con">
                    <div class="hot-card-con">
                        <a 
                            hover-class="none"
                            class="card" 
                            :class="index == hotsFormat.length-1 ? 'last' : ''"
                            v-for="(item,index) in hotsFormat" :key="index" 
                            :href="'/pages/activity/detail?id='+item.tickets.ticket_id"
                        >
                            <div class="discount-con bg-linear">
                                <div class="discount font-bold">{{item.tickets.ticket_discount}}</div>
                                <div class="discount-after">折起</div>
                            </div>
                            <img :src="item.img" class="icon" mode="aspectFill">
                            <div class="title ellipsis-l2 font-bold">{{item.tickets.ticket_title}}</div>
                            <div class="time">
                                {{item.startFormat}}～{{item.endFormat}}
                            </div>
                            <div class="flex-end money-con">
                                <div class="money font-bold">¥{{item.tickets.ticket_min}}</div>
                                <div class="money-after">元起</div>
                            </div>
                        </a>
                    </div>
                </scroll-view>  
            </div>
            <div class="other-activity wrap bg-primary">
                <div class="header flex-end-between">
                    <div class="title font-bold">为您推荐</div>
                    <div class="more font-bold">
                        <a  href="/pages/activity/list?id=2&name=为您推荐" hover-class="none">更多…</a>
                    </div>
                </div>
                <div class="recommended-card-con">
                    <a 
                        hover-class="none"
                        class="card" 
                        v-for="(item,index) in recommended" :key="index" 
                        :href="'/pages/activity/detail?id='+item.tickets.ticket_id"
                    >
                        <div class="price-con primary-linear">
                            <div class="price font-bold">¥{{item.tickets.ticket_min}}</div>
                            <div class="price-old"> 原价{{item.tickets.ticket_max}} </div>
                        </div>
                        <img :src="item.img" class="icon" mode="aspectFill">
                        <div class="title ellipsis font-bold">{{item.tickets.ticket_title}}</div>
                        <div class="desc ellipsis-l2">
                            {{item.tickets.ticket_introduce}}
                        </div>
                        <div class="flex-end-between">
                            <div class="flex-1">
                                <div class="tip" v-for="(tip,tipIndex) in  item.tickets.tagcentre" :key="tipIndex" v-if="item.tickets.tagcentre">
                                    {{tip.tag_name}}
                                </div>
                                <div class="tip" v-if="item.tickets.age">
                                    {{item.tickets.age}}
                                </div>
                            </div>
                            <div class="join">
                                已参加{{item.tickets.sales_num}}人
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="bottom-footer">·  我是个有底线的产品 ·</div>
        </div>
        <page-loading v-else></page-loading>
    </block>
</template>

<script>
import pageLoading from '@/components/page-loading'
import dayjs from 'dayjs'
export default {
	data() {
		return {
			navs : [],
            recommended : [],
            hots : []
		}
	},
	computed:{
        hotsFormat(){
            var list = [];
            var hotsFormat = this.hots.map((item)=>{
				var startFormat = dayjs(item.tickets.start_time).format('MM.DD')
                var endFormat = dayjs(item.tickets.end_time).format('MM.DD')
				return {
					...item,
					startFormat,
					endFormat
				}
            })
            return hotsFormat
        }
    },
	components: {
		pageLoading
	},

	methods: {
		async getData(){
            var requests = [
                this.$http.get('/api/product/all-label'),
                this.$http.get('/api/product/recommended'),
                this.$http.get('/api/product/hots'),
            ]
            var [navs,recommended,hots] = await Promise.all(requests);
            this.navs = navs;
            this.recommended = recommended;
            this.hots = hots;
			this.loaded = true;
			wx.stopPullDownRefresh();
        }
	},
	onLoad(){
        this.getData()
	},
	onPullDownRefresh(){
        this.getData()
    },
    onReachBottom(){
        
    },
	onShareAppMessage(){
        return {
            title:'童伴童行',
            path:'/pages/index/index'
        }
    }
}
</script>

<style lang="less">
	@import "~@/assets/styles/index.less";
</style>
