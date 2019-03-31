<?php
namespace app\admin\controller;

use app\common\controller\AdminBase;
use think\Loader;

class User extends AdminBase
{
    protected $administrator_logic;

    public function _initialize()
    {
        parent::_initialize();
        $this->administrator_logic = Loader::model('Administrator','logic');
    }

    /**
     * 添加管理员用户
     * @return mixed
     */
	public function add()
	{
		return $this->fetch();

	}

    /**
     * 管理员用户列表
     * @return mixed
     */
    public function index()
    {
        return $this->fetch();
    }

    /**
     * 用户列表数据
     */
    public function user_list()
    {
        $users = $this->administrator_logic->user_list();
        $this->output_json(0,'success',count($users),$users);
    }

    /**
     * 删除用户
     */
    public function delete()
    {
        $id = input('post.id');
        $res = $this->administrator_logic->delete($id);
        if($res)
        {
            $this->output_json(0,'success');
        }else{
            $this->output_json(1,'failure');
        }
    }

    /**
     * 资料修改
     * @return mixed
     */
    public function info()
    {
        $id = input('get.id');
        if(!$id)
        {
            $id = $this->login_user->id;
            if(!$id)
            {
                $this->redirect('/admin/index/login');
            }
        }
        $user_info = $this->administrator_logic->user_info($id);
        $this->assign('user_info',$user_info);
        return $this->fetch();
    }

    /**
     * 超级管理员重置密码
     * @return mixed
     */
    public function reset()
    {
        $id = input('get.id');
        $user_info = $this->administrator_logic->user_info($id);
        $this->assign('user_info',$user_info);
        return $this->fetch();
    }

    /**
     *
     * 保存密码
     */
    public function reset_password()
    {
        $pwd = input('post.pwd');
        $pwd2 = input('post.pwd2');
        $id = input('post.id');
        if($pwd != $pwd2)
            $this->output_json(3,'两次密码不一致');
        $data['pwd'] = $pwd;
        $data['id'] = $id;
        $res = $this->administrator_logic->save_password($data);
        if($res)
        {
            $this->output_json(1,'success');
        }else{
            $this->output_json(0,'保存失败');
        }
    }

    /**
     * 保存用户
     */
    public function save()
    {
        //保存逻辑
        $username = input('post.username');
        $pwd = input('post.pwd');
        $pwd2 = input('post.pwd2');
        if(!$username)
            $this->output_json(2,'用户名不能为空');

        if($pwd != $pwd2)
            $this->output_json(3,'两次密码不一致');
        $realname = input('post.realname');
        $email = input('post.email');
        $phone = input('post.phone');
        $memo = input('post.memo');
        $data = array(
            'login_name' => $username,
            'password'  => $pwd,
            'real_name'  => $realname,
            'email'     => $email,
            'phone'     => $phone,
            'memo'      => $memo
        );
        $res = $this->administrator_logic->add($data);
        if($res)
        {
            $this->output_json(1,'success');
        }else{
            $this->output_json(0,'保存失败或用户已存在');
        }
    }


    /**
     * 用户信息保存
     */
    public function save_userinfo()
    {
        if($this->login_user)
        {
            $id = $this->login_user->id;
        }else{
            $this->redirect('/admin/login/index');
        }

        $realname = input('post.realname');
        $email = input('post.email');
        $phone = input('post.phone');
        $memo = input('post.memo');
        $data = array(
            'id' => $id,
            'real_name'  => $realname,
            'email'     => $email,
            'phone'     => $phone,
            'memo'      => $memo
        );
        $res = $this->administrator_logic->save_userinfo($data);
        if($res)
        {
            $this->output_json(1,'success');
        }else{
            $this->output_json(0,'保存失败');
        }
    }

    /**
     * 安全设置
     * @return mixed
     */
    public function security()
    {
        $id = input('get.id');
        if($this->login_user)
        {
            $id = $this->login_user->id;
        }else{
            $this->redirect('/admin/login/index');
        }
        $user_info = $this->administrator_logic->user_info($id);

        $this->assign('user_info',$user_info);
        return $this->fetch();
    }


    /**
     * 用户修改密码
     */
    public function user_reset_password()
    {
        $id = input('post.id');
        $old_password = input('post.old_pwd');
        $pwd = input('post.pwd');
        $user = $this->administrator_logic->user_info($id);

        if($user)
        {
            if($user->password != $this->administrator_logic->getMd5Password($old_password)){
                $this->output_json(1,'原密码不正确');
                exit;
            }

            $params = array(
                'old_password' => $old_password,
                'password'  => $pwd,
                'id'    => $id
            );
            $res = $this->administrator_logic->change_password($params);
            if($res)
            {
                $this->output_json(0,'密码修改成功');
            }else{
                $this->output_json(2,'密码修改失败');
            }
        }
        $this->output_json(3,'操作不正确');
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
        $validate_code = input('post.validate_code');

        if(!$login_name || !$password || !$validate_code)
        {
            $this->output_json(1,'必填项未填写完整');
        }
        $res = $this->administrator_logic->login_validate_user($login_name,$password,$validate_code);
        if($res){
            $this->output_json(0,'success');
        }else{
            $this->output_json(1,'error');
        }
    }
}
