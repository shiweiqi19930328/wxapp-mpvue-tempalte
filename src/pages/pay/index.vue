<template>
    <block v-if="loaded">
        <div class="order-detail" :class="isIphoneX?'page-fix-iphonex':''">
            <div class="header">
                <div class="header-desc primary-linear font-15">
                    <div>【{{detail.ticket_subtitle}}】</div>
                    <div class="title">{{detail.ticket_title}}</div>
                    <div class="font-12">{{detail.ticket_introduce}}</div>
                </div>
            </div>
            <div class="section">
                <div class="title font-14 color-content">选择场次</div>
                <radio-group  @change="radioChange1" class="radio-group-1" >
                    <label class="radio-group-1-label" v-for="(item,index) in detail.time" :key="index">
                        <radio :value="item.time_id" v-show="false"/>
                        <div class="flex-center-between">
                            <div>{{item.time_name}}</div>
                            <img src="/static/images/checked.png"  class="checked-img" v-if="item.time_id == form.times"/>
                            <div class="empty-checked" v-else></div>
                        </div>
                    </label>
                </radio-group>
            </div>
            <div class="divide"></div>
            <div class="section section-2">
                <div class="title font-14 color-content">选择套餐</div>
                <radio-group  @change="radioChange2" class="radio-group-2">
                    <label class="radio-group-2-label" v-for="(item,index) in detail.level" :key="index" :class="item.level_id == form.level ? 'active' : ''">
                        <radio :value="item.level_id" v-show="false"/>
                        {{item.level_name}}
                    </label>
                </radio-group>
                <div class="num-con flex-center-between">
                    <div class="color-active font-14">
                        <p v-if="form.level">¥{{singleFormat}}／张</p>
                        <p class="remain" v-if="form.level">库存{{num}}张</p>
                    </div>
                    <div class="flex-center">
                        <img src="/static/images/minus.png"  class="action-img" @click="minusCount"/>
                        <div class="num">{{form.num}}</div>
                        <img src="/static/images/add.png"  class="action-img" @click="addCount"/>
                    </div>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section section-3">
                <div class="title font-14 color-content">个人信息（必填）</div>
                <div class="form-cell flex-center-between first">
                    <div class="label">姓名</div>
                    <input placeholder="请输入真实姓名" class="input" v-model.lazy="form.name"></input>
                </div>
                <div class="form-cell flex-center-between">
                    <div class="label">手机</div>
                    <input placeholder="请输入手机号" class="input font-bold" type="number" v-model.lazy="form.phone"></input>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section">
                <div class="title font-14 color-content">备注</div>
                <div class="textarea">
                    <textarea  auto-height class="font-12 color-content" placeholder="如有特殊要求，请留言" v-model.lazy="form.remark"></textarea>
                </div>
            </div>
            <div class="divide"></div>
            <div class="section section-4">
                <div class="phone" @click="callPhone('4009832000')">客服电话：4009832000</div>
            </div>
            <div class="footer wrap flex-center-between font-13 color-title">
                <div class="footer-content flex-center">
                    <div class="flex-end total-money font-bold">
                        <div class="font-14" style="color: #000000">合计:  </div>
                        <div class="font-17  primary-color">¥{{totalFormat}}</div>
                    </div>
                </div>
                <button class="primary-linear baoming-btn" @click="gopay">确认支付</button>
            </div>
        </div>
    </block>
</template>

<script>
export default {
    data () {
    return {
            ticket_id : '',
            detail : {},
            form : {
                level : '',
                times : '',
                num : 1,
                user_openid : '',
                agent_openid : '',
                ticket : '',
                remark : '',
                name : '',
                phone : '',
            },
            rules : {
                times : [
                  { required: true, message: '请选择场次'},
                ],
                level : [
                  { required: true, message: '请选择套餐'},
                ],
                name : [
                    { required: true, message: '请输入真实姓名'}
                ],
                phone : [
                    { required: true, message: '请输入手机号'},
                    { type: 'telphone',message: '您输入手机号有误'},
                ],
                
            },
            loaded : false
        }
    },
    computed:{
        single(){
            var level = this.findLevel(this.form.level);
            if(this.form.level && level){
                return level.price
            }
            return 0
        },
        num(){
            var level = this.findLevel(this.form.level);
            if(this.form.level && level){
                return level.num
            }
            return 0
        },
        singleFormat(){
            return this.formatMoney(this.single)
        },
        total(){
            return this.single * this.form.num
        },
        totalFormat(){
            return this.formatMoney(this.total)
        }
    },
    components: {
        
    },

    methods: {
        findLevel(level_id){
            if(!this.detail.level){
                return false
            }
            for(var i=0,len=this.detail.level.length;i<len;i++){
                if(level_id == this.detail.level[i].level_id){
                    return this.detail.level[i]
                }
            }
        },
        // 场次
        radioChange1(e){
            this.form.times = e.mp.detail.value
        },
        // 套餐
        radioChange2(e){
            var level = this.findLevel(e.mp.detail.value);
            if(level.num == 0){
                this.showToast('当前套餐已售罄')
                return 
            }
            this.form.level = e.mp.detail.value;
            this.form.num = 1;
        },
        addCount(){
            if(!this.form.level){
                this.showToast('请先选择套餐')
                return
            }
            if(this.form.num >= this.num){
                this.showToast(`当前套餐库存仅${this.num}件`)
                return
            }
            this.form.num = this.form.num + 1;
        },
        minusCount(){
            if(this.form.num <= 1){
                return 
            }
            this.form.num = this.form.num - 1;
        },
        async getData(){
            var detail = await this.$http.post('/api/product/shop-info',{ticket_id:this.ticket_id});
            this.detail = detail;
            this.loaded = true;
        },
        async gopay(){
            // 表单校验
            await this.$validate(this.form,this.rules);
            this.showLoading('生成订单中...')
            this.$http.post('/api/weixin-pay/create-orders',this.form).then(
                (res)=>{
                    var order_id = res;
                    this.hideLoading()
                    this.pay(order_id)
                }
            )
            
        }
    },
    onPullDownRefresh(){
        
    },
    created(){
        
    },
    watch : {
        
    },
    onLoad(){
        this.ticket_id = this.$root.$mp.query.id;
        this.form.user_openid = this.openid;
        this.form.ticket = this.ticket_id;
        if(this.share.share_openid && this.share.ticket_id == this.ticket_id){
            this.form.agent_openid = this.share.share_openid;
        }
        console.log(this.form)
        this.getData()
    },
    onUnload(){
        this.loaded = false;
        this.form = {
            level : '',
            times : '',
            num : 1,
            user_openid : '',
            agent_openid : '',
            ticket : '',
            remark : '',
            name : '',
            phone : '',
        }
    },
    onShow(){
        
    },
    mounted () {
        
    },
    
}
</script>

<style  lang="less">
    @import "../../assets/styles/order-detail.less";

</style>
