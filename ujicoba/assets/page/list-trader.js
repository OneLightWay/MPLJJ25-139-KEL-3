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
        el: 'lahan_province_id',
        valueField: 'id',
        displayField: 'name',
        url: BASE_URL + 'RekomendasiProduk/getProv',
        withNull: true,
        isSelect2: false,
        placeholder: '-Select Province-'
    });

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
        loadTrader()
    });
    loadTrader()
})

function loadTrader() {
    $('#show_list_trader').html('')

    var nearby_lat = HELPER.getItem('user_lat');
    var nearby_long = HELPER.getItem('user_long');
    if (HELPER.getItem('nearby_lat_now') && HELPER.getItem('nearby_long_now')) {
        nearby_lat = HELPER.getItem('nearby_lat_now');
        nearby_long = HELPER.getItem('nearby_long_now');
    }

    var nearby_kategory = HELPER.getItem('nearby_kategory');
    var nearby_search = $('#Nearby_search_done').val();
    var user_province = HELPER.getItem('user_province_id');
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Kios/traderUserExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            nearby_search: nearby_search,
            province: user_province,
            regency: $('#lahan_regency_id').val(),
            sorting_price: $('#sorting_price').val(),
        },
        urlMore: BASE_URL + 'Kios/traderUserMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            nearby_search: nearby_search,
            province: user_province,
            regency: $('#lahan_regency_id').val(),
            sorting_price: $('#sorting_price').val(),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_trader').html(`<div class="content-boxed content-box shadow-medium left-0 right-0 bottom-10">
                                                    <div class="not-found">
                                                        <div></div>
                                                        <h3>Tidak ditemukan.</h3>
                                                    </div>
                                                </div>`)
                $('#btn-more-trader').hide()
            } else {
                $('#btn-more-trader').show()
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
                    if (data_notifikasi.total == 0) {
                        $('#btn-more-trader').hide()
                    }
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

                            var img = 'assets/images/avatars/trader_icon.png';
                            if (v.tradder_banner) { img = BASE_ASSETS + 'traderBanner/thumbs/' + v.tradder_banner; }

                            var ikon_nearby = 'ikon-trader.svg';
                            var nama = HELPER.nullConverter(v.tradder_name)
                            var province = HELPER.ucwords(v.user_province_name)
                            var regency = HELPER.ucwords(v.user_regency_name)
                            var harga = HELPER.nullConverter(HELPER.toRp(v.corn_price_detailed_price))

                            $('#show_list_trader').append(`
                                <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${div_id}" style="height:100px;">
                                    <div class="caption-center left-20">
                                        <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="" style="width:60px;height:60px;">
                                    </div>
                                    <div class="caption-center left-90">
                                        <div class="top-8">
                                            <div class="row">
                                                <div class="right-10">
                                                    <h1 class="color-theme font-16 bottom-0">${nama}</h1>
                                                </div>
                                                <div class="top-5">
                                                    <img src="assets/images/nearby/${ikon_nearby}" alt="">
                                                </div>
                                            </div>
                                            <label class="color-theme font-12">${regency}, ${province}</label>
                                            <label class="color-theme font-12">Harga mulai dari Rp. ${harga}</label>
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
                                    HELPER.setItem('detail_trader_id', v.user_id)
                                    HELPER.setItem('from_page', 'list-trader')
                                    setTimeout(function () {
                                        onPage('detail-trader')
                                    }, 200)
                                });

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
            $('#btn-more-trader').off('click').on('click', function (e) {
                callLoadMore()
            });
        },
        callbackEnd: function (dd) {
            $('#btn-more-trader').hide()
            $('#btn-more-trader').off('click');
        }
    })
}

function resetFilter() {
    $('#lahan_province_id').val('').trigger('change')
    $('#lahan_regency_id').val('').trigger('change')
    $('.lahan_city').hide()
    loadTrader()
    $('.close-nearby-filter').click()
}