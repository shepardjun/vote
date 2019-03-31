/*********文件描述*********
 * @last update 2016/8/2 10:50
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：移动端工具类js
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2016/8/2 10:50 1.0.0
 */
;
(function ($) {
    $.extend ({
        //网页加载类
        WapLoading : {
            //版本信息
            version : '1.0.0',
            use_params : {},                            //使用的对象
            def_params : {
                app_container_class : '#AppContainer',  //可用引用列表容器选择器
                app_container : '<div id="AppContainer" style="display:none;"></div>',//应用容器html
                app_node_mask : 'data-node',            //应用标识
                page_loading_class : '#PageLoading'     //整个页面类型加载选择器
            },
            tool_list : {
                tplOp : 'jq.template.js',               //模版替换工具类
                DateFmt : 'jq.date.js',                 //时间插件工具类
                verification : 'jq.verification.js'     //表单验证工具
            },
            //自初始化配置
            _init_ : function (pts) {
                pts = pts || {};
                //将默认配置与自定义配置合并到应用配置中
                $.extend (true, $loading.use_params, $loading.def_params, pts);
            },
            start : function (pts) {
                //初始化配置
                $loading._init_ (pts);
                var param = $loading.tool_list;
                //自动加载工具
                for (var i in param) {
                    if (0 < param[i].indexOf ('js')) {
                        $loading.loadingJS ($load_file_path + 'js/' + param[i]);
                    }
                    if (0 < param[i].indexOf ('css')) {
                        $loading.loadingCSS ($load_file_path + 'css/' + param[i]);
                    }
                }
            },
            //加载应用
            loadingApp : function (pts) {
                if ($.isEmptyObject (pts)) return false;
                //先载入容器
                var def_param = $loading.def_params,
                    container = $ (def_param.app_container_class);
                if (!container.length) {
                    $ ('body').append (def_param.app_container);
                    //重新获取容器
                    container = $ (def_param.app_container_class);
                }
                //检测应用是否被装载
                var has_app = container.find ('[' + def_param.app_node_mask + '="' + pts.app_node + '"]');
                //已被装载，后续处理
                if (has_app.length) return false;
                //开始装载应用
                $.ajax ({
                    type : 'POST',
                    url : $load_app_api,
                    data : {app_node : pts.app_node},
                    dataType : 'json',
                    success : function (d) {
                        if (1 == d.status) {
                            //载入应用
                            container.append (d.data);
                            //执行回调
                            setTimeout (function () {
                                $tools.callBackFunc (pts);
                            }, 500);
                        } else {
                            $tools.showalert (d.info, 2)
                        }
                    }
                });
            },
            //自动加载样式文件加载head中
            loadingCSS : function (path) {
                if (!path || path.length === 0) {
                    throw new Error ('argument "path" is required !');
                }
                var head = document.getElementsByTagName ('head')[0];
                var link = document.createElement ('link');
                link.href = path;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild (link);
            },
            //自动加载js文件加载文件末尾
            loadingJS : function (path) {
                if (!path || path.length === 0) {
                    throw new Error ('argument "path" is required !');
                }
                var bottom = $ ('body'),
                    script = document.createElement ('script');
                script.src = path;
                script.type = 'text/javascript';
                script.async = true;
                bottom.append (script);
            },
            //加载页面
            addPageLoading : function (pts) {
                var param = $loading.use_params,
                    loading = (pts && pts.loading) ?
                        pts.loading : param.page_loading_class;
                //加载
                $ (loading).css ('top', window.scrollY).show ();
                //设置滚动
                $tools.scrollStatus ();
            },
            //移除加载页面
            movePageLoading : function (pts) {
                var param = $loading.use_params,
                    loading = (pts && pts.loading) ?
                        pts.loading : param.page_loading_class;
                //移除加载
                $ (loading).fadeOut ();
                //设置滚动
                $tools.scrollStatus ();
            }
        },
        //网页获取数据类
        WapModel : {
            //版本信息
            version : '1.0.0',
            use_params : {},                    //在使用的配置
            def_params : {
                page_class : '.JumpInpt',       //获取跳转页面选择器
                page_list_class : '#PageListCont',//填充内容容器
                get_data_url : '',              //获取数据的地址
                data : {},                      //上传数据
                show_page : 2,                  //是否需要分页
                container_tpl : '',             //容器模版
                list_tpl : '',                  //内容模版
                call_back : {},                 //回调方法
                show_err_tips : 2               //是否显示错误提示
            },
            //自初始化配置
            _init_ : function (pts) {
                pts = pts || {};
                $model.use_params = {};
                //将默认配置与自定义配置合并到应用配置中
                $.extend (true, $model.use_params, $model.def_params, pts);
            },
            //获取数据
            getPageList : function (pts) {
                $model._init_ (pts);
                var params = $model.use_params;
                //没有传入链接，条件数据
                if (!params.get_data_url || $.isEmptyObject (params.data)) {
                    throw new Error ('argument "get_data_url" or "data" is empty !');
                }
                //没有传入回调方法
                if (!params.call_back) {
                    throw new Error ('argument "call_back" or "data" is empty !');
                }
                //当前页数
                params.data.page = params.data.page ||
                    $ (params.page_class).val () || 1;
                //获取数据
                $.ajax ({
                    type : 'POST',
                    url : pts.get_data_url,
                    data : pts.data,
                    dataType : 'json',
                    success : function (d) {
                        d.data = d.data || {};
                        //显示提示信息
                        (1 == params.show_err_tips) &&
                        $tools.showalert (d.info, (1 != d.status) ? 2 : 1);
                        //将上级过来的数据一并合并到数据中返回
                        d.data.inpt_param = pts.call_back_param ? pts.call_back_param[0] : {};
                        //当前回调只有第一个值才能起作用
                        $tools.callBackFunc ({
                            call_back : params.call_back,
                            call_back_param : {0 : d.data}
                        });
                    }
                });
            },
            //存储数据
            saveData : function (pts) {
                $model._init_ (pts);
                var params = $model.use_params;
                //没有传入链接，条件数据
                if (!params.save_data_url || $.isEmptyObject (params.data)) {
                    throw new Error ('argument "save_data_url" or "data" is empty !');
                }
                //获取数据
                $.ajax ({
                    type : 'POST',
                    url : params.save_data_url,
                    data : params.data,
                    dataType : 'json',
                    success : function (d) {
                        d.data = d.data || {};
                        //显示提示信息
                        (1 == params.show_err_tips) &&
                        $tools.showalert (d.info, (1 != d.status) ? 2 : 1);
                        //将上级过来的数据一并合并到数据中返回
                        d.inpt_param = pts.call_back_param ? pts.call_back_param[0] : {};
                        //当前回调只有第一个值才能起作用
                        $tools.callBackFunc ({
                            call_back : params.call_back,
                            call_back_param : {0 : d}
                        });
                    }
                });
            },
            //组合展示页面数据
            combinPageHtml : function (pts) {
                //所有参数都齐全的时候进行替换重组
                if (!$.isEmptyObject (pts) && pts.tpl && pts.params && pts.container) {
                    //填充内容
                    var html = $.tplOp.tplReplace ({tpl : pts.tpl, params : pts.params});
                    //追加形式
                    (1 == pts.type) ?
                        pts.container.prepend (html) :
                        pts.container.append (html);
                }
            }
        },
        //网页工具类
        WapTools : {
            //版本信息
            version : '1.0.0',
            //提示信息
            showalert : function (text, type) {
                var flg_class = (type == 1) ? 'suc' : 'fail',
                    html = '<div class="valert ' + flg_class + '">' +
                        '<div class="alert_bg">' +
                        '<div class="alert_text">' + text + '</div>' +
                        '</div>' +
                        '</div>';
                $ ("body").append (html);
                var valert = $ (".valert");
                valert.css ("margin-left", -$ (".valert").outerWidth () / 2);
                setTimeout (function () {valert.fadeOut (1000);}, 1000);
                setTimeout (function () {valert.remove ();}, 2000);
            },
            //添加遮罩层
            // className    遮罩层样式名不带#.;
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
                if (obj.length == 0) {
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
            moveMaskLayer : function (pts) {
                //绑定清除弹出
                $ ('.' + pts.class_name + ',' + pts.content).on ("click", function () {
                    var content = $ (pts.content),
                        layer = $ ('.' + pts.class_name),
                        func = layer.attr ('data-func'),
                        params = layer.attr ('data-params');
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
            //显隐滚动轴
            scrollStatus : function (pts) {
                pts = pts || {};
                var cls = pts.cls || 'html',
                    obj = $ (cls);
                obj.css ('overflow', ('hidden' == obj.css ('overflow') ? '' : 'hidden'))
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
        },
        //图片展示效果类
        WapImageDisplay : {
            //版本信息
            version : '1.0.0',
            use_params : {},                            //使用的对象
            def_params : {
                layer_class : '.layer_img_mask',        //遮罩层选择器
                layer : {},                             //遮罩层
                layer_img_id : '#ShowImgDiv',           //应用容器html选择器
                layer_img : {},                         //应用容器html
                layer_img_class : 'layer_img_class',    //应用容器样式
                img_obj_class : '.ShowPicBtn',          //展示图片的对象选择器
                img_obj : {},                           //展示图片
                layer_tpl : '<div class="{class}" style="display:none;"></div>',
                layer_img_tpl : '<img class="{class}" id="{id}" style="display:none;"></div>',
            },
            //自初始化配置
            _init_ : function (pts) {
                pts = pts || {};
                var param = $img_display.use_params;
                //将默认配置与自定义配置合并到应用配置中
                $.extend (true, param, $img_display.def_params, pts);
                //遮罩层
                param.layer = $ (param.layer_class);
                //图片容器
                param.layer_img = $ (param.layer_img_id);
                //展示图片
                param.img_obj = $ (param.img_obj_class);
                //遮罩
                param.layer_tpl = param.layer_tpl.replace (/\{class\}/, param.layer_class.replace (/[.#]/, ''));
                //展示图片容器
                param.layer_img_tpl = param.layer_img_tpl.replace (/\{class\}/, param.layer_img_class);
                param.layer_img_tpl = param.layer_img_tpl.replace (/\{id\}/, param.layer_img_id.replace (/[.#]/, ''));
            },
            //图片绑定事件
            // img_class 图片选择器 带 .|#
            // layer_class 遮罩层选择器 带 .|#
            // layer_img 展示用的选择器 带 .|#
            // layer_img_class 展示图片样式 不带 .|#
            imageDisplay : function (pts) {
                //初始化配置
                $img_display._init_ (pts);
                var param = $img_display.use_params,
                    body = $ ('body');
                //查看是否有遮罩层
                if (0 == param.layer.length) {
                    body.append (param.layer_tpl);
                    param.layer = $ (param.layer_class);
                }
                //查看是否有图片容器
                if (0 == param.layer_img.length) {
                    body.append (param.layer_img_tpl);
                    param.layer_img = $ (param.layer_img_id);
                }
                //解除全部绑定
                param.img_obj.unbind ('click');
                param.layer.unbind ('click');
                param.layer_img.unbind ('click');
                //绑定遮罩层点击事件
                param.layer.bind ("click", function () {
                    $ (this).fadeOut ();
                    param.layer_img.fadeOut ();
                });
                //绑定展示图事件
                param.layer_img.bind ("click", function () {
                    $ (this).fadeOut ();
                    param.layer.fadeOut ();
                });
                //绑定图片点击事件
                param.img_obj.bind ("click", function () {
                    var $this = $ (this),
                        clientHeight = document.body.clientHeight,
                        clientWidth = document.body.clientWidth,
                        src_url = $this.attr ("data-orgurl");
                    param.layer.css ("height", clientHeight).fadeIn ();
                    param.layer_img.attr ("src", src_url);
                    param.layer_img.load (function () {
                        $img_display.drawImage (param.layer_img_id, clientWidth, clientHeight);
                    });
                    param.layer_img.fadeIn ();
                });
            },
            //调整图片
            drawImage : function (ImgId, iwidth, iheight) {
                //参数(图片,允许的宽度,允许的高度)
                var image = new Image (),
                    ImgD = document.getElementById (ImgId.replace (/[.#]/, '')),
                    jq_obj = $ (ImgId);
                jq_obj.css ('margin-top', 0);
                jq_obj.css ('margin-left', 0);
                image.src = ImgD.src;
                if (image.width > 0 && image.height > 0) {
                    if (image.width / image.height >= iwidth / iheight) {
                        if (image.width > iwidth) {
                            ImgD.width = iwidth;
                            ImgD.height = (image.height * iwidth) / image.width;
                        } else {
                            ImgD.width = image.width;
                            ImgD.height = image.height;
                        }
                    } else {
                        if (image.height > iheight) {
                            ImgD.height = iheight;
                            ImgD.width = (image.width * iheight) / image.height;
                        } else {
                            ImgD.width = image.width;
                            ImgD.height = image.height;
                        }
                    }
                    //调整上边距
                    if (ImgD.height < iheight)
                        jq_obj.css ('margin-top', (window.screen.height - ImgD.height) / 2);
                    if (ImgD.width < iwidth)
                        jq_obj.css ('margin-left', (iwidth - ImgD.width) / 2);
                }
            }
        }
    });
}) (jQuery);
//定义别名
var $load_file_path = GV.TP_PUBLIC + '/' || '', //系统工具默认路径
    $tools = $.WapTools,
    $model = $.WapModel,
    $loading = $.WapLoading,
    $img_display = $.WapImageDisplay;
$model._init_ ();
$loading._init_ ();