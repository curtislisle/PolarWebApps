




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
				.positions(lng_float,lat_float)
				.style({color: [1,0,0],size:[10]});

		}	
		// save markers layer globally
		antarctic.markers = markers
	});
}


function resize() {
    map.resize(0, 0, $('#map').width(), $('#map').height());
}
 

function addBaseMape() {
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

	antarctic = {}
	antarctic.map = null
	antarctic.markers = null

	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
	Proj4js.defs["EPSG:3031"] = "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
	Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";


    $(window).resize(resize);

    addBaseLayer();
	addVectorLayer('all_stations');
	resize();

}

