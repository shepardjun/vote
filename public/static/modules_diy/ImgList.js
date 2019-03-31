/**
 * 上传模块
 */

layui.define(function(exports){
"use strict";
var $ = layui.$;

function Img()
{
	this.config = {
		'initData':[],
		'element':"#img_div",
		'hiddenDirection':[]
	};
}

Img.prototype.defineConfig = function(config){
	var _this = this,imgStr = '',hiddenStr='';
	this.config = $.extend(this.config,config);
	if(this.config.initData.length > 0){
		this.config.initData.forEach(function(item){
			imgStr += _this._render(item);
			hiddenStr += _this._createStr(item) + "|";
		});
		$(this.config.element).append(imgStr);
		this.config.hiddenDirection.val(hiddenStr);
		this._bindEvent();
	}	
}

Img.prototype.add = function(obj, render){
	if(obj.src == undefined) throw new Error("返回数据没有src属性");
	var imgId = this.randomString(),data;	
	data = {
		imgid: imgId,
		src:obj.src,
		m_img:obj.m_img || "",
		s_img:obj.s_img || obj.src,
	};
	this.config.initData.push(data)
	if(render){
		$(this.config.element).append(this._render(data));
		this._appendStr(data);
		this._bindEvent();
	}	
}
Img.prototype._bindEvent = function(){
	var _this = this;
	$(".item_img .close").off("click").on("click",function(){
		var id = $(this).attr("data-id"),
			imgs = '',
			img = '',
			imgObjTmp = [],
			imgObj = _this.config.initData;
		
		if($("#"+id).length > 0){
			
			// 删除图片
			$("#"+id).remove();
			console.log("id",id);
			// 标记删除元素
			imgObj.forEach(function(item){
				if(item['imgid'] != id){
					imgObjTmp.push(item);
					img = _this._createStr(item);
					imgs = imgs + img + "|";
				}else{
					console.log("找到了", id);
				}				
			})
			console.log(imgs);
			_this.config.initData = imgObjTmp;
			console.log("_this.config.initData",_this.config.initData);
			if(_this.config.hiddenDirection.length){
				_this.config.hiddenDirection.val(imgs);
			}				
		}				
	});				

}

Img.prototype._render = function(obj){	
	var str = '<dd class="item_img" id="' + obj.imgid + '"><div class="operate"><i data-id="' + obj.imgid + '" class="close layui-icon"></i></div><img src="' + obj.s_img + '" class="img" ></dd>';	
	return str;
}

Img.prototype._createStr = function(obj){
	return "'" +  obj.src + "','" + obj.m_img + "','" + obj.s_img + "'";
}

Img.prototype._appendStr = function(obj){
	if(this.config.hiddenDirection.length > 0){		
		var str = this._createStr(obj),
			val = this.config.hiddenDirection.val();
			val = val+str+"|";
			console.log("val",val);
		this.config.hiddenDirection.val(val);
	}
	
}

Img.prototype.randomString = function(len) {
　　var len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}	
　　return pwd;
}
exports('ImgList', new Img());
});