<?php
namespace app\admin\controller;

use app\common\controller\AdminBase;
use think\Controller;
use think\Session;

class Index extends AdminBase
{
    protected $request;

    public function _initialize()
    {
        parent::_initialize();
        $this->assign('request',$this->request);
    }


    public function index()
    {
        return $this->fetch();
    }
}
