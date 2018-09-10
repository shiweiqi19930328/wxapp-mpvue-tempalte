<template>
    <div class="withdraw">
        <block v-if="canShow">
            <div class="section-1">
                <div class="title font-bold font-13">个人信息</div>
                <div class="color-title primary-linear content font-14">
                    <div>{{userInfo.real_name}}</div>
                    <div class="line">{{userInfo.member_address}}</div>
                    <div class="line">{{userInfo.bank_name}}{{userInfo.bank_branch}}</div>
                    <div class="line flex-center-between">
                        <div>{{bank}}</div>
                        <div class="flex-center">
                            <div class="btn" @click="hide = false">全显</div>
                            <div class="btn" @click="hide = true">隐藏</div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="divide"></div>
            <div class="section-2">
                <div class="form-cell">
                    <input placeholder="请输入提现金额" class="font-14 input color-content" type="digit" v-model.lazy="money" 
                    placeholder-style="color:#454545;font-size:14px;"/>
                </div>
                <div class="font-18 form-desc font-bold color-content">提现金额不能低于100</div>
                <div class="font-12 primary-color font-bold">当前可提现金额¥ {{detail.sumPlus}}</div>
                <button class="submit-btn" @click="submit">提交</button>
            </div>
        </block>
        <div class="modal" :class="setShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container withdraw-modal set-show-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeSetShow"/>
                <div class="header">
                   <div class="font-18">温馨提示</div>
                </div>
                <div class="content">
                    <div>
                        请先设置你的账户
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" :class="successShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container withdraw-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeSuccess"/>
                <div class="header">
                   <img src="/static/images/withdraw-success.png"  class="withdraw-result-icon"/>
                   <div class="font-18 primary-color title">提现成功</div>
                </div>
                <div class="content">
                    <div>
                        提取金额预计将在1-3个工作日转到您的账户
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" :class="errorShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container withdraw-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeError"/>
                <div class="header">
                   <img src="/static/images/withdraw-error.png"  class="withdraw-result-icon"/>
                   <div class="font-18  title" style="color:#fb5178;">提现失败</div>
                </div>
                <div class="content">
                    <div>
                        请核对您的账户信息并填写重新申请提现
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {    
            successShow : false,
            errorShow : false,
            setShow : false,
            detail : {},
            userInfo : {},
            hide : true,
            money : '',
            canShow : false
        }
    },
    computed:{
        bank(){
            var num = this.userInfo.bank_card;
            if(!this.hide){
                return num
            }
            var str = '';
            if(num && num.length > 5){
                str = num.substring(0,3);
                str = str + '** **** **** ';
                str = str + num.substr(num.length-3)
            }
            return str
        }
    },
    components: {
        
    },

    methods: {
        submit(){
            if(this.money < 100){
                this.showToast('提现金额不能低于100')
                return 
            }else if(this.money > this.detail.sumPlus ){
                this.showToast('提现金额不能超过可提现金额')
                return 
            }
            this.showLoading('提交中...')
            this.$http.post('/api/product/apply-money',{openid:this.openid,money:this.money},{hideError:true}).then(
                (res)=>{
                    this.hideLoading();
                    this.successShow = true;
                    this.getData();
                },
                (error)=>{
                    this.errorShow = true;
                }
            )
        },
        closeSetShow(){
            this.setShow = false;
            wx.redirectTo({
                url : '/pages/income/account-settings'
            })
        },
        closeSuccess(){
            this.successShow = false;
        },
        closeError(){
            this.errorShow = false;
        },
        async getData(){
            if(!this.openid){
                await this.getOpenId();
            }
            var userInfo =  await this.$http.post('/api/product/member-info',{openid:this.openid});
            if(userInfo && userInfo.length > 0){
                this.userInfo = userInfo[0];
                this.canShow = true
            }else{
                this.setShow = true;
                return 
            }
            var detail = await this.$http.post('/api/product/sum-money',{openid:this.openid});
            this.detail = detail;
        }
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        this.getData()
    },
}
</script>

<style scoped lang="less">
    @import "~@/assets/styles/withdraw.less";
    .set-show-modal{
        line-height: 2;
        padding-top: 23px;
    }
</style>
