$(function () {
	setTimeout(() => {
        $('.back-button').off('click');
        $('.back-button').on('click', () => {
            onPage('git-farmer');
        });
    }, 300);
    setTimeout(() => {
        loadDataListFarmer()
        loadDataListSales()
    }, 500);
})

function loadDataListFarmer() {
	$('#div-select-list-farmer').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Sales/giftFarmerListFarmerExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            filter_search: $('#filter_search_farmer').val(),
        },
        urlMore: BASE_URL + 'Sales/giftFarmerListFarmerMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            filter_search: $('#filter_search_farmer').val(),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#div-select-list-farmer').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Anda tidak memiliki Petani.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-select-list-farmer').hide()
            }else{
                $('#btn-more-select-list-farmer').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, val) {
                    var img = 'assets/images/avatars/6s.png';
                    if (val.user_foto.indexOf('http') >= 0) {
                        img = val.user_foto;
                    }else{
                        img = BASE_ASSETS+'user_mobile/'+val.user_foto;
                    }
					var hasil = `
						<div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailSelectFarmer('${btoa(JSON.stringify(val))}')">
		                    <div class="caption-center left-20">
		                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Sales Photo" style="width: 60px; height: 60px;">
		                    </div>
		                    <div class="caption-center left-90">
		                        <div class="right-30">
		                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(val.user_nama)}</h1>
		                        </div>
		                        <label class="font-12"><i class="fa fa-map-marker color-highlight"></i> ${val.user_alamat}</label>
		                    </div>
		                    <div class="caption-center">
		                        <div class="float-right right-15"><i class="fa fa-angle-right fa-lg"></i></div>
		                    </div>
		                </div>
					`;
					$('#div-select-list-farmer').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-select-list-farmer').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-select-list-farmer').hide()
            $('#btn-more-select-list-farmer').off('click');
        }
    })
}

function onDetailSelectFarmer(data) {
    data = JSON.parse(atob(data))
	setTimeout(function () {
        var img = 'assets/images/avatars/6s.png';
        if (data.user_foto.indexOf('http') >= 0) {
            img = data.user_foto;
        }else{
            img = BASE_ASSETS+'user_mobile/'+data.user_foto;
        }
        $('#select_farmer_id').val(data.user_id)
        $('.select-farmer-foto').attr('src', img);
        $('.select-farmer-nama').text(data.user_nama)
        $('.select-farmer-alamat').text(data.user_alamat)
        $('.close-menu').click()
	}, 100)
}

function loadDataListSales() {
	$('#div-select-list-sales').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Sales/giftFarmerListSalesExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
            filter_search: $('#filter_search_sales').val(),
        },
        urlMore: BASE_URL + 'Sales/giftFarmerListSalesMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
            filter_search: $('#filter_search_sales').val(),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#div-select-list-sales').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Data Sales tidak ditemukan.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-select-list-sales').hide()
            }else{
                $('#btn-more-select-list-sales').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, val) {
                    let img = val.user_foto ? BASE_ASSETS+'user/'+val.user_foto : 'assets/images/avatars/6s.png';
					var hasil = `
						<div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailSelectSales('${btoa(JSON.stringify(val))}')">
		                    <div class="caption-center left-20">
		                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Sales Photo" style="width: 60px; height: 60px;">
		                    </div>
		                    <div class="caption-center left-90">
		                        <div class="right-30">
		                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(val.user_nama)}</h1>
		                        </div>
		                        <label class="font-12"><i class="fa fa-map-marker color-highlight"></i> ${val.user_alamat}</label>
		                    </div>
		                    <div class="caption-center">
		                        <div class="float-right right-15"><i class="fa fa-angle-right fa-lg"></i></div>
		                    </div>
		                </div>
					`;
					$('#div-select-list-sales').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-select-list-sales').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-select-list-sales').hide()
            $('#btn-more-select-list-sales').off('click');
        }
    })
}

function onDetailSelectSales(data) {
    data = JSON.parse(atob(data))
	setTimeout(function () {
        let img = data.user_foto ? BASE_ASSETS+'user/'+data.user_foto : 'assets/images/avatars/6s.png';
        $('#select_sales_id').val(data.user_id)
        $('.select-sales-foto').attr('src', img);
        $('.select-sales-nama').text(data.user_nama)
        $('.select-sales-alamat').text(data.user_alamat)
        $('.close-menu').click()
	}, 100)
}

function onSaveGift() {
    if ($('#select_farmer_id').val() && $('#select_sales_id').val()) {
        HELPER.confirm({
            message: 'Apakah Anda yakin ingin melanjutkan ?',
            callback: function (oke) {
                if (oke) {
                    $('.btn-save-gift').hide()
                    HELPER.ajax({
                        url: BASE_URL+'Sales/saveGiftFarmer',
                        data: {
                            farmer_id : $('#select_farmer_id').val(),
                            sales_id : $('#select_sales_id').val(),
                            user_id : HELPER.getItem('user_id')
                        },
                        success: function (res) {
                            if (res.success) {
                                HELPER.showMessage({
                                    success: true,
                                    message: 'Berhasil memindahakan petani ke sales baru !',
                                })
                                onPage('gift-farmer')
                            } else {
                                HELPER.showMessage({
                                    success: false,
                                    message: 'Gagal memindahkan petani ke sales baru !',
                                })
                                $('.btn-save-gift').show()
                            }
                        }
                    })
                }
            }
        })
    } else {
        HELPER.showMessage({
            success: false,
            message: 'Harap pilih Petani & Sales dahulu !'
        })
    }
}