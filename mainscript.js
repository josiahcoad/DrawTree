/*global $ paper swal drawGrid*/



/*=========================================================================
===========================================================================
                                                                          
                      -------MAIN SCRIPT-------                           
                                                                          
===========================================================================
===========================================================================*/





/*===========================================================================
  Side Nav
    - Opens and Closes Nav Bar
===========================================================================*/

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "210px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    // document.canvas.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.backgroundColor = "white";
    // document.canvas.style.backgroundColor = "white";
}



/*===========================================================================
  Layer Management
    - Enables User to Add, Remove, and Select Layers
===========================================================================*/

function addListLayer() {
  // screenshotCanvas();
  // add 1 to the layers number in the layer-list
  var chNum = $("#layer-list").data("numLayers");
  $("#layer-list").data("numLayers", chNum+=1);
  var colors = $("#layer-list").data("colorList");
  var defaultColor = colors[(chNum-1)%colors.length];
  var newListLayer =  $('<div></div>');
  newListLayer.attr("id", "layer" + chNum);
  newListLayer.addClass("well layer");
  var layerImg =  $('<div class="imgdiv layer well"></div>');
  layerImg.css("background-color", defaultColor);
  $("canvas").css("border-color", defaultColor);
  var layerTitle = '<p contenteditable="true">Layer '+chNum+'</p>';
  newListLayer.append(layerImg);
  newListLayer.append(layerTitle);
  // If this is NOT the first canvas layer, save old canvas layer
  if (paper.project.layers.length != 1){
    $(".selected").data("canvasLayer", paper.project.activeLayer);
    paper.project.activeLayer.children[0].selected = false;
    paper.project.activeLayer.children[0].strokeColor = "#d4dadd";
    cordsVisible(false);
  }

  $("#layer-list").children().removeClass("selected");
  $(newListLayer).addClass("selected");

  new paper.Layer();
  new paper.Path();
  paper.project.activeLayer.children[0].selected = true;

  // if (paper.project.layers.length == 2) $(".selected").data("canvasLayer", paper.project.activeLayer);
  $("#layer-list").prepend(newListLayer);
  // Add a jQuery click listener
  $("#layer" + chNum).click(function(){ transferSelected(this) });
}

function transferSelected(listLayer){
  if ($(listLayer).hasClass("selected")) return;
  // Canvas Stuff
  $(".selected").data("canvasLayer", paper.project.activeLayer);
  paper.project.activeLayer.children[0].selected = false;
  paper.project.activeLayer.children[0].strokeColor = "#d4dadd";
  cordsVisible(false);
  // Switch selection html class
  $("#layer-list").children().removeClass("selected");
  $(listLayer).addClass("selected");
  //Changes Border Color on Canvas
  var newColor = $(".selected .imgdiv").css("background-color");
  $("canvas").css("border-color", newColor);
  
  $(".selected").data("canvasLayer").activate();
  paper.project.activeLayer.children[0].selected = true;
  cordsVisible(true);
  
}

// Popup to delete a layer
function deleteConfirm() {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this layer!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
    function(){
			removeLayer();
    });
}

// Deletes the active layer because active layer is the selected one
function removeLayer(){
    if ( $('#layer-list').children().length == 0 ) return;
    paper.project.activeLayer.remove();
    $('.selected').remove();
    var i = $('.selected').index();
    // if ( $('#layer-list').children().length == 0 ) {
        // setTimeout(function() { addListLayer(); }, 200);
    // }
    // transferSelected($("#layer-list").children()[i+1]);
    transferSelected($("#layer-list").children()[0]);
}


/*===========================================================================
  Canvas Manipulation
    - New Part - Starts a new Canvas and Grid
    - Handles Draw Setting Checkboxes
===========================================================================*/

// Handles Draw Setting Checkboxes
function gridCBClicked(cb){
    var sz = parseFloat($('#grid-size').val());
    if (cb.checked){
      $('#cb-snap').prop('checked', true);
      drawGrid(sz);
      $('#cb-snap').prop("disabled", false);
    }
    else {
      $('#cb-snap').prop('checked', false);
      removeGrid();
      $('#cb-snap').prop("disabled", true);
    }
}

// Starts a new part
function newPartConfirm() {
    swal({
      title: "Are you sure?",
      text: "This will delete the current part",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, start a new part",
      closeOnConfirm: true
    },
    function(){
      paper.project.clear();
      newProject();
    });
}



/*===========================================================================
  Matrix Dropdown Box
===========================================================================*/

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function matrixDropdownToggle() {
    document.getElementById("matrix-dropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



/*===========================================================================
  Misc.
===========================================================================*/

// Popup which allows user to select a material
function materialSelect() {
    swal({
      title: "Our Materials",
      text: '<div id="placeholder"></div>',
      showCancelButton: true,
      showConfirmButton: false,
      html: true
    });
    $("#placeholder").load("popups/materialselect.html");
}

//Popup to get more info on shortcuts ans such
function help() {
    swal({
      title: "Help",
      text: '<div id="placeholder"></div>',
      showCancelButton: true,
      showConfirmButton: false,
      html: true,
      cancelButtonText: "Close"
    });
    $("#placeholder").load("popups/help.html");
}


//Is called on Document Load - Sets eveything in place with style
function animatePageLoad(){
  $("#company").animate({left: '15px'}, 1000);
  $("#navigation-bar").animate({top: '0px'}, 700);
  $("#dropdown").animate({top: '0px'}, 700);
  $("#right-col").animate({right: '0px'}, 800);
  $("#myCanvas").animate({opacity: '1'});
  $("#part-name").animate({opacity: '1'}, 2000);

}

//Side-Nav presets for shapes
function preShapeSelected(e){
  switch(e.attr("id")) {
    case "polygon":
        var n = parseInt(prompt("Enter number of sides."));
        var rad = parseInt(prompt("Enter radius."));
        rad = scaleNum(rad, 12, "up");
        addPolygon(n, rad);
        break;
  }
  closeNav();
}


/*===========================================================================
  Document Ready
===========================================================================*/

$(document).ready(function(){
  animatePageLoad();
  // Set Data
  $('.tooltipster').tooltipster({ theme: 'tooltipster-light' }); 
  $('[data-toggle="tooltip"]').tooltip({container: 'body'});
  var colorList = ["#61bd4f", "#0079bf", "#eb5a46", "#c377e0", "#f2d600",
                    "#51e898", "#ff80ce", "#ffab4a", "#00c2e0"];
  $("#layer-list").data("colorList", colorList);
  // ======= Attach Event Handlers =======
  $(".layer").click(function(){ transferSelected(this) });
  $('#cb-grid').change(function(){ gridCBClicked(this) });
  $('.preset-shape').click(function(){ preShapeSelected($(this))});
  // enter pressed to enter new grid size
  $('#grid-size').on("keypress", function (e) { 
      if (e.which == 13){
        var sz = parseFloat($('#grid-size').val());
        drawGrid(sz);
      }
  });
  // Makes logo rotate on hover
  $("#company").hover(
  function(){ $("#logoimg").rotate({animateTo:-180}, 10); 
  }, function(){ $("#logoimg").rotate({animateTo:0}, 10); }
  );
});