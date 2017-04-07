/* global paper */
/* global $ */
/*------------------------------------------------------------
	point adding and moving functions
------------------------------------------------------------*/
function dist(p1, p2){
	return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))
}


function getNearPointIndex(p1, path, maxDist){
	if (!path) return;
	// return point that is within x distance
	// if no point found, return null
	var segments = path.segments
	// go through the list backwards so that you get the more 
	// recently placed points first
	for (var i=segments.length-1; i >= 0; i--){
		var p2 = segments[i].point
		if (dist(p1, p2) <= maxDist)
			return i;
	}
}


function getNearPoint(p1, path, maxDist){
	var i = getNearPointIndex(p1, path, maxDist);
	if (i!=null) return path.segments[i].point;
}


function getNearCord(p1, path, maxDist){
	var ch = paper.project.activeLayer.children;
	var path = ch[0];
	var i = getNearPointIndex(p1, path, maxDist);
	if (i==null) return;
	var cord = new Object();
	cord.point = path.segments[i].point;
	cord.text  = ch[i+1];
	return cord;
}

function mkCord(point, textvisible=true){
	point.x = Math.floor(point.x);
	point.y = Math.floor(point.y);
	var cord = new Object();
	var ch = paper.project.activeLayer.children;
	var path = ch[0];
	var points = path.segments;
	path.add(point);
	cord.point = points[points.length-1];
	var text = new paper.PointText(point);
	text.fillColor = 'black';
	var scaled = scale(point, 12);
	text.content = "(" + round(scaled.x, 2) + ", " + round(scaled.y, 2) + ")";
	text.visible = textvisible;
	// the text is the most recent point in the array
	var ch = paper.project.activeLayer.children;
	cord.text  = ch[ch.length-1]; 
	return cord;
}


function getPointfromUser(){
	var xy = prompt("Enter new (X Y) point.");
    if (xy)
    	var xy = xy.split(" ");
    var x = parseFloat(xy[0]);
    var y = parseFloat(xy[1]);
    console.log(x, y)
    if (!isNaN(x) && !isNaN(y))
        return new paper.Point(x, y);
    else alert("entered wrong.")
}

function moveCord(cord, newpoint){
	cord.point.x = newpoint.x;
	cord.point.y = newpoint.y;
	cord.text.point.x  = newpoint.x
	cord.text.point.y  = newpoint.y
	var scaled = scale(newpoint, 12);
	cord.text.content = "(" + round(scaled.x, 2) + ", " + round(scaled.y, 2) + ")";
	return cord;
}

function redrawCords(){
	var numCords = paper.project.activeLayer.children.length
	// delete any cords drawn so far
	for (var i=1; i<numCords; i++)
		paper.project.activeLayer.children[1].remove();
	// draw new cords
	var segments = paper.project.activeLayer.children[0].segments
	for (var i=0; i<segments.length; i++){
		var point = segments[i].point;
		var text = new paper.PointText(point);
		text.fillColor = 'black';
		var scaled = scale(point, 12);
		text.content = "(" + round(scaled.x, 2) + ", " + round(scaled.y, 2) + ")";
	}
}

function rmLastCord(){
	var ch = paper.project.activeLayer.children;
	if (ch.length==0) return;
	var segments = ch[0].segments;
	segments[segments.length-1].remove();
	var text = ch[ch.length-1];
	text.remove();
}

function scale(point, gridSize, dir="down"){
	var width = $("#myCanvas").width();
	var scalingFactor = width / gridSize;
	(dir == "down") ?
		point = point.divide(scalingFactor) :
		point = point.multiply(scalingFactor);
	point.y = -point.y;
	return point;
}

function scaleNum(num, gridSize, dir="down"){
	var width = $("#myCanvas").width();
	var scalingFactor = width / gridSize;
	(dir == "down") ?
		num /= scalingFactor :
		num *= scalingFactor;
	return num;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function cordsVisible(visible){
	var len = paper.project.activeLayer.children.length;
	for (var i=1; i<len; i++)
    	paper.project.activeLayer.children[i].visible = visible;
}

function cloneLastLayer(){
	var numLayers = paper.project.layers.length;
	var segs = paper.project.layers[numLayers-2].children[0].segments
	for (var i=0; i<segs.length; i++)
		mkCord(segs[i].point);
}