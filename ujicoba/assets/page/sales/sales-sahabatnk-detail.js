var fromPage = null;
$(function () {
	setTimeout(function () {
		$('.back-button').off();
		if (HELPER.getItem('from_page')) {
			fromPage = HELPER.getItem('from_page');
			$('.back-button').removeAttr('onclick')
			setTimeout(function () {
				$('.back-button').on('click', function() {onPage(fromPage)});
			}, 200)
			HELPER.removeItem('from_page')
		}else{
			setTimeout(function () {
				$('.back-button').on('click', function() {onPage('sales-sahabatnk')});
			}, 200)
		}
	}, 300)
	loadDataFarmer(HELPER.getItem('sahabatnk_user_id'))
	$('#input_date_promote').val(moment().format('YYYY-MM-DD'))
    $('#input_date_promote').prop('max', moment().format('YYYY-MM-DD'))
})

function loadDataFarmer(user_id) {
	HELPER.ajax({
		url: BASE_URL+'AkunSales/detailSahabat',
		data: {farmer_id: user_id, sales_id: HELPER.getItem('user_id')},
		complete: function (res) {
			if (res.success) {
				$('.div-sahabat').show()
				var dataFarmer = res.data.dataFarmer;
				var dataSales = res.data.dataSales;

				var img = 'assets/images/avatars/6s.png';
                if (dataFarmer.user_foto) {
                    if (dataFarmer.user_foto.indexOf('http') >= 0) {
                        img = dataFarmer.user_foto;
                    }else{
                        img = BASE_ASSETS+'user_mobile/'+dataFarmer.user_foto;
                    }
                }
				var user_address = HELPER.nullConverter(dataFarmer.user_alamat) + ", " + HELPER.nullConverter(dataFarmer.user_regency_name) + ", " + HELPER.nullConverter(dataFarmer.user_province_name);
				var linkNo = "#";
                if (dataFarmer.user_telepon) {
                    if (dataFarmer.user_telepon.charAt(0) == "0") {
						linkNo = "62" + dataFarmer.user_telepon.substring(1)
					} else if (dataFarmer.user_telepon.charAt(0) == "+") {
						linkNo = dataFarmer.user_telepon.substring(1)
					} else if (dataFarmer.user_telepon.charAt(0) != "6") {
						linkNo = "62" + dataFarmer.user_telepon.substring(1)
					} else {
						linkNo = dataFarmer.user_telepon
					}
                }

                $('.show-farmer-foto').attr('src', img);
                $('.show-farmer-name').text(HELPER.ucwords(dataFarmer.user_nama))
                $('.show-farmer-distance').text(parseFloat(dataSales.farmer_sales_distance))
                $('.show-farmer-address').text(HELPER.ucwords(user_address))
                $('.show-farmer-email').text(dataFarmer.user_email)
                $('.show-farmer-poin').text(dataFarmer.user_total_poin)
                $('.show-farmer-lahan').text(dataFarmer.total_lahan)
                $('.show-farmer-scan-success').text(dataFarmer.user_total_scan)
                $('.show-farmer-scan-failed').text(dataFarmer.user_total_scan_failed)
                $('.show-farmer-telepon').text(dataFarmer.user_telepon)
                $('.btn-call-wa').off('click');
                setTimeout(function () {
	                var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
	                $('.btn-call-wa').on('click', function(e) {
	                    $('#btn-choose-telp-wa').off('click');
	                    $('#btn-choose-telp-phone').off('click');
	                    setTimeout(function () {
	                        $('#btn-choose-telp-wa').on('click', function() {
	                            window.location.href = linkWaMe
	                        });
	                        $('#btn-choose-telp-phone').on('click', function() {
	                            window.location.href = 'tel://'+linkNo
	                        });
	                    }, 200)
	                    $('#btn-telp-choose').click()
	                });
	            }, 200)

	            if (parseInt(dataFarmer.user_is_promoted) == 1) {
	            	$('.btn-detail-promoted, .div-sahabat-no').show()
	            	$('.btn-promoted').hide()
	            	$('.btn-see-kartu, .btn-revoke-kartu').off()
	            	$('.show-farmer-sahabat-no').text(dataFarmer.user_sahabat_no.toUpperCase())
	            	if (HELPER.getItem('user_id') == dataFarmer.user_promoted_by) {
	            		$('.btn-revoke-kartu').show()
	            	}else{
	            		$('.btn-revoke-kartu').hide()
	            	}
	            	setTimeout(function () {
		            	$('.btn-see-kartu').on('click', function(event) {
		            		HELPER.setItem('sahabatnk_user_id', user_id)
							if (fromPage) {HELPER.setItem('from_page', fromPage)}
							setTimeout(function () {
								onPage('sales-sahabatnk-kartu')
							}, 100)
		            	});
		            	$('.btn-revoke-kartu').on('click', function(event) {
							onRevokeKartu(user_id)
		            	});
	            	}, 300)
	            }else{
	            	$('.btn-promoted').show()
	            	$('.btn-detail-promoted').hide()
	            	$('.btn-act-promoted').off()
	            	setTimeout(function () {
		            	$('.btn-act-promoted').on('click', function(event) {
		            		event.preventDefault();
		            		onPromoted(dataFarmer.user_id)
		            	});
	            	}, 300)
	            }

			}else{
				$('.div-sahabat').show().html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Sorry data not found.</h3>
                                            </div>
                                        </div>`)
			}
		}
	})
}

function onPromoted(farmer_id) {
	HELPER.confirm({
		message: 'Apakah anda yakin ingin mempromosikan petani berikut menjadi Sahabat NK ?',
		callback: function (oke) {
			if (oke) {
				HELPER.ajax({
					url: BASE_URL+'AkunSales/promoteFarmer',
					data: {farmer_id: farmer_id, sales_id: HELPER.getItem('user_id'), date: $('#input_date_promote').val()},
					complete: function (res) {
						if (res.success) {
							HELPER.setItem('sahabatnk_user_id', farmer_id)
							if (fromPage) {HELPER.setItem('from_page', fromPage)}
							setTimeout(function () {
								onPage('sales-sahabatnk-kartu')
							}, 100)
						}else{
							HELPER.showMessage({
								message: HELPER.nullConverter(res.message, 'Failed to promote !')
							})
						}
					}
				})
			}
		}
	})
}

function onRevokeKartu(farmer_id) {
	HELPER.confirm({
		message: 'Are you sure you want to revoke the card ?',
		callback: function (oke) {
			if (oke) {
				HELPER.ajax({
					url: BASE_URL+'AkunSales/revokeKartuSahabat',
					data:{farmer_id: farmer_id, user_id: HELPER.getItem('user_id')},
					complete: function (res) {
						if (res.success) {
							onPage('sales-sahabatnk')
						}else{
							HELPER.showMessage({
								message: 'Failed to revoke !'
							})
						}
					}
				})
			}
		}
	})
}
