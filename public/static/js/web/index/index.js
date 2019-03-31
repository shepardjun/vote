layui.use(['layer','carousel','form', 'element', 'laytpl', 'serviceData'], function(){
	var element = layui.element,
		form = layui.form, 
		laytpl = layui.laytpl,
		carousel = layui.carousel,
		$ = layui.$,
		layer = layui.layer,
		serviceData = layui.serviceData;
		
	/*关于我们*/
	serviceData.aboutUs();
	/*联系我们*/
	serviceData.contactUs();
	
	/*banner*/
	serviceData.getBanner({
		data:{column_id:GV.columnId.index}		
	});
	
	// 所有产品
	serviceData.getProducts({
		callback:function(productJson){
			productsCallback(productJson, 0);
		}					
	})	
	
	// 产品分类
	serviceData.getProductCategory({
		callback:function(json){
			json.data = json.data || [];
			var html = '';
			if(json.code == 1){				
				json.data.forEach(function(item,index){
					console.log("item", item);
					html+= "<li>"+item.name+"</li>";					
					serviceData.getProducts({
						data:{cid: item.id},
						callback:function(productJson){
							productsCallback(productJson, index+1);
						}					
					})						
				});
				
				if(html){					
					$("#product_category").append(html);
				}			
			}			
		}		
	});	
	
	// 新闻分类
	serviceData.newsCategory({
		callback:function(json){
			var html = '';
			if(json.code == 1){				
				json.data.forEach(function(item,index){
					html+= "<li><a href='/news.html?cid="+item.id+"'>"+item.name+"</a></li>";
				});
				if(html){					
					$("#news-category").append(html);
				}	
			}
		}
	})
	
	/*新闻列表*/
	serviceData.newsList({
		data:{
			'num':10
		},
		callback:function(json){
			var newsFirst = {},
				newsSecond = {},
				getTpl,
				fatherDiv,
				newsData = [],
				add_time,
				year,
				month,
				date;
			
			if(json.code == 1){				
				json.data.forEach(function(item,index){
					add_time = new Date(item.create_time);
					year = add_time.getFullYear();
					month = add_time.getMonth();
					date = add_time.getDate();					
					month = ('0'+(month + 1)).substr(-2,2);
					date = ('0'+date).substr(-2,2);
					
					item.addTime = year+'-'+month+'-'+date;
					item.year = year;
					item.month = month;
					item.date = date;
					
					if(index == 0){
						newsFirst = item;
					}else if(index == 1){
						newsSecond = item;
					}else{						
						newsData.push(item);
					}				
				});
				
				// 第一条模板
				getTpl = $("#news_first_template").text();
				fatherDiv = $("#news_first");
				laytpl(getTpl).render(newsFirst, function(html){
					fatherDiv.append(html);
				});
				
				// 第二条模板
				getTpl = $("#news_second_template").text();				
				fatherDiv = $(".news-first");				
				laytpl(getTpl).render(newsSecond, function(html){			
					fatherDiv.append(html);
				});	
				
				// 列表模板
				getTpl = $("#news_template").text();				
				fatherDiv = $("#news_list");
				if(newsData.length > 5 )				
					newsData.length = 5;
				laytpl(getTpl).render({list:newsData}, function(html){
					fatherDiv.append(html);
				});	
			}
		}
		
	});
	
	/*合作伙伴*/
	serviceData.partnerList({
		callback:function(json){			
			// 列表模板
			var getTpl;
			getTpl = $("#partner_template").text();				
			fatherDiv = $("#partner");	
			if(json.data.length > 6 )
				json.data.length = 6;
			
			console.log("partner", json.data);
			
			laytpl(getTpl).render({list:json.data}, function(html){
				fatherDiv.append(html);
			});				
		}		
	})
	/*企业优势*/
	serviceData.advantageImgList({
		callback:function(json){
			var getTpl;
			// 列表模板
			getTpl = $("#advantage_template").text();				
			fatherDiv = $("#advantage");	
			if(json.data.length > 3 )
				json.data.length = 3;		
			laytpl(getTpl).render({list:json.data}, function(html){
				fatherDiv.append(html);
			});		
		}		
	})
	serviceData.advantageTextList({
		callback:function(json){
			var getTpl;
			// 列表模板
			getTpl = $("#advantage_txt_template").text();				
			fatherDiv = $("#advantage_txt");	
			if(json.data.length > 4 )
				json.data.length = 4;		
			laytpl(getTpl).render({list:json.data}, function(html){
				fatherDiv.append(html);
			});		
		}		
	})
	
		
	/* 产品数据填充 */
	function productsCallback(productJson,index)
	{
		var getTpl = $("#product_template").text(),
			fatherDiv = $(".product .layui-tab-item").eq((index)).find(".layui-row");
		if(productJson.data.length > 4 )	
			productJson.data.length = 4;
		laytpl(getTpl).render({list:productJson.data}, function(html){
			fatherDiv.html(html);
		});			
	}	

  //监听提交
  form.on('submit(formContact)', function(data){
      //            layer.msg(JSON.stringify(data.field));
      //请求服务器入库
      $.ajax({
          url:'/index/aboutus/aboutus_add',
          data:data.field,
          type:'post',
          dataType: "json",
          success:function(res){
              //写入成功跳转到列表页
              if(res.code == 1){
                  layer.msg('保存成功');
                  $('#verify').attr('src','/index/index/verifys?');
                 // window.location.href = '/';
              }else{				
				layer.msg(res.msg);
			  }
          },
          error:function(){
              layer.msg('保存失败');
          }
      });
    return false;
  });  
});