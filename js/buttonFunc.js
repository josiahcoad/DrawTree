/*global $ drawGrid paper path rmLastCord*/

/*===================================================================
	Buttons and Keyboard Shortcuts
	- 3 Buttons: Download, New Path, Screenshot
	- Keyboard shortcuts: s-screenshot, backspace-remove last point
===================================================================*/

$(document).ready(function(){
	$("#screenshotBtn").click(function() {  
    	var canvas = document.getElementById('myCanvas');
    	var dataURL = canvas.toDataURL();
    	$("body").prepend("<img id='screenshotImg' src=" + dataURL + ">")
    });
    
    // $("#newlayerBtn").click(function() { 
    // 	new paper.Layer();
    // 	new paper.Path();
    // });
    
    $("#download").click(function() { download() });
    
    $("#addgrid").click(function() { 
        var spacing = parseFloat(prompt("What grid spacing?"));
        if (spacing) drawGrid(spacing);
    });
    
    // $("#add-sign").click(function() {  });
    
    // show bootstrap buttons as depressed when mouseup
    $(".btn").mouseup(function(){ $(this).blur(); })
    
    
    /*===================================================================
        Keyboard Shortcuts
    ===================================================================*/
    
    $(document).on('keyup keydown', function(e){
        $(document).data("shiftDown", e.shiftKey);
        $(document).data("altDown", e.altKey);
        $(document).data("ctrlDown", e.ctrlKey);
    });
    
    
    $(document).on("keypress", function (e) {
        if ($(document).data("ctrlDown")){
            console.log(e.which);
            switch(e.which){
                case 116: // t pressed
                  // toggle check box for showing cords
                  var oldval = $('#cb-cord').prop('checked');
                  $('#cb-cord').prop('checked', !oldval);
                  cordsVisible(!oldval);
                  break;
                case 115: // s
                    $("#screenshotBtn").click();
                    break;
                case 99: // c
            		addListLayer();
            		cloneLastLayer();
            		break;
                case 117: // u
            		uploadCSV();
            		break;
                case 110: // n
                    $("#add-sign").click();
                    break;
                case 100: // d
                    $("#remove-sign").click();
                    break;
            }
        }
    });


    // backspaces can only be caught with mouse up
    $(document).keyup( function(e){
        // backspace pressed with ctrl
    	if (e.keyCode == 8 && $(document).data("ctrlDown")){ 
    		rmLastCord();
    	}
    }); 
    

}) // closing the doc reaady


/*===================================================================
    Functions Triggered by Button Presses
===================================================================*/

// download the points so that python can create the gCode
function convertToCSV(path){
	var segments = path.segments
	var text = "";
	for (var i=0; i < segments.length; i++){
		var p = scale(segments[i].point, 12);
		text += round(p.x, 3) + "," + round(p.y, 3) + "\n";
	}
	return text;
}

function uploadCSV(filename){
    var filename = prompt("What is the full filename.");
}

function download() {
    var filename = $("#part-name").text()
    var path = paper.project.activeLayer.children[0];
	var text = convertToCSV(path);
	// make a new anchor tag, add it to DOM, auto-click it and remove it
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}


function newProject(){
    // by default there is no grid snap points
	$("#myCanvas").data("gridPoints", null);
	// make 0,0 the center of the canvas
    // paper.project.view.viewSize = new paper.Size(300, 300);
	paper.project.view.center = new paper.Point(0, 0);
	new paper.Layer();
	var sz = parseFloat($('#grid-size').val());
	drawGrid(sz);
	$("#layer-list").html("");
	$("#layer-list").data("numLayers", 0);
	$("#part-name").html("My Part");
	addListLayer();
}


/*===================================================================
    Layer Manipulation
===================================================================*/

function saveSelectedLayer(){
    // called by new layer before adding or selectng a new layer
    $(".selected").data("canvasLayer", paper.project.activeLayer)
}

function hideActiveLayer(){
    // set current active layer to invisible
    paper.project.activeLayer.visible = false;
}

function activateSelectedLayer(){
    // activate the newly selected layer
    $(".selected").data("canvasLayer").activate();
}

function removeSelectedLayer(){
    $(".selected").data("canvasLayer").remove();
}

function screenshotCanvas(){
	var canvas = document.getElementById('myCanvas');
	var dataURL = canvas.toDataURL("image/jpeg");
	$("#screenshot1").attr("src", dataURL);
    // change black background to white
}

function newCanvasLayer(){
    // sets current layer to invisible and adds a new layer to canvas
    new paper.Layer();
    new paper.Path();
}

function deleteCanvasLayer(){
    // deletes currently selected layer
    $(".selected").data("canvasLayer").remove();
}


/*===================================================================
    Add Pre-shapes
===================================================================*/

function addPolygon(numSides, radius, center=[0,0]){
	var pi = Math.PI; var cos = Math.cos; var sin = Math.sin;
	var thetaStep = (2*pi)/numSides;
	for (var i=0; i<=numSides; i++){
		var x = center[0] + radius * cos(thetaStep*i);
		var y = center[1] + radius * sin(thetaStep*i);
		mkCord(new paper.Point(x, y), false);
		var path = paper.project.activeLayer.children[0];
		if (path.segments.length == 1)
			path.segments[0].point.selected = true;

	}
}