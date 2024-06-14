$('document').ready(function(){

	var s = $('.section');
	var nav = $('ul li a');
	s.waypoint({
		handler: function(direction){
			var active = $(this);
			if(direction == 'up')
				active = active.prev();
			var active_link = $('ul li a[href="#'+active.attr('id')+'"]');
			
		
			nav.parent().removeClass('active');
			active_link.parent().addClass('active');
		},
		offset: '35%'
	});

});
(function($){
	$('li a').click(function(){
		console.log($(this).attr('id'));
		//$('body').scrollTop($(this).attr('id'));
	});
});