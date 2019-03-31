<?php
/*********文件描述*********
 * @last update 2019/3/22 18:08
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 * 
 *
 * 功能简介：微信支付控制器
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/22 18:08
 */

namespace app\weixin\controller;

use app\common\controller\WapBase;

use think\Loader;

class WxPay extends WapBase
{
    //逻辑类
    protected $operate;

    function _initialize()
    {
        parent::_initialize();
        $this->operate = Loader::model('WxPay', 'logic', false, 'weixin');
    }

    public function wx_pay_callback()
    {
        $params = input('post.');

        $this->operate->callback_pay($params);

        eixt('');
    }
}