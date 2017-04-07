/*global $ Path Point project Layer getNearPoint drawGrid rmLastCord*/
/*global addCords getNearCord mkCord getPointfromUser moveCord newProject*/

/*............ GLOBALS ............*/
// Keeps track if the user is dragging a point
// will be set to the point that the user is dragging
// only used by this file
var selectedCord = null;

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

function snapPoint(newpoint){
	// snap to near point if the snap (and grid) are turned on
	var gridpoint = null;
	if ($('#cb-snap').prop('checked')) {
		var gridPoints = $("#myCanvas").data("gridPoints");
		var gridpoint = getNearPoint(newpoint, gridPoints, 5);
	}
	var path = project.activeLayer.children[0];
	var pathpoint = getNearPoint(newpoint, path, 5);
	return pathpoint || gridpoint || newpoint;
}

function onMouseDown(event) {
	if ($(document).data("shiftDown") || $(document).data("altDown")){
		paper.project.activeLayer.children[0].selected=true;
	}
	else{
		if ($('#cb-draw').prop('checked'))
			mkCord(event.point);
		else{
			var path = project.activeLayer.children[0];
			// if mouse down is close to (virtually on top of an existing point)
			// assuming the user is selecting that point either for dragging or edit
			var mousePos = event.point;
			selectedCord = getNearCord(mousePos, path, 5);
			if (selectedCord) selectedCord.point._owner.selected = true;
			if (!selectedCord) {
				mkCord(event.point)
			}
		}
	}
}

function onMouseDrag(event) {
	if ($(document).data("altDown")){
		var center = paper.project.activeLayer.children[0].position;
		paper.project.activeLayer.rotate(event.delta.x, center);
		redrawCords();
	}
	else if ($(document).data("shiftDown")){
		paper.project.activeLayer.translate(event.delta);
		redrawCords();
	}
	else{
		if ($('#cb-draw').prop('checked'))
			mkCord(event.point, false);
		else{
			if (!selectedCord) rmLastCord();
			var newpoint = event.point;
			newpoint = snapPoint(newpoint);
			if (selectedCord) moveCord(selectedCord, newpoint);
			if (!selectedCord) mkCord(newpoint);
		}
	}
}

function onMouseUp(event) {
	if ($('#cb-draw').prop('checked'))
		project.activeLayer.children[0].simplify()
	if (selectedCord) selectedCord.point._owner.selected = false;
	// if the user clicked on a point then ask them where they want to move it
	if (event.point == event.downPoint && selectedCord){
		var enteredPoint = getPointfromUser();
		if (enteredPoint){
			enteredPoint = scale(enteredPoint, 12, "up");
			moveCord(selectedCord, enteredPoint);
		}
	}
	selectedCord = null;
}