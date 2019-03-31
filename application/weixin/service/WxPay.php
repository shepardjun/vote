<?php
/*********�ļ�����*********
 * @last      update 2019/3/22 10:37
 * @alter     zhuangky(zhuangkeyong@sina.cn)
 * @version   1.0.0
 *
 *
 * ���ܼ�飺΢��֧��api
 * @author    zhuangky(zhuangkeyong@sina.cn)
 * @copyright zky
 * @version   2019/3/22 10:37
 */
namespace app\weixin\service;

class WxPay
{
    var $parameters;//�������������Ϊ��������
    public $response;//΢�ŷ��ص���Ӧ
    public $result;//���ز���������Ϊ��������
    var $order_api = 'https://api.mch.weixin.qq.com/pay';//�ӿ�����
    var $curl_timeout = 30;//curl��ʱʱ��

    /**
     *    ���ã������������
     */
    function setParameter($parameter, $parameterValue)
    {
        $this->parameters[$this->trimString($parameter)] = $this->trimString($parameterValue);
    }

    /**
     *    ���ã�post����xml
     */
    function sendOrderXml()
    {
        $xml = $this->arrayToXml($this->parameters);
        $this->response = $this->postXmlCurl($xml, $this->order_api . '/unifiedorder');

        return $this->response;
    }

    /**
     *    ���ã�post����xml
     */
    function checkOrderXml()
    {
        $xml = $this->arrayToXml($this->parameters);
        $this->response = $this->postXmlCurl($xml, $this->order_api . '/orderquery');

        return $this->response;
    }

    /**
     *    ���ã�ʹ��֤��post����xml
     */
    function sendOrderXmlSSL($sslcert, $sslkey)
    {
        $xml = $this->arrayToXml($this->parameters);
        $this->response = $this->postXmlCurl($xml, $this->send_order_api . '/unifiedorder', $sslcert, $sslkey);

        return $this->response;
    }

    /**
     *    ���ã���ȡ�����Ĭ�ϲ�ʹ��֤��
     */
    function getResult()
    {
        $this->result = $this->xmlToArray($this->response);

        return $this->result;
    }

    public function trimString($value)
    {
        $ret = null;
        if (null != $value) {
            $ret = $value;
            if (strlen($ret) == 0) {
                $ret = null;
            }
        }

        return $ret;
    }

    /**
     *    ���ã���������ַ�����������32λ
     */
    public function createNoncestr($length = 32)
    {
        $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }

        return $str;
    }

    /**
     *    ���ã���ʽ��������ǩ��������Ҫʹ��
     */
    public function formatBizQueryParaMap($paraMap, $urlencode)
    {
        $buff = "";
        ksort($paraMap);
        foreach ($paraMap as $k => $v) {
            if ($urlencode) {
                $v = urlencode($v);
            }
            $buff .= $k . "=" . $v . "&";
        }
        $reqPar = "";
        if (strlen($buff) > 0) {
            $reqPar = substr($buff, 0, strlen($buff) - 1);
        }

        return $reqPar;
    }

    /**
     *    ���ã�����ǩ��
     */
    public function getSign($Obj, $key)
    {
        foreach ($Obj as $k => $v) {
            $Parameters[$k] = $v;
        }
        //ǩ������һ�����ֵ����������
        ksort($Parameters);
        $String = $this->formatBizQueryParaMap($Parameters, false);
        //echo '��string1��'.$String.'</br>';
        //ǩ�����������string�����KEY
        $String = $String . "&key=" . $key;
        //echo "��string2��".$String."</br>";
        //ǩ����������MD5����
        $String = md5($String);
        //echo "��string3�� ".$String."</br>";
        //ǩ�������ģ������ַ�תΪ��д
        $result_ = strtoupper($String);

        //echo "��result�� ".$result_."</br>";
        return $result_;
    }

    /**
     *    ���ã�arrayתxml
     */
    function arrayToXml($arr)
    {
        $xml = "<xml>";
        foreach ($arr as $key => $val) {
            if (is_numeric($val)) {
                $xml .= "<" . $key . ">" . $val . "</" . $key . ">";

            } else
                $xml .= "<" . $key . "><![CDATA[" . $val . "]]></" . $key . ">";
        }
        $xml .= "</xml>";

        return $xml;
    }

    /**
     *    ���ã���xmlתΪarray
     */
    public function xmlToArray($xml)
    {
        //��XMLתΪarray
        $array_data = json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);

        return $array_data;
    }

    /**
     *    ���ã���post��ʽ�ύxml����Ӧ�Ľӿ�url
     */
    public function postXmlCurl($xml, $url, $sslcert = '', $sslkey = '')
    {
        //��ʼ��curl
        $ch = curl_init();
        //���ó�ʱ
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->curl_timeout);
        //�������ô�������еĻ�
        //curl_setopt($ch,CURLOPT_PROXY, '8.8.8.8');
        //curl_setopt($ch,CURLOPT_PROXYPORT, 8080);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        //����header
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        //Ҫ����Ϊ�ַ������������Ļ��
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        //ʹ��֤�飺cert �� key �ֱ���������.pem�ļ�
        if ($sslcert) {
            //Ĭ�ϸ�ʽΪPEM������ע��
            curl_setopt($ch, CURLOPT_SSLCERTTYPE, 'PEM');
            curl_setopt($ch, CURLOPT_SSLCERT, $sslcert);
        }
        if ($sslkey) {
            //Ĭ�ϸ�ʽΪPEM������ע��
            curl_setopt($ch, CURLOPT_SSLKEYTYPE, 'PEM');
            curl_setopt($ch, CURLOPT_SSLKEY, $sslkey);
        }
        //post�ύ��ʽ
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        //����curl
        $data = curl_exec($ch);
        //curl_close($ch);
        //���ؽ��
        if ($data) {
            curl_close($ch);

            return $data;
        } else {
            $error = curl_errno($ch);
            echo "curl����������:$error" . "<br>";
            echo "<a href='http://curl.haxx.se/libcurl/c/libcurl-errors.html'>����ԭ���ѯ</a></br>";
            curl_close($ch);

            return false;
        }
    }

    /**
     *    ���ã���ӡ����
     */
    function printErr($wording = '', $err = '')
    {
        print_r('<pre>');
        echo $wording . "</br>";
        var_dump($err);
        print_r('</pre>');
    }
}