<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]
//网站是否开启ssl
$https_status = isset($_SERVER['HTTPS']) && 'on' == $_SERVER['HTTPS'];
// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');
//网站域名
define("SITE_HTTP_HOST", (empty($_SERVER['HTTP_HOST']) ? '' : $_SERVER['HTTP_HOST']));
//网站域名
define("SITE_DOMAIN", ($https_status ? "https://" : 'http://') . (SITE_HTTP_HOST ?: ''));

// 加载框架引导文件
require __DIR__ . '/../thinkphp/start.php';