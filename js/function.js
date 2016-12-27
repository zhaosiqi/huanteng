//*********
//1.解决通过类名获取元素的兼容问题
function getClass(classname,father){
	father=father||document;			//输出默认值
	if (father.getElementsByClassName) {			//判断浏览器是否为现代浏览器
		return father.getElementsByClassName(classname);//现代浏览器
	}else{//IE
		var all=father.getElementsByTagName('*');
		var newarr=[];
		for (var i=0; i<all.length; i++) {
			if(checkRep(classname,all[i].className)){
				newarr.push(all[i]);
			}
		};
		return newarr
	}
}

function checkRep(val,string){
	var arr=string.split(" ");
	for(var i in arr){
		if(val==arr[i]){
			return true;
		}
	}
	return false;
}

//2016.8.30
//解决获取样式值得兼容问题
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,null)[attr];

	}
}

//2016.8.31
//获取元素的兼容函数（可以支持标签，id，class）
function $(selector,father){
	var father=father||document;
	if(typeof selector=='string'){
		selector=selector.replace(/^\s*|\s*$/g,'')
		if(selector.charAt(0)=='.'){
			return getClass(selector.substring(1),father);
		}else if(selector.charAt(0)=='#'){
			return document.getElementById(selector.substring(1));
		}else if(/^[a-z][1-6a-z]*/g.test(selector)){
			return father.getElementsByTagName(selector)
		}
	}else if(typeof selector=='function'){
		// window.onload=function(){
		// 	selector();
		// }
		addEvent(window,'load',function(){
			selector();
		})
	}

}


//2016.9.02
//获取所有的子节点的兼容函数
//father 指定定父节点
//type:'a' 只有元素节点
//  'b' 元素节点+文本节点
function getChild(father,type){
	type=type||'a';
	var newarr=[];
	var all=father.childNodes;
	for (var i = 0; i < all.length; i++) {// 遍历子节点
		if (type=='a') {
			if(all[i].nodeType==1){//判断类型
				newarr.push(all[i])
			}
		}else if(type=='b'){
			if(all[i].nodeType==1||(all[i].nodeType==3 && all[i].nodeValue.replace(/^\s*|\s*$/g,'')!=""))
			{
				newarr.push(all[i]);
			}
		}	
	};
	return newarr;
}


//获取子节点的兼容函数
function getFirst(father){
	return getChild(father)[0];
}

//获取最后一个子节点

function getLast(father){
	return getChild(father)[getChild(father).length-1];
}



//获取指定的子节点

function getNum(father,xiabiao){
	return getChild(father)[xiabiao];
}

//获取下一个兄弟节点
function getNext(obj){
	var next=obj.nextSibling;
	if (!next) {
		return false;
	};
	while(next.nodeType==3||next.nodeType==8){
		next=next.nextSibling;
		if (!next) {
		return false;
	};
	}
	return next;
}

//获取上一个兄弟节点
function getUp(obj){
	var last=obj.previousSibling;
	if(!last){
		return false;
	};
	while(last.nodeType==3||last.nodeType==8){
		last=last.previousSibling;
		if(!last){
			return false;
		};
	}
	return last;
}

//事件绑定的兼容函数
function addEvent(obj,event,fun){
	obj[fun]=function(){
		fun.call(obj)
	}
	if(obj.attachEvent){
		obj.attachEvent('on'+event,obj[fun])	
	}else{
		obj.addEventListener(event,obj[fun],false)
	}

}
//移除事件的兼容函数
function removeEvent(obj,event,fun){
	if(obj.detachEvent){
		obj.detachEvent('on'+event,obj[fun])
	}else{
		obj.removeEventListener(event,obj[fun],false)
	}
}

//12.鼠标的滚轮事件
function mouseWheel(obj,up,down){
	if(document.attachEvent){
		document.attachEvent('onmousewheel',scrollFn);
		//ie prera
	}else if(obj.addEventListener){
		obj.addEventListener('mousewheel',scrollFn,false);
		//chrome,safari -webkit-
		obj.addEventListener('DOMMouseScrool',scrollFn,false);
		//firefox -moz-
	}
	function scrollFn(e){
	e=e||window.event;
	// 阻止浏览器行为
	if(e.preventDefault){
		e.preventDefault
	}else{

			e.returnValue=false;}
	var f=e.detail||e.wheelDelta
	if(f==-3||f==120){
		if(up){
			up();
		}
	}else if(f==3 ||f==-120){
		if(down){
			down()
		}
	}
}
}

//hover
//判断某个元素是否包含有另外一个元素
 function contains (parent,child) {
  if(parent.contains){
     return parent.contains(child) && parent!=child;
  }else{
    return (parent.compareDocumentPosition(child)===20);
  }
 }

//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
  function checkHover (e,target) {
   if(getEvent(e).type=="mouseover"){
      return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
   }else{
    return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
    }
  }
//鼠标移入移出事件
/*
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover (obj,overfun,outfun) {
    if(overfun){
      obj.onmouseover=function  (e) {
        if(checkHover(e,obj)){
           overfun.call(obj,[e]);
        }
      }
    }
    if(outfun){
      obj.onmouseout=function  (e) {
        if(checkHover(e,obj)){
           outfun.call(obj,[e]);
        }
      }
    }
}
 function getEvent (e) {
      return e||window.event;
 }
/********************************/

// 用正则匹配类名********
// var class1=".banner-left";
// var class2='.box2';
// var reg=/^\.[&_a-zA-Z][$_a-zA-Z\d\-]*/;


