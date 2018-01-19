//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  callPhone: function () {
    console.log("你是谁？");
    wx.makePhoneCall({
      phoneNumber: '13886161184',
      success: function () {
        console.log("拨打电话")
      }
    })
  }
})
