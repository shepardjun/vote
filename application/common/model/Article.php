<?php
/**
 * Created by PhpStorm.
 * User: zyp
 * Date: 18-11-1
 * Time: 下午2:07
 */
namespace app\common\model;
use think\Model;
class Article extends Model
{
    protected $name = 'article';

    protected $pk = 'id';

    //开启自动写入时间戳
    protected $autoWriteTimestamp = true;

    //用来保护那些不许要被更新的字段。
    protected $readonly = ['create_time'];
}