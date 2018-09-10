<template>
    <div class="invite">
        <div class="title">专属招募分销海报</div>
        <img :src="inviteImg"  class="inviteImg" @click="previewImage(inviteImg)">
        <div class="hide-invite">
            <canvas canvas-id="invite" style="width: 315px;height: 460px;"  class="canvas"></canvas>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {    
            url : '/static/images/invite.png',
            erweima : '/static/images/erweima.png',
            inviteImg : ''
        }
    },

    components: {
        
    },

    methods: {
        async getQr(){
            this.showLoading('专属海报制作中。。。')
            var imgUrl = await this.$http.post('/api/product/qrcode',{path:`/pages/index/index?share_openid=${this.openid}`});
            this.$wx.downloadFile({
              url: imgUrl,
            }).then(
                (res)=>{
                    this.erweima = res.tempFilePath;
                    this.drawCanvas()
                },
                ()=>{
                    this.hideLoading()
                    this.showToast('专属海报制作失败')
                }
            )
        },
        drawCanvas(){
            var ctx = wx.createCanvasContext('invite');
            ctx.drawImage(this.url, 0, 0, 315, 460);  
            ctx.drawImage(this.erweima, 232, 320, 71, 71);  
            ctx.draw(false,()=>{
                this.canvasToImg()
            });
        },
        async canvasToImg(){
            var {tempFilePath} = await this.$wx.canvasToTempFilePath({
                canvasId: 'invite'
            });
            this.inviteImg = tempFilePath;
            this.hideLoading()
        },
        
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        if(!this.inviteImg){
            this.getQr()
        }
        
    },
}
</script>

<style scoped lang="less">
    .invite{
        text-align : center;
    }
    .canvas{
        display: block!important;
        margin: 0 auto;
    }
    .inviteImg{
        width:315px;
        height: 460px;
    }
    .title{
        margin:15px 0;
        text-align: center;
        font-size:16px;
        color:#00ceb5;
    }
    .tip{
        font-size:15px;
        color:#ffffff;
        margin:30px 0;
        text-align: center;
    }
</style>
