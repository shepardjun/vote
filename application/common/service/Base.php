<?php
/**
 * Created by PhpStorm.
 * User: zyp
 * Date: 18-11-7
 * Time: 上午10:40
 */
namespace app\common\service;

class Base
{
    public function picArr($id='',$data,$column_id,$title='',$type,$post=[])
    {
        foreach ($data as $key => $value){
            $img_val = explode(',',$value);
            $pic[$key]['url_large'] = trim($img_val[0],"'");
            $pic[$key]['url_middle'] = trim($img_val[1],"'");
            $pic[$key]['url_small'] = trim($img_val[2],"'");
            if($title){
                $pic[$key]['title'] = $title;
            }
            $pic[$key]['column_id'] = $column_id;
            $pic[$key]['type'] = $type;
            if($id && !$post){
                $pic[$key]['content_id'] = $id;
            }
            if($post){
                $pic[$key]['link'] = $post['link'];
                $pic[$key]['memo'] = $post['memo'];
            }
        }
        return $pic;
    }
}