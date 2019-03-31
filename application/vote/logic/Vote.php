<?php
/*********文件描述*********
 * @last      update 2019/3/18 15:27
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：投票操作逻辑类
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/18 15:27
 */

namespace app\vote\logic;

use app\common\lib\Hook;
use think\Cookie;
use \think\Loader;

class Vote
{
    /**
     * 获取分享数据
     *
     * 参数描述：
     *
     * 返回值：
     * @return mixed
     */
    public function get_share_info()
    {
        //公众号配置
        $account = Hook::hooks(array(
            'app'    => 'weixin',
            'clname' => 'ShareHook',
            'fnname' => 'get_sign_package'
        ));

        //分享信息配置
        $share = array(
            'share_img' => SITE_DOMAIN.'/static/images/wap/vote/share.png',
            'share_link' => SITE_DOMAIN,
            'share_desc' => '安徽广播电视台海豚成长记',
            'share_title' => '安徽广播电视台海豚成长记'
        );

        return array(
            'code' => 1,
            'msg'  => '',
            'data' => array(
                'account' => json_encode($account),
                'share'   => json_encode($share)
            )
        );
    }


    /**
     * 获取粉丝信息
     *
     * 参数描述：
     *
     * 返回值：
     * @return array
     */
    public function get_fans_info()
    {
        //获取粉丝信息
        $res = Hook::hooks(array(
            'app'    => 'fans',
            'clname' => 'OauthHook',
            'fnname' => 'get_fans_info',
            'data'   => array(
                'debug' => false
            )
        ));

        return $res;
    }

    /**
     * 获取参赛统计数据
     *
     * 参数描述：
     *
     * @param array $param vote_id     投票对应id
     *
     * 返回值：
     *
     * @return array
     */
    public function get_sum_info($param)
    {
        $code = 1;
        $msg = '暂无更多数据！';
        $data = array();
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        $count = $mdl->where('vote_id', $param['vote_id'])->where('status', 1)->count();
        $hot = $mdl->where('vote_id', $param['vote_id'])->where('status', 1)->field('SUM(hot) as num')->find();

        if ($data) {
            $msg = '获取数据成功。';
        } else {
            $code = 0;
        }

        return array(
            'code' => $code,
            'msg'  => $msg,
            'data' => array(
                'count' => (int)$count,
                'hot'   => (int)$hot['num'],
            )
        );
    }

    /**
     * 获取参赛选手列表
     *
     * 参数描述：
     *
     * @param array $param page        当前页
     * @param array $param limit       限制条数
     * @param array $param search      查询条件
     *
     * 返回值：
     *
     * @return array
     */
    public function get_attend_list($param)
    {
        $code = 1;
        $msg = '暂无更多数据！';
        $data = array();
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        $where = array(
            'status'  => 1,
            'vote_id' => $param['vote_id']
        );
        $order = isset($param['order']) ? $param['order'] : 'id ASC';
        $page = $param['page'] && $param > 0 ? $param['page'] : 1;
        $limit = $param['limit'] && $param['limit'] > 0 ? $param['limit'] : 6;
        $param['search'] && ($where['name'] = array('like', '%' . $param['search'] . '%'));
        $count = $mdl->where($where)->count();
        $total = ceil($count / $limit);

        if ($page <= $total) {
            $data = $mdl->where($where)->limit($limit)->page($page)->order($order)->select();
            if ($data) {
                $code = 1;
                $msg = '获取数据成功。';
            } else {
                $code = 0;
            }
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => $count,
            'data'  => $data
        );
    }

    /**
     * 获取参赛选手详情
     *
     * 参数描述：
     *
     * @param array $param id        指定选手id
     *
     * 返回值：
     *
     * @return array
     */
    public function get_attend_info($param)
    {
        $code = 0;
        $msg = '暂无更多数据！';
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        $data = $mdl->where('id', $param['id'])->where('status', 1)->find();

        if ($data) {
            $count = $mdl->where('hot', 'egt', $data['hot'])->count();
            $data['order'] = $count;
            $code = 1;
            $msg = '获取数据成功。';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
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
    public function save_attend_info($param)
    {
        $code = 0;
        $data = array();
        $is_update = false;
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        if ($param['name'] && $param['pic'] && $param['desc']) {
            $update = array(
                'name'    => $param['name'],
                'vote_id' => $param['vote_id'],
                'pic'     => $param['pic'],
                'desc'    => $param['desc'],
            );
            $param['id'] && ($update['id'] = $param['id']);
            $param['id'] && ($is_update = true);
            $data = $mdl->isUpdate($is_update)->save($update);
            if ($data) {
                $code = 1;
                $msg = $param['id'] ? '更新信息成功！' : '添加信息成功！';
            } else {
                $msg = $param['id'] ? '更新信息失败！' : '添加信息失败！';
            }
        } else {
            $msg = '名字照片简介必须全部填写！';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
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
    public function del_attend_info($param)
    {
        $code = 0;
        $msg = '删除失败！';
        $data = array();
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        if ($param['id']) {
            $data = $mdl->isUpdate(true)->save(array(
                'id'     => $param['id'],
                'status' => 0
            ));
            if ($data) {
                $code = 1;
                $msg = '删除成功';
            }
        } else {
            $msg = '必须传入指定数据！';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
    }

    /**
     * 获取排行列表
     *
     * 参数描述：
     *
     * @param array $param vote_id     活动id
     * @param array $param page        当前页
     * @param array $param limit       限制条数
     *
     * 返回值：
     *
     * @return array
     */
    public function get_order_list($param)
    {
        $code = 1;
        $msg = '暂无更多数据！';
        $data = array();
        $mdl = Loader::model('Attend', 'model', false, 'vote');
        $page = $param['page'] && $param > 0 ? $param['page'] : 1;
        $limit = $param['limit'] && $param['limit'] > 0 ? $param['limit'] : 6;
        $count = $mdl->where('vote_id', $param['vote_id'])->where('status', 1)->count();
        $total = ceil($count / $limit);

        if ($page <= $total) {
            $data = $mdl->where('vote_id', $param['vote_id'])->where('status', 1)->limit($limit)->page($page)->order('hot desc')->select();
            if ($data) {
                foreach ($data as $k => &$v) {
                    $v['order'] = ($page - 1) * $limit + $k + 1;
                }
                $code = 1;
                $msg = '获取数据成功。';
            } else {
                $code = 0;
            }
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => $count,
            'data'  => $data
        );
    }

    /**
     * 获取礼物列表
     *
     * 参数描述：
     *
     * @param array $param vote_id       活动id
     *
     * 返回值：
     *
     * @return array
     */
    public function get_gift_list($param)
    {
        $code = 0;
        $msg = '暂无数据！';
        $mdl = Loader::model('Gift', 'model', false, 'vote');
        $data = $mdl->where('vote_id', $param['vote_id'])->where('status', 1)->select();

        if ($data) {
            $code = 1;
            $msg = '获取数据成功。';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
    }

    /**
     * 获取购买支付信息
     *
     * @param array $param vote_id     活动id
     * @param array $param page        当前页
     * @param array $param limit       限制条数
     *
     * 返回值：
     *
     * @return array
     */
    public function get_gift_log_list($param)
    {
        $code = 1;
        $msg = '暂无更多数据！';
        $data = array();
        $mdl = Loader::model('log', 'model', false, 'vote');
        $where = array(
            'status'  => 1,
            'vote_id' => $param['vote_id']
        );
        $where = isset($param['where']) ? array_merge($param['where'],$where) : $where;
        $page = $param['page'] && $param > 0 ? $param['page'] : 1;
        $limit = $param['limit'] && $param['limit'] > 0 ? $param['limit'] : 6;
        $count = $mdl->where($where)->count();
        $total = ceil($count / $limit);

        if ($page <= $total) {
            $data = $mdl->where($where)->page($page, $limit)->select();
            if ($data) {
                $code = 1;
                $msg = '获取数据成功。';
            } else {
                $code = 0;
            }
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => $count,
            'data'  => $data
        );
    }

    /**
     * 赠送礼物日志
     *
     * 参数描述：
     *
     * @param array $param vote_id         活动id
     * @param array $param gift_id         礼物id
     * @param array $param attend_id       赠送人id
     *
     * 返回值：
     *
     * @return array
     */
    public function save_gift_log($param)
    {
        $code = 0;
        $msg = '赠送礼物失败！';
        $data = array(
            'type' => 1,
            'hot'  => 0
        );
        $send_status = $send_db_status =
        $order_info = $wechat_order = '';
        $gift_mdl = Loader::model('Gift', 'model', false, 'vote');
        $attend_mdl = Loader::model('attend', 'model', false, 'vote');
        $log_mdl = Loader::model('log', 'model', false, 'vote');
        $send_cookie = 'GIFT_SEND_STATUS_' . $param['attend_id'];

        //查询礼物信息
        $gift_info = $gift_mdl->where(array(
            'id'     => $param['gift_id'],
            'status' => 1
        ))->find();

        //查询参赛者信息
        $attend_info = $attend_mdl->where(array(
            'id'     => $param['attend_id'],
            'status' => 1
        ))->find();

        //读取粉丝信息
        $fans_info = $this->get_fans_info()['data'];

        //订单号
        $order_num = 'WX_' . substr($fans_info['openid'], -10, 10) . date('YmdHis');

        //查看礼物是否存在
        if ($gift_info) {
            if ($attend_info) {
                //是免费礼物先查一下有送过了没有
                if (0 == $gift_info['scores']) {
                    //查看当天是否已经送过
                    $send_status = Cookie::get($send_cookie);
                    $send_db_status = $log_mdl->where(array(
                        'openid'     => $fans_info['openid'],
                        'attend_id'  => $param['attend_id'],
                        'gift_price' => 0,
                        'status'     => 1
                    ))->count();
                }

                //提示当天已经不能在送免费礼物
                if (!$send_status && !$send_db_status) {
                    //需要更新的数据
                    $update_data = array(
                        'vote_id'     => $param['vote_id'],
                        'gift_id'     => $gift_info['id'],
                        'gift_name'   => $gift_info['name'],
                        'gift_price'  => $gift_info['scores'],
                        'gift_hot'    => $gift_info['hot'],
                        'attend_id'   => $attend_info['id'],
                        'attend_name' => $attend_info['name'],
                        'fans_name'   => $fans_info['nickname'],
                        'openid'      => $fans_info['openid'],
                        'order_num'   => $order_num
                    );
                    $update_data['pay_status'] = (0 == $gift_info['scores']) ? '已支付' : '待支付';
                    //添加一条订单信息
                    $order_info = $log_mdl->save($update_data);

                    if ($order_info) {
                        if ($gift_info['scores']) {
                            //微信统一下单接口
                            $wechat_order = Hook::hooks(array(
                                'app'    => 'weixin',
                                'clname' => 'WxPayHook',
                                'fnname' => 'send_order',
                                'data'   => array(
                                    'out_trade_no' => $order_num,
                                    'body'         => '投票礼物' . $gift_info['name'],
                                    'total_fee'    => $gift_info['scores'],
//                                    'total_fee'    => 0.01,
                                    'openid'       => $fans_info['openid']
                                )
                            ));
                            $wechat_order['data']['order_num'] = $order_num;
                            $code = $wechat_order['code'];
                            $msg = (1 == $wechat_order['code']) ? '' : '投票失败！';
                            $data = array(
                                'type' => 2,
                                'data' => $wechat_order['data']
                            );
                        } else {
                            //更新
                            $attend_mdl->where('id', $attend_info['id'])->setInc('hot', $gift_info['hot']);
                            $time = strtotime(date('Y-m-d') . ' 23:59:59') - time();
                            //设置今天已送指定对象礼物
                            Cookie::set($send_cookie, 1, $time);
                            $data = array(
                                'type' => 1,
                                'hot'  => $gift_info['hot']
                            );
                            $code = 1;
                            $msg = '礼物已送出,感谢参与^_^！';
                        }
                    }

                } else {
                    $code = 1;
                    $msg = '今天已送过鲜花';
                }
            } else {
                $msg = '赠送人不存在！';
            }
        } else {
            $msg = '礼物不存在！';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
    }


    /**
     * 查询订单结果并更新相应数据
     *
     * 参数描述：
     *
     * @param array $param vote_id         活动id
     * @param array $param order_num       商户订单号
     *
     * 返回值：
     *
     * @return array
     */
    public function check_gift_log($param)
    {
        $code = 0;
        $data = array(
            'type' => 1,
            'hot'  => 0
        );
        $attend_mdl = Loader::model('attend', 'model', false, 'vote');
        $log_mdl = Loader::model('log', 'model', false, 'vote');

        //查询赠送日志
        $log_info = $log_mdl->where(array(
            'order_num'      => $param['order_num'],
            'transaction_id' => array('eq', ''),
            'status'         => 1
        ))->find();

        //查看订单是否存在
        if ($log_info) {
            //微信统一下单接口
            $wechat_order = Hook::hooks(array(
                'app'    => 'weixin',
                'clname' => 'WxPayHook',
                'fnname' => 'check_order',
                'data'   => array(
                    'out_trade_no' => $param['order_num']
                )
            ));
            if (1 == $wechat_order['code']) {
                $log_mdl->isUpdate(true, ['id' => $log_info['id']])->save(array(
                    'transaction_id' => $wechat_order['data']['transaction_id'],
                    'pay_status'     => '已支付'
                ));
                //更新
                $attend_mdl->where('id', $log_info['attend_id'])->setInc('hot', $log_info['gift_hot']);
                $data = array(
                    'type' => 1,
                    'hot'  => $log_info['gift_hot']
                );
                $code = 1;
            }
            $msg = (1 == $wechat_order['code']) ? '投票成功' : '投票失败！';
        } else {
            $msg = '订单信息不存在！';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
    }


    /**
     * 微信回调支付结果
     *
     * 参数描述：
     *
     * @param array $param order_num       商户订单号
     * @param array $param transaction_id  微信订单号
     *
     * 返回值：
     *
     * @return array
     */
    public function wx_callback_gift_log($param)
    {
        $code = 0;
        $msg = '';
        $data = array(
            'type' => 1,
            'hot'  => 0
        );
        $attend_mdl = Loader::model('attend', 'model', false, 'vote');
        $log_mdl = Loader::model('log', 'model', false, 'vote');

        //查询赠送日志
        $log_info = $log_mdl->where(array(
            'order_num'      => $param['order_num'],
            'transaction_id' => array('eq', ''),
            'status'         => 1
        ))->find();

        //查看订单是否存在
        if ($log_info) {
            $log_mdl->isUpdate(true, ['id' => $log_info['id']])->save(array(
                'transaction_id' => $param['transaction_id'],
                'pay_status'     => '已支付'
            ));
            //更新
            $attend_mdl->where('id', $log_info['attend_id'])->setInc('hot', $log_info['gift_hot']);
            $data = array(
                'type' => 1,
                'hot'  => $log_info['gift_hot']
            );
            $code = 1;
        } else {
            $msg = '订单信息不存在！';
        }

        return array(
            'code'  => $code,
            'msg'   => $msg,
            'count' => 0,
            'data'  => $data
        );
    }
}