# wxc-qy-toc

* components 组件
    * bgMaodal 模态窗口

*  html-view  将字符串组件<p> <view> 转换成一个对象，展现到页面
*  plugins   插件 （es6-promise）
*  images 存放项目图片

* pages
    * detail 详情页
    * index  首页
    * logs   日志页面（暂时没有用）
    * ranking 排行榜

 * utils
    * config 配置文件
    * postapi 前期封装的ajax请求 做  callback回调
    * util  工具类
    * wxapi  一些小程序公用的promise请求
    * wxrequest 异步请求

 * 需要改进的地方
    * 代码需要合理注释
    * 代码结构需要重构（命名-BFC 结构）

* 如果是本地运行，需要将app.js globaldata 手动加入
  * enterpriseid:'51037401813520',
  * appid:'wx6d20c8e925cb6a10',
     