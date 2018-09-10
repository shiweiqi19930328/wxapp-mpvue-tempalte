<template>
    <div class="settings">
        <div class="section-2">
            <div class="font-13 title font-bold">开户人信息</div>
            <div class="form-cell flex-center">
                <div class="label">姓名：</div>
                <input  class="font-12 input" v-model.lazy="form.real_name"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">身份证号：</div>
                <input  class="font-12 input"  type="idcard" v-model.lazy="form.card"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">工作单位：</div>
                <input  class="font-12 input" v-model.lazy="form.address"/>
            </div>
        </div>
        <div class="section-2 section-2-3">
            <div class="font-bold font-13 title">银行信息</div>
            <div class="form-desc">温馨提示：请使用四大行：中国工商银行、中国农业银行、中国银行、中国建设银行，若支行信息不存在，请更换银行卡绑定</div>
            <div class="form-cell flex-center">
                <div class="label">银行卡号：</div>
                <input  class="font-12 input" type="number" v-model.lazy="form.bank_card"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">银行名称：</div>
                <input class="font-12 input"   v-model.lazy="form.bank_name"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">开户支行：</div>
                <input  class="font-12 input" v-model.lazy="form.bank_branch"/>
            </div>
            <div class="notice">注意事项：银行信息出错将无法提现，请仔细核对确保准确无误：开户支行信息不清楚请拨打官方电话报“卡号”获取，如建设银行电话：95533</div>
            <button class="submit-btn" @click="submit">保存</button>
        </div>
        <div class="modal" :class="successShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container withdraw-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeSuccess"/>
                <div class="header">
                   <img src="/static/images/account-setting-success.png"  class="withdraw-result-icon"/>
                </div>
                <div class="content">
                    <div>
                        账户设置成功
                    </div>
                    <div>
                        开启提现功能
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" :class="errorShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container withdraw-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeError"/>
                <div class="header">
                   <img src="/static/images/account-setting-error.png"  class="withdraw-result-icon"/>
                </div>
                <div class="content">
                    <div>
                        账户设置失败
                    </div>
                    <div>
                        检查填写信息
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
            form : {
                openid : '',
                real_name : '',
                card : '',
                address : '',
                bank_card : '',
                bank_name : '',
                bank_branch : '',
            },
            rules : {
                real_name : [
                    { required: true, message: '请输入真实姓名'}
                ],
                card : [
                    { required: true, message: '请输入身份证号'},
                    { type: 'identity',message: '您输入身份证号有误'},
                ],
                address : [
                    { required: true, message: '请输入工作单位'}
                ],
                bank_card : [
                    { required: true, message: '请输入银行卡号'},
                    { type: 'bankCard', message: '您输入的银行卡号有误'}
                ],
                bank_name : [
                    { required: true, message: '请选择银行名称'},
                ],
                bank_branch : [
                    { required: true, message: '请输入开户支行'},
                ],
            }

        }
    },

    components: {
        
    },

    methods: {
        async submit(){
            // 表单校验
            await this.$validate(this.form,this.rules);
            this.showLoading('提交中...')
            this.$http.post('/api/product/bank',this.form,{hideError:true}).then(
                (res)=>{
                    this.hideLoading();
                    this.successShow = true;
                },
                (error)=>{
                    this.errorShow = true;
                }
            )
        },
        closeSuccess(){
            wx.redirectTo({
                url : '/pages/income/withdraw'
            })
        },
        closeError(){
            this.errorShow = false;
        }
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        this.form.openid = this.openid
    },
    onUnload(){
        this.successShow = false;
        this.errorShow = false;
        this.form = {
            openid : '',
            real_name : '',
            card : '',
            address : '',
            bank_card : '',
            bank_name : '',
            bank_branch : '',
        }
    }
}
</script>

<style scoped lang="less">
    @import "~@/assets/styles/account-settings.less";
</style>
