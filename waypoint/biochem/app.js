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

$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text("Tetrahedral CH4 has 109.5 degree angles, average bond length of 0.134 nm")
             }
          },
      offset: 200
     })
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text("Tetrahedral CH4 has 109.5 degree angles, average bond length of 0.134 nm")
             }
          },
      offset: '-50%'
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text("")
             }
          },
      offset: 200
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text("")
             }
          },
      offset: '-50%'
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text("")
             }
          },
      offset: 200
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text("")
             }
          },
      offset: '-50%'
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').text("")
             }
          },
      offset: 200
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').text("")
             }
          },
      offset: '-50%'
     })


})

