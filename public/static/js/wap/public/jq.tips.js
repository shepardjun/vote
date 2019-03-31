/*********文件描述*********
 * @last update 2016/4/14 21:49
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：弹窗插件
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2016/4/14 21:49 1.0.0
 */
//分页样式1
;
(function ($) {
    $.extend ({
        AlertTips : {
            params : {
                tips_id : '#NormalTips',//提示文本框
                close_id : '#CloseBtn', //确认关闭id
                mask : ".mask",         //遮罩选择器
                tpl : null,             //模版
                msg : '',               //提示信息
                type : 2,               //提示信息类型
                img : {                 //提示信息图片
                    1 : GV.DOMAIN + GV.TP_PUB_IMG + '/succ.jpg',
                    2 : GV.DOMAIN + GV.TP_PUB_IMG + '/error.jpg'
                },
                callback : {}           //回调函数
            },
            //初始化配置
            _init_ : function (opts) {
                return $.extend ({}, this.params, opts);
            },
            //普通提示框
            showTips : function (opts) {
                var pts = this._init_ (opts);
                //创造元素
                $.AlertTips._createTips (pts);
                //显隐控制
                var s = setTimeout (function () {
                    $ (pts.tips_id).remove ();
                }, 1500);
                var t = setTimeout (function () {
                    $ (pts.tips_id).fadeOut (1000);
                }, 1000);
                //执行回调函数
                $.AlertTips.callBackDelay (pts);
            },
            //关闭类型提示框
            closeTips : function (opts) {
                var pts = this._init_ (opts);
                //清除元素
                $ (pts.tips_id).remove ();
                //创造元素
                $.AlertTips._createTips (pts);
                //绑定关闭事件
                $.AlertTips._close (pts);
                //执行回调函数
                $.AlertTips.callBackDelay (pts);
            },
            //二维码类型可关闭提示框
            closeQcodeTips : function (opts) {
                var pts = this._init_ (opts);
                //创造元素
                $.AlertTips._createTips (pts);
                //执行回调函数
                $.AlertTips.callBack (pts);
                //绑定关闭事件
                if(typeof opts.closed === 'undefind' || opts.closed == true){
                    $.AlertTips._close (pts);
                }
            },
            //二维码弹窗
            QcodeTips : function (opts) {
                var html =  '<div class="code_dialog" id="code_dialog">' +
                            '   <div class="code_dialog_t">关注后才可参与活动，请先关注吧!!!</div>' +
                            '   <div class="code_dialog_c">' +
                            '       <h4>{{tips}}</h4>' +
                            '       <img src="{{img}}">' +
                            '       <p>长按识别二维码</p>' +
                            '   </div>' +
                            '</div>' +
                            '<div class="mask"></div>';
                $.AlertTips.closeQcodeTips ({
                    tips_id : '#code_dialog',
                    tpl : html,
                    msg : opts.msg || "",
                    type : 1,
                    img : {1 : opts.img || ""},
                    closed : opts.closed || false
                });
            },
            //创造弹层
            _createTips : function (pts) {
                var tpl = pts.msg ? $.tplOp.tplReplace ({
                    tpl : pts.tpl,
                    params : {0 : {tips : pts.msg}}
                }) : pts.tpl;
                $ ("body").append (tpl);
                //禁止滚动
                $('html').css('overflow', 'hidden');
                $ (pts.mask).css('height', document.body.scrollHeight);
                $ (pts.tips_id).find ('img').attr ('src', pts.img[pts.type]);
                $ (pts.tips_id).css ("margin-left", -$ (pts.tips_id).outerWidth () / 2);
                $ (pts.tips_id).css ("margin-top", -$ (pts.tips_id).outerHeight () / 2);
            },
            //关闭事件
            _close : function (pts) {
                $ (pts.close_id+','+pts.mask).click (function () {
                    $ (pts.tips_id).remove ();
                    $ (pts.mask).remove();
                    //增加滚动
                    $('html').css('overflow', '');
                });
            },
            //执行回调函数,延迟执行
            callBackDelay : function (pts) {
                if ($.isFunction (pts.callback.func))
                    var s = setTimeout (function () {
                        pts.callback.func (pts.callback.params);
                    }, 1500);
            },
            //执行回调函数,立即执行
            callBack : function (pts) {
                if ($.isFunction (pts.callback.func))
                    pts.callback.func (pts.callback.params);
            }
        }
    });
}) (jQuery);