$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page') == "detail-kios-nearby-varietas") {
                // fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-kios-nearby-varietas')
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
                loadReadProductFarmer()
            } else if (HELPER.getItem('from_page') == "detail-kios-nearby") {
                // fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-kios-nearby')
                    }, 300)
                });
                // HELPER.removeItem(['from_page'])
                loadReadProductFarmer()
            } else if (HELPER.getItem('from_page') == "produk-varietas-more") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('produk-varietas-more')
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
                loadReadProduct()
            } else if (HELPER.getItem('from_page') == "detail-jual-benih") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('kios-produk-jual')
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
                loadReadProduct()
            } else {
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('kios-produk-jual')
                    }, 100)
                });
                HELPER.removeItem(['from_page'])
                loadReadProduct()
            }
        }, 300)
    }, 300)
    // if (HELPER.getItem('from_page') == 'produk-varietas-more') {
    //     $('.div-button').show()
    //     loadReadProduct()
    // }
})

function loadReadProduct() {
    var produk_varietas_id = HELPER.getItem('detail_produk_varietas_id');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailBenih',
        data: {
            id: produk_varietas_id
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
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }

            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editBenih(res.kios_varietas_id)
                });
                $('.btn-delete').on('click', function () {
                    deleteBenih(res.kios_varietas_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifBenih(res.kios_varietas_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifBenih(res.kios_varietas_id)
                });
            }, 300)
        }
    })
}

function editBenih(id) {
    HELPER.setItem('kios_varietas_id', id)
    HELPER.setItem('from_page', 'detail-jual-benih')
    onPage('kios-edit-benih')
}

function deleteBenih(kios_varietas_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menghapus produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/deleteVarietas',
                    data: { kios_varietas_id: kios_varietas_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil menghapus produk'
                            })
                            onPage('main-kios')
                        } else {
                            HELPER.showMessage()
                        }
                    },
                    error: function () {
                        HELPER.showMessage()
                    }
                })
            }
        }
    })
}

function nonaktifBenih(kios_varietas_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menonaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/nonaktifVarietas',
                    data: { kios_varietas_id: kios_varietas_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil menonaktifkan produk'
                            })
                            onPage('detail-jual-benih')
                            HELPER.setItem('from_page', 'detail-jual-benih')
                        } else {
                            HELPER.showMessage()
                        }
                    },
                    error: function () {
                        HELPER.showMessage()
                    }
                })
            }
        }
    })
}

function aktifBenih(kios_varietas_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan mengaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/aktifVarietas',
                    data: { kios_varietas_id: kios_varietas_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil mengaktifkan produk'
                            })
                            onPage('detail-jual-benih')
                            HELPER.setItem('from_page', 'detail-jual-benih')
                        } else {
                            HELPER.showMessage()
                        }
                    },
                    error: function () {
                        HELPER.showMessage()
                    }
                })
            }
        }
    })
}

function loadReadProductFarmer() {
    var produk_varietas_id = HELPER.getItem('detail_varietas_kios');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailBenih',
        data: {
            id: produk_varietas_id
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
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }

            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editBenih(res.kios_varietas_id)
                });
                $('.btn-delete').on('click', function () {
                    deleteBenih(res.kios_varietas_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifBenih(res.kios_varietas_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifBenih(res.kios_varietas_id)
                });
            }, 300)
        }
    })
}