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
             $('#textDiv').html("Novelist Jim Harrison quotes Neil Claremon, in his foreword to Robert Bringhurt's Tree of Meaning - Language, Mind and Ecology.")
             }
          },
      offset: 200
     })
$('#section1').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("Novelist Jim Harrison quotes Neil Claremon, in his foreword to Robert Bringhurt's Tree of Meaning - Language, Mind and Ecology.")
             }
          },
      offset: '-50%'
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("need to track down sources")
             }
          },
      offset: 200
     })
$('#section2').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("need to track down sources")
             }
          },
      offset: '-50%'
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("This is the text of a one-page summary inserted into Claude Levi-Strauss's Pensee Sauvage, 1962. 'Savage Mind' was the original English translation of the title, revised in the 2021 translatin by Mehlman and Leavitt.")
             }
          },
      offset: 200
     })
$('#section3').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("This is the text of a one-page summary inserted into Claude Levi-Strauss's Pensee Sauvage, 1962. 'Savage Mind' was the original English translation of the title, revised in the 2021 translatin by Mehlman and Leavitt.")
             }
          },
      offset: '-50%'
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("kenneth rexroth once described the source of Native American poetry   in a way that perfectly describes the source of his own mountain poems (from david hinton, the wilds of poetry, p76)")
             }
          },
      offset: 200
     })
$('#section4').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("kenneth rexroth once described the source of Native American poetry   in a way that perfectly describes the source of his own mountain poems (from david hinton, the wilds of poetry, p76)")
             }
          },
      offset: '-50%'
     })
$('#section5').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("Concluding lines of Gary Snyder's 1974 poem, Front Lines.")
             }
          },
      offset: 200
     })
$('#section5').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("Concluding lines of Gary Snyder's 1974 poem, Front Lines.")
             }
          },
      offset: '-50%'
     })
$('#section6').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("From Transformer - The Deep Chemistry of Life and Death, Nick Lane, p66")
             }
          },
      offset: 200
     })
$('#section6').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("From Transformer - The Deep Chemistry of Life and Death, Nick Lane, p66")
             }
          },
      offset: '-50%'
     })
$('#section7').waypoint({
       handler: function(direction){
          if(direction === 'down'){
             $('#textDiv').html("<h3>Big Trees, Burned Bark</h3> Doug-firs start out as tiny seedlings – like the one pictured below – taking root in bare ground beneath an open sky after a stand-replacing fire.  They then live for centuries. <p>After 200 years, with thick furrowed bark, they can survive all but the most severe fires.  <p>The mature tree in the video, like many of its cousins, started life on the Seward (Lushootseed “sbəqʷábs“) peninsula after a huge regional fire in 1508. <p>The seedling pictured above shows how our big firs looked one year after that fire, sprouting on bare ground in mineralize soil beneath an open sky. In the concluding drone shot, our tree is at the center with a broken top, other big firs all around. <p>Another regional fire – not quite so severe – followed two hundred years later, in 1701. Our “class of 1500” firs had by then acquired thick, fire-resistant, deeply furrowed bark.  This second fire left the burn marks which we see today, 300 years later. Almost everything else burned to the ground in that 1701 fire. <p>A hundred firs and a few cedars survived. The woody rhizomes of sword ferns, tucked away safely underground, probably allowed them to survive the fire as well.")
             }
          },
      offset: 200
     })
$('#section7').waypoint({
       handler: function(direction){
          if(direction === 'up'){
             $('#textDiv').html("<h3>Big Trees, Burned Bark</h3> Doug-firs start out as tiny seedlings – like the one pictured below – taking root in bare ground beneath an open sky after a stand-replacing fire.  They then live for centuries. <p>After 200 years, with thick furrowed bark, they can survive all but the most severe fires.  <p>The mature tree in the video, like many of its cousins, started life on the Seward (Lushootseed “sbəqʷábs“) peninsula after a huge regional fire in 1508. <p>The seedling pictured above shows how our big firs looked one year after that fire, sprouting on bare ground in mineralize soil beneath an open sky. In the concluding drone shot, our tree is at the center with a broken top, other big firs all around. <p>Another regional fire – not quite so severe – followed two hundred years later, in 1701. Our “class of 1500” firs had by then acquired thick, fire-resistant, deeply furrowed bark.  This second fire left the burn marks which we see today, 300 years later. Almost everything else burned to the ground in that 1701 fire. <p>A hundred firs and a few cedars survived. The woody rhizomes of sword ferns, tucked away safely underground, probably allowed them to survive the fire as well.")
             }
          },
      offset: '-50%'
     })


})

