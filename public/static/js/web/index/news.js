layui.use(['element', 'laytpl', 'laypage', 'serviceData'], function(){
	var element = layui.element,
		form = layui.form, 
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		$ = layui.$,
		laypage = layui.laypage,
		serviceData = layui.serviceData,
		pageLimit = 2,
		pageData = {
			kwd:GV.page_data.search,
			cid:GV.page_data.cid,
			num:pageLimit,
			page:1
		};
	/*关于我们*/
	serviceData.aboutUs();
	
	/*联系我们*/
	serviceData.contactUs();
	
	/*banner*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.news}
	});
	
	/*新闻列表*/
	function pageList(){
		serviceData.newsList({
			data:pageData,
			callback:function(json){
				var getTpl,fatherDiv;
				if(json.code == 1){	
					getTpl = $("#news_template").text();				
					fatherDiv = $(".news-list");
					json.data.forEach(function(item){
						item.create_time = item.create_time.substr(0,10);
					});

					if(json.data.length){
						laytpl(getTpl).render({list:json.data}, function(html){								
							fatherDiv.html(html);
						});
						
						//分页
						laypage.render({
							elem: 'pages'
							,count: json.count
							,limit:pageLimit
							,curr:pageData.page
							,jump: function(obj, first){
								console.log("obj", obj);
								console.log("first", first);
								if(!first){
									pageData.page = obj.curr;
									pageList();
								}
							}
						});	  
					}else{
                        fatherDiv.html('<p class="alignc" style="margin:30px auto;">暂无内容</p>');
                    }
				}		
			}		
		});			
	}	
	pageList();  
	
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
	});
	
	/*搜索*/
	$(".search i").on("click", function(){	
		var val = $("input[name='kwd']").val() || "";
        val && (window.location.href = "/news?search="+val);
		
	})
});