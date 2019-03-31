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

namespace app\weixin\logic;

use think\Config;
use think\Cookie;
use think\Loader;

class WapOauth
{
    private $appid = '';
    private $secret = '';
    private $callback_url = '';
    private $service = '';

    function __construct()
    {
        $weixin_conf = Config::get('weixin_config');
        $this->appid = $weixin_conf['app_id'];
        $this->secret = $weixin_conf['app_secret'];
        $redirect = input('?request.redirect') ? input('request.redirect') : '';
        $this->callback_url = base64_decode($redirect);
        $this->service = Loader::model('WapOauth', 'service', false, 'weixin');
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
    public function oauth()
    {
        if (!$this->callback_url)
            return array('code' => 0, 'msg' => '必须传入回跳地址');

        //传入参数
        $param = array(
            'app_id'       => $this->appid,
            'secret'       => $this->secret,
            'callback_url' => $this->callback_url,
        );

        $url = $this->service->get_oauth_url(array(
            'app_id' => $param['app_id']
        ));

        //存放公众号信息
        Cookie::set('wx_oauth_info', serialize($param), array('expire' => time() + 200));
        header('Location:' . $url);
        die();
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
        $account = Cookie::get('wx_oauth_info');
        $param = unserialize(htmlspecialchars_decode($account));
        $code = input('get.code');

        if (empty($param))
            $this->output_json(0, '网页授权已过期，请回到首页！');

        if (empty($code))
            $this->output_json(0, '未能正确获得微信授权码！');

        //获取access_token
        $res = $this->service->get_access_token(array(
            'app_id' => $param['app_id'],
            'secret' => $param['secret'],
            'code'   => $code
        ));

        if (!$res)
            $this->output_json(0, '获取公众号授权access_token错误！');

        //获取用户信息
        $fans_info = $this->service->get_user_info($res);

        if (empty($fans_info))
            $this->output_json(0, '获得用户信息失败！');

        Cookie::delete('wx_oauth_info');
        Cookie::delete('WX_UF');
        Cookie::set('WX_UF', base64_encode(serialize($fans_info)), 604800);

        return redirect($param['callback_url'])->send();
    }


    /**
     * 统一输出json数据结构
     *
     * @param int    $code
     * @param string $msg
     * @param int    $count
     * @param array  $data
     */
    public function output_json($code = 0, $msg = '', $count = 0, $data = array())
    {
        header('Content-Type:application/json; charset=utf-8');
        $return_data = [
            'code'  => $code,
            'msg'   => $msg,
            'count' => $count,
            'data'  => $data
        ];
        echo json_encode($return_data);
        exit();
    }
}