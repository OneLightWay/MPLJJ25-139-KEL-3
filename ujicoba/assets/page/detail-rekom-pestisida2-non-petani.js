var markerblock = [];
var markeritem = [];
$(function () {
    setTimeout(function () {
        // $('.back-button').off();
        // if (HELPER.getItem('from_page')) {
        //     fromPage = HELPER.getItem('from_page');
        //     $('.back-button').removeAttr('onclick')
        //     setTimeout(function () {
        //         $('.back-button').on('click', function () {
        //             setTimeout(function () {
        //                 onPage('detail-rekomendasi-pestisida')
        //             }, 100)
        //         });
        //     }, 200)
        //     HELPER.removeItem(['from_page'])
        // }    
        $('.back-button').off();
        $('.btn-back-logo').off();
        if (HELPER.getItem('user_category') == 3 && HELPER.getItem('from_page')) {
            fromPage = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').off('click').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-rekom-pestisida-non-petani')
                    }, 100)
                });
                $('.btn-back-logo').off('click').on('click', function () {
                    setTimeout(function () {
                        onPage('main-kios')
                    }, 100)
                });
            }, 200)
            HELPER.removeItem(['from_page'])
        } else if (HELPER.getItem('user_category') == 4 && HELPER.getItem('from_page')){
            fromPage = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').off('click').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-rekom-pestisida-non-petani')
                    }, 100)
                });
                $('.btn-back-logo').off('click').on('click', function () {
                    setTimeout(function () {
                        onPage('main-trader')
                    }, 100)
                });
            }, 200)
        } else if (checkIsPetani()){
            if (HELPER.getItem('from_page')) {
                fromPage = HELPER.getItem('from_page');
                $('.back-button').removeAttr('onclick')
                setTimeout(function () {
                    $('.back-button').off('click').on('click', function () {
                        setTimeout(function () {
                            onPage(fromPage)
                        }, 100)
                    });
                    $('.btn-back-logo').off('click').on('click', function () {
                        setTimeout(function () {
                            onPage('main-trader')
                        }, 100)
                    });
                }, 200)
            } else {
                $('.back-button').removeAttr('onclick')
                setTimeout(function () {
                    $('.back-button').off('click').on('click', function () {
                        setTimeout(function () {
                            onPage('detail-rekom-pestisida-non-petani')
                        }, 100)
                    });
                    $('.btn-back-logo').off('click').on('click', function () {
                        setTimeout(function () {
                            onPage('main-trader')
                        }, 100)
                    });
                }, 200)
            }
        }
        showDetailPestisida()
        // loadKios()
        // showSR()
    }, 300)
})

function showDetailPestisida() {
    var pestisida_id = HELPER.getItem('detail_pestisida_id');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readPestisida',
        data: {
            pestisida_id: pestisida_id
        },
        complete: function (res) {
            var img = 'assets/images/noimage.png';
            if (res.pestisida_image) {
                img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.pestisida_image;
            }
            $('.link-pestisida_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-pestisida_image').attr({
                'src': img,
                'title': res.pestisida_image
            });
            $('.detail-pestisida_image').prop('src', img)
            $('.detail-pestisida_nama').text(HELPER.nullConverter(res.pestisida_nama))
            $('.detail-pestisida_kemasan').text(HELPER.nullConverter(Number(res.pestisida_kemasan)))
            $('.detail-pestisida_satuan').text(HELPER.nullConverter(res.pestisida_satuan))
            $('.detail-pestisida_dosis').text(HELPER.nullConverter(Number(res.pestisida_dosis)))
            $('.detail-pestisida_deskripsi').html((!HELPER.isNull(res.pestisida_deskripsi))?atob(res.pestisida_deskripsi):"-")

            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editPestisida(res.kios_pestisida_id)
                });
                $('.btn-delete').on('click', function () {
                    deletePestisida(res.kios_pestisida_id)
                });
            }, 300)
        }
    })
}

function loadKios() {
    markeritem = [];
    $('#show_list_kios').html('')
    $('#show_list_kios_exist').html('')
    var pestisida_hama = HELPER.getItem('pestisida_hama')
    var pestisida_hama_nama = HELPER.getItem('pestisida_hama_nama')
    var pestisida_id = HELPER.getItem('detail_pestisida_id');


    var nearby_lat = HELPER.getItem('user_lat');
    var nearby_long = HELPER.getItem('user_long');
    if (HELPER.getItem('nearby_lat_now') && HELPER.getItem('nearby_long_now')) {
        nearby_lat = HELPER.getItem('nearby_lat_now');
        nearby_long = HELPER.getItem('nearby_long_now');
    }

    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + 'Kios/searchKiosExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            pestisida: pestisida_id,
            nearby_lat: nearby_lat,
            nearby_long: nearby_long,
        },
        urlMore: BASE_URL + 'Kios/searchKiosMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            pestisida: pestisida_id,
            nearby_lat: nearby_lat,
            nearby_long: nearby_long,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_kios').html(`<div class="content-boxed content-box shadow-medium left-0 right-0 bottom-10">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Kios tidak tersedia.</h3>
                                                <p>Hubungi Sales Representative Anda</p>
                                            </div>
                                            <div class="content-boxed shadow-large div-sr m-0" padding-top: 15px;">
                                                <div class="caption bg-white2-dark bg-theme bottom-15" style="height: 50px;">
                                                    <div class="caption-center left-20">
                                                        <img src="" onerror="this.src='./assets/images/noimage.png'" class="round-small show-sr-waiting-img" alt="Sales Photo" style="width: 60px; height: 60px;">
                                                    </div>
                                                    <div class="caption-center left-90">
                                                        <div class="right-30">
                                                            <h1 class="font-16 bottom-0 lh-20 show-sr-waiting-nama"></h1>
                                                        </div>
                                                        <label class="font-13 show-sr-waiting-no-div" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i> <span class="show-sr-waiting-no"></span></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`)

                $('#btn-more-kios').hide()
                $('#show_list_kios_exist').show()
                $('.div-kios').hide()
                $('.div-sr').show()
            } else {
                $('#btn-more-kios').show()
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
                    $('#show_list_kios_exist').html('')
                    $.each(data_notifikasi.data, function (i, v) {
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
                        var jarak_sales = 'Unknown';
                        if (v.distance) {
                            var distance_count = Math.round(v.distance * 100) / 100;
                            jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
                        }

                        var img = 'assets/images/avatars/6s.png';
                        if (v.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + v.user_foto; }

                        var ikon_nearby = 'ikon-user.svg';
                        var nearby_nama = HELPER.nullConverter(v.user_nama);

                        if (v.user_category == 3) {
                            ikon_nearby = 'ikon-kios.svg';
                            var img = 'assets/images/avatars/6s.png';
                            var nearby_nama = HELPER.nullConverter(v.kios_nama);
                            if (v.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + v.kios_banner; }
                        }
                        //tambah latlong
                        markerblock.push([v.user_lat, v.user_long])
                        markeritem.push(data_notifikasi.data[i])

                        $('#show_list_kios').append(`
                            <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${v.user_id}" style="height:100px;">
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
                                                    <img src="assets/images/nearby/${ikon_nearby}" onerror="this.src='./assets/images/noimage.png'" alt="">
                                                </div>
                                            </div>
                                            <label class="color-theme font-12">${HELPER.nullConverter(jarak_sales)}</label>
                                        </div>
                                    </div>
                                    <div class="caption-center">
                                        <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                                    </div>
                                </div>
                            </div>
                        `)
                        $('#btn-popup-telp-' + v.user_id).off('click');
                        $('#content-sales-' + v.user_id).off('click');
                        setTimeout(function () {
                            $('#content-sales-' + v.user_id).on('click', function (e) {
                                HELPER.setItem('kios_pestisida_user_id', v.user_id)
                                HELPER.setItem('from_page', 'detail-rekomendasi-pestisida2')
                                // HELPER.setItem('farmer_sales_detail_tradder_id', v.tradder_id)
                                onPage('detail-kios-pestisida')
                            });

                        }, 200)
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
            $('#btn-more-kios').off('click').on('click', function (e) {
                callLoadMore()
            });
        },
        callbackEnd: function (dd) {
            $('#btn-more-kios').hide()
        }
    })
}

function onCallWa(el) {
    try {
        if ($(el).length > 0 && typeof $(el).data('no') != 'undefined') {
            var linkNo = "#";
            var dataNo = $(el).data('no')
            if (dataNo) {
                if (dataNo.charAt(0) == "0") {
                    linkNo = "62" + dataNo.substring(1)
                } else if (dataNo.charAt(0) == "+") {
                    linkNo = dataNo.substring(1)
                } else if (dataNo.charAt(0) != "6") {
                    linkNo = "62" + dataNo.substring(1)
                } else {
                    linkNo = dataNo
                }
            }
            var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
            $('#btn-choose-telp-wa').off('click');
            $('#btn-choose-telp-phone').off('click');
            setTimeout(function () {
                $('#btn-choose-telp-wa').on('click', function () {
                    window.location.href = linkWaMe
                });
                $('#btn-choose-telp-phone').on('click', function () {
                    window.location.href = 'tel://' + linkNo
                });
                $('#btn-telp-choose').click()
            }, 200)
        }
    } catch (e) {
        // statements
        console.log(e);
    }
}

function showSR() {
    HELPER.ajax({
        url: BASE_URL + 'Sales/showSales',
        data: {
            user_id: HELPER.getItem('user_id'),
        },
        success: function (res) {
            if (res.success) {
                setTimeout(function () {
                    $('.show-sr-waiting-img').attr('src', BASE_ASSETS + 'user/thumbs/' + res.data[0].user_foto);
                    $('.show-sr-waiting-nama').text(HELPER.nullConverter(res.data[0].user_nama))
                    $('.show-sr-waiting-no-div').data('no', res.data[0].user_telepon)
                    $('.show-sr-waiting-no').text(res.data[0].user_telepon)
                }, 200);
            }
        }
    })
}