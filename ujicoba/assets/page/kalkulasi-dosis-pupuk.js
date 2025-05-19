$(function () {
	HELPER.removeItem('dari_lahan')
	HELPER.removeItem('dari_custom')
	HELPER.removeItem('lahan_check')
	HELPER.removeItem('custom_check')
	loadVarietas()
	loadNamaLahan()

	$('#input_luas_lahan').inputmask('currency', {
		rightAlign: false,
		prefix: "",
		// min:0.01,
		max: 5
	});
	$('#input_luas_lahan_uncek').inputmask('currency', {
		rightAlign: false,
		prefix: "",
		// min:0.01,
		max: 5
	});
	$('#input_expecting_yield').inputmask('currency', {
		rightAlign: false,
		prefix: "",
		max: 14
	});
	$('#input_expecting_yield_uncek').inputmask('currency', {
		rightAlign: false,
		prefix: "",
		max: 14
	});
	$('#input_soil_analisis_n').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_soil_analisis_o').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_soil_analisis_bray').inputmask('currency', {
		rightAlign: false,
		prefix: "",
	});
	$('#input_soil_analisis_k2o').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});

	$('#input_hasil_urea').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_hasil_sp36').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_hasil_kcl').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});

	$('#input_hasil_urea_output1').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_hasil_sp36_output1').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_hasil_kcl_output1').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});

	HELPER.removeItem(['input_analisa_tanah'])

	$('input[type="checkbox"]').click(function () {
		if ($('#input_analisa_tanah').prop("checked")) {
			console.log("Checkbox is checked.");
			$('.analisa-tanah').show()
			$('.luas-cek').show()
			$('.luas-uncek').hide()
			$('.ey-cek').show()
			$('.ey-uncek').hide()
			$('#input_expecting_yield').val('')
			// $('#input_luas_lahan').val('')
			$('#input_soil_analisis_n').val('')
			$('#input_soil_analisis_o').val('')
			$('#input_soil_analisis_bray').val('')
			$('#input_soil_analisis_k2o').val('')
			$('#input_analisa_tanah').val('1')
			HELPER.setItem('input_analisa_tanah', 1)
		} else {
			console.log("Checkbox is unchecked.");
			$('.analisa-tanah').hide()
			$('.luas-cek').hide()
			$('.luas-uncek').show()
			$('.ey-cek').hide()
			$('.ey-uncek').show()
			HELPER.removeItem('input_analisa_tanah')
		}
	});

	$('#from_custom').click(function () {
		HELPER.setItem('dari_custom', 0)
		if (HELPER.getItem('input_analisa_tanah') == 1) {
			console.log("radio is checked.");
			$('.nama-lahan').hide()
			$('.analisa-tanah').show()
			$('.luas-cek').show()
			$('.luas-uncek').hide()
			$('.ey-cek').show()
			$('.ey-uncek').hide()
			$('#input_expecting_yield').val('')
			$('#input_soil_analisis_n').val('')
			$('#input_soil_analisis_o').val('')
			$('#input_soil_analisis_bray').val('')
			$('#input_soil_analisisk_2o').val('')
			$('#input_analisa_tanah').val('1')
			$('#input_luas_lahan').val('')
			$('#input_luas_lahan_uncek').val('')
			$('#input_luas_lahan').removeAttr('readonly')
			$('#input_luas_lahan_uncek').removeAttr('readonly')
			HELPER.setItem('custom_check', 1)
		} else {
			$('.nama-lahan').hide()
			$('.luas-cek').hide()
			$('.luas-uncek').show()
			$('.ey-cek').hide()
			$('.ey-uncek').show()
			$('#from_custom').val('0')
			$('#input_luas_lahan').val('')
			$('#input_luas_lahan_uncek').val('')
			$('#input_luas_lahan').removeAttr('readonly')
			$('#input_luas_lahan_uncek').removeAttr('readonly')
			HELPER.setItem('custom_check', 0)
		}
	});

	$('.luas-cek').hide()
	$('.ey-cek').hide()

	$('#tambah_varietas').on('change', function (e) {
		if ($(this).is(':checked')) {
			$('.nama-lahan').show()
		} else {
			$('.nama-lahan').hide()
		}
	});

	$('#from_lahan').on('change', function (e) {
		$('#input_luas_lahan_uncek , #input_varietas, #show_kernel, #input_expecting_yield, #input_soil_analisis_n, #input_soil_analisis_o, #input_soil_analisis_bray, #input_soil_analisis_k2o').val('')
		if ($(this).is(':checked')) {
			$('#input_nama_lahan').val('').trigger('change')
			$('.nama-lahan').show()
			$('.luas-cek').hide()
			$('.luas-uncek').show()
			$('.ey-cek').hide()
			$('.ey-uncek').show()
			$('#input_luas_lahan').val('')
			$('#input_luas_lahan_uncek').val('')
			$('#input_luas_lahan').attr('readonly', true)
			$('#input_luas_lahan_uncek').attr('readonly', true)
			HELPER.setItem('lahan_check', 1)
		} else {
			HELPER.setItem('lahan_check', 0)
		}
	});

	HELPER.newHandleValidation({
		el: 'form-KalkulatorPupuk',
		setting: [
			{
				name: "Luas Lahan",
				selector: "#input_luas_lahan",
				rule: {
					promise: {
						promise: function (input) {

							return new Promise(function (resolve, reject) {

								var luas = $(input.element).val()
								if (parseFloat(luas) > 0 && parseFloat(luas) <= 5) {
									resolve({
										valid: true 		// Required
									});
								} else {
									resolve({
										valid: false,               // Required
										message: 'Luas lahan harus lebih dari 0 dan kurang dari 5',   // Optional
									});
								}

							});

						}
					}
				},
			},
			{
				name: "Luas Lahan",
				selector: "#input_luas_lahan_uncek",
				rule: {
					promise: {
						promise: function (input) {

							return new Promise(function (resolve, reject) {

								var luas = $(input.element).val()
								if (parseFloat(luas) > 0 && parseFloat(luas) <= 5) {
									resolve({
										valid: true 		// Required
									});
								} else {
									resolve({
										valid: false,               // Required
										message: 'Luas lahan harus lebih dari 0 dan kurang dari 5',   // Optional
									});
								}

							});

						}
					}
				},
			},
			{
				name: "Expecting Yield",
				selector: "#input_expecting_yield",
				rule: {
					promise: {
						promise: function (input) {

							return new Promise(function (resolve, reject) {

								var luas = $(input.element).val()
								if (parseFloat(luas) > 0 && parseFloat(luas) <= 14) {
									resolve({
										valid: true 		// Required
									});
								} else {
									resolve({
										valid: false,               // Required
										message: 'Expecting yield harus lebih dari 0',   // Optional
									});
								}

							});

						}
					}
				},
			},
			{
				name: "Expecting Yield",
				selector: "#input_expecting_yield_uncek",
				rule: {
					promise: {
						promise: function (input) {

							return new Promise(function (resolve, reject) {

								var luas = $(input.element).val()
								if (parseFloat(luas) > 0 && parseFloat(luas) <= 14) {
									resolve({
										valid: true 		// Required
									});
								} else {
									resolve({
										valid: false,               // Required
										message: 'Expecting yield harus lebih dari 0',   // Optional
									});
								}

							});

						}
					}
				},
			},

		],
		declarative: true,
	});

});

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
		url: BASE_URL + 'Pupuk/getVarietas',
		placeholder: '-Pilih Varietas-',
		withNull: true,
		// grouped: true,
		isSelect2: false,
	})
}

function kebutuhanPupuk() {
	// if ($('#input_luas_lahan').val() != "" && $('#input_expecting_yield').val() != "" && $('#input_soil_analisis_n').val() != "" && $('#input_soil_analisis_o').val() != "" && $('#input_soil_analisis_bray').val() != "" && $('#input_soil_analisis_k2o').val() != "") {	
	// if ($('#input_luas_lahan').val() != "" || $('#input_luas_lahan_uncek').val() != ""  ) {	
	if ($('#input_luas_lahan').val() != "" || $('#input_luas_lahan_uncek').val() > "0.00") {
		HELPER.block()
		HELPER.ajax({
			url: BASE_URL + 'Pupuk/getCountPupuk',
			// data:{input_luas_lahan:$('#input_luas_lahan').val()},

			complete: function (res) {
				try {
					FirebasePlugin.logEvent("cal_pupuk", {nk_user_id: HELPER.getItem('user_id'), nk_luas: $('#input_luas_lahan').val(), nk_expect: $('#input_expecting_yield_uncek').val()});
					facebookConnectPlugin.logEvent("cal_pupuk", {nk_user_id: HELPER.getItem('user_id'), nk_luas: $('#input_luas_lahan').val(), nk_expect: $('#input_expecting_yield_uncek').val()}, 1, ()=>{}, ()=>{})
				} catch (error) {
				}

				HELPER.setItem('pupuk_luas_lahan', $('#input_luas_lahan').val());
				HELPER.setItem('pupuk_luas_lahan_uncek', $('#input_luas_lahan_uncek').val());
				// HELPER.setItem('pupuk_varietas', $('#input_varietas').val());
				HELPER.setItem('pupuk_varietas_name', res.data[0].varietas_name);
				HELPER.setItem('pupuk_varietas', $('#input_varietas').val());
				HELPER.setItem('pupuk_expecting_yield', $('#input_expecting_yield').val());
				HELPER.setItem('pupuk_expecting_yield_uncek', $('#input_expecting_yield_uncek').val());
				HELPER.setItem('pupuk_soil_a', $('#input_soil_analisis_n').val());
				HELPER.setItem('pupuk_soil_b', $('#input_soil_analisis_o').val());
				HELPER.setItem('pupuk_soil_c', $('#input_soil_analisis_bray').val());
				HELPER.setItem('pupuk_soil_d', $('#input_soil_analisis_k2o').val());
				HELPER.setItem('pupuk_urea', $('#input_hasil_urea').val());
				HELPER.setItem('pupuk_sp36', $('#input_hasil_sp36').val());
				HELPER.setItem('pupuk_kcl', $('#input_hasil_kcl').val());
				HELPER.setItem('urea_majemuk', $('#input_hasil_urea_output1').val());
				HELPER.setItem('sp36_majemuk', $('#input_hasil_sp36_output1').val());
				HELPER.setItem('kcl_majemuk', $('#input_hasil_kcl_output1').val());
				HELPER.setItem('dari_lahan', 0);
				HELPER.setItem('from_custom', $('#from_custom').val());

				onPage('detail-dosis-pupuk')
				onReset()
				HELPER.unblock()
			}
		})
	} else {
		Swal.fire(
			'Pemberitahuan',
			'Lengkapi data dahulu !',
			'warning'
		)
	}
}

function detailPestisida(id) {
	HELPER.block()
	HELPER.ajax({
		url: BASE_URL + 'Pestisida/read',
		data: { pestisida_id: id },
		complete: function (res) {

			HELPER.setItem('pestisida_image', res.pestisida_image);
			HELPER.setItem('pestisida_nama', res.pestisida_nama);
			HELPER.setItem('pestisida_kemasan', res.pestisida_kemasan);
			HELPER.setItem('pestisida_dosis', res.pestisida_dosis);
			HELPER.setItem('pestisida_deskripsi', res.pestisida_deskripsi);
			HELPER.setItem('from_page', 'kalkulasi-dosis-pupuk')
			setTimeout(function(){
				onPage('detail-rekomendasi-pestisida2')
			}, 500)

			HELPER.unblock()
		}

	})
}

function showLahan() {
	// $('.analisa-tanah').show()

	$('#input_expecting_yield').val('8')
	$('#input_soil_analisis_n').val('0')
	$('#input_soil_analisis_o').val('0')
	$('#input_soil_analisis_bray').val('10')
	$('#input_soil_analisis_k2o').val('10')
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
				$('#input_luas_lahan_uncek').val(res.lahan_luas);
				$('#input_varietas').val(res.lahan_varietas_id);
				HELPER.setItem('pupuk_luas_lahan_uncek', res.lahan_luas);
			}
		})
	}
}

function onReset() {
	$('#input_luas_lahan, #input_expecting_yield, #input_soil_analisis_n, #input_soil_analisis_o, #input_soil_analisis_bray, input_soil_analisis_k2o').val('')
	$('#input_nama_lahan').val('').trigger('change')
	$('#input_varietas').val('').trigger('change')
	$('#from_lahan').prop('checked', true)
	$('#from_custom').prop('checked', false)
	$('#input_analisa_tanah').prop('checked', false).trigger('change');
}

function unCheck() {
	$('.analisa-tanah').hide()
	$('#input_expecting_yield_uncek').val('')
	$('#input_soil_analisis_n').val('0')
	$('#input_soil_analisis_o').val('0')
	$('#input_soil_analisis_bray').val('10')
	$('#input_soil_analisis_k2o').val('10')
	//urea
	$('#input_expecting_yield_uncek, #input_soil_analisis_n, #input_soil_analisis_o').on('keyup', function () {
		if ($('#input_luas_lahan_uncek').val() > "0.00" && $('#input_expecting_yield_uncek').val() != "" && $('#input_soil_analisis_n').val() != "" && $('#input_soil_analisis_o').val() != "") {
			var luas = $('#input_luas_lahan_uncek').val()
			var exYield = $('#input_expecting_yield_uncek').val()
			var soilA = $('#input_soil_analisis_n').val()
			var soilB = $('#input_soil_analisis_o').val()
			var b = luas.replace(",", "")
			var bushel = exYield * 15.932;
			var count1 = 1.2 * bushel;
			var count2 = 8 * soilA;
			var count3 = 0.14 * bushel * soilB;
			var nFertilizer = 35 + (count1 - count2 - count3);
			var nFertilizerkg = nFertilizer * 1.1198;
			var x = nFertilizerkg * 100 / 45;
			var urea = x * luas;
			var hasilUrea = urea.toFixed(2);
			$('#input_hasil_urea').val(hasilUrea).trigger('keydown').trigger('focusin')
			$('#input_hasil_urea_output1').val(nFertilizerkg).trigger('keydown').trigger('focusin')
			console.log(hasilUrea)
			console.log(nFertilizerkg)
		}
	});

	//sp36
	$('#input_luas_lahan_uncek, #input_soil_analisis_bray').on('keyup', function () {
		if ($('#input_luas_lahan_uncek').val() > "0.00" && $('#input_soil_analisis_bray').val() != "") {
			var luas = $('#input_luas_lahan_uncek').val()
			var soilC = parseFloat($('#input_soil_analisis_bray').val())
			var pFer = 25 - soilC;
			var pFertilizer = pFer * 4;
			var pFertilizerkg = pFertilizer * 1.1198;
			var y = pFertilizerkg * 100 / 36;
			var sp36 = y * luas;
			var hasilSp36 = sp36.toFixed(2);
			$('#input_hasil_sp36').val(hasilSp36).trigger('keydown').trigger('focusin')
			$('#input_hasil_sp36_output1').val(pFertilizerkg).trigger('keydown').trigger('focusin')
			console.log(hasilSp36)
		}
	});

	//kcl
	$('#input_luas_lahan_uncek, #input_soil_analisis_k2o').on('keyup', function () {
		if ($('#input_luas_lahan_uncek').val() > "0.00" && $('#input_soil_analisis_k2o').val() != "") {
			var luas = $('#input_luas_lahan_uncek').val()
			var k2o = parseFloat($('#input_soil_analisis_k2o').val())
			var rekKalium = 125 - k2o;
			var kalium = rekKalium * 1.1198;
			var z = kalium * 100 / 60;
			var kcl = z * luas;
			var hasilKcl = kcl.toFixed(2);
			$('#input_hasil_kcl').val(hasilKcl).trigger('keydown').trigger('focusin')
			$('#input_hasil_kcl_output1').val(kalium).trigger('keydown').trigger('focusin')
			console.log(hasilKcl)
		}
	});
}

function onChecked() {
	// $('.analisa-tanah').show()
	$('#input_expecting_yield').val('')
	$('#input_soil_analisis_n').val('0')
	$('#input_soil_analisis_o').val('0')
	$('#input_soil_analisis_bray').val('0')
	$('#input_soil_analisis_k2o').val('0')
	//urea
	$('#input_luas_lahan, #input_expecting_yield, #input_soil_analisis_n, #input_soil_analisis_o').on('keyup', function () {
		if ($('#input_luas_lahan').val() != "" && $('#input_expecting_yield').val() != "" && $('#input_soil_analisis_n').val() != "" && $('#input_soil_analisis_o').val() != "") {
			var luas = $('#input_luas_lahan').val()
			var exYield = $('#input_expecting_yield').val()
			var soilA = $('#input_soil_analisis_n').val()
			var soilB = $('#input_soil_analisis_o').val()
			var b = luas.replace(",", "")
			var bushel = exYield * 15.932;
			var count1 = 1.2 * bushel;
			var count2 = 8 * soilA;
			var count3 = 0.14 * bushel * soilB;
			var nFertilizer = 35 + (count1 - count2 - count3);
			var nFertilizerkg = nFertilizer * 1.1198;
			var x = nFertilizerkg * 100 / 45;
			var urea = x * luas;
			var hasilUrea = urea.toFixed(2);
			$('#input_hasil_urea').val(hasilUrea).trigger('keydown').trigger('focusin')
			$('#input_hasil_urea_output1').val(nFertilizerkg).trigger('keydown').trigger('focusin')
			console.log(hasilUrea)
		}
	});

	//sp36
	$('#input_luas_lahan, #input_soil_analisis_bray').on('keyup', function () {
		if ($('#input_luas_lahan').val() != "" && $('#input_soil_analisis_bray').val() != "") {
			var luas = $('#input_luas_lahan').val()
			var soilC = parseFloat($('#input_soil_analisis_bray').val())
			var pFertilizer = (25 - soilC) * 4;
			var pFertilizerkg = pFertilizer * 1.1198;
			var y = pFertilizerkg * 100 / 36;
			var sp36 = y * luas;
			var hasilSp36 = sp36.toFixed(2);
			$('#input_hasil_sp36').val(hasilSp36).trigger('keydown').trigger('focusin')
			$('#input_hasil_sp36_output1').val(pFertilizerkg).trigger('keydown').trigger('focusin')
			console.log(hasilSp36)
		}
	});

	//kcl
	$('#input_luas_lahan, #input_soil_analisis_k2o').on('keyup', function () {
		if ($('#input_luas_lahan').val() != "" && $('#input_soil_analisis_k2o').val() != "") {
			var luas = $('#input_luas_lahan').val()
			var k2o = parseFloat($('#input_soil_analisis_k2o').val())
			var rekKalium = 125 - k2o;
			var kalium = rekKalium * 1.1198;
			var z = kalium * 100 / 60;
			var kcl = z * luas;
			var hasilKcl = kcl.toFixed(2);
			$('#input_hasil_kcl').val(hasilKcl).trigger('keydown').trigger('focusin')
			$('#input_hasil_kcl_output1').val(kalium).trigger('keydown').trigger('focusin')
			console.log(hasilKcl)
		}
	});
}