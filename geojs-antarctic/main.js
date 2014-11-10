// Global
var antarctic = {};

function addVectorLayer(layer) {
	console.log("doing lookup for markers")
    d3.json("service/getdata/"+layer, function (error, jsonreturned) {
        console.log(jsonreturned,"\n");

        // now that the data is back and loaded, setup the new map layer This has to be done inside this
        // call so the data is ready when it fires off.  Without this call inside the function, the layer could be 
        // added to the map before the data load is finished

		var markers = antarctic.map.createLayer("feature",{"renderer":"d3Renderer"})

		for (var i = jsonreturned['data'].length - 1; i >= 0; i--) {
			console.log(jsonreturned['data'][i]['lng'], jsonreturned['data'][i]['lat'])
			var lng_float = jsonreturned['data'][i]['lng']
			var lat_float = jsonreturned['data'][i]['lat']
			// add a point to the d3 layer
			markers.createFeature("point")
			    .data([{x:lng_float, y:lat_float}])
				.position(function(d) { return {x: d.x, y: d.y};} )
				.style("fillColor", function(d) { return {r: 0, g: 1, b: 0};});

		}	
		// save markers layer globally
		antarctic.markers = markers
		antarctic.map.draw();
	});
}


function resize() {
    antarctic.map.resize(0, 0, $('#map').width(), $('#map').height());
}
 

function addBaseLayer() {
    var map;

    map = geo.map({
        'node': '#map',
        'zoom': 2
    });
    map.createLayer('osm');
    antarctic.map = map;
}


// this function is called as soon as the page is finished loading
window.onload = function () {   

	
	antarctic.map = null
	antarctic.markers = null

	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
	Proj4js.defs["EPSG:3031"] = "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
	Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";


    $(window).resize(resize);

    addBaseLayer();
    resize();
    addVectorLayer('stations');

}

