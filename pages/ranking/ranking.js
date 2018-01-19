//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
  },
  callPhone: function (event) {
    let phoneNum = event.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phoneNum,
      success: function () {
        console.log("拨打电话")
      }
    })
  },
  showModal:function(){
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
