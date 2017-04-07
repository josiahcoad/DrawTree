/*global $ Path Point project Layer getNearPoint drawGrid rmLastCord*/
/*global addCords getNearCord mkCord getPointfromUser moveCord*/

/*=========================================================================
	CANVAS JS
=========================================================================*/

/*............ GLOBALS ............*/
// Keeps track if the user is dragging a point
// will be set to the point that the user is dragging
var selectedCord = null;
// Snap to the grid Points (set by the addGridPoints)



/*===================================================================
    jQuery for when page loads
===================================================================*/


$( document ).ready(function(){
	newProject();
})

/*===================================================================
	Mouse Events
	- edits globals: dragging (Point object) , path (Paper.js object)
===================================================================*/

function onMouseDown(event) {
	var path = project.activeLayer.children[0];
	// if mouse down is close to (virtually on top of an existing point)
	// assuming the user is selecting that point either for dragging or edit
	var mousePos = event.point;
	var selectedCord = getNearCord(mousePos, path, 5);
	if (!selectedCord) {
		mkCord(event.point)
		// if adding first point, add selected box to see it
		if (path.segments.length == 1)
			path.segments[0].point.selected = true;
	}
}

function onMouseDrag(event) {
	var path = project.activeLayer.children[0];
	if (selectedCord)
		moveCord(selectedCord, event.point)
	else {
		// snap to near point if there is one
		var newpoint = event.point;
		var gridPoints = $("#myCanvas").data("gridPoints");
		var gridpoint = getNearPoint(newpoint, gridPoints, 5);
		var nearpoint = getNearPoint(newpoint, path, 5);
		var newpoint = nearpoint || gridpoint || newpoint;
		// add cordinates and point
		rmLastCord();
		mkCord(newpoint);
	}
}

function onMouseUp(event) {
	if (event.point == event.downPoint && selectedCord){
		var p = getPointfromUser();
		if (p)
			moveCord(selectedCord, event.point);
	}
	selectedCord = null;
}