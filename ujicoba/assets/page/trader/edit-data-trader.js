var mymap;
var layerGroup;
var marker;

var TEMP_LAT;
var TEMP_LONG;
var fvEditAkun;
$(function () {
    loadEdit()
})

function loadEdit() {
    HELPER.ajax({
        url: BASE_URL + 'AkunTrader/getTrader',
        data: { user_id: HELPER.getItem('user_id') },
        success: function (res) {

            var dataTrader = res.data;
            loadMap(dataTrader)
            if (!HELPER.isNull(dataTrader.tradder_banner)) {
                $('.user-foto').attr('src', BASE_ASSETS + 'traderBanner/thumbs/' + dataTrader.tradder_banner);
            }

            loadProvinsi(dataTrader.tradder_province_id)
            if (dataTrader.tradder_regency_id != null && dataTrader.tradder_district_id != null && dataTrader.tradder_village_id != null) {
                loadKota(dataTrader.tradder_province_id, dataTrader.tradder_regency_id)
                loadKecamatan(dataTrader.tradder_regency_id, dataTrader.tradder_district_id)
                loadKelurahan(dataTrader.tradder_district_id, dataTrader.tradder_village_id)
            }

            $('#input_user_is_kios').val(3)
            $('#input_user_id').val(HELPER.getItem('user_id'))
            $('#input_name').val(dataTrader.tradder_name)
            $('#input_email').val(HELPER.getItem('user_email'))
            $('#input_telepon').val(HELPER.getItem('user_telepon'))
            $('#input_alamat').val(dataTrader.tradder_alamat)
            if (dataTrader.tradder_lat && dataTrader.tradder_long) {
                $('#input_user_lat').val(dataTrader.tradder_lat)
                $('#input_user_long').val(dataTrader.tradder_long)
            }


            setTimeout(function () {
                fvEmailVerif = HELPER.newHandleValidation({
                    el: 'form-akun',
                    setting: [
                        {
                            name: "Telephone",
                            selector: "#input_telepon",
                            rule: {
                                promise: {
                                    promise: function (input) {
                                        return new Promise(function (resolve, reject) {
                                            var elVal = $(input.element).val();
                                            if (parseInt(elVal.charAt(0)) == 0) {
                                                resolve({
                                                    valid: true,
                                                });
                                            } else {
                                                resolve({
                                                    valid: false,
                                                    message: 'Gunakan awalan 0',
                                                });
                                            }
                                        });

                                    }
                                }
                            },
                        }
                    ],
                    declarative: true
                })
            }, 500)

        }
    })
}

function save(name) {
    if ($('#input_name').val() != "" && $('#input_telepon').val() != "" && $('#input_alamat').val() != "" && $('#input_user_lat').val() != "" && $('#input_user_long').val() != "") {
        var form = $('#' + name)[0];
        var formData = new FormData(form);
        HELPER.save({
            url: BASE_URL + 'AkunTrader/editTrader',
            cache: false,
            data: formData,
            contentType: false,
            processData: false,
            form: name,
            confirm: true,
            callback: function (success, id, record, message) {
                HELPER.unblock(100);
                if (success) {
                    loadSession()
                    onPage('akun-trader')
                } else {
                    HELPER.showMessage({
                        success: false,
                        title: 'Failed',
                        message: 'Failed to save data'
                    })
                }
            },
            oncancel: function (result) {
                HELPER.unblock(100);
            }
        });
    } else {
        HELPER.showMessage({
            success: 'warning',
            message: 'Lengkapi inputan & pilih lokasi map !'
        })
    }
}


function previewImage(params) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = $(`#show-${params.target.id}`).attr('src', e.target.result);
    }
    reader.readAsDataURL(params.target.files[0]);
}

function loadMap(dataTrader) {
    $('#map-akun').html('')
    if (mymap !== undefined && mymap !== null) {
        mymap.remove();
    }

    var now_latlng = null;
    if (HELPER.isNull(dataTrader.tradder_lat) == false || HELPER.isNull(dataTrader.tradder_long) == false) {
        now_latlng = new L.LatLng(dataTrader.tradder_lat, dataTrader.tradder_long);
    } else {
        if (HELPER.isNull(USER_LAT) || HELPER.isNull(USER_LONG)) {
            reqLocPermission()
        } else {
            now_latlng = new L.LatLng(-7.977271, 112.656242);
        }
    }
    TEMP_LAT = now_latlng.lat;
    TEMP_LONG = now_latlng.lng;

    mymap = L.map('map-akun', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView(now_latlng, 13);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mymap);

    L.control({
        position: 'topright'
    });

    layerGroup = L.layerGroup().addTo(mymap);
    L.control.scale().addTo(mymap);
    L.control.locate({
        drawCircle: false,
    }).addTo(mymap);

    var markerIcon = L.icon({
        iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
        iconSize: [25, 41],
    });
    marker = new L.Marker(now_latlng, { icon: markerIcon }).addTo(mymap);

    mymap.on('click', function (e) {
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        if (marker) {
            mymap.removeLayer(marker);
        }
        marker = new L.Marker([lat, lng], { icon: markerIcon }).addTo(mymap);
        TEMP_LAT = lat;
        TEMP_LONG = lng;
    });
}

function openPickerMap() {
    if (mymap) {
        setTimeout(function () {
            mymap.invalidateSize()
        }, 1000)
    }
}

function setLocFromPick() {
    $('#input_user_lat').val(TEMP_LAT)
    $('#input_user_long').val(TEMP_LONG)
}

function loadProvinsi(select = null) {
    HELPER.createCombo({
        el: 'input_provinsi',
        url: BASE_URL + 'Login/getProv',
        valueField: 'id',
        displayField: 'name',
        isSelect2: false,
        withNull: false,
        selectedField: select
    })

    $('#input_provinsi').on('change', function () {
        $(this).prev().addClass('input-style-1-active')
        $('#input_kecamatan').prop('disabled', true).empty().append('<option value="">Pilih Kecamatan</option>')
        $('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
        var prov = this.value;
        loadKota(prov);
    });

    $('#input_kota').on('change', function () {
        $(this).prev().addClass('input-style-1-active')
        $('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
        var kota = this.value;
        loadKecamatan(kota)
    });

    $('#input_kecamatan').on('change', function () {
        $(this).prev().addClass('input-style-1-active')
        $('#input_kelurahan').removeAttr('disabled')
        var kecamatan = this.value;
        loadKelurahan(kecamatan);
    });

    $('#input_kelurahan').on('change', function () {
        $(this).prev().addClass('input-style-1-active')
    });
}

function loadKota(prov = null, select = null) {
    $('#input_kota').removeAttr('disabled')
    HELPER.createCombo({
        el: 'input_kota',
        url: BASE_URL + 'Login/getKota',
        valueField: 'id',
        displayField: 'name',
        withNull: false,
        isSelect2: false,
        selectedField: select,
        data: { province_id: prov }
    })
}

function loadKecamatan(kota = null, select = null) {
    $('#input_kecamatan').removeAttr('disabled')
    HELPER.createCombo({
        el: 'input_kecamatan',
        url: BASE_URL + 'Login/getKecamatan',
        valueField: 'id',
        displayField: 'name',
        withNull: false,
        isSelect2: false,
        selectedField: select,
        data: { kota_id: kota }
    })
}

function loadKelurahan(kecamatan = null, select = null) {
    $('#input_kelurahan').removeAttr('disabled')
    HELPER.createCombo({
        el: 'input_kelurahan',
        url: BASE_URL + 'Login/getKelurahan',
        valueField: 'id',
        displayField: 'name',
        withNull: false,
        isSelect2: false,
        selectedField: select,
        data: { kecamatan_id: kecamatan }
    })
}