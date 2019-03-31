layui.use(['element','serviceData','laytpl','carousel'], function(){
	var element = layui.element,		
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		carousel = layui.carousel,
		$ = layui.$,
		serviceData = layui.serviceData;
	
	/*关于我们*/
	serviceData.aboutUs();
	
	/*联系我们*/
	serviceData.contactUs();	
	
	/*banner*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.about}			
	});
	
	/*历史发展*/
	serviceData.getHistory({
		callback:function(json){
			
			var getTpl,fatherDiv;
			if(json.code == 1){	
				getTpl = $("#history_template").text();				
				fatherDiv = $("#history_body");			
				if(json.data.length){			
					laytpl(getTpl).render({list:json.data}, function(html){		
						fatherDiv.prepend(html);
					});  
				}		
			}		
		}		
	});
	
	/*企业文化*/
	serviceData.culture({
		callback:function(json){			
			if(json.code == 1){				
				$("#culture_content").html(json.data.content || "");
				$(".culture .content img").attr("src", json.data.pic && json.data.pic[0] && json.data.pic[0]['url_large'] || "/static/images/noimg.jpg");
			}		
		}		
	});
});	
	
	