$(function () {
	setTimeout(function () {
        $('.back-button').off();
        $('.btn-back-logo').off();
        if (HELPER.getItem('user_category') == 3) {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('main-kios')
                }, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-kios')
                }, 100)
            });
        } else if (HELPER.getItem('user_category') == 4){
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('main-trader')
                }, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-trader')
                }, 100)
            });
        }
    }, 300)

	loadNamaLahan()
	loadVarietas()

	$('#input_luas_lahan, #input_jarak_antar_tanam, #input_jarak_dalam_barisan, #input_jarak_antar_tanam_barisan1, #input_jarak_antar_tanam_barisan2, #input_jumlah_benih').on('keyup', function () {
		hitungPopulasi()
	});

	$('#from_lahan').on('change', function (e) {
		$('#input_nama_lahan, #input_varietas, #show_kernel, #input_jarak_antar_tanam, #input_jarak_antar_tanam_barisan1, #input_jarak_antar_tanam_barisan2, #input_jarak_dalam_barisan, #input_jumlah_benih, #input_jumlah_populasi').val('')
		$('#pilih_jarak_tanah').val('default').trigger('change')
		if ($(this).is(':checked')) {
			$('.nama-lahan').show()
			$('#input_luas_lahan').attr('readonly', true)
		} else {
			$('.nama-lahan').hide()
			$('#input_luas_lahan').removeAttr('readonly')
		}
	});

	$('#from_custom').on('change', function (e) {
		$('#input_luas_lahan, #input_varietas, #show_kernel, #input_jarak_antar_tanam, #input_jarak_antar_tanam_barisan1, #input_jarak_antar_tanam_barisan2, #input_jarak_dalam_barisan, #input_jumlah_benih, #input_jumlah_populasi').val('')
		$('#pilih_jarak_tanah').val('default').trigger('change')
		if ($(this).is(':checked')) {
			$('.nama-lahan').hide()
		} else {
			$('.nama-lahan').show()
		}
		$('#input_luas_lahan').removeAttr('readonly')
	});
	// $('#input_luas_lahan').maskMoney('mask', 10,99);
	
	// $('#input_luas_lahan').inputmask('currency', {
	// 	rightAlign: false,
	// 	prefix: "",
	// 	max: 5
	// });

	$("#input_luas_lahan").inputmask('currency', {
		greedy: false,
		rightAlign: false,
		prefix: "",
		placeholder: "0"
	});

	$('#input_jarak_antar_tanam').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_jarak_antar_tanam_barisan1').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_jarak_antar_tanam_barisan2').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_jarak_dalam_barisan').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_jumlah_populasi').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_jumlah_populasi_double').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});

	$('.populasi-double').hide()

	// $('.money').mask('000,000,000,000,000.00', {reverse: true});
});

function hitungPopulasi() {
	if ($('#input_luas_lahan').val() != "" && $('#input_jarak_antar_tanam').val() != "" && $('#input_jarak_dalam_barisan').val() != "" && $('#input_jarak_antar_tanam_barisan1').val() != "" && $('#input_jarak_antar_tanam_barisan2').val() != "" && $('#input_jumlah_benih').val() != "") {
		var luas = $('#input_luas_lahan').val()
		var jarakA = $('#input_jarak_antar_tanam').val()
		var jarakB = $('#input_jarak_dalam_barisan').val()
		var jarakC = parseFloat($('#input_jarak_antar_tanam_barisan1').val())
		var jarakD = parseFloat($('#input_jarak_antar_tanam_barisan2').val())
		var benih = $('#input_jumlah_benih').val()
		//single row
		var jarak = (jarakA / 100) * (jarakB / 100);
		var luasM = luas * 10000;
		var x = (luasM / jarak) * benih;
		var populasiS = x.toFixed(2);
		var hasilSingle = populasiS.replace(",", "");
		//double row
		var jarakRata = (jarakC + jarakD) / 2;
		var kali = jarakRata * jarakB;
		var kaliB = kali / 10000;
		var z = (luasM / kaliB) * benih;
		var populasiD = z.toFixed(2);
		var hasilDouble = populasiD.replace(",", "");

		$('#input_jumlah_populasi').val(hasilSingle).trigger('keydown').trigger('focusin');
		$('#input_jumlah_populasi_double').val(hasilDouble).trigger('keydown').trigger('focusin');
		$('#input_jarak_antar_tanam_rata').val(jarakRata).trigger('keydown').trigger('focusin');
	}
}

function loadNamaLahan() {
	var farmer_id = HELPER.getItem('user_id')
	HELPER.createCombo({
		el: 'input_nama_lahan',
		valueField: 'lahan_id',
		displayField: 'lahan_nama',
		url: BASE_URL + 'LokasiLahan/getLokasiLahan',
		data: { farmer_id: farmer_id },
		placeholder: '-Pilih Nama Lahan-',
		withNull: true,
		isSelect2: false,
		// callback : function(){}
	})
}

function loadVarietas() {
	HELPER.createCombo({
		el: 'input_varietas',
		valueField: 'varietas_id',
		displayField: 'varietas_name',
		// displayField2: 'varietas_jumlah_benih',
		url: BASE_URL + 'LokasiLahan/getVarietas',
		placeholder: '-Pilih Varietas-',
		withNull: true,
		// grouped: true,
		isSelect2: false,
	})
}

function kebutuhanBenih() {
	if ($('#input_luas_lahan').val() > "0.00" && $('#input_varietas').val() != "" && $('#input_jarak_antar_tanam').val() != "" && $('#input_jarak_dalam_barisan').val() != "0.00" && $('#input_jumlah_benih').val() > "0.00") {
		HELPER.block()
		HELPER.ajax({
			url: BASE_URL + 'KebutuhanBenih/getCountBenih',
			data: {
				input_luas_lahan: $('#input_varietas').val(),
				jenis: $('#input_varietas').val(),
			},
			complete: function (res) {
				try {
					FirebasePlugin.logEvent("cal_benih", {nk_user_id: HELPER.getItem('user_id'), nk_luas: $('#input_varietas').val(), nk_jenis: $('#input_varietas').val()});
				} catch (error) {
				}

				HELPER.setItem('benih_varietas', $('#input_varietas').val());
				HELPER.setItem('benih_varietas_nama', $('#input_varietas_nama').val());
				HELPER.setItem('benih_varietas_gambar', res.data[0].varietas_image);
				HELPER.setItem('benih_varietas_kernel', $('#show_kernel').val());
				HELPER.setItem('benih_luas_lahan', $('#input_luas_lahan').val());
				HELPER.setItem('benih_jarak_antar_tanam', $('#input_jarak_antar_tanam').val());
				HELPER.setItem('benih_jarak_antar_tanam1', $('#input_jarak_antar_tanam_barisan1').val());
				HELPER.setItem('benih_jarak_antar_tanam2', $('#input_jarak_antar_tanam_barisan2').val());
				HELPER.setItem('benih_jarak_dalam', $('#input_jarak_dalam_barisan').val());
				HELPER.setItem('benih_jumlah', $('#input_jumlah_benih').val());
				HELPER.setItem('benih_jumlah_populasi', $('#input_jumlah_populasi').val());
				HELPER.setItem('benih_jumlah_populasi_double', $('#input_jumlah_populasi_double').val());
				HELPER.setItem('benih_jumlah_dibutuhkan', $('#input_jumlah_populasi_double').val());

				setTimeout(function () {
					onPage('detail-kebutuhan-benih-non-petani');
				}, 300)
				$('page-detail').hide()
			}
		})
	} else {
		Swal.fire(
			'Pemberitahuan',
			'Lengkapi data terlebih dahulu !',
			'warning'
		)
	}
}

function onReset() {
	$('#input_luas_lahan, #input_expecting_yield, #input_jarak_antar_tanam, #input_jarak_antar_tanam_barisan1, #input_jarak_antar_tanam_barisan2, #input_jarak_dalam_barisan, #input_jumlah_benih, #input_jumlah_populasi, #input_jumlah_populasi_double').val('')
	$('#input_nama_lahan').val('').trigger('change')
	$('#input_varietas').val('').trigger('change')
	$('#pilih_jarak_tanah').val('').trigger('change')
	$('#from_lahan').prop('checked', true)
	$('#from_custom').prop('checked', false)
}

function showKernel() {
	var varietas = $('#input_varietas').val();
	if (varietas) {
		HELPER.ajax({
			url: BASE_URL + 'KebutuhanBenih/read',
			data: {
				varietas_id: varietas
			},
			type: 'POST',
			success: function (res) {
				$('#show_kernel').val(res.varietas_jumlah_benih);
				$('#input_varietas_nama').val(res.varietas_name);
			}
		})
	}
}

function showLahan() {
	var lahan = $('#input_nama_lahan').val();
	if (lahan) {
		HELPER.ajax({
			url: BASE_URL + 'LokasiLahan/readKeb',
			data: {
				lahan_id: lahan
			},
			type: 'POST',
			success: function (res) {
				$('#input_luas_lahan').val(res.lahan_luas);
				$('#input_varietas').val(res.lahan_varietas_id);
				$('#input_varietas_nama').val(res.varietas_name);
				$('#show_kernel').val(res.varietas_jumlah_benih);
			}
		})
	}
}

function showJarak(input = null) {
	if (input == "0") {
		$('.jarak-tanah').show()
		$('.double-row').hide()
		$('.input-single-row').show()
		$('#input_jarak_antar_tanam').val('70')
		$('#input_jarak_dalam_barisan').val('20')
		$('#input_jarak_antar_tanam_barisan1').val('0')
		$('#input_jarak_antar_tanam_barisan2').val('0')
		$('.populasi-single').show()
		$('.populasi-double').hide()
	} else if (input == "1") {
		$('.jarak-tanah').show()
		$('.double-row').show()
		$('.input-single-row').hide()
		$('#input_jarak_antar_tanam').val('0')
		$('#input_jarak_dalam_barisan').val('0')
		$('.populasi-single').hide()
		$('.populasi-double').show()
	}
	setTimeout(() => {
		hitungPopulasi()
	}, 300);
}