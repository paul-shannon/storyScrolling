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
             $('#commentsDiv').text("spəq̓ʷabs")
             }
          },
      offset: 300
     })
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("spəq̓ʷabs")
             }
          },
      offset: '-50%'
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("This is the text of a one-page summary inserted into Claude Levi-Strauss's Pensee Sauvage, 1962. 'Savage Mind' was the original English translation of the title, revised in the 2021 translation by Mehlman and Leavitt.")
             }
          },
      offset: 300
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("This is the text of a one-page summary inserted into Claude Levi-Strauss's Pensee Sauvage, 1962. 'Savage Mind' was the original English translation of the title, revised in the 2021 translation by Mehlman and Leavitt.")
             }
          },
      offset: '-50%'
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#commentsDiv').text("pure stand, hatchery valley")
             }
          },
      offset: 300
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#commentsDiv').text("pure stand, hatchery valley")
             }
          },
      offset: '-50%'
     })


})

