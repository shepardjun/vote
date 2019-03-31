<?php
namespace app\admin\controller;

use app\common\controller\AdminBase;
use app\common\lib\Hook;
use \think\Request;

class Contestant extends AdminBase
{
    public function _initialize()
    {
        parent::_initialize();
        $this->column_id = SITE_COLUMN_PRODUCT;
    }

    /**
     * 选手列表
     */
    public function index()
    {
        return $this->fetch();
    }

    /**
     * 选手添加
     * @return mixed
     */
    public function add()
    {
        $this->assign('pic_list', []);

        return $this->fetch();
    }

    /**
     * 选手编辑
     * @return mixed
     */
    public function edit()
    {
        $id = input('get.id');
        $pic_list = [];
        $pic_json_str = '';
        $contestant = array();

        //由ID得到选手信息
        $res = Hook::hooks(array(
            'app'    => 'vote',
            'clname' => 'VoteHook',
            'fnname' => 'get_attend_info',
            'data'   => array(
                'id' => $id
            )
        ));

        if (1 == $res['code']) {
            $pic_json_str = $res['data']['pic'].'|';
            $temp = explode(',', str_replace("'", '', $res['data']['pic']));
            $pic_list[0]['url_large'] = $temp[0];
            $pic_list[0]['url_middle'] = $temp[1];
            $pic_list[0]['url_small'] = $temp[2];
            $contestant = $res['data'];
        }

        $this->assign('pic_json_str', $pic_json_str);
        $this->assign('pic_list', $pic_list);
        $this->assign('attend_id', $id);
        $this->assign('contestant', $contestant);

        return $this->fetch('add');
    }


    /**
     * 保存
     * @return string
     */
    public function save()
    {
        $param = Request::instance()->request();
        $pic = explode('|', substr($param['pic'], 0, -1));

        //由ID得到选手信息
        $res = Hook::hooks(array(
            'app'    => 'vote',
            'clname' => 'VoteHook',
            'fnname' => 'save_attend',
            'data'   => array(
                'id'      => $param['attend_id'],
                'vote_id' => 1,
                'name'    => $param['name'],
                'desc'    => $param['desc'],
                'pic'     => end($pic)
            )
        ));

        $this->output_json(!$res['code'], $res['msg'], 0, $res['data']);
    }

    /**
     * 删除
     */
    public function delete()
    {
        $param = Request::instance()->request();

        //由ID得到选手信息
        $res = Hook::hooks(array(
            'app'    => 'vote',
            'clname' => 'VoteHook',
            'fnname' => 'del_attend',
            'data'   => array(
                'id'      => $param['id']
            )
        ));

        $this->output_json(!$res['code'], $res['msg'], 0, $res['data']);
    }

    /**
     *
     * 选手列表
     */
    public function contestant_list()
    {
        $code = 1;
        $msg = 'fail';
        $count = 0;
        $data = array();
        $param = Request::instance()->request();

        $res = Hook::hooks(array(
            'app'    => 'vote',
            'clname' => 'VoteHook',
            'fnname' => 'get_attend_list',
            'data'   => array(
                'page'    => $param['page'] ?: 1,
                'limit'   => $param['limit'] ?: 10,
                'vote_id' => isset($param['vote_id']) ? $param['vote_id'] : 1,
                'search'  => isset($param['keyword']) ? $param['keyword'] : ''
            )
        ));

        if (1 == $res['code']) {
            $code = 0;
            $msg = 'success';
            if ($res['count']) {
                foreach ($res['data'] as &$v) {
                    $temp = explode(',', str_replace("'", '', $v['pic']));
                    $v['pic'] = '<img src="'.end($temp).'" width="40" />';
                    $v['create_time'] = is_numeric($v['create_time']) ? date('Y-m-d', $v['create_time']) : $v['create_time'];
                }
                $count = $res['count'];
                $data = $res['data'];
            }
        }

        $this->output_json($code, $msg, $count, $data);
    }
}
