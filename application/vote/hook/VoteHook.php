<?php
/*********文件描述*********
 * @last      update 2019/3/18 15:27
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：调用应用中的方法
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/18 15:27
 */

namespace app\vote\hook;

use \think\Loader;

class VoteHook
{
    protected $operate;

    function __construct()
    {
        $this->operate = Loader::model('Vote', 'logic', false, 'vote');
    }

    /**
     * 获取参赛选手列表
     *
     * 参数描述：
     *
     * @param array $param vote_id     活动id
     * @param array $param page        当前页
     * @param array $param limit       限制条数
     * @param array $param search      查询条件
     *
     * 返回值：
     *
     * @return array
     */
    public function get_attend_list(array $param)
    {
        return $this->operate->get_attend_list($param);
    }


    /**
     * 获取参赛选手详情数据
     *
     * 参数描述：
     *
     * @param array $param id          制定选手id
     *
     * 返回值：
     *
     * @return array
     */
    public function get_attend_info(array $param)
    {
        return $this->operate->get_attend_info($param);
    }

    /**
     * 保存参赛选手
     *
     * 参数描述：
     *
     * @param array $param id          选手id
     * @param array $param name        姓名
     * @param array $param pic         照片
     * @param array $param desc        简介
     *
     * 返回值：
     *
     * @return array
     */
    public function save_attend(array $param)
    {
        return $this->operate->save_attend_info($param);
    }


    /**
     * 删除参赛选手
     *
     * 参数描述：
     *
     * @param array $param id          选手id
     *
     * 返回值：
     *
     * @return array
     */
    public function del_attend(array $param)
    {
        return $this->operate->del_attend_info($param);
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
     * @return array
     */
    public function get_order_list(array $param)
    {
        return $this->operate->get_order_list($param);
    }

    /**
     * 获取购买支付信息
     *
     * 参数描述：
     *
     * @param array vote_id     活动id
     * @param array page        当前页
     * @param array limit       限制条数
     *
     * 返回值：
     *
     * @return array
     */
    public function get_gift_log_list(array $param)
    {
        return $this->operate->get_gift_log_list($param);
    }

    /**
     * 微信回调支付结果
     *
     * 参数描述：
     *
     * @param array order_num       商户订单号
     * @param array transaction_id  微信订单号
     *
     * 返回值：
     *
     * @return array
     */
    public function wx_callback_gift_log(array $param)
    {
        return $this->operate->wx_callback_gift_log($param);
    }
}