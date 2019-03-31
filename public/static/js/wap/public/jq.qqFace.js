// QQ表情插件
(function($){  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : GV.TP_PUB_IMG+'/qqface/',
			assign : 'content',
			tip : 'em_'
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		//style="position:absolute;display:none;z-index:1000;"
		var bOk=true;
		$(this).click(function(e){
			var strFace, labFace;
			var oWidth= document.body.clientWidth;
			if($('#'+id).length<=0){
				strFace = '<div class="swiper-container qqFace" id="'+id+'"  class="qqFace">' +
							  '<div class="swiper-wrapper"><ul class="swiper-slide">';
				for(var i=1; i<=75; i++){
					labFace = '['+tip+i+']';
					strFace += '<li><img src="'+path+i+'.png" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');event.stopPropagation();" /></li>';
					if(oWidth<=320){
						if( i % 28 == 0 ) strFace += '</ul><ul class="swiper-slide">';
					}else{
						if( i % 32 == 0 ) strFace += '</ul><ul class="swiper-slide">';
					}
				}
				strFace += '</ul></div><div class="swiper-pagination"></div></div>';

			}
			$(this).parent().parent().append(strFace);
			//var offset = $(this).position();
			//var top = offset.top + $(this).outerHeight();
			// var top = -130;
			// var left= 6;
			// $('#'+id).css('top',top);
			// $('#'+id).css('left',left);  //offset.left
			if(bOk){
				$('#'+id).show();
				$(".MsgBottom_con").hide();
				e.stopPropagation();
				bOk=false;
			}else{
				$('#'+id).hide();
				e.stopPropagation();
				bOk=true;
			}
			
			
			var swiper = new Swiper ('.swiper-container', {
			      pagination : '.swiper-pagination',
			      paginationClickable : true,
			      
			});
		});
		$(document).click(function(){
			$('#'+id).hide();
			
			bOk=true;
			$('#'+id).remove();
		});

	};

})(jQuery);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 

	setCaret: function(){ 
		if(!$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 

			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 

	insertAtCaret: function(textFeildValue){ 
		var textObj = $(this).get(0); 

		if(document.all && textObj.createTextRange && textObj.caretPos){ 
			var caretPos=textObj.caretPos; 
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? 
			textFeildValue+'' : textFeildValue; 
		} else if(textObj.setSelectionRange){ 
			var rangeStart=textObj.selectionStart; 
			var rangeEnd=textObj.selectionEnd; 
			var tempStr1=textObj.value.substring(0,rangeStart); 
			var tempStr2=textObj.value.substring(rangeEnd); 
			textObj.value=tempStr1+textFeildValue+tempStr2; 

			textObj.focus(); 
			
			var len=textFeildValue.length; 
			textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
			textObj.blur();
			if($("#saytext").val()!=""){
				$(".sendMsgBtn").css("display","inline-block")
				$("#applistBtn").hide();
			}else{
				$(".sendMsgBtn").hide();
				$("#applistBtn").css("display","inline-block")
			}
		}else{ 
			textObj.value+=textFeildValue; 
		} 
	} 
});