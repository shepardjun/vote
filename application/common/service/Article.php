<?php
namespace app\common\service;

use think\Model;

/**
 * 各模块共用Article
 * @package app\common\service
 */
class Article extends Model
{
    protected $article_model;


    //自定义初始化
    protected function initialize()
    {
        //需要调用`Model`的`initialize`方法
        parent::initialize();
        $this->article_model = \think\Loader::model('Article');
    }

    /**
     * @param $data，组数，写入的字段名为key，值为value
     *
     * @return mixed
     */
    public function add($data)
    {

        $this->article_model->data($data);
        $res = $this->article_model->allowField(true)->save();
        if($res)
        {
            return $this->article_model->id;
        }else{
            return false;
        }
    }

    /**
     *
     * @param $where array
     * @param $data array
     *
     * @return mixed
     */
    public function updateById($id=0,$data=array())
    {
        if($id && $data)
        $res = $this->article_model->save($data,['id'=>$id]);
        return $res ? true : false;
    }

    /**
     * 根据ID删除一条
     * @param $id
     *
     * @return bool
     */
    public function del($id)
    {
        if(!$id)
        {
            return false;
        }
        $res = $this->article_model->save(['status'=>-1],['id'=>$id]);
        if($res)
        {
            return true;
        }else{
            return false;
        }
    }

    /**
     * 根据ID查询
     * @param $id
     *
     * @return null|static
     */
    public function selectById($id=0)
    {
        $article = \app\common\model\Article::get($id);
        if($article)
        {
            $pic_service = \think\Loader::model('Pic','service');
            $pics = $pic_service->selectByContentId($article->id);
            $article->pics = $pics ? $pics : array();
        }
        return $article ? $article : null;
    }

    /**
     * 关于我们，公司简介，组织结构等栏目只有一篇文章内容,可有图
     * @param int    $column_id
     * @param string $fields
     *
     * @return null
     */
    public function oneRecordByColumnId($column_id=0,$fields='*')
    {
        $map['column_id'] = array('eq',$column_id);
        $map['status'] = array('eq',1);
        $article = $this->article_model->where($map)->field($fields)->find();
        if(count($article)==1)
        {
            $pic_service = \think\Loader::model('Pic','service');
            $pics = $pic_service->selectByContentId($article->id);
            $article->pics = $pics ? $pics : array();
        }
        return $article ? $article : null;
    }

    /**
     * 根据条件查询，条件为数组
     * @param array $params
     *
     * @return mixed
     */
    public function multiRecordsByCondition($params=array())
    {
        $condition = $this->getParams($params);
        $offset = $condition['offset'];
        $num = $condition['num'];
        $articles = $this->article_model->where($condition['where'])->field($condition['fields'])->order($condition['order'])->limit("$offset,$num")->select();
        if($articles)
        {
            foreach($articles as $article){
                $pic_service = \think\Loader::model('Pic','service');
                $pics = $pic_service->selectByContentId($article->id);
                $article->pics = $pics ? $pics : array();
            }
        }
        return $articles;

    }

    /**
     * 符合条件的总记录数
     * @param array $params
     *
     * @return int
     */
    public function countByCondition($params=array())
    {
        $condition = $this->getParams($params);
        $count = $this->article_model->where($condition['where'])->count();
        return $count ? $count : 0;
    }

    /**
     * 统一处理条件参数
     * @param array $params
     *
     * @return array
     */
    private function getParams($params=array())
    {
        $where = isset($params['where']) ? $params['where'] : array();
        $where['status']=1;

        $kw = isset($params['keyword']) ? $params['keyword'] : '';
        $whereOr = array();
        if($kw)
        {
            $where['title|content|summary'] = array('like','%' . $kw . '%');
        }

        $id = isset($params['id']) ? $params['id'] : 0;
        if($id)
        {
            $where['id'] = $id;
        }

        $column_id = isset($params['column_id']) ? $params['column_id'] : 0;

        if($column_id)
        {
            $where['column_id'] = $column_id;
        }

        $category_id = isset($params['category_id']) ? $params['category_id'] : 0;
        if($category_id)
        {
            $where['category_id'] = $category_id;
        }

        $order = isset($params['order']) ? $params['order'] : '';
        $page = isset($params['page']) ? $params['page'] : 0;
        $num = isset($params['num']) ? $params['num'] : 0;
        $fields = isset($params['fields']) ? $params['fields'] : '*';

        if(!$order)
        {
            $order = 'id desc';
        }
        if(!$page)
            $page = 1;
        if(!$num)
            $num = 1000;

        $offset = ($page-1) * $num;

        return array(
            'where' => $where,
            'order' => $order,
            'page'  => $page,
            'num'   => $num,
            'offset'=> $offset,
            'fields'=> $fields,
            'whereOr'=> $whereOr
        );
    }


    /**
     * 随机取不包含当前ID的记录
     * @param array $params
     *
     * @return array
     */
    public function article_recommend($params=array())
    {
        $condition = $this->getParams($params);
        $articles = $this->article_model->where($condition['where'])->select();
        if($articles)
        {
            foreach($articles as $article){
                $pic_service = \think\Loader::model('Pic','service');
                $pics = $pic_service->selectByContentId($article->id);
                $article->pics = $pics ? $pics : array();
            }
        }
        $num = 0;
        $article_recommend = array();
        if(count($articles) <= $condition['num'])
        {
            $article_recommend = $articles;
        }else{
            foreach($articles as $article)
            {
                $rand = rand(0,1);
                if($rand)
                {
                    $article_recommend[] = $article;
                }
                $num ++;
                if($num>$condition['num'])
                {
                    break;
                }
            }
        }
        return $article_recommend;
    }
    /**
     * 根据栏目ID查单条数据
     * @param int $column_id
     *
     * @return bool
     */
    public function selectByColumnId($column_id=0)
    {
        if(!$column_id) return false;
        $res = $this->article_model->where('column_id',$column_id)->where('status',1)->find();
        return $res ? $res : false;
    }

}
