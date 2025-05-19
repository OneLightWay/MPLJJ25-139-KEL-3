$(function () {
    loadRiwayatPoin()
	loadRiwayatVoucher()
})

function loadRiwayatPoin() {
	$('.list-riwayat-poin').html('')
    var farmer_id = HELPER.getItem('user_id')

    HELPER.initLoadMore({
        perPage: 20,
        urlExist: BASE_URL + 'Voucher/riwayatPoinExist',
        dataExist: {
            farmer_id: farmer_id,
        },
        urlMore: BASE_URL + 'Voucher/riwayatPoinMore',
        dataMore: {
            farmer_id: farmer_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.list-riwayat-poin').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Belum ada riwayat poin</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-riwayat-poin').hide()
            }else{
                $('#btn-more-riwayat-poin').show()
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
                    var text_reset_poin = "Reset Poin Pada Tanggal " + moment(v.user_poin_date).format('DD-MM-YYYY');
                    var list_name = HELPER.nullConverter(v.list_name)
                    if (parseInt(v.user_poin_flag) == 1) {
                        list_name = HELPER.nullConverter(v.list_name)
                    } else {
                        if (HELPER.isNull(v.user_poin_tipe) || parseInt(v.user_poin_tipe) == 1) {
                            list_name = HELPER.nullConverter(v.list_name)
                        }else if(parseInt(v.user_poin_tipe) == 2){
                            list_name = "Penukaran Kupon"
                        }else{
                            list_name = "Reset Poin";
                        }
                    }
                	var tanggal_dapat = moment(v.user_poin_date).format('DD-MM-YYYY')
                    var color_list = parseInt(v.user_poin_flag) == 1 ? "color-highlight" : "color-red2-dark";
                    var flag_list  = parseInt(v.user_poin_flag) == 1 ? "+" : "-";
                    $('.list-riwayat-poin').append(`
                        <a href="javascript:void(0)">
                            <i class="far fa-heart ${color_list} font-20 round-tiny"></i>
                            <span>${list_name}</span>
                            <p>${tanggal_dapat}</p>
                            <em class="${color_list} font-15">${flag_list}${v.user_poin_poin}</em>
                        </a>
                    `)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-riwayat-poin').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-riwayat-poin').hide()
            $('#btn-more-riwayat-poin').off('click');
        }

    })
}

function loadRiwayatVoucher() {
    $('.list-riwayat-voucher').html('')
    var farmer_id = HELPER.getItem('user_id')

    HELPER.initLoadMore({
        perPage: 20,
        urlExist: BASE_URL + 'Voucher/riwayatVoucherExist',
        dataExist: {
            farmer_id: farmer_id,
        },
        urlMore: BASE_URL + 'Voucher/riwayatVoucherMore',
        dataMore: {
            farmer_id: farmer_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.list-riwayat-voucher').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Belum ada riwayat voucher</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-riwayat-voucher').hide()
            }else{
                $('#btn-more-riwayat-voucher').show()
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
                    let voucher_price = HELPER.toRp(parseFloat(v.voucher_value));
                    let tanggal_dapat = moment(v.user_poin_date).format('DD-MM-YYYY')
                    let bg_img = 'assets/images/pictures/bg-voucher.jpg';
                    if (v.voucher_image) {
                        bg_img = BASE_ASSETS+'voucher/'+v.voucher_image;
                    }
                    $('.list-riwayat-voucher').append(`
                        <div class="content-boxed content-box p-0 voucher-card shadow-small show-overlay-list" onclick="onDetailVoucher('${v.user_voucher_voucher_id}')">
                            <div class="voucher-card-image" style="background-image: url(${bg_img});">
                                <div></div>
                            </div>
                            <div class="color-custom-black top-5">
                                <span class="m-0 lh-20 font-15 left-10 ">${HELPER.nullConverter(HELPER.ucwords(v.voucher_name), '-')}</span>
                                <span class="right-5 font-13" style="float: right;">${tanggal_dapat}</span>
                            </div>
                                <div class="font-18 left-10 top-5 bottom-10">
                                    <i class="fa fa-heart color-highlight"></i> Rp ${voucher_price}
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
            $('#btn-more-riwayat-voucher').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-riwayat-voucher').hide()
            $('#btn-more-riwayat-voucher').off('click');
        }

    })
}

function onDetailVoucher(voucher_id) {
    HELPER.setItem('detail_voucher_id', voucher_id)
    HELPER.setItem('from_page', 'my-voucher')
    setTimeout(function () {
        onPage('voucher-detail')
    }, 300)
}