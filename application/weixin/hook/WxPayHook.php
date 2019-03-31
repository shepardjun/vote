<?php
/*********�ļ�����*********
 * @last      update 2019/3/22 17:43
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * ���ܼ�飺΢��Ӧ�õ���
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
     * ΢��ͳһ�µ��ӿ�
     *
     * ����������
     *
     * @param array $param out_trade_no     �̻�������
     * @param array $param body             ��Ʒ����
     * @param array $param total_fee        ���ѽ��
     * @param array $param openid           openid
     *
     * ����ֵ��
     *
     * @return array
     */
    public function send_order(array $param)
    {
        return $this->operate->send_order($param);
    }

    /**
     * ��ѯ����֧�����
     *
     * ����������
     *
     * @param array $param out_trade_no     �̻�������
     *
     * ����ֵ��
     *
     * @return array
     */
    public function check_order(array $param)
    {
        return $this->operate->check_order($param);
    }
}