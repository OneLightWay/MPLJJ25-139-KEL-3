var markerblock = [];
var markeritem = [];
$(function () {
	var pestisida_artikel = HELPER.getItem('pestisida_artikel')
	setTimeout(function () {
		$('.back-button').off();
        $('.btn-back-logo').off();
		if (HELPER.getItem('user_category') == 3) {
			setTimeout(function () {
				$('.back-button').on('click', function () {
					setTimeout(function () {
						onPage('kalkulator-hpt-non-petani')
					}, 100)
				});
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
						onPage('kalkulator-hpt-non-petani')
					}, 100)
				});
				$('.btn-back-logo').on('click', function () {
	                setTimeout(function () {
	                    onPage('main-trader')
	                }, 100)
	            });
			}, 300)
		}
		detailRekomendasiPestisida()
		setTimeout(function(){detailRekomendasiPestisida()}, 500)
		showProduct()
	}, 300)
})

function showProduct() {
	$('.show-product').html('')
	var pestisida_hama = HELPER.getItem('pestisida_hama');
	var pestisida_hama_nama = HELPER.getItem('pestisida_hama_nama');
	// var artikel_hama_id = HELPER.getItem('artikel_hama_id');

	HELPER.block()
	HELPER.ajax({
		url: BASE_URL + 'Pestisida/listPestisida',
		data: {
			hama: pestisida_hama_nama,
			// hama: artikel_hama_id,
		},
		complete: function (res) {
			if (res.total > 0) {
				$.each(res.data, function (i, v) {
					var ml_dibutuhkan =  Number(Math.ceil(parseFloat(HELPER.getItem('pestisida_luas_lahan')) * parseFloat(v.pestisida_dosis)))
					var total_botol =  Number(Math.ceil( ml_dibutuhkan / parseFloat(v.pestisida_kemasan)))

					var img = './assets/media/noimage.png';
					if (v.pestisida_image) {
						img = BASE_ASSETS + '/images/pestisida/' + v.pestisida_image;
					}
					
					$('.show-product').append(`
						<div class="content-box bg-white2-dark round-medium shadow-large bg-theme bottom-15" id="content-pestisida-${v.pestisida_id}" onclick="detailPestisida('`+ v.pestisida_id + `')" style="padding:15px;">
							<div class="row">
								<div class="col-auto right-10" style="width: 80px;background-image: url(${img});background-position: center;background-size: contain;background-repeat: no-repeat;">
								</div>
								<div class="col">
									<div class="row">
										<div class="col">
											<h1 class="color-theme font-16 bottom-0">${HELPER.nullConverter(v.pestisida_nama)}</h1>
										</div>
									</div>
									<div class="row bottom-10" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
										<div class="col">
											<span class="color-custom-gray">Uk. Kemasan</span>
										</div>
										<div class="col-auto">
											<span>${HELPER.nullConverter(Number(v.pestisida_kemasan))} ${HELPER.nullConverter(v.pestisida_satuan)}</span>
										</div>
									</div>
									<div class="row bottom-10" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
										<div class="col">
											<span class="color-custom-gray">Dosis/ha</span>
										</div>
										<div class="col-auto">
											<span>${HELPER.nullConverter(Number(v.pestisida_dosis))} ${HELPER.nullConverter(v.pestisida_satuan)}</span>
										</div>
									</div>
									<div class="row bottom-10" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
										<div class="col">
											<span class="color-custom-gray">Dosis yang Anda butuhkan</span>
										</div>
										<div class="col-auto">
											<span>${HELPER.nullConverter(ml_dibutuhkan)} ${HELPER.nullConverter(v.pestisida_satuan)}</span>
										</div>
									</div>
									<div class="row bottom-10" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
										<div class="col">
											<span class="color-custom-gray">Total dibutukan</span>
										</div>
										<div class="col-auto">
											<span>${HELPER.nullConverter(total_botol)} pcs</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					`)

				});
			} else {
				$('.show-product').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Product not available.</h3>
                                            </div>
                                        </div>`)
			}


			HELPER.unblock()
		}
	})
}

function detailRekomendasiPestisida() {
	// HELPER.block()	
	var pestisida_artikel = HELPER.getItem('pestisida_artikel')
	var pestisida_nama = HELPER.getItem('pestisida_name')
	var pestisida_varietas = HELPER.getItem('pestisida_varietas')
	var pestisida_luas_lahan = HELPER.getItem('pestisida_luas_lahan')
	var pestisida_kemasan = HELPER.getItem('pestisida_kemasan')
	var pestisida_image = HELPER.getItem('pestisida_image')
	var pestisida_deskripsi = HELPER.getItem('pestisida_deskripsi')
	var pestisida_hama = HELPER.getItem('pestisida_hama')
	var pestisida_hama_nama = HELPER.getItem('pestisida_hama_nama')
	var pestisida_hama_nama_detail = HELPER.getItem('pestisida_hama_nama_detail')
	var hama_keterangan = HELPER.getItem('hama_keterangan')
	var hama_image = HELPER.getItem('hama_image')
	var pestisida_for_farmer = HELPER.getItem('pestisida_for_farmer')
	var pestisida_total_botol = HELPER.getItem('pestisida_total_botol')

	var artikel_hama_nama = HELPER.getItem('artikel_hama_nama');
	var artikel_hama_image = HELPER.getItem('artikel_hama_image');
	var artikel_hama_keterangan = HELPER.getItem('artikel_hama_keterangan');
	
	if (pestisida_artikel == 1) {
		var img = './assets/images/noimage.png';
		if (artikel_hama_image) {
			img = BASE_ASSETS + 'hama/' + artikel_hama_image;
		}
		$('.link-hama_image').attr({
			'href': img,
			'data-lightbox': img
		});
		$('.detail-hama_image').css({
			'background-image': 'url('+img+')',
		});
		$('.detail_pestisida_nama_hama').text(artikel_hama_nama)
		$('.detail_hama_keterangan').html(atob(artikel_hama_keterangan))
	} else {

		var img = './assets/images/noimage.png';
		if (hama_image) {
			img = BASE_ASSETS + 'hama/' + hama_image;
		}
		$('.link-hama_image').attr({
			'href': img,
			'data-lightbox': img
		});
		$('.detail-hama_image').css({
			'background-image': 'url('+img+')',
		});
		$('.detail_pestisida_name').text(pestisida_nama)
		$('.detail_pestisida_berat').text(pestisida_kemasan)
		$('.detail_pestisida_varietas').text(pestisida_varietas)
		$('.detail_pestisida_deskripsi').text(pestisida_deskripsi)
		$('.detail_pestisida_nama_hama').text(pestisida_hama_nama_detail)
		$('.detail_pestisida_luas_lahan').text(pestisida_luas_lahan)
		$('.detail_pestisida_total_botol').text(pestisida_total_botol)
		$('.detail_hama_keterangan').html(hama_keterangan)
	}

	var total = '-';
	if (pestisida_for_farmer > 0) {
		$('.detail_pestisida_for_farmer').text(pestisida_for_farmer)
	} else {
		$('.detail_pestisida_for_farmer').text(total)
	}
}

// function detailPestisida(id) {
//     HELPER.block()
//     HELPER.ajax({
//         url: BASE_URL+'Pestisida/read',
//         data: {pestisida_id: id},
//         complete: function (res) {

//             HELPER.setItem('pestisida_id', res.pestisida_id);
//             HELPER.setItem('pestisida_image', res.pestisida_image);
//             HELPER.setItem('pestisida_nama', res.pestisida_nama);
//             HELPER.setItem('pestisida_kemasan', res.pestisida_kemasan);
//             HELPER.setItem('pestisida_dosis', res.pestisida_dosis);
//             HELPER.setItem('pestisida_deskripsi', res.pestisida_deskripsi);
//             setTimeout(function () {
// 	            onPage('detail-rekomendasi-pestisida2')
// 			}, 300)
//             HELPER.unblock()
//         }
//     })
// }

function detailPestisida(id) {
	HELPER.setItem('detail_pestisida_id', id)
	HELPER.setItem('from_page', 'detail-rekom-pestisida-non-petani')
	setTimeout(function(){
		onPage('detail-rekom-pestisida2-non-petani')
	}, 500)
}