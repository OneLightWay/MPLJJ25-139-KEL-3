var cek = 0;
$(function () {
	setTimeout(function () {
		$('.back-button').off();
        $('.btn-back-logo').off();
        if (HELPER.getItem('user_category') == 3) {
			setTimeout(function () {
				$('.back-button').on('click', function () {
					setTimeout(function () {
						onPage('main-kios')
					}, 100)
				});
				var tempDraft = HELPER.isNull(HELPER.getItem('all_draft')) ? {} : JSON.parse(HELPER.getItem('all_draft'))
				if (tempDraft && tempDraft.hasOwnProperty('hpt') && tempDraft.hpt) {
					$('#input_luas_lahan').val(tempDraft['hpt']['pestisida_luas_lahan'])
					$('#input_luas_hama').val(tempDraft['hpt']['pestisida_hama'])
					$('#input_nama_hama').val(tempDraft['hpt']['pestisida_hama_nama'])
					$('#input_nama_hama_detail').val(tempDraft['hpt']['pestisida_hama_nama_detail'])
					$('#input_from_hpt').val(tempDraft['hpt']['pestisida_artikel'])
					$('#input_pestisida_name').val(tempDraft['hpt']['input_pestisida_name'])
					tempDraft['hpt']['pestisida_is_custom'] ? getLahan(1) : getLahan(2); $('#from_custom').prop('checked', true)
					setTimeout(function(){
						onHamaChange(false)
						showHamaId($('#input_nama_hama').val())
					}, 300)
				}
				$('.btn-back-logo').on('click', function () {
	                setTimeout(function () {
	                    onPage('main-kios')
	                }, 100)
	            });
			}, 300)
		}else if (HELPER.getItem('user_category') == 4) {
			setTimeout(function () {
				$('.back-button').on('click', function () {
					setTimeout(function () {
						onPage('main-trader')
					}, 100)
				});
				var tempDraft = HELPER.isNull(HELPER.getItem('all_draft')) ? {} : JSON.parse(HELPER.getItem('all_draft'))
				if (tempDraft && tempDraft.hasOwnProperty('hpt') && tempDraft.hpt) {
					$('#input_luas_lahan').val(tempDraft['hpt']['pestisida_luas_lahan'])
					$('#input_luas_hama').val(tempDraft['hpt']['pestisida_hama'])
					$('#input_nama_hama').val(tempDraft['hpt']['pestisida_hama_nama'])
					$('#input_nama_hama_detail').val(tempDraft['hpt']['pestisida_hama_nama_detail'])
					$('#input_from_hpt').val(tempDraft['hpt']['pestisida_artikel'])
					$('#input_pestisida_name').val(tempDraft['hpt']['input_pestisida_name'])
					tempDraft['hpt']['pestisida_is_custom'] ? getLahan(1) : getLahan(2); $('#from_custom').prop('checked', true)
					setTimeout(function(){
						onHamaChange(false)
						showHamaId($('#input_nama_hama').val())
					}, 300)
				}
				$('.btn-back-logo').on('click', function () {
	                setTimeout(function () {
	                    onPage('main-trader')
	                }, 100)
	            });
			}, 300)
		}
	}, 300)
	var fv;
	loadHama()

	$('#hama_search_done').on('keyup change', function() {
			loadHama(this.value)
	})
	// $('#hama_search_done').donetyping(function (e) {
	// 	loadHama(this.value)
	// })

	$("#input_luas_lahan").inputmask('9.99', {
		greedy: false,
		rightAlign: false,
		prefix: "",
		placeholder: "0"
	});

	$('.input-nama-lahan').show()

	var farmer_id = HELPER.getItem('user_id')
	HELPER.createCombo({
		el: 'input_pestisida_name',
		valueField: 'lahan_id',
		displayField: 'lahan_nama',
		url: BASE_URL + 'LokasiLahan/getLokasiLahan',
		data: { farmer_id: farmer_id },
		withNull: true,
		isSelect2: false,
		placeholder: '-Pilih Lokasi-',
		callback: function () { }
	});

	$('#input_pestisida_name').on('change', function (e) {
		HELPER.ajax({
			url: BASE_URL + 'LokasiLahan/readEdit',
			data: { lahan_id: $('#input_pestisida_name').val() },
			complete: function (res) {
				$('#input_luas_lahan').val(res.lahan_luas);
			}
		});
	});

	HELPER.createCombo({
		el: 'input_luas_hama',
		valueField: 'hama_kategori_id',
		displayField: 'hama_kategori_nama',
		url: BASE_URL + 'Pestisida/getHama',
		withNull: true,
		isSelect2: false,
		placeholder: 'Pilih jenis HPT dan Gulma',
		callback: function () { }
	});

	HELPER.createCombo({
		el: 'input_nama_hama',
		url: BASE_URL + 'Pestisida/getHamaNama',
		valueField: 'hama_id',
		displayField: 'hama_nama',
		// data:{
		// 	jenis :jenis,
		// },
		withNull: true,
		isSelect2: false,
		placeholder: '-Pilih HPT-',
		callback: function () { }
	});
	$('.btn-back').on('click', function () { onPage('main') });

})

function onHamaChange(is_load_hama=true) {
	$('.pilih_hama').show()
	$('.detail-info_hama').hide()
	HELPER.setItem('pestisida_hama', $('#input_luas_hama').val());
	HELPER.setItem('pestisida_hama_label_type', $('#input_luas_hama option:selected').text())
	$('.label-hama-selected').text($('#input_luas_hama option:selected').text())
	if(HELPER.getItem('pestisida_hama') == ''){
		$('.pilih_hama').hide()
	}
	if (is_load_hama) {
		loadHama()
	}
}

function onReset() {
	$('#input_luas_lahan').val('')
	$('#pestisida_varietas').val('').trigger('change')
	$('#input_luas_hama').val('').trigger('change')
	$('#from_lahan').prop('checked', true)
	$('#from_custom').prop('checked', false)
}

function searchPestisidaRecommedation() {
	// if ($('#input_luas_lahan').val() != "" && $('#pestisida_varietas').val() != "" && $('#input_luas_hama').val() != "") {	
	if ($('#input_luas_lahan').val() > "0.00" && $('#pestisida_varietas').val() != "" && $('#input_luas_hama').val() != "" && $('#input_nama_hama').val() != "") {
		HELPER.block()
		HELPER.ajax({
			url: BASE_URL + 'Pestisida/getCount',
			data: { input_luas_lahan: $('#input_luas_lahan').val(), input_nama_hama: $('#input_nama_hama').val(), input_luas_hama: $('#input_luas_hama').val() },

			complete: function (res) {
				try {
					FirebasePlugin.logEvent("cal_hpt", {nk_user_id: HELPER.getItem('user_id'), nk_varietas: $('#pestisida_varietas').val(), nk_hama: $('#input_luas_hama').val()});
				} catch (error) {
				}
				// HELPER.setItem('pestisida_name', res.data[0].pestisida_nama);
				// HELPER.setItem('pestisida_image', res.data[0].pestisida_image);
				// HELPER.setItem('pestisida_kemasan', res.data[0].pestisida_kemasan);
				// HELPER.setItem('pestisida_deskripsi', res.data[0].pestisida_deskripsi);
				HELPER.setItem('pestisida_varietas', $('#pestisida_varietas').val());
				HELPER.setItem('pestisida_luas_lahan', $('#input_luas_lahan').val());
				HELPER.setItem('pestisida_hama', $('#input_luas_hama').val());
				HELPER.setItem('pestisida_hama_nama', $('#input_nama_hama').val());
				HELPER.setItem('pestisida_hama_nama_detail', $('#input_nama_hama_detail').val());
				HELPER.setItem('pestisida_artikel', $('#input_from_hpt').val());
				HELPER.setItem('pestisida_for_farmer', res.hasil[0]);
				HELPER.setItem('pestisida_total_botol', res.hasil[1]);
				HELPER.setItem('from_page', 'hpt-hamatanaman');
				// window.location = 'detail-rekomendasi-pestisida.html';
				var tempDraft = HELPER.isNull(HELPER.getItem('all_draft')) ? {} : JSON.parse(HELPER.getItem('all_draft'))
				tempDraft['hpt'] = {
					'pestisida_varietas': $('#pestisida_varietas').val(),
					'pestisida_luas_lahan': $('#input_luas_lahan').val(),
					'pestisida_hama': $('#input_luas_hama').val(),
					'pestisida_hama_nama': $('#input_nama_hama').val(),
					'pestisida_hama_nama_detail': $('#input_nama_hama_detail').val(),
					'pestisida_artikel': $('#input_from_hpt').val(),
					'pestisida_for_farmer': res.hasil[0],
					'pestisida_total_botol': res.hasil[1],
					'input_pestisida_name': $('#input_pestisida_name').val(),
					'pestisida_is_custom': $('#input-nama-lahan').is(':visible')
				}
				HELPER.setItem('all_draft', JSON.stringify(tempDraft))
				setTimeout(function(){
					onPage('detail-rekom-pestisida-non-petani')
					onReset()
					HELPER.unblock()
				}, 300)
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

function getLahan(val) {
	if (val == 1) {
		$('.input-nama-lahan').show()
		$('#input_luas_lahan').attr('readonly', true)
	} else {
		$('.input-nama-lahan').hide()
		$('#input_luas_lahan').removeAttr('readonly')
	}
}

function loadHama(search=null) {
	$('.list-hama').html('')
	var pestisida_kategori_id = HELPER.getItem('pestisida_hama');
	cek = 0;

	HELPER.initLoadMore({
		perPage: 6,
		urlExist: BASE_URL + 'Pestisida/listHamaExist',
		dataExist: {
			search: search,
			kategori: pestisida_kategori_id,
		},
		urlMore: BASE_URL + 'Pestisida/listHamaMore',
		dataMore: {
			search: search,
			kategori: pestisida_kategori_id,
		},
		callbackExist: function (data) {
			if (data.hasOwnProperty('success')) {
				$('.list-hama').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No Plant Pest available.</h3>
                                                </div>
                                            </div>`)
				$('.hama-load-more').hide()
			} else {
				$('.hama-load-more').show()
			}
		},
		callbackMore: function (data) {
			var myQueue = new Queue()
			myQueue.enqueue(function (next) {
				HELPER.block()
				next()
			}, '1').enqueue(function (next) {
				var data_hama = $.parseJSON(data.responseText);
				$.each(data_hama.data, function (i, v) {
					var img = './assets/images/noimage.png';
					if (v.hama_image) {
						img = BASE_ASSETS + 'hama/thumbs/' + v.hama_image;
					}
					$('.link-hama_image').attr({
						'href': img,
						'data-lightbox': img
					});
					$('.detail-hama_image').css({
						'background-image': 'url('+img+')',
					});

					var keterangan = v.hama_keterangan ? atob(v.hama_keterangan) : "-"

					$('.list-hama').append(`
                        <a href="javascript:void(0);" class="show-overlay-list close-menu "`+ v.hama_id +`"" onclick="showHamaId('`+ v.hama_id + `')">
                            <div class="caption-center">
                                <img src="`+ img + `" onerror="this.src='./assets/images/noimage.png'" alt="" width="60" class="round-small">
                            </div>
                            <span class="article-category under-heading font-12 left-20 bold opacity-70">`+ v.hama_nama + `</span>
                            <div class="left-20 for-hama" style="margin-top: -30px;">`+ HELPER.text_truncate(keterangan, 100) + `</div>
                            <i class="fa fa-angle-right fa-lg" style="margin:inherit;"></i>
                        </a>
                    `)
					// <p class="article-title color-custom-black font-11 left-20 bottom-0" style="position:inherit;margin-top:-40px;padding-left:20px;padding-right:20px;text-align:justify;margin-bottom: 5px;"></p>
					// <p class="article-title color-custom-black font-11 left-20 bottom-0" style="position:inherit;margin-top:-40px;"><p style ="padding-left:20px;padding-right:20px;text-align:justify;margin-bottom: 5px;">`+HELPER.text_truncate(atob(v.hama_keterangan,100))+`</p></strong>
				});
				next()
			}, '2').enqueue(function (next) {
				HELPER.unblock(500)
				$('.list-hama strong').replaceWith(function () {
					return '<b>' + $(this).text() + '</b>';
				});
				next()
			}, '3').dequeueAll()
		},
		scrollCek: function (callLoadMore) {
			$('.hama-load-more').off('click').on('click', function () {
				HELPER.block()
				callLoadMore()
			});
		},
		callbackEnd: function () {
			$('.hama-load-more').hide()
			$('.hama-load-more').off('click');
		}

	})
}

function showHamaId(id) {
	HELPER.setItem('hama_id', id)
	$('.detail-info_hama').show();
	setTimeout(function () {
		var hama_id = HELPER.getItem('hama_id');
		// var hama_kategori_id = HELPER.getItem('hama_kategori_id');

		HELPER.ajax({
			url: BASE_URL + 'Pestisida/readHama',
			data: {
				hama_id: hama_id,
				// hama_kategori_id: pestisida_hama_kategori,
				// user_long: jarak_long,
			},
			complete: function (res) {
				// console.log(res)
				var img = './assets/images/noimage.png';
				if (res.hama_image) {
					img = BASE_ASSETS + 'hama/' + res.hama_image;
				}
				$('.link-hama_image').attr({
					'href': img,
					'data-lightbox': img
				});
				$('.detail-hama_image').css({
					'background-image': 'url('+img+')',
				});
				var keterangan = res.hama_keterangan ? atob(res.hama_keterangan) : "-"

				$('#input_nama_hama').val(res.hama_id);
				$('#input_nama_hama_detail').val(res.hama_nama);
				$('#input_from_hpt').val('0');
				$('.detail-hama_nama').html(res.hama_nama);
				$('.detail-hama_keterangan').html(keterangan);
				HELPER.setItem('hama_keterangan', keterangan)
				HELPER.setItem('hama_image', res.hama_image)

			}
		})
	}, 200)

}





