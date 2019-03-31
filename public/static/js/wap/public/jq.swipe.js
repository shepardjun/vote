/*********文件描述*********
 * @last update 2016/6/8 19:00
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：信息收发触摸事件
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2016/6/8 19:00 1.0.0
 */
(function ($) {
    $.extend ({
        swipe : {
            //版本信息
            version : '1.0.0',
            use_params : {},
            params : {
                status : 1,
                x : 0,
                y : 0,
                disX : 0,
                disY : 0,
                id : 0,
                obj : {},
                list_class : '#PageListCont',            //绑定容器对象
                call_back : {}
            },
            //初始化配置
            _init_ : function (pts) {
                var param = $swipe.use_params;
                $.extend (true, param, $swipe.params, pts || {});
                param.obj = document.querySelector (param.list_class);
            },
            start : function (pts) {
                //初始化数据
                $swipe._init_ (pts);
                $swipe.touch ();
            },
            //触摸事件
            touch : function () {
                //当前使用的配置参数
                var param = $swipe.use_params;
                param.obj.addEventListener ('touchstart', function (ev) {
                    param.event_obj = ev;
                    var targetT = param.event_obj.targetTouches[0];
                    param.disX = targetT.pageX - param.x;
                    param.disY = targetT.pageY - param.y;
                    param.id = targetT.identifier;
                }, false);
                param.obj.addEventListener ('touchmove', $swipe.swipeDown, false);
                param.obj.addEventListener ('touchend', $swipe.swipeDownEnd, false);
            },
            //向下滑动
            swipeDown : function (ev) {
                var param = $swipe.use_params;
                param.y = ev.targetTouches[0].pageY - param.disY;
                if ($ (window).scrollTop () <= 0) {
                    $ (window).scrollTop (0)
                    ev.stopPropagation ();
                }
            },
            //向下滑动结束
            swipeDownEnd : function (ev) {
                var param = $swipe.use_params;
                if (ev.changedTouches[0].identifier == param.id && (1 == param.status)) {
                    if (param.y > 0) {
                        if ($ (window).scrollTop () <= 0) {
                            //解绑事件
                            $swipe.unBindSwipe ();
                            //读取数据
                            param.call_back.get_history ({
                                call_back : {
                                    0 : $.swipe.reBindSwipe,
                                    1 : $.swipe.__distory
                                }
                            });
                        }
                    }
                }
            },
            //滚动到末尾
            scrollBottom : function () {
                setTimeout(function(){
                    $ ('html, body').animate ({scrollTop : $ (document).height ()}, 20);
                },100);
            },
            //重新绑定事件
            reBindSwipe : function () {
                $swipe.use_params.status = 1;
                $.fn.swipe ($swipe.use_params);
            },
            //解除绑定
            unBindSwipe : function () {
                var param = $swipe.use_params;
                param.status = 0;
                //解绑加载事件
                param.obj.removeEventListener ('touchstart', false, false);
                param.obj.removeEventListener ('touchmove', $swipe.swipeDown, false);
                param.obj.removeEventListener ('touchend', $swipe.swipeDownEnd, false);
            },
            //销毁使用的数据
            __distory : function () {
                var param = $swipe.use_params;
                param.x = 0;
                param.y = 0;
                param.disX = 0;
                param.disY = 0;
                param.id = 0;
            }
        }
    });
    //添加提示信息
    $.fn.swipe = function (pts) {
        $swipe.start (pts);
    };
}) (jQuery);
//定义别名
var $swipe = $.swipe;