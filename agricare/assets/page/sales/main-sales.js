$(function () {
	$('.show-date').text(moment().format('dddd, DD MMMM YYYY'))
	$('.show-alamat').text(HELPER.ucwords(HELPER.getItem('user_district_name') + ", " + HELPER.getItem('user_regency_name')))
	$('.show-jabatan').text(HELPER.ucwords(HELPER.getItem('jabatan_name')))
	$('.show-name').text(HELPER.ucwords(HELPER.getItem('user_nama')))
	if (!HELPER.isNull(HELPER.getItem('user_foto'))) {
		$('.user-foto').attr('src', BASE_ASSETS + 'user/thumbs/' + HELPER.getItem('user_foto'));
	}
	if (HELPER.isNull('user_village_id')) {
		HELPER.showMessage({
			success: 'info',
			title: 'Info',
			message: 'Data profil Anda belum lengkap, lengkapi terlebih dahulu !',
			allowOutsideClick: false,
			callback: function () {
				onPage('edit-akun-sales')
			}
		})
	}
	loadMenu()
	loadTotalScan()
    countDokterChat()
})

function loadTotalScan() {
	HELPER.ajax({
		url: BASE_URL + 'Main/totalScanSales',
		data: { user_id: HELPER.getItem('user_id') },
		complete: function (res) {
			if (res.success) {
				$('.show-total-scan').text(HELPER.convertK(res.data.user_total_scan))
				$('.show-total-farmer-failed-scan').text(HELPER.convertK(res.data.user_total_farmer_scan_failed))
			}
		}
	})
}

function loadMenu() {
	HELPER.ajax({
		url: BASE_URL + "Main/loadMenu",
		complete: function (res) {
			console.log(res);
			confSales = res.data.data.menu_sales;
			count = res.data.countSales
			$.each(confSales, function (i, v) {
				if (count % 3 == 0) {
					$('#div-' + v.conf_mobile_code).addClass('one-third')
					$('#div-' + v.conf_mobile_code).addClass('last-column')
					$('#div-' + v.conf_mobile_code).addClass('right-5')
				} else {
					$('#div-' + v.conf_mobile_code).addClass('one-third')
					$('#div-' + v.conf_mobile_code).addClass('right-5')
				}

				if (parseInt(v.conf_mobile_value) == 1) {
					$('#div-' + v.conf_mobile_code).show()
				} else {
					$('#div-' + v.conf_mobile_code).hide()
				}
				if (v.conf_mobile_image) {
                    $("#div-" + v.conf_mobile_code).find('.caption-bg').css('background-image', `url(${BASE_ASSETS+'icon_feature/'+v.conf_mobile_image})`);
                }
			});
		}
	});
}

function countDokterChat() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/countRoomActive",
        data: {
            id: HELPER.getItem("user_id"),
        },
        complete: function (res) {
            if (res > 0) {
                $(".chat-dokter-dot").show();
            } else {
                $(".chat-dokter-dot").hide();
            }
        },
    });
}