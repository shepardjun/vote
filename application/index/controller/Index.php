<?php
namespace app\index\controller;

use app\common\controller\IndexBase;
use think\Controller;
use think\Cache;

class Index  extends IndexBase
{

    public function _initialize()
    {
        parent::_initialize();
        $this->column_id = SITE_COLUMN_INDEX;
//        $this->assign('action_name', pathinfo($this->request->baseUrl(),PATHINFO_FILENAME));
        $route = request()->routeInfo();
        $rule = $route ? $route['rule'] : array('');
        $this->assign('rule_name',$rule[0]);
		$this->assign('version', Cache::get('theme')['version'] ?: 0);
    }

    public function index()
    {
	 return $this->fetch(':index');
    }

    /**
     * 该栏目banner
     */
    public function index_banner()
    {
        $pic_service = \think\Loader::model('Pic','service');
        $pics = $pic_service->getBanner($this->column_id);
        $this->web_output_json(1,'success',count($pics),$pics);
    }
/*
 * 验证码
 * */
    public function verifys()
    {
        return $this->verify();
    }
}
