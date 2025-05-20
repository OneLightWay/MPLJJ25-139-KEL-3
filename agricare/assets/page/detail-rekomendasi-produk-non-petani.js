var markerblock = [];
var markeritem = [];
$(function () {
    setTimeout(function () {
        $('.back-button').off();
        $('.btn-back-logo').off();
        if (HELPER.getItem('user_category') == 3) {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('rekomendasi-produk-non-petani')
                }, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-kios')
                }, 100)
            });
        } else if (HELPER.getItem('user_category') == 4){
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('rekomendasi-produk-non-petani')
                }, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-trader')
                }, 100)
            });
        }
    }, 300)

    loadReadProduct()
    loadKios()
    showSR()
})

function loadReadProduct() {
    var varietas_id = HELPER.getItem('detail_rekomendasi_varietas_id') ? HELPER.getItem('detail_rekomendasi_varietas_id') : HELPER.getItem('benih_varietas');
    HELPER.ajax({
        url: BASE_URL+'RekomendasiProduk/read',
        data: {
            id: varietas_id
        },
        complete: function (res) {
            var kelebihan = res.varietas_kelebihan ? atob(res.varietas_kelebihan) : "-"
            var img = './assets/images/noimage.png';
            if (res.varietas_image) {
                img = BASE_ASSETS + 'varietas/thumbs/' + res.varietas_image;
            }
            $('.link-varietas_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-varietas_image').attr({
                'src': img,
                'title': res.varietas_image
            });
            // if (res.varietas_banner) { img = BASE_ASSETS + 'varietasBanner/thumbs/' + res.varietas_banner; }
            $('.detail-produk-foto').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.varietas_name))
            $('.detail-potensi-hasil').text(HELPER.nullConverter(res.varietas_potensi_hasil))
            $('.detail-rata-hasil').text(HELPER.nullConverter(res.varietas_rata_hasil))
            $('.detail-kelebihan-produk').html(kelebihan)
            $('.detail-kebutuhan-benih').text(HELPER.nullConverter(res.varietas_jumlah_kebutuhan))
        }
    })
}
