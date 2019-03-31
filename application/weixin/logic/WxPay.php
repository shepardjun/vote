<?php
/*********文件描述*********
 * @last      update 2019/3/22 17:40
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：微信支付api
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 17:40
 */

namespace app\weixin\logic;

use app\common\lib\Hook;
use think\Config;
use think\Request;
use think\Log;
use think\Loader;
use think\Exception;

class WxPay
{
    private $appid = '';
    private $secret = '';
    private $merchant_id = '';
    private $merchant_secret = '';
    private $notify_url = '';
    private $spbill_create_ip = '';
    private $trade_type = 'JSAPI';
    private $scene_info = '';
    private $service = '';


    public function __construct()
    {
        $weixin_conf = Config::get('weixin_config');
        $this->appid = $weixin_conf['app_id'];
        $this->secret = $weixin_conf['app_secret'];
        $this->merchant_id = $weixin_conf['merchant_id'];
        $this->merchant_secret = $weixin_conf['merchant_secret'];
        $this->notify_url = SITE_DOMAIN . '/weixin/Wx_Pay/wx_pay_callback';
        $this->spbill_create_ip = Request::instance()->ip();
        $this->scene_info = '{"h5_info": {"type":"Wap","wap_url": "' . SITE_DOMAIN . '","wap_name": "投票送礼"}}';
        $this->service = Loader::model('WxPay', 'service', false, 'weixin');
    }


    /**
     * 微信统一下单
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
     * @return mixed
     */
    public function send_order($param)
    {
        $code = 0;
        $msg = '微信统一下单出错';
        $data = array();

        //生成xml
        $this->service->setParameter('appid', $this->appid);
        $this->service->setParameter('mch_id', $this->merchant_id);
        $this->service->setParameter('notify_url', $this->notify_url);
        $this->service->setParameter('spbill_create_ip', $this->spbill_create_ip);
        $this->service->setParameter('trade_type', $this->trade_type);
        $this->service->setParameter('scene_info', $this->scene_info);
        $this->service->setParameter('out_trade_no', $param['out_trade_no']);
        $this->service->setParameter('body', $param['body']);
        $this->service->setParameter('total_fee', $param['total_fee'] * 100);
        $this->service->setParameter('openid', $param['openid']);
        $this->service->setParameter('nonce_str', $this->service->createNoncestr());
        $this->service->setParameter('sign', $this->service->getSign($this->service->parameters, $this->merchant_secret));
        $this->service->sendOrderXml();
        $res = $this->service->getResult();

        if (('SUCCESS' == $res['return_code']) && ('SUCCESS' == $res['result_code'])) {
            switch ($this->trade_type) {
                case 'JSAPI':
                    $data = array(
                        'appId'     => $res['appid'],
                        'timeStamp' => (string)time(),
                        'nonceStr'  => $this->service->createNoncestr(),
                        'package'   => 'prepay_id=' . $res['prepay_id'],
                        'signType'  => 'MD5',
                    );
                    $data['paySign'] = $this->service->getSign($data, $this->merchant_secret);
                    break;
                case 'MWEB';
                    break;
            }

            $code = 1;
            $msg = '微信下单成功！';
        }

        return array(
            'code' => $code,
            'msg'  => $msg,
            'data' => $data
        );
    }


    /**
     * 查询订单情况
     *
     * 参数描述：
     *
     * @param array $param out_trade_no     商户订单号
     *
     * 返回值：
     *
     * @return mixed
     */
    public function check_order($param)
    {
        $code = 0;
        $msg = '订单未支付成功';
        $data = array();

        //生成xml
        $this->service->setParameter('appid', $this->appid);
        $this->service->setParameter('mch_id', $this->merchant_id);
        $this->service->setParameter('out_trade_no', $param['out_trade_no']);
        $this->service->setParameter('nonce_str', $this->service->createNoncestr());
        $this->service->setParameter('sign', $this->service->getSign($this->service->parameters, $this->merchant_secret));
        $this->service->checkOrderXml();
        $res = $this->service->getResult();

        if (('SUCCESS' == $res['return_code']) && ('SUCCESS' == $res['result_code']) && ('SUCCESS' == $res['trade_state'])) {
            $data = $res;
            $code = 1;
            $msg = '订单已支付成功！';
        }

        return array(
            'code' => $code,
            'msg'  => $msg,
            'data' => $data
        );
    }


    /**
     * 微信支付通知
     *
     * 参数描述：
     *
     * @param array
     *
     * 返回值：
     *
     * @return mixed
     */
    public function callback_pay($param)
    {
        try {
            Log::info("微信支付回调进入页面");
            $data = json_decode(json_encode(simplexml_load_string($param, 'SimpleXMLElement', LIBXML_NOCDATA)), true);

            if ($data['result_code'] == "SUCCESS" && $data['return_code'] == "SUCCESS") //验证 是否 微信 回调
            {
                #region 日志处理

                Log::info("微信支付回调，验证成功，订单号：" + $data['out_trade_no']);

                $save_log = Hook::hooks(array(
                    'app'    => 'vote',
                    'clname' => 'VoteHook',
                    'fnname' => 'wx_callback_gift_log',
                    'data'   => array(
                        'order_num'      => $param['out_trade_no'],
                        'transaction_id' => $param['transaction_id']
                    )
                ));

                if (1 == $save_log['code']) //更新支付状态成功
                {
                    #region 日志处理

                    Log::info("微信支付回调更新订单支付状态，更新订单支付状态成功，订单号：" + $data['out_trade_no']);

                    #endregion

                    $returnResutStr = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
                } else //更新支付状态失败
                {
                    #region 日志处理

                    Log::info("微信支付回调更新订单支付状态，更新订单支付状态失败，订单号：" + $data['out_trade_no']);

                    #endregion

                    $returnResutStr = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[error]]></return_msg></xml>";
                }
                #endregion
            } else //微信回调失败
            {
                #region 日志处理

                Log::info("微信支付回调更新订单支付状态，验证失败，回调参数是非法的");
                #endregion
                $returnResutStr = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[error]]></return_msg></xml>";
            }
        } catch (Exception $e) {
            #region 添加错误日志
            Log::error("微信支付回调更新订单支付状态，出现异常:" + $e->getMessage() + "，堆栈：" + $e->getTraceAsString());
            #endregion

            $returnResutStr = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[error]]></return_msg></xml>";
        }

        echo $returnResutStr;
        exit();
    }
}