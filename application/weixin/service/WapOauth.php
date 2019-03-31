<?php
/*********文件描述*********
 * @last      update 2019/3/22 10:37
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：微信网页应用授权api
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 10:37
 */
namespace app\weixin\service;

use think\Curl;

class WapOauth
{
    const WX_OPEN_URL = 'https://open.weixin.qq.com';
    const WX_API_URL = 'https://api.weixin.qq.com';

    private $appid;
    private $secret;
    private $redirect_uri;
    private $response_type;
    private $scope;
    private $state;         //自定义参数
    private $code;          //微信回调code

    /**
     * 返回微信授权地址
     *
     * 参数描述：
     *
     * @param array $param string $app_id
     * @param array $param string $response_type
     * @param array $param string $scope
     * @param array $param string $state
     * @param array $param string $redirect
     *
     * @return mixed
     */
    public function get_oauth_url($param)
    {
        $this->appid = $param['app_id'];
        $this->redirect_uri = urlencode(SITE_DOMAIN . '/weixin/Wap_Oauth/callback_oauth');
        $this->response_type = isset($param['response_type']) ? $param['response_type'] : 'code';
        $this->scope = (isset($param['scope']) && 1 == $param['scope']) ? 'snsapi_base' : 'snsapi_userinfo';
        $this->state = isset($param['state']) ? $param['state'] : '1';

        return self::WX_OPEN_URL . '/connect/oauth2/authorize?appid=' .
        $this->appid . '&redirect_uri=' . $this->redirect_uri .
        '&response_type=' . $this->response_type . '&scope=' .
        $this->scope . '&state=' . $this->state . '#wechat_redirect';
    }


    /**
     * 获取access_token信息
     *
     * 参数描述：
     *
     * @param $param array
     * @param array  param string $app_id            app_id
     * @param array  param string $secret            加密串
     * @param array  param string $code              微信返回code
     *
     * @return array
     */
    public function get_access_token(array $param)
    {
        $this->appid = $param['app_id'];
        $this->secret = $param['secret'];
        $this->code = $param['code'];
        $url = self::WX_API_URL . '/sns/oauth2/access_token?appid=' . $this->appid .
            '&code=' . $this->code .
            '&grant_type=authorization_code' .
            '&secret=' . trim($this->secret) .
            '&code=' . $this->code .
            '&grant_type=authorization_code';


        $curl = new Curl();
        $res = $curl->get($url);

        return json_decode($res, true);
    }

    /**
     * 获取用户信息
     *
     * 参数描述：
     *
     * @param $param array
     * @param array  param string $access_token
     * @param array  param string $openid      用户id
     *
     * @return array
     */
    public function get_user_info(array $param)
    {
        $url = self::WX_API_URL . '/sns/userinfo?access_token=' .
            $param['access_token'] . '&openid=' . $param['openid'] . '&lang=zh_CN';

        $curl = new Curl();
        $res = $curl->get($url);

        return json_decode($res, true);
    }
}