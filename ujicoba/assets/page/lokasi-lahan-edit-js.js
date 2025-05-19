var mymap;
$(function () {
    $("#lahan-luas-real").inputmask('decimal', {
        rightAlign: false ,
        prefix: ""
    });
    $("#lahan-luas-mask").inputmask('decimal', {
        rightAlign: false ,
        prefix: ""
    });
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
            // console.log($("[name=lahan_province_id] option:selected").text())
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
                // $('#lahan_village_id').on('change', function (e) {
                //     setLocation()
                // });
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
            // $(".lahan-luas-real").removeAttr('disabled')
            $(".convert-luas-lahan").show()
            $(".label-luas-lahan-real").text('Luas Lahan ( '+$("[name=lahan_satuan_id] option:selected").text()+ ')')
            var satuan = $("[name=lahan_satuan_id] option:selected").text();


            if (satuan.toLowerCase() != 'hektar') {
                $(".convert-luas-lahan").show()
                if (satuan.toLowerCase() == 'paron') {
                    var pengkali = 893;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'iring') {
                    var pengkali = 1785;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'sangga') {
                    var pengkali = 70;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'rante') {
                    var pengkali = 404.685;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'prowolon') {
                    var pengkali = 446;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'kesik') {
                    var pengkali = 1000;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'lupit') {
                    var pengkali = 3570;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'bahu') {
                    var pengkali = 31;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'rakit') {
                    var pengkali = 1000;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'anggar') {
                    var pengkali = 33;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'borong') {
                    var pengkali = 6;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'tampah') {
                    var pengkali = 6750;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'ubin') {
                    var pengkali = 14.0625;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'ru') {
                    var pengkali = 14.0625;
                    var pembagi = 10000;
                }else if (satuan.toLowerCase() == 'tumbak') {
                    var pengkali = 14.0625;
                    var pembagi = 10000;
                }

                if (parseFloat( $(".lahan-luas-mask").val()) > 0 ) {
                    var conver_ha = (parseFloat($(".lahan-luas-real").val()) * parseFloat(pengkali)) / parseFloat(pembagi);
                    $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                }
            }else{
                $(".convert-luas-lahan").hide()
                var pengkali = 1;
                var pembagi = 1;

                if (parseFloat( $(".lahan-luas-mask").val()) > 0 ) {
                    var conver_ha = (parseFloat($(".lahan-luas-real").val()) * parseFloat(pengkali)) / parseFloat(pembagi);
                    $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                }
            }

            $('.lahan-luas-real').on('keyup', function () {
                var luas_real = $('.lahan-luas-real').val();
                var conver_ha = (parseFloat(luas_real) * parseFloat(pengkali)) / parseFloat(pembagi);
                $(".lahan-luas-mask").val(conver_ha.toFixed(3))
            });
        });
        onUpdate()

        // HELPER.newHandleValidation({
        //     el: 'form-LokasiLahan',
        //     setting: [
        //         {
        //             name: "Lokasi Lahan Name",
        //             selector: "#lahan_nama",
        //             rule: {
        //                 promise: {
        //                     promise: function (input) {

        //                         return new Promise(function(resolve, reject) {
                                    
        //                             HELPER.ajax({
        //                                 url: BASE_URL+'LokasiLahan/cekLokasiNama',
        //                                 // data: {lahan_nama: $(input.element).val(),farmer_id: farmer_id},
        //                                 success: function (res) {
        //                                     if (res.success) {
        //                                         resolve({
        //                                             valid: true         // Required
        //                                         });
        //                                     }else{
        //                                         //     if ($('#lahan_farmer_id').val() != "") {
        //                                         //     resolve({
        //                                         //         valid: true         // Required
        //                                         //     });
        //                                         // }else{
        //                                             resolve({
        //                                                 valid: false,               // Required
        //                                                 message: 'User Mobile Code must unique',   // Optional
        //                                             });
        //                                         // }
        //                                     }
        //                                 },
        //                                 error: function () {
        //                                     resolve({
        //                                         valid: false,               // Required
        //                                         message: 'Checking Error.',   // Optional
        //                                     });
        //                                 }
        //                             })

        //                         });

        //                     }
        //                 }
        //             },
        //         },
               
        //     ],
        //     declarative: true,
        // });

        
                // console.log('hai hai hui')
        

})



function onUpdate() {
        var lahan_id = HELPER.getItem('petani_lahan_id')
        $('.setMainLahan').html('')
        HELPER.ajax({
            url: BASE_URL+'LokasiLahan/readEdit',
            data: {lahan_id: lahan_id},
            complete: function (res) {
                // console.log('hai hai hui')
                
                $('.lahan_id').val(res.lahan_id)
                $('.lahan_farmer_id').val(res.lahan_farmer_id)
                var farmer_id = res.lahan_farmer_id;
                $('.lahan_nama').val(res.lahan_nama)
                var farmer_nama = res.lahan_nama;
                $('.lahan_luas').val(res.lahan_luas)
                $('.lahan_lat').val(res.lahan_lat)
                $('.lahan_long').val(res.lahan_long)
                $('.lahan_alamat').val(res.lahan_alamat)
                $('.lahan-luas-real').val(res.lahan_luas_real)
                $('.lahan-luas-mask').val(res.lahan_luas)

                HELPER.createCombo({
                    el : 'lahan_satuan_id ',
                    valueField : 'satuan_luas_id',
                    displayField : 'satuan_luas_nama',
                    url : BASE_URL+'LokasiLahan/getSatuan',
                    withNull : true,
                    isSelect2 : false,
                    placeholder: '-Select Satuan-',
                    selectedField : res.lahan_satuan_id,
                    callback : function(){}
                });

                $(".lahan-luas-real").removeAttr('disabled')

                if (res.lahan_luas_real != res.lahan_luas) {
                    $(".convert-luas-lahan").show()
                }

                // if (res.lahan_main == 0) {
                //     $('.setMainLahan').append(`<a href="#" class="button bg-red2-dark button-full button-xs button-round-small uppercase show-overlay w-100" onclick="setMainLahan('`+res.lahan_farmer_id+`')">Set Main</a>`)
                // }
                $('.lahan_varietas').val(res.lahan_varietas)

                HELPER.createCombo({
                    el: 'lahan_province_id',
                    valueField: 'id',
                    displayField: 'name',
                    url: BASE_URL+'LokasiLahan/getProv',
                    withNull : true,
                    isSelect2 : false,
                    placeholder: '-Select Province-',
                    selectedField : res.lahan_province_id,
                });

                HELPER.createCombo({
                    el: 'lahan_city_id',
                    valueField: 'id',
                    displayField: 'name',
                    data: {province_id: res.lahan_province_id},
                    url: BASE_URL+'LokasiLahan/getKota',
                    withNull : true,
                    isSelect2 : false,
                    // grouped: true,
                    placeholder: '-Select City-',
                    selectedField : res.lahan_regency_id,
                });

                HELPER.createCombo({
                    el: 'lahan_district_id',
                    valueField: 'id',
                    displayField: 'name',
                    data: {kota_id: res.lahan_regency_id},
                    url: BASE_URL+'LokasiLahan/getKecamatan',
                    withNull : true,
                    isSelect2 : false,
                    // grouped: true,
                    placeholder: '-Select District-',
                    selectedField : res.lahan_district_id,
                });

                HELPER.createCombo({
                    el: 'lahan_village_id',
                    valueField: 'id',
                    displayField: 'name',
                    data: {kecamatan_id: res.lahan_district_id},
                    url: BASE_URL+'LokasiLahan/getKelurahan',
                    withNull : true,
                    isSelect2 : false,
                    // grouped: true,
                    placeholder: '-Select Village-',
                    selectedField : res.lahan_village_id,
                });

                


                loadMap([res.lahan_lat,res.lahan_long])

                setTimeout(function () {
                    $(".label-luas-lahan-real").text('Luas Lahan ( '+$("[name=lahan_satuan_id] option:selected").text()+ ')')

                    HELPER.newHandleValidation({
                        el: 'form-LokasiLahanEdit',
                        setting: [
                            {
                                name: "Lokasi Lahan Name",
                                selector: "#lahan_nama_nama",
                                rule: {
                                    promise: {
                                        promise: function (input) {

                                            var lahan_nama_compare = $(input.element).val();
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
                                                            if (lahan_nama_compare.toLowerCase() == farmer_nama.toLowerCase()) {
                                                                resolve({
                                                                    valid: true         // Required
                                                                });
                                                            }else{
                                                                resolve({
                                                                    valid: false,               // Required
                                                                    message: 'Lahan Nama Harus Unik , silahkan is nama lahan yang lain',   // Optional
                                                                });

                                                            }
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

                    var satuan = $("[name=lahan_satuan_id] option:selected").text();

                    if (satuan.toLowerCase() != 'hektar') {
                        // $(".convert-luas-lahan").show()
                        if (satuan.toLowerCase() == 'paron') {
                            var pengkali = 893;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'iring') {
                            var pengkali = 1785;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'sangga') {
                            var pengkali = 70;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'rante') {
                            var pengkali = 404.685;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'prowolon') {
                            var pengkali = 446;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'kesik') {
                            var pengkali = 1000;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'lupit') {
                            var pengkali = 3570;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'bahu') {
                            var pengkali = 31;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'rakit') {
                            var pengkali = 1000;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'anggar') {
                            var pengkali = 33;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'borong') {
                            var pengkali = 6;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'tampah') {
                            var pengkali = 6750;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'ubin') {
                            var pengkali = 14.0625;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'ru') {
                            var pengkali = 14.0625;
                            var pembagi = 10000;
                        }else if (satuan.toLowerCase() == 'tumbak') {
                            var pengkali = 14.0625;
                            var pembagi = 10000;
                        }

                        
                    }else{
                        // $(".convert-luas-lahan").hide()
                        var pengkali = 1;
                        var pembagi = 1;

                    }

                    $('.lahan-luas-real').on('keyup', function () {
                        var luas_real = $('.lahan-luas-real').val();
                        var conver_ha = (parseFloat(luas_real) * parseFloat(pengkali)) / parseFloat(pembagi);
                        $(".lahan-luas-mask").val(conver_ha.toFixed(3))
                    });
                }, 500)

            }
           
        })
    
}





function save(name){
    var form = $('#'+name)[0];
    var formData = new FormData(form);
    HELPER.save({
        cache : false,
        data  : formData,
        url: BASE_URL+'LokasiLahan/edit', 
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

    // console.log(mymap); // should output the object that represents instance of Leaflet
    if (mymap !== undefined && mymap !== null) {
      mymap.remove(); // should remove the map from UI and clean the inner children of DOM element
      // console.log(mymap); // nothing should actually happen to the value of mymap
    }
        $('.lahan_lat').val(param[0])
        $('.lahan_long').val(param[1])

        var markerIcon = L.icon({
            iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
            iconSize: [25,41],
        });
       
        mymap  = L.map('maps', {
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            }
        }).setView(param, 13);

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

        marker = new L.Marker(param, {icon: markerIcon}).addTo(mymap);

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

        // FeatureGroup is to store editable layers
    //  var drawnItems = new L.FeatureGroup();
    //  mymap.addLayer(drawnItems);
    //  var drawControl = new L.Control.Draw({
    //      edit: {
    //          featureGroup: drawnItems
    //      }
    //  });
    //  mymap.addControl(drawControl);

    //  mymap.on('draw:created', function(e) {
    //       e.layer.options.color = 'red';
    //       var type = e.layerType,
    //         layer = e.layer;

    //       if (type === 'marker') {
    //         layer.bindPopup('A popup!');
    //       }

    //       drawnItems.addLayer(layer);

    // });

}

function batalEdit() {
    HELPER.confirm({
        title: 'Warning',
        message: 'Are you sure to cancel edit ?',
        callback: function (res) {
            if (res) {
                onPage('lokasi-lahan')
            }
        }
    })
}





