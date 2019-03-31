/**
 * @title 时间工具类
 * @note 本类一律违规验证返回false
 * @author {boonyachengdu@gmail.com}
 * @date 2013-07-01
 * @formatter "2013-07-01 00:00:00" , "2013-07-01"
 */
var DateFmt = {
    /**
     * 将时间戳转化为毫秒时间对象
     */
    gDateMs : function(date){
        return new Date(parseInt(date) * 1000);
    },

    /**
     * 获取当前时间毫秒数
     */
    gNowMs : function() {
        var myDate = new Date();
        return myDate.getTime();
    },

    /**
     * 获取当前时间秒数
     */
    gNowMin : function() {
        var myDate = new Date();
        return myDate.getTime()/1000;
    },
    /**
     * 毫秒转时间格式
     */
    MsToDate : function(time) {
        if(!time) return false;
        var myDate = new Date(time);
        return this.FmtDateTime(myDate);
    },
    /**
     * 时间格式转毫秒
     */
    DateToMs : function(date) {
        if(!date) return false;
        var myDate = new Date(date);
        return myDate.getTime();
    },
    /**
     * 格式化日期（不含时间）
     */
    FmtDate : function(date, fmt) {
        fmt = fmt || '--';

        if(!date) return false;

        var n = this.gDateMs(date);

        var datetime = n.getFullYear()
            + (fmt[0] ? fmt[0] : '')// "年"
            + ((n.getMonth() + 1) >= 10 ? (n.getMonth() + 1) : "0"
            + (n.getMonth() + 1))
            + (fmt[1] ? fmt[1] : '')// "月"
            + (n.getDate() < 10 ? "0" + n.getDate() : n
                .getDate())
            + (fmt[2] ? fmt[2] : '');// "日"

        return datetime;
    },
    /**
     * 格式化日期（含时间"00:00"）
     */
    FmtDate2 : function(date, fmt) {
        fmt = fmt || '--';
        if(!date) return false;

        var n = this.gDateMs(date);
        var datetime = n.getFullYear()
            + (fmt[0] ? fmt[0] : '')// "年"
            + ((n.getMonth() + 1) >= 10 ? (n.getMonth() + 1) : "0"
            + (n.getMonth() + 1))
            + (fmt[1] ? fmt[1] : '')// "月"
            + (n.getDate() < 10 ? "0" + n.getDate() : n.getDate())
            + (fmt[2] ? fmt[2] : '')// "日"
            + " "
            + (n.getHours() < 10 ? "0" + n.getHours() : n.getHours())
            + ":"
            + (n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes());

        return datetime;
    },
    /**
     * 格式化去日期（含时间）
     */
    FmtDateTime : function(date, fmt) {
        if(!date) return false;
        fmt = fmt || '--';
        var n = this.gDateMs(date);

        var datetime = n.getFullYear()
            + (fmt[0] ? fmt[0] : '')// "年"
            + ((n.getMonth() + 1) > 10 ? (n.getMonth() + 1) : "0"
            + (n.getMonth() + 1))
            + (fmt[1] ? fmt[1] : '')// "月"
            + (n.getDate() < 10 ? "0" + n.getDate() : n
                .getDate())
            + " "
            + (n.getHours() < 10 ? "0" + n.getHours() : n
                .getHours())
            + ":"
            + (n.getMinutes() < 10 ? "0" + n.getMinutes() : n
                .getMinutes())
            + ":"
            + (n.getSeconds() < 10 ? "0" + n.getSeconds() : n
                .getSeconds());

        return datetime;
    },
    /**
     * 时间比较{结束时间大于开始时间}
     */
    cDate : function(startTime, endTime) {
        if(!startTime || !endTime) return false;
        return ((new Date(endTime.replace(/-/g, "/"))) > (new Date(
            startTime.replace(/-/g, "/"))));
    },
    /**
     * 验证开始时间合理性{开始时间不能小于当前时间{X}个月}
     */
    cRightStart : function(month, startTime) {
        if(!month || !startTime) return false;
        var now = formatterDayAndTime(new Date());
        var sms = new Date(startTime.replace(/-/g, "/"));
        var ems = new Date(now.replace(/-/g, "/"));
        var tDayms = month * 30 * 24 * 60 * 60 * 1000;
        var dvalue = ems - sms;
        if (dvalue > tDayms) {
            return false;
        }
        return true;
    },
    /**
     * 验证结束时间合理性{结束时间不能小于当前时间{X}个月}
     */
    cRightEnd : function(month, endTime) {
        if(!month || !endTime) return false;
        var now = formatterDayAndTime(new Date());
        var sms = new Date(now.replace(/-/g, "/"));
        var ems = new Date(endTime.replace(/-/g, "/"));
        var tDayms = month * 30 * 24 * 60 * 60 * 1000;
        var dvalue = sms - ems;
        if (dvalue > tDayms) {
            return false;
        }
        return true;
    },
    /**
     * 验证开始时间合理性{结束时间与开始时间的间隔不能大于{X}个月}
     */
    cDate2 : function(month, startTime, endTime) {
        if(!month || !startTime || !endTime) return false;
        var sms = new Date(startTime.replace(/-/g, "/"));
        var ems = new Date(endTime.replace(/-/g, "/"));
        var tDayms = month * 30 * 24 * 60 * 60 * 1000;
        var dvalue = ems - sms;
        if (dvalue > tDayms) {
            return false;
        }
        return true;
    },
    /**
     * 获取最近几天[开始时间和结束时间值,时间往前推算]
     */
    gRecentDate : function(day) {
        if(!day) return false;
        var daymsTime = day * 24 * 60 * 60 * 1000;
        var yesterDatsmsTime = this.gNowMs() - daymsTime;
        var startTime = this.MsToDate(yesterDatsmsTime);
        var pastDate = this.FmtDate2(new Date(startTime));
        var nowDate = this.FmtDate2(new Date());
        var obj = {
            startTime : pastDate,
            endTime : nowDate
        };
        return obj;
    },
    /**
     * 获取今天[开始时间和结束时间值]
     */
    gToday : function() {
        var daymsTime = 24 * 60 * 60 * 1000;
        var tomorrowDatsmsTime = this.gNowMs() + daymsTime;
        var currentTime = this.MsToDate(this.gNowMs());
        var termorrowTime = this.MsToDate(tomorrowDatsmsTime);
        var nowDate = this.FmtDate2(new Date(currentTime));
        var tomorrowDate = this.FmtDate2(new Date(termorrowTime));
        var obj = {
            startTime : nowDate,
            endTime : tomorrowDate
        };
        return obj;
    },
    /**
     * 获取明天[开始时间和结束时间值]
     */
    gTomorrow : function() {
        var daymsTime = 24 * 60 * 60 * 1000;
        var tomorrowDatsmsTime = this.gNowMs() + daymsTime;
        var termorrowTime = this.MsToDate(tomorrowDatsmsTime);
        var theDayAfterTomorrowDatsmsTime = this.gNowMs()+ (2 * daymsTime);
        var theDayAfterTomorrowTime = this.MsToDate(theDayAfterTomorrowDatsmsTime);
        var pastDate = this.FmtDate2(new Date(termorrowTime));
        var nowDate = this.FmtDate2(new Date(theDayAfterTomorrowTime));
        var obj = {
            startTime : pastDate,
            endTime : nowDate
        };
        return obj;
    }
};