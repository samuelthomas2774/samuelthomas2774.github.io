$(".fade-in-on-scroll").css("visibility", "hidden").css("opacity", 0);
$(".fade-out-on-scroll").css("display", "block").css("opacity", 1);

$.fadein = {};

$(document).on("scroll", $.fadein.refresh = function() {
	var headerheight = $("nav").outerHeight(true),
		scrolltop = $(document).scrollTop() + headerheight,
		windowheight = $(window).height() - headerheight,
		documentheight = $(document).height() - headerheight,
		percentage = scrolltop / (documentheight - windowheight),
		centertop = documentheight * percentage;
	
	$(".fade-in-on-scroll").each(function() {
		var $this = $(this),
			offset = $this.offset().top,
			$mtop, $mbottom;
		
		if(centertop < offset)
			return;
		
		$mtop = $("<div></div>").css("padding-top", 100).animate({
			"padding-top": 0
		}, 800, function() {
			$(this).remove();
			$this.data("fadein-top", null);
		});
		
		$mbottom = $("<div></div>").css("margin-top", -100).animate({
			"margin-top": 0
		}, 800, function() {
			$(this).remove();
			$this.data("fadein-bottom", null);
		});
			
		$this.removeClass("fade-in-on-scroll").addClass("done-fade-in-on-scroll").data({
			"fadein-top": $mtop,
			"fadein-bottom": $mbottom
		}).css({
			"visibility": "visible"
		}).before($mtop).after($mbottom).animate({
			"opacity": 1
		}, 800);
	});
	
	$(".fade-out-on-scroll").each(function() {
		var $this = $(this),
			offset = $this.offset().top;
		
		if(centertop >= offset)
			$this.removeClass("fade-out-on-scroll").addClass("done-fade-out-on-scroll").slideUp(800).animate({
				"opacity": 0
			}, 800).slideUp(800);
	});
});

$.fadein.reset = function() {
	$(".done-fade-in-on-scroll").stop().removeClass("done-fade-in-on-scroll").addClass("fade-in-on-scroll").css("visibility", "hidden").css("opacity", 0).each(function() {
		var $this = $(this),
			$mtop = $($this.data("fadein-top")),
			$mbottom = $($this.data("fadein-bottom"));
		
		$this.data({
			"fadein-top": null,
			"fadein-bottom": null
		});
		$mtop.stop().remove();
		$mbottom.stop().remove();
	});
	$(".done-fade-out-on-scroll").stop().removeClass("done-fade-out-on-scroll").addClass("fade-out-on-scroll").css("display", "block").css("opacity", 1);
};

$.fadein.refresh();
