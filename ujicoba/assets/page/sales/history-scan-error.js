$(function () {
	loadHistory()
})

function loadHistory() {
    $('#show_list_history').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Sales/listHistoryErrorExist',
        dataExist: {
            user: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Sales/listHistoryErrorMore',
        dataMore: {
            user: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_history').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No history available.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-history').hide()
            }else{
                $('#btn-more-history').show()
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
                    var tanggal = moment(v.qr_scan_insert_at).format('DD MMMM YYYY HH:mm')
                    var status  = parseInt(v.qr_scan_status);
                    var colorStatus = "color-red2-light";
                    var backgroundStatus = "#fcecec";
                    var typeContent = "";
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
                    var content = `
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>${typeContent}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-user ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>${HELPER.ucwords(v.user_nama)}</span>
                            </div>
                        </div>
                    `;
                    
                    $('#show_list_history').append(`
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
                    $('.btn-call-wa').off('click');
                    setTimeout(function () {
                        $('.btn-detail-'+v.qr_scan_id).on('click', function(event) {

                            $('.found-qr_scan_code').text(v.qr_scan_code)
                            $('.found-message').text(typeContent)
                            $('.found-date').text(tanggal)
                            $('.found-user_nama').text(HELPER.ucwords(v.user_nama))
                            $('.found-user_telepon').text(v.user_telepon)
                            $('.detail-product').hide()
                            if (status == 2 || status == 3) {
                                setTimeout(function () {
                                    onDetailHistory(v.qr_scan_id)
                                }, 200)
                            }
                            $('#btn-history-error').click()
                        });
                        var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
                        $('.btn-call-wa').on('click', function(e) {
                            $('#btn-choose-telp-wa').off('click');
                            $('#btn-choose-telp-phone').off('click');
                            setTimeout(function () {
                                $('#btn-choose-telp-wa').on('click', function() {
                                    window.location.href = linkWaMe
                                });
                                $('#btn-choose-telp-phone').on('click', function() {
                                    window.location.href = 'tel://'+linkNo
                                });
                            }, 200)
                            $('#btn-telp-choose').click()
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
            $('#btn-more-history').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-history').hide()
            $('#btn-more-history').off('click');
        }
    })
}

function onDetailHistory(idd) {
    HELPER.ajax({
        url: BASE_URL+'Sales/getDetailProduct',
        data: {id: idd},
        complete: function (res) {
            if (res.success) {
                $('.found-product_name').text(res.data.product_name)
                $('.found-batch_code').text(HELPER.nullConverter(res.data.batch_code))
                $('.found-batch_test_date').text(moment(res.data.batch_test_date).format('DD-MM-YYYY'))
                $('.found-batch_exp_date').text(moment(res.data.batch_exp_date).format('DD-MM-YYYY'))
                $('.found-batch_no_sertifikasi').text(HELPER.nullConverter(res.data.batch_no_sertifikasi))
                $('.detail-product').show()
            }
        },
    })
}