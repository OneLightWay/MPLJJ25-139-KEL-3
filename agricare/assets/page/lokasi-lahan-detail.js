var mymap;
$(function () {
    detailLahan(HELPER.getItem('petani_lahan_id'))
    loadDataTanam()
    HELPER.createCombo({
        el: 'input_varietas',
        url: BASE_URL + 'LokasiLahan/getVarietas',
        valueField: 'varietas_id',
        displayField: 'varietas_name',
        isSelect2: false,
        withNull: false,
    })
    if (HELPER.getItem('lokasi_lahan_detail_tanam')) {
        loadDetailTanam(HELPER.getItem('lokasi_lahan_detail_tanam'))
        setTimeout(function () {
            HELPER.removeItem('lokasi_lahan_detail_tanam')
        }, 300)
    }
    // $('#input_panen').inputmask({
    //     'alias': 'decimal',
    //     'placeholder': '0',
    //     'rightAlign': false,
    //     'radixPoint': ',',
    //     'digits': 2,
    // });
    $('#input_pupuk').inputmask('currency', {
        rightAlign: false,
        prefix: "",
        min: 0,
        allowMinus: false,
    });
    $('#input_panen').inputmask('currency', {
        rightAlign: false,
        prefix: "",
        min: 0,
        allowMinus: false,
    });
})

function editLahan(id) {
    HELPER.setItem('petani_lahan_id', id)
    onPage('lokasi-lahan-edit')
}

function detailLahan(id) {
    HELPER.ajax({
        url: BASE_URL + 'LokasiLahan/read',
        data: { lahan_id: id },
        complete: function (res) {
            var lahan_address = res.lahan_alamat + ", " + res.district_name + ", " + res.regencies_name + ", " + res.provinces_name;
            $('.lahan-nama').text(res.lahan_nama)
            $('.lahan-luas').text(HELPER.toRp(res.lahan_luas))
            $('.lahan-alamat').text(HELPER.ucwords(lahan_address.toLowerCase()))
            $('.detail-label-luas-real').text('Luas Lahan ' + res.satuan_luas_nama)
            $('.lahan-luas-real').text(HELPER.toRp(res.lahan_luas_real))
            var luasSatuanReal = res.satuan_luas_nama;

            if (luasSatuanReal) {
                if (luasSatuanReal.toLowerCase() != 'hektar') {
                    $('.detail-luas-real').show()
                    $('.detail-label-luas-real').text('Luas Lahan (' + res.satuan_luas_nama + ')')
                    $('.lahan-luas-real').text(HELPER.toRp(res.lahan_luas_real))
                } else {
                    $('.detail-luas-real').hide()
                }
            }

            $('.btn-lahan-edit, .btn-lahan-delete').off('click')
            setTimeout(function () {
                $('.btn-lahan-edit').on('click', function () {
                    editLahan(res.lahan_id)
                });
                $('.btn-lahan-delete').on('click', function () {
                    deleteLahan(res.lahan_id)
                });
            }, 300)

            loadMap([res.lahan_lat, res.lahan_long])
            openMap()
            loadRekomendasiProduk(res)

            HELPER.unblock()
        }
    })
}


function openMap() {
    if (mymap) {
        setTimeout(function () {
            mymap.invalidateSize()
        }, 1000)
    }
}

function deleteLahan(lahan_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Are you sure to delete this farm ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'LokasiLahan/delete',
                    data: { lahan_id: lahan_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Lahan berhasil dihapus'
                            })
                            onPage('lokasi-lahan')
                        } else {
                            HELPER.showMessage()
                        }
                    },
                    error: function () {
                        HELPER.showMessage()
                    }
                })
            }
        }
    })
}

function loadMap(param = null) {

    if (mymap !== undefined && mymap !== null) {
        mymap.remove(); // should remove the map from UI and clean the inner children of DOM element
    }

    var markerIcon = L.icon({
        iconUrl: 'assets/vendor/leaflet/images/marker-icon.png',
        iconSize: [25, 41],
    });

    mymap = L.map('maps', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView(param, 13);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(mymap);

    L.control({
        position: 'topright'
    });

    layerGroup = L.layerGroup().addTo(mymap);
    L.control.scale().addTo(mymap);

    marker = new L.Marker(param, { icon: markerIcon }).addTo(mymap);

}

function onSaveTanam() {
    HELPER.confirm({
        message: 'Apakah Anda yakin ingin menyimpan data tanam tersebut ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL + 'LokasiLahan/saveTanam',
                    data: {
                        farmer_id: HELPER.getItem('user_id'),
                        lahan_id: HELPER.getItem('petani_lahan_id'),
                        date: $('#input_tanam_date').val(),
                        varietas: $('#input_varietas').val()
                    },
                    complete: function (res) {
                        if (res.success) {
                            HELPER.showMessage({
                                success: true,
                                message: 'Berhasil menyimpan data.'
                            })
                            loadDataTanam()
                            $('#input_tanam_date').val(moment().format('YYYY-MM-DD'))
                        } else {
                            HELPER.showMessage({
                                message: res.message
                            })
                        }
                    }
                })
            } else {
                setTimeout(function () {
                    $('#btn-tanam-baru').click()
                }, 200)
            }
        },
    })
}

function loadDataTanam() {
    loadDataTanamRun()
    $('#div-tanam').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'LokasiLahan/jadwalTanamExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            lahan_id: HELPER.getItem('petani_lahan_id'),
        },
        urlMore: BASE_URL + 'LokasiLahan/jadwalTanamMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            lahan_id: HELPER.getItem('petani_lahan_id'),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('#div-tanam').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3 class="bhsConf-tidak_memiliki_jadwal">Anda tidak memiliki Jadwal Tanam.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-tanam').hide()
            } else {
                $('#btn-more-tanam').show()
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue()
            myQueue.enqueue(function (next) {
                HELPER.block()
                next()
            }, '1').enqueue(function (next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function (i, val) {
                    var tanggal_tanam = moment(val.petani_tanam_date).format('DD-MM-YYYY')
                    var tanggal_panen = val.petani_tanam_panen_date ? moment(val.petani_tanam_panen_date).format('DD-MM-YYYY') : "-"
                    var panen_qty = val.petani_tanam_panen_qty ? val.petani_tanam_panen_qty + " KG" : "-"
                    var hasil = `
                        <div class="div-list-tanam content-boxed shadow-large show-overlay m-0 bottom-10" onclick="loadDetailTanam('${val.petani_tanam_id}')">
                            <div class="custom-card-header-left-half color-white" style="line-height: 20px;">${val.varietas_name.toUpperCase()}</div>
                            <div class="content bottom-10">
                                <div class="top-10">
                                    <label class="color-custom-black"><i class="fas fa-calendar color-highlight"></i> Tgl. Tanam : ${tanggal_tanam}</label>
                                    <label class="color-custom-black"><i class="fas fa-calendar color-highlight"></i> Tgl. Panen : ${tanggal_panen}</label>
                                    <label class="color-custom-black"><i class="fas fa-weight color-highlight"></i> Jml Panen : ${panen_qty}</label>
                                </div>
                            </div>
                            <div class="content-footer">
                                <span class="bhsConf-ketuk_detail">Ketuk untuk detail</span>
                                <i class="fa fa-angle-right fa-lg"></i>
                            </div>
                            <div class="clear"></div>
                        </div>
                    `;
                    $('#div-tanam').append(hasil)

                });
                next()
            }, '2').enqueue(function (next) {
                HELPER.unblock(500)
                setTimeout(function () { setLangApp() }, 500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function (callLoadMore) {
            $('#btn-more-tanam').off('click').on('click', function () {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-tanam').hide()
            $('#btn-more-tanam').off('click');
        }
    })
}

function onSwitchTanam() {
    $('#run-tanam').fadeToggle();
    $('#list-tanam').fadeToggle();
}

function loadDataTanamRun() {
    HELPER.ajax({
        url: BASE_URL + 'LokasiLahan/jadwalTanamBerjalan',
        data: {
            user_id: HELPER.getItem('user_id'),
            lahan_id: HELPER.getItem('petani_lahan_id'),
        },
        success: function (res) {
            if (res.success) {

                var jadwalDay = moment().diff(moment(res.data.petani_tanam_date), 'days');
                $('#run-tanam-on').off()
                $('#run-tanam-varietas').text(res.data.varietas_name.toUpperCase())
                $('#run-tanam-day').text(jadwalDay)
                if (jadwalDay >= 0) {
                    $('.image-fase-ongoing').hide()
                    $('.show-image-fase').show()
                    if (jadwalDay >= 0 && jadwalDay <= 7) {
                        $('#image-fase').attr('src', 'assets/images/fase/1.png')
                    } else if (jadwalDay >= 7 && jadwalDay <= 10) {
                        $('#image-fase').attr('src', 'assets/images/fase/2.png')
                    } else if (jadwalDay >= 11 && jadwalDay <= 14) {
                        $('#image-fase').attr('src', 'assets/images/fase/3.png')
                    } else if (jadwalDay >= 15 && jadwalDay <= 23) {
                        $('#image-fase').attr('src', 'assets/images/fase/4.png')
                    } else if (jadwalDay >= 24 && jadwalDay <= 40) {
                        $('#image-fase').attr('src', 'assets/images/fase/5.png')
                    } else if (jadwalDay >= 41 && jadwalDay <= 89) {
                        $('#image-fase').attr('src', 'assets/images/fase/6.png')
                    } else if (jadwalDay >= 90 && jadwalDay <= 102) {
                        $('#image-fase').attr('src', 'assets/images/fase/7.png')
                    } else if (jadwalDay >= 103) {
                        $('#image-fase').attr('src', 'assets/images/fase/8.png')
                    }
                } else {
                    $('.image-fase-ongoing').show()
                    $('.show-image-fase').hide()
                }
                setTimeout(function () {
                    $('#run-tanam-on').on('click', function (event) {
                        loadDetailTanam(res.data.petani_tanam_id)
                    });
                }, 300)

                $('#run-tanam-on').show()
                $('#run-tanam-off').hide()
            } else {
                $('#run-tanam-on').hide()
                $('#run-tanam-off').show()
            }
        }
    })
}

function loadDetailTanam(tanam_id) {
    HELPER.ajax({
        url: BASE_URL + 'LokasiLahan/getDetailTanam',
        data: {
            tanam_id: tanam_id,
        },
        complete: function (res) {
            $('.dt-list-fase').html('')
            $('.btn-hapus-jadwal-tanam').off();
            if (res.success) {

                var dataTanam = res.data;
                var tanggal_tanam = moment(dataTanam.petani_tanam_date).format('DD-MM-YYYY')
                var tanggal_panen = dataTanam.petani_tanam_panen_date ? moment(dataTanam.petani_tanam_panen_date).format('DD-MM-YYYY') : "-"
                var panen_qty = dataTanam.petani_tanam_panen_qty ? dataTanam.petani_tanam_panen_qty + " KG" : "-"
                if (dataTanam.petani_tanam_panen_qty == null) {
                    $('.dt-tanam-day').show().text('Hari ke - ' + moment().diff(moment(dataTanam.petani_tanam_date), 'days'))
                } else {
                    $('.dt-tanam-day').hide()
                }

                $('.dt-varietas').text(dataTanam.varietas_name.toUpperCase())
                $('.dt-tgl-tanam').text(tanggal_tanam)
                $('.dt-tgl-panen').text(tanggal_panen)
                $('.dt-qty-panen').text(panen_qty)
                var is_ready = 1;

                setTimeout(function () {
                    $.each(dataTanam.fase, function (i, v) {
                        var icon_fase = "assets/images/icons/icon-calendar.png";
                        var icon_color = colorArray[Math.floor(Math.random() * colorArray.length)];
                        if (i == 0) {
                            // icon_fase = "fas fa-certificate";
                            icon_fase = 'assets/images/icons/icon-certificate.png';
                            // $('.icon-ulat').attr({
                            //     'src': icon_fase,
                            // });
                        } else if (parseInt(v.fase_detail_type) == 1) {
                            // icon_fase = "fa fa-fill-drip"
                            icon_fase = 'assets/images/icons/icon-pupuk.png';
                            // $('.icon-ulat').attr({
                            //     'src': icon_fase,
                            // });
                        } else if (parseInt(v.fase_detail_type) == 2) {
                            // icon_fase = "fa fa-circle"
                            icon_fase = 'assets/images/icons/icon-circle.png';
                            // $('.icon-ulat').attr({
                            //     'src': icon_fase,
                            // });
                        } else if (parseInt(v.fase_detail_type) == 3) {
                            icon_fase = 'assets/images/icons/icon-ulat.png';
                            // $('.icon-ulat').attr({
                            //     'src': icon_fase,
                            // });
                        }
                        var tgl_from = moment(v.pt_detail_date_from).format('DD/MM')
                        var tgl_to = moment(v.pt_detail_date_to).format('DD/MM/YYYY')
                        var is_done = "";
                        if (parseInt(v.pt_detail_is_open) == 0) {
                            is_done = '<em class="bg-green2-dark">DONE</em>';
                        }
                        var hasil = `
                            <a href="javascript:void(0)" id="card_pt_detail_${v.pt_detail_id}" style="padding-left:0px;">
                                <div class="row">
                                    <img src="`+ icon_fase + `" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;">
                                    <span style="padding-left:20px;">${tgl_from} - ${tgl_to}</span>
                                    <p style="padding-left:55px;padding-right: 15px;">${HELPER.nullConverter(v.fase_detail_nama)}</p>
                                    ${is_done}
                                    <i class="fa fa-angle-right"></i>
                                </div>    
                            </a>
                        `;
                        $('.dt-list-fase').append(hasil)
                        $('#card_pt_detail_' + v.pt_detail_id).off();
                        setTimeout(function () {
                            $('#card_pt_detail_' + v.pt_detail_id).on('click', function () {
                                $('#show_jadwal_title, #show_jadwal_detail_title').text(v.fase_detail_nama)
                                $('.show_jadwal_date').text(moment(v.pt_detail_date_from).format('DD/MM') + " - " + moment(v.pt_detail_date_to).format('DD/MM'))
                                $('#input_aksi_date').prop('min', moment(v.pt_detail_date_from).format('YYYY-MM-DD'))
                                $('#input_aksi_date').prop('max', moment(v.pt_detail_date_to).format('YYYY-MM-DD'))
                                $('#input_aksi_date').val(moment(v.pt_detail_date_from).format('YYYY-MM-DD'))
                                $('#input_aksi_tanam_id').val(v.pt_detail_id)
                                $('#input_aksi_jadwal_id').val(v.pt_detail_tanam_id)
                                $('#input_deskripsi').val('')
                                $('#input_panen').val(0)
                                if (parseInt(v.fase_detail_type) == 1 && v.pt_detail_data_pupuk) {
                                    $('.show-kebutuhan-pupuk').show()
                                    $('.list-kebutuhan-pupuk-rekomendasi, .list-kebutuhan-pupuk-aktual').html('')
                                    setTimeout(function () {
                                        $.each(JSON.parse(v.pt_detail_data_pupuk), function (iPuk, vPuk) {
                                            $('.list-kebutuhan-pupuk-rekomendasi').append(`
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="row">
                                                            <div class="col-auto right-5">${iPuk}</div>
                                                            <div class="col">${vPuk} Kg</div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="font-12 input-style input-style-1 input-required">
                                                            <label class="color-highlight">${iPuk} (Kg)</label>
                                                            <em></em>
                                                            <input type="number" data-type-pupuk="${iPuk}" class="font-12 input-pupuk-aktual" style="height: 25px;" min="0" step="any" value="0">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clear"></div>
                                            `)
                                        });
                                    }, 200)
                                } else {
                                    $('.show-kebutuhan-pupuk').hide()
                                }

                                HELPER.ajax({
                                    url: BASE_URL + 'LokasiLahan/readJadwal',
                                    data: { id: v.pt_detail_id },
                                    complete: function (res) {
                                        if (res.success) {
                                            if (parseInt(res.data.pt_detail_is_open) == 1) {
                                                $('#btn-jadwal-aksi').click()
                                                if (parseInt(res.data.is_ready) == 1) {
                                                    $('.btn-simpan-aksi').removeClass('btn-disabled')
                                                } else {
                                                    $('.btn-simpan-aksi').addClass('btn-disabled')
                                                }
                                                if (parseInt(res.data.is_panen) == 1) {
                                                    $('.div-panen').show()
                                                    $('#input_aksi_date').removeAttribute('max')
                                                    $('#input_aksi_date').removeAttribute('min')
                                                } else {
                                                    $('.div-panen').hide()
                                                }
                                            } else {
                                                $('#btn-jadwal-detail').click()
                                                $('.show-jadwal_tanggal').text(moment(res.data.pt_detail_date_act).format('DD-MM-YYYY'))
                                                $('.show-jadwal_deskripsi').text(HELPER.nullConverter(res.data.pt_detail_desc))
                                                if (res.data.pt_detail_data_pupuk || res.data.pt_detail_data_pupuk_act) {
                                                    $('.show-kebutuhan-pupuk-detail').show()

                                                    $('.list-kebutuhan-pupuk-rekomendasi-detail, .list-kebutuhan-pupuk-aktual-detail').html('')
                                                    setTimeout(function () {
                                                        $.each(JSON.parse(res.data.pt_detail_data_pupuk), function (iPuk, vPuk) {
                                                            $('.list-kebutuhan-pupuk-rekomendasi-detail').append(`
                                                                <div class="row">
                                                                    <div class="col-auto right-5">${iPuk}</div>
                                                                    <div class="col">${vPuk} Kg</div>
                                                                </div>
                                                                <div class="clear"></div>
                                                            `)
                                                        });
                                                        $.each(JSON.parse(res.data.pt_detail_data_pupuk_act), function (iPuk, vPuk) {
                                                            $('.list-kebutuhan-pupuk-aktual-detail').append(`
                                                                <div class="row">
                                                                    <div class="col-auto right-5">${iPuk}</div>
                                                                    <div class="col">${vPuk} Kg</div>
                                                                </div>
                                                                <div class="clear"></div>
                                                            `)
                                                        });
                                                    }, 200)
                                                } else {
                                                    $('.show-kebutuhan-pupuk-detail').hide()
                                                }
                                            }
                                        } else {
                                            $('.btn-simpan-aksi').addClass('btn-disabled')
                                        }
                                    }
                                })
                            });
                        }, 300)
                    });

                    if (parseInt(dataTanam.petani_tanam_is_panen) == 0) {
                        $('.div-hapus-jadwal-tanam').show()
                        $('.btn-hapus-jadwal-tanam').on('click', function () {
                            $('#menu-detail-tanam a.close-menu').click()
                            setTimeout(function () {
                                HELPER.confirm({
                                    message: 'Anda yakin ingin menghapusnya ?',
                                    callback: function (oke) {
                                        if (oke) {
                                            onDeleteJadwalTanam(dataTanam.petani_tanam_id)
                                        } else {
                                            setTimeout(function () {
                                                $('#btn-detail-tanam').click()
                                            }, 200)
                                        }
                                    }
                                })
                            }, 200)
                        });
                    } else {
                        $('.div-hapus-jadwal-tanam').hide()
                    }

                    $('.btn-lihat-roi').off();
                    setTimeout(function () {
                        $('.btn-lihat-roi').on('click', function () {
                            HELPER.setItem('from_page', 'lokasi-lahan-detail');
                            HELPER.setItem('detail_roi_petani_tanam_id', dataTanam.petani_tanam_id);
                            setTimeout(function () {
                                onPage('petani-roi-detail');
                            }, 200)
                        });
                    }, 200);
                }, 200)


                $('#btn-detail-tanam').click()
            } else {
                HELPER.showMessage({
                    title: 'Failed',
                    message: 'Failed to open detail !'
                })
            }
        }
    })
}


function onSaveAksi() {
    HELPER.confirm({
        message: 'Anda yakin ingin menyelesaikan tugas tersebut ?',
        callback: function (oke) {
            if (oke) {
                var pupuk_aktual = [];
                $.each($('.input-pupuk-aktual'), function (index, val) {
                    pupuk_aktual.push({
                        name: $(this).data('type-pupuk'),
                        value: $(this).val()
                    });
                });
                HELPER.ajax({
                    url: BASE_URL + 'LokasiLahan/saveAksiTanam',
                    data: {
                        tanam_id: $('#input_aksi_tanam_id').val(),
                        date: $('#input_aksi_date').val(),
                        source_id: $('#input_source').val(),
                        deskripsi: $('#input_deskripsi').val(),
                        panen: $('#input_panen').val(),
                        pupuk_aktual: pupuk_aktual
                    },
                    complete: function (res) {
                        if (res.success) {
                            loadDataTanam()
                            loadDetailTanam($('#input_aksi_jadwal_id').val())
                        } else {
                            HELPER.showMessage({
                                message: 'Failed to save'
                            })
                            $('#btn-detail-tanam').click()
                        }
                    }
                })
            } else {
                $('.btn-jadwal-aksi').click()
            }
        }
    })
}

function onDeleteJadwalTanam(petani_tanam_id) {
    HELPER.ajax({
        url: BASE_URL + 'LokasiLahan/deleteJadwalTanam',
        data: { id: petani_tanam_id },
        success: function (res) {
            if (res.success) {
                loadDataTanam()
            } else {
                HELPER.showMessage({
                    message: 'Failed to delete'
                })
            }
        }
    })
}

function loadRekomendasiProduk(data) {
    HELPER.ajax({
        url: BASE_URL + 'LokasiLahan/rekomenVar',
        data: { lahan_id: data.lahan_id },
        complete: function (res) {
            if (res.success) {
                $.each(res.data, function (i, v) {
                    var img = './assets/images/avatars/produkTradder.png';
                    if (v.varietas_image) {
                        img = BASE_ASSETS + 'varietas/thumbs/' + v.varietas_image;
                    }
                    var isi = `
                        <div class="col text-center" data-varietas-id="${v.varietas_id}" onclick="onSelectRekomenProduk(this)">
                            <img src="${img}" class="top-10" style="height: 100px;width: 80px;">
                            <p class="font-14 bold bottom-10 top-10 lh-15">${v.varietas_name}</p>
                        </div>
                    `;
                    $('.list-produk-rekomen').append(isi)
                });
            }
        }
    })
}

function onSelectRekomenProduk(el) {
    var varietas_id = $(el).data('varietas-id')
    if ($(el).hasClass('active-rekomen-produk')) {
        $(el).removeClass('active-rekomen-produk')
    } else {
        $('#input_varietas').val(varietas_id)
        $(el).addClass('active-rekomen-produk')
    }
}