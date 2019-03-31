<?php

namespace app\common\controller;

use  think\Controller;

class Base extends Controller
{
    protected $request;
    protected $column_id;       //栏目ID

    /**
     * 初始化
     */
    public function _initialize()
    {
        parent::_initialize();
        $this->assign('request', $this->request);
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

    //验证码输出
    public function verify()
    {
        $captcha = new \think\captcha\Captcha();
        $captcha->fontSize = 30;
        $captcha->length = 4;
        $captcha->useNoise = false;
        // 设置验证码字符为纯数字
//        $captcha->codeSet = '0123456789';
//        $captcha->useImgBg = true;
        return $captcha->entry();
    }
}