<?php
/*********文件描述*********
 * @last update 2019/3/20 23:02
 * @alter zhuangky(zhuangkeyong@sina.cn)
 * @version 1.0.0
 *
 *
 * 功能简介：各应用调用处理hook
 * @author zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version 2019/3/20 23:02
 */
namespace app\common\lib;

class Hook
{
    /**
     * 调用其他应用方法
     *
     * 参数描述：
     *
     * @param array $param
     * string app               应用名
     * string clname            类名
     * string fnname            方法名
     * array  data              传入参数
     *
     * 返回值：
     *
     * @return mixed
     */
    static public function hooks(array $param)
    {
        try {
            //error_reporting(0);
            //set_error_handler(array('Common\\Lib\\Hook', 'appError'));
            //register_shutdown_function(array('Common\\Lib\\Hook', 'fatalError'));

            $obj_path= '\\app\\' . $param['app'] . '\hook\\' . $param['clname'];
            $file_path= '/' . $param['app'] . '/hook/' . $param['clname'];


            if (file_exists(APP_PATH . $file_path . '.php')) {

                $hooks = new $obj_path();

                //有要调用方法
                if($param['fnname']){
                    if (method_exists($hooks, $param['fnname'])) {

                        return @$hooks->{$param['fnname']}($param['data']);

                    } else {
                        throw new \Exception(
                            '调用资源' . $param['app'] .
                            '/' . $param['clname'] .
                            '/' . $param['fnname'] .
                            '方法不存在'
                        );
                    }

                //直接返回实例对象
                }else{
                    return array(
                        'status' => 1,
                        'info' => '',
                        'data' => $hooks,
                    );
                }

            } else {
                throw new \Exception(
                    '调用资源' . $param['app'] .
                    '/' . $param['clname'] .
                    '类不存在'
                );
            }

        } catch (\Exception $e) {
            return array(
                'status' => 0,
                'info'   => $e->getMessage(),
                'data'   => ''
            );
        }
    }


    /**
     * 致命错误异常抛出处理
     *
     * 参数描述：
     *
     * 返回值：
     * @throws \Exception
     */
    public function fatalError()
    {
        if ($e = error_get_last()) {
            switch($e['type']){
                case E_ERROR:
                case E_PARSE:
                case E_CORE_ERROR:
                case E_COMPILE_ERROR:
                case E_USER_ERROR:
                    throw new \Exception(
                        $e['message'].$e['file'].$e['line']
                    );
                    break;
            }
        }
    }


    /**
     * 应用内部错误异常处理
     *
     * 参数描述：
     * @param $errno
     * @param $errstr
     * @param $errfile
     * @param $errline
     *
     * 返回值：
     *
     * @throws \Exception
     */
    public function appError($errno, $errstr, $errfile, $errline)
    {
        switch ($errno) {
            case E_ERROR:
            case E_PARSE:
            case E_CORE_ERROR:
            case E_COMPILE_ERROR:
            case E_USER_ERROR:
                throw new \Exception(
                    "$errstr ".$errfile." 第 $errline 行."
                );
                break;
            default:
                throw new \Exception(
                    "[$errno] $errstr ".$errfile." 第 $errline 行."
                );
                break;
        }
    }
}