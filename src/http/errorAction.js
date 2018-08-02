export const errorAction = function(msg="服务器异常"){
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
    })
    return Promise.reject(msg)
}
export const hideErrorAction = function(){
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    return Promise.reject()
}