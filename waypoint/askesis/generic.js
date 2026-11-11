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

   $("#textDiv").text("The 120 acre old-growth forest initial")

$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text('pure stand, hatchery valley')
             }
          },
      offset: 200
     })
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text('pure stand, hatchery valley')
             }
          },
      offset: '-50%'
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text('windfall trail looking east, tim & others')
             }
          },
      offset: 200
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text('windfall trail looking east, tim & others')
             }
          },
      offset: '-50%'
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text('Warren KingGeorge')
             }
          },
      offset: 200
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text('Warren KingGeorge')
             }
          },
      offset: '-50%'
     })


})

