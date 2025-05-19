$(function () {
	$('.input_password').off();
	loadAkun()
	try {
		cordova.getAppVersion.getVersionNumber().then(function (versionNow) {
			$('#show_version_app').text(versionNow)
		});
	} catch (e) {
		console.log(e);
	}
})

function onScan() {
	$(".btn-kios-scan").click();
  }

function loadAkun() {
	$('.user-name').text(HELPER.getItem('user_nama'))
	// $('.user-jabatan').text(HELPER.ucwords(HELPER.getItem('jabatan_name')))
	$('.tanggal-now').text(moment().locale('id').format('dddd, DD MMMM YYYY'))
	if (!HELPER.isNull(HELPER.getItem('user_foto'))) {
		$('.user-foto').attr('src', BASE_ASSETS+'user/thumbs/'+HELPER.getItem('user_foto'));
	}
}

 function onChangeLanguage() {
    if (HELPER.getItem('user_language') == 0 || HELPER.getItem('user_language') == null){
    	$('.LanguegeCheckIdn').html(`<i class="fa fa-check" aria-hidden="true"></i>`)
    	$('.LanguegeCheckEn').html(``)
    	
    }else{
    	$('.LanguegeCheckIdn').html(``)
    	$('.LanguegeCheckEn').html(`<i class="fa fa-check" aria-hidden="true"></i>`)
    	
    }

    $('.language-modal').click();
}

function changeLanguage(setLang) {
	if (setLang == 0) {
		var title = 'Change Language';
        var message = 'Are you sure to change the language setting ?';
	}else{
		var title = 'Ubah Bahasa';
        var message = 'Apakah anda yakin ingin mengubah settingan bahasa ?';
	}
	HELPER.confirm({
		title: title,
        message: message,
        type: 'warning',
        callback: function(success,id,record,message)
		{
			if (success) {
        		HELPER.ajax ({
					url : BASE_URL+'Akun/changeLanguage',
					data: {id:HELPER.getItem('user_id'),language:setLang},
					type: "POST",
					dataType: "JSON",
					complete: function(data) {
	                    HELPER.showMessage({
							title:'Success!',
	                        message:'Data updated successfully',
	                        success:true
						})
						HELPER.setItem('user_language', setLang);
						setLangApp();

						if (setLang == 0){
							moment.locale('id');
		                	$('.LanguegeCheckIdn').html(`<i class="fa fa-check" aria-hidden="true"></i>`)
		                	$('.LanguegeCheckEn').html(``)
		                	
		                }else{
		                	moment.locale('en');
		                	$('.LanguegeCheckIdn').html(``)
		                	$('.LanguegeCheckEn').html(`<i class="fa fa-check" aria-hidden="true"></i>`)
		                	
		                }

		                $('.btn_close_language').click()
					}, error: function (jqXHR, textStatus, errorThrown) {
						HELPER.showMessage()
					}
				});
			}
		}
	})
}

function onChangePassword() {
	$('.input_password').off();
	setTimeout(function () {
		$('.input_password_baru').on('keyup focusout', function() {
			$('.error-password-miss-match').remove()
			if (
				$('#password_baru').val() != "" &&
				$('#password_baru_confirm').val() != "" &&
				$('#password_baru_confirm').val() == $('#password_baru').val() &&
				$('#password_baru').val().length >= 8 &&
				$('#password_baru_confirm').val().length >= 8
				) {
				$('.input_password_baru').parent().find('em').html('<i class="fa fa-check color-green1-dark"></i>')
			}else{
				$('.input_password_baru').parent().find('em').html('<i class="fa fa-exclamation-triangle color-red2-light"></i>')
				$('#password_baru_confirm').after('<b class="font-10 error-invalid color-red2-light error-password-miss-match">Password not match</b>')
			}
		});
	}, 200)
	$('.btn-menu-ubah-password').click();
}

function changePassword() {
	if (
		$('#password_lama').val() != "" &&
		$('#password_baru').val() != "" &&
		$('#password_baru_confirm') != ""
	) {
		if ($('#password_baru_confirm').val() == $('#password_baru').val()) {

			HELPER.block()
			HELPER.ajax({
				url: BASE_URL + 'AkunKios/changePassword',
				data: {
					user: HELPER.getItem('user_id'),
					old: $('#password_lama').val(),
					new: $('#password_baru').val()
				},
				complete: function (res) {
					HELPER.unblock()
					HELPER.showMessage({
						success: res.success,
						message: res.message,
						allowOutsideClick: false,
						callback: function () {
							onPage('akun-kios')
						}
					})
				},
				error: function () {
					HELPER.unblock()
					HELPER.showMessage({
						title: 'Perhatian',
						message: 'Oops, terjadi kesalahan teknis.'
					})
				}
			})

		}else{
			HELPER.showMessage({
				title: 'Data Belum Lengkap',
				message: 'Password confirm tidak cocok !',
				allowOutsideClick: false,
				callback: function (arg) {
					$('.btn-menu-ubah-password').click()
				}
			})
		}
	}else{
		HELPER.showMessage({
			title: 'Data Belum Lengkap',
			message: 'Pastikan semua inputan terisi !',
			allowOutsideClick: false,
			callback: function (arg) {
				$('.btn-menu-ubah-password').click()
			}
		})
	}
}

function downloadPanduan() {
	var url = BASE_ASSETS + 'manbook/manbook-syngenta-fase2.pdf';
	window.location.href = url
}

function onRefreshData() {
	HELPER.block()
	HELPER.ajax({
		url: BASE_URL + 'Akun/readNonPetani',
		data: {
			user_id: HELPER.getItem('user_id'),
		},
		complete: function (res) {
			HELPER.unblock()
			$.each(res, function (i, v) {
				window.localStorage.setItem(i, v);
			});
			setTimeout(function () {
				onPage('main-kios')
			}, 300)
		},
		error: function () {
			HELPER.unblock()
			HELPER.showMessage({
				message: 'Oops, terjadi kesalahan teknis.'
			})
		}
	})
}

/*function checkUpdate() {

	$.get(BASE_URL + 'Main/versionCheck', r => {
		
        var fileTransfer = new FileTransfer();
        fileTransfer.onprogress = function (progressEvent) {
            console.log((progressEvent.loaded / progressEvent.total) * 100, "%");
            var prog = parseFloat((progressEvent.loaded / progressEvent.total)*100).toFixed(2);
            $('#progress-update').css('width',`${prog}%`);
            $("#progress-update").next().html(`${prog}% - Progress Download`);
        };
        var uri = encodeURI('https://smscrops.com/apks/SMSCrops-latest.apk');
        var fileURL = cordova.file.externalDataDirectory + 'SMSCrops-latest.apk';

        fileTransfer.download(
            uri,
            fileURL,
            function (entry) {
                console.log("download complete: " + entry.toURL());
                cordova.plugins.exit();
                cordova.plugins.fileOpener2.open(
                    entry.toURL(),
                    'application/vnd.android.package-archive',
                    {
                        error: function (e) {
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success: function () {
                            console.log('file opened successfully');
                        }
                    }
                )
            },
            function (error) {
                console.log(error);
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
        );

    })
}*/

function onDetailScan(idd, status, code) {
	if (status == 1) {
	  HELPER.block();
	  HELPER.ajax({
		url: BASE_URL + "Toolkit/detailSampling",
		data: { id: idd },
		complete: function (res) {
		  HELPER.unblock();
		  if (res.success) {
			if (parseInt(res.data.qr_scan_type) == 0 && res.data.pouch_qr_code.indexOf("http") >= 0) {
			  if (
				parseInt(HELPER.getItem("configSettScanReaderAkumulation")) == 1
			  ) {
				if (
				  HELPER.getItem("configSettScanReader") ==
				  "sett_data_scan_read_synegnta"
				) {
				  HELPER.unblock();
				  HELPER.setItem("detail_scan", JSON.stringify(res.data));
				  setTimeout(function () {
					onPage("detail-scan");
				  }, 100);
				} else {
				  HELPER.unblock();
				  window.open(res.data.pouch_link);
				}
			  } else {
				HELPER.block();
				$("#btn-choose-scan-app").off("click");
				$("#btn-choose-scan-browser").off("click");
				setTimeout(function () {
				  $("#btn-choose-scan-app").on("click", function (e) {
					HELPER.unblock();
					HELPER.setItem("detail_scan", JSON.stringify(res.data));
					setTimeout(function () {
					  onPage("detail-scan");
					}, 100);
				  });
				  $("#btn-choose-scan-browser").on("click", function (e) {
					HELPER.unblock();
					window.open(res.data.pouch_link);
				  });
				}, 500);
				$("#btn-scan-choose").click();
			  }
			}else if(parseInt(res.data.qr_scan_type) == 1){
			  HELPER.setItem("detail_scan", JSON.stringify(res.data));
			  setTimeout(function () {
				onPage("detail-scan");
			  }, 100);
			}
		  } else {
			showFailedScan("Kode QR tidak ditemukan !", false, null, "not-found");
		  }
		},
		error: function () {
		  HELPER.unblock();
		},
	  });
	} else {
	  var message = "";
	  var type = null;
	  if (status == 0) {
		message = `Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli, atau hubungi call center dibawah ini:`;
		type = "not-found";
	  } else if (status == 2) {
		message = `Produk yang anda beli telah non-aktif, Call Center Sales Representative wilayah Anda :`;
		type = "non-aktif";
	  } else if (status == 3) {
		message = `Produk telah melewati akhir masa edar, silahkan cek kembali produk yang Anda beli, atau hubungi call center dibawah ini:`;
		type = "expired";
	  }
	  showFailedScan(message, false, code, type);
	}
  }
  
  function kiosScanPouch() {
	scanOpen(function (result) {
		kiosCekSampling(result)
	}, function (error) {
		HELPER.showMessage({
			title: 'Gagal !!',
			message: "Scanning failed: " + error
		})
	})
	/* cordova.plugins.barcodeScanner.scan(
	  function (result) {
		if (!result.cancelled) {
		  kiosCekSampling(result.text);
		}
	  },
	  function (error) {
		HELPER.showMessage({
		  title: "Gagal !!",
		  message: "Scanning failed: " + error,
		});
	  },
	  {
		preferFrontCamera: false, // iOS and Android
		showFlipCameraButton: false, // iOS and Android
		showTorchButton: true, // iOS and Android
		torchOn: false, // Android, launch with the torch switched on (if available)
		saveHistory: true, // Android, save scan history (default false)
		prompt: "Letakkan qrcode pada area pindai", // Android
		resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
		formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
		orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
		disableAnimations: true, // iOS
		disableSuccessBeep: false, // iOS and Android
	  }
	); */
  }
  
  function kiosCekSampling(text = null, batch_no = null, pouch_no = null) {
	HELPER.block();
	HELPER.ajax({
	  url: BASE_URL + "Scan/sampling",
	  data: {
		user_id: HELPER.getItem("user_id"),
		qrcode: text,
		batch_no: batch_no,
		pouch_no: pouch_no,
	  },
	  success: function (res) {
		HELPER.unblock();
		if (res.success) {
		  if (
			res.data.type == "pouch" &&
			res.data.pouch_qr_code.indexOf("http") >= 0
		  ) {
			if (
			  parseInt(HELPER.getItem("configSettScanReaderAkumulation")) == 1
			) {
			  if (
				HELPER.getItem("configSettScanReader") ==
				"sett_data_scan_read_syngenta"
			  ) {
				HELPER.unblock();
				HELPER.setItem("detail_scan", JSON.stringify(res.data));
				setTimeout(function () {
				  onPage("kios-detail-scan");
				}, 100);
			  } else {
				HELPER.unblock();
				window.open(res.data.pouch_link);
			  }
			} else {
			  HELPER.block();
			  $("#btn-choose-scan-app").off("click");
			  $("#btn-choose-scan-browser").off("click");
			  setTimeout(function () {
				$("#btn-choose-scan-app").on("click", function (e) {
				  HELPER.unblock();
				  HELPER.setItem("detail_scan", JSON.stringify(res.data));
				  setTimeout(function () {
					onPage("kios-detail-scan");
				  }, 100);
				});
				$("#btn-choose-scan-browser").on("click", function (e) {
				  HELPER.unblock();
				  window.open(res.data.pouch_link);
				});
			  }, 500);
			  $("#btn-scan-choose").click();
			}
		  } else {
			HELPER.setItem("detail_scan", JSON.stringify(res.data));
			setTimeout(function () {
			  onPage("kios-detail-scan");
			}, 100);
		  }
		} else {
		  HELPER.unblock();
		  $("#show-msg-error-sampling").text(HELPER.nullConverter(res.message));
		  $("#btn-sampling-failed").click();
		}
	  },
	  error: function (err) {
		HELPER.unblock();
		HELPER.showMessage({
		  success: false,
		  title: "Failed !",
		  message: "Oops, terjadi kesalahan teknis.",
		});
	  },
	});
  }
  
  function kiosCheckPouchByNo() {
	kiosCekSampling(null, $("#input_no_batch").val(), $("#input_no_pouch").val());
  
	setTimeout(function () {
	  $("#input_no_pouch, #input_no_batch").val("");
	}, 300);
  }