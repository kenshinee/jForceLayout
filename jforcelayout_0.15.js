/*!
 * jsforcelayout3 v0.1.5
 *
 * Copyright 2017-2019 kenshinee
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Making this world a better place, one code at a time @kenshinee
 *
 * A force-directed layout algorithm in 2D/3D space
 */
jForceLayout = function () {
    var obj = {};

    var ga_nodes = {}; // array to hold nodes
    var ga_edges = {}; // array to hold edges

    var idealD = 300; // ideal distance
    var idealB = 1500; // maximum distance
    var minD = 300; // minimum distance

    var _gaTimer;
    var _gaCounter = -1;
    var _callback;

    var maxNodeCount = 1;
    var maxEdgeCount = 1;

    var weightlimit = 0;

    var _dimension = 3;

    obj.setDimension = function (dimension) {

        _dimension = dimension;
        console.log("set dimenion as " + _dimension);
        if (_dimension == 3) {
            for (var key1 in ga_nodes) {
                var node = ga_nodes[key1];
                node.z = Math.random() * 5;
            }
        }
    }

    obj.setIdealDistance = function (distance) { // ideal distance between objects
        idealD = distance;
    }

    obj.setMaxDistance = function (distance) { // ideal max distance between objects where comparison doesn't matter
        idealB = distance;
    }

    obj.setMinDistance = function (distance) { // ideal minumum where objects must obey
        minD = distance;
    }

    obj.setWeightLimit = function (weight) { // define weight limit to display
        weightlimit = weight; // 0 to 1
    }

    obj.resetAll = function () {
        ga_nodes = {};
        ga_edges = {};
    }

    obj.setMaxNodeCount = function (max) {
        maxNodeCount = max;
    }

    obj.setMaxEdgeCount = function (max) {
        maxEdgeCount = max;
    }


    obj.removeNode = function (id) {
        delete ga_nodes[id];
    }

	obj.setNodePos = function(id, x, y, z) {
		var node = ga_nodes[id];
		node.x = x;
		node.y = y;
		node.z = z;
		node.freeze = true;
	}

	obj.releaseNode = function(id) {
		var node = ga_nodes[id];
		node.freeze = false;
	}

    obj.addNode = function (id, name, isstart, isend) {

        x = Math.random() * 5;
        y = Math.random() * 5;

        if (_dimension == 2) z = 0; else z = Math.random() * 5;

        var pt = new GAPoint(id, name, x, y, z);
		
        pt.isstart = isstart;
        pt.isend = isend;
		
		pt.freeze = false;
		
        ga_nodes[id] = pt;


    }

    obj.removeEdge = function (id) {
        delete ga_edges[id];
    }

    obj.addEdge = function (ID1, ID2, sweight, tweight) {

        var id = (ID1 + "" + ID2).hashCode();
		
		if (!sweight) sweight = 1;
		if (!tweight) tweight = 1;

        //console.log("jforce add edge", sweight, tweight, id);

        if (!ga_edges[id]) {
            var ed = new GAEdge(id, ID1, ID2, sweight, tweight);
            ga_edges[id] = ed;
            ga_edges[id].sweight = sweight;
            ga_edges[id].tweight = tweight;

            //console.log("add edge", sweight, tweight);

            ga_nodes[ID2].x = ga_nodes[ID1].x + (Math.random() * 2 - 1);
            ga_nodes[ID2].y = ga_nodes[ID1].y + (Math.random() * 2 - 1);
            ga_nodes[ID2].z = ga_nodes[ID1].z + (Math.random() * 2 - 1);

        } else {

            ga_edges[id].sweight = sweight;
            ga_edges[id].tweight = tweight;

        }
    }

    obj.addStartNode = function (ID, name) {

    }

    obj.addEndNode = function (ID, name) {

    }

    obj.getNodes = function () {
        return ga_nodes;
    }

    obj.getEdges = function () {
        return ga_edges;
    }

    obj.startRender = function (callback) {
		
		console.log("_gaCounter",_gaCounter);
		if (_gaCounter<=0) {
			if (_gaTimer) {
				clearInterval(_gaTimer);
				_gaTimer = false;
			}
			_gaCounter = 2000;
			console.log("reset _gaCounter",_gaCounter);
			_callback = callback;
			_gaTimer = setInterval(_garender, 20);
		} else {
			_gaCounter = 2000;
		}
    }

    _garender = function () {

        _gaCounter--;
		console.log("_gaCounter",_gaCounter);
        if (_gaCounter < 0) {
            clearTimeout(_gaTimer);
			_gaTimer = false;
        }
        var totalweight = 0;


        // compare each node against each other;			
        for (var key1 in ga_nodes) {

            var n1 = ga_nodes[key1];

            // do a slight pull for everyone towards the X = 0
            if (!n1.isstart && !n1.isend) {
                var xc = new GAVector(0, 0, 0);
                var d = getDistance(n1, xc);
                var diff = d / 100;
                var p1 = new GAVector(n1.x, n1.y, n1.z);
                var p2 = new GAVector(xc.x, xc.y, xc.z);
                var ip = getPointInBetween(p1, p2, d, diff, _dimension);
				
				if (!n1.freeze) {
					n1.x = ip.x;
					n1.y = ip.y;
					n1.z = ip.z;
				}
		   }

            if (n1.isstart) {
                //n1.x = -2000;
            }
            if (n1.isend) {
                //n1.x = 2000;
            }

            for (var key2 in ga_nodes) {
                totalweight = 0;
                var n2 = ga_nodes[key2];

                //console.log(n1.id, n2.id);
                var k1 = (n1.id + "" + n2.id).hashCode();

                var edge = ga_edges[k1];
                //if (ga_edges[k1]) totalweight += ga_edges[k1].sweight;

                var d = getDistance(n1, n2);
                //console.log("weightlimit", weightlimit, edge);

                if (edge && (edge.sweight >= weightlimit || edge.tweight >= weightlimit)) { // only display weight above my limit
                //if (totalweight > 0) { // both nodes are connected
                    //console.log("connected");
                    if (d > idealD) { // too far apart

                        var diff = (d - idealD) / 10;
                        var p1 = new GAVector(n1.x, n1.y, n1.z);
                        var p2 = new GAVector(n2.x, n2.y, n2.z);

                        var ip = getPointInBetween(p1, p2, d, diff, _dimension);
                        var ip2 = getPointInBetween(p2, p1, d, diff, _dimension);
						
						if (!n1.freeze) {
							n1.x = ip.x;
							n1.y = ip.y;
							n1.z = ip.z;
						}
						if (!n2.freeze) {
							n2.x = ip2.x;
							n2.y = ip2.y;
							n2.z = ip2.z;
						}
                    } else if (d < minD) { // too close

                        var diff = (d - minD) / 30;
                        var p1 = new GAVector(n1.x, n1.y, n1.z);
                        var p2 = new GAVector(n2.x, n2.y, n2.z);

                        var ip = getPointInBetween(p1, p2, d, diff, _dimension);
                        var ip2 = getPointInBetween(p2, p1, d, diff, _dimension);
						
						if (!n1.freeze) {
							n1.x = ip.x;
							n1.y = ip.y;
							n1.z = ip.z;
                        }
						if (!n2.freeze) {
							n2.x = ip2.x;
							n2.y = ip2.y;
							n2.z = ip2.z;
						}
                    }

                } else { /// nodes not related		
                    //console.log("not connected");

                    if (d < idealB) { // nodes are not related, too close

                        var diff = (d - idealB) / 1000;
                        var p1 = new GAVector(n1.x, n1.y, n1.z);
                        var p2 = new GAVector(n2.x, n2.y, n2.z);
                        var ip = getPointInBetween(p1, p2, d, diff, _dimension);
                        var ip2 = getPointInBetween(p2, p1, d, diff, _dimension);
						
						if (!n1.freeze) {
							n1.x = ip.x;
							n1.y = ip.y;
							n1.z = ip.z;
                        }
						if (!n2.freeze) {
							n2.x = ip2.x;
							n2.y = ip2.y;
							n2.z = ip2.z;
						}

                    }
                }

            }



            // pull isstart to the left, and isend to the right
            if (n1.isstart) {
                n1.x -= 10;
            }

            if (n1.isend) {
                n1.x += 10;
            }

        }

        _callback();

    }

    obj.resetAll();

    GAVector = function (_x, _y, _z) {
        var obj = {};
        obj.x = _x;
        obj.y = _y;
        obj.z = _z;
        return obj;
    }

    GAPoint = function (_id, _name, _x, _y, _z) {
        var obj = {};
        obj.id = _id;
        obj.name = _name
        obj.x = _x;
        obj.y = _y;
        obj.z = _z;
        //obj.weight = _w;
        return obj;
    }

    GAEdge = function (id, _k1, _k2, _sw, _tw) {
        var obj = {};
        obj.id = id;
        obj.startID = _k1;
        obj.endID = _k2;
        obj.sweight = _sw;
        obj.tweight = _tw;
        return obj;
    }

    function getDistance(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    function getPointInBetween(pointA, pointB, distance, length, dimension) {

        if (distance == 0) distance = 0.001; // preventing division by zero
        var obj = new GAVector();

        obj.x = pointA.x + (pointB.x - pointA.x) / distance * length;
        obj.y = pointA.y + (pointB.y - pointA.y) / distance * length;
        if (dimension == 2) {
            obj.z = pointA.z - pointA.z / 100;
        } else {
            obj.z = pointA.z + (pointB.z - pointA.z) / distance * length;
        }
        return obj;
    }

    return obj;
}
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
