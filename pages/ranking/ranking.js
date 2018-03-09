import PostAPIClass from '../../utils/PostAPI.js';
import componentsClass from '../../components/bgModal/bgModal.js';
const PostAPI = new PostAPIClass();
const app = getApp();

Page({
  components: ["bgModal"],
  data: {
    // 排行榜请求路径
    rankPath: "",
    // 排行榜列表
    ranklist: {},
    // 排行榜列表
    count: "",
    // 排行榜列表
    rank: ""
  },

  onLoad: function(options) {
    let { count, rank, path } = options;
    this.setData({
      rankPath: path,
      count: count,
      rank:rank
    });
  },

  onReady: function() {
    wx.showToast({ title: '加载中', icon: 'loading' });
    PostAPI.getTempleData(this.data.rankPath, {},  this.ranklistcallback);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onReady();
    wx.stopPullDownRefresh();
  },

  ranklistcallback: function(res) {
    res.state === 1
      ? this.setData({ ranklist: res.data })
      : wx.showModal({title: '提示', content: res.message })
    wx.hideToast();
  },

  redirectToIndex: function() {
    wx.navigateTo({ url: '../../pages/index/index' })
  },
  
  onShareAppMessage: function(res) {}
});
