$(function () {
    setTimeout(function () {
        $('.back-button').off();
        if (HELPER.getItem('from_page_d_kios_v')) {
            fromPage = HELPER.getItem('from_page_d_kios_v');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage(fromPage)
                    }, 100)
                });
            }, 200)
            // HELPER.removeItem(['from_page'])
        } else {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('main-kios')
                }, 100)
            });
        }
    }, 300)

    if (HELPER.getItem('is_petugas') == 0) {
        $('.div-status').hide()
        $('.div-available').hide()
    }

    loadReadKios()
})

function loadReadKios() {
    HELPER.ajax({
        url: BASE_URL + 'Sales/readVarietasKios',
        data: {
            id: HELPER.getItem('detail_varietas_kios'),
        },
        complete: function (res) {
        
            var img = 'assets/images/noimage.png';
            if (res.kios_varietas_image) {
                img = BASE_ASSETS + 'varietas/thumbs/' + res.kios_varietas_image;
            }
            $('.link-varietas_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-varietas_image').attr({
                'src': img,
                'title': res.kios_varietas_image
            });
            // if (res.kios_varietas_image) { img = BASE_ASSETS + 'varietas/thumbs/' + res.kios_varietas_image; }
            $('.detail-varietas_image').prop('src', img)
            $('.detail-produk-foto').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.kios_varietas_nama))
            $('.detail-kemasan').text(HELPER.nullConverter(res.kios_varietas_kemasan))
            $('.detail-stok').text(HELPER.nullConverter(res.kios_varietas_stok))
            $('.detail-harga').text('Rp ' + HELPER.nullConverter(HELPER.toRp(res.kios_varietas_harga)))

            if (res.kios_varietas_available == 1) {
                $('.detail-status').text('Aktif')
                $('.btn-aktif').hide()
            } else {
                $('.detail-status').text('Tidak Aktif')
                $('.btn-nonaktif').hide()
            }

            if (res.kios_varietas_stok == 0) {
                $('.detail-ketersediaan').text('Habis')
                $('.detail-ketersediaan').css('background-color', '#D8334A')
            } else {
                $('.detail-ketersediaan').text('Tersedia')
                $('.detail-ketersediaan').css('background-color', '#2ecc71')
            }
        }
    })
}

