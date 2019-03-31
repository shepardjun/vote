<?php
/**
 * Created by PhpStorm.
 * User: zyp
 * Date: 18-11-5
 * Time: 下午3:41
 */
namespace app\common\service;

class Upload
{
    /*
* 上传图片类
* $name为表单上传的name值
* $filePath为为保存在入口文件夹public下面uploads/下面的文件夹名称，没有的话会自动创建
* $width指定缩略宽度 * $height指定缩略高度
* 自动生成的缩略图保存在$filePath文件夹下面的thumb文件夹里，自动创建
* @return array 一个是图片路径，一个是缩略图路径，如下：
* array(2) { ["img"] => string(57) "uploads/img/20171211\3d4ca4098a8fb0f90e5f53fd7cd71535.jpg" ["thumb_img"] => string(63) "uploads/img/thumb/20171211/3d4ca4098a8fb0f90e5f53fd7cd71535.jpg" }
*/
    public function uploadFile($name, $filePath, $mwidth, $mheight, $swidth, $sheight)
    {
        $files = request()->file($name);
        if ($files) {
            $filePaths = ROOT_PATH . 'public' . DS . 'upload' . DS . $filePath;
            if (!file_exists($filePaths)) {
                mkdir($filePaths, 0777, true);
            }
            $filePath = $filePath ? $filePath . '/' : '';
            $files = is_array($files) ? $files : array($files);
            foreach ($files as $file) {
                $info = $file->move($filePaths);
                if ($info) {
                    $imgpath = 'upload/' . $filePath . $info->getSaveName();
                    $image = \think\Image::open($imgpath);
                    $date_path = 'upload/' . $filePath . date('Ymd');
                    if (!file_exists($date_path)) {
                        mkdir($date_path, 0777, true);
                    }
                    $thumb_path = $date_path . '/' . $info->getFilename() . '_middle.' . $info->getExtension();
                    $image->thumb($mwidth, $mheight)->save($thumb_path);
                    $date_path_small = 'upload/' . $filePath . date('Ymd');
                    if (!file_exists($date_path_small)) {
                        mkdir($date_path_small, 0777, true);
                    }
                    $thumb_path_samll = $date_path_small . '/' . $info->getFilename() . '_small.' . $info->getExtension();
                    $image->thumb($swidth, $sheight)->save($thumb_path_samll);
                    $data['src'] = '/' . $imgpath;
                    $data['m_img'] = '/' . $thumb_path;
                    $data['s_img'] = '/' . $thumb_path_samll;
                    $img_arr = array('code' => 0, 'msg' => '', 'data' => $data);

                    return json_encode($img_arr);
                } else {
                    // 上传失败获取错误信息
                    return $file->getError();
                }
            }
        }
    }
}