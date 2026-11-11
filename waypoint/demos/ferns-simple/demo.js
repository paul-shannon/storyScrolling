$('document').ready(function(){

   var s = $('.section');
   var nav = $('ul li a');

    $("#div01").waypoint({
        handler: function(direction){
           console.log("waypoint div01: " + direction)
           },
        offset: '35%'
        })
    
    $("#div02").waypoint({
        handler: function(direction){
           console.log("waypoint div02: " + direction)
           },
        offset: '35%'
        })
    
    $("#div03").waypoint({
        handler: function(direction){
           console.log("waypoint div03: " + direction)
           },
        offset: '35%'
        })
    
    $("#div04").waypoint({
        handler: function(direction){
           console.log("waypoint div04: " + direction)
           },
        offset: '35%'
        })
    
    /*********
   s.waypoint({
      handler: function(direction){
         var active = $(this);
         if(direction == 'up')
            active = active.prev();
         console.log("active.attr: " + active.attr)
         var active_link = $('ul li a[href="#'+active.attr('id')+'"]');
         nav.parent().removeClass('active');
         active_link.parent().addClass('active');
         },
      offset: '35%'
      });
    **********/
    });
 
/******
(function($){
   $('li a').click(function(){
      console.log($(this).attr('id'));
      $('body').scrollTop($(this).attr('id'));
      });
   });
*******/
