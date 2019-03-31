layui.use(['carousel','element', 'laytpl', 'serviceData'], function(){
	var element = layui.element,
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		$ = layui.$,
		serviceData = layui.serviceData;
		
	serviceData.contactUs();	
	serviceData.aboutUs();	
	/*联系我们*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.history}
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
	
	
});		
		