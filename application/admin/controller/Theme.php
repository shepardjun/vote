<?php
namespace app\admin\controller;

use app\common\service\Article;
use app\common\service\Category;
use app\common\service\Pic;
use app\common\controller\AdminBase;
use app\common\service\Base;
use \think\Cache;
use \think\Config;


class Theme extends AdminBase

{
  
    public function _initialize()
    {
        parent::_initialize();      
    }
   
	/**
	 * 主题设置页面
	 */
	public function config()
	{		
		$result = Cache::get('theme');		
		$this->assign('theme', $result);
		return $this->fetch();
	}
	
	/**
	 * 主题设置提交
	 */
	public function ajax_save_config()
	{
		$code = -1;	
		$post = input('post.');
		$post['version'] = time();
		$result = Cache::set('theme', $post);
		
		if($result) {
			$code = 0;		
			$config = Config::get('theme');			
			$config = $config['CSS'] ?: '';
			
			
			if($post['bgColor']) $config = preg_replace('/#bgColor#/',$post['bgColor'],$config);
			if($post['fontColor']) $config = preg_replace('/#fontColor#/',$post['fontColor'],$config);
			if($post['hoverColor']) $config = preg_replace('/#hoverColor#/',$post['hoverColor'],$config);
			$file_dir = ROOT_PATH.'public/upload/themes/' ;
			$file = $file_dir.'theme.css';
			
			if(!is_dir($file_dir)){
				mkdir($file_dir,0755, true);
			}else if($config){				
				file_put_contents($file,$config);
			}			
		}		
		
		$this->output_json(0,'',1,$result);
	}
	
	
}
