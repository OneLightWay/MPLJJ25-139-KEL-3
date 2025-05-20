var mymap;
var TEMP_LAT;
var TEMP_LONG;
var fvLahanTambah;
$(function () {
    
        HELPER.createCombo({
            el: 'lahan_province_id',
            valueField: 'id',
            displayField: 'name',
            url: BASE_URL+'LokasiLahan/getProv',
            withNull : true,
            isSelect2 : false,
            placeholder: '-Select Province-'
        });

        $('#lahan_province_id').on('change', function (e) {
            $('.lahan_city').show();
            $('#lahan_district_id').empty().append('<option value="">-Select District-</option>')
            $('#lahan_village_id').empty().append('<option value="">-Select Village-</option>')
            var data = $('#lahan_province_id').val();
            console.log($("[name=lahan_province_id] option:selected").text())
            var province_id = data;  

            HELPER.createCombo({
                el: 'lahan_city_id',
                valueField: 'id',
                displayField: 'name',
                data: {province_id: province_id},
                url: BASE_URL+'LokasiLahan/getKota',
                withNull : true,
                isSelect2 : false,
                // grouped: true,
                placeholder: '-Select City-',
            });

            $('#lahan_city_id').on('change', function (e) {
                $('.lahan_district').show();
                $('#lahan_village_id').empty().append('<option value="">-Select Village-</option>')
                var data = $('#lahan_city_id').val();
                var city_id = data;  

                HELPER.createCombo({
                    el: 'lahan_district_id',
                    valueField: 'id',
                    displayField: 'name',
                    data: {kota_id: city_id},
                    url: BASE_URL+'LokasiLahan/getKecamatan',
                    withNull : true,
                    isSelect2 : false,
                    // grouped: true,
                    placeholder: '-Select District-',
                });
                $('#lahan_district_id').on('change', function (e) {
                    $('.lahan_village').show();
                    var data = $('#lahan_district_id').val();
                    var district_id = data;  

                    HELPER.createCombo({
                        el: 'lahan_village_id',
                        valueField: 'id',
                        displayField: 'name',
                        data: {kecamatan_id: district_id},
                        url: BASE_URL+'LokasiLahan/getKelurahan',
                        withNull : true,
                        isSelect2 : false,
                        // grouped: true,
                        placeholder: '-Select Village-',
                    });
                });
                // $('#lahan_village_id').on('change', function (e) {
                //     setLocation()
                // });
            });
        });

        var farmer_id = HELPER.getItem('user_id')
        var farmer_lat = HELPER.getItem('user_lat')
        var farmer_long = HELPER.getItem('user_long')
        $('.lahan_farmer_id').val(farmer_id)

        HELPER.createCombo({
            el : 'lahan_satuan_id ',
            valueField : 'satuan_luas_id',
            displayField : 'satuan_luas_nama',
            url : BASE_URL+'LokasiLahan/getSatuan',
            withNull : true,
            isSelect2 : false,
            placeholder: '-Select Satuan-',
            callback : function(){}
        });

        $('#lahan_satuan_id').on('change', function (e) {
            $(".label-luas-lahan-real").text('Luas Lahan ( '+$("[name=lahan_satuan_id] option:selected").text()+ ')')
            var satuan = $("[name=lahan_satuan_id] option:selected").text();

            console.log(satuan.toLowerCase())

            var pengkali = 1;
            var pembagi  = 1;
            if (satuan.toLowerCase() != 'hektar') {
                $(".input-luas-lahan-mask").show()
                if (satuan.toLowerCase() == 'paron') {
                    pengkali = 893;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'iring') {
                    pengkali = 1785;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'sangga') {
                    pengkali = 70;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'rante') {
                    pengkali = 404.685;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'prowolon') {
                    pengkali = 446;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'kesik') {
                    pengkali = 1000;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'lupit') {
                    pengkali = 3570;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'bahu') {
                    pengkali = 31;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'rakit') {
                    pengkali = 1000;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'anggar') {
                    pengkali = 33;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'borong') {
                    pengkali = 6;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'tampah') {
                    pengkali = 6750;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'ubin') {
                    pengkali = 14.0625;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'ru') {
                    pengkali = 14.0625;
                    pembagi = 10000;
                }else if (satuan.toLowerCase() == 'tumbak') {
                    pengkali = 14.0625;
                    pembagi = 10000;
                }

                if (parseFloat( $(".lahan-luas-mask").val()) > 0 ) {
                    var conver_ha = (parseFloat($(".lahan-luas-real").val()) * parseFloat(pengkali)) / parseFloat(pembagi);
                    $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                }
            }else{
                $(".input-luas-lahan-mask").hide()
                pengkali = 1;
                pembagi = 1;

                if (parseFloat( $(".lahan-luas-mask").val()) > 0 ) {
                    var conver_ha = (parseFloat($(".lahan-luas-real").val()) * parseFloat(pengkali)) / parseFloat(pembagi);
                    $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                }
            }

            $('.lahan-luas-real').off()
            if (typeof $('#lahan-luas-real').data('_inputmask_opts') != 'undefined') {
                $('#lahan-luas-real').inputmask('remove')
            }
            setTimeout(function () {
                $("#lahan-luas-real").inputmask({
                    'autoUnmask': true,
                    'alias': 'decimal',
                    'placeholder': '0',
                    'rightAlign': false,
                    'digits': 2,
                    'min': '0',
                    'allowMinus': 'false',
                });
                $('.lahan-luas-real').on('keyup', function () {
                    var luas_real = $('.lahan-luas-real').val();
                    var conver_ha = (parseFloat(luas_real) * parseFloat(pengkali)) / parseFloat(pembagi);
                    $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                });
            }, 300)

        });

        loadMap([farmer_lat,farmer_long])

        $("#lahan-luas-real").inputmask({
            'autoUnmask': true,
            'alias': 'decimal',
            'placeholder': '0',
            'rightAlign': false,
            'digits': 2,
            'min': '0',
            'allowMinus': 'false',
        });
        $("#lahan-luas-mask").inputmask('decimal', {
            'autoUnmask': true,
            'alias': 'decimal',
            'placeholder': '0',
            'rightAlign': false,
            'digits': 2,
            'min': '0',
            'allowMinus': 'false',
        });

        fvLahanTambah = HELPER.newHandleValidation({
            el: 'form-LokasiLahan',
            setting: [
                {
                    name: "Lokasi Lahan Name",
                    selector: "#lahan_nama",
                    rule: {
                        promise: {
                            promise: function (input) {

                                return new Promise(function(resolve, reject) {
                                    
                                    HELPER.ajax({
                                        url: BASE_URL+'LokasiLahan/cekLokasiNama',
                                        data: {lahan_nama: $(input.element).val(),farmer_id: farmer_id},
                                        success: function (res) {
                                            if (res.success) {
                                                resolve({
                                                    valid: true         // Required
                                                });
                                            }else{
                                                
                                                    resolve({
                                                        valid: false,               // Required
                                                        message: 'Lahan Nama Harus Unik , silahkan is nama lahan yang lain',   // Optional
                                                    });
                                            }
                                        },
                                        error: function () {
                                            resolve({
                                                valid: false,               // Required
                                                message: 'Checking Error.',   // Optional
                                            });
                                        }
                                    })

                                });

                            }
                        }
                    },
                },
               
            ],
            declarative: true,
        });
})

function setLocation() {
    try {
        var loc = `${$("[name=lahan_province_id] option:selected").text()},${$("[name=lahan_city_id] option:selected").text()},${$("[name=lahan_district_id] option:selected").text()},${$("[name=lahan_village_id] option:selected").text()}`;
        $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc},+CA&key=AIzaSyAopxUVdLzCJv5Ww84G-pHj9xFSCYB4hWk`,{},(response) => {
            if (response.results.length === 0) {
                // if (isMobile()) {
                //     window.navigator.notification.alert('Tidak bisa menemukan lokasi, arahkan peta secara manual ke lokasi yg dituju',e => {}, 'Kesalahan');
                // } else {
                    alert('Tidak bisa menemukan lokasi, arahkan peta secara manual ke lokasi yg dituju');
                // }
                
            } else{
                // mapL.setView([response.results[0].geometry.location.lat,response.results[0].geometry.location.lng]).setZoom(14)
                // console.log([response.results[0].geometry.location.lat,response.results[0].geometry.location.lng])
                loadMap([response.results[0].geometry.location.lat,response.results[0].geometry.location.lng])
            }
        })
    } catch (error) {
    }
}

function loadMap(param = null) {
    if (mymap !== undefined && mymap !== null) {
      mymap.remove(); // should remove the map from UI and clean the inner children of DOM element
      // console.log(mymap); // nothing should actually happen to the value of mymap
    }

    var now_latlng = null;
    if (HELPER.isNull(HELPER.getItem('user_lat')) == false || HELPER.isNull(HELPER.getItem('user_long')) == false) {
        now_latlng = new L.LatLng(HELPER.getItem('user_lat'),HELPER.getItem('user_long'));
        
    }else{
        if (HELPER.isNull(USER_LAT) || HELPER.isNull(USER_LONG)) {
            reqLocPermission()
        }else{
            now_latlng = new L.LatLng(-7.977271,112.656242);
        }
    }
    TEMP_LAT = now_latlng.lat;
    TEMP_LONG = now_latlng.lng;
    $('.lahan_lat').val(now_latlng.lat)
    $('.lahan_long').val(now_latlng.lng)

    mymap  = L.map('maps', {
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
        iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
        iconSize: [25,41],
    });
    marker = new L.Marker(now_latlng, {icon: markerIcon}).addTo(mymap);

    mymap.on('click', function (e) {
        var lat = e.latlng.lat;
        $('.lahan_lat').val(lat)
        var lng = e.latlng.lng;
        $('.lahan_long').val(lng)
        if (marker) {
            mymap.removeLayer(marker);
        }
        marker = new L.Marker([lat,lng], {icon: markerIcon}).addTo(mymap);
        TEMP_LAT = lat;
        TEMP_LONG = lng;
    });

}

function save(name){
    if (name == 'form-LokasiLahan') {
        var form = $('#'+name)[0];
        var formData = new FormData(form);
        HELPER.save({
            cache : false,
            data  : formData,
            url: BASE_URL+'LokasiLahan/create', 
            contentType : false, 
            processData : false,
            form : name,
            confirm: true,
            callback : function(success,id,record,message)
            {
                HELPER.unblock(100);
                if (success) {
                    HELPER.showMessage({
                        success: true,
                        title: "Success",
                        message: "Berhasil menyimpan data"
                    });
                    onPage('lokasi-lahan')
                }else{
                    HELPER.showMessage({
                        success: false,
                        title: 'Failed',
                        message: 'Gagal menyimpan data'
                    })
                }
            },
            oncancel: function (result) {
                HELPER.unblock(100);
            }
        });
    }
}



