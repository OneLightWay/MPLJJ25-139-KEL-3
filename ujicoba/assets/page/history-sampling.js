$(function () {
	loadHistorySampling()
    setTimeout(function () {
        $('.btn-back').off('click')
        if (checkIsSales()) {
            $('.btn-back').removeAttr('onclick').on('click', function(event) {
                event.preventDefault();
                onPage('main-sales')
            });
            $('.btn-back-logo').removeAttr('onclick').on('click', function(event) {
                event.preventDefault();
                onPage('main-sales')
            });
        }
    }, 300)
})

function loadHistorySampling() {
    $('#show_list_sampling').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Toolkit/listSamplingExist',
        dataExist: {
            user: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Toolkit/listSamplingMore',
        dataMore: {
            user: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_sampling').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No history available.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-sampling').hide()
            }else{
                $('#btn-more-sampling').show()
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

                    if (status == 1) {
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
                        `;
                    }else{
                        colorStatus = "color-red2-light";
                        backgroundStatus = "#fcecec";
                        var typeContent = "";
                        if (status == 0) {
                            if (HELPER.getItem('user_language') == 1) {
                                typeContent = "Qr Code Not Found !";
                            }else{
                                typeContent = "Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli !";
                            }
                        }else if (status == 2) {
                            if (HELPER.getItem('user_language') == 1) {
                                typeContent = "Product Is Non Active !";
                            }else{
                                typeContent = "QR Code yang Anda scan sudah non-aktif atau sudah di scan sebelumnya !";
                            }
                            
                        }else if (status == 3) {
                            if (HELPER.getItem('user_language') == 1) {
                                typeContent = "The product has passed the end of its distribution period !";
                            }else{
                                typeContent = "Produk ini melewati akhir masa edar, silahkan cek kembali produk yang Anda beli !";
                            }
                            
                        }
                        content = `
                            <div class="row">
                                <div class="col-auto right-10">
                                    <i class="fa fa-circle ${colorStatus}"></i>
                                </div>
                                <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                    <span>${typeContent}</span>
                                </div>
                            </div>
                        `;
                    }
                    
                    $('#show_list_sampling').append(`
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
                                onDetailSampling(v.qr_scan_id, status)
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
            $('#btn-more-sampling').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-sampling').hide()
            $('#btn-more-sampling').off('click');
        }
    })
}

function onDetailSampling(idd, status) {
    var btnScan = HELPER.getItem('configSettScanReader');
    if (status) {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL+'Toolkit/detailSampling',
            data: {id: idd},
            complete: function (res) {
                if (res.success) {
                    if (parseInt(res.data.qr_scan_type) == 0 && res.data.pouch_qr_code.indexOf("http") >= 0) {
                       

                        if (parseInt(HELPER.getItem('configSettScanReaderAkumulation')) == 1) {
                            if (HELPER.getItem('configSettScanReader') == "sett_data_scan_read_synegnta") {
                                HELPER.unblock()
                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                setTimeout(function () {
                                    onPage('detail-scan')
                                }, 100)
                            }else{
                                HELPER.unblock()
                                window.open(res.data.pouch_link)
                            }
                        }else{
                            HELPER.block()
                            $('#btn-choose-scan-app').off('click')
                            $('#btn-choose-scan-browser').off('click')
                            setTimeout(function () {
                                $('#btn-choose-scan-app').on('click', function(e) {
                                    HELPER.unblock()
                                    HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                    setTimeout(function () {
                                        onPage('detail-scan')
                                    }, 100)
                                });
                                $('#btn-choose-scan-browser').on('click', function(e) {
                                    HELPER.unblock()
                                    window.open(res.data.pouch_link)
                                });
                            }, 500)
                            $('#btn-scan-choose').click()
                        }
                        
                    }else if(parseInt(res.data.qr_scan_type) == 1){
                        HELPER.setItem('detail_scan', JSON.stringify(res.data));
                        setTimeout(function () {
                            onPage('detail-scan')
                        }, 100)
                    }
                }
                HELPER.unblock()
            },
            error: function () {
                HELPER.unblock()
            }
        })
    }else{
        $('#btn-sampling-failed').click()
    }
}