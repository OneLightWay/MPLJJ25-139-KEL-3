$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('detail-jual-pestisida')
                }, 100)
            });
        }, 300)
    }, 300)
    $('#input_harga').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });
    $('#input_pestisida_kemasan').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });
    var kios_user_id = HELPER.getItem('user_id')
    $('.kios_user_id').val(kios_user_id)

    onUpdatePestisida()
})

function onUpdatePestisida() {
    var kios_pestisida_id = HELPER.getItem('kios_pestisida_id')
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPestisida',
        data: { id: kios_pestisida_id },
        complete: function (res) {
            console.log(res)

            $('#kategori_produk').val('2')
            $('#kios_pestisida_id').val(res.kios_pestisida_id)
            $('#input_pestisida_id').val(res.kios_pestisida_pestisida_id)
            $('#input_kemasan').val(res.kios_pestisida_kemasan)
            $('#input_pestisida_kemasan').val(res.kios_pestisida_kemasan)
            $('#input_stok').val(res.kios_pestisida_stok)
            $('#input_harga').val(res.kios_pestisida_harga)
            $('#input_pestisida_nama').val(res.kios_pestisida_nama)
            $('#input_pestisida_image').val(res.kios_pestisida_image)
            $('#input_pestisida_hama_id').val(res.kios_pestisida_pestisida_hama_id)
            var deskripsi = res.pestisida_deskripsi ? atob(res.pestisida_deskripsi) : ""
            var img = './assets/images/noimage.png';
            if (res.pestisida_image) {
                img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.pestisida_image;
            }
            $('.link-info_gambar_produk').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-info_gambar_produk').attr({
                'src': img,
                'title': res.pestisida_image
            });
            $('.detail-info_nama_produk').html(res.pestisida_nama);
            $('.detail-info_keterangan_produk').html(deskripsi);
        }

    })
}

function save(name) {
    var form = $('#' + name)[0];
    var formData = new FormData(form);
    HELPER.save({
        cache: false,
        data: formData,
        url: BASE_URL + 'Kios/editPestisida',
        contentType: false,
        processData: false,
        form: name,
        confirm: true,
        callback: function (success, id, record, message) {
            HELPER.unblock(100);
            if (success) {
                HELPER.showMessage({
                    success: true,
                    title: "Success",
                    message: "Successfully saved data"
                });
                onPage('detail-jual-pestisida')
            } else {
                HELPER.showMessage({
                    success: false,
                    title: 'Failed',
                    message: 'Failed to save data'
                })
            }
        },
        oncancel: function (result) {
            HELPER.unblock(100);
        }
    });
}