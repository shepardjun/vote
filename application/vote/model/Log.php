<?php
/*********文件描述*********
 * @last update 2019/3/19 11:38
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：礼物赠送信息mdl
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/19 11:38
 */
namespace app\vote\model;

class Log extends Base
{
    protected $name = 'gift_log';

    //用来保护那些不需要被更新的字段。
    protected $readonly = ['id', 'order_num', 'buy_time', 'create_time'];
}
