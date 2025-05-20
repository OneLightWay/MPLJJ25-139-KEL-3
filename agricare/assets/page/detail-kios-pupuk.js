$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('detail-dosis-pupuk')
                }, 100)
            });
        }, 300)
    }, 300)
    $('.content-kios').hide()
    $('.content-tradder').hide()
    loadKios()
    showProduct()
    // showLink()
    // $('.show-product').owlCarousel({loop:false, margin:200, nav:false, lazyLoad:true, items:1, autoplay: false, stagePadding:20, autoplayTimeout:4000, autoWidth:true});    

})

function loadKios(id) {
    jarak_lat = HELPER.getItem('user_lat');
    jarak_long = HELPER.getItem('user_long');

    HELPER.ajax({
        url: BASE_URL + 'Kios/readKiosPupuk',
        data: {
            user_id: HELPER.getItem('kios_pupuk_user_id'),
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
                } else if (res.user_category == 4) {
                    $('.back-detail-nearby').text('Detail Tradder')
                    $('.detail-nearby-jabatan').hide()
                    $('.detail-nearby-email').hide()
                    $('.detail-nearby-sr').hide()
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
                // $('.detail-kios-wilayah').text(HELPER.nullConverter(res.user_regency_name) + ', ' + HELPER.nullConverter(res.user_province_name))
                var kios_wilayah = HELPER.nullConverter(res.kios_regency_name) + ", " + HELPER.nullConverter(res.kios_province_name);
                $('.detail-kios-wilayah').text(HELPER.ucwords(kios_wilayah.toLowerCase()))
            }, 200)

        }
    })
    $('.btn-back').on('click', function () { onPage('detail-dosis-pupuk') });
}

function detailPupukKios(user_id) {
    HELPER.setItem('detail_pupuk_kios', user_id)
    HELPER.setItem('from_page', 'detail-kios-pupuk')
    onPage('detail-jual-pupuk')
}

function showProduct() {
    var user_id = HELPER.getItem('kios_pupuk_user_id');

    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/listPupuk',
        data: {
            user: user_id,
        },
        complete: function (res) {
            if (res.total > 0) {
                $('.product-kios').html('')

                var slider = '';
                $.each(res.data, function (i, v) {
                    var img = './assets/images/noimage.png';
                    if (v.kios_pupuk_image) {
                        img = BASE_ASSETS + 'images/pupuk/thumbs/' + v.kios_pupuk_image;
                    }
                    $('.link-kios_pupuk_image').attr({
                        'href': img,
                        'data-lightbox': img
                    });
                    $('.detail-kios_pupuk_image').attr({
                        'src': img,
                        'title': v.kios_pupuk_image
                    });
                    var icon_harga = "assets/images/icons/icon-rp.png";
                    var icon_stok = "assets/images/icons/icon-layer.png";
                    var icon_jumlah = "fas fa-weight";
                    var icon_total = "fa fa-money-bill";

                    slider += `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:220px; width:220px;" onclick="detailPupukKios('`+ v.kios_pupuk_id + `')">
                                    <div data-height="200" class="caption bottom-10">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_pupuk_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.kios_pupuk_nama + `</h5>
                                        <h5 class="bottom-10 lh-20 font-14 center-text">`+ v.kios_pupuk_kemasan + ` Kg</h5>
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
            $('.btn-back').on('click', function () { onPage('detail-dosis-pupuk') });
        }
    })
}

function showLink(kios_link_id) {
    /* HELPER.ajax({
        url: BASE_URL + 'Kios/getLinkKios',
        data: {
            // user: user_id,
            id: HELPER.getItem('kios_pupuk_user_id'),
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
            onPage('detail-kios-pupuk')
        }
    })
}
