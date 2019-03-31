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
	// 新闻详细
	serviceData.newsDetail({
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
				//$(".detail h3").text(data.title);
				// 日期
				//$(".view-count .date").text(data.create_time.substr(0,10));
				// 图片				
				getTpl = $("#content_img_template").text();				
				fatherDiv = $(".content");
				if(data.pics.length){
					laytpl(getTpl).render({list:data.pics}, function(html){		
						fatherDiv.html(html);
					});
				}				
				// 内容
				fatherDiv.append(data.content);
			}
		}
	});
	
	/*banner*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.news}
	});
	/*推荐*/
	serviceData.newsRecommend({
		data:{
			id:GV.page_data.id
		},
		callback:function(json){
			var getTpl,fatherDiv;
			if(json.code == 1){	
				getTpl = $("#recommend_template").text();				
				fatherDiv = $("#recommend");			
				if(json.data.length){			
					laytpl(getTpl).render({list:json.data}, function(html){								
						fatherDiv.html(html);
					});
				}		
			}			
		}	
	})
	/*搜索*/
	$(".search i").on("click", function(){	
		var val = $("input[name='title']").val() || "";
		val && (window.location.href = "/news?search="+val);
		
	})
});