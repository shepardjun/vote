<?php
/*********文件描述*********
 * @last update 2019/3/18 11:38
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：管理后台公共基类
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/18 11:38
 */
namespace app\common\controller;

use think\Controller;
use think\Session;

class AdminBase extends Base
{
    protected $login_user;

    public function _initialize()
    {
        parent::_initialize();

        $login_session = Session::get('administrator', 'admin');

        if (!$login_session) {
            $this->redirect('/admin/login/index');
        }
        $this->login_user = json_decode($login_session);
        $this->assign('administrator', $this->login_user);
    }
}
