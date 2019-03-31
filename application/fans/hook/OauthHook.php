<?php
/*********文件描述*********
 * @last      update 2019/3/22 9:53
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：微信粉丝授权
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 9:53
 */
namespace app\fans\hook;

use think\Url;
use think\Cookie;

class OauthHook
{
    /**
     * 获取粉丝信息
     *
     * 参数描述：
     *
     * @param array $param string debug    电脑端测试使用
     *
     * 返回值：
     *
     * @return mixed
     */
    public function get_fans_info($param)
    {
        $code = 0;
        $msg = '获取粉丝信息失败！';

        //假数据操作
        if (isset($param['debug']) && $param['debug'])
            return $this->_set_moni_fans();

        $fans_info = Cookie::get('WX_UF');
        $fans_info = unserialize(base64_decode($fans_info));

        if ($fans_info) {
            $code = 1;
            $msg = '读取cookie中的粉丝信息成功';

        }else{
            //创建需要跳转的地址
            $url = Url::build('/weixin/Wap_Oauth/index', [
                'redirect' => base64_encode(SITE_DOMAIN . $_SERVER['REQUEST_URI'])
            ], false);
            //跳转到授权页面
            redirect($url)->send();
        }

        return array(
            'code' => $code,
            'msg'  => $msg,
            'data' => $fans_info,
        );
    }


    /**
     * 模拟设置粉丝数据
     *
     * 参数描述：
     *
     * @param array
     *
     * 返回值：
     *
     * @return mixed
     */
    private function _set_moni_fans()
    {
        return array(
            'status' => 1,
            'data'   => array(
                'openid'     => 'oQESTt8aI9bqO7f1G3DB1hGASOvM',
                'nickname'   => '兜兜里有猫',
                'headimgurl' => 'http://wx.qlogo.cn/mmopen/Ts2bSPK1wzhL05Fnmmt1w8Zzt6tibx5PY85xq2DxtEib7zdjh8mNUjIDqIqaxdEYVE217ic4tSO5WZgf6cGfcMUT1spQJsXPA5d/0',
                'subscribe'  => 1,
            )
        );
    }
}