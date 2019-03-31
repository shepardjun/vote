<?php
namespace app\admin\logic;

use think\Session;
use think\Loader;

class Administrator
{
    protected $administrator_model;

    public function __construct()
    {
        $this->administrator_model = Loader::model('Administrator', 'model', false, 'admin');
    }


    /**
     * 添加普通管理员
     *
     * @param array $params
     *
     * @return bool
     */
    public function add($params = array())
    {
        if (isset($params['login_name']) && isset($params['password'])) {
            if ($params['login_name'] && $params['password']) {
                $map['login_name'] = array('eq', $params['login_name']);
                $map['status'] = array('eq', 1);
                $login_name = $this->administrator_model->where($map)->select();
                if ($login_name)
                    return false;

                $data = array(
                    'login_name' => $params['login_name'],
                    'real_name'  => isset($params['real_name']) ? $params['real_name'] : '',
                    'password'   => $this->getMd5Password($params['password']),
                    'email'      => isset($params['email']) ? $params['email'] : '',
                    'phone'      => isset($params['phone']) ? $params['phone'] : '',
                    'memo'       => isset($params['memo']) ? $params['memo'] : '',
                    'type'       => 2
                );
                $res = $this->administrator_model->save($data);
                if ($res)
                    return $this->administrator_model->id;
            }

            return false;
        } else {
            return false;
        }
    }


    /**
     * 管理员列表
     * @return mixed
     */
    public function user_list()
    {
        $map['status'] = array('eq', 1);
        $map['type'] = array('eq', 2);
        $users = $this->administrator_model->where($map)->select();
        $administrators = array();
        if ($users) {
            foreach ($users as $user) {
                $administrators[] = array(
                    'id'          => $user->id,
                    'login_name'  => $user->login_name,
                    'real_name'   => $user->real_name,
                    'email'       => $user->email,
                    'phone'       => $user->phone,
                    'memo'        => $user->memo,
                    'type'        => $user->type == 1 ? '超级管理员' : '普通管理员',
                    'create_time' => $user->create_time,
                    'update_time' => $user->update_time,
                    'status'      => $user->status == -1 ? '删除' : ''
                );
            }
        }

        return $administrators;
    }

    /**
     * 保存用户信息
     *
     * @param array $params
     *
     * @return bool
     */
    public function save_userinfo($params = array())
    {
        $this->user_id_must_exist($params);
        $data = array();
        if (isset($params['real_name']))
            $data['real_name'] = $params['real_name'];
        if (isset($params['email']))
            $data['email'] = $params['email'];
        if (isset($params['phone']))
            $data['phone'] = $params['phone'];
        if (isset($params['memo']))
            $data['memo'] = $params['memo'];

        $res = $this->administrator_model->save($data, ['id' => $params['id']]);

        return $res ? true : false;
    }


    /**
     * 保存密码
     *
     * @param array $params
     *
     * @return bool
     */
    public function save_password($params = array())
    {
        $this->user_id_must_exist($params);
        $data = array();
        $res = false;
        if (isset($params['pwd'])) {
            $data['password'] = $this->getMd5Password($params['pwd']);
            $res = $this->administrator_model->save($data, ['id' => $params['id']]);
        }

        return $res ? true : false;
    }

    /**
     * 管理员信息
     *
     * @param int $id
     *
     * @return array
     */
    public function user_info($id = 0)
    {
        $user_info = array();
        if ($id) {
            $map['id'] = array('eq', $id);
            $map['status'] = array('eq', 1);
            $user_info = $this->administrator_model->where($map)->find();
        }

        return $user_info;
    }


    /**
     * 修改密码
     *
     * @param array $params
     *
     * @return bool
     */
    public function change_password($params = array())
    {
        $this->user_id_must_exist($params);
        if (isset($params['old_password']) && isset($params['password'])) {
            if ($params['old_password'] && $params['password']) {
                $password = $this->administrator_model->where(array(
                    'id'     => $params['id'],
                    'status' => 1
                ))->find();
                $params['password'] = $this->getMd5Password($params['password']);
                $params['old_password'] = $this->getMd5Password($params['old_password']);
                if ($params['old_password'] == $password['password']) {
                    $res = $this->administrator_model->isUpdate(true, ['id' => $params['id']])->save(['password' => $params['password']]);

                    return $res ? true : false;
                }

                return false;
            }

            return false;
        }

        return false;
    }

    /**
     * 私有方法，用户修改参数必须有用户ID，否则不操作
     *
     * @param array $params
     *
     * @return bool
     */
    private function user_id_must_exist($params = array())
    {
        if (!$params || !isset($params['id'])) {
            return false;
        }
        if (!$params['id']) {
            return false;
        }
    }

    /**
     * 登录验证
     *
     * @param        $user
     * @param        $password
     * @param string $validate_code
     *
     * @return bool
     */
    public function login_validate_user($user, $password, $validate_code = '')
    {
//        echo $validate_code;
//        var_dump($this->validate_code($validate_code));
//        if(!$this->validate_code($validate_code))
//        {
//            return false;
//        }
        if (!$user || !$password) {
            return false;
        }

        $map['login_name'] = array('eq', $user);
        $map['password'] = array('eq', $this->getMd5Password($password));
        $map['status'] = array('eq', 1);
        $res = $this->administrator_model->where($map)->find();

        if ($res) {
            Session::set('administrator', json_encode($res), 'admin');

            return true;
        }

        return false;
    }


    /**
     * 获取加密密码
     *
     * 参数描述：
     *
     * @param array $password 明文密码
     *
     * 返回值：
     *
     * @return mixed
     */
    public function getMd5Password($password)
    {
        return md5('iru345@35!_' . $password . '_qweh!');
    }

    /**
     * 是否存在登录session
     * @return mixed
     */
    public function validate_session()
    {
        return Session::get('administrator', 'admin');
    }

    /**
     * 验证码验证逻辑
     * @return bool
     */
    private function validate_code($code = '')
    {
        if ($code) {
            return captcha_check($code);
        }

        return false;
    }
}
