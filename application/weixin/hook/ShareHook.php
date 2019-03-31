<?php
/*********文件描述*********
 * @last      update 2019/3/23 13:30
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：分享签名
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/23 13:30
 */
namespace app\weixin\hook;

use think\Loader;

class ShareHook
{
    protected $operate;

    function __construct()
    {
        $this->operate = Loader::model('Share', 'logic', false, 'weixin');
    }

    /**
     * 获取微信分享配置参数
     *
     * @param array $param url         地址
     *
     * @return array
     */
    public function get_sign_package(array $param = array())
    {
        return $this->operate->get_sign_package($param);
    }
}