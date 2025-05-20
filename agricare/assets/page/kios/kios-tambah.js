var fv3;
$(function () {
	$('#input_harga_varietas').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_harga_pestisida').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_pestisida_kemasan').inputmask('currency', {
		rightAlign: false,
		prefix: ""
	});
	$('#input_harga').inputmask('currency', {
		rightAlign: false,
		prefix: "",
		allowMinus: false,
		min: 0,
	});

	var kios_user_id = HELPER.getItem('user_id')
	$('.kios_user_id').val(kios_user_id)

	var kios_id = HELPER.getItem('kios_id')
	$('.kios_id').val(kios_id)

	$('.div-input-varietas').hide()

	setValidation()
})

function setValidation() {
	fv3 = HELPER.newHandleValidation({
		el: 'form-Kios',
		setting: [
		],
		declarative: true,
	});
}

function addProduct() {
	HELPER.block()
	if ($('#kategori_produk').val() != "" && $('#input_kemasan').val() != "" && $('#input_stok').val() != "" && $('#input_harga').val() != "0.00" && $('#radio').val() != "") {
		setTimeout(function () {
			onPage('main-kios');
		}, 300)
	} else {
		Swal.fire(
			'Pemberitahuan',
			'Lengkapi data terlebih dahulu !',
			'warning'
		)
	}
	HELPER.unblock(100)
}

function onKategori() {
	if ($("#kategori_produk").val() == '1') {
		HELPER.createCombo({
			el: 'input_varietas_id',
			valueField: 'varietas_id',
			displayField: 'varietas_name',
			url: BASE_URL + 'Kios/getVarietas',
			placeholder: '-Pilih Benih-',
			withNull: true,
			// grouped: true,
			isSelect2: false,
			callback: function () { }

		})
		$('.form-varietas').show()
		$('.form-pestisida').hide()
		$('.form-pupuk').hide()
		$('#input_kemasan').val(0)
		$('#input_kemasan').removeAttr("required");
		$('.label-kemasan').text(' (Kg)')
		$('.div-input-varietas').show()
		$('.div-input-kemasan').hide()
		$('.detail-info_produk').hide()

	} else if ($("#kategori_produk").val() == '2') {
		HELPER.createCombo({
			el: 'input_pestisida_id',
			valueField: 'pestisida_id',
			displayField: 'pestisida_nama',
			displayField2: 'pestisida_kemasan',
			url: BASE_URL + 'Pestisida/getPestisida',
			placeholder: '-Pilih Pestisida-',
			withNull: true,
			grouped: true,
			isSelect2: false,
			callback: function () { }
		})
		$('.form-pestisida').show()
		$('.form-varietas').hide()
		$('.form-pupuk').hide()
		$('.label-kemasan').text(' (ml/L)')
		$('#input_kemasan_varietas').removeAttr("required");
		$('[name=input_kemasan]').attr('disabled', 'disabled');
		$('.div-input-kemasan').show()
		$('.div-input-varietas').hide()
		$('.detail-info_produk').hide()
	} else if ($("#kategori_produk").val() == '3') {
		HELPER.createCombo({
			el: 'input_pupuk_id',
			valueField: 'pupuk_id',
			displayField: 'pupuk_nama',
			url: BASE_URL + 'Pupuk/getPupuk',
			placeholder: '-Pilih Pupuk-',
			withNull: true,
			// grouped: true,
			isSelect2: false,
			callback: function () { }

		})
		$('.form-pupuk').show()
		$('.form-pestisida').hide()
		$('.form-varietas').hide()
		$('#input_kemasan').val('');
		$('.label-kemasan').text(' (Kg)')
		$('#input_kemasan_varietas').removeAttr("required");
		$('[name=input_kemasan]').removeAttr('disabled')
		$('.div-input-kemasan').show()
		$('.div-input-varietas').hide()
		$('.detail-info_produk').hide()
	}
}

function save(name) {
	// HELPER.block()
	if (name == 'form-Kios') {
		var form = $('#' + name)[0];
		var formData = new FormData(form);
		HELPER.save({
			cache: false,
			data: formData,
			url: BASE_URL + 'Kios/create',
			contentType: false,
			processData: false,
			form: name,
			confirm: true,
			callback: function (success, id, record, message) {
				HELPER.unblock(100);
				if (success) {
					HELPER.showMessage({
						success: true,
						title: "Success",
						message: "Successfully saved data"
					});
					onPage('main-kios')
				} else {
					HELPER.showMessage({
						success: false,
						title: 'Failed',
						message: 'Failed to save data'
					})
				}
			},
			oncancel: function (result) {
				HELPER.unblock(100);
			}
		});
	}
}

function showProduct() {
	var varietas = $('#input_varietas_id').val();
	if (varietas) {
		HELPER.ajax({
			url: BASE_URL + 'Kios/readBenih',
			data: {
				varietas_id: varietas,
			},
			type: 'POST',
			success: function (res) {
				$('#input_varietas_nama').val(res.varietas_name);
				$('#input_varietas_image').val(res.varietas_image);

				$('.detail-info_produk').show();
				var kelebihan = res.varietas_kelebihan ? atob(res.varietas_kelebihan) : ""
				var img = './assets/images/noimage.png';
				if (res.varietas_image) {
					img = BASE_ASSETS + 'varietas/thumbs/' + res.varietas_image;
				}
				$('.link-info_gambar_produk').attr({
					'href': img,
					'data-lightbox': img
				});
				$('.detail-info_gambar_produk').attr({
					'src': img,
					'title': res.varietas_image
				});
				$('.detail-info_nama_produk').html(res.varietas_name);
				$('.detail-info_keterangan_produk').html(kelebihan);
			}
		})
	}
}

function showPestisida() {
	var pestisida = $('#input_pestisida_id').val();
	if (pestisida) {
		HELPER.ajax({
			url: BASE_URL + 'Kios/readPestisida',
			data: {
				pestisida_id: pestisida,
			},
			type: 'POST',
			success: function (res) {
				$('#input_pestisida_nama').val(res.pestisida_nama);
				$('#input_pestisida_image').val(res.pestisida_image);
				$('#input_pestisida_hama_id').val(res.hama_id);
				$('#input_pestisida_kemasan').val(res.pestisida_kemasan);
				$('#input_kemasan').val(res.pestisida_kemasan);

				$('.detail-info_produk').show();
				var deskripsi = res.pestisida_deskripsi ? atob(res.pestisida_deskripsi) : ""
				var img = './assets/images/noimage.png';
				if (res.pestisida_image) {
					img = BASE_ASSETS + 'images/pestisida/thumbs/' + res.pestisida_image;
				}
				$('.link-info_gambar_produk').attr({
					'href': img,
					'data-lightbox': img
				});
				$('.detail-info_gambar_produk').attr({
					'src': img,
					'title': res.pestisida_image
				});
				$('.detail-info_nama_produk').html(res.pestisida_nama);
				$('.detail-info_keterangan_produk').html(deskripsi);

			}
		})
	}
}

function showPupuk() {
	var pupuk = $('#input_pupuk_id').val();
	if (pupuk) {
		HELPER.ajax({
			url: BASE_URL + 'Kios/readPupuk',
			data: {
				pupuk_id: pupuk,
			},
			type: 'POST',
			success: function (res) {
				$('#input_pupuk_nama').val(res.pupuk_nama);
				$('#input_pupuk_image').val(res.pupuk_image);

				$('.detail-info_produk').show();
				var deskripsi = res.pupuk_deskripsi ? atob(res.pupuk_deskripsi) : ""
				var img = './assets/images/noimage.png';
				if (res.pupuk_image) {
					img = BASE_ASSETS + 'images/pupuk/thumbs/' + res.pupuk_image;
				}
				$('.link-info_gambar_produk').attr({
					'href': img,
					'data-lightbox': img
				});
				$('.detail-info_gambar_produk').attr({
					'src': img,
					'title': res.pupuk_image
				});
				$('.detail-info_nama_produk').html(res.pupuk_nama);
				$('.detail-info_keterangan_produk').html(deskripsi);
			}
		})
	}
}