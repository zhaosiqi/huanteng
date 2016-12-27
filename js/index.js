$(function(){
	// banner轮播------
	$(".bannerbox>img").hide().eq(0).show();
	$(".bannerd>ul>li").mouseover(function(){
		var index=$(this).index();
		$(".bannerd>ul>li").removeClass().eq($(this).index()).addClass("active");
		$(".bannerbox>img").fadeOut().eq($(this).index()).fadeIn();
	})
})