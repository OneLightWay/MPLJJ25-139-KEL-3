$(function () {
    setTimeout(function () {
        $('.back-button').off();
        if (HELPER.getItem('from_page')) {
            fromPage = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-rekomendasi-pestisida2')
                    }, 100)
                });
            }, 200)
            // HELPER.removeItem(['from_page'])
        }
    }, 300)
    // setTimeout(function () {
    //     $('.back-button').off('click')
    //     if (HELPER.getItem('from_page') == 'detail-rekomendasi-pestisida2' ) {
    //         $('.back-button').removeAttr('onclick').on('click', function (event) {
    //             event.preventDefault();
    //             onPage('detail-rekomendasi-pestisida2')
    //         });
    //     }
    // }, 300)
    $('.content-kios').hide()
    $('.content-tradder').hide()
    loadKios()
    showProduct()
    // showLink()
})

function loadKios(id) {
    jarak_lat = HELPER.getItem('user_lat');
    jarak_long = HELPER.getItem('user_long');

    HELPER.ajax({
        url: BASE_URL + 'Kios/readKiosPestisida',
        data: {
            user_id: HELPER.getItem('kios_pestisida_user_id'),
            user_lat: jarak_lat,
            user_long: jarak_long,
        },
        complete: function (res) {
            $('.detail-kios-alamat').parent().show()
            console.log(res)
            // var jabatan = (parseInt(v.user_wilayah_type) == 1) ? "Sales" : "Manager Sales";
            var jarak_sales = 'Unknown';
            if (res.distance) {
                var distance_count = Math.round(res.distance * 100) / 100;
                jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
            }

            var img = 'assets/images/avatars/6s.png';
            if (res.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + res.kios_banner; }

            var ikon_nearby = 'ikon-kios.svg';
            var nearby_nama = HELPER.nullConverter(res.kios_nama);

            var linkNo = "#";
            if (res.user_telepon) {
                if (res.user_telepon.charAt(0) == "0") {
                    linkNo = "62" + res.user_telepon.substring(1)
                } else if (res.user_telepon.charAt(0) == "+") {
                    linkNo = res.user_telepon.substring(1)
                } else if (res.user_telepon.charAt(0) != "6") {
                    linkNo = "62" + res.user_telepon.substring(1)
                } else {
                    linkNo = res.user_telepon
                }
            }
            $('#show_list_sales').append(`
                <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${res.kios_id}" style="height:100px;">
                        <div class="caption-center left-20">
                            <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="" style="width:60px;">
                        </div>
                        <div class="caption-center left-90">
                            <div class="top-8">
                                <div class="row">
                                    <div class="right-10">
                                        <h1 class="color-theme font-16 bottom-0">${nearby_nama}</h1>
                                    </div>
                                    <div class="top-5">
                                        <img src="assets/images/nearby/${ikon_nearby}" alt="">
                                    </div>
                                </div>
                                <label class="color-theme font-12">${HELPER.nullConverter(jarak_sales)} km</label>
                            </div>
                        </div>
                        <div class="caption-center">
                            <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                        </div>
                    </div>
                </div>
            `)
            $('#btn-popup-telp-' + res.kios_id).off('click');
            $('#content-sales-' + res.kios_id).off('click');

            $('.show-kios-telepon').text(res.user_telepon)
            $('.btn-call-wa').off('click');
            setTimeout(function () {
                var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
                $('.btn-call-wa').on('click', function (e) {
                    $('#btn-choose-telp-wa').off('click');
                    $('#btn-choose-telp-phone').off('click');
                    setTimeout(function () {
                        $('#btn-choose-telp-wa').on('click', function () {
                            window.location.href = linkWaMe
                        });
                        $('#btn-choose-telp-phone').on('click', function () {
                            window.location.href = 'tel://' + linkNo
                        });
                    }, 200)
                    $('#btn-telp-choose').click()
                });

                var img = 'assets/images/avatars/6s.png';                
                if (res.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + res.kios_banner; }
                var jarak_sales = 'Unknown';
                if (res.distance) {
                    var distance_count = Math.round(res.distance * 100) / 100;
                    jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
                }

                if (res.user_category == 3) {
                    $('.detail-nearby-jabatan').hide()
                    $('.detail-nearby-email').hide()
                    $('.detail-nearby-sr').show()
                    // $('.detail-nearby-link').hide()
                    $('.back-detail-nearby').text('Detail Kios')
                    // loadProductKios()
                    $('.search-product').on('keyup', function (e) {
                        // loadProductKios(this.value)
                    })
                } else if (res.user_category == 4) {
                    $('.back-detail-nearby').text('Detail Tradder')
                    $('.detail-nearby-jabatan').hide()
                    $('.detail-nearby-email').hide()
                    $('.detail-nearby-sr').hide()
                    // loadProductTradder()
                    $('.search-tradder').on('keyup', function (e) {
                        // loadProductTradder(this.value)
                    })
                } else {
                    $('.back-detail-nearby').text('Sales Representative')
                    $('.detail-nearby-jabatan').show()
                    $('.detail-nearby-email').show()
                    $('.detail-nearby-sr').hide()
                    $('.detail-kios-alamat').parent().hide()
                }

                $('.detail-kios-banner').prop('src', img)
                $('.detail-kios-nama').text(HELPER.nullConverter(nearby_nama))
                $('.detail-kios-jabatan').text(HELPER.nullConverter(res.jabatan_name))
                $('.detail-kios-jarak').text(jarak_sales)
                $('.detail-kios-alamat').text(HELPER.nullConverter(res.user_alamat))
                $('.detail-kios-email').text(HELPER.nullConverter(res.user_email))
                $('.detail-kios-kontak').text(HELPER.nullConverter(linkNo))
                var kios_wilayah = HELPER.nullConverter(res.kios_regency_name) + ", " + HELPER.nullConverter(res.kios_province_name);
                $('.detail-kios-wilayah').text(HELPER.ucwords(kios_wilayah.toLowerCase()))

            }, 200)

        }
    })
    $('.btn-back').on('click', function () { onPage('detail-rekomendasi-pestisida') });
}

function detailPestisidaKios(user_id) {
    HELPER.setItem('detail_pestisida_kios', user_id)
    onPage('detail-rekomendasi-pestisida2')
}

function showProduct() {
    // var pestisida_artikel = HELPER.getItem('pestisida_artikel')
    // if (pestisida_artikel == 1){
    //     var artikel_hama_id = HELPER.getItem('artikel_hama_id');
    // }else{
    //     var hama_id = HELPER.getItem('hama_id');
    // }
    var user_id = HELPER.getItem('kios_pestisida_user_id');
    var pestisida_id = HELPER.getItem('detail_pestisida_id');

    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/listPestisida',
        data: {
            user: user_id,
            pestisida: pestisida_id,
            // jenis: hama_id,
            // hama: artikel_hama_id,
        },
        complete: function (res) {
            if (res.total > 0) {
                $('.product-kios').html('')

                var slider = '';
                var pestisida_total_botol = HELPER.getItem('pestisida_total_botol');
                var pestisida_kemasan = HELPER.getItem('pestisida_kemasan');
                var pestisida_for_farmer = HELPER.getItem('pestisida_for_farmer')
                $.each(res.data, function (i, v) {
                    var kemasan = v.kios_pestisida_kemasan;
                    var pestisida = pestisida_for_farmer;
                    var total_botol = pestisida / kemasan;
                    var z = Math.ceil(total_botol);

                    var harga = v.kios_pestisida_harga;
                    var total = harga * z;

                    var img = './assets/images/noimage.png';
                    if (v.kios_pestisida_image) {
                        img = BASE_ASSETS + 'images/pestisida/thumbs/' + v.kios_pestisida_image;
                    }
                    $('.link-kios_pestisida_image').attr({
                        'href': img,
                        'data-lightbox': img
                    });
                    $('.detail-kios_pestisida_image').attr({
                        'src': img,
                        'title': v.kios_pestisida_image
                    });
                    var icon_harga = "assets/images/icons/icon-rp.png";
                    var icon_stok = "assets/images/icons/icon-layer.png";
                    var icon_jumlah = "fas fa-weight";
                    var icon_total = "fa fa-money-bill";

                    slider += `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:260px; width:220px;" onclick="detailPestisidaKios('`+ v.kios_pestisida_id + `')">
                                    <div data-height="200" class="caption bottom-10">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_pestisida_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.kios_pestisida_nama + `</h5>
                                        <h5 class="bottom-10 lh-20 font-14 center-text">`+ v.kios_pestisida_kemasan + `  ${HELPER.nullConverter(v.pestisida_satuan)}</h5>
                                    </div>
                                    <div class="row" style="padding-left: 6px;">
                                        <img src="`+ icon_harga + `" onerror="this.src='./assets/images/noimage.png'" style="height: 23px;">
                                        <label style="padding-left:5px;">`+ HELPER.toRp(v.kios_pestisida_harga) + `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_stok + `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px;">
                                        <label style="padding-left:5px;">${v.kios_pestisida_stok} Pack</label>
                                    </div>    
                                    <div>
                                        <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_jumlah} color-highlight" style="padding-right: 6px;"></i>Botol yang dibutuhkan : ` + z + ` Botol</label>
                                        <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_total} color-highlight" style="padding-right: 4px;"></i>Total : Rp. ` + HELPER.toRp(total) + `</label>
                                    </div>
                                </a>
                            </div>
                        `;
                });

                $('.show-product').html(slider)
                $('.no-product').hide()
                if (res.total > 1) {
                    setTimeout(function () {
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
                else {
                    setTimeout(function () {
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
            } else {
                $('.show-product').hide()
                $('.no-product').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`)
            }


            HELPER.unblock()
            $('.btn-back').on('click', function () { onPage('detail-rekomendasi-pestisida') });
        }
    })
}

function showLink(kios_link_id) {
    /* HELPER.ajax({
        url: BASE_URL + 'Kios/getLinkKios',
        data: {
            // user: user_id,
            id: HELPER.getItem('kios_pestisida_user_id'),
        },
        complete: function (res) {
            console.log(res)
            if (res.success && res.total) {
                var slider = '';
                $.each(res.data, function (i, v) {
                    var img = null;
                    if (v.kios_link_type == 'Shopee') { img = '<img src="./assets/images/marketplace/logo-shopee.png" style="height: 40px;">' }
                    else if (v.kios_link_type == 'Tokopedia') { img = '<img src="./assets/images/marketplace/logo-tokopedia.png" style="height: 40px;">' }
                    else if (v.kios_link_type == 'Bukalapak') { img = '<img src="./assets/images/marketplace/logo-bukalapak.png" style="height: 40px;">' }
                    else if (v.kios_link_type == 'Lainnya') { img = '<i class="fa fa-globe"></i> ' + HELPER.nullConverter(v.kios_link_name) }
                    $('#list-kios-link').append(`
                        <div class="row bottom-10">
                            <div class="col text-center left-20">
                                <a href="javascript:void(0)" class="font-18 color-highlight" onclick="window.open('${atob(v.kios_link_url)}'); addView('` + v.kios_link_id + `');">${img}</a>
                            </div>
                        </div>
                    `)
                    if (v.kios_link_url == null) {
                        $('#list-kios-link').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                            <div class="not-found">
                                <div></div>
                                <h3>Data tidak tersedia.</h3>
                            </div>
                        </div>`)
                    }
                });
            } else {
                $('#list-kios-link').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Data tidak tersedia.</h3>
                                            </div>
                                        </div>`)
            }

        }
    }) */
    HELPER.ajax({
        url: BASE_URL + 'Main/getLinkMarket',
        complete: function (res) {
            if (res.total > 0) {
                $.each(res.data, function (i, v) {
                    var img = `<img src="${BASE_ASSETS+'images/marketplace/'+v.link_market_image}" style="height: 70px;">`;
                    $('#list-kios-link').append(`
                        <div class="row bottom-10">
                            <div class="col text-center left-20">
                                <a href="javascript:void(0)" class="font-18 color-highlight" onclick="window.open('${(v.link_market_val)}');">${img}</a>
                            </div>
                        </div>
                    `)
                });
            } else {
                // $('.detail-nearby-link').hide()
            }

        }
    })
}

function addView(kios_link_id) {
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/addView',
        data: { kios_link_id: kios_link_id },
        complete: function (res) {
            console.log(res)
            onPage('detail-kios-pestisida')
        }
    })
}
