var state = {
   videoHeight: 250,           // initial size, adjusted by slider
   }


//----------------------------------------------------------------------------------------------------
function refreshLayout()
{
   console.log("--- refreshLayout")
   state.windowHeight = $(window).height();
   state.windowWidth = $(window).width();
   state.commentsDivWidth = 300
   state.horizontalMargins = 50;
   console.log("window: " + state.windowHeight + " x " + state.windowWidth);

   $("#commentsDiv").height(state.windowHeight - 50)
   $("#commentsDiv").width(state.commentsDivWidth)


   // $("#contentDiv").height(state.windowHeight - 150)

   var newImageWidth = state.windowWidth -
       (state.commentsDivWidth + state.horizontalMargins);
    $("#contentDiv").width(newImageWidth);
   // $("#contentDiv").css({'margin-left': '140px','margin-right': '10px'})

} // refreshLayout
//----------------------------------------------------------------------------------------------------
$('document').ready(function(){

   $(window).on( "resize", function() {
      refreshLayout();
      });

   refreshLayout()
   console.log("--- ready")
//----------------------------------------------------------------------------------------------------
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("From the Greek, literally 'exercise', here 'self-formation' is the connation I am after.")
             }
          },
      offset: 300
     })
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("From the Greek, literally 'exercise', here 'self-formation' is the connation I am after.")
             }
          },
      offset: '-50%'
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("Hazelnut branch")
             }
          },
      offset: 300
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("Hazelnut branch")
             }
          },
      offset: '-50%'
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("windfall trail looking east, tim & others")
             }
          },
      offset: 300
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("windfall trail looking east, tim & others")
             }
          },
      offset: '-50%'
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("Warren KingGeorge")
             }
          },
      offset: 300
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("Warren KingGeorge")
             }
          },
      offset: '-50%'
     })


})

