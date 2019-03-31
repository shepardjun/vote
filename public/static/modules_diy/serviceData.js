/**
 *扩展一个获取后端模块
 */      
 
layui.define(["carousel"],function(exports){
"use strict";
var $ = layui.$,
	carousel = layui.carousel;
var obj = {};
// 设置banner
obj.getBanner = function(args){		
	$.ajax({
		url:"/index/swiper/img_list",
		data:args.data,
		dataType:"json",
		success:function(json){
			var html = '';
			if(json.code == 1){
				json.data.forEach(function(item){
					html+= "<div><img src="+item.url_large+" width='100%' /></div>"
				});
				
				if(html){
					$("#carousel-item").append(html);
					//建造实例
					carousel.render({
						elem: '#test1'
						,width: '100%' //设置容器宽度
						,arrow: 'hover' //始终显示箭头
						,height:'100%'//,anim: 'updown' //切换动画方式
					});
				}				
			}			
		}		
	});
}

//产品分类
obj.getProductCategory = function(args){
	$.ajax({
		url:"/index/product/category",		
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

//产品列表
obj.getProducts = function(args){	
	$.ajax({
		url:"/index/product/product_list",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json,args.data);		
		}		
	});	
}

/*产品详细*/
obj.productDetail = function(args){
	$.ajax({
		url:"/index/product/product_detail",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}


/*新闻推荐*/
obj.productRecommend = function(args){
	$.ajax({
		url:"/index/product/product_recommend",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}


/*新闻分类*/
obj.newsCategory = function(args){
	$.ajax({
		url:"/index/news/category",		
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*新闻列表*/
obj.newsList = function(args){
	$.ajax({
		url:"/index/news/news_list",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}
/*新闻详细*/
obj.newsDetail = function(args){
	$.ajax({
		url:"/index/news/news_detail",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*新闻推荐*/
obj.newsRecommend = function(args){
	$.ajax({
		url:"/index/news/news_recommend",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}


/*合作伙伴列表*/
obj.partnerList = function(args){
	$.ajax({
		url:"/index/partner/partner_list",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*企业优势*/
obj.advantageImgList = function(args){
	$.ajax({
		url:"/index/advantage/advantage_img",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*企业优势文本内容*/
obj.advantageTextList = function(args){
	$.ajax({
		url:"/index/advantage/advantage_txt",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*关于我们*/
obj.aboutUs = function(){
	$.ajax({
		url:"/index/aboutus/aboutus_detail",
		data:{},
		dataType:"json",
		success:function(json){			
			if(json.code == 1){	
				$(".company_content").html(json.data.content).addClass("animated  fadeInRight");
				$(".aboutus_img").attr("src", json.data.pics[0]['url_large'] || '/static/images/noimg.jpg');				
			}			
		}		
	});	
}
/*关于我们Banner*/
obj.aboutBanner = function(args){
	$.ajax({
        url:"/index/swiper/img_list",
        data:{column_id:GV.columnId.about},
		dataType:"json",
		success:function(json){			
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*联系我们*/
obj.contactUs = function(){
	$.ajax({
		url:"/index/contact/contact_detail",
		data: {},
		dataType:"json",
		success:function(json){
			if(json.code == 1){	
				$(".company_address").text(json.data.address);
				$(".company_phone").text(json.data.phone);
				$(".company_email").text(json.data.email);
				$(".company_website").text(json.data.website);
			}				
		}		
	});	
}

/*联系我们 banner*/
obj.contactUsBanner = function(args){
	$.ajax({
        url:"/index/swiper/img_list",
        data:{column_id:GV.columnId.contact},
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);			
		}		
	});	
}


/*历史列表*/
obj.getHistory = function(args){
	$.ajax({
		url:"/index/history/history_detail",
		data:args.data || {},
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*历史banner*/
obj.historyBanner = function(args){
	$.ajax({
        url:"/index/swiper/img_list",
        data:{column_id:GV.columnId.history},
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*企业文化*/
obj.culture = function(args){
	$.ajax({
        url:"/index/culture/culture_detail",
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

// 研发分类
obj.technologyCategory = function(args){
	$.ajax({
        url:"/index/technology/category",
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

//研发列表
obj.getTechnology = function(args){	
	$.ajax({
		url:"/index/technology/technology_list",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json,args.data);		
		}		
	});	
}

/*研发详细*/
obj.technologyDetail = function(args){
	$.ajax({
		url:"/index/technology/technology_detail",
		data:args.data,
		dataType:"json",
		success:function(json){
			if(args.callback)
				args.callback(json);		
		}		
	});	
}

/*显示或是隐藏菜单*/
$(".navbar-toggler").on("click",function(){
	var $this = $(this);
	if($this.hasClass("active")){
		$this.removeClass("active");
		$(".nav-bg").addClass("layui-hide-xsd");
	}else{
		$this.addClass("active");
		$(".nav-bg").removeClass("layui-hide-xsd");
	}

});


exports('serviceData', obj);
});