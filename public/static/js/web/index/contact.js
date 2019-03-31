layui.use(['carousel','element', 'laytpl', 'serviceData'], function(){
	var element = layui.element,
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		$ = layui.$,
		serviceData = layui.serviceData;
		
	serviceData.contactUs();	
	/*关于我们*/
	serviceData.aboutUs();	
	/*联系我们*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.contact}
	});	
	
	// 滚动加载动画
	new WOW().init();	
});		
		