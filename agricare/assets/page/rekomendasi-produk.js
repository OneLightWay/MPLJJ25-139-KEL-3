$(function () {
    setTimeout(function () {
        $('.back-button').off();
        if (HELPER.getItem('from_page')) {
            fromPage = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('main')
                    }, 100)
                });
            }, 200)
            // HELPER.removeItem(['from_page'])
        } else {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('main')
                }, 100)
            });
        }
    }, 300)

    HELPER.createCombo({
        el: 'lahan_province_id',
        valueField: 'id',
        displayField: 'name',
        url: BASE_URL + 'RekomendasiProduk/getProv',
        withNull: true,
        isSelect2: false,
        placeholder: '-Select Province-'
    });

    $('#lahan_province_id').on('change', function (e) {
        $('.lahan_city').show();
        $('#lahan_district_id').empty().append('<option value="">-Select District-</option>')
        $('#lahan_village_id').empty().append('<option value="">-Select Village-</option>')
        var data = $('#lahan_province_id').val();
        console.log($("[name=lahan_province_id] option:selected").text())
        var province_id = data;

        HELPER.createCombo({
            el: 'lahan_city_id',
            valueField: 'id',
            displayField: 'name',
            data: { province_id: province_id },
            url: BASE_URL + 'RekomendasiProduk/getKota',
            withNull: true,
            isSelect2: false,
            // grouped: true,
            placeholder: '-Select City-',
        });

        $('#lahan_city_id').on('change', function (e) {
            $('.lahan_district').show();
            $('#lahan_village_id').empty().append('<option value="">-Select Village-</option>')
            var data = $('#lahan_city_id').val();
            var city_id = data;

            HELPER.createCombo({
                el: 'lahan_district_id',
                valueField: 'id',
                displayField: 'name',
                data: { kota_id: city_id },
                url: BASE_URL + 'RekomendasiProduk/getKecamatan',
                withNull: true,
                isSelect2: false,
                // grouped: true,
                placeholder: '-Select District-',
            });
            console.log($("[name=lahan_city_id] option:selected").text())

            $('#lahan_district_id').on('change', function (e) {
                var data = $('#lahan_district_id').val();
                var district_id = data;
                console.log($("[name=lahan_district_id] option:selected").text())

            });
        });

    });

    loadProductUser()
    $('.no-product2').hide()
    var nearby_alamat = HELPER.getItem('user_alamat').toLowerCase()
    var nearby_provinsi = HELPER.getItem('user_province_name').toLowerCase()
    var nearby_city = HELPER.getItem('user_regency_name').toLowerCase()
    var nearby_district = HELPER.getItem('user_district_name').toLowerCase()
    var nearby_village = HELPER.getItem('user_village_name').toLowerCase()
    $('.nearby-alamat').text(HELPER.ucwords(nearby_alamat + ', ' + nearby_district + ', ' + nearby_village + ', ' + nearby_city + ', ' + nearby_provinsi))
    $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true })
})

function loadProductUser() {
    var user_id = HELPER.getItem('user_id');
    var user_regency_id = HELPER.getItem('user_regency_id');
    // var regency_id = HELPER.getItem('regency_id');

    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'RekomendasiProduk/listProdukUser',
        data: {
            // user_id: HELPER.getItem('user_id'),
            // user_regency_id: HELPER.getItem('user_regency_id'),
            user: user_id,
            regency: user_regency_id,
            // regency: regency_id,
        },
        complete: function (res) {
            var slider = '';
            $.each(res.data, function (i, v) {
                if (v.lokasi_1_varietas_id == null && v.lokasi_2_varietas_id == null && v.lokasi_3_varietas_id == null) {
                    $('.no-product').show()
                    $('.show-product').hide()
                } else if (v.lokasi_1_varietas_id == null && v.lokasi_2_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img3 = './assets/images/avatars/produkTradder.png';
                    if (v.v3_var_img) {
                        img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                    }

                    $('.detail-kios_varietas_image3').attr({
                        'src': img3,
                        'title': v.v3_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_3_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image3" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else if (v.lokasi_1_varietas_id == null && v.lokasi_3_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img2 = './assets/images/avatars/produkTradder.png';
                    if (v.v2_var_img) {
                        img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                    }

                    $('.detail-kios_varietas_image2').attr({
                        'src': img2,
                        'title': v.v2_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_2_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image2" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else if (v.lokasi_2_varietas_id == null && v.lokasi_3_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img1 = './assets/images/avatars/produkTradder.png';
                    if (v.v1_var_img) {
                        img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                    }

                    $('.detail-kios_varietas_image1').attr({
                        'src': img1,
                        'title': v.v1_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image1" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else if (v.lokasi_1_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img2 = './assets/images/avatars/produkTradder.png';
                    if (v.v2_var_img) {
                        img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                    }
                    var img3 = './assets/images/avatars/produkTradder.png';
                    if (v.v3_var_img) {
                        img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                    }

                    $('.detail-kios_varietas_image2').attr({
                        'src': img2,
                        'title': v.v2_var_img
                    });

                    $('.detail-kios_varietas_image3').attr({
                        'src': img3,
                        'title': v.v3_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_2_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image2" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                            <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image3" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else if (v.lokasi_2_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img1 = './assets/images/avatars/produkTradder.png';
                    if (v.v1_var_img) {
                        img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                    }
                    var img3 = './assets/images/avatars/produkTradder.png';
                    if (v.v3_var_img) {
                        img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                    }

                    $('.detail-kios_varietas_image1').attr({
                        'src': img1,
                        'title': v.v1_var_img
                    });

                    $('.detail-kios_varietas_image3').attr({
                        'src': img3,
                        'title': v.v3_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image1" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                            <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image3" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else if (v.lokasi_3_varietas_id == null) {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img1 = './assets/images/avatars/produkTradder.png';
                    if (v.v1_var_img) {
                        img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                    }
                    var img2 = './assets/images/avatars/produkTradder.png';
                    if (v.v2_var_img) {
                        img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                    }

                    $('.detail-kios_varietas_image1').attr({
                        'src': img1,
                        'title': v.v1_var_img
                    });

                    $('.detail-kios_varietas_image2').attr({
                        'src': img2,
                        'title': v.v2_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image1" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                            <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_2_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image2" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                } else {
                    $('.no-product').hide()
                    // var img = './assets/images/noimage.png';
                    var img1 = './assets/images/avatars/produkTradder.png';
                    if (v.v1_var_img) {
                        img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                    }
                    var img2 = './assets/images/avatars/produkTradder.png';
                    if (v.v2_var_img) {
                        img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                    }
                    var img3 = './assets/images/avatars/produkTradder.png';
                    if (v.v3_var_img) {
                        img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                    }

                    $('.detail-kios_varietas_image1').attr({
                        'src': img1,
                        'title': v.v1_var_img
                    });

                    $('.detail-kios_varietas_image2').attr({
                        'src': img2,
                        'title': v.v2_var_img
                    });

                    $('.detail-kios_varietas_image3').attr({
                        'src': img3,
                        'title': v.v3_var_img
                    });

                    slider += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image1" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                            <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_2_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image2" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                            <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                    <div data-height="200" class="caption bottom-5">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image3" style="height:100px; width:70%">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                    </div>    
                                </a>
                            </div>
                        `;
                    setTimeout(function () {
                        $('.show-product').html(slider)
                        $('.show-product').show()
                        $('.show-product').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                    }, 100)
                }
            });

            HELPER.unblock()
            $('.btn-back').on('click', function () { onPage('detail-kebutuhan-benih') });
        }
    })
}

function loadProduct() {
    // var user_regency_id = HELPER.getItem('user_regency_id');
    if ($('#lahan_province_id').val() != "" && $('#lahan_city_id').val() != "" && $('#lahan_district_id').val() != "") {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL + 'RekomendasiProduk/listProduk',
            data: {
                regency: $('#lahan_district_id').val(),
                // regency: user_regency_id,
            },
            complete: function (res) {
                try {
                    FirebasePlugin.logEvent("cal_product", {nk_user_id: HELPER.getItem('user_id'), nk_regency: $('#lahan_district_id').val()});
					facebookConnectPlugin.logEvent("cal_product", {nk_user_id: HELPER.getItem('user_id'), nk_regency: $('#lahan_district_id').val()}, 1, ()=>{}, ()=>{})
                } catch (error) {
                }
                // if (res.total >= 1) {
                var slider2 = '';
                $.each(res.data, function (i, v) {
                    if (v.lokasi_1_varietas_id == null && v.lokasi_2_varietas_id == null && v.lokasi_3_varietas_id == null) {
                        $('.no-product2').show()
                        $('.rekomendasi-produk').hide()
                        $('.show-list-produk').hide()
                    } else if (v.lokasi_1_varietas_id == null && v.lokasi_2_varietas_id == null) {
                        $('.no-product2').hide()

                        var img3 = './assets/images/avatars/produkTradder.png';
                        if (v.v3_var_img) {
                            img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                        }

                        $('.detail-kios_varietas_image3').attr({
                            'src': img3,
                            'title': v.v3_var_img
                        });
                        slider2 += `<div class="item bg-theme round-small varietas-2" onclick="detailProduct('` + v.lokasi_3_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                        }, 100)
                    } else if (v.lokasi_1_varietas_id == null && v.lokasi_3_varietas_id == null) {
                        $('.no-product2').hide()

                        var img2 = './assets/images/avatars/produkTradder.png';
                        if (v.v2_var_img) {
                            img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                        }

                        $('.detail-kios_varietas_image2').attr({
                            'src': img2,
                            'title': v.v2_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-2" onclick="detailProduct('` + v.lokasi_2_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                        }, 100)
                    } else if (v.lokasi_2_varietas_id == null && v.lokasi_3_varietas_id == null) {
                        $('.no-product2').hide()

                        var img1 = './assets/images/avatars/produkTradder.png';
                        if (v.v1_var_img) {
                            img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                        }

                        $('.detail-kios_varietas_image1').attr({
                            'src': img1,
                            'title': v.v1_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-2" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                        }, 100)
                    } else if (v.lokasi_1_varietas_id == null) {
                        $('.no-product2').hide()

                        var img2 = './assets/images/avatars/produkTradder.png';
                        if (v.v2_var_img) {
                            img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                        }
                        var img3 = './assets/images/avatars/produkTradder.png';
                        if (v.v3_var_img) {
                            img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                        }

                        $('.detail-kios_varietas_image2').attr({
                            'src': img2,
                            'title': v.v2_var_img
                        });

                        $('.detail-kios_varietas_image3').attr({
                            'src': img3,
                            'title': v.v3_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_2_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                    <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                            HELPER.setItem('varietas_1', v.lokasi_1_varietas_id)
                            HELPER.setItem('varietas_2', v.lokasi_2_varietas_id)
                            HELPER.setItem('varietas_3', v.lokasi_3_varietas_id)
                        }, 100)
                    } else if (v.lokasi_2_varietas_id == null) {
                        $('.no-product2').hide()
                        var img1 = './assets/images/avatars/produkTradder.png';
                        if (v.v1_var_img) {
                            img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                        }

                        var img3 = './assets/images/avatars/produkTradder.png';
                        if (v.v3_var_img) {
                            img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                        }

                        $('.detail-kios_varietas_image1').attr({
                            'src': img1,
                            'title': v.v1_var_img
                        });

                        $('.detail-kios_varietas_image3').attr({
                            'src': img3,
                            'title': v.v3_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                    <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                            HELPER.setItem('varietas_1', v.lokasi_1_varietas_id)
                            HELPER.setItem('varietas_2', v.lokasi_2_varietas_id)
                            HELPER.setItem('varietas_3', v.lokasi_3_varietas_id)
                        }, 100)
                    } else if (v.lokasi_3_varietas_id == null) {
                        $('.no-product2').hide()
                        var img1 = './assets/images/avatars/produkTradder.png';
                        if (v.v1_var_img) {
                            img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                        }
                        var img2 = './assets/images/avatars/produkTradder.png';
                        if (v.v2_var_img) {
                            img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                        }

                        $('.detail-kios_varietas_image1').attr({
                            'src': img1,
                            'title': v.v1_var_img
                        });

                        $('.detail-kios_varietas_image2').attr({
                            'src': img2,
                            'title': v.v2_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                    <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_2_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                            HELPER.setItem('varietas_1', v.lokasi_1_varietas_id)
                            HELPER.setItem('varietas_2', v.lokasi_2_varietas_id)
                            HELPER.setItem('varietas_3', v.lokasi_3_varietas_id)
                        }, 100)
                    } else {
                        $('.no-product2').hide()

                        var img1 = './assets/images/avatars/produkTradder.png';
                        if (v.v1_var_img) {
                            img1 = BASE_ASSETS + 'varietas/thumbs/' + v.v1_var_img;
                        }
                        var img2 = './assets/images/avatars/produkTradder.png';
                        if (v.v2_var_img) {
                            img2 = BASE_ASSETS + 'varietas/thumbs/' + v.v2_var_img;
                        }
                        var img3 = './assets/images/avatars/produkTradder.png';
                        if (v.v3_var_img) {
                            img3 = BASE_ASSETS + 'varietas/thumbs/' + v.v3_var_img;
                        }

                        $('.detail-kios_varietas_image1').attr({
                            'src': img1,
                            'title': v.v1_var_img
                        });

                        $('.detail-kios_varietas_image2').attr({
                            'src': img2,
                            'title': v.v2_var_img
                        });

                        $('.detail-kios_varietas_image3').attr({
                            'src': img3,
                            'title': v.v3_var_img
                        });

                        slider2 += `<div class="item bg-theme round-small varietas-1" onclick="detailProduct('` + v.lokasi_1_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img1 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image1" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_1_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                    <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_2_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img2 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image2" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_2_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                    <div class="item bg-theme round-small varietas-2" onclick="detailProduct('`+ v.lokasi_3_varietas_id + `')">
                                        <a href="javascript:;" class="color-theme caption m-0" style="height:130px; width:150px;">
                                            <div data-height="200" class="caption bottom-5">
                                                <div class="caption-overlay bg-gradient opacity-10"></div>
                                                <img src="`+ img3 + `" onerror="this.src='./assets/images/noimage.png'" class="centerimg detail-kios_varietas_image3" style="height:100px; width:70%">
                                            </div>
                                            <div>
                                                <h5 class="bottom-0 lh-20 center-text">`+ v.lokasi_3_varietas_code + `</h5>
                                            </div>    
                                        </a>
                                    </div>
                                `;
                        setTimeout(function () {
                            $('.rekomendasi-produk').show()
                            $('.show-list-produk').html(slider2)
                            $('.show-list-produk').show()
                            $('.show-list-produk').owlCarousel({ dots: true, loop: false, margin: 20, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000, autoWidth: true });
                            HELPER.setItem('varietas_1', v.lokasi_1_varietas_id)
                            HELPER.setItem('varietas_2', v.lokasi_2_varietas_id)
                            HELPER.setItem('varietas_3', v.lokasi_3_varietas_id)
                        }, 100)
                    }
                });

                // $('.rekomendasi-produk').show()
                // $('.show-list-produk').html(slider2)
                // $('.no-product2').hide()
                // if(res.total > 1){
                //     setTimeout(function(){
                //         $('.show-list-produk').owlCarousel({dots:true, loop:false, margin:20, nav:false, lazyLoad:true, items:1, autoplay: false, autoplayTimeout:5000, autoWidth:true}); 
                //     },100)
                // }
                // else {
                //     setTimeout(function(){
                //         $('.show-list-produk').owlCarousel({dots:true, loop:false, margin:20, nav:false, lazyLoad:true, items:1, autoplay: false, autoplayTimeout:5000, autoWidth:true});     
                //     },100)
                // }
                // }else if(res.total >= 1){
                //     $('.show-list-produk').hide()
                //     $('.no-product2').show()

                // }
                HELPER.unblock()
                // $('.btn-back').on('click', function() {onPage('detail-kebutuhan-benih')});
            }
        })
    } else {
        Swal.fire(
            'Pemberitahuan',
            'Lengkapi data terlebih dahulu !',
            'warning'
        )
    }

    // $('.lahan_city').hide()
    // $('.lahan_district').hide()
    // $('#lahan_province_id').val()
}

function showKecamatan() {
    $('.form-kecamatan').show()
}

function detailProduct(id) {
    HELPER.setItem('benih_varietas', id)
    HELPER.setItem('from_page', 'rekomendasi-produk')
    onPage('detail-rekomendasi-produk')
}