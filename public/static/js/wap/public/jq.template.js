/*********文件描述*********
 * @last update 2015/9/18 16:04
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：模版变量替换
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2015/9/18 16:04 1.0.0
 */

;(function ($) {
    $.extend({
        tplOp : {
            //默认参数
            params : {
                left_mark : '{{',    //左侧边界
                right_mark : '}}',   //右侧边界
                tpl : null,          //多图文第一部分
                tpl2 : null,         //多图文第二部分
                tpl3 : null,         //单图文
                params : {},         //模版替换参数
                func_other : 'OT_HTML' //需要被替换的模版
            },

            //初始化配置
            _init_ : function(opts){
                return $.extend ({}, this.params, opts);
            },

            //常用模版替换
            tplReplace : function (params) {
                var opts = this._init_(params),
                    out_str = '';

                //有对象并且有参数
                if ($.isEmptyObject (opts.tpl) || $.isEmptyObject (opts.params)) return '';

                //遍历替换参数
                for (var c in opts.params) {
                    out_str += this._tplCombine (opts, opts.tpl, opts.params[c]);
                }

                //返回
                return out_str;
            },

            //特殊模版替换（例如：图文）
            tplMultiReplace : function (options) {
                var opts = this._init_(options),
                    out_str = '',
                    out_str2 = '',
                    type = opts.type || 2;

                //有对象并且有参数
                if ($.isEmptyObject (opts.tpl) || $.isEmptyObject (opts.params)) return '';

                //遍历替换参数
                for (var c in opts.params) {
                    //多图文
                    if (2 == type) {
                        //其他
                        if (0 < c) {
                            if(!opts.tpl2) continue;
                            out_str2 += this._tplCombine (opts, opts.tpl2, opts.params[c]);

                        //第一个
                        } else {
                            if(!opts.tpl) continue;
                            out_str = this._tplCombine (opts, opts.tpl, opts.params[c]);
                        }

                    //单图文
                    } else {
                        if(!opts.tpl3) continue;
                        return out_str = this._tplCombine (opts, opts.tpl3, opts.params[c]);
                    }
                }

                out_str = out_str.replace (
                    new RegExp (opts.left_mark + opts.func_other + opts.right_mark, 'g'),
                    out_str2
                );

                //返回
                return out_str;
            },

            //组合模版
            _tplCombine : function (opt, h, ps) {
                for (var i in ps) {
                    ps[i] = ps[i] || (0 === ps[i] ? 0 : '');

                    h = h.replace (
                        new RegExp (opt.left_mark + i + opt.right_mark, 'g'),
                        ps[i]
                    );
                }

                return h;
            }
        }
    });
})(jQuery);