/* global gridSpacing paper $*/

function resizeCanvas(bedSize){
	// makes the bounds of the canvas fit the print bed
	// doesn't work too well cause the text ends up being way too big
	var width = $("#myCanvas").css("width");
	width = parseFloat(width.substring(0, width.length-2));
	var fit = width / bedSize;
	// paper.project.view.zoom = fit;
}

function addVertLine(x, range, color){
	var from = new paper.paper.Point(x, -range);
	var to = new paper.Point(x, range);
	var path = new paper.Path.Line(from, to);
	path.strokeColor = color;
}
function addHorizLine(y, range, color){
	var from = new paper.Point(-range, y);
	var to = new paper.Point(range, y);
	var path = new paper.Path.Line(from, to);
	path.strokeColor = color;
}


function addGridPoints(gridSpacing, range){
	// add points at intersection of grid lines for grid
	var segs = [];
	var lineNum = Math.floor(range/gridSpacing);
	for (var xpos=-lineNum; xpos<=lineNum; xpos+=1){
		for (var ypos=-lineNum; ypos<=lineNum; ypos+=1){
			segs.push(new paper.Point(xpos*gridSpacing, ypos*gridSpacing))
		}
	}
	// new Path will add a new path to the first layer
	// because first layer is the one that's activated when this f is called
	var gridPoints = new paper.Path(segs);
	$("#myCanvas").data("gridPoints", gridPoints);
}

function drawMajor(range){
	// x axis
	addHorizLine(0, range, 'black');
	// y axis
	addVertLine(0, range, 'black');
}

function drawMinor(gridSpacing, range){
	// minor grids
	var gray = "#efefef";
	var minorLines = range / gridSpacing;
	for (var i=1; i<minorLines; i++){
		addVertLine(i*gridSpacing, range, gray);
		addVertLine(-i*gridSpacing, range, gray);
		addHorizLine(i*gridSpacing, range, gray);
		addHorizLine(-i*gridSpacing, range, gray);
	}
}

function drawGrid(gridSpacing){
	// add the gridSpacing data to the canvas for access later
	// avoids global variables this way
	//=======
	var width = $("#myCanvas").width();
	var gridSize = 12;
	var scalingFactor = width / gridSize;
	gridSpacing *= scalingFactor;
	//=======

	$("#myCanvas").data("gridSpacing", gridSpacing);
	var layers = paper.project.layers;
	var first = layers[0];
	first.activate();
    first.children = [];
	var width = $("#myCanvas").css("width");
	width = parseFloat(width.substring(0, width.length-2));
	var range = width / 2;
	drawMinor(gridSpacing, range);
	drawMajor(range);
	addGridPoints(gridSpacing, range);
	var last = layers[layers.length-1];
	last.activate();
}

function removeGrid(){
	var first = paper.project.layers[0];
	var len = first.children.length;
	var majorAxis = first.children.slice(len-3, len-1);
	first.children = majorAxis;
	// removeGridPoints();
}

function removeGridPoints(){
	$("#myCanvas").data("gridPoints", null);
}