$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page') == "detail-kios-nearby-pestisida") {
                // fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-kios-nearby-pestisida')
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
            } else if (HELPER.getItem('from_page') == "produk-pestisida-more") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('produk-pestisida-more')
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
                loadReadProduct()
            } else if (HELPER.getItem('from_page') == "detail-jual-pestisida") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('produk-pestisida-more')
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
    if (HELPER.getItem('from_page') == "produk-pestisida-more") {
        setTimeout(function () {
            $('.div-button').show()
        }, 300)
        loadReadProduct()
    }
})

function loadReadProduct() {
    var produk_pestisida_id = HELPER.getItem('detail_produk_pestisida_id');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPestisida',
        data: {
            id: produk_pestisida_id
        },
        complete: function (res) {
            var img = 'assets/images/noimage.png';
            if (res.kios_pestisida_image) {
                img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.kios_pestisida_image;
            }
            $('.link-pestisida_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-pestisida_image').attr({
                'src': img,
                'title': res.kios_pestisida_image
            });
            // if (res.kios_pestisida_image) { img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.kios_pestisida_image; }
            $('.detail-pestisida_image').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.kios_pestisida_nama))
            $('.detail-kemasan').text(HELPER.nullConverter(res.kios_pestisida_kemasan))
            $('.detail-satuan').text(HELPER.nullConverter(res.pestisida_satuan))
            $('.detail-stok').text(HELPER.nullConverter(res.kios_pestisida_stok))
            $('.detail-harga').text('Rp ' + HELPER.nullConverter(HELPER.toRp(res.kios_pestisida_harga)))

            if (res.kios_pestisida_available == 1) {
                $('.detail-status').text('Aktif')
                $('.btn-aktif').hide()
            } else {
                $('.detail-status').text('Tidak Aktif')
                $('.btn-nonaktif').hide()
            }

            if (res.kios_pestisida_stok == 0) {
                $('.detail-ketersediaan').text('Habis')
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }


            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editPestisida(res.kios_pestisida_id)
                });
                $('.btn-delete').on('click', function () {
                    deletePestisida(res.kios_pestisida_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifPestisida(res.kios_pestisida_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifPestisida(res.kios_pestisida_id)
                });
            }, 300)
        }
    })
}

function editPestisida(id) {
    HELPER.setItem('kios_pestisida_id', id)
    HELPER.setItem('from_page', 'detail-jual-pestisida')
    onPage('kios-edit-pestisida')
}

function deletePestisida(kios_pestisida_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menghapus produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/deletePestisida',
                    data: { kios_pestisida_id: kios_pestisida_id },
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

function nonaktifPestisida(kios_pestisida_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menonaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/nonaktifPestisida',
                    data: { kios_pestisida_id: kios_pestisida_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil menonaktifkan produk'
                            })
                            HELPER.setItem('from_page', 'detail-jual-pestisida')
                            onPage('detail-jual-pestisida')
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

function aktifPestisida(kios_pestisida_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan mengaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/aktifPestisida',
                    data: { kios_pestisida_id: kios_pestisida_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil mengaktifkan produk'
                            })
                            HELPER.setItem('from_page', 'detail-jual-pestisida')
                            onPage('detail-jual-pestisida')
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
    var produk_pestisida_id = HELPER.getItem('detail_pestisida_kios');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPestisida',
        data: {
            id: produk_pestisida_id
        },
        complete: function (res) {
            var img = 'assets/images/noimage.png';
            if (res.kios_pestisida_image) {
                img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.kios_pestisida_image;
            }
            $('.link-pestisida_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-pestisida_image').attr({
                'src': img,
                'title': res.kios_pestisida_image
            });
            // if (res.kios_pestisida_image) { img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.kios_pestisida_image; }
            $('.detail-pestisida_image').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.kios_pestisida_nama))
            $('.detail-kemasan').text(HELPER.nullConverter(res.kios_pestisida_kemasan))
            $('.detail-stok').text(HELPER.nullConverter(res.kios_pestisida_stok))
            $('.detail-harga').text('Rp ' + HELPER.nullConverter(HELPER.toRp(res.kios_pestisida_harga)))

            if (res.kios_pestisida_available == 1) {
                $('.detail-status').text('Aktif')
                $('.btn-aktif').hide()
            } else {
                $('.detail-status').text('Tidak Aktif')
                $('.btn-nonaktif').hide()
            }

            if (res.kios_pestisida_stok == 0) {
                $('.detail-ketersediaan').text('Habis')
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }


            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editPestisida(res.kios_pestisida_id)
                });
                $('.btn-delete').on('click', function () {
                    deletePestisida(res.kios_pestisida_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifPestisida(res.kios_pestisida_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifPestisida(res.kios_pestisida_id)
                });
            }, 300)
        }
    })
}