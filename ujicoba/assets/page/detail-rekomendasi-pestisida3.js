var markerblock = [];
var markeritem = [];
$(function () {
    setTimeout(function () {
        $('.back-button').off();
        if (HELPER.getItem('from_page')) {
            fromPage = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-rekomendasi-pestisida')
                    }, 100)
                });
            }, 200)
            HELPER.removeItem(['from_page'])
        }
        showDetailPestisida()
        loadKios()
        showSR()
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
            // if (res.pestisida_image) { img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.pestisida_image; }
            $('.detail-pestisida_image').prop('src', img)
            $('.detail-pestisida_nama').text(HELPER.nullConverter(res.pestisida_nama))
            $('.detail-pestisida_kemasan').text(HELPER.nullConverter(res.pestisida_kemasan))
            $('.detail-pestisida_dosis').text(HELPER.nullConverter(res.pestisida_dosis))
            $('.detail-pestisida_satuan').text(HELPER.nullConverter(res.pestisida_satuan))
            $('.detail-pestisida_deskripsi').text(HELPER.nullConverter(res.pestisida_deskripsi))

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
