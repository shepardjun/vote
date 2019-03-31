/*********文件描述*********
 * @last update 2019/3/18 19:36
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：投票手机端js
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/18 19:36
 */
;
(function ($) {
    $.extend ({
        WapVotes : {
            //版本信息
            version : '1.0.0',
            use_params : {},                            //每次用的时候把数据往此对象中放
            //默认参数
            params : {
                check_page : 3,                         //选中页面
                check_content : 1,                      //选中内容
                loading_page : true,                    //页面是否可加载
                page_btn_class : '.PageBtn',            //页面内容切换按钮样式
                page_btn_obj : {},                      //页面内容切换按钮对象
                page_on_class : 'active',               //选中样式
                content_btn_class : '.ContentBtn',      //明星风采页面内容切换按钮样式
                content_btn_obj : {},                   //明星风采页面内容切换按钮对象
                content_on_class : 'active',            //选中样式
                nav_status_class : '.NavShowStatus',    //用于隐藏不需要的导航样式
                page_arr : {                            //页面内容切换样式数组
                    1 : '#StarSection',
                    2 : '#PrizeSection',
                    3 : '#AttendListSection'
                },
                content_arr : {                         //明星风采页面内容切换样式数组
                    1 : '#AttendListSection',
                    2 : '#AttendOrderSection',
                    3 : '#AttendRuleSection'
                },
                time_out : '2019-3-30 23:59:59',
                time_span : '.TimeSpan',
                wait_pay : false,                                       //等待支付
                attend_now_page : 1,
                order_now_page : 1,
                gift_send_id : 0,                                       //赠送礼物对象id
                gift_hot : 0,                                           //礼物热度，用于前端展示
                search_key : '',                                        //搜索关键字
                public_head_class : '#PublicSection',                   //选手热度选择器
                attend_hot_num_class : '.AttendHot',                    //选手热度选择器
                attend_list_loading_class : '#AttendListLoading',       //参赛选手加载样式
                attend_list_none_class : '#AttendListNone',             //参赛选手无数据样式
                attend_list_tpl_class : '#AttendListTpl',               //参赛选手模板样式
                attend_list_container_class : '#AttendListContainer',   //参赛选手模板容器样式
                show_attend_info_class : '.ShowAttendInfo',             //显示选手详情样式
                attend_info_class : '#AttendInfoSection',               //选手详情内容样式
                attend_info_container_class : '#AttendInfoContainer',   //选手详情内容样式
                attend_info_tpl_class : '#AttendInfoTpl',               //选手详情内容样式
                vote_btn_class : '.VoteAttendBtn',                      //打开赠送礼物按钮样式
                order_list_loading_class : '#OrderListLoading',         //排行加载样式
                order_list_none_class : '#OrderListNone',               //排行无数据样式
                order_first_tpl_class : '#AttendOrderFirstTpl',         //排行模板样式
                order_other_tpl_class : '#AttendOrderOtherTpl',         //排行模板样式
                order_list_container_class : '#OrderListContainer',     //排行模板容器样式
                order_list_first_container_class : '#OrderListFirstContainer',   //排行模板容器样式
                order_list_other_container_class : '#OrderListOtherContainer',   //排行模板容器样式
                gift_layer_class : '#GiftSection',                      //送礼弹层样式
                send_gift_btn_class : '#SendGiftBtn',                   //送礼按钮样式
                gift_input_class : '.GiftIpt',                          //送礼选项样式
                nave_tip_div_class : '#NaveTipDiv',
                search_icon_class : '#SearchIcon',
                nave_search_div_class : '#NaveSearchDiv',
                search_btn_class : '#SearchBtn',
                search_input_class : '#SearchInt',
                sub_code_btn_class : '#SubCodeBtn',
                sub_code_class : '#SubCodeSection',
                sub_code_animation : 'sub-code-show',                    //二维码出现动画
                attend_list_api : '/vote/index/ajax_get_attend_list',
                attend_info_api : '/vote/index/ajax_get_attend_info',
                order_list_api : '/vote/index/ajax_get_order_list',
                send_gift_log_api : '/vote/index/ajax_send_gift_log',
                check_gift_log_api : '/vote/index/ajax_check_gift_log'
            },
            //初始化配置
            _init_ : function (pts) {
                var param = $wap_vote.use_params;
                //合并参数
                $.extend (true, param, $wap_vote.params, pts || {});
                param.page_btn_obj = $ (param.page_btn_class);
                param.content_btn_obj = $ (param.content_btn_class);
            },
            //开启应用
            start : function (pts) {
                //初始化参数
                $wap_vote._init_ (pts);
                //内容加载遮罩
                $tools.addPageLoading ();
                //绑定倒计时
                $wap_vote.bindTimeOut ();
                //绑定页面切换事件
                $wap_vote.changePage ();
                //绑定内容切换事件
                $wap_vote.changeContent ();
                //获取参赛选手列表
                $wap_vote.getAttendList ();
                //绑定下拉加载更多
                $wap_vote.bindListMore ();
                //送礼按钮事件
                $wap_vote.sendGiftBtn ();
                //绑定搜索事件
                $wap_vote.searchEvent ();
                //绑定关注按钮事件
                $wap_vote.showCode ();
            },
            //搜索功能
            searchEvent : function () {
                var param = $wap_vote.use_params,
                    search_icon = $ (param.search_icon_class),
                    tip_div = $ (param.nave_tip_div_class),
                    search_div = $ (param.nave_search_div_class),
                    search_btn = $ (param.search_btn_class),
                    search_ipt = $ (param.search_input_class),
                    list_container = $ (param.attend_list_container_class);
                search_icon.unbind ('click');
                search_icon.click (function () {
                    tip_div.hide ();
                    search_div.fadeIn ();
                });
                search_btn.unbind ('click');
                search_btn.click (function () {
                    var key = search_ipt.val (),
                        type = 1;
                    param.search_key = key;
                    param.attend_now_page = 1;
                    list_container.html ('');
                    //按钮样式移除和选中
                    param.content_btn_obj.siblings ().removeClass (param.page_on_class);
                    param.content_btn_obj.first ().addClass (param.content_on_class);
                    param.check_content = type;
                    //显示对应页面内容
                    for (var i in param.content_arr) {
                        var obj = $ (param.content_arr[i]);
                        if (i == type) {
                            obj.show ();
                        } else {
                            obj.hide ();
                        }
                    }
                    //切换内容还原其他内容
                    $wap_vote.contentOriginalContent (type);
                });
            },
            //关注二维码弹出
            showCode : function () {
                var param = $wap_vote.use_params,
                    btn = $ (param.sub_code_btn_class),
                    layer = $ (param.sub_code_class);
                btn.unbind ('click');
                btn.click (function () {
                    layer.show ();
                    layer.addClass (param.sub_code_animation);
                    $tools.maskLayer ({content : param.sub_code_class});
                });
            },
            //获取赛选手数据
            getAttendList : function () {
                var param = $wap_vote.use_params,
                    search = param.search_key || '';
                //显示加载数据中
                $ (param.attend_list_loading_class).show ();
                $ (param.attend_list_none_class).hide ();
                //获取数据
                $model.dataModel ({
                    get_data_api : param.attend_list_api,
                    data : {page : param.attend_now_page, search : search},
                    call_back : {
                        0 : $wap_vote.combineAttendParams
                    }
                });
            },
            //获取选手详情
            getAttendInfo : function (pts) {
                pts = pts || {}
                var param = $wap_vote.use_params,
                    id = pts.id || '';
                if (!id) return $tools.showalert ('不合法的操作！', 2);
                //获取数据
                $model.dataModel ({
                    get_data_api : param.attend_info_api,
                    data : {id : id},
                    call_back : {
                        0 : $wap_vote.combineAttendInfoParams
                    }
                });
            },
            //获取排行数据
            getOrderList : function () {
                var param = $wap_vote.use_params;
                //显示加载数据中
                $ (param.order_list_loading_class).show ();
                $ (param.order_list_none_class).hide ();
                //获取数据
                $model.dataModel ({
                    get_data_api : param.order_list_api,
                    data : {page : param.order_now_page},
                    call_back : {
                        0 : $wap_vote.combineOrderParams
                    }
                });
            },
            //显示赠送礼物弹层
            showGiftLayer : function () {
                var param = $wap_vote.use_params,
                    obj = $ (param.vote_btn_class);
                obj.unbind ('click');
                obj.click (function (e) {
                    var id = e.currentTarget.dataset.id;
                    param.gift_send_id = id;
                    $tools.maskLayer ({content : param.gift_layer_class});
                    $ (param.gift_layer_class).show ();
                    return false;
                });
            },
            //送礼按钮事件
            sendGiftBtn : function () {
                var param = $wap_vote.use_params,
                    obj = $ (param.send_gift_btn_class);
                obj.unbind ('click');
                obj.click (function () {
                    var check_inpt = $ (param.gift_input_class + ':checked'),
                        gift_id = check_inpt.val ();
                    param.gift_hot = parseInt (check_inpt.attr ('data-hot'));
                    if (!gift_id) return $tools.showalert ('请选择需要赠送的礼物', 1);
                    if (!param.gift_send_id) return $tools.showalert ('缺少赠送对象', 2);
                    if ($wap_vote.checkTimeout ()) return $tools.showalert ('投票活动已结束！', 2);
                    //添加按钮遮罩
                    $tools.submitLoading (obj);
                    //获取数据
                    $model.dataModel ({
                        get_data_api : param.send_gift_log_api,
                        data : {
                            gift_id : gift_id,
                            attend_id : param.gift_send_id
                        },
                        show_tips : 1,
                        call_back : {
                            0 : $wap_vote.flushAttendList
                        }
                    });
                    return false;
                });
            },
            //更新列表页面
            flushAttendList : function (pts) {
                //如果不是数字尝试唤醒微信支付
                if ((2 == pts.type)) return $wap_vote.callWxPay (pts.data);
                var param = $wap_vote.use_params,
                    obj = $ (param.attend_hot_num_class + param.gift_send_id),
                    num = parseInt (obj.html ()) + pts.hot;
                //移除遮罩
                $tools.moveMaskLayer ({click : true});
                //找到点击的对象上增加数量
                obj.html (num);
            },
            //唤醒微信支付
            callWxPay : function (pts) {
                var param = $wap_vote.use_params;
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener ('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent ('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent ('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    WeixinJSBridge.invoke (
                        'getBrandWCPayRequest', {
                            'appId' : pts['appId'],
                            'timeStamp' : pts['timeStamp'],
                            'nonceStr' : pts['nonceStr'],
                            'package' : pts['package'],
                            'signType' : pts['signType'],
                            'paySign' : pts['paySign']
                        },
                        function (res) {
                            //先关闭掉弹层
                            $wap_vote.flushAttendList ({type : 1, hot : param.gift_hot});
                            //获取数据
                            $model.dataModel ({
                                get_data_api : param.check_gift_log_api,
                                data : {
                                    order_num : pts['order_num']
                                },
                                show_tips : 1
                            });
                        });
                }
            },
            //切换页面内容
            changePage : function () {
                var param = $wap_vote.use_params;
                param.page_btn_obj.unbind ('click');
                param.page_btn_obj.click (function (e) {
                    e.stopPropagation ();
                    var $this = $ (this),
                        type = e.currentTarget.dataset.type;
                    if (type == param.check_page) return false;
                    //按钮样式移除和选中
                    param.page_btn_obj.parent ().find ('.' + param.page_on_class).removeClass (param.page_on_class);
                    param.check_page = type;
                    $this.addClass (param.page_on_class);
                    $this.children ().addClass (param.page_on_class);
                    var nav = $ (param.nav_status_class);
                    //显示对应页面内容
                    for (var i in param.page_arr) {
                        var obj = $ (param.page_arr[i]);
                        if (((i == type) && (3 != type))) {
                            obj.show ();
                        } else {
                            obj.hide ();
                        }
                    }
                    if (3 == type) {
                        nav.show ();
                        $ (param.content_arr[param.check_content]).show ();
                    } else {
                        nav.hide ();
                        //还原内容显隐
                        $wap_vote.pageOriginalContent ();
                    }
                });
            },
            //切换明星风采内容
            changeContent : function () {
                var param = $wap_vote.use_params;
                param.content_btn_obj.unbind ('click');
                param.content_btn_obj.click (function (e) {
                    var $this = $ (this),
                        type = e.currentTarget.dataset.type;
                    //按钮样式移除和选中
                    param.content_btn_obj.siblings ().removeClass (param.page_on_class);
                    param.check_content = type;
                    $this.addClass (param.content_on_class);
                    //显示对应页面内容
                    for (var i in param.content_arr) {
                        var obj = $ (param.content_arr[i]);
                        if (i == type) {
                            obj.show ();
                        } else {
                            obj.hide ();
                        }
                    }
                    //切换内容还原其他内容
                    $wap_vote.contentOriginalContent (type);
                });
            },
            //显示参赛选手详情按钮事件
            showAttendInfoBtn : function () {
                var param = $wap_vote.use_params,
                    obj = $ (param.show_attend_info_class);
                obj.unbind ('click');
                obj.click (function (e) {
                    var id = e.currentTarget.dataset.id;
                    $wap_vote.getAttendInfo ({id : id});
                    e.stopPropagation ();
                    return false;
                });
            },
            //换页切换还原内容
            pageOriginalContent : function () {
                var param = $wap_vote.use_params;
                //隐藏对应页面内容
                for (var i in param.content_arr) {
                    $ (param.content_arr[i]).hide ();
                }
                //隐藏选手详情
                $ (param.attend_info_class).hide ();
            },
            //内容切换还原内容
            contentOriginalContent : function (type) {
                var param = $wap_vote.use_params,
                    tip_div = $ (param.nave_tip_div_class),
                    search_div = $ (param.nave_search_div_class),
                    search_ipt = $ (param.search_input_class);
                switch (parseInt (type)) {
                    case 1:
                        //初始化数据
                        param.attend_now_page = 1;
                        $ (param.order_list_first_container_class).html ('');
                        $ (param.order_list_other_container_class).html ('');
                        $wap_vote.getAttendList ();
                        break;
                    case 2:
                        //初始化数据
                        param.order_now_page = 1;
                        param.search_key = '';
                        $ (param.attend_list_container_class).html ('');
                        tip_div.fadeIn ();
                        search_div.hide ();
                        search_ipt.val ('');
                        $wap_vote.getOrderList ();
                        break;
                    case 3:
                        //初始化数据
                        param.attend_now_page = 1;
                        param.order_now_page = 1;
                        $ (param.attend_list_container_class).html ('');
                        $ (param.order_list_first_container_class).html ('');
                        $ (param.order_list_other_container_class).html ('');
                        tip_div.fadeIn ();
                        search_div.hide ();
                        search_ipt.val ('');
                        break;
                }
                //隐藏选手详情
                $ (param.attend_info_class).hide ();
            },
            //组合参赛选手数据
            combineAttendParams : function (pts) {
                var param = $wap_vote.use_params;
                //取消加载
                $ (param.attend_list_loading_class).hide ();
                //第一次加载并且没有数据显示无数据提示
                if ($.isEmptyObject (pts)) {
                    return $ (param.attend_list_none_class).show ();
                }
                $ (param.attend_list_none_class).hide ();
                var tpl = $ (param.attend_list_tpl_class).html (),
                    container = $ (param.attend_list_container_class);
                for (var i in pts) {
                    var temp_file = pts[i]['pic'].split (',')[0].replace (/\'/g, ''),
                        file_ext = $tools.getFileExt (temp_file);
                    pts[i]['pic'] = temp_file + '_middle' + file_ext;
                }
                $model.combinePageHtml ({
                    tpl : tpl,
                    params : pts,
                    container : container,
                    type : (1 == param.attend_now_page ? 0 : 2),
                    call_back : {
                        0 : $wap_vote.showGiftLayer,        //绑定送礼物按钮事件
                        1 : $wap_vote.showAttendInfoBtn     //显示详情按钮事件
                    }
                });
                $tools.movePageLoading ();
                param.attend_now_page++;
                param.loading_page = true;
            },
            //组合参赛选手详情数据
            combineAttendInfoParams : function (pts) {
                var param = $wap_vote.use_params;
                //第一次加载并且没有数据显示无数据提示
                if ($.isEmptyObject (pts)) {
                    return false;
                }
                var tpl = $ (param.attend_info_tpl_class).html (),
                    container = $ (param.attend_info_container_class),
                    temp = pts['pic'].split (','),
                    file = temp[0].replace (/\'/g, ''),
                    file_ext = $tools.getFileExt (file);
                pts['pic'] = file + '_middle' + file_ext;
                $model.combinePageHtml ({
                    tpl : tpl,
                    params : {0 : pts},
                    container : container,
                    type : 0,
                    call_back : {
                        0 : $wap_vote.showGiftLayer          //绑定送礼物按钮事件
                    }
                });
                //移除内容中的选中按钮
                param.content_btn_obj.parent ().find ('.' + param.page_on_class).removeClass (param.page_on_class);
                //隐藏对应页面内容
                $wap_vote.pageOriginalContent ();
                //显示容器
                $ (param.attend_info_class).show ();
            },
            //组合排行数据
            combineOrderParams : function (pts) {
                var param = $wap_vote.use_params;
                //取消加载
                $ (param.order_list_loading_class).hide ();
                //第一次加载并且没有数据显示无数据提示
                if ($.isEmptyObject (pts)) {
                    return $ (param.order_list_none_class).show ();
                }
                $ (param.order_list_none_class).hide ();
                var tpl1 = $ (param.order_first_tpl_class).html (),
                    tpl2 = $ (param.order_other_tpl_class).html (),
                    container1 = $ (param.order_list_first_container_class),
                    container2 = $ (param.order_list_other_container_class);
                for (var i in pts) {
                    var temp_file = pts[i]['pic'].split (',')[0].replace (/\'/g, ''),
                        file_ext = $tools.getFileExt (temp_file);
                    pts[i]['pic'] = temp_file + '_small' + file_ext;
                }
                if (1 == param.order_now_page) {
                    var a1 = pts.shift (),
                        a2 = pts.shift (),
                        a3 = pts.shift ();
                    $model.combinePageHtml ({
                        tpl : tpl1,
                        params : {0 : a2, 1 : a1, 2 : a3},
                        container : container1,
                        type : 0
                    });
                    if (!a2)$ (param.order_list_first_container_class).children (":first").hide ();
                    if (!a3)$ (param.order_list_first_container_class).children (":last").hide ();
                }
                $model.combinePageHtml ({
                    tpl : tpl2,
                    params : pts,
                    container : container2,
                    type : 2
                });
                param.order_now_page++;
                param.loading_page = true;
            },
            //参赛列表下拉事件
            bindListMore : function () {
                var param = $wap_vote.use_params;
                $ (window).scroll (function () {
                    //当时滚动条离底部60px时开始加载下一页的内容
                    if (($ (window).height () + $ (window).scrollTop ()) >= $ (document).height ()) {
                        if (param.loading_page) {
                            param.loading_page = false;
                            if ($ (param.attend_list_container_class).is (":visible")) return $wap_vote.getAttendList ();
                            if ($ (param.order_list_container_class).is (":visible")) return $wap_vote.getOrderList ();
                        }
                    }
                });
            },
            //检查活动是否过期
            checkTimeout : function () {
                var param = $wap_vote.use_params,
                    out_time = new Date (param.time_out.substring (0, 19).replace (/-/g, '/')).getTime (),
                    now_time = (new Date ()).getTime ();
                if (now_time > out_time) {
                    return true;
                }
                return false;
            },
            //绑定倒计时
            bindTimeOut : function () {
                var param = $wap_vote.use_params,
                    out_time = new Date (param.time_out.substring (0, 19).replace (/-/g, '/')).getTime (),
                    timer = setInterval (function () {
                        var res = $tools.ToTime (parseInt (out_time) - parseInt ((new Date ()).getTime ())),
                            span_list = $(param.time_span);
                            span_list[0].innerHTML = res[0];
                            span_list[1].innerHTML = res[1];
                            span_list[2].innerHTML = res[2];
                            span_list[3].innerHTML = res[3];
                    }, 1000);
            }
        },
        //网页获取数据类
        WapModel : {
            //版本信息
            version : '1.0.0',
            use_params : {},                    //在使用的配置
            def_params : {
                get_data_api : '',              //接口地址
                save_data_api : '',             //接口地址
                data : {},                      //传入数据
                list_tpl : '',                  //内容模版
                call_back : {},                 //回调方法
                show_tips : 2                   //是否显示错误提示
            },
            //自初始化配置
            _init_ : function (pts) {
                pts = pts || {};
                $model.use_params = {};
                //将默认配置与自定义配置合并到应用配置中
                $.extend (true, $model.use_params, $model.def_params, pts);
            },
            //上传数据
            dataModel : function (pts) {
                $model._init_ (pts);
                var params = $model.use_params;
                //没有传入链接，条件数据
                if (!params.get_data_api || $.isEmptyObject (params.data)) {
                    throw new Error ('argument "get_data_url" or "data" is empty !');
                }
                //没有传入回调方法
                if (!params.call_back) {
                    throw new Error ('argument "call_back" or "data" is empty !');
                }
                //当前页数
                params.data.page = params.data.page || 1;
                //获取数据
                $.ajax ({
                    type : 'POST',
                    url : pts.get_data_api,
                    data : pts.data,
                    dataType : 'json',
                    success : function (d) {
                        d.data = d.data || {};
                        //移除提交等待
                        $tools.removeSubLoading ();
                        if (1 != d.code) return $tools.showalert (d.msg, 2);
                        //显示提示信息
                        if (d.msg && 1 == params.show_tips) $tools.showalert (d.msg, 1);
                        //将上级过来的数据一并合并到数据中返回
                        var inpt_param = pts.call_back_param ? pts.call_back_param : {};
                        //当前回调只有第一个值才能起作用
                        $tools.callBackFunc ({
                            call_back : params.call_back,
                            call_back_param : {0 : d.data, 1 : inpt_param}
                        });
                    },
                    error : function () {
                        return $tools.showalert ('服务异常，请稍后重试！', 2, 2);
                    }
                });
            },
            //组合展示页面数据
            combinePageHtml : function (pts) {
                //所有参数都齐全的时候进行替换重组
                if (!$.isEmptyObject (pts) && pts.tpl && pts.params && pts.container) {
                    //填充内容
                    var html = $.tplOp.tplReplace ({tpl : pts.tpl, params : pts.params});
                    //追加形式
                    switch (pts.type) {
                        case 1:
                            pts.container.prepend (html);
                            break;
                        case 2:
                            pts.container.append (html);
                            break;
                        default:
                            pts.container.html (html);
                    }
                    $tools.callBackFunc ({
                        call_back : pts.call_back
                    })
                }
            }
        },
        //网页工具类
        WapTools : {
            //版本信息
            version : '1.0.0',
            params : {
                page_loading_class : '#LoadingSection', //页面加载遮罩样式
                submit_loading_class : '.submitLoading'  //页面加载遮罩样式
            },
            //提示信息
            showalert : function (text, type, hide) {
                hide = hide || 1;
                var flg_class = (type == 1) ? 'suc' : 'fail',
                    html = '<div class="valert ' + flg_class + '">' +
                        '<div class="alert_bg">' +
                        '<div class="alert_text">' + text + '</div>' +
                        '</div>' +
                        '</div>';
                $ ("body").append (html);
                var valert = $ (".valert");
                valert.css ("margin-left", -$ (".valert").outerWidth () / 2);
                if (1 == hide) {
                    setTimeout (function () {valert.fadeOut (1000);}, 1000);
                    setTimeout (function () {valert.remove ();}, 2000);
                }
            },
            //按钮加载样式
            submitLoading : function (obj) {
                return obj.each (function () {
                    var $this = $ (this);
                    var position = $this.parent ().css ("position");
                    if (position != "absolute") {
                        $this.parent ().css ("position", "relative");
                    }
                    var w = $this.outerWidth ();
                    var h = $this.outerHeight ();
                    var l = $this.position ().left;
                    var t = $this.position ().top;
                    var html = '<div class="submitLoading" style="width:' + w + 'px; height:' + h + 'px; left:' + l + 'px; top:' + t + 'px"><img src="' + '/static/images/wap/public/loading.gif"></div>';
                    $this.parent ().append (html);
                });
            },
            //移除加载
            removeSubLoading : function () {
                var param = $tools.params;
                $ (param.submit_loading_class).remove ();
            },
            //添加遮罩层
            // class_name   遮罩层样式名不带#.;
            // content      内容样式名带#.;
            // move         是否移除内容
            maskLayer : function (pts) {
                pts = pts || {};
                if (!pts.content) {
                    throw new Error ('argument "content" is empty !');
                }
                //遮罩层样式名
                pts.class_name = pts.class_name || 'layer-mask';
                var obj = $ ('.' + pts.class_name),
                    lay_dav = '<div class="' + pts.class_name + '"' +
                        'style="display:none;"></div>';
                if (0 == obj.length) {
                    //添加遮罩
                    $ ('body').append (lay_dav);
                    $ ('.' + pts.class_name).fadeIn ();
                } else {
                    obj.fadeIn ();
                }
                //绑定移除
                $tools.moveMaskLayer (pts);
            },
            //绑定移除事件
            //click true 模拟点击
            moveMaskLayer : function (pts) {
                pts.class_name = pts.class_name || 'layer-mask';
                if (pts.click) return $ ('.' + pts.class_name).click ();
                if (!pts.class_name || !pts.content)
                    throw new Error ('argument "class_name" or "content" is empty !');
                //绑定清除弹出
                $ ('.' + pts.class_name).on ("click", function () {
                    var content = $ (pts.content),
                        layer = $ ('.' + pts.class_name),
                        func = content.attr ('data-func'),
                        params = content.attr ('data-params');
                    //淡出
                    $ ('.' + pts.class_name + ',' + pts.content).fadeOut ();
                    layer.remove ();
                    (1 == pts.move) && content.remove ();
                    $tools.callBackFunc ({
                        call_back : func,
                        call_back_param : params
                    })
                });
            },
            //获取字符串长度
            gblen : function (str) {
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt (i) > 127 || str.charCodeAt (i) == 94) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            },
            //获取文件名后缀
            getFileExt : function (file) {
                if (!file) return false;
                var index1 = file.lastIndexOf (".");
                var index2 = file.length;
                var postf = file.substring (index1, index2);
                return postf;
            },
            //随机字符串生成
            randomString : function (len) {
                len = len || 6;
                var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ';
                var output = "";
                for (var i = 0; i < len; i++) {
                    output += chars[parseInt ((chars.length - 1) * Math.random ())];
                }
                return output;
            },
            //获取指定大小的图片路径
            getCurrentImg : function (pts) {
                if (!pts.file || !pts.size) return '';
                if (pts.file.match (/http:\/\//i)) return pts.file;
                var file_arr = pts.file.split ('.'),
                    size_str = pts.size ? '_' + pts.size : '';
                return GV.UPLOAD_DOMAIN + file_arr[0] + size_str + '.' + file_arr[1];
            },
            scalingImg : function (obj) {
                var $this = $ (obj);
                var imgWidth = $this.width ();
                var imgHeight = $this.height ();
                var parent = $this.parent ();
                var containerWidth = parent.width ();
                var containerHeight = parent.height ();
                var containerRatio = containerWidth / containerHeight;
                var imgRatio = imgWidth / imgHeight;
                if (imgRatio > containerRatio) {
                    imgWidth = containerWidth;
                    imgHeight = containerWidth / imgRatio;
                } else if (imgRatio < containerRatio) {
                    imgHeight = containerHeight;
                    imgWidth = containerHeight * imgRatio;
                } else {
                    imgWidth = containerWidth;
                    imgHeight = containerHeight;
                }
                $this.attr ('style', 'width:' + imgWidth / 100 + 'rme;height:' + imgHeight / 100 + 'rem;');
            },
            //表单字符限制
            WordLimit : function (options) {
                var defaults = {
                    len : 200,
                    lim : "lim",
                    call_back : ''
                };
                var options = $.extend (defaults, options);
                var $input = $ (options.inpt);
                var $lim = $ ("#" + options.lim);
                var $cur = $lim.find (".lim-cur");
                var $all = $lim.find (".lim-all");
                if (0 == $input.length) return;
                $cur.html ($input.val ().length);
                $all.html (options.len);
                $input.live ("blur input propertychange", function (e) {
                    var content = $ (this).val ();
                    var length = content.length;
                    var result = options.len - length;
                    if (result >= 0) {
                        $cur.html (length);
                        $lim.css ({color : "#ccc"});
                    } else {
                        $ (this).val (content.substring (0, options.len));
                        $cur.html (length);
                        $lim.css ({color : "red"});
                        m = setTimeout (function () {
                            $lim.css ({color : "#ccc"});
                        }, 3000);
                    }
                    //回调函数
                    if ($.isFunction (options.call_back)) options.call_back ($input);
                });
            },
            //获取两个时间的差值
            ToTime : function (second) {
                second = second / 1000;
                result = {
                    0 : "0天",
                    1 : "0时",
                    2 : "0分",
                    3 : "0秒"
                };
                if (second > 0) {
                    var result;
                    var s = parseInt (second % 60);
                    var m = parseInt (second / 60) % 60;
                    var h = parseInt (second / 3600) % 24;
                    var d = parseInt (second / (3600 * 24));
                    result = {
                        0 : (d != 0 ? d : 0) + "天",
                        1 : (h != 0 ? h : 0) + "时",
                        2 : (m != 0 ? m : 0) + "分",
                        3 : (s != 0 ? s : 0) + "秒"
                    };
                }
                return result;
            },
            //加载页面
            addPageLoading : function (pts) {
                var param = $tools.params,
                    loading = (pts && pts.loading) ?
                        pts.loading : param.page_loading_class;
                //加载
                $ (loading).css ('top', window.scrollY).show ();
                //设置滚动
                $tools.scrollStatus ({show : false});
            },
            //移除加载页面
            movePageLoading : function (pts) {
                var param = $tools.params,
                    loading = (pts && pts.loading) ?
                        pts.loading : param.page_loading_class;
                //移除加载
                $ (loading).fadeOut ();
                //设置滚动
                $tools.scrollStatus ({show : true});
            },
            //显隐滚动轴
            scrollStatus : function (pts) {
                pts = pts || {};
                var cls = pts.cls || 'html',
                    obj = $ (cls);
                obj.css ('overflow', (pts.show ? '' : 'hidden'))
            },
            //回调函数
            callBackFunc : function (pts) {
                //回调
                if (pts && !$.isEmptyObject (pts.call_back)) {
                    var params = pts.call_back_param || {};
                    for (var i in pts.call_back) {
                        if ($.isFunction (pts.call_back[i]))
                            pts.call_back[i] (params[i] || {});
                    }
                }
            }
        }
    })
}) (jQuery);
//定义别名
var $wap_vote = $.WapVotes,
    $model = $.WapModel,
    $tools = $.WapTools;
//启动应用
$wap_vote.start ();