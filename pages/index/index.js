import config from '../../utils/config';
import HtmlParser from '../../html-view/index';
import util from '../../utils/util.js';
import wxApi from '../../utils/wxApi';
import wxRequest from '../../utils/wxRequest';
import PostAPIClass from '../../utils/PostAPI.js';

const PostAPI = new PostAPIClass();
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    isScroll: true,
    clientHeight: "auto",
    overflow: "auto",
    qyhotdata: {
      showmodal: false,
      headImg: ''
    },
    joblistdata: {
      jobInfoList: true,/**首次加载 */
      lastpage: false
    },
    lastpage: false,
    enterprisedata: {
      enterprise: "14259052696071",　　/**企业ID号 */
      cateid: 574,
      page: 1
    },
    currentrankdata: {
      count: 0,
      rank: 0,
      likedState: 0,
    },
    qyphotosinfo: {},
    title: "58招聘企业",
    openid: '',
    session: '',
    isloading: false,
  },

  /**
   * 重置页面
   */
  pageReload: function(){
    /**重置page */
    const enterprisedata = Object.assign({}, this.data.enterprisedata, { page: 1 }); 
    this.setData({
      enterprisedata,
      joblistdata: { jobInfoList: true, lastpage: false }
    });
    this.onReadyloadPage();
  },

  onShareAppMessage: function(res) {},
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.pageReload();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数 --触底
   */
  onReachBottom: function() {
    // Do something when page reach bottom.
    this.getjoblist();
  },

  gotoDetail: function(event) {
    const { localname, listname, infoid, url } = event.currentTarget.dataset;
    const detailUrl = `${url}/${listname}/${infoid}&localname=${localname}`;
    wx.navigateTo({ url: `../../pages/detail/detail?path=${detailUrl}` });
  },

  getRankList: function(event) {
    const { count, rank, likedState } = this.data.currentrankdata;
    const ranklist = config.hotListUrl
      + this.data.enterprisedata.enterprise
      + "&count=" + count
      + "&rank=" + rank
      + "&likedState=" + likedState;

    wx.navigateTo({ url: `../../pages/ranking/ranking?path=${ranklist}` });
  },

  onLoad: function() {
    //wx.showLoading({ title: '加载中', icon: 'loading' });
    const wxLogin = wxApi.wxLogin();
    wxLogin().then(res => {
      app.globalData.usercode = res.code;
      //获取企业用户ID
      if (app.globalData.appid && app.globalData.appid !== '') {
        this.getNaviBarTitle({});
      } else {
        app.extConfigCallback = extConfig => {
          if (extConfig !== '') {
            this.getNaviBarTitle(extConfig);
          }
        }
      }

      this.getOpenSessionID(app.globalData.usercode);
    });
  },
  
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() { this.checkSettingStatus(); },

  checkSettingStatus: function(cb) {
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function(res) {
        const authSetting = res.authSetting;
        if (!util.isEmptyObject(authSetting)) {
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              showCancel: false,
              title: '用户未授权',
              content: '如需正常使用查看功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              success: res => res.confirm && wx.openSetting()
            })
          }
          return;
        }
        // 首次授权的提醒
        //console.log('首次授权');
      }
    });
  },

  getNaviBarTitle: function(extConfig){
    if (Object.keys(extConfig).length > 0){
      app.globalData = { ...app.globalData, ...extConfig };
      // app.globalData = Object.assign({}, app.globalData, extConfig);
    }

    this.setData({
      enterprisedata: {
        enterprise: app.globalData.enterpriseid,　　/**企业ID号 */
        cateid: 574,
        page: 1
      },
      qyhotdata: {
        showmodal: false,
        headImg: app.globalData.headImg
      }
    });

    PostAPI.getTempleData( config.getTitleUrl, {
      appid: app.globalData.appid
    },
    res => res.state === 100 && wx.setNavigationBarTitle({
      title: res.data
    }))
  },

  getOpenSessionID: function(codeParam) {
    wxRequest.getRequest(config.getSessionUrl, {
      code: codeParam,
      appid: app.globalData.appid
    })
    .then(res => this.setData({
      openid: res.data.openid,
      seeion: res.data.session
    }))
    .then(res => this.onReadyloadPage());
  },

  qyhotCallback: function(res){
    if (res.state === 1){
      res.data.content = new HtmlParser(res.data.content).nodes;
      const qyhotdata = Object.assign({}, this.data.qyhotdata, res.data);
      this.setData({ qyhotdata });
    }
  },

  getjoblist: function() {
    const listurl = config.getJobListUrl
      + this.data.enterprisedata.enterprise
      + "/"
      + this.data.enterprisedata.cateid;

    PostAPI.getTempleData(
      listurl,
      { page: this.data.enterprisedata.page },
      this.joblistCallback
    );
  },

  joblistCallback: function(res){
    if (res.state !== 1) {
      // 报错处理
      return;
    }
    if (res.data && res.data.lastPage) {
      if (res.data.jobInfoList.length > 0) {
        res.data.jobInfoList = this.data.joblistdata.jobInfoList.length > 0
          ? this.data.joblistdata.jobInfoList.concat(res.data.jobInfoList)
          : res.data.jobInfoList;

        const enterprisedata = Object.assign({}, this.data.enterprisedata, { "page": ++this.data.enterprisedata.page });
        this.setData({
          joblistdata: res.data,
          lastpage: res.data.lastPage,
          enterprisedata,
          isloading: true
        });
      } else {
        res.data.jobInfoList = this.data.joblistdata.jobInfoList;
        this.setData({
          joblistdata: res.data,
          lastpage: res.data.lastPage,
          isloading: true
        });
      }
    } else {
      res.data.jobInfoList = this.data.joblistdata.jobInfoList.length > 0
        ? this.data.joblistdata.jobInfoList.concat(res.data.jobInfoList)
        : res.data.jobInfoList;

      const enterprisedata = Object.assign({}, this.data.enterprisedata, { "page": ++this.data.enterprisedata.page });
      this.setData({
        joblistdata: res.data,
        lastpage: res.data.lastPage,
        enterprisedata,
        isloading: true
      });
    }
    wx.hideLoading();
  },

  addnumtips: function(res) {
    /**
     * 是否可以点赞
     */
    if (this.data.currentrankdata.likedState !== 0) {
      return;
    }

    const { count, rank, likedState } = this.data.currentrankdata;
    const qyphotosinfo = Object.assign({}, this.data.qyphotosinfo, { count: count + 1, likedState: 1});
    const qyhotdata = Object.assign({}, this.data.qyhotdata, { count: count + 1, likedState: 1 });
    
    // 前端开始设置值
    this.setData({ qyphotosinfo, qyhotdata, currentrankdata:{
        count: count + 1,
        rank: rank,
        likedState: 1
      }
    });

    // 点赞
    const openid = this.data.openid;
    const addnumurl = config. addLikeUrl + this.data.enterprisedata.enterprise
    PostAPI.getTempleData( addnumurl, { openId: openid }, null);
  },

  ranklistCallback: function(res) {
    if (res.state !==1) {
      return;
    }

    const qyhotdata = Object.assign({}, this.data.qyhotdata, res.data);
    const qyphotosinfo = Object.assign({}, this.data.qyphotosinfo, res.data);
    this.setData({
      qyhotdata,
      qyphotosinfo,
      currentrankdata: res.data
    });
  },

  qyphotoCallback: function(res) {
    if (res.state !==1) {
      return;
    }
    const qyphotosinfo = Object.assign({}, this.data.currentrankdata, res.data);
    this.setData({ qyphotosinfo });
  },

  onReadyloadPage: function(){
    // 获取用户头像
    const openid = this.data.openid;
    const url = config.getUserImagsUrl + this.data.enterprisedata.enterprise;
    wxRequest.getRequest(url, {})
      .then(res => {this.qyhotCallback(res)})
      .then(() => {
        /*获取当前排行榜和点赞数*/
        const rankurl = config.getRankListUrl + this.data.enterprisedata.enterprise;
        return  wxRequest.getRequest(rankurl,  { openId: openid })
      })
      .then((res)=>{ this.ranklistCallback(res)})
      .then(() => { this.getjoblist()})
      .then(res => {
        const wxGetUserInfo = wxApi.wxGetUserInfo();
        return wxGetUserInfo();
      }).then(data => {
        const qylisturl = config.getBrowUrl + this.data.enterprisedata.enterprise;
        PostAPI.getTempleData(qylisturl, { photo: data.userInfo.avatarUrl }, this.qyphotoCallback);
      });
  },

  showqymodal: function(){
    wx.getSystemInfo({
      success: res => {
        const qyhotdata = Object.assign({}, this.data.qyhotdata, { "showmodal": true })
        this.setData({
          qyhotdata,
          isScroll: false,
          clientHeight: res.windowHeight + "px",
          overflow: "hidden"
        });
      }
    })
  },

  hideqymodal: function() {
    const qyhotdata = Object.assign({}, this.data.qyhotdata, { "showmodal": false })
    this.setData({
      qyhotdata,
      isScroll: true,
      clientHeight: "auto",
      overflow: "auto",
    });
  }
})
