$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page')) {
                fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage(fromPage)
                    }, 100)
                });
                HELPER.removeItem(['from_page'])
            } else {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('sales-wilayah')
                    }, 100)
                });
            }
        }, 300)
    }, 300)

    loadKios()
    showProductBenih()
    showProductPestisida()
    showProductPupuk()
    // showLink()
})

function loadKios() {
    jarak_lat = HELPER.getItem('user_lat');
    jarak_long = HELPER.getItem('user_long');

    if (HELPER.getItem('nearby_base_location') == 2) {
        jarak_lat = HELPER.getItem('nearby_lat_now');
        jarak_long = HELPER.getItem('nearby_long_now');
    }

    HELPER.ajax({
        url: BASE_URL + 'Sales/readKios',
        data: {
            user_id: HELPER.getItem('farmer_sales_detail_id'),
            user_lat: jarak_lat,
            user_long: jarak_long,
        },
        complete: function (res) {
            $('.detail-sales-alamat').parent().show()
            // var jabatan = (parseInt(v.user_wilayah_type) == 1) ? "Sales" : "Manager Sales";
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
            var jarak_sales = 'Unknown';
            if (res.distance) {
                var distance_count = Math.round(res.distance * 100) / 100;
                jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
            }

            if (res.user_category == 3) {
                ikon_nearby = 'ikon-kios.svg';
                var nearby_nama = HELPER.nullConverter(res.kios_nama);
                var img = 'assets/images/dashboard/kios.png';
                if (res.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + res.kios_banner; }
                // if (res.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + res.user_foto; }

            } else if (res.user_category == 4) {
                ikon_nearby = 'ikon-trader.svg';
                var nearby_nama = HELPER.nullConverter(res.tradder_name);
                var img = 'assets/images/avatars/trader_icon.png';
                if (res.tradder_banner) { img = BASE_ASSETS + 'traderBanner/thumbs/' + res.tradder_banner; }
            } else {
                var img = 'assets/images/avatars/icon-sales.png';
                if (res.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + res.user_foto; }
                var ikon_nearby = 'ikon-user.svg';
                var nearby_nama = HELPER.nullConverter(res.user_nama);
            }


            $('#show_list_sales').append(`
                <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${res.user_id}" style="height:100px;">

                    
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
                                <div class="row" id="btn-popup-telp-${res.user_id}" style="display:none;">
                                    <div class="col-auto right-10 my-auto">
                                        <img src="assets/images/icons/whatsapp.png" style="width:16px;">
                                    </div>
                                    <div class="col">
                                        <span>${HELPER.nullConverter(res.user_telepon)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="caption-center">
                            <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                        </div>
                    </div>
                </div>
            `)
            $('#btn-popup-telp-' + res.user_id).off('click');
            $('#content-sales-' + res.user_id).off('click');
            setTimeout(function () {
                var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
                $('#btn-popup-telp-' + res.user_id).on('click', function (e) {
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
                // $('#content-sales-'+res.user_id).on('click', function(e) {
                var img = 'assets/images/avatars/icon-sales.png';
                if (res.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + res.user_foto; }
                var jarak_sales = 'Unknown';
                if (res.distance) {
                    var distance_count = Math.round(res.distance * 100) / 100;
                    jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
                }

                if (res.user_category == 3) {
                    // $('.detail-nearby-link').hide()
                    ikon_nearby = 'ikon-kios.svg';
                    var nearby_nama = HELPER.nullConverter(res.kios_nama);
                    img = 'assets/images/dashboard/kios.png';
                    if (res.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + res.kios_banner; }
                    var kios_wilayah = HELPER.nullConverter(res.kios_regency_name) + ", " + HELPER.nullConverter(res.kios_province_name);
                    $('.detail-sales-wilayah').text(HELPER.ucwords(kios_wilayah.toLowerCase()))
                    $('.detail-sales-alamat').text(HELPER.nullConverter(res.kios_alamat))
                    $('.detail-nearby-jabatan').hide()
                    $('.detail-nearby-email').hide()
                    $('.detail-nearby-sr').hide()
                    $('.back-detail-nearby').text('Detail Kios')
                    $('.search-product').on('keyup', function (e) {
                    })
                    log_type = 1;
                }
                else if (res.user_category == '4') {
                    ikon_nearby = 'ikon-trader.svg';
                    img = 'assets/images/avatars/trader_icon.png';
                    var nearby_nama = HELPER.nullConverter(res.tradder_name);
                    if (res.tradder_banner) { img = BASE_ASSETS + 'tradderBanner/thumbs/' + res.tradder_banner; }
                    var trader_wilayah = HELPER.nullConverter(res.tradder_regency_name) + ", " + HELPER.nullConverter(res.tradder_province_name);
                    $('.detail-sales-wilayah').text(HELPER.ucwords(trader_wilayah.toLowerCase()))
                    $('.detail-sales-alamat').text(HELPER.nullConverter(res.tradder_alamat))
                    $('.back-detail-nearby').text('Detail Trader')
                    $('.detail-nearby-jabatan').hide()
                    $('.detail-nearby-email').hide()
                    $('.detail-nearby-sr').hide()
                    // loadProductTradder()
                    $('.search-tradder').on('keyup', function (e) {
                    })
                    log_type = 2;
                }
                else {
                    var nearby_nama = HELPER.nullConverter(res.user_nama);
                    $('.back-detail-nearby').text('Sales Representative')
                    $('.detail-nearby-jabatan').show()
                    $('.detail-nearby-email').show()
                    $('.detail-nearby-sr').hide()
                    $('.detail-sales-alamat').parent().hide()
                    log_type = 3;
                }
                // console.log('img val:' + img);
                var user_address = HELPER.nullConverter(res.user_regency_name) + ", " + HELPER.nullConverter(res.user_province_name);
                $('.detail-sales-foto').prop('src', img)
                $('.detail-sales-nama').text(HELPER.nullConverter(nearby_nama))
                $('.detail-sales-sr').text(HELPER.nullConverter(res.user_nama))
                $('.detail-sales-jabatan').text(HELPER.nullConverter(res.jabatan_name))
                $('.detail-sales-jarak').text(jarak_sales)
                $('.detail-sales-alamat').text(HELPER.nullConverter(res.user_alamat))
                $('.detail-sales-email').text(HELPER.nullConverter(res.user_email))
                $('.detail-sales-kontak').text(HELPER.nullConverter(linkNo))
                // $('.detail-sales-link').text(HELPER.nullConverter(res.kios_shop_link))
                $('.detail-sales-wilayah').text(HELPER.ucwords(user_address.toLowerCase()))


                $('.div-detail-sales-kontak').off('click');
                setTimeout(function () {
                    $('.div-detail-sales-kontak').on('click', function () {
                        $('#btn-popup-telp-' + res.user_id).click();

                        HELPER.ajax({
                            url: BASE_URL + 'Trader/clickLog',
                            data: {
                                user: res.user_id,
                                type: log_type,
                                petani: HELPER.getItem('user_id')
                            },
                            complete: function (res) {
                            }
                        })
                    });
                }, 300)

            }, 200)

        }
    })
}

function showProductBenih() {
    $('.list-produk-benih').html('')
    var user_id = HELPER.getItem('farmer_sales_detail_id');
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/produkBenih',
        data: {
            user: user_id,
        },
        complete: function (res) {
            if (res.total > 0) {
                var slider = '';
                $.each(res.data, function (i, v) {
                    var img = './assets/images/noimage.png';
                    if (v.kios_varietas_image) {
                        img = BASE_ASSETS + 'varietas/thumbs/' + v.kios_varietas_image;
                    }
                    $('.link-kios_varietas_image').attr({
                        'href': img,
                        'data-lightbox': img
                    });
                    $('.detail-kios_varietas_image').attr({
                        'src': img,
                        'title': v.kios_varietas_image
                    });

                    var icon_harga = "assets/images/icons/icon-rp.png";
                    var icon_stok = "assets/images/icons/icon-layer.png";

                    var available = '';
                    if (v.kios_varietas_available == 1) {
                        available = 'Tersedia';
                    } else {
                        available = 'Habis';
                    }

                    slider += `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductBenih('`+ v.kios_varietas_id + `')">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px;">
                                    </div>
                                    <div class="bottom-5">
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_varietas_nama + `</h5>
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_varietas_kemasan + ` Kg</h5>
                                    </div>    
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_harga + `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">`+ HELPER.toRp(v.kios_varietas_harga) + `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_stok + `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">${v.kios_varietas_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
                    if (res.total > 2 && ((res.total - 1) == i)) {
                        slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductVarietas('${v.kios_varietas_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                    // <label class="left-10 bottom-0 font-12 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_varietas_stok + ` Pack</label>
                });

                $('.show-product-benih').html(slider)
                $('.no-product').hide()
                if (res.total > 1) {
                    setTimeout(function () {
                        $('.show-product-benih').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
                else {
                    setTimeout(function () {
                        $('.show-product-benih').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
            } else {
                // $('.show-product-benih').hide()
                $('.no-product').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`)
                $('.div-benih').hide()

            }


            HELPER.unblock()
            $('.btn-back').on('click', function () { onPage('') });
        }
    })
}

function showProductPestisida() {
    var user_id = HELPER.getItem('farmer_sales_detail_id');
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/produkPestisida',
        data: {
            user: user_id,
        },
        complete: function (res) {
            if (res.kategori_produk == 1) {
                $('.kategori-produk').text('Produk Benih')
            } else if (res.kategori_produk == 2) {
                $('.kategori-produk').text('Produk Pestisida')
            } else if (res.kategori_produk == 3) {
                $('.kategori-produk').text('Produk Pupuk')
            }
            if (res.total > 0) {
                var slider = '';
                $.each(res.data, function (i, v) {
                    var img2 = './assets/images/noimage.png';
                    if (v.kios_pestisida_image) {
                        img2 = BASE_ASSETS + 'images/pestisida/thumbs/' + v.kios_pestisida_image;
                    }
                    $('.link-kios_pestisida_image').attr({
                        'href': img2,
                        'data-lightbox': img2
                    });
                    $('.detail-kios_pestisida_image').attr({
                        'src': img2,
                        'title': v.kios_pestisida_image
                    });
                    var icon_harga = "assets/images/icons/icon-rp.png";
                    var icon_stok = "assets/images/icons/icon-layer.png";

                    var available = '';
                    if (v.kios_pestisida_available == 1) {
                        available = 'Tersedia';
                    } else {
                        available = 'Habis';
                    }

                    slider += `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductPestisida('`+ v.kios_pestisida_id + `')">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_pestisida_image" style="height:100px;">
                                    </div>
                                    <div class="bottom-5">
                                        <h5 class="bottom-0 font-12 lh-20 center-text">`+ v.kios_pestisida_nama + `</h5>
                                        <h5 class="bottom-0 font-12 lh-20 center-text">`+ v.kios_pestisida_kemasan + `  ${HELPER.nullConverter(v.pestisida_satuan)}</h5>
                                    </div>    
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_harga + `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">`+ HELPER.toRp(v.kios_pestisida_harga) + `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_stok + `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">${v.kios_pestisida_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
                    if (res.total > 2 && ((res.total - 1) == i)) {
                        slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductPestisida('${v.kios_pestisida_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                    // <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_pestisida_stok + ` Botol</label>
                });

                $('.show-product-pestisida').html(slider)
                $('.no-product').hide()
                if (res.total > 1) {
                    setTimeout(function () {
                        $('.show-product-pestisida').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
                else {
                    setTimeout(function () {
                        $('.show-product-pestisida').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
            } else {
                // $('.show-product-pestisida').hide()
                $('.div-pestisida').hide()
                $('.no-product').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`)
            }


            HELPER.unblock()
            $('.btn-back').on('click', function () { onPage('detail-produk') });
        }
    })
}

function showProductPupuk() {
    var user_id = HELPER.getItem('farmer_sales_detail_id');
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/produkPupuk',
        data: {
            user: user_id,
        },
        complete: function (res) {
            if (res.kategori_produk == 1) {
                $('.kategori-produk').text('Produk Benih')
            } else if (res.kategori_produk == 2) {
                $('.kategori-produk').text('Produk Pestisida')
            } else if (res.kategori_produk == 3) {
                $('.kategori-produk').text('Produk Pupuk')
            }
            if (res.total > 0) {
                var slider = '';
                $.each(res.data, function (i, v) {
                    var img3 = './assets/images/noimage.png';
                    if (v.kios_pupuk_image) {
                        img3 = BASE_ASSETS + 'images/pupuk/thumbs/' + v.kios_pupuk_image;
                    }
                    $('.link-kios_pupuk_image').attr({
                        'href': img3,
                        'data-lightbox': img3
                    });
                    $('.detail-kios_pupuk_image').attr({
                        'src': img3,
                        'title': v.kios_pupuk_image
                    });
                    var icon_harga = "assets/images/icons/icon-rp.png";
                    var icon_stok = "assets/images/icons/icon-layer.png";

                    var available = '';
                    if (v.kios_pupuk_available == 1) {
                        available = 'Tersedia';
                    } else {
                        available = 'Habis';
                    }

                    slider += `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductPupuk('`+ v.kios_pupuk_id + `')">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_pupuk_image" style="height:100px;">
                                    </div>
                                    <div class="bottom-5">
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_pupuk_nama + `</h5>
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_pupuk_kemasan + ` Kg</h5>
                                    </div>    
                                      <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_harga + `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">`+ HELPER.toRp(v.kios_pupuk_harga) + `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="`+ icon_stok + `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">${v.kios_pupuk_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
                    if (res.total > 2 && ((res.total - 1) == i)) {
                        slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductPupuk('${v.kios_pupuk_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
                    }
                    // <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_pupuk_stok + ` Pack</label>
                });

                $('.show-product-pupuk').html(slider)
                $('.no-product').hide()
                if (res.total > 1) {
                    setTimeout(function () {
                        $('.show-product-pupuk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
                else {
                    setTimeout(function () {
                        $('.show-product-pupuk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
            } else {
                // $('.show-product-pupuk').hide()
                $('.div-pupuk').hide()
                $('.no-product').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`)
            }


            HELPER.unblock()
            $('.btn-back').on('click', function () { onPage('detail-produk') });
        }
    })
}

function loadProductVarietas() {
    onPage('detail-kios-nearby-varietas')
}

function loadProductPestisida() {
    onPage('detail-kios-nearby-pestisida')
}

function loadProductPupuk() {
    onPage('detail-kios-nearby-pupuk')
}

function detailProductBenih(id) {
    HELPER.setItem('detail_varietas_kios', id)
    HELPER.setItem('from_page', 'detail-kios-nearby')
    onPage('detail-jual-benih')
}

function detailProductPestisida(id) {
    HELPER.setItem('detail_pestisida_kios', id)
    HELPER.setItem('from_page', 'detail-kios-nearby')
    onPage('detail-jual-pestisida')
}

function detailProductPupuk(id) {
    HELPER.setItem('detail_pupuk_kios', id)
    HELPER.setItem('from_page', 'detail-kios-nearby')
    onPage('detail-jual-pupuk')
}

function showLink(kios_link_id) {
    /* HELPER.ajax({
        url: BASE_URL + 'Kios/getLinkKios',
        data: {
            // user: user_id,
            id: HELPER.getItem('farmer_sales_detail_id'),
        },
        complete: function (res) {
            console.log(res)
            if (res.total > 0) {
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
                        $('#list-kios-link').html(``);
                        $('#list-kios-link').hide();
                        $('.kios-link').hide();
                    }
                });
            } else {
                $('.detail-nearby-link').hide()
            }

        }
    }) */
    HELPER.ajax({
        url: BASE_URL + 'Main/getLinkMarket',
        complete: function (res) {
            if (res.total > 0) {
                $.each(res.data, function (i, v) {
                    var img = `<img src="${BASE_ASSETS + 'images/marketplace/' + v.link_market_image}" style="height: 70px;">`;
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
            onPage('detail-kios-nearby')
            HELPER.setItem('from_page', 'detail-kios-nearby')
        }
    })
}
