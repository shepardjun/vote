/*********文件描述*********
 * @last update 2015/11/9 13:10
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：公用验证相关js
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright 中企动力vone+移动部
 * @version 2015/11/9 13:10
 */
//验证是否为链接类型
function isURL(str_url){
    var strRegex = '^((https|http)?://)[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=#]+$';
    var re = new RegExp(strRegex);
    if (re.test(str_url)){
        return true;
    }else{
        return false;
    }
}
//验证是否为空
function isNull (elem) {
    var str = elem.replace (/(^\s+|\s$)/g, "");
    if (str != "" && str != 'undefined') {
        return false;
    } else {
        return true;
    }
}
//验证是否为数字
function isInt (x) {
    var regs = /^\d\d*$/;
    if (x != "" && regs.test (x) == false) return false;
    return true;
}
//获取长度
function getNum (str, num_obj) {
    if ('undefined' != typeof(str)) {
        var subjectLength = strlength (str.replace (/(^\s*)|(\s*$)/g, ''));
        var num = subjectLength / 2;
        if (num.toString ().indexOf (".") > -1) {
            num = num + 0.5;
        }
        return num_obj ? num_obj.html (num) : num;
    }
}
//验证长度
function strlength (str) {
    var l = str.length;
    var n = l;
    for (var i = 0; i < l; i++) {
        if (str.charCodeAt (i) < 0 || str.charCodeAt (i) > 255) {
            n++;
        }
    }
    return n;
}
//删除两侧空格
function trim (str) { //删除左右两端的空格
    return str.replace (/(^\s*)|(\s*$)/g, "");
}
//删除左边的空格
function ltrim (str) {
    return str.replace (/(^\s*)/g, "");
}
//删除右边的空格
function rtrim (str) {
    return str.replace (/(\s*$)/g, "");
}
//判断是否引用js/css文件
function isInclude (name) {
    var js = /js$/i.test (name);
    var es = document.getElementsByTagName (js ? 'script' : 'link');
    for (var i = 0; i < es.length; i++)
        if (es[i][js ? 'src' : 'href'].indexOf (name) != -1)return true;
    return false;
}
/**
 * 随机字符串生成
 * @param int $len 生成的字符串长度
 * @return string
 */
function random_string (len) {
    len = len || 6;
    var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ';
    var output = "";
    for (var i = 0; i < len; i++) {
        output += chars[parseInt ((chars.length - 1) * Math.random ())];
    }
    return output;
}
//获取指定大小的图片路径
function get_current_img (pts) {
    if (!pts.file || !pts.size) return '';
    if (pts.file.match(/http:\/\//i)) return pts.file;
    var file_arr = pts.file.split ('.'),
        size_str = pts.size ? '_' + pts.size : '';
    return GV.UPLOAD_DOMAIN + file_arr[0] + size_str + '.' + file_arr[1];
}
//身份证验证
function isIdCardNo(code)
{
    var tips = {status : 0};

    var city={
        11:"北京",12:"天津",13:"河北",14:"山西",
        15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",
        36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",
        44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",
        52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
        63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",
        82:"澳门",91:"国外"
    };

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tips.msg = "身份证号格式错误";
        return tips;
    }

    else if(!city[code.substr(0,2)]){
        tips.msg = "身份证地址编码错误";
        return tips;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if(parity[sum % 11] != code[17]){
                tips.msg = "身份证校验位错误";
                return tips;
            }
        }
    }

    return {status:1, msg:''};
}
/* 
用途：检查输入对象的值是否符合E-Mail格式 
返回：如果通过验证返回true,否则返回false 
*/
function isEmail(str) {
    var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (myReg.test(str)) return true;
    return false;
}
/* 
检查输入手机号码是否正确 
*/
function checkMobile(str) {
    var patten = /^1\d{10}$/;
    return patten.exec(str);
}
