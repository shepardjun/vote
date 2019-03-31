<?php
/*********文件描述*********
 * @last      update 2019/3/18 16:24
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：投票手机端展示页面
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/18 16:24
 */
namespace app\vote\controller;

use app\common\controller\WapBase;
use think\Controller;
use think\Cache;
use think\Request;
use think\Loader;

class Index extends WapBase
{
    protected $operate;

    public function _initialize()
    {
        parent::_initialize();
        $this->operate = Loader::model('Vote', 'logic', false, 'vote');
    }


    /**
     * 首页展示
     *
     * 参数描述：
     *
     * @param array
     *
     * 返回值：
     *
     * @return mixed
     */
    public function index()
    {
        $vote_id = input('?get.vote_id') ? Request::get('vote_id') : 1;

        //获取粉丝信息
        $fans_info = array('data'=>array());
        $fans_info = $this->operate->get_fans_info();

        //活动信息
        $sum = $this->operate->get_sum_info(array(
            'vote_id' => $vote_id
        ));

        //礼物配置信息
        $gift = $this->operate->get_gift_list(array(
            'vote_id' => $vote_id
        ));

        //获取分享信息
        $share = $this->operate->get_share_info();

        $this->assign('share', $share['data']);
        $this->assign('fans', json_encode($fans_info['data']));
        $this->assign('sum', $sum['data']);
        $this->assign('gift', $gift['data']);

        return $this->fetch(':index');
    }

    /**
     * 删除缓存
     *
     * 参数描述：
     * @param
     *
     * 返回值：
     * @return mixed
     */
    public function del_ticket()
    {
        Cache::rm('jsapi_ticket_json');
        $this->output_json(1, '缓存已删除');
    }

    /**
     * 获取参赛选手列表数据
     *
     * 参数描述：
     *
     * @param array vote_id     活动id
     * @param array page        当前页
     * @param array limit       限制条数
     * @param array search      查询条件
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_get_attend_list()
    {
        $param = Request::instance()->post();

        $data = $this->operate->get_attend_list(array(
            'page'    => $param['page'] ?: 1,
            'limit'   => isset($param['limit']) ? $param['limit'] : 8,
            'vote_id' => isset($param['vote_id']) ? $param['vote_id'] : 1,
            'order'   => 'hot DESC',
            'search'  => $param['search']
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }

    /**
     * 获取参赛选手排行列表数据
     *
     * 参数描述：
     *
     * @param array vote_id     活动id
     * @param array page        当前页
     * @param array limit       限制条数
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_get_order_list()
    {
        $param = Request::instance()->post();

        $data = $this->operate->get_order_list(array(
            'page'    => $param['page'] ?: 1,
            'limit'   => isset($param['limit']) ? $param['limit'] : 8,
            'vote_id' => isset($param['vote_id']) ? $param['vote_id'] : 1,
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }

    /**
     * 获取参赛选手详情数据
     *
     * 参数描述：
     *
     * @param array id          制定选手id
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_get_attend_info()
    {
        $param = Request::instance()->post();

        $data = $this->operate->get_attend_info(array(
            'id' => $param['id'],
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }

    /**
     * 获取礼物列表数据
     *
     * 参数描述：
     *
     * @param array vote_id     活动id
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_get_gift_list()
    {
        $param = Request::instance()->post();

        $data = $this->operate->get_gift_list(array(
            'vote_id' => isset($param['vote_id']) ? $param['vote_id'] : 1,
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }


    /**
     * 保存赠送的礼物日志
     *
     * 参数描述：
     *
     * @param array vote_id         活动id
     * @param array gift_id         礼物id
     * @param array attend_id       赠送人id
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_send_gift_log()
    {
        $param = Request::instance()->post();

        $data = $this->operate->save_gift_log(array(
            'vote_id'   => isset($param['vote_id']) ? $param['vote_id'] : 1,
            'gift_id'   => $param['gift_id'],
            'attend_id' => $param['attend_id']
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }


    /**
     * 查询礼物购买结果
     *
     * 参数描述：
     *
     * @param array vote_id         活动id
     * @param array order_num       商户订单号
     *
     * 返回值：
     *
     * @return json
     */
    public function ajax_check_gift_log()
    {
        $param = Request::instance()->post();

        $data = $this->operate->check_gift_log(array(
            'vote_id'   => isset($param['vote_id']) ? $param['vote_id'] : 1,
            'order_num' => $param['order_num'],
//            'order_num' => 'WX_vQtBC8uI8E20190323002241'
        ));

        $this->output_json($data['code'], $data['msg'], $data['count'], $data['data']);
    }
}
