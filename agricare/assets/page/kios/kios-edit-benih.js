$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('detail-jual-benih')
                }, 100)
            });
        }, 300)
    }, 300)

    $('#input_harga_varietas').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });
    $('#input_harga_pestisida').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });
    $('#input_harga_pupuk').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });
    $('#input_harga').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });

    var kios_user_id = HELPER.getItem('user_id')
    $('.kios_user_id').val(kios_user_id)

    onUpdateBenih()
})

function onUpdateBenih() {
    var kios_varietas_id = HELPER.getItem('kios_varietas_id')
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailBenih',
        data: { id: kios_varietas_id },
        complete: function (res) {
            console.log(res)

            $('#kategori_produk').val('1')
            $('#kios_varietas_id').val(res.kios_varietas_id)
            $('#input_varietas_id').val(res.kios_varietas_varietas_id)
            $('#input_kemasan').val(res.kios_varietas_kemasan)
            $('#input_stok').val(res.kios_varietas_stok)
            $('#input_harga').val(res.kios_varietas_harga)
            $('#input_varietas_nama').val(res.kios_varietas_nama)
            $('#input_varietas_image').val(res.kios_varietas_image)

            var kelebihan = res.varietas_kelebihan ? atob(res.varietas_kelebihan) : ""
            var img = './assets/images/noimage.png';
            if (res.varietas_image) {
                img = BASE_ASSETS + 'varietas/thumbs/' + res.varietas_image;
            }
            $('.link-info_gambar_produk').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-info_gambar_produk').attr({
                'src': img,
                'title': res.varietas_image
            });
            $('.detail-info_nama_produk').html(res.varietas_name);
            $('.detail-info_keterangan_produk').html(kelebihan);
        }

    })
}

function save(name) {
    var form = $('#' + name)[0];
    var formData = new FormData(form);
    HELPER.save({
        cache: false,
        data: formData,
        url: BASE_URL + 'Kios/editBenih',
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
                onPage('main-kios')
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