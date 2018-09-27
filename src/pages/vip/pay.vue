<template>
    <div class="withdraw">
        <block>
            <div class="section-2">
                <div class="form-cell">
                    <input placeholder="请输入充值金额" class="font-14 input color-content" type="number" v-model.lazy="money" 
                    placeholder-style="color:#454545;font-size:14px;"/>
                </div>
                <div class="font-18 form-desc font-bold color-content">充值¥ {{amount}}即可自动成为高级会员</div>
                <div class="font-12 primary-color font-bold">当前已充值金额¥ {{sum}}</div>
                <button class="submit-btn" @click="submit">确认充值</button>
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
            canShow : false,
            amount : 0,
            sum : 0,
            isVip : false,
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
        submit(){
            if(!this.money){
                this.showToast('请输入充值金额')
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
            var {amount=0,sum=0} = await this.$http.post('/api/product/amount',{openid:this.openid});
            this.amount = amount;
            this.sum = sum;
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
