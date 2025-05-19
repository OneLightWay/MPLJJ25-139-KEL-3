$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page') == "detail-kios-nearby-pupuk") {
                // fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-kios-nearby-pupuk')
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
            } else if (HELPER.getItem('from_page') == "detail-kios-pupuk") {
                // fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('detail-kios-pupuk')
                    }, 300)
                });
                // HELPER.removeItem(['from_page'])
                loadReadProductFarmer()
            } else if (HELPER.getItem('from_page') == "produk-pupuk-more") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('produk-pupuk-more')
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
                loadReadProduct()
            } else if (HELPER.getItem('from_page') == "detail-jual-pupuk") {
                // fromPage = HELPER.getItem('from_page');
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('produk-pupuk-more')
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
})

function loadReadProduct() {
    var produk_pupuk_id = HELPER.getItem('detail_produk_pupuk_id');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPupuk',
        data: {
            id: produk_pupuk_id
        },
        complete: function (res) {
            var img = 'assets/images/noimage.png';
            if (res.kios_pupuk_image) {
                img = BASE_ASSETS + 'images/pupuk/thumbs/' + res.kios_pupuk_image;
            }
            $('.link-pupuk_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-pupuk_image').attr({
                'src': img,
                'title': res.kios_pupuk_image
            });
            $('.detail-pupuk_image').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.kios_pupuk_nama))
            $('.detail-kemasan').text(HELPER.nullConverter(res.kios_pupuk_kemasan))
            $('.detail-stok').text(HELPER.nullConverter(res.kios_pupuk_stok))
            $('.detail-harga').text('Rp ' + HELPER.nullConverter(HELPER.toRp(res.kios_pupuk_harga)))

            if (res.kios_pupuk_available == 1) {
                $('.detail-status').text('Aktif')
                $('.btn-aktif').hide()
            } else {
                $('.detail-status').text('Tidak Aktif')
                $('.btn-nonaktif').hide()
            }

            if (res.kios_pupuk_stok == 0) {
                $('.detail-ketersediaan').text('Habis')
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }

            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editPupuk(res.kios_pupuk_id)
                });
                $('.btn-delete').on('click', function () {
                    deletePupuk(res.kios_pupuk_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifPupuk(res.kios_pupuk_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifPupuk(res.kios_pupuk_id)
                });
            }, 300)
        }
    })
}

function editPupuk(id) {
    HELPER.setItem('kios_pupuk_id', id)
    HELPER.setItem('from_page', 'detail-jual-pupuk')
    onPage('kios-edit-pupuk')
}

function deletePupuk(kios_pupuk_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menghapus produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/deletePupuk',
                    data: { kios_pupuk_id: kios_pupuk_id },
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

function nonaktifPupuk(kios_pupuk_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan menonaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/nonaktifPupuk',
                    data: { kios_pupuk_id: kios_pupuk_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil menonaktifkan produk'
                            })
                            HELPER.setItem('from_page', 'detail-jual-pupuk')
                            onPage('detail-jual-pupuk')
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

function aktifPupuk(kios_pupuk_id) {
    HELPER.confirm({
        title: 'Warning',
        message: 'Apa Anda yakin akan mengaktifkan produk ini ?',
        callback: function (res) {
            if (res) {
                HELPER.ajax({
                    url: BASE_URL + 'Kios/aktifPupuk',
                    data: { kios_pupuk_id: kios_pupuk_id },
                    dataType: 'json',
                    complete: function (response) {
                        if (response.success) {
                            HELPER.showMessage({
                                success: true,
                                title: 'Success',
                                message: 'Berhasil mengaktifkan produk'
                            })
                            HELPER.setItem('from_page', 'detail-jual-pupuk')
                            onPage('detail-jual-pupuk')
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
    var produk_pupuk_id = HELPER.getItem('detail_pupuk_kios');
    HELPER.ajax({
        url: BASE_URL + 'Kios/readDetailPupuk',
        data: {
            id: produk_pupuk_id
        },
        complete: function (res) {
            var img = 'assets/images/noimage.png';
            if (res.kios_pupuk_image) {
                img = BASE_ASSETS + 'images/pupuk/thumbs/' + res.kios_pupuk_image;
            }
            $('.link-pupuk_image').attr({
                'href': img,
                'data-lightbox': img
            });
            $('.detail-pupuk_image').attr({
                'src': img,
                'title': res.kios_pupuk_image
            });
            $('.detail-pupuk_image').prop('src', img)
            $('.detail-produk-nama').text(HELPER.nullConverter(res.kios_pupuk_nama))
            $('.detail-kemasan').text(HELPER.nullConverter(res.kios_pupuk_kemasan))
            $('.detail-stok').text(HELPER.nullConverter(res.kios_pupuk_stok))
            $('.detail-harga').text('Rp ' + HELPER.nullConverter(HELPER.toRp(res.kios_pupuk_harga)))

            if (res.kios_pupuk_available == 1) {
                $('.detail-status').text('Aktif')
                $('.btn-aktif').hide()
            } else {
                $('.detail-status').text('Tidak Aktif')
                $('.btn-nonaktif').hide()
            }

            if (res.kios_pupuk_stok == 0) {
                $('.detail-ketersediaan').text('Habis')
            } else {
                $('.detail-ketersediaan').text('Tersedia')
            }

            $('.btn-edit, .btn-delete').off('click')
            setTimeout(function () {
                $('.btn-edit').on('click', function () {
                    editPupuk(res.kios_pupuk_id)
                });
                $('.btn-delete').on('click', function () {
                    deletePupuk(res.kios_pupuk_id)
                });
                $('.btn-nonaktif').on('click', function () {
                    nonaktifPupuk(res.kios_pupuk_id)
                });
                $('.btn-aktif').on('click', function () {
                    aktifPupuk(res.kios_pupuk_id)
                });
            }, 300)
        }
    })
}