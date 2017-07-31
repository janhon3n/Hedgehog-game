var boxes;
var player;
var solids;
var flowers;
var background;
var controls = {};
var backgroundFar;



//Helper functions
function isOnTopOf(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.bottom) || o2.body.hitTest(o1.body.right - 1, o1.body.bottom));
}
function isUnder(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.top - 1) || o2.body.hitTest(o1.body.right - 1, o1.body.top - 1));
}


