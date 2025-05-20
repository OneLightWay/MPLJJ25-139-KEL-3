var mymap;
$(function () {

	var user_address = HELPER.getItem('user_alamat') + ", " + HELPER.getItem('user_regency_name') + ", " + HELPER.getItem('user_province_name');
	$('.show-address').text(HELPER.ucwords(user_address))
	loadMap()
})

function loadMap() {
	$('#map-farmer').html('')
	if (mymap !== undefined && mymap !== null) {
      mymap.remove();
    }

	var now_latlng = null;
	if (HELPER.isNull(HELPER.getItem('user_lat')) == false || HELPER.isNull(HELPER.getItem('user_long')) == false) {
		now_latlng = new L.LatLng(HELPER.getItem('user_lat'),HELPER.getItem('user_long'));
	}else{
		if (HELPER.isNull(USER_LAT) || HELPER.isNull(USER_LONG)) {
			reqLocPermission()
			navigator.geolocation.getCurrentPosition(function (pos) {
				now_latlng = new L.LatLng(pos.coords.latitude,pos.coords.longitude);
            });
		}else{
			now_latlng = new L.LatLng(-7.977271,112.656242);
		}
	}
	TEMP_LAT = now_latlng.lat;
	TEMP_LONG = now_latlng.lng;

	mymap  = L.map('map-farmer', {
		fullscreenControl: true,
		fullscreenControlOptions: {
			position: 'topleft'
		}
	}).setView(now_latlng, 13);

	L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
	    maxZoom: 20,
	    subdomains:['mt0','mt1','mt2','mt3']
	}).addTo(mymap);

    L.control({
	    position : 'topright'
	});

	layerGroup  = L.layerGroup().addTo(mymap);
  	L.control.scale().addTo(mymap);
  	L.control.locate({
  		drawCircle: false,
  	}).addTo(mymap);

  	var markerIcon = L.icon({
	    iconUrl: 'assets/images/icons/marker-my-self.svg',
	    iconSize: [50,65],
	});
    marker = new L.Marker(now_latlng, {icon: markerIcon}).addTo(mymap);

    setTimeout(function () {
    	loadData()
    }, 300)
}

function loadData() {
	$('#div-my-farmer').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/myFarmerNeabyNewExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'AkunSales/myFarmerNeabyNewMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            lat: HELPER.getItem('user_lat'),
            long: HELPER.getItem('user_long'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#div-my-farmer').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Data tidak ditemukan.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-nearby').hide()
            }else{
                $('#btn-more-nearby').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, val) {
                    var img = 'assets/images/avatars/6s.png';
                    var show_farmer = 'none';
                    var show_store  = 'none';
                    var distance 	= val.distance;
                    if (val.user_foto && val.type == 'farmer') {
                    	show_farmer = '';
                        if (val.user_foto.indexOf('http') >= 0) {
                            img = val.user_foto;
                        }else{
                            img = BASE_ASSETS+'user_mobile/'+val.user_foto;
                        }
                        var nearby_nama = HELPER.nullConverter(val.user_nama);
                    }else if (val.type == 'trader') {
                    	distance = getDistance([val.user_lat, val.user_long], [HELPER.getItem('user_lat'), HELPER.getItem('user_long')]);
                    	show_store = '';
                    	img = "./assets/images/avatars/trader_icon.png";
                        var nearby_nama = HELPER.nullConverter(val.store_name);
                    }else if (val.type == 'kios') {
                    	distance = getDistance([val.user_lat, val.user_long], [HELPER.getItem('user_lat'), HELPER.getItem('user_long')]);
                    	show_store = '';
                    	img = "./assets/images/dashboard/kios.png";
                        var nearby_nama = HELPER.nullConverter(val.store_name);
                    }
                    var bg_sahabat = parseInt(val.user_is_promoted) == 1 ? "#2aba6638" : "";
					var hasil = `
						<div class="div-list-nearby content-boxed shadow-large show-overlay m-0 bottom-10" style="background-color:${bg_sahabat};" onclick="onDetailUserNearby('${val.user_id}', '${val.type}')">
                            <div class="content bottom-10">
                                <div class="row">
                                    <div class="col-auto right-10" style="align-self: center;">
				                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="User Photo" style="width: 60px; height: 60px;">
                                    </div>
                                    <div class="col">
                                    	<div class="right-30">
				                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(nearby_nama)}</h1>
				                        </div>
				                        <label class="font-12" style="display: ${show_farmer}"><i class="fas fa-star color-highlight"></i> ${HELPER.nullConverter(val.total_poin)} Poin</label>
				                        <label class="font-12" style="display: ${show_store}"><i class="fa fa-list color-highlight"></i> ${HELPER.nullConverter(val.store_kode)}</label>
				                        <label class="font-12"><i class="fas fa-route color-highlight"></i> ${HELPER.nullConverter(distance)} KM</label>
                                    </div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
					`;
					$('#div-my-farmer').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-nearby').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-nearby').hide()
            $('#btn-more-nearby').off('click');
        }
    })
	HELPER.ajax({
		url: BASE_URL+'AkunSales/getMyFarmerNew',
		data:{user_id: HELPER.getItem('user_id')},
		complete: function (res) {
			if (res.success && res.total > 0) {
				$('.show-total-farmer').text(res.total)
				$.each(res.data, function(index, val) {
                    var urlMarker = 'assets/images/icons/marker-farmer.svg';
                    if (val.type == "kios") {
                        urlMarker = 'assets/images/icons/marker-kios.svg'
                        var nearby_nama = HELPER.nullConverter(val.store_name);
                    }else if (val.type == "trader") {
                        urlMarker = 'assets/images/icons/marker-trader.svg';
                        var nearby_nama = HELPER.nullConverter(val.store_name);
                    }else{
                        urlMarker = 'assets/images/icons/marker-farmer.svg';
                        var nearby_nama = HELPER.nullConverter(val.user_nama);
                    }
					var markerIcon = L.icon({
					    iconUrl: urlMarker,
					    iconSize: [50,65],
					});
					farmer_latlng = new L.LatLng(val.user_lat,val.user_long);
				    var marker_farmer = new L.Marker(farmer_latlng, {icon: markerIcon}).addTo(mymap);
				    marker_farmer.bindPopup(`<b>${nearby_nama}</b> <br> <a href="javascript:void(0)" class="w-100 text-center" onclick="onDetailUserNearby('${val.user_id}', '${val.type}')">Detail</button>`)
				});
			}
		}
	})
}

function onDetailUserNearby(user_id, type) {
    HELPER.setItem('from_page', 'sales-nearby')
    setTimeout(function () {
        if (type == "farmer") {
            HELPER.setItem('sahabatnk_user_id', user_id)
            onPage('sales-sahabatnk-detail')
        } else if (type == "kios") {
            HELPER.setItem('farmer_sales_detail_id', user_id)
            onPage('detail-kios-nearby')
        } else if (type == "trader") {
            HELPER.setItem('detail_trader_id', user_id)
            onPage('detail-trader')
        }
    }, 100)
}

function getDistance(origin, destination) {
    var lon1 = (origin[1])*Math.PI/180,
        lat1 = (origin[0])*Math.PI/180,
        lon2 = (destination[1])*Math.PI/180,
        lat2 = (destination[0])*Math.PI/180;

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
        var EARTH_RADIUS = 6371;
    return (c * EARTH_RADIUS).toFixed(2);
}