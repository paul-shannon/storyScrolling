$('document').ready(function(){

   var s = $('.section');
   var nav = $('ul li a');
   console.log("--- ready")
   $("#text1").hide()
   $("#text2").hide()
   $("#text5").hide()

   $("#section2Div").waypoint({
       handler: function(direction){
           console.log("section2 waypoint")
           $("#text2").hide()
           $("#text5").hide()
           $("#text1").hide()
          },
       offset: 0
     })

   $("#section3Div").waypoint({
       handler: function(direction){
           console.log("text1 waypoint")
           $("#text2").hide()
           $("#text5").hide()
           $("#text1").show()
          },
       offset: 0
     })

   $("#section4Div").waypoint({
       handler: function(direction){
           console.log("section4Div waypoint")
           $("#text2").show()
           $("#text1").hide()
           $("#text5").hide()
          },
       offset: 0
     })

   $("#section5Div").waypoint({
       handler: function(direction){
           console.log("section5Div waypoint")
           $("#text2").hide()
           $("#text1").hide()
           $("#text5").show()
          },
       offset: 0
     })

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
    });

/******
(function($){
   $('li a').click(function(){
      console.log($(this).attr('id'));
      $('body').scrollTop($(this).attr('id'));
      });
   });
*******/
