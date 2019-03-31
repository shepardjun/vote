<?php
/*********文件描述*********
 * @last      update 2019/3/15 18:55
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * 功能简介：基类mdl
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/15 18:55 1.0.0
 */
namespace app\vote\model;

use think\Model;

class Base extends Model
{
    protected $connection = 'vote_config';

    protected $pk = 'id';

    protected $autoWriteTimestamp = 'datetime';

    //用来保护那些不许要被更新的字段。
    protected $readonly = ['id','create_time'];
}