<?php
namespace app\common\service;

use think\Model;

/**
 * 各模块共用Pic
 * @package app\common\service
 */
class Pic extends Model
{

    protected $pic_model;

    protected function initialize()
    {
        parent::initialize();
        $this->pic_model = \think\Loader::model('Pic');
    }

    /**
     * 添加单个图片
     * @param array $data
     *
     * @return bool
     */
    public function add($data=array())
    {
        if(!$data) return false;
        $res = $this->pic_model->data($data)->allowField(true)->save();
        if($res)
        {
            return $this->pic_model->id;
        }else{
            return false;
        }
    }


    /**
     * 批量添加多图片
     * @param array $data 二维数组
     *
     * @return bool
     */
    public function addList($data=array())
    {
        if(!$data) return false;
        $res = $this->pic_model->saveAll($data);
        return $res;
    }


    /**
     * 单图片更新
     * @param int   $id
     * @param array $data
     *
     * @return bool
     */
    public function updateById($id=0,$data=array())
    {
        if(!($id || $data)) return false;
        $res = $this->pic_model->save($data,['id'=>$id]);
        return $res ? true : false;
    }

    /**
     * 根据内容ID，批量更新多图片（采用先删除再添加的方式）
     * @param int   $content_id
     * @param array $data
     *
     * @return bool
     */
    public function updateByContentId($content_id=0,$data=array())
    {
        if(!($content_id || $data)) return false;
        //删除已有图片
        $this->pic_model->save(['status'=>-1],['content_id'=>$content_id]);
        //添加列表
        //$data['content_id'] = $content_id;
        $res = $this->pic_model->isUpdate(false)->saveAll($data);
        return $res ? true : false;
    }

    /**
     * 根据ID查一条
     * @param int $id
     *
     * @return bool
     */
    public function findById($id=0)
    {
        if(!$id) return false;
        $res = $this->pic_model->where('id',$id)->where('status',1)->find();
        return $res ? $res : false;
    }


    /**
     * 根据栏目ID查图片列表
     * @param int $column_id
     *
     * @return bool
     */
    public function selectByColumId($column_id=0)
    {
        if(!$column_id) return false;

        $res = $this->pic_model->where('column_id',$column_id)->where('status',1)->select();

        return $res ? $res : false;
    }

    /**
     * 获取banner列表
     * @param int $type
     *
     * @return bool
     */
    public function getBannerList($type=0,$column_id=0)
    {
        if(!$type) return false;
        $map['type'] = array('eq',$type);
        $map['content_id'] = array('eq',0);
        $map['status'] = array('eq',1);
        $res = $this->pic_model->where($map)->select();
        if($column_id!=0){
            foreach ($res as $key => $val){
                $arr = explode(',',$val['column_id']);
                if(in_array($column_id,$arr)){
                    $res[$key] = $val;
                    continue;
                }else{
                    unset($res[$key]);
                }
            }
        }
        array_multisort($res);
        return $res ? $res : false;
    }
    /**
     * 获取banner,轮播图
     * @param int $column_id
     *
     * @return bool
     */
    public function getBanner($column_id=0)
    {
        if(!$column_id) return false;
        $map['column_id'] = array('eq',$column_id);
        $map['content_id'] = array('eq',0);
        $map['status'] = array('eq',1);
        $res = $this->pic_model->where($map)->select();
        return $res ? $res : false;
    }

    /**
     * 栏目图片的记录条数
     * @param int $column_id
     *
     * @return int
     */
    public function countByColumId($column_id=0)
    {
        if(!$column_id) return 0;
        $res = $this->pic_model->where('column_id',$column_id)->where('status',1)->count();
        return $res ? $res : 0;
    }

    /**
     * 单条内容的图片
     * @param int $content_id
     *
     * @return bool
     */
    public function selectByContentId($content_id=0)
    {
       if(!$content_id) return false;
       $res = $this->pic_model->where('content_id',$content_id)->where('status',1)->select();
        return $res ? $res : false;
    }

    /**
     * 单条内容图片数
     * @param int $content_id
     *
     * @return int
     */
    public function countByContentId($content_id=0)
    {
        if(!$content_id) return 0;
        $res = $this->pic_model->where('content_id',$content_id)->where('status',1)->count();
        return $res ? $res : 0;
    }

    /**
     * 删除单个图片
     * @param int $id
     *
     * @return bool
     */
    public function delById($id=0)
    {
        if(!$id) return false;
        $res = $this->pic_model->save(['status'=>-1],['id'=>$id]);
        return $res ? true : false;
    }

    /**
     * 删除内容图片
     * @param int $content_id
     *
     * @return bool
     */
    public function delByContentId($content_id=0)
    {
        if(!$content_id) return false;
        $res = $this->pic_model->save(['status'=>-1],['content_id'=>$content_id]);
        return $res ? true : false;
    }

    /**
     * 删除栏目图片
     * @param int $column_id
     *
     * @return bool
     */
    public function delByColumnId($column_id=0)
    {
        if(!$column_id) return false;
        $res = $this->pic_model->where('column_id',$column_id)->save(['status'=>-1]);
        return $res ? true : false;
    }

}
