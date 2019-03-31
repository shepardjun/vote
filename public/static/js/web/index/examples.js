layui.use(['element', 'laytpl', 'serviceData', 'laypage'], function(){
	var element = layui.element,
		form = layui.form, 
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		laypage = layui.laypage,
		$ = layui.$,
		serviceData = layui.serviceData;
	
	/*关于我们*/
	serviceData.aboutUs();
	
	/*联系我们*/
	serviceData.contactUs();
	
	// 商品banner
	serviceData.getBanner({
		data:{column_id:GV.columnId.examples}
	});	
	
	
	// 产品分类
	serviceData.technologyCategory({
		callback:function(json){			
			var html = '<li class="layui-this" data-id="0">全部</li>';			
			if(json.code == 1 && !$.isEmptyObject(json.data)){				
				json.data.forEach(function(item,index){				
					html+= "<li data-id='"+item.id+"'>"+item.name+"</li>";
				});
				
				if(html){					
					$(".products ul").append(html);					
					$(".layui-tab-title li").on("click",function(){
						
						var cid = $(this).attr("data-id")
												
						serviceData.getTechnology({
							data:{
								cid:cid,
								page:1,
								num:3								
							},
							callback:function(json, obj){			
								productsCallback(json,obj) 
							}							
						})
					}).eq(0).trigger("click");
				}			
			}else{
				serviceData.getTechnology({
					data:{
						page:1,
						num:3								
					},
					callback:function(json, obj){			
						productsCallback(json,obj) 
					}							
				})
			}		
		}		
	});
	
	/* 产品数据填充 */
	function productsCallback(productJson,pageArgs)
	{
		var getTpl = $("#product_template").text(),
			fatherDiv = $(".layui-tab-content .product-list");
		
		laytpl(getTpl).render({list:productJson.data, index: pageArgs}, function(html){	
			if(productJson.data.length == 0) html = '<p class="alignc" style="margin:0 auto;">暂无内容</p>';
			
			fatherDiv.html(html);		
				
			if(productJson.data.length == 0) $("#pages").hide(); else $("#pages").show();	
			//分页
			laypage.render({
				elem: 'pages'
				,count: productJson.count
				,limit:pageArgs.num
				,curr:pageArgs.page
				,jump:function(obj,first){					
					if(!first){
						serviceData.getTechnology({
							data:{								
								cid:pageArgs.cid,
								page:obj.curr,
								num:obj.limit,
								kwd:pageArgs.search
							},
							callback:function(productJson,obj){
								productsCallback(productJson, obj);
							}					
						})					
					}					
				}
			});					
		});			
	}
});