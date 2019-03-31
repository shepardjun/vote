<?php
/*********文件描述*********
 * @last      update 2019/3/18 16:25
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：手机端公共基类
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/18 16:25
 */

namespace app\common\controller;

use  think\Controller;

class WapBase extends Base
{
    public function _initialize()
    {
        parent::_initialize();

        $this->set_const();
    }

    /**
     * 设置手机端常用常量
     *
     * 参数描述：
     *
     * 返回值：
     * @return mixed
     */
    protected function set_const()
    {
        $this->assign('w_css', '/static/css/wap');
        $this->assign('w_js', '/static/js/wap');
        $this->assign('w_img', '/static/images/wap');
        $this->assign('wp_css', '/static/css/wap/public');
        $this->assign('wp_js', '/static/js/wap/public');
        $this->assign('wp_img', '/static/images/wap/public');
    }
}
