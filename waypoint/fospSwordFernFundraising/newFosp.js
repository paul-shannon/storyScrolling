var state = {
   videoHeight: 250,           // initial size, adjusted by slider
   }


//----------------------------------------------------------------------------------------------------
function refreshLayout()
{
   console.log("--- refresh")
   state.windowHeight = $(window).height();
   state.windowWidth = $(window).width();
   state.textDivWidth = 300
   state.horizontalMargins = 50;
   console.log("window: " + state.windowHeight + " x " + state.windowWidth);

   $("#textDiv").height(state.windowHeight - 50)
   $("#textDiv").width(state.textDivWidth)


   // $("#imageDiv").height(state.windowHeight - 150)

   var newImageWidth = state.windowWidth -
       (state.textDivWidth + state.horizontalMargins);
    $("#imageDiv").width(newImageWidth);
   // $("#imageDiv").css({'margin-left': '140px','margin-right': '10px'})

} // refreshLayout
//----------------------------------------------------------------------------------------------------
$('document').ready(function(){

   $(window).on( "resize", function() {
      refreshLayout();
      });

   refreshLayout()
   console.log("--- ready")
   var s = $('.section');
   var nav = $('ul li a');

   $("#textDiv").text("The 120 acre old-growth forest initial")

   $("#iv").waypoint

   $("#section0Div").waypoint({
       handler: function(direction){
          console.log("top image, direction: " + direction)
          if(direction === "up"){
              $("#textDiv").text("very top")
          }},
      offset: 0
     })

   $("#section1Div").waypoint({
       handler: function(direction){
          if(direction === "up"){
             $("#textDiv").text("(up)mage from film")
             }
          if(direction === "down"){
              $("#textDiv").text("(down) image from film")
          }},
      offset: 0
     })

   $("#section2Div").waypoint({
       handler: function(direction){
           console.log("pure stand, direction: " + direction);
           if(direction === "down"){
               $("#textDiv").text("pure stand down")
           }},
       offset: 200  // triggers when top is 100px from viewport
     })


   $("#section2Div").waypoint({
       handler: function(direction){
          console.log("pure stand: " + direction);
           if(direction === "up"){
               $("#textDiv").text("pure stand up")
           }},
           // trigger when the top of the element is 50% of the way from
           // the top of the window, or simply put, hits the middle of the window.
       offset: "-50%" 
     })

   $("#section2aDiv").waypoint({
       handler: function(direction){
           if(direction === "down"){
               $("#textDiv").text("2017 down")
           }},
       offset: 200
     })

   $("#section2aDiv").waypoint({
       handler: function(direction){
           if(direction === "up"){
           $("#textDiv").text("2017 up")
           }},
       offset: "-50%"
     })

   $("#section2bDiv").waypoint({
       handler: function(direction){
           if(direction === "down"){
               $("#textDiv").text("map down")
           }},
       offset: 200
     })

   $("#section2bDiv").waypoint({
       handler: function(direction){
           if(direction === "up"){
           $("#textDiv").text("map up")
           }},
       offset: "-50%"
     })

   $("#section2cDiv").waypoint({
       handler: function(direction){
           if(direction === "down"){
               $("#textDiv").text("warren down")
           }},
       offset: 200
     })

   $("#section2cDiv").waypoint({
       handler: function(direction){
           if(direction === "up"){
           $("#textDiv").text("warren up")
           }},
       offset: "-50%"
     })

   $("#section3Div").waypoint({
       handler: function(direction){
           console.log("before and after, direction: " + direction);
           $("#textDiv").text("before and after")
          },
       offset: "30%"
     })

   $("#section3Div").waypoint({
       handler: function(direction){
           console.log("before and after, direction: " + direction);
           if(direction === "down"){
               $("#textDiv").text("before and after")
           }},
       offset: 25
     })

   $("#section3Div").waypoint({
       handler: function(direction){
           console.log("before and after, direction: " + direction);
           if(direction === "up"){
               $("#textDiv").text("before and after")
           }},
       offset: -25
     })


   $("#section4Div").waypoint({
       handler: function(direction){
          console.log("4div reached");
          $("#textDiv").text("healthy pure stand, 2019")
          },
       offset: 0
     })

   $("#section5Div").waypoint({
       handler: function(direction){
           $("#textDiv").text("2022, looking east")
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
