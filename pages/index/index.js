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
   let phoneNum=event.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phoneNum,
      success: function () {
        console.log("拨打电话")
      }
    })
  }
})
