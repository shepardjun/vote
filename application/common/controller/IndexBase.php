<?php

namespace app\common\controller;
use  think\Controller;

class IndexBase extends Base
{
    public function _initialize()
    {
        parent::_initialize();
    }

    /**
     * 前端页面json输出
     * @param int    $code
     * @param string $msg
     * @param int    $count
     * @param array  $data
     */
    public function web_output_json($code=0,$msg='',$count=0,$data=array())
    {
        if($data)
        {
            $this->output_json($code,$msg,$count,$data);
        }else{
            $this->output_json(0,'no data',0,array());
        }
    }
}
