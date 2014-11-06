




function addVectorLayer(layer) {

    d3.json("service/getdata/"+layer, function (error, jsonreturned) {
        console.log(jsonreturned,"\n");

        // now that the data is back and loaded, setup the new map layer This has to be done inside this
        // call so the data is ready when it fires off.  Without this call inside the function, the layer could be 
        // added to the map before the data load is finished

        /*
		var markers = new OpenLayers.Layer.Vector("Markers", {
			projection: 'EPSG:4326',
			strategies: [new OpenLayers.Strategy.Fixed()],
				protocol: new OpenLayers.Protocol.HTTP({
				url: "interesting.json",
				format: new OpenLayers.Format.GeoJSON()
			})
		});
*/

        // we want opaque external graphics and non-opaque internal graphics
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;

        /*
         * Blue style
         */
        var style_blue = OpenLayers.Util.extend({}, layer_style);
        style_blue.strokeColor = "blue";
        style_blue.fillColor = "blue";
        style_blue.graphicName = "star";
        style_blue.pointRadius = 5;
        style_blue.strokeWidth = 2;
        style_blue.rotation = 45;
        style_blue.strokeLinecap = "butt";

		var featureList = []
		var markers = new OpenLayers.Layer.Vector("Markers",{projection: 'EPSG:3031'});
		for (var i = jsonreturned['data'].length - 1; i >= 0; i--) {
			console.log(jsonreturned['data'][i]['lng'], jsonreturned['data'][i]['lat'])
			var lng_float = jsonreturned['data'][i]['lng']
			var lat_float = jsonreturned['data'][i]['lat']
			//var point = new OpenLayers.Geometry.Point(jsonreturned['data'][i]['lng'], jsonreturned['data'][i]['lat']);
			var point = new OpenLayers.Geometry.Point(lng_float, lat_float);

            var pointFeature = new OpenLayers.Feature.Vector(point,null,style_blue);
            featureList.push(pointFeature)
		}	
		markers.addFeatures(featureList);
		antarctic.map.addLayer(markers);
		//console.log(featureList)

		/*
		var markers = new OpenLayers.Layer.Vector( "Markers" );
		antarctic.map.addLayer(markers);

		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);

		for (var i = jsonreturned.length - 1; i >= 0; i--) {
			if (i == 0) {
				markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(jsonreturned['data'][i]['lng'], jsonreturned['data'][i]['lat']),icon));
			} else {
				markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(jsonreturned['data'][i]['lng'], jsonreturned['data'][i]['lat']),icon.clone()));
			}
		};
		*/

		antarctic.markers = markers
		map = antarctic.map

		var featctl = new OpenLayers.Control.SelectFeature(markers);
		map.addControl(featctl);
		featctl.activate();

		featctl.events.register('featurehighlighted', this, function(e) {
			var
				pt = e.feature.geometry,
				ll = new OpenLayers.LonLat(pt.x, pt.y);

			map.setCenter(ll, 11);
		});


		map.events.register('zoomend', this, function() {
			markers.setVisibility(map.zoom < 8);
		});

		if(!map.getCenter())
			map.setCenter(new OpenLayers.LonLat(0, 0)/* despite the class name, these are in EPSG:3031, so 0/0 is actually the pole */, 1);
	});
}


// this function is called as soon as the page is finished loading
window.onload = function () {   

	antarctic = {}
	antarctic.map = null
	antarctic.markers = null

	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
	Proj4js.defs["EPSG:3031"] = "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
	Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";

	var map = new OpenLayers.Map('map', {
		controls: [
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.Permalink({
				anchor: true
			})
		],

		projection: "EPSG:3031",
		displayProjection: "EPSG:4326"
	});

	// save this globally
	antarctic.map = map
	// add the basemap tiles to the map

	var tiles = new OpenLayers.Layer.XYZ(
		'Polar XYZ',
		'http://polar.openstreetmap.de/tiles/${z}/${x}/${y}.png',
		{
			projection: 'EPSG:3031',
			maxExtent: [-3000000,-3000000,3000000,3000000],
			attribution: '© <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors ' ,
			numZoomLevels: 19,
			transitionEffect: 'resize'
		}
	)

	map.addLayer(tiles);
	addVectorLayer('all_stations');
}
