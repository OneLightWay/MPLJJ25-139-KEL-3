$(function () {
    $('.btn-back').off('click').removeAttr('onclick')
    showDetail()
})

function showDetail() {
    HELPER.block()

    var myQ = new Queue();
    myQ.enqueue(function (next) {

        $('#btn-show-history-petani-scan, #btn-show-rekomendasi-produk').off();
        var configMaster = JSON.parse(HELPER.getItem('configMaster'))
        var configSett   = JSON.parse(HELPER.getItem('configSett'))
        var disclaimerBhs = JSON.parse(HELPER.getItem('user_language'));


        $.each(configMaster, function(i, v) {
            $('.show-'+v.conf_code).text(HELPER.nullConverter(v.conf_value))

            if (v.conf_code == 'master_label_disclaimer_en') {
                if (disclaimerBhs == 1){
                    $('.show-master_label_disclaimer').text(HELPER.nullConverter(v.conf_value))
                }
            }
        });

      

        $.each(configSett, function(i, v) {
            if (parseInt(v.conf_value) == 1) {
                $('.setting-'+v.conf_code).show()
            }else{
                $('.setting-'+v.conf_code).hide()
            }
        });

        next()
    }, 'satu').enqueue(function (next) {

        var data = JSON.parse(HELPER.getItem('detail_scan'));

        if (parseInt(data.qr_scan_type) == 1 || (data.hasOwnProperty('type') && data.type == "box")) {
            $('.scan-type').text('Box')
            runSetLabelBox()
        }else if(parseInt(data.qr_scan_type) == 0 || (data.hasOwnProperty('type') && data.type == "pouch")){
            $('.scan-type').text('Pouch')
        }

        var Aktual = HELPER.getItem('configSettDataScanAktual');

       
        $('.show-master_label_judul').text(HELPER.nullConverter(data.batch_remark, "Benih Unggul Bersertifikat"))
        $('.show-master_label_varietas').text(HELPER.nullConverter(data.product_group))
        $('.show-master_label_batch').text(HELPER.nullConverter(data.batch_code))
        $('.show-master_label_tanggal_panen').text(data.batch_tgl_panen ? moment(data.batch_tgl_panen).format('DD-MM-YYYY') : "-")
        $('.show-master_label_tanggal_selesai_pengujian').text(moment(data.batch_test_date).format('DD-MM-YYYY'))
        $('.show-master_label_tanggal_akhir_masa_edar').text(moment(data.batch_exp_date).format('DD-MM-YYYY'))
        $('.show-master_label_no_induk_sertifikasi').text(HELPER.nullConverter(data.batch_no_sertifikasi))
        $('.show-master_label_berat_bersih').text(HELPER.nullConverter(data.product_pack_size_label))
        var noseri_label = "-";
        if (!HELPER.isNull(data.pouch_number)) {
            noseri_label = data.pouch_number;
        } else if (!HELPER.isNull(data.box_number)) {
            noseri_label = data.box_number;
        }
        $('.show-master_label_noseri').text(noseri_label);

        if(parseInt(Aktual) == 1){
            if (!HELPER.isNull(data.batch_kadar_air_aktual)) {$('.show-master_label_kadar_air').text(data.batch_kadar_air_aktual+'%')}else{$('.show-master_label_kadar_air').text('0.0%')}
            if (!HELPER.isNull(data.batch_benih_murni_aktual)) {$('.show-master_label_benih_murni').text(data.batch_benih_murni_aktual+'%')}else{$('.show-master_label_benih_murni').text('0.0%')}
            if (!HELPER.isNull(data.batch_daya_berkecambah_aktual)) {$('.show-master_label_daya_berkecambah').text(data.batch_daya_berkecambah_aktual+'%')}else{$('.show-master_label_daya_berkecambah').text('0.0%')}
            if (!HELPER.isNull(data.batch_kotoran_benih_aktual)) {$('.show-master_label_kotoran_benih').text(data.batch_kotoran_benih_aktual+'%')}else{$('.show-master_label_kotoran_benih').text('0.0%')}
            if (!HELPER.isNull(data.batch_benih_lain_aktual)) {$('.show-master_label_benih_lain').text(data.batch_benih_lain_aktual+'%')}else{$('.show-master_label_benih_lain').text('0.0%')}
            if (!HELPER.isNull(data.batch_biji_gulma_aktual)) {$('.show-master_label_biji_gulma').text(data.batch_biji_gulma_aktual+'%')}else{$('.show-master_label_biji_gulma').text('0.0%')}
            if (!HELPER.isNull(data.batch_campuran_varietas_aktual)) {$('.show-master_label_campuran_varietas').text(data.batch_campuran_varietas_aktual+'%')}else{$('.show-master_label_campuran_varietas').text('0.0%')}

        }else{
            if (!HELPER.isNull(data.batch_kadar_air_default)) {$('.show-master_label_kadar_air').text(data.batch_kadar_air_default+'%')}else{$('.show-master_label_kadar_air').text('0.0%')}
            if (!HELPER.isNull(data.batch_benih_murni_default)) {$('.show-master_label_benih_murni').text(data.batch_benih_murni_default+'%')}else{$('.show-master_label_benih_murni').text('0.0%')}
            if (!HELPER.isNull(data.batch_daya_berkecambah_default)) {$('.show-master_label_daya_berkecambah').text(data.batch_daya_berkecambah_default+'%')}else{$('.show-master_label_daya_berkecambah').text('0.0%')}
        }



        $('.setting-sett_label_kode_unik').show().find('.show-master_label_kode_unik').text(HELPER.nullConverter(data.pouch_code))
        if (checkIsPetugas() || checkIsSales() || checkIsKios() || checkIsTrader()) {
            if (moment(data.batch_exp_date).isBefore(moment())) {
                $('.show-detail-status').show().children('span').text('EXPIRED')
            }
            if (parseInt(data.pouch_status) == 0) {
                $('.show-detail-status').show().children('span').text('NON AKTIF')
            }
            $('#btn-show-history-petani-scan').show()
            $('#btn-show-history-petani-scan').off('click')
            setTimeout(function () {
                $('#btn-show-history-petani-scan').on('click', function() {
                    var data_id = null;
                    try {
                        if (data.hasOwnProperty('pouch_id') || data.hasOwnProperty('box_id')) {
                            if (data.type == 'pouch' || parseInt(data.qr_scan_type) == 0) {
                                data_id = data.pouch_id;
                            }else if (data.type == 'box' || parseInt(data.qr_scan_type) == 1){
                                data_id = data.box_id;
                            }
                        }else{
                            if (data.type == 'pouch' || parseInt(data.qr_scan_type) == 0) {
                                data_id = data.qr_scan_pouch_id
                            }else if (data.type == 'box' || parseInt(data.qr_scan_type) == 1){
                                data_id = data.qr_scan_box_id;
                            }
                        }
                    } catch(e) {
                        console.log(e);
                    }
                    onShowPetaniScan(data.qr_scan_type, data_id)
                });
            }, 300)
            if (checkIsPetugas()) {
                $('.btn-back').removeAttr('onclick').on('click', function() {onPage('history-sampling')});
                $('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-qcs')});
            }else if (checkIsSales()) {
                $('.btn-back').removeAttr('onclick').on('click', function() {onPage('history-sampling')});
                $('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-sales')});
            }else if(checkIsKios()){
                $('#btn-show-history-petani-scan').hide()
                $('.btn-back').removeAttr('onclick').on('click', function() {onPage('history-scan-kios')});
                $('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-kios')});
            }else if(checkIsTrader()){
                $('#btn-show-history-petani-scan').hide()
                $('.btn-back').removeAttr('onclick').on('click', function() {onPage('history-scan-trader')});
                $('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-trader')});
            }
        }else{
            $('#btn-show-history-petani-scan').hide()
            $('.btn-back').off('click').on('click', ()=>{onPage('history-scan-farmer')})
            $('.btn-back-logo').off('click').on('click', function () { onPage('main') });
            if (data.hasOwnProperty('product_varietas_id') && parseInt(data.qr_scan_type) != 1 && data.type != "box") {
                $('#btn-show-rekomendasi-produk').show()
                $('#btn-show-rekomendasi-produk').on('click', function() {
                    HELPER.setItem('from_page', 'detail-scan')
                    HELPER.setItem('detail_rekomendasi_varietas_id', data.product_varietas_id)
                    setTimeout(function () {
                        onPage('detail-rekomendasi-produk')
                    }, 200)
                });
            }
        }

        HELPER.unblock()
        next()
    }, 'dua').dequeueAll()

}

function onShowPetaniScan(type, idd) {
    $('#list_petani_scan').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Toolkit/historyScanPetaniExist',
        dataExist: {
            type: type, id: idd
        },
        urlMore: BASE_URL + 'Toolkit/historyScanPetaniMore',
        dataMore: {
            type: type, id: idd
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#list_petani_scan').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No history available.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-petani-scan').hide()
            }else{
                $('#btn-more-petani-scan').show()
            }
            $('#btn-petani-scan-pouch').click();
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, v) {
                    var tanggal = moment(v.qr_scan_insert_at).format('DD MMMM YYYY HH:mm')
                    var img = 'assets/images/avatars/6s.png';
                    if (v.user_foto) {
                        if (v.user_foto.indexOf('http') >= 0) {
                            img = v.user_foto;
                        }else{
                            img = BASE_ASSETS+'user_mobile/'+v.user_foto;
                        }
                    }
                    $('#list_petani_scan').append(`
                        <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay">
                            <div class="row">
                                <div class="col-auto">
                                    <img src="${img}" class="radius-50 bg-highlight" alt="Petani" style="width: 60px;height: 60px;">
                                </div>
                                <div class="col left-10">
                                    <span class="font-19 color-custom-gray bold d-block">${HELPER.nullConverter(v.user_nama)}</span>
                                    <span class="bottom-0 font-12 color-custom-gray d-block" style="line-height: 13px;">${HELPER.nullConverter(v.user_telepon)}</span>
                                    <span class="bottom-0 font-12 color-custom-gray d-block top-5" style="line-height: 13px;">${tanggal}</span>
                                </div>
                            </div>
                        </div>
                    `)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-petani-scan').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-petani-scan').hide()
            $('#btn-more-petani-scan').off('click');
        }
    })
}

function runSetLabelBox() {
    HELPER.ajax({
        url: BASE_URL+'Main/loadConfigBox',
        success: function (res) {
            if (res.success) {
                $.each(res.data, function(i, v) {
                    if (parseInt(v.conf_value) == 1) {
                        $('.setting-'+v.conf_code).show()
                    }else{
                        $('.setting-'+v.conf_code).hide()
                    }
                });
            }
        }
    })
}