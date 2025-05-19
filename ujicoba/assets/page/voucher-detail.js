$(function () {
    setTimeout(function () {
        $('.back-button').off();
        if (HELPER.getItem('from_page')) {
            fromPage   = HELPER.getItem('from_page');
            $('.back-button').removeAttr('onclick')
            setTimeout(function () {
                $('.back-button').on('click', function() {
                    setTimeout(function () {
                        onPage(fromPage)
                    }, 100)
                });
            }, 200)
            HELPER.removeItem(['from_page'])
        }
    }, 300)
	loadDetailVoucher()
})

function loadDetailVoucher() {
	HELPER.ajax({
		url: BASE_URL + 'Voucher/detailVoucher',
		data: { id: HELPER.getItem('detail_voucher_id') },
		complete: function (res) {
			if (res.success) {
                var dataVoucher = res.data;
                if (dataVoucher.voucher_image) {
                    $('.voucher-card-image').css('background-image', `url(${BASE_ASSETS+'voucher/'+dataVoucher.voucher_image})`);
                }
                let voucher_price = HELPER.toRp(parseFloat(dataVoucher.voucher_value));
                let total_poin_used = Math.ceil(parseFloat(dataVoucher.voucher_value) / parseFloat(HELPER.getItem('detail_kurs_poin')));
                $('.voucher_name').text(HELPER.ucwords(dataVoucher.voucher_name))
                $('.voucher_price').text(HELPER.ucwords(voucher_price) + ' ('+total_poin_used+' Poin)')
                $('.voucher_deskripsi').text(HELPER.nullConverter(dataVoucher.voucher_deskripsi, "-"))
                $('.show-my-poin').text(HELPER.nullConverter(HELPER.getItem('detail_my_poin'), 0))
                $('.voucher_end_date').text(moment(dataVoucher.voucher_end_date).format('DD MMMM YYYY'))

            }else{
                onPage('voucher')
            }
		},
        error: function () {
            onPage('voucher')
        }
	})
}

function onTukarVoucher() {
    HELPER.confirm({
        message: 'Anda yakin ingin menukarkan dengan voucher berikut ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL+'Voucher/tukarVoucher',
                    data: {
                        voucher_id: HELPER.getItem('detail_voucher_id'),
                        user_id: HELPER.getItem('user_id')
                    },
                    complete: function (res) {
                        if (res.success) {
                            onPage('my-voucher')
                        }else{
                            HELPER.showMessage({
                                success: false,
                                message: res.message
                            })
                        }
                    }
                })
            }
        }
    })
}