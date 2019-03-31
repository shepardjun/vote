<?php
namespace app\admin\controller;

use app\common\controller\AdminBase;
use app\common\lib\Hook;
use \think\Request;

class Popularity extends AdminBase
{

    public function _initialize()
    {
        parent::_initialize();

    }

    /**
     * 人气列表
     * 由高入低排序
     */
    public function index()
    {
        return $this->fetch();
    }


    /**
     *
     *
     */
    public function popularity_list()
    {
        $code = 1;
        $msg = 'fail';
        $count = 0;
        $data = array();
        $param = Request::instance()->request();

        $res = Hook::hooks(array(
            'app'    => 'vote',
            'clname' => 'VoteHook',
            'fnname' => 'get_order_list',
            'data'   => array(
                'page'    => $param['page'] ?: 1,
                'limit'   => $param['limit'] ?: 10,
                'vote_id' => isset($param['vote_id']) ? $param['vote_id'] : 1
            )
        ));

        if (1 == $res['code']) {
            $code = 0;
            $msg = 'success';
            if ($res['count']) {
                $count = $res['count'];
                $data = $res['data'];
            }
        }

        $this->output_json($code, $msg, $count, $data);
    }
}
