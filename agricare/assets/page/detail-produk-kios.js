$(function () {

    loadReadKios()
})



function loadReadKios() {
    HELPER.ajax({
        url: BASE_URL + 'Sales/readProdukKios',
        data: {
            id: HELPER.getItem('detail_produk_kios'),
        },
        complete: function (res) {
            var img = 'assets/images/avatars/produkKios.png';
            if (res.kios_produk_foto) { img = BASE_ASSETS + 'KiosProduct/thumbs/' + res.kios_product_foto; }
            $('.detail-kios-produk-foto').prop('src', img)
            $('.detail-kios-produk-nama').text(HELPER.nullConverter(res.kios_product_nama))
            $('.detail-kios-produk-kemasan').text(HELPER.nullConverter(res.kios_product_kemasan))
            $('.detail-kios-produk-stok').text(HELPER.nullConverter(res.kios_product_stok))
            $('.detail-kios-produk-harga').text(HELPER.nullConverter(res.kios_product_harga))
            $('.detail-kios-produk-deskripsi').html(HELPER.nullConverter(res.kios_product_deskripsi))

        }
    })
}




