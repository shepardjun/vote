/*********文件描述*********
 * @last update 2016/8/8 16:45
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：微信分享配置
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2016/8/8 16:45 1.0.0
 */

var $wx_account = GV.share_conf['account'],
    $wx_share = GV.share_conf['share'];

//配置微信信息
wx.config ({
    debug : false,
    appId : $wx_account['appId'],
    timestamp : $wx_account['timestamp'],
    nonceStr : $wx_account['nonceStr'],
    signature : $wx_account['signature'],
    jsApiList : [
        // 所有要调用的 API 都要加到这个列表中
        'updateAppMessageShareData',
        'updateTimelineShareData'
    ]
});
wx.ready (function () {
    // 微信分享的数据
    var shareData = {
        "imgUrl" : $wx_share['share_img'],
        "link" : $wx_share['share_link'],
        "desc" : $wx_share['share_desc'],
        "title" : $wx_share['share_title'],
        success : function () {

        }
    };
    wx.updateAppMessageShareData(shareData);
    wx.updateTimelineShareData(shareData);
});


