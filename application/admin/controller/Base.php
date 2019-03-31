<?php
/*********ÎÄ¼þÃèÊö*********
 * @last update 2019/3/15 20:28
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * ¹¦ÄÜ¼ò½é£º¹ÜÀíºóÌ¨»ùÀà
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/15 20:28 1.0.0
 */
namespace app\admin\controller;
use app\common\controller\AdminBase;
use think\Controller;

class Base extends AdminBase
{
    protected $request;

    function _initialize()
    {
        parent::_initialize();
        $this->assign('request',$this->request);
    }

    protected function response(){

    }
}