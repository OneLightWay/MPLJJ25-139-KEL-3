var mymap;
var markerblock = [];
var markeritem = [];
var base_location = [];
var layer_marker;
var layer_marker_curr;
// var LayerLocate;
var SR_id;
$(function () {
    HELPER.createCombo({
        el: 'varietas_id',
        valueField: 'varietas_id',
        displayField: 'varietas_name',
        url: BASE_URL + 'LokasiLahan/getVarietas',
        placeholder: '-Pilih Varietas-',
        withNull: true,
        // grouped: true,
        isSelect2: false,
    })
    HELPER.createCombo({
        el: 'lahan_regency_id',
        valueField: 'id',
        displayField: 'name',
        data: { province_id: HELPER.getItem('user_province_id') },
        url: BASE_URL + 'RekomendasiProduk/getKota',
        withNull: true,
        isSelect2: false,
        placeholder: '-Pilih Kota-',
    });

    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('main')
                }, 100)
            });
        }, 300)
    }, 300)
    var nearby_alamat = HELPER.getItem('user_alamat').toLowerCase()
    var nearby_provinsi = HELPER.getItem('user_province_name').toLowerCase()
    var nearby_city = HELPER.getItem('user_regency_name').toLowerCase()
    var nearby_district = HELPER.getItem('user_district_name').toLowerCase()
    var nearby_village = HELPER.getItem('user_village_name').toLowerCase()
    $('.nearby-alamat').text(HELPER.ucwords(nearby_alamat + ', ' + nearby_district + ', ' + nearby_village + ', ' + nearby_city + ', ' + nearby_provinsi))
    $('#Nearby_search_done').on('change', function (event) {
        loadKios()
    });
    // loadKios()
    loadMap()
})

function loadKios() {
    try { layer_marker.clearLayers() } catch (e) { console.log(e); }
    $('#show_list_kios').html('')

    var nearby_lat = HELPER.getItem('user_lat');
    var nearby_long = HELPER.getItem('user_long');
    if (HELPER.getItem('nearby_lat_now') && HELPER.getItem('nearby_long_now')) {
        nearby_lat = HELPER.getItem('nearby_lat_now');
        nearby_long = HELPER.getItem('nearby_long_now');
    }
    var nearby_search = $('#Nearby_search_done').val();
    var user_province = HELPER.getItem('user_province_id');

    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Kios/kiosUserExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            province: user_province,
            nearby_search: nearby_search,
            regency: $('#lahan_regency_id').val(),
            varietas: $('#varietas_id').val(),
        },
        urlMore: BASE_URL + 'Kios/kiosUserMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            province: user_province,
            nearby_search: nearby_search,
            regency: $('#lahan_regency_id').val(),
            varietas: $('#varietas_id').val(),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_kios').html(`<div class="content-boxed content-box shadow-medium left-0 right-0 bottom-10">
                                                    <div class="not-found">
                                                        <div></div>
                                                        <h3>Kios tidak tersedia.</h3>
                                                    </div>
                                                </div>`)
                $('#btn-more-kios').hide()
            } else {
                $('#btn-more-kios').show()
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue()
            myQueue.enqueue(function (next) {
                HELPER.block()
                next()
            }, '1').enqueue(function (next) {
                var data_notifikasi = $.parseJSON(data.responseText);
                if (data_notifikasi.data) {
                    $.each(data_notifikasi.data, function (i, v) {
                        $('.no-product').hide()
                        if (v.user_id != SR_id) {
                            var div_id = v.user_id;

                            var linkNo = "#";
                            if (v.user_telepon) {
                                if (v.user_telepon.charAt(0) == "0") {
                                    linkNo = "62" + v.user_telepon.substring(1)
                                } else if (v.user_telepon.charAt(0) == "+") {
                                    linkNo = v.user_telepon.substring(1)
                                } else if (v.user_telepon.charAt(0) != "6") {
                                    linkNo = "62" + v.user_telepon.substring(1)
                                } else {
                                    linkNo = v.user_telepon
                                }
                            }

                            var img = 'assets/images/dashboard/kios.png';
                            if (v.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + v.kios_banner; }

                            var ikon_nearby = 'ikon-kios.svg';
                            var kios_name = HELPER.nullConverter(v.kios_nama)
                            var province = HELPER.ucwords(v.user_province_name)
                            var regency = HELPER.ucwords(v.user_regency_name)

                            $('#show_list_kios').append(`
                                <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${div_id}" style="height:100px;">
                                        <div class="caption-center left-10">
                                            <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="" style="width:60px;height:60px;">
                                        </div>
                                        <div class="caption-center left-80">
                                            <div class="top-8">
                                                <div class="row">
                                                    <div class="right-0">
                                                        <h1 class="color-theme font-16 bottom-0 right-10 lh-20">${kios_name}</h1>
                                                    </div>
                                                    <div class="top-0">
                                                        <img src="assets/images/nearby/${ikon_nearby}" alt="">
                                                    </div>
                                                </div>
                                                <label class="color-theme font-12">${regency}, ${province}</label>
                                            </div>
                                        </div>
                                        <div class="caption-center">
                                            <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                                        </div>
                                    </div>
                                </div>
                            `)
                            $('#content-sales-' + div_id).off('click');
                            setTimeout(function () {
                                $('#content-sales-' + div_id).on('click', function (e) {
                                    HELPER.setItem('farmer_sales_detail_id', v.user_id)
                                    HELPER.setItem('farmer_sales_detail_kios_id', v.kios_id)
                                    HELPER.setItem('from_page', 'list-kios')
                                    setTimeout(function () {
                                        onPage('detail-kios-nearby')
                                    }, 500)
                                });

                                var markerIconSr = L.icon({
                                    iconUrl: 'assets/vendor/leaflet/images/marker-sr.png',
                                    iconSize: [31, 47],
                                });

                                var bind_name = v.user_nama;
                                var bind_title = 'SALES REPRESENTATIVE'

                                var img = 'assets/images/avatars/6s.png';
                                if (v.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + v.user_foto; }

                                if (parseInt(v.user_category) == 3) {
                                    var bind_name = v.kios_nama;
                                    var markerIconSr = L.icon({
                                        iconUrl: 'assets/vendor/leaflet/images/marker-kios.png',
                                        iconSize: [31, 47],
                                    });
                                    bind_title = 'KIOS'
                                    var img = 'assets/images/avatars/6s.png';
                                    if (v.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + v.user_foto; }
                                } else if (parseInt(v.user_category) == 4) {
                                    var markerIconSr = L.icon({
                                        iconUrl: 'assets/vendor/leaflet/images/marker-trader.png',
                                        iconSize: [31, 47],
                                    });
                                    bind_title = 'TRADER'
                                    var img = 'assets/images/avatars/6s.png';
                                }
                                marker_sekitar = new L.Marker([v.user_lat, v.user_long], { icon: markerIconSr }).bindPopup(`
                                    <div onclick="openPopUp('${v.farmer_sales_user_id}')">
                                        <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="centerimg" alt="" style="width:60px;">
                                        <h5 style="text-align:center;">`+ (bind_title) + `</h5>
                                        <p style="padding:5px">Name : `+ (bind_name) + `</p>
                                    </div>`).addTo(layer_marker);

                            }, 200)
                        }
                    });
                }
                next()
            }, '2').enqueue(function (next) {
                HELPER.unblock(500)
                $('.show-blink').remove()
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function (callLoadMore) {
            $('#btn-more-kios').off('click').on('click', function (e) {
                callLoadMore()
            });
        },
        callbackEnd: function (dd) {
            $('#btn-more-kios').hide()
        }
    })
}

function refreshSales() {
    HELPER.showProgress({
        title: 'Loading !',
        message: 'Harap menunggu ...',
        timer: 5000
    })
    HELPER.ajax({
        url: BASE_URL + 'Sales/generateSales',
        data: {
            user_id: HELPER.getItem('user_id'),
            lat: HELPER.getItem('user_lat'),
            long: HELPER.getItem('user_long'),
        },
        complete: function (res) {
            if (res.success) {
                setTimeout(function () {
                    Swal.close()
                }, 1000)
            } else {
                Swal.close()
                setTimeout(function () {
                    HELPER.showMessage({
                        success: false,
                        title: 'Gagal !',
                        message: res.message
                    })
                }, 300)
            }
            markerblock = [];
            loadKios()
            getSalesInfo()
            HELPER.toggleForm({
                tohide: 'detail-sales',
                toshow: 'list-sales'
            })
        }
    })
}

function loadMap() {
    try {
        mymap.off('locateactivate')
        mymap.off('locatedeactivate')
        mymap.off('locationfound')
    } catch (e) {
        console.log(e);
    }
    if (mymap !== undefined && mymap !== null) {
        mymap.remove(); // should remove the map from UI and clean the inner children of DOM element
        // console.log(mymap); // nothing should actually happen to the value of mymap
    }

    var now_latlng = null;
    if (HELPER.isNull(HELPER.getItem('user_lat')) == false || HELPER.isNull(HELPER.getItem('user_long')) == false) {
        now_latlng = new L.LatLng(HELPER.getItem('user_lat'), HELPER.getItem('user_long'));
    } else {
        if (HELPER.isNull(USER_LAT) || HELPER.isNull(USER_LONG)) {
            reqLocPermission()
        } else {
            now_latlng = new L.LatLng(-7.977271, 112.656242);
        }
    }
    TEMP_LAT = now_latlng.lat;
    TEMP_LONG = now_latlng.lng;

    mymap = L.map('nearby-maps', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topright'
        }
    }).setView(now_latlng, 16);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mymap);

    L.control({
        position: 'topright'
    });
    layer_marker = L.layerGroup().addTo(mymap);
    layer_marker_curr = L.layerGroup().addTo(mymap);

    var markerIcon = L.icon({
        iconUrl: 'assets/vendor/leaflet/images/marker-location.png',
        iconSize: [31, 47],
    });
    marker_curr = new L.Marker(now_latlng, { icon: markerIcon }).addTo(layer_marker_curr);
    var lc = L.control.locate({ drawCircle: false }).addTo(mymap);
    setTimeout(function () {
        mymap.on('locatedeactivate', function (e) {
            HELPER.removeItem('nearby_lat_now')
            HELPER.removeItem('nearby_long_now')
            layer_marker_curr.clearLayers()
            mymap.setView(now_latlng, 16)
            setTimeout(function () {
                marker_curr = new L.Marker(now_latlng, { icon: markerIcon }).addTo(layer_marker_curr);
                loadKios()
            }, 500)
        })
        mymap.on('locateactivate', function (e) {
            mymap.on('locationfound', function (e) {
                mymap.stopLocate()
                layer_marker_curr.clearLayers()
                HELPER.setItem('nearby_lat_now', e.latitude)
                HELPER.setItem('nearby_long_now', e.longitude)
                setTimeout(function () {
                    marker_curr = new L.Marker(e.latlng, { icon: markerIcon }).addTo(layer_marker_curr);
                    mymap.setView(e.latlng, 16)
                    loadKios()
                }, 500)
            })
        })
    }, 500)
    setTimeout(function () {
        loadKios()
    }, 500)
}

function openPopUp(id) {
    $('#content-sales-' + id).click()
}


function changeFilterNearby() {
    if ($('#filter-nearby-sales-representative').is(':checked')) {
        HELPER.setItem('nearby_kategory', 2);
    } else if ($('#filter-nearby-kios').is(':checked')) {
        HELPER.setItem('nearby_kategory', 3);
    } else if ($('#filter-nearby-trader').is(':checked')) {
        HELPER.setItem('nearby_kategory', 4);
    } else {
        window.localStorage.removeItem('nearby_kategory')
    }

    loadKios()
    $('.close-nearby-filter').click()
}

function resetFilter() {
    $('#varietas_id').val('').trigger('change')
    $('#lahan_regency_id').val('').trigger('change')
    loadKios()
    $('.close-nearby-filter').click()
}

// function modalNearbyFilter() {
//     var nearby_kategory = HELPER.getItem('nearby_kategory');
//     var nearby_location = HELPER.getItem('nearby_base_location');

//     if (nearby_kategory) {
//         if (parseInt(nearby_kategory) == 2) {
//             $('#filter-nearby-sales-representative').prop("checked", true);
//             $('#filter-nearby-kios').prop("checked", false);
//             $('#filter-nearby-trader').prop("checked", false);
//             $('#filter-nearby-all').prop("checked", false);
//         } else if (parseInt(nearby_kategory) == 3) {
//             $('#filter-nearby-sales-representative').prop("checked", false);
//             $('#filter-nearby-kios').prop("checked", true);
//             $('#filter-informasi-promosi').prop("checked", false);
//             $('#filter-informasi-all').prop("checked", false);
//         } else {
//             $('#filter-nearby-sales-representative').prop("checked", false);
//             $('#filter-nearby-kios').prop("checked", false);
//             $('#filter-nearby-trader').prop("checked", true);
//             $('#filter-nearby-all').prop("checked", false);
//         }
//     } else {
//         $('#filter-nearby-sales-representative').prop("checked", false);
//         $('#filter-nearby-kios').prop("checked", false);
//         $('#filter-nearby-trader').prop("checked", false);
//         $('#filter-nearby-all').prop("checked", true);
//     }

//     if (parseInt(nearby_location) == 1) {
//         $('#filter-nearby-alamat').prop("checked", true);
//         $('#filter-nearby-location').prop("checked", false);
//     } else {
//         $('#filter-nearby-alamat').prop("checked", false);
//         $('#filter-nearby-location').prop("checked", true);
//     }
// }