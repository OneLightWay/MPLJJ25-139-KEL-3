$(function () {
	loadHistoryLastprint()
})

function loadHistoryLastprint() {
    $('#show_list_lastprint').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Toolkit/listLastprintExist',
        dataExist: {
            user: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Toolkit/listLastprintMore',
        dataMore: {
            user: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_lastprint').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No history available.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-lastprint').hide()
            }else{
                $('#btn-more-lastprint').show()
            }
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
                    var status  = parseInt(v.qr_scan_status);
                    var colorStatus = "";
                    var backgroundStatus = "";
                    var content = "";
                    var modeScan = parseInt(v.qr_scan_mode) == 2 ? "Reject" : "Sisa";

                    colorStatus = "color-highlight";
                    backgroundStatus = "#f0fff0";
                    content = `
                        <div class="row bottom-5">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Material : ${HELPER.nullConverter(v.product_name)}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Varietas : ${HELPER.nullConverter(v.product_group)}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Mode Scan : ${modeScan}</span>
                            </div>
                        </div>
                    `;
                    
                    $('#show_list_lastprint').append(`
                        <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-detail-${v.qr_scan_id}" style="background: ${backgroundStatus};">
                            <div class="row bottom-10">
                                <div class="col-auto right-10">
                                    <i class="fa fa-calendar-alt font-20 ${colorStatus}"></i>
                                </div>
                                <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                    <span>${tanggal}</span>
                                </div>
                            </div>
                            ${content}
                        </div>
                    `)

                    $('.btn-detail-'+v.qr_scan_id).off('click')
                    setTimeout(function () {
                        $('.btn-detail-'+v.qr_scan_id).on('click', function(event) {
                            onDetailLastScan(v.qr_scan_pouch_id, parseInt(v.qr_scan_mode))
                        });
                    }, 200)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-lastprint').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-lastprint').hide()
            $('#btn-more-lastprint').off('click');
        }
    })
}

function onDetailLastScan(pouch_id, mode) {
    if (mode == 2) {
        cekPouchReject(pouch_id)
    }else{
        cekPouchSisa(pouch_id)
    }
}

function cekPouchReject(pouch_id) {
    $('.btn-pouch-reject-action').off()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Toolkit/cekPouchReject',
        data: {
            user_id: HELPER.getItem('user_id'),
            pouch_id: pouch_id,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success && res.data) {
                $.each(res.data, function(i, v) {
                    if (!Array.isArray(v)) {
                        $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                    }
                });
                $('#btn-pouch-reject').click();
                setTimeout(function () {
                    $('.menu-hider').addClass('menu-active').show()
                }, 500)
            }else{
                $('#show-msg-error-sampling').text(HELPER.nullConverter(res.message))
                $('#btn-sampling-failed').click();
            }
        },
        error: function (err) {
            HELPER.unblock()
            HELPER.showMessage({
                success: false,
                title: 'Failed !',
                message: 'Oops, terjadi kesalahan teknis.'
            })
        }
    })
    setTimeout(function () {
        $('.menu-hider').addClass('menu-active').show()
    }, 500)
}

function cekPouchSisa(pouch_id) {
    $('.btn-pouch-sisa-action').off().hide()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Toolkit/cekPouchSisa',
        data: {
            user_id: HELPER.getItem('user_id'),
            pouch_id: pouch_id,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success && res.data) {
                var start_pouch = parseInt(res.data.pouch_number) + 1;
                if (start_pouch > parseInt(res.data.qr_export_detail_end)) {
                    $('.btn-pouch-sisa-action').hide()
                    HELPER.showMessage({
                        success: 'info',
                        title: 'Info',
                        message: 'Tidak ada pouch sisa !'
                    })
                }else{
                    $.each(res.data, function(i, v) {
                        if (!Array.isArray(v)) {
                            $('.detail_sisa-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                    $('.detail_sisa-no_seri_awal').text(start_pouch)
                    $('.detail_sisa-no_seri_akhir').text(res.data.qr_export_detail_end)
                    $('#btn-pouch-sisa').click();
                    setTimeout(function () {
                        $('.menu-hider').addClass('menu-active').show()
                    }, 500)
                }
            }else{
                $('#show-msg-error-sampling').text(HELPER.nullConverter(res.message))
                $('#btn-sampling-failed').click();
            }
        },
        error: function (err) {
            HELPER.unblock()
            HELPER.showMessage({
                success: false,
                title: 'Failed !',
                message: 'Oops, terjadi kesalahan teknis.'
            })
        }
    })
    setTimeout(function () {
        $('.menu-hider').addClass('menu-active').show()
    }, 500)
}

/* function onDetailLastScan(idd, status) {
    if (status) {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL+'Toolkit/detailLastScan',
            data: {id: idd},
            complete: function (res) {
                if (res.success) {
                    if (parseInt(res.data.qr_scan_type) == 0 && res.data.dataPouch.pouch_code.indexOf("http") >= 0) {
                        window.open(res.data.dataPouch.pouch_code)
                    }else{
                        $.each(res.data, function(i, v) {
                            if (!Array.isArray(v)) {
                                $('.foundprint-'+i).text(HELPER.nullConverter(v))
                            }
                        });
                        $('#btn-lastprint-success').click();
                    }
                }else{
                    $('#show-msg-error-lastprint').text('Tidak ditemukan')
                    $('#btn-lastprint-failed').click()
                }
                HELPER.unblock()
            },
            error: function () {
                HELPER.unblock()
                $('#show-msg-error-lastprint').text('Oops, terjadi kesalahan teknis.')
                $('#btn-lastprint-failed').click()
            }
        })
    }else{
        $('#show-msg-error-lastprint').text('Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli !')
        $('#btn-lastprint-failed').click()
    }
} */