/**
 * 申明一个PostAPI 接口
 */
export default class PostAPI {
  getTempleData(url, data, callback){
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: data,
      header: { 'content-type': 'application/json' },
      success: res => callback && callback(res.data)
    })
  }
}
