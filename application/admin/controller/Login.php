<?php
namespace app\admin\controller;

use think\Session;

class Login extends LoginBase
{

    protected $administrator_logic;

    public function _initialize()
    {
        parent::_initialize();
        $this->administrator_logic = \think\Loader::model('Administrator','logic');
    }

    /**
     * 用户登录
     * @return string
     */
    public function index()
    {
        return $this->fetch();
    }

    /**
     * 退出
     * @return string
     */
    public function logout()
    {
        Session::set('administrator',NULL,'admin');
        $this->redirect('/admin/login/index');
    }

    public function login_do()
    {
        $login_session = $this->administrator_logic->validate_session();
        if($login_session)
        {
            $this->output_json(0,'success');
        }
        $login_name = input('post.login_name');
        $password = input('post.pwd');
//        $validate_code = input('post.validate_code');

        if(!$login_name || !$password)
        {
            $this->output_json(1,'必填项未填写完整');
        }
        $res = $this->administrator_logic->login_validate_user($login_name,$password);
        if($res){
            $this->output_json(0,'success');
        }else{
            $this->output_json(1,'登录失败');
        }
    }
}
