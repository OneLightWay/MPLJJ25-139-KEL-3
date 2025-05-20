var selectListScan = [];
$(function () {
    setTimeout(function () {
		$('.back-button').off();
		if (HELPER.getItem('from_page')) {
			fromPage = HELPER.getItem('from_page');
			$('.back-button').removeAttr('onclick');
			setTimeout(function () {
				$('.back-button').on('click', function() {onPage(fromPage)});
			}, 200)
			HELPER.removeItem('from_page')
		}else{
			setTimeout(function () {
				$('.back-button').on('click', function() {onPage('sales-sahabatnk-detail')});
			}, 200)
		}
	}, 300)
	loadDataFarmer(HELPER.getItem('sahabatnk_user_id'))
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

                $('#report_farmer_id').val(dataFarmer.user_id)
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

                loadScanHistroyFarmer(dataFarmer.user_id)

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

function loadScanHistroyFarmer(user_id) {
	$('#list_scan_pouch').html('')
	HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/listScanExist',
        dataExist: {
			user: user_id,
        },
        urlMore: BASE_URL + 'AkunSales/listScanMore',
        dataMore: {
			user: user_id,
        },
        callbackExist: function(data) {
			if (data.hasOwnProperty('success')) {
				$('#list_scan_pouch').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
												<div class="not-found">
													<div></div>
						                            <h3 class bhsConf-no_histori>No history scan available.</h3>
						                        </div>
											</div>`)
				$('#btn-more-list-scan-pouch').hide()
			}else{
				$('#btn-more-list-scan-pouch').show()
			}
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
				var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, v) {
					var tanggal = moment(v.qr_scan_insert_at).format('DD MMMM YYYY HH:mm')
					var status  = parseInt(v.qr_scan_status);
                    var colorStatus = "color-highlight";
                    var backgroundStatus = "#f0fff0";
                    var content = `
                        <div class="row bottom-5">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Produk : ${HELPER.nullConverter(v.product_name)}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Kode Pouch : ${HELPER.nullConverter(v.qr_scan_code)}</span>
                            </div>
                        </div>
                    `;
					
					$('#list_scan_pouch').append(`
						<div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-select-${v.qr_scan_id}" style="background: ${backgroundStatus};">
							<div class="row bottom-10">
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${tanggal}</span>
			                    </div>
			                </div>
			                ${content}
		                </div>
					`)


					$('.btn-select-'+v.qr_scan_id).off('click').on('click', function(event) {
                        onSelectScan(v)
                    });

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-list-scan-pouch').off('click').on('click', function() {
            	HELPER.block()
            	callLoadMore()
            });
        },
        callbackEnd: function () {
        	$('#btn-more-list-scan-pouch').hide()
        	$('#btn-more-list-scan-pouch').off('click');
        }
    })
}

function onSelectScan(v) {
    if (!selectListScan.includes(v.qr_scan_id)) {
        $('.menu-hider').click()
        selectListScan.push(v.qr_scan_id);

        var tanggal = moment(v.qr_scan_insert_at).format('DD MMMM YYYY HH:mm')
        var colorStatus = "color-highlight";
        var backgroundStatus = "#f0fff0";
        var content = `
            <div class="row bottom-5">
                <div class="col-auto right-10">
                    <i class="fa fa-circle ${colorStatus}"></i>
                </div>
                <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                    <span>Produk : ${HELPER.nullConverter(v.product_name)}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-auto right-10">
                    <i class="fa fa-circle ${colorStatus}"></i>
                </div>
                <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                    <span>Kode Pouch : ${HELPER.nullConverter(v.qr_scan_code)}</span>
                </div>
            </div>
        `;
        $('#list-reject-pouch-scan').append(`
            <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-delete-${v.qr_scan_id}" style="background: ${backgroundStatus};">
                <div class="row bottom-10">
                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                        <span>${tanggal}</span>
                    </div>
                </div>
                ${content}
            </div>
        `)

        $('.btn-delete-'+v.qr_scan_id).off('click').on('click', function(event) {
            onDeleteScan(v.qr_scan_id)
        });
        $('#total_list_pouch').text(selectListScan.length)
    }
}

function onDeleteScan(idd) {
    HELPER.confirm({
        message: 'Apakah Anda ingin menghapus nya ?',
        callback: function (oke) {
            if (oke) {
                HELPER.unsetArray(selectListScan, idd)
                $('.btn-delete-'+idd).off().remove();
                $('#total_list_pouch').text(selectListScan.length)
            }
        }
    })
}

function storeReportFarmer() {
	if (!HELPER.isNull($('#report_farmer_keterangan').val()) && selectListScan.length > 0) {
        HELPER.confirm({
            message: 'Apakah Anda yakin ingin melanjutkan proses report petani ?',
            callback: function (oke) {
                if (oke) {
                    HELPER.ajax({
                        url: BASE_URL + 'AkunSales/reportFarmer',
                        data: {sales_id: HELPER.getItem('user_id'), user_id: $('#report_farmer_id').val(), desc: $('#report_farmer_keterangan').val(), listScan: selectListScan, is_block: $('#report_block_farmer').is(':checked') ? 1 : 0},
                        success: function(res){
                            if (res.success) {
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Berhasil',
                                    message: 'Report petani berhail !'
                                })
                                onPage('sales-list-report-farmer')
                            }else{
                                HELPER.showMessage()
                            }
                        }
                    })
                }
            }
        })
	} else {
		HELPER.showMessage({
			success: 'warning',
			title: 'Info',
			message: 'Harap isi keterangan dan pilih pouch dahulu !'
		})
	}
}

function showChangeBlock(el) {
    if ($(el).is(':checked')) {
        HELPER.confirm({
            message:'Petani akan diblokir dan tidak dapat dikembalikan! Apakah Anda ingin lanjut?',
            callback: function (oke) {
                if (!oke) {
                    $(el).prop('checked', false)
                }
            }
        })
    }
}