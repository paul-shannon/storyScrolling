$(document).ready(function(){
    console.log("document ready")
    $('#image').on('wheel', function(event){
        event.preventDefault();
        console.log("mousewheel")
    })
})
