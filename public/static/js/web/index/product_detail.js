layui.use(['element', 'laytpl', 'serviceData'], function(){
	var element = layui.element,
		form = layui.form, 
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		$ = layui.$,
		serviceData = layui.serviceData;
	
	/*关于我们*/
	serviceData.aboutUs();
	
	/*联系我们*/
	serviceData.contactUs();
	
	/*banner*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.product}
	});
	
	// 产品详细
	serviceData.productDetail({
		data:{
			id:GV.page_data.id
		},
		callback:function(json){
			
			var data = {},getTpl,fatherDiv;
			if(json.code == 1){	
				data = json.data;				
				// 赋值
				// 标题
				//document.title = data.title;
				//$(".spec h3").text(data.title);
				//$(".spec p").text(data.summary);
				// 图片			
				$(".detail .img img").attr("src",data["pics"][0] && data["pics"][0]['url_large'] || '/static/images/noimg.jpg' )		
				// 内容
				//$(".content").html(data.content);
				
			}
		}
	});
	
	
	/*推荐*/
	serviceData.productRecommend({
		data:{
			id:GV.page_data.id
		},
		callback:function(json){
			
			var getTpl,fatherDiv;
			if(json.code == 1){	
				getTpl = $("#product_list_template").text();				
				fatherDiv = $(".foryou");			
				if(json.data.length){			
					laytpl(getTpl).render({list:json.data}, function(html){								
						fatherDiv.append(html);
					});
				}		
			}	
			
		}	
	})
	
	$("img").error(function(){
		$(this).attr("src", "/static/images/noimg.jpg");
	})
});