$(function () {
    loadReadTradder()
})



function loadReadTradder() {
    HELPER.ajax({
        url: BASE_URL+'Sales/readProdukTradder',
        data: {
            id: HELPER.getItem('detail_produk_tradder'),
        },
        complete: function (res) {
            var img = 'assets/images/avatars/produkTradder.png';
            if (res.tardder_produk_foto) { img = BASE_ASSETS+'tardderProduct/thumbs/'+res.tradder_product_foto; }
                $('.detail-tradder-produk-foto').prop('src', img)
                $('.detail-tradder-produk-nama').text(HELPER.nullConverter(res.tradder_product_nama))
                $('.detail-tradder-produk-kemasan').text(HELPER.nullConverter(res.tradder_product_kemasan))
                $('.detail-tradder-produk-stok').text(HELPER.nullConverter(res.tradder_product_stok))
                $('.detail-tradder-produk-harga').text(HELPER.nullConverter(res.tradder_product_harga))
            
        }
    })
}




