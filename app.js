App({

  globalData: {
    usercode: null,
    userInfo: null,
    enterpriseid: '',
    appid: '',
    headImg: '',
    templateid: 56
  },

  onLaunch: function () {
    const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

    if (extConfig && Object.keys(extConfig).length > 0){
      this.globalData.enterpriseid = extConfig.userid;
      this.globalData.appid = extConfig.appid;
      this.globalData.templateid = extConfig.teamplateid;
      this.globalData.headImg = extConfig.headImg;
      if (this.extConfigCallback){
        this.extConfigCallback(extConfig)
      }
    }

    // 本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})

/*
  enterpriseid:'51037401813520',
  appid:'wx6d20c8e925cb6a10',
  enterpriseid: '33259802462218',
  appid: 'wx6d20c8e925cb6a10',
  headImg:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJfiaSKdm9kGlR4UYY2266pUVqS5eeziaOZsO9GwmU5efSwNg8GLIJCywXrmzurMbxpiacZCic2HuuF8g/0',
*/