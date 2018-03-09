import config from '../../utils/config';
import HtmlParser from '../../html-view/index';
import PostAPIClass from '../../utils/PostAPI.js';

const PostAPI = new PostAPIClass();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 情页的请求IP
    detailPath:"",
    // 详情页的data
    detailData:{},
    // 是否是苹果X
    isiPhoneX:false,
    // 是否加载完毕
    isloading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      detailPath: `${options.path}?localname=${options.localname}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //wx.showToast({ title: '加载中', icon: 'loading' });
    wx.getSystemInfo({
      success: (res) => {
        const systemModel = res.model.replace(/\s/g, '');
        const isiPhoneX = systemModel.indexOf("iPhoneX") !== -1;
        this.setData({ isiPhoneX });
      }
    });
    PostAPI.getTempleData(this.data.detailPath, {}, this.getDetailItems);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // this.onReady(); 先去除下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {},

  onshareapp:function(){
    this.onShareAppMessage();
    wx.showShareMenu({ withShareTicket: false })
  },

  /**
   * 获取得到详情页参数
   */
  getDetailItems: function(res){
    if (res.state === 1){
      res.data.infoModel.content = new HtmlParser(res.data.infoModel.content).nodes;
      const detailData = Object.assign({}, res.data.infoModel, {
        "isiPhoneX": this.data.isiPhoneX
      });
      this.setData({ detailData, isloading: true });
      wx.hideToast();
      return; 
    }
    wx.showModal({ title: '提示', content: res.message, })
    wx.hideToast();
  },

  getPhoneNum: function(event) {
    const { telid } = event.target.dataset;
    const getNumUrl = config.getPhoneNum + telid;
    PostAPI.getTempleData(getNumUrl, {},  res => {
      if(res.state === 1){
        wx.makePhoneCall({ phoneNumber: res.data });
        return;
      }
      wx.showModal({ title: '提示', content: res.message });
    });
  },

  goBackToIndex: function () {
    wx.navigateTo({ url: '../../pages/index/index' })
  }

})