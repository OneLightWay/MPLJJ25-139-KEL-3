$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('detail-jual-pupuk')
                }, 100)
            });
        }, 300)
    }, 300)

    $('#input_harga').inputmask('currency', {
        rightAlign: false,
        prefix: ""
    });

    var kios_user_id = HELPER.getItem('user_id')
    $('.kios_user_id').val(kios_user_id)

    onUpdatePupuk()
})

function onUpdatePupuk() {
    var kios_pupuk_id = HELPER.getItem('kios_pupuk_id')
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPupuk',
        data: { id: kios_pupuk_id },
        complete: function (res) {
            console.log(res)

            $('#kategori_produk').val('3')
            $('#kios_pupuk_id').val(res.kios_pupuk_id)
            $('#input_pupuk_id').val(res.kios_pupuk_pupuk_id)
            $('#input_kemasan').val(res.kios_pupuk_kemasan)
            $('#input_stok').val(res.kios_pupuk_stok)
            $('#input_harga').val(res.kios_pupuk_harga)
            $('#input_pupuk_nama').val(res.kios_pupuk_nama)
            $('#input_pupuk_image').val(res.kios_pupuk_image)

            var deskripsi = res.pupuk_deskripsi ? atob(res.pupuk_deskripsi) : ""
            var img = './assets/images/noimage.png';
            if (res.pupuk_image) {
                img = BASE_ASSETS + 'images/pupuk/thumbs/' + res.pupuk_image;
            }
            $('.link-info_gambar_produk').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-info_gambar_produk').attr({
                'src': img,
                'title': res.pupuk_image
            });
            $('.detail-info_nama_produk').html(res.pupuk_nama);
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
        url: BASE_URL + 'Kios/editPupuk',
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