var map;
var layerGroup;
var marker;
var markerIcon = L.icon({
    iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
    iconSize: [25,41],
});
$(function () {
	loadMap()
})
function loadMap() {

	if (window.now_latlng) {
		window.now_latlng = window.now_latlng;
	}else{
		window.now_latlng = new L.LatLng(-7.977271,112.656242);
	}

	map  = L.map('map', {
	  fullscreenControl: true,
	  fullscreenControlOptions: {
	    position: 'topright'
	  }
	}).setView(window.now_latlng, 13);

	L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
	    maxZoom: 20,
	    subdomains:['mt0','mt1','mt2','mt3']
	}).addTo(map);

    L.control({
	    position : 'topright'
	});

	layerGroup  = L.layerGroup().addTo(map);
  	L.control.scale().addTo(map);
    marker = new L.Marker(window.now_latlng, {icon: markerIcon}).addTo(map);

    map.on('click', function (e) {
    	console.log(e)
        if (marker) {
            map.removeLayer(marker);
        }
        marker = new L.Marker([e.latlng.lat,e.latlng.lng], {icon: markerIcon}).addTo(map);
    });
}