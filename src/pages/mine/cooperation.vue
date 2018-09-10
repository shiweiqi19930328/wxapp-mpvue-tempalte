<template>
    <div class="cooperation">
        <div class="desc-content">
            <div class="flex-center-center">
                <img src="/static/images/color-logo.png"  class="logo-img">
            </div>
            <div class="desc font-12">
               麦兜兜是中国领先的亲子教育与活动平台。官方公众号粉丝45万+。欢迎你同我们一起助力亲子产业模式升级，请提交您的联系方式合作意向，我们会在1-2天内联系您。
            </div>
        </div>
        <div class="divide"></div>
        <div class="form">
            <div class="form-cell flex-center">
                <div class="label">姓名</div>
                <input placeholder="我们如何称呼您" class="font-12 input color-content" v-model.lazy="form.name" 
                placeholder-style="color:#454545;font-size:12px;"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">手机号</div>
                <input placeholder="方便我们联系您" class="font-12 input color-content"  type="number" v-model.lazy="form.phone"
                placeholder-style="color:#454545;font-size:12px;"/>
            </div>
            <div class="form-cell flex-center">
                <div class="label">所在城市</div>
                <input placeholder="您的业务所在城市" class="font-12 input color-content" v-model.lazy="form.city"
                placeholder-style="color:#454545;font-size:12px;"/>
            </div>
            <div class="form-cell flex-center no-border">
                <div class="label">合作意向</div>
                <div class="font-12 input color-content">介绍您的产品及希望合作的内容</div>
            </div>
            <div class="textarea">
                <textarea  auto-height class="font-12 input" v-model.lazy="form.remark"></textarea>
            </div>
            <button class="submit-btn" @click="submit">提交</button>
        </div>
        <div class="modal" :class="successShow ? 'show' : ''">
            <div class="mask" @touchmove.stop></div>
            <div class="modal-container cooperation-modal">
                <img src="/static/images/modal-close.png"  class="close-icon" @click="closeSuccess"/>
                <div class="header">
                   <img src="/static/images/withdraw-success.png"  class="withdraw-result-icon"/>
                   <div class="primary-color title">提交成功</div>
                </div>
                <div class="content">
                    <div>
                        我们会尽快联系您
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
            form : {
                openid : '',
                name : '',
                phone : '',
                city : '',
                remark : '',
            },
            rules : {
                name : [
                    { required: true, message: '请输入真实姓名'}
                ],
                phone : [
                    { required: true, message: '请输入手机号'},
                    { type: 'telphone',message: '您输入手机号有误'},
                ],
                city : [
                    { required: true, message: '请输入您所在城市'}
                ],
                remark : [
                    { required: true, message: '请输入合作意向'},
                ],
            },
            successShow : false
        }
    },

    components: {
        
    },

    methods: {
        async submit(){
             // 表单校验
            await  this.$validate(this.form,this.rules);
            this.$http.post('/api/product/apply-partner',this.form).then(
                (res)=>{
                    this.successShow = true;
                },
                (error)=>{
                    this.showToast('提交失败')
                }
            )
        },
        closeSuccess(){
            wx.navigateBack({
                delta: 1
            })
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
        this.form = {
            openid : '',
            name : '',
            phone : '',
            city : '',
            remark : '',
        }
    }
}
</script>

<style scoped lang="less">
    @import "~@/assets/styles/cooperation.less";
</style>
