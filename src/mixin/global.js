import {formatCurrency} from '@/utils/index'

// 全局混入
const mixin = {
    data(){
        return {
            // 全局混入初始化字段
            loaded : false,
        }
    },
    methods:{
        // 交互封装
        showToast(title=''){
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 2000
            })
        },
        setWxTitle(title=''){
            wx.setNavigationBarTitle({
                title
            });
        },
        showLoading(title=''){
            wx.showLoading({
                title,
                mask : true
            })
        },
        hideLoading(){
            wx.hideLoading()
        },
        formatMoney : formatCurrency,
        // 拨打手机号
        callPhone(phone){
            wx.makePhoneCall({
                phoneNumber: phone
            })
        },
        previewImage(img,urls){
            wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: urls?urls:[img] // 需要预览的图片http链接列表
            })
        },
        
        /**
         *  路由跳转再封装
         *  -----------------start
         */

        // 跳转页面
        toLink(url){
            wx.navigateTo({
                url
            })
        },
        //重定向
        replaceLink(url){
            wx.redirectTo({
                url
            })
        },
        // 切换tab页
        toTab(url){
            wx.switchTab({
                url
            })
        },
        // 回退
        back(delta){
            wx.navigateBack({
                delta
            })
        },
        //重启
        relauch(url){
            wx.reLaunch({
                url
            })
        },
        /**
         *  路由跳转再封装
         *  ------------------end
         */
        pay(order_id){
            this.$http.post('/api/weixin-pay/wx-create',{order_id}).then(
                (sign)=>{
                    console.log(sign)
                    sign.timeStamp = sign.timestamp;
                    sign.success = function(res){
                        console.log('成功')
                        var url = `/pages/pay-success/pay-success?order_id=${order_id}`
                        wx.navigateTo({url})
                    }
                    sign.fail = function(res){
                        console.log('失败')
                        if(res.errMsg == 'requestPayment:fail cancel'){
                            console.log('取消支付')
                        }else{
                            var url = `/pages/pay-error/pay-error?order_id=${order_id}`
                            wx.navigateTo({url})
                        }
                        
                    }

                    sign.complete = function(res){
                        console.log('完成')
                        console.log(res)
                    }
                    wx.requestPayment(sign)
                }
            )
        },
        async getOpenId(){
            //微信登录拿到code
            var {code} = await this.$wx.login();
            var openid = await this.$http.post('/api/new-ticket/openid',{code:code});
            this.$store.commit('saveOpenid',openid);  
        },
        getuserinfo(e){
            this.userInfo = e.mp.detail.userInfo;
            this.register()
        },
        async register(){
            if(!this.userInfo.avatarUrl){
                return 
            }
            if(this.isRegister){
                return
            }
            var postData = {
                openid:this.openid,
                nickname : this.userInfo.nickName,
                headimgurl : this.userInfo.avatarUrl,
                introducer : this.share && this.share.share_openid ? this.share.share_openid:''
            }
            var result = await this.$http.post('/api/new-ticket/register',postData);
            this.$store.commit('hasRegister');  
        },
        async drawShare(canvas_id,logo,title,price,qrimg,callback){
            var ctx = wx.createCanvasContext(canvas_id);

            ctx.setFillStyle('#fff')
            ctx.fillRect(0, 0, 295, 390)

            // logo
            var {path:tempFilePath,width,height} = await this.$wx.getImageInfo({
              src: logo
            });
            var drawWidth = 295;
            if(width/height > drawWidth/240){
                drawWidth = drawWidth*width/height
            }
            ctx.drawImage(tempFilePath, 0, 0, drawWidth, 240); 
            // 标题
            ctx.setFontSize(14)
            ctx.setFillStyle('#2e2e2e')
            if(title.length<=18){
                ctx.fillText(title, 20, 270) 
            }else{
                var line_1 = title.substring(0, 18);
                ctx.fillText(line_1, 20, 270);
                var line_2 = ''
                if(title.length<=36){
                    line_2 = title.substring(18);
                }else{
                    line_2 = title.substring(18,35)+'...';
                }
                ctx.fillText(line_2, 20, 290);
            }
           
            // 折扣价
            var minPrice = `￥${price}`;
            ctx.setFontSize(17)
            ctx.setFillStyle('#00ceb5')
            ctx.fillText(minPrice, 20, 320); 

            ctx.setFontSize(13)
            ctx.setFillStyle('#00ceb5')
            if(minPrice.indexOf(',') > -1){
                ctx.fillText('起', 20+(minPrice.length-1)*13, 320); 
            }else{
                ctx.fillText('起', 20+minPrice.length*13, 320); 
            }
            
            // 分享文字
            ctx.setFontSize(13)
            ctx.setFillStyle('#4a4a4a')
            ctx.fillText('长按海报保存到手机或者', 20, 353);
            ctx.fillText('发送给好友下单，即返利', 20, 371);
            // 二维码
            var {tempFilePath} = await this.$wx.downloadFile({
              url: qrimg
            });
            ctx.drawImage(tempFilePath, 210, 300, 68, 78); 
            ctx.draw(false,()=>{
                wx.canvasToTempFilePath({
                    canvasId: canvas_id,
                    success : function({tempFilePath}){
                        callback && callback(tempFilePath)
                    }
                });
                
            });
        },
        async drawShare2(canvas_id,logo,title,price,qrimg,callback){
            var ctx = wx.createCanvasContext(canvas_id);

            ctx.setFillStyle('#fff')
            ctx.fillRect(0, 0, 295, 390)
            // logo
            var {path:tempFilePath,width,height} = await this.$wx.getImageInfo({
              src: logo
            });
            var drawWidth = 295;
            if(width/height > drawWidth/240){
                drawWidth = drawWidth*width/height
            }
            ctx.drawImage(tempFilePath, 0, 0, drawWidth, 240);  
            // 标题
            ctx.setFontSize(14)
            ctx.setFillStyle('#2e2e2e')
            if(title.length<=18){
                ctx.fillText(title, 20, 270) 
            }else{
                var line_1 = title.substring(0, 18);
                var line_2 = title.substring(18);
                ctx.fillText(line_1, 20, 270);
                ctx.fillText(line_2, 20, 290);
            }

            // 折扣价
            var minPrice = `￥${price}`;
            ctx.setFontSize(17)
            ctx.setFillStyle('#4a4a4a')
            ctx.fillText(minPrice, 20, 320); 

            ctx.setFontSize(13)
            if(minPrice.indexOf(',') > -1){
                ctx.fillText('起', 20+(minPrice.length-1)*13, 320); 
                ctx.setFillStyle('#00ceb5')
                ctx.fillText('(已支付)', 40+(minPrice.length-1)*13, 320); 
            }else{
                ctx.fillText('起', 20+minPrice.length*13, 320); 
                ctx.setFillStyle('#00ceb5');
                ctx.fillText('(已支付)', 40+minPrice.length*13, 320); 
            }

            // 分享文字
            ctx.setFontSize(13)
            ctx.setFillStyle('#4a4a4a')
            ctx.fillText('长按海报保存到手机或发', 20, 353);
            ctx.fillText('送海报将此活动赠送好友', 20, 371);
            // 二维码
            var {tempFilePath} = await this.$wx.downloadFile({
              url: qrimg
            });
            ctx.drawImage(tempFilePath, 210, 300, 68, 78); 
            ctx.draw(false,()=>{
                wx.canvasToTempFilePath({
                    canvasId: canvas_id,
                    success : function({tempFilePath}){
                        callback && callback(tempFilePath)
                    }
                });
                
            });
        },
    },
    computed:{
        openid(){
            return this.$store.state.openid
        },
        share(){
            return this.$store.state.share
        },
        isRegister(){
            return this.$store.state.isRegister
        },
        isIphoneX(){
            return this.$store.getters.isIphoneX
        }
    },
    watch:{
        
    }

}
export default mixin