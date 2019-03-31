<?php
/*********文件描述*********
 * @last      update 2019/3/22 10:49
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：微信网页app授权
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 10:49
 */

namespace app\weixin\controller;

use app\common\controller\WapBase;
use think\Loader;

class WapOauth extends WapBase
{
    protected $operate;

    function _initialize()
    {
        parent::_initialize();
        if ('wx' != browser())
            $this->output_json(0, '请使用微信浏览器打开！');
        $this->operate = Loader::model('WapOauth', 'logic', false, 'weixin');
    }


    /**
     * 默认授权登录页面
     *
     * 参数描述：
     *
     * @param array
     * account_id   公众号id
     * redirect     回跳地址
     *
     * 返回值：
     *
     * @return mixed
     */
    public function index()
    {
        return $this->operate->oauth();
    }


    /**
     * 回调授权页面
     *
     * 参数描述：
     *
     * @param array
     *
     * 返回值：
     *
     * @return mixed
     */
    public function callback_oauth()
    {
        return $this->operate->callback_oauth();
    }
}