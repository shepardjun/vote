<?php
/*********文件描述*********
 * @last      update 2019/3/22 17:43
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：微信应用调用
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 17:43
 */
namespace app\weixin\hook;

use think\Loader;

class WxPayHook
{
    protected $operate;

    function __construct()
    {
        $this->operate = Loader::model('WxPay', 'logic', false, 'weixin');
    }

    /**
     * 微信统一下单接口
     *
     * 参数描述：
     *
     * @param array $param out_trade_no     商户订单号
     * @param array $param body             商品名称
     * @param array $param total_fee        付费金额
     * @param array $param openid           openid
     *
     * 返回值：
     *
     * @return array
     */
    public function send_order(array $param)
    {
        return $this->operate->send_order($param);
    }

    /**
     * 查询订单支付情况
     *
     * 参数描述：
     *
     * @param array $param out_trade_no     商户订单号
     *
     * 返回值：
     *
     * @return array
     */
    public function check_order(array $param)
    {
        return $this->operate->check_order($param);
    }
}