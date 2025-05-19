$(function () {
    if (checkIsPetugas()) {
        onPage("main-qcs");
    } else {
        loadConfig();
        loadMain();
        loadMenu();
        countDokterChat()

        setTimeout(() => {
            if ($(".halaman-history-scan-farmer").length > 0) {
                loadScanHistroyMain();
            } else {
                HELPER.newHandleValidation({
                    el: "form-check-pouch-by-no",
                    declarative: true,
                });
            }
        }, 500);
        window.localStorage.removeItem("artikel_jenis");
        window.localStorage.removeItem("artikel_urutan");
        if (HELPER.isNull("user_village_id")) {
            HELPER.showMessage({
                success: "info",
                title: "Info",
                message:
                    "Data profil Anda belum lengkap, lengkapi terlebih dahulu !",
                allowOutsideClick: false,
                callback: function () {
                    onPage("edit-akun");
                },
            });
        }
    }
    cordova.getAppVersion.getVersionNumber().then(function (versionNow) {
        $("#show_version_app").text(versionNow);
    });
});

function loadMain() {
	HELPER.ajax({
		url: BASE_URL + 'Main/getUser',
		data: { id: HELPER.getItem('user_id') },
		complete: function (res) {
			HELPER.setItem('user_total_poin', HELPER.nullConverter(res.user_total_poin, 0))
			$('.user-poin').text(HELPER.nullConverter(HELPER.nullConverter(res.user_total_poin, 0)))
		}
	})
	$('.user-name').text(HELPER.getItem('user_nama'))
	$('.user-email').text(HELPER.getItem('user_email'))
	$('.user-alamat').text(HELPER.getItem('user_alamat'))
	$('.tanggal-now').text(moment().locale('id').format('dddd, DD MMMM YYYY'))
	if (!HELPER.isNull(HELPER.getItem('user_foto'))) {
		if (HELPER.getItem('user_foto').indexOf('http') >= 0) {
			$('.user-foto').attr('src', HELPER.getItem('user_foto'));
		}else{
			if (checkIsPetugas()) {
				$('.user-foto').attr('src', BASE_ASSETS+'user/thumbs/'+HELPER.getItem('user_foto'));
			}else{
				$('.user-foto').attr('src', BASE_ASSETS+'user_mobile/thumbs/'+HELPER.getItem('user_foto'));
			}
		}
	}
}

function loadScanHistroyMain() {
	$('#list_scan_main').html('')
	HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Main/scanExist',
        dataExist: {
			user: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Main/scanMore',
        dataMore: {
			user: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
			if (data.hasOwnProperty('success')) {
				$('#list_scan_main').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
												<div class="not-found">
													<div></div>
						                            <h3 class bhsConf-no_histori>No history available.</h3>
						                        </div>
											</div>`)
				$('#btn-more-scan').hide()
			}else{
				$('#btn-more-scan').show()
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
					var colorStatus = "";
					var backgroundStatus = "";
					var content = "";

					if (status == 1) {
						colorStatus = "color-highlight";
						backgroundStatus = "#f0fff0";
						content = `
							<div class="row bottom-5">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>Material : ${HELPER.nullConverter(v.product_name)}</span>
			                    </div>
			                </div>
			                <div class="row">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>Varietas : ${HELPER.nullConverter(v.product_group)}</span>
			                    </div>
			                </div>
						`;
					}else{
						colorStatus = "color-red2-light";
						backgroundStatus = "#fcecec";
						var typeContent = "";
						if (status == 0) {
							if(HELPER.getItem('user_language') == 0 || HELPER.getItem('user_language') == null){
								typeContent = "Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli !";
							}else{
								typeContent = "QR code not found !";
							}
						}else if (status == 2) {
							if(HELPER.getItem('user_language') == 0 || HELPER.getItem('user_language') == null){
								typeContent = "QR Code yang Anda scan sudah non-aktif atau sudah di scan sebelumnya !";
							}else{
								typeContent = "Product non-active !";
							}
						}else if (status == 3) {
							if(HELPER.getItem('user_language') == 0 || HELPER.getItem('user_language') == null){
								typeContent = "Produk ini melewati akhir masa edar, silahkan cek kembali produk yang Anda beli !";
							}else{
								typeContent = "The product has passed the end of its distribution period !";
							}
						}
						content = `
							<div class="row">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${typeContent}</span>
			                    </div>
			                </div>
						`;
					}
					
					$('#list_scan_main').append(`
						<div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-detail-${v.qr_scan_id}" style="background: ${backgroundStatus};">
							<div class="row bottom-10">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-calendar-alt font-20 ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${tanggal}</span>
			                    </div>
			                </div>
			                ${content}
		                </div>
					`)


					$('.btn-detail-'+v.qr_scan_id).off('click')
					setTimeout(function () {
						$('.btn-detail-'+v.qr_scan_id).on('click', function(event) {
							onDetailScan(v.qr_scan_id, status, v.qr_scan_code)
						});
					}, 200)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                $('.show-blink').remove()
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-scan').off('click').on('click', function() {
            	HELPER.block()
            	callLoadMore()
            });
        },
        callbackEnd: function () {
        	$('#btn-more-scan').hide()
        	$('#btn-more-scan').off('click');
        }
    })
	loadTotalScan()
}

function loadConfig() {
	var detailScanReaderAkumulation = 0;
    var detailScanReader;
	HELPER.ajax({
		url: BASE_URL+'Main/loadConfig',
		complete: function (res) {
			var configMaster 	= JSON.stringify(res.master_label)
			var configSett 		= JSON.stringify(res.sett_label)
			HELPER.setItem('configMaster', configMaster)
			HELPER.setItem('configSett', configSett)
			 $.each(res.sett_data_scan, function(i, v) {
                if (v.conf_code == 'sett_data_scan_aktual') {
                    if (v.conf_value == 1) {
                        HELPER.setItem('configSettDataScanAktual', 1)
                    }else{
                        HELPER.setItem('configSettDataScanAktual', 0)
                    }
                }else{
                    if (v.conf_code == 'sett_data_scan_read_synegnta' && v.conf_value == 1) {
                        // $('.show_'+v.conf_code).hide()
                        detailScanReaderAkumulation = detailScanReaderAkumulation + 1 ;
                        detailScanReader = v.conf_code;
                    }else if(v.conf_code == 'sett_data_scan_read_simperbenih' && v.conf_value == 1){
                        // $('.show_'+v.conf_code).show()
                        detailScanReaderAkumulation = detailScanReaderAkumulation + 1 ;
                        detailScanReader = v.conf_code;
                    }
                }
            });
            HELPER.setItem('configSettScanReader', detailScanReader)
            HELPER.setItem('configSettScanReaderAkumulation', detailScanReaderAkumulation)
		}
	})
}

function onDetailScan(idd, status, code) {
	if (status == 1) {
		HELPER.block()
		HELPER.ajax({
			url: BASE_URL+'Main/detailScan',
			data: {id: idd},
			complete: function (res) {
				HELPER.unblock()
				if (res.success) {
					if (parseInt(res.data.qr_scan_type) == 0 && res.data.pouch_qr_code.indexOf("http") >= 0) {
                       if (parseInt(HELPER.getItem('configSettScanReaderAkumulation')) == 1) {
                            if (HELPER.getItem('configSettScanReader') == "sett_data_scan_read_synegnta") {
                                HELPER.unblock()
                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                setTimeout(function () {
                                    onPage('detail-scan')
                                }, 100)
                            }else{
                                HELPER.unblock()
                                window.open(res.data.pouch_link)
                            }
	                    }else{
	                        HELPER.block()
	                        $('#btn-choose-scan-app').off('click')
	                        $('#btn-choose-scan-browser').off('click')
	                        setTimeout(function () {
	                            $('#btn-choose-scan-app').on('click', function(e) {
	                                HELPER.unblock()
	                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
	                                setTimeout(function () {
	                                    onPage('detail-scan')
	                                }, 100)
	                            });
	                            $('#btn-choose-scan-browser').on('click', function(e) {
	                                HELPER.unblock()
	                                window.open(res.data.pouch_link)
	                            });
	                        }, 500)
	                        $('#btn-scan-choose').click()
	                    }
                    }else if(parseInt(res.data.qr_scan_type) == 1){
						HELPER.setItem('detail_scan', JSON.stringify(res.data));
	                    setTimeout(function () {
	                        onPage('detail-scan')
	                    }, 100)
                    }
				}else{
					showFailedScan("Kode QR tidak ditemukan !", false, null, 'not-found')
				}
			},
			error: function () {
				HELPER.unblock()
			}
		})

	}else{
		var message = "";
		var type    = null;
		if (status == 0) {
			message = `Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli, atau hubungi tim lapangan kami di wilayah Anda:`;
			type 	= 'not-found';
		}else if (status == 2) {
			message = `QR Code yang Anda scan sudah non-aktif atau sudah di scan sebelumnya! Mohon hubungi tim lapangan kami di wilayah Anda:`;
			type 	= 'non-aktif';
		}else if (status == 3) {
			message = `Produk ini melewati akhir masa edar, silahkan cek kembali produk yang Anda beli, atau hubungi tim lapangan kami di wilayah Anda:`;
			type 	= 'expired';
		}
		showFailedScan(message, false, code, type)
	}
}

function loadTotalScan() {
    HELPER.ajax({
        url: BASE_URL + "Main/totalScanUser",
        data: { user_id: HELPER.getItem("user_id") },
        complete: function (res) {
            if (res.success) {
                $(".total_scan_pouch").text(
                    HELPER.convertK(res.data.totalScanPouch)
                );
                $(".total_scan_box").text(
                    HELPER.convertK(res.data.totalScanBox)
                );
            }
        },
    });
}

function countLahan() {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Sahabat/countLahan",
            data: { user_id: HELPER.getItem("user_id") },
            complete: function (res) {
                if (res.jumlah_lahan > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
        });
    });
}

function generateKartu() {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Sahabat/generateKartuSahabat",
            data: { user_id: HELPER.getItem("user_id") },
            complete: function (res) {
                resolve(res);
            },
        });
    });
}

function downloadKartuSahabat() {
    var uri_kartu =
        BASE_URL + "AkunSales/kartuSahabat/" + HELPER.getItem("user_id");
    window.open(uri_kartu);
}

function UserisPromote(refresh = true, isPageAkun = true) {
    if (HELPER.getItem("user_is_promoted") == 1) {
        if (isPageAkun) {
            generateKartu().then((res) => {
                if (res.success) {
                    $("#prev-kartu-sahabat").attr(
                        "src",
                        "https://syngenta-project.skwn.dev/qrdev/dokumen/kartu_sahabat/" +
                            res.kartu
                    );
                    $("#btn-instant-kartu").trigger("click");
                }
            });
        } else {
            onPage("akun");
            UserisPromote(null, true);
        }
    } else {
        HELPER.ajax({
            url: BASE_URL + "Sahabat/checkRequest",
            data: { user_id: HELPER.getItem("user_id") },
            complete: function (res) {
                if (res.request_sahabat_acc_status == 1) {
                    onPage("sahabatnk-waiting");
                } else if (res.request_sahabat_acc_status == 2) {
                    Swal.fire({
                        title: "Informasi",
                        // text: "Permohonan Ditolak, Ajukan ulang ?",
                        html:'<label class="font-15">Permohonan Sahabat NK Sebelumnya Ditolak</label>'+
                        `<label class="font-15">Alasan Penolakan : ${HELPER.nullConverter(res.request_sahabat_acc_description)}</label>`+
                        '<label class="font-15">Mengajukan Permohonan Baru ?</label>',
                        icon: "info",
                        confirmButtonText: '<i class="fa fa-check"></i> Yes',
                        confirmButtonClass:
                            "button button-m shadow-small button-round-small font-14 bg-green2-dark",
                        reverseButtons: true,
                        showCancelButton: true,
                        cancelButtonText: '<i class="fa fa-times"></i> No',
                        background: "#f5f5f5",
                        cancelButtonClass:
                            "button button-m shadow-small button-round-small font-14 bg-gray2-dark",
                        customClass: {
                            title: "font-23",
                            content: "font-15",
                        },
                    }).then(function (result) {
                        if (result.value) {
                            onPage("sahabatnk-request-form");
                        }
                    });
                } else if (res.request_sahabat_acc_status == 3 && refresh) {
                    asyncRefreshData().then((res) => {
                        if (res) {
                            onPage("akun");
                            UserisPromote(false);
                        }
                    });
                } else {
                    countLahan().then((res) => {
                        if (res) {
                            onPage("sahabatnk-request-form");
                        } else {
                            HELPER.showMessage({
                                success: "info",
                                title: "Info",
                                message:
                                    "Anda belum memiliki lahan!. Silahkan input lahan terlebih dahulu",
                                callback: function () {
                                    onPage("lokasi-lahan");
                                },
                            });
                        }
                    });
                }
            },
        });
    }
}

function loadMenu() {
    HELPER.ajax({
        url: BASE_URL + "Main/loadMenu",
        complete: function (res) {
            console.log(res);
            confPetani = res.data.data.menu_petani;
            jumlah = res.data.countPetani;
            $.each(confPetani, function (i, v) {
                if (jumlah % 3) {
                    $("#div-" + v.conf_mobile_code).addClass("one-third");
                    $("#div-" + v.conf_mobile_code).addClass("last-column");
                    $("#div-" + v.conf_mobile_code).addClass("right-5");
                } else {
                    $("#div-" + v.conf_mobile_code).addClass("one-third");
                    $("#div-" + v.conf_mobile_code).addClass("last-column");
                    $("#div-" + v.conf_mobile_code).addClass("right-5");
                }

                if (parseInt(v.conf_mobile_value) == 1) {
                    $("#div-" + v.conf_mobile_code).show();
                } else {
                    $("#div-" + v.conf_mobile_code).hide();
                }
                if (v.conf_mobile_image) {
                    $("#div-" + v.conf_mobile_code).find('img').attr('src', BASE_ASSETS+'icon_feature/'+v.conf_mobile_image);
                }
            });
        },
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