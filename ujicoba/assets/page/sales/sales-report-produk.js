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
				$('.back-button').on('click', function() {onPage('sales-list-report-produk')});
			}, 200)
		}
	}, 300)
    /* HELPER.createCombo({
		el: 'laporan_sales_kategori_id',
		valueField: 'laporan_sales_kategori_id',
		displayField: 'laporan_sales_kategori_nama',
		url: BASE_URL + 'AkunSales/getLaporanKategori',
		withNull: true,
		isSelect2: false,
		placeholder: '-Pilih Kategori-',
	}); */
	HELPER.ajax({
        url: BASE_URL +'AkunSales/getLaporanKategori',
        success: function (res) {
            if (res.success) {
                $.each(res.data, function (i, v) { 
                    $('#laporan_sales_kategori_id').append(`<option data-desc="${v.laporan_sales_kategori_keterangan}" value="${v.laporan_sales_kategori_id}">${v.laporan_sales_kategori_nama}</option>`)
                });
				$('#laporan_sales_kategori_id').off('change').on('change', function () {
					if (this.value) {
						var listKet = $('#laporan_sales_kategori_id :selected').data('desc');
						if (!HELPER.isNull(listKet)) {
							listKet = listKet.split(',');
							$('.keterangan-list').show().find('div').html('')
							$.each(listKet, function (i, v) { 
								$('.keterangan-list').find('div').append(`- ${v}<br>`)
							});
						}
					}else{
						$('.keterangan-list').hide().find('div').html('')
					}
				})
            }
        }
    })
	HELPER.createCombo({
		el: 'laporan_sales_varietas',
		valueField: 'varietas_id',
		displayField: 'varietas_name',
		// displayField2: 'varietas_jumlah_benih',
		url: BASE_URL + 'LokasiLahan/getVarietas',
		placeholder: '-Pilih Produk-',
		withNull: true,
		// grouped: true,
		isSelect2: false,
	})
    $('#sales_id').val(HELPER.getItem('user_id'))
    loadDaerahSelect()
    navigator.geolocation.getCurrentPosition(function (pos) {
        $('#loc_lat').val(pos.coords.latitude);
        $('#loc_long').val(pos.coords.longitude);
    });
})

function previewImage(params) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = $(`#show-${params.target.id}`).attr('src', e.target.result);
    }
    reader.readAsDataURL(params.target.files[0]);
}

function resetFile(params) {
    $('#show-'+params).attr('src', './assets/images/noimage.png');
    $('#'+params).val('')
}

function storeReportProduk() {
	if (!HELPER.isNull($('#laporan_sales_keterangan').val()) && !HELPER.isNull($('#laporan_sales_keterangan').val())) {
        HELPER.confirm({
            message: 'Apakah Anda yakin ingin melanjutkan proses report produk ?',
            callback: function (oke) {
                if (oke) {
                    HELPER.block();
                    var form = $('#form-report-produk')[0];
                    var formData = new FormData(form);
                    HELPER.save({
                        url: BASE_URL + 'AkunSales/reportProduk',
                        cache: false,
                        data: formData,
                        contentType: false,
                        processData: false,
                        form: 'form-report-produk',
                        confirm: false,
                        callback: function (success, id, record, message) {
                            HELPER.unblock(100);
                            if (success) {
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Berhasil',
                                    message: 'Report produk berhasil !'
                                })
                                onPage('sales-list-report-produk')
                            } else {
                                HELPER.showMessage({
									message: message
								})
                            }
                        },
                        oncancel: function (result) {
                            HELPER.unblock(100);
                        }
                    });
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

function loadDaerahSelect(type_data="province", id_selected=null, name_selected=null) {
	$('#laporan_sales_daerah').val('')
	if (type_data == "province") {
		$('#list-show-daerah').html('')
		$('#list-show-daerah-back').html(`
			<a href="javascript:void(0)" onclick="loadDaerahSelect('province')"><i class="fa fa-circle color-green2-dark"></i><span class="color-green2-dark">Pilih Provinsi</span></a>
		`)
		HELPER.ajax({
			url: BASE_URL+'Login/getProv',
			success: function(res){
				if (res.success) {
					$.each(res.data, function (i, v) { 
						if (v.id) {
							$('#list-show-daerah').append(`
								<a href="javascript:void(0)" onclick="loadDaerahSelect('regency', '${v.id}', '${v.name}')"><i class="fa fa-angle-right color-green2-dark"></i><span>${v.name}</span></a>
							`)
						}
					});
				}
			}
		})
	}else if(type_data == "regency" && id_selected && name_selected){
		$('#list-show-daerah').html('')
		$('#input_provinsi').data('name_selected', name_selected).val(id_selected)
		$('#list-show-daerah-back').html(`
			<a href="javascript:void(0)" onclick="loadDaerahSelect('province')"><i class="fa fa-angle-left color-green2-dark"></i><span class="color-green2-dark">${name_selected}</span></a>
		`)
		HELPER.ajax({
			url: BASE_URL+'Login/getKota',
			data: {province_id: id_selected},
			success: function(res){
				if (res.success) {
					$.each(res.data, function (i, v) { 
						if (v.id) {
							$('#list-show-daerah').append(`
								<a href="javascript:void(0)" onclick="loadDaerahSelect('district', '${v.id}', '${v.name}')"><i class="fa fa-angle-right color-green2-dark"></i><span>${v.name}</span></a>
							`)
						}
					});
				}
			}
		})
	}else if(type_data == "district" && id_selected && name_selected){
		$('#list-show-daerah').html('')
		$('#input_kota').data('name_selected', name_selected).val(id_selected)
		$('#list-show-daerah-back').html(`
			<a href="javascript:void(0)" onclick="loadDaerahSelect('regency', '${$('#input_provinsi').val()}', '${$('#input_provinsi').data('name_selected')}')"><i class="fa fa-angle-left color-green2-dark"></i><span class="color-green2-dark">${name_selected}</span></a>
		`)
		HELPER.ajax({
			url: BASE_URL+'Login/getKecamatan',
			data: {kota_id: id_selected},
			success: function(res){
				if (res.success) {
					$.each(res.data, function (i, v) { 
						if (v.id) {
							$('#list-show-daerah').append(`
								<a href="javascript:void(0)" onclick="loadDaerahSelect('village', '${v.id}', '${v.name}')"><i class="fa fa-angle-right color-green2-dark"></i><span>${v.name}</span></a>
							`)
						}
					});
				}
			}
		})
	}else if(type_data == "village" && id_selected && name_selected){
		$('#list-show-daerah').html('')
		$('#input_kecamatan').data('name_selected', name_selected).val(id_selected)
		$('#list-show-daerah-back').html(`
			<a href="javascript:void(0)" onclick="loadDaerahSelect('district', '${$('#input_kota').val()}', '${$('#input_kota').data('name_selected')}')"><i class="fa fa-angle-left color-green2-dark"></i><span class="color-green2-dark">${name_selected}</span></a>
		`)
		HELPER.ajax({
			url: BASE_URL+'Login/getKelurahan',
			data: {kecamatan_id: id_selected},
			success: function(res){
				if (res.success) {
					$.each(res.data, function (i, v) { 
						if (v.id) {
							$('#list-show-daerah').append(`
								<a href="javascript:void(0)" onclick="loadDaerahSelect('end', '${v.id}', '${v.name}')"><i class="fa fa-angle-right color-green2-dark"></i><span>${v.name}</span></a>
							`)
						}
					});
				}
			}
		})
	}else if(type_data == "end"){
		$('#input_kelurahan').data('name_selected', name_selected).val(id_selected)
		$('#laporan_sales_daerah').val(name_selected+", "+$('#input_kecamatan').data('name_selected')+", "+$('#input_kota').data('name_selected')+", "+$('#input_provinsi').data('name_selected'))
		$('.menu-hider').click()
	}
}

function loadProvinsi(select=null) {
	HELPER.createCombo({
		el: 'input_provinsi',
		url: BASE_URL+'Login/getProv',
		valueField: 'id',
		displayField: 'name',
		isSelect2: false,
		withNull: false,
		selectedField: select
	})

	$('#input_provinsi').on('change', function() {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kecamatan').prop('disabled', true).empty().append('<option value="">Pilih Kecamatan</option>')
		$('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
		var prov = this.value;
		loadKota(prov);
	});

	$('#input_kota').on('change', function() {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kelurahan').prop('disabled', true).empty().append('<option value="">Pilih Kelurahan</option>')
		var kota = this.value;
		loadKecamatan(kota)
	});

	$('#input_kecamatan').on('change', function() {
		$(this).prev().addClass('input-style-1-active')
		$('#input_kelurahan').removeAttr('disabled')
		var kecamatan = this.value;
		loadKelurahan(kecamatan);
	});

	$('#input_kelurahan').on('change', function() {
		$(this).prev().addClass('input-style-1-active')
	});
}

function loadKota(prov=null, select=null) {
	$('#input_kota').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kota',
		url: BASE_URL+'Login/getKota',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: {province_id: prov}
	})
}

function loadKecamatan(kota=null, select=null) {
	$('#input_kecamatan').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kecamatan',
		url: BASE_URL+'Login/getKecamatan',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: {kota_id: kota}
	})
}

function loadKelurahan(kecamatan=null, select=null) {
	$('#input_kelurahan').removeAttr('disabled')
	HELPER.createCombo({
		el: 'input_kelurahan',
		url: BASE_URL+'Login/getKelurahan',
		valueField: 'id',
		displayField: 'name',
		withNull: false,
		isSelect2: false,
		selectedField: select,
		data: {kecamatan_id: kecamatan}
	})
}