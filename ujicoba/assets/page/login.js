var fvForget;
var fvEmailVerif;
var idCheckReqAcc;
var intervalLogWa;
var myVar;
$(function () {
	if (HELPER.getItem('user_id') && HELPER.getItem('user_verifikasi_type') !== 'acc') {
		window.localStorage.setItem('is_first_open', true);
		setTimeout(function () {
			if (checkIsPetugas()) {
				onPage('main-qcs')
			} else if (checkIsSales()) {
				onPage('main-sales')
			} else if (checkIsTrader()) {
				onPage('main-trader')
			} else if (checkIsKios()) {
				onPage('main-kios')
			} else {
				onPage('main')
			}
		}, 500)
	}

	if ($('.halaman-login').length > 0) {
		loadProvinsi()
		// fvForget = HELPER.newHandleValidation({
		// 	el: 'form-forget-password',
		// 	declarative: true
		// })
		if (HELPER.getItem('user_verifikasi') == "false" && HELPER.getItem('user_verifikasi_type') == 'login') {
			setTimeout(function () {
				onPage('email-verifikasi')
			}, 500)
		} else if (HELPER.getItem('user_verifikasi') == "false" && HELPER.getItem('user_verifikasi_type') == 'forgot_password') {
			setTimeout(function () {
				onPage('email-verifikasi-forgot-password')
			}, 500)
		} else if (HELPER.getItem('user_verifikasi') == "true" && HELPER.getItem('user_verifikasi_type') == 'forgot_password') {
			setTimeout(function () {
				onPage('create-new-password')
			}, 500)
		} else if (HELPER.getItem('user_verifikasi') == "true" && HELPER.getItem('user_verifikasi_type') == 'acc') {
			setTimeout(function () {
				onPage('waiting-acc')
			}, 500)
		} else if (HELPER.isNull(HELPER.getItem('status_acc_snk')) || parseInt(HELPER.getItem('status_acc_snk')) == 0) {
			onPage('index')
		} else if (HELPER.isNull(HELPER.getItem('status_acc_snk')) || parseInt(HELPER.getItem('status_acc_snk')) == 1) {
			clearInterval(window.interval_login)
			clearInterval(idCheckReqAcc)
			clearInterval(intervalLogWa)
		}
	} else if ($('.halaman-verifikasi, .halaman-verifikasi-forgot-password').length > 0) {
		fvEmailVerif = HELPER.newHandleValidation({
			el: 'form-verifikasi-email',
			declarative: true
		})
		$('.email_verifikator').text((HELPER.getItem('user_as') == "kios" || HELPER.getItem('user_as') == "trader") ? HELPER.getItem('user_verifikator_no_telp') : HELPER.getItem('user_verifikator_email'))
		$('.input_user_verifikator_id').val(HELPER.getItem('user_verifikator_id'))
		startCountdown()
	} else if ($('.halaman-waiting-acc').length > 0) {
		idCheckReqAcc = setInterval(function () {
			checkAcc()
		}, 1000);
		if (HELPER.getItem('user_verifikasi_sales_acc_id')) loadDataSRAccWaiting(HELPER.getItem('user_verifikasi_sales_acc_id'));
	}

	setTimeout(function () {
		HELPER.unblock()
	}, 500)

})

function onLogin(u = null, p = null) {
	var user_email = u ? u : $("#user_email").val();
	var user_password = p ? p : $("#user_password").val();
	var partner_code = $("#partner_code").val();
	var kios_no_telp = $("#form_kios_no_telp").val();
	var trader_no_telp = $("#form_trader_no_telp").val();
	var form_nik = $("#form_nik").val();
	var user_as = $("#user_as").val();

	if (((user_as == "petugas" || user_as == "sales") && (user_email == "" || user_password == "")) || (user_as == "kios" && (kios_no_telp == "" || partner_code == "")) || (user_as == "trader" && (trader_no_telp == "" || form_nik == ""))) {
		Swal.fire("Information", "Lengkapi dahulu form login!", "warning");
	} else {
		HELPER.block()
		var dataPhone = null;
		try {
			dataPhone = JSON.stringify({
				name: platform.name,
				version: platform.version,
				product: platform.product,
				layout: platform.layout,
				os: platform.os,
				manufacturer: platform.manufacturer,
				description: platform.description
			});
		} catch (e) {
			console.log(e);
		}
		$.ajax({
			url: BASE_URL + "Login/goVerifikasi",
			type: "POST",
			data: {
				user_email: user_email,
				user_password: user_password,
				partner_code: partner_code,
				form_nik: form_nik,
				user_as: user_as,
				kios_no_telp: kios_no_telp,
				trader_no_telp: trader_no_telp,
				user_token: FCM_TOKEN,
				phone_metadata: dataPhone
			},
			complete: function (res) {
				var msg = JSON.parse(res.responseText);
				if (msg.success == false) {
					HELPER.unblock(0)
					HELPER.showMessage({
						success: false,
						title: 'Information !',
						message: msg.message,
						allowOutsideClick: false,
						callback: function (arg) {
							if (msg.hasOwnProperty('type') && msg.type == 'fcm_failed') {
								navigator.app.exitApp();
							}
						}
					})
				} else {
					HELPER.unblock()
					HELPER.setItem('user_verifikator_id', msg.user_id)
					HELPER.setItem('user_verifikator_email', msg.user_email)
					HELPER.setItem('user_verifikator_no_telp', msg.user_telepon)
					HELPER.setItem('user_as', user_as)
					HELPER.setItem('user_verifikasi', false)
					HELPER.setItem('user_verifikasi_type', 'login')
					HELPER.setItem('countdown_verifikasi', 60)
					HELPER.showProgress({
						success: 'info',
						title: "Mohon menunggu !",
						message: '',
						callback: function (r) {
							onPage('email-verifikasi')
						}
					})
				}
			},
			error: function () {
				HELPER.unblock(0)
			}
		})
	}

}

function onReg() {
	var myQ = new Queue();
	myQ.enqueue(function (next) {
		$('.close-menu').click();
		HELPER.block()
		setTimeout(function () {
			next()
		}, 500)
	}, 'satu').enqueue(function (next) {
		var fields = [
			'input_name',
			'input_address',
			'input_notelp',
			'input_provinsi',
			'input_kota',
			'input_kecamatan',
			'input_kelurahan',
			'input_email',
		];
		$('.error-invalid').remove()
		setTimeout(function () {
			var check = 0;
			$.each(fields, function (i, v) {
				if ($('#' + v).val() != "" && $('#' + v).val() != 0) {
					check++;
				}
			});
			if (check == fields.length) {
				if (HELPER.isNull(USER_LAT) == false || HELPER.isNull(USER_LONG) == false) {
					try {
						FirebasePlugin.logEvent("sign_up", {email: $('#input_email').val(), provinsi: $('#input_provinsi').val()});
						facebookConnectPlugin.logEvent("sign_up", {email: $('#input_email').val(), provinsi: $('#input_provinsi').val()}, 1, ()=>{}, ()=>{})
					} catch (error) {
					}
					HELPER.ajax({
						url: BASE_URL + 'Login/register',
						data: {
							input_id_token: $('#input_id_token').val(),
							input_name: $('#input_name').val(),
							input_address: $('#input_address').val(),
							input_notelp: $('#input_notelp').val(),
							input_provinsi: $('#input_provinsi').val(),
							input_kota: $('#input_kota').val(),
							input_kecamatan: $('#input_kecamatan').val(),
							input_kelurahan: $('#input_kelurahan').val(),
							input_email: $('#input_email').val(),
							user_lat: USER_LAT,
							user_long: USER_LONG,
						},
						complete: function (res) {
							HELPER.unblock(0)
							next()
							if (res.success) {
								HELPER.showMessage({
									success: true,
									title: 'Success Register',
									message: 'Login to continue',
									allowOutsideClick: false,
									callback: function () {
										onPage('index')
									}
								})
							} else {
								HELPER.showMessage({
									message: res.message,
									allowOutsideClick: false,
									callback: function () {
										$('#btn-menu-register').click()
									}
								})
							}
						}
					})
				} else {
					HELPER.unblock(0)
					next()
					Swal.fire({
						title: 'Membutuhkan data Lokasi',
						text: "Aplikasi ini membutuhkan data lokasi Anda sekarang, Klik OK untuk melanjutkan !",
						icon: 'warning',
						backdrop: true,
						allowOutsideClick: false,
						confirmButtonText: 'OK',
					}).then((result) => {
						reqLocPermission()
					});
				}
			} else {
				HELPER.unblock(0)
				HELPER.showMessage({
					title: 'Lengkapi form',
					message: "Harap melengkapi seluruh form !",
					allowOutsideClick: false,
					callback: function () {
						$('#btn-menu-register').click()
					}
				})
				next()
			}
		}, 200)
	}, 'dua').dequeueAll()
}

function onDaftar() {
	var fields = [
		'input_id_token',
		'input_name',
		'input_address',
		'input_notelp',
		'input_email',
	];
	$.each(fields, function (i, v) {
		$('#' + v).val('')
	});
	try {
		window.plugins.googleplus.trySilentLogin(
			{
				'webClientId': WEB_CLIENT_ID,
				'offline': false
			},
			function (obj) {
				window.plugins.googleplus.logout()
			},
			function (msg) {
				window.plugins.googleplus.logout()
				console.log(msg)
			}
		)
	} catch (error) {
	}
	$('#btn-menu-register').click()
	setTimeout(function(){
		$('.btn-act-register').show()
	}, 1000)
}

function onGoogle() {
	var myQ = new Queue();
	myQ.enqueue(function (next) {
		HELPER.block()
		next()
	}, 'satu').enqueue(function (next) {
		try {
			window.plugins.googleplus.trySilentLogin(
				{
					'webClientId': WEB_CLIENT_ID,
					'offline': false
				},
				function (obj) {
					window.plugins.googleplus.logout()
					HELPER.showProgress({
						success: 'info',
						title: 'Mohon menunggu !',
						message: '',
						time: 2000,
						callback: function () {
							loginGoogle()
						}
					})
					next()
				},
				function (msg) {
					loginGoogle()
					next()
				}
			);
		} catch (error) {
			loginGoogle()
			next()
		}
	}, 'dua').dequeueAll();
}

function loginGoogle() {
	var myQ = new Queue();
	myQ.enqueue(function (next) {
		HELPER.block()
		next()
	}, 'one').enqueue(function (next) {
		try {
			window.plugins.googleplus.login(
				{
					'webClientId': WEB_CLIENT_ID,
					'offline': false
				},
				function (obj) {
					if (obj) {
						HELPER.ajax({
							url: BASE_URL + 'Login/goVerifikasi',
							data: { idToken: obj.idToken, fcmToken: FCM_TOKEN },
							success: function (res) {
								if (res.success) {
									HELPER.setItem('user_verifikator_id', res.user_id)
									HELPER.setItem('user_verifikator_email', res.user_email)
									HELPER.setItem('user_verifikasi', false)
									HELPER.setItem('user_verifikasi_type', 'login')
									HELPER.setItem('countdown_verifikasi', 60)
									HELPER.showProgress({
										success: 'info',
										title: "Mohon menunggu !",
										message: '',
										callback: function (r) {
											onPage('email-verifikasi')
										}
									})
								} else {
									HELPER.showMessage({
										success: 'info',
										title: 'Info !',
										message: res.message,
										allowOutsideClick: false,
										callback: function (suc) {
											if (!res.isRegistered) {
												$('#input_id_token').val(obj.idToken)
												$('#input_name').val(obj.displayName)
												$('#input_email').val(obj.email)
												$('#btn-menu-register').click();
												setTimeout(function(){
													$('.btn-act-register').show()
												}, 1000)
											}
										}
									})
								}
								next()
							},
							error: function () {
								HELPER.showMessage({
									success: false,
									title: 'Gagal !',
									message: 'Oops, terjadi kesalahan teknis.'
								})
								next()
							}
						})
					} else {
						HELPER.showMessage({
							success: false,
							title: 'Gagal !',
							message: 'Oops, terjadi kesalahan teknis.'
						})
						next()
					}
				},
				function (msg) {
					console.log(msg)
					next()
				}
			);
		} catch (error) {
			HELPER.showMessage({
				success: false,
				title: 'Gagal !',
				message: 'Oops, terjadi kesalahan teknis.'
			})
			next()
		}
	}, 'dua').enqueue(function (next) {
		HELPER.unblock()
		next()
	}, 'tiga').dequeueAll();
}

function backLogin() {
	if (HELPER.getItem('user_verifikasi_type') == 'acc') {
		HELPER.ajax({
			url: BASE_URL + 'Login/logout',
			data: {
				user_id: HELPER.getItem('user_id'),
				token: FCM_TOKEN,
			},
			success: function () {
				clearInterval(window.interval_login)
				clearInterval(idCheckReqAcc)
				window.localStorage.clear();
				try {
					FirebasePlugin.unregister();
					window.plugins.googleplus.logout()
				} catch (e) {
					console.log(e);
				}
				HELPER.showProgress({
					success: 'info',
					title: "Mohon menunggu !",
					message: '',
					callback: function (r) {
						HELPER.setItem('status_acc_snk', 1)
						onPage('login')
					}
				})
			},
			error: function () {
				clearInterval(window.interval_login)
				clearInterval(idCheckReqAcc)
				window.localStorage.clear();
				try {
					FirebasePlugin.unregister();
					window.plugins.googleplus.logout()
				} catch (e) {
					console.log(e);
				}
				HELPER.showProgress({
					success: 'info',
					title: "Mohon menunggu !",
					message: '',
					callback: function (r) {
						onPage('login')
					}
				})
			}
		})
	} else {
		clearInterval(window.interval_login)
		clearInterval(idCheckReqAcc)
		clearInterval(intervalLogWa)
		HELPER.removeItem(['user_verifikator_id', 'user_verifikator_email', 'user_verifikator_no_telp', 'user_verifikasi', 'user_verifikasi_type', 'countdown_verifikasi'])
		HELPER.showProgress({
			success: 'info',
			title: "Mohon menunggu !",
			message: '',
			callback: function (r) {
				onPage('login')
			}
		})
	}
}

function startCountdown() {
	var counter = parseInt(HELPER.getItem('countdown_verifikasi')) == 0 ? 1 : parseInt(HELPER.getItem('countdown_verifikasi'));
	var interval = setInterval(function () {
		counter--;
		$('#countdown-verifikasi').html(counter);
		HELPER.setItem('countdown_verifikasi', counter)
		// Display 'counter' wherever you want to display it.
		if (counter == 0) {
			$('#countdown-verifikasi').html("");
			$('#btn-resend-email-verifikasi').show();
			clearInterval(interval);
		}
	}, 1000);
}

function checkAcc() {
	HELPER.ajax({
		url: BASE_URL + 'Login/readReqAcc',
		data: {
			request_email_id: HELPER.getItem('request_email_id')
		},
		complete: function (res) {
			if (parseInt(res.request_email_status) == 1) {
				clearInterval(idCheckReqAcc);
				HELPER.removeItem(['user_verifikator_id', 'user_verifikator_email', 'user_verifikator_no_telp', 'user_verifikasi', 'user_verifikasi_type', 'user_verifikasi_sales_acc_id', 'countdown_verifikasi'])
				window.localStorage.setItem('open_app_date', moment().format('YYYY-MM-DD HH:mm:ss'))
				setTimeout(function () {
					if (checkIsKios()) {
						onPage('main-kios')
					} else if (checkIsTrader()) {
						onPage('main-trader')
					}
				}, 300)
			} else if (parseInt(res.request_email_status) == 2 || parseInt(res.request_email_status) == 3) {
				clearInterval(idCheckReqAcc);
				backLogin()
			}
		}
	})
}

function onVerifikasi() {
	if ($('#input_verifikasi').val()) {
		var log_user_as = HELPER.getItem('user_as');
		HELPER.block()
		var dataPhone = null;
		try {
			dataPhone = JSON.stringify({
				name: platform.name,
				version: platform.version,
				product: platform.product,
				layout: platform.layout,
				os: platform.os,
				manufacturer: platform.manufacturer,
				description: platform.description
			});
		} catch (e) {
			console.log(e);
		}
		HELPER.ajax({
			url: BASE_URL + 'Login/verifikasi',
			data: {
				id: HELPER.getItem('user_verifikator_id'),
				email: HELPER.getItem('user_verifikator_email'),
				no_telp: HELPER.getItem('user_verifikator_no_telp'),
				user_as: HELPER.getItem('user_as'),
				kode: $('#input_verifikasi').val(),
				user_token: FCM_TOKEN,
				phone_metadata: dataPhone
			},
			success: function (res) {
				HELPER.unblock()
				if (res.success) {
					try {
						FirebasePlugin.logEvent("login", {nk_user_id: res.user.user_id});
						facebookConnectPlugin.logEvent("login", {nk_user_id: res.user.user_id}, 1, ()=>{}, ()=>{})
						FirebasePlugin.logEvent("login_"+(log_user_as??"farmer"), {nk_user_id: res.user.user_id});
						facebookConnectPlugin.logEvent("login_"+(log_user_as??"farmer"), {nk_user_id: res.user.user_id}, 1, ()=>{}, ()=>{})
					} catch (error) {
					}
					HELPER.showProgress({
						success: 'info',
						title: 'Berhasil Masuk',
						message: 'Sedang mengkonfigurasi tampilan, mohon menunggu ...',
						callback: function (r) {
							clearInterval(idCheckReqAcc);
							if (parseInt(res.user.is_petugas) == 3) {
								HELPER.setItem('user_verifikasi', true)
								HELPER.setItem('user_verifikasi_type', 'acc')
								HELPER.setItem('user_verifikasi_sales_acc_id', res.user.sales_acc_id)
								HELPER.setItem('kios_id', res.user.kios_id)
							} else if (parseInt(res.user.is_petugas) == 4){
								HELPER.setItem('user_verifikasi', true)
								HELPER.setItem('user_verifikasi_type', 'acc')
								HELPER.setItem('user_verifikasi_sales_acc_id', res.user.sales_acc_id)
								HELPER.setItem('tradder_id', res.user.tradder_id)
							} else {
								HELPER.setItem('user_verifikasi', true)
								HELPER.removeItem('countdown_verifikasi')
								HELPER.removeItem('user_verifikator_id')
								HELPER.removeItem('user_verifikator_email')
								HELPER.removeItem('user_verifikator_no_telp')
								HELPER.removeItem('user_as')
							}
							$.each(res.user, function (i, v) {
								window.localStorage.setItem(i, v);
							});
							window.localStorage.setItem('open_app_date', moment().format('YYYY-MM-DD HH:mm:ss'))
							setTimeout(function () {
								if (checkIsPetugas()) {
									onPage('main-qcs')
								} else if (checkIsSales()) {
									onPage('main-sales')
								} else if (checkIsKios() || checkIsTrader()) {
									if(checkIsKios()){
										getSalesKios()
									}
									if(checkIsTrader()){
										getSalesTrader()
									}
									onPage('waiting-acc')
								} else {
									getSalesInfo()
									onPage('main')
								}
								HELPER.unblock(500)
                                if(!sseClient){
                                    channelActive()
                                }
							}, 300)
						}
					})
				} else {
					HELPER.showMessage({
						success: false,
						title: '',
						message: res.message
					})
				}
			},
			error: function () {
				HELPER.unblock()
				HELPER.showMessage({
					message: 'Oops, terjadi kesalahan teknis.'
				})
			}
		})
	} else {
		HELPER.showMessage({
			success: 'warning',
			title: '',
			message: 'Harap isi kode verifikasi !'
		})
	}
}

function onVerifikasiForgot() {
	if ($('#input_verifikasi').val()) {
		HELPER.block()
		HELPER.ajax({
			url: BASE_URL + 'Login/verifikasiForgot',
			data: {
				id: HELPER.getItem('user_verifikator_id'),
				email: HELPER.getItem('user_verifikator_email'),
				kode: $('#input_verifikasi').val(),
			},
			success: function (res) {
				HELPER.unblock()
				if (res.success) {
					HELPER.showProgress({
						success: 'info',
						title: 'Berhasil Verifikasi',
						message: 'Mohon menunggu ...',
						callback: function (r) {
							HELPER.setItem('user_verifikasi', true)
							setTimeout(function () {
								onPage('create-new-password')
							}, 300)
						}
					})
				} else {
					HELPER.showMessage({
						success: false,
						title: '',
						message: res.message
					})
				}
			},
			error: function () {
				HELPER.unblock()
				HELPER.showMessage({
					message: 'Oops, terjadi kesalahan teknis.'
				})
			}
		})
	} else {
		HELPER.showMessage({
			success: 'warning',
			title: '',
			message: 'Harap isi kode verifikasi !'
		})
	}
}

function resendEmail() {

	HELPER.block()
	HELPER.ajax({
		url: BASE_URL + 'Login/resendVerifikasi',
		data: {
			id: HELPER.getItem('user_verifikator_id'),
			email: HELPER.getItem('user_verifikator_email'),
			no_telp: HELPER.getItem('user_verifikator_no_telp'),
		},
		success: function (res) {
			HELPER.unblock()
			if (res.success) {
				HELPER.setItem('user_verifikasi', false)
				HELPER.setItem('countdown_verifikasi', 60)
				HELPER.showProgress({
					success: 'info',
					title: "Mohon menunggu !",
					message: '',
					callback: function (r) {
						onPage('email-verifikasi')
					}
				})
			} else {
				HELPER.showMessage({
					success: false,
					title: 'Gagal !',
					message: 'Oops, terjadi kesalahan teknis.'
				})
			}
		},
		error: function (err) {
			HELPER.unblock()
			HELPER.showMessage({
				success: false,
				title: 'Gagal !',
				message: 'Oops, terjadi kesalahan teknis.'
			})
		}
	})
}

function loadProvinsi(select = null) {
	HELPER.createCombo({
		el: 'input_provinsi',
		url: BASE_URL + 'Login/getProv',
		valueField: 'id',
		displayField: 'name',
		isSelect2: false,
		withNull: false,
		selectedField: select
	})

	$('#input_provinsi').on('change', function () {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kecamatan').prop('disabled', true).empty().append('<option value="">Pilih Kecamatan</option>')
		$('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
		var prov = this.value;
		loadKota(prov);
	});

	$('#input_kota').on('change', function () {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
		var kota = this.value;
		loadKecamatan(kota)
	});

	$('#input_kecamatan').on('change', function () {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kelurahan').removeAttr('disabled')
		var kecamatan = this.value;
		loadKelurahan(kecamatan);
	});

	$('#input_kelurahan').on('change', function () {
		$(this).prev().addClass('input-style-1-active')
	});
}

function loadKota(prov = null, select = null) {
	$('#input_kota').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kota',
		url: BASE_URL + 'Login/getKota',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: { province_id: prov }
	})
}

function loadKecamatan(kota = null, select = null) {
	$('#input_kecamatan').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kecamatan',
		url: BASE_URL + 'Login/getKecamatan',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: { kota_id: kota }
	})
}

function loadKelurahan(kecamatan = null, select = null) {
	$('#input_kelurahan').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kelurahan',
		url: BASE_URL + 'Login/getKelurahan',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: { kecamatan_id: kecamatan }
	})
}

function forgotPassword() {
	HELPER.ajax({
		url: BASE_URL + 'Login/reqLupaPw',
		data: { email: $('#input_email_req').val() },
		success: function (res) {
			if (res.success) {
				$('.close-menu').click();
				HELPER.setItem('user_verifikator_id', res.user_id)
				HELPER.setItem('user_verifikator_email', res.user_email)
				HELPER.setItem('user_verifikasi', false)
				HELPER.setItem('user_verifikasi_type', 'forgot_password')
				HELPER.setItem('countdown_verifikasi', 60)
				HELPER.showProgress({
					success: 'info',
					title: "Mohon menunggu !",
					message: '',
					callback: function (r) {
						onPage('email-verifikasi-forgot-password')
					}
				})
			} else {
				HELPER.showMessage({
					success: false,
					title: 'Gagal !',
					message: res.message
				})
			}
		}
	})
}

function changeCategory() {
	if ($("#user_as").val() == 'kios') {
		$('.form-all, .icon-label').hide()
		setTimeout(function () {
			$('.form-kios').show()
		}, 200)
	} else if ($("#user_as").val() == 'trader') {
		$('.form-all').hide()
		setTimeout(function () {
			$('.form-trader').show()
		}, 200)
	} else {
		$('.form-all').hide()
		$('.label-email').text('Email')
		setTimeout(function () {
			$('.form-password, .form-input-email').show()
		}, 200)
	}
}

function loadDataSRAccWaiting(sales_acc_id) {
	HELPER.ajax({
		url: BASE_URL + 'Login/loadDataSRAccWaiting',
		data: { id: sales_acc_id },
		success: function (res) {
			if (res.success) {
				$('.show-sr-waiting-img').attr('src', BASE_ASSETS + 'user/thumbs/' + res.data.user_foto);
				$('.show-sr-waiting-nama').text(HELPER.nullConverter(res.data.user_nama))
				$('.show-sr-waiting-no-div').data('no', res.data.user_telepon)
				$('.show-sr-waiting-no').text(res.data.user_telepon)
				$('.div-sr-waiting').show()
			}
		}
	})
}

function sendOtpWa() {
	if (HELPER.getItem('user_verifikator_id')) {
		HELPER.ajax({
			url: BASE_URL + 'Login/sendOtpWa',
			data: {
				user_id: HELPER.getItem('user_verifikator_id'),
			},
			complete: function (res) {
				intervalLogWa = setInterval(function () {
					logWa(res.log_wa_id)
				}, 1000)
				$('#btn-send-otp-wa').hide();

			}
		})
	}
}

function logWa(log_wa_id) {
	HELPER.ajax({
		url: BASE_URL + 'Login/readLogWa',
		data: {
			log_wa_id: log_wa_id,
		},
		complete: function (res) {
			if (!HELPER.isNull(res.data)) {
				if (res.data.log_wa_status == 'MESSAGEFAILED' || moment().diff(moment(res.data.log_created_at), 'minutes') >= 5) {
					$('#show_toast').html(`<div class="toast toast-top toast-active" id="toast-manual-8" style="width: 50vh;">
						<p class="color-white"><i class='fa fa-times left-0 right-10'></i> Gagal mengirim OTP </p>
						<div class="toast-bg opacity-95 bg-red2-dark"></div>
					</div>`);
					setTimeout(function () {
						$('#show_toast').html('')
					}, 2000)
					clearInterval(intervalLogWa)
				} else if (res.data.log_wa_status == 'MESSAGEPROCESSED') {
					$('#show_toast').html(`<div class="toast toast-top toast-active" id="toast-manual-8" style="width: 50vh;">
						<p class="color-white"><i class='fa fa-success left-0 right-10'></i> Berhasil mengirim OTP</p>
						<div class="toast-bg opacity-95 bg-green2-dark"></div>
					</div>`);
					setTimeout(function () {
						$('#show_toast').html('')
					}, 2000)
					clearInterval(intervalLogWa)
				}
			}
		}
	})
}

function onCancel() {
	HELPER.ajax({
		url: BASE_URL + 'Login/cancel',
		data: {
			id: HELPER.getItem('request_email_id')
		},
		complete: function (res) {
			backLogin()
		}
	})
}
