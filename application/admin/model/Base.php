<?php
/*********�ļ�����*********
 * @last update 2019/3/15 18:55
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * ���ܼ�飺����mdl
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/15 18:55 1.0.0
 */
namespace app\admin\model;

use think\Model;

class Base extends Model
{
    protected $connection = 'user_config';

    protected $pk = 'id';

    //�����Զ�д��ʱ���
    protected $autoWriteTimestamp = true;

    //����������Щ����Ҫ�����µ��ֶΡ�
    protected $readonly = ['id','create_time'];
}