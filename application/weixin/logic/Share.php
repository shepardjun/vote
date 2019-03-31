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
namespace app\weixin\logic;

use think\Config;
use think\Cache;

class Share
{
    private $appid = '';
    private $secret = '';

    function __construct()
    {
        $weixin_conf = Config::get('weixin_config');
        $this->appid = $weixin_conf['app_id'];
        $this->secret = $weixin_conf['app_secret'];
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
        $url = isset($param['url']) ? $param['url'] : SITE_DOMAIN.$_SERVER['REQUEST_URI'];
        $timestamp = (string)time();
        $nonceStr = $this->createNonceStr();
        $ticket = $this->getJsApiTicket();
        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = 'jsapi_ticket=' . $ticket . "&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
        $signature = sha1($string);

        return array(
            "appId"     => $this->appid,
            "nonceStr"  => $nonceStr,
            "timestamp" => $timestamp,
            "signature" => $signature
        );
    }

    /**
     * 获取js调用票据
     *
     * 参数描述：
     *
     * 返回值：
     *
     * @return mixed
     */
    private function getJsApiTicket()
    {
        // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
        $data = '';
        $data = json_decode(Cache::get('jsapi_ticket_json'));
        $ticket = '';

        // 如果过期了
        if (!$data || ($data && $data->expire_time < time())) {
            //获取token
            $access_token_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->appid . '&secret=' . $this->secret;
            $access_token = json_decode($this->httpGet($access_token_url));
            $token = $access_token->access_token;
            if ($token) {
                $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token={$token}";
                $res = json_decode($this->httpGet($url));
                $ticket = $res->ticket;
                if ($ticket) {
                    $temp = array(
                        'ticket'      => $res->ticket,
                        'expire_time' => time() + 7000
                    );
                    //存入缓存
                    //Cache::rm('jsapi_ticket_json');
                    Cache::set('jsapi_ticket_json', json_encode($temp), 7000);
                }
            }
        } else {
            $ticket = $data->ticket;
        }

        return $ticket;
    }


    private function createNonceStr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }

        return $str;
    }

    private function httpGet($url)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        curl_setopt($curl, CURLOPT_URL, $url);

        $res = curl_exec($curl);
        curl_close($curl);

        return $res;
    }
}