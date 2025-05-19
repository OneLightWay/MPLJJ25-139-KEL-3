var markerblock = [];
var markeritem = [];
$(function () {
	setTimeout(function () {
        $('.back-button').off();
        $('.btn-back-logo').off();
        if (HELPER.getItem('user_category') == 3) {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('kalkulator-benih-non-petani')
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
                    onPage('kalkulator-benih-non-petani')
                }, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-trader')
                }, 100)
            });
        }

    }, 300)
	detailKebutuhanBenih()
	loadKios()
});

function detailKebutuhanBenih() {
	var benih_varietas = HELPER.getItem('benih_varietas')
	var benih_varietas_nama = HELPER.getItem('benih_varietas_nama')
	var benih_varietas_kernel = HELPER.getItem('benih_varietas_kernel')
	var benih_varietas_gambar = HELPER.getItem('benih_varietas_gambar')
	var benih_luas_lahan = HELPER.getItem('benih_luas_lahan')
	var benih_jarak_antar_tanam = HELPER.getItem('benih_jarak_antar_tanam')
	var benih_jarak_antar_tanam1 = HELPER.getItem('benih_jarak_antar_tanam1')
	var benih_jarak_antar_tanam2 = HELPER.getItem('benih_jarak_antar_tanam2')
	var benih_jarak_dalam = HELPER.getItem('benih_jarak_dalam')
	var benih_jumlah = HELPER.getItem('benih_jumlah')
	var benih_jumlah_populasi = HELPER.getItem('benih_jumlah_populasi')
	var benih_jumlah_populasi_double = HELPER.getItem('benih_jumlah_populasi_double')
	var benih_jumlah_dibutuhkan = HELPER.getItem('benih_jumlah_dibutuhkan')
	//single row
	var a = benih_jumlah_populasi.replace(",", "")
	var b = a / benih_varietas_kernel;
	var c = Math.ceil(b);
	var hasilSingle = c;

	var x = benih_jumlah_populasi_double.replace(",", "")
	var y = x / benih_varietas_kernel;
	var z = Math.ceil(y);
	var hasilDouble = z;

	if (benih_varietas_gambar == "null") {
		var img = './assets/images/noimage.png';
	} else {
		var img = BASE_ASSETS + 'varietas/thumbs/' + benih_varietas_gambar;
	}

	HELPER.setItem('benih_jumlah_dibutuhkan', hasilSingle);
	HELPER.setItem('benih_jumlah_dibutuhkan_double', hasilDouble);

	if (benih_jarak_antar_tanam == 0) {
		$('.jarak-single').hide()
		$('.jumlah-single').hide()
		$('.jumlah-double').show()
		$('.detail_benih_varietas').text(benih_varietas_nama)
		$('.detail_benih_varietas_kernel').text(benih_varietas_kernel)
		$('.detail_benih_luas_lahan').text(benih_luas_lahan)
		$('.detail_benih_jarak_antar_1').text(benih_jarak_antar_tanam1)
		$('.detail_benih_jarak_antar_2').text(benih_jarak_antar_tanam2)
		$('.detail_benih_jarak_dalam').text(benih_jarak_dalam)
		$('.detail_benih_jumlah').text(benih_jumlah)
		$('.detail_benih_jumlah_populasi_double').text(benih_jumlah_populasi_double)
		$('.detail_benih_jumlah_dibutuhkan_double').text(hasilDouble)
		$('.detail_benih_jumlah_dibutuhkan_double').html(HELPER.toRp(hasilDouble));
		$('.detail_gambar_benih').attr({ 'src': img, });


	} else {
		$('.jarak-double').hide()
		$('.jumlah-double').hide()
		$('.jumlah-single').show()
		$('.detail_benih_varietas').text(benih_varietas_nama)
		$('.detail_benih_varietas_kernel').text(benih_varietas_kernel)
		$('.detail_benih_luas_lahan').text(benih_luas_lahan)
		$('.detail_benih_jarak_antar').text(benih_jarak_antar_tanam)
		$('.detail_benih_jarak_dalam').text(benih_jarak_dalam)
		$('.detail_benih_jumlah').text(benih_jumlah)
		$('.detail_benih_jumlah_populasi').text(benih_jumlah_populasi)
		$('.detail_benih_jumlah_dibutuhkan').text(hasilSingle)
		$('.detail_benih_jumlah_dibutuhkan').html(HELPER.toRp(hasilSingle));
		$('.detail_gambar_benih').attr({ 'src': img, });

	}

}

function loadKios() {
	markeritem = [];
	$('#show_list_kios').html('')
	$('#show_list_kios_exist').html('')

	var varietas_id = HELPER.getItem('benih_varietas')

	var nearby_lat = HELPER.getItem('user_lat');
	var nearby_long = HELPER.getItem('user_long');
	if (HELPER.getItem('nearby_lat_now') && HELPER.getItem('nearby_long_now')) {
		nearby_lat = HELPER.getItem('nearby_lat_now');
		nearby_long = HELPER.getItem('nearby_long_now');
	}
	HELPER.initLoadMore({
		perPage: 5,
		urlExist: BASE_URL + 'Kios/searchKiosExistVarietas',
		dataExist: {
			user_id: HELPER.getItem('user_id'),
			varietas: varietas_id,
			nearby_lat: nearby_lat,
			nearby_long: nearby_long,
		},
		urlMore: BASE_URL + 'Kios/searchKiosMoreVarietas',
		dataMore: {
			user_id: HELPER.getItem('user_id'),
			varietas: varietas_id,
			nearby_lat: nearby_lat,
			nearby_long: nearby_long,
		},
		callbackExist: function (data) {
			if (data.hasOwnProperty('success')) {
				$('#show_list_kios').html(`<div class="content-boxed content-box shadow-medium left-0 right-0 top-10">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Kios tidak tersedia.</h3>
                                                <p>Hubungi Sales Representative Anda</p>
                                            </div>
                                            <div class="content-boxed shadow-large div-sr m-0" padding-top: 15px;">
                                                <div class="caption bg-white2-dark bg-theme bottom-15" style="height: 50px;">
                                                    <div class="caption-center left-20">
                                                        <img src="" onerror="this.src='./assets/images/noimage.png'" class="round-small show-sr-waiting-img" alt="Sales Photo" style="width: 60px; height: 60px;">
                                                    </div>
                                                    <div class="caption-center left-90">
                                                        <div class="right-30">
                                                            <h1 class="font-16 bottom-0 lh-20 show-sr-waiting-nama"></h1>
                                                        </div>
                                                        <label class="font-13 show-sr-waiting-no-div" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i> <span class="show-sr-waiting-no"></span></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`)
				$('#btn-more-kios').hide()
				$('.div-kios').hide()
			} else {
				$('#btn-more-kios').show()
			}
		},
		callbackMore: function (data) {
			var myQueue = new Queue()
			myQueue.enqueue(function (next) {
				HELPER.block()
				next()
			}, '1').enqueue(function (next) {
				var data_notifikasi = $.parseJSON(data.responseText);
				if (data_notifikasi.data) {
					$('#show_list_kios_exist').html('')
					$.each(data_notifikasi.data, function (i, v) {
						var linkNo = "#";
						if (v.user_telepon) {
							if (v.user_telepon.charAt(0) == "0") {
								linkNo = "62" + v.user_telepon.substring(1)
							} else if (v.user_telepon.charAt(0) == "+") {
								linkNo = v.user_telepon.substring(1)
							} else if (v.user_telepon.charAt(0) != "6") {
								linkNo = "62" + v.user_telepon.substring(1)
							} else {
								linkNo = v.user_telepon
							}
						}
						var jarak_sales = 'Unknown';
						if (v.distance) {
							var distance_count = Math.round(v.distance * 100) / 100;
							jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
						}

						var img = 'assets/images/avatars/6s.png';
						if (v.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + v.user_foto; }

						var ikon_nearby = 'ikon-user.svg';
						var nearby_nama = HELPER.nullConverter(v.user_nama);

						if (v.user_category == 3) {
							ikon_nearby = 'ikon-kios.svg';
							var img = 'assets/images/avatars/6s.png';
							var nearby_nama = HELPER.nullConverter(v.kios_nama);
							if (v.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + v.kios_banner; }
						}
						//tambah latlong
						markerblock.push([v.user_lat, v.user_long])
						markeritem.push(data_notifikasi.data[i])

						$('#show_list_kios').append(`
                            <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${v.user_id}" style="height:100px;">
                                    <div class="caption-center left-20">
                                        <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="" style="width:60px;">
                                    </div>
                                    <div class="caption-center left-90">
                                        <div class="top-8">
                                            <div class="row">
                                                <div class="right-10">
                                                    <h1 class="color-theme font-16 bottom-0">${nearby_nama}</h1>
                                                </div>
                                                <div class="top-5">
                                                    <img src="assets/images/nearby/${ikon_nearby}" alt="">
                                                </div>
                                            </div>
                                            <label class="color-theme font-12">${HELPER.nullConverter(jarak_sales)}</label>
                                        </div>
                                    </div>
                                    <div class="caption-center">
                                        <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                                    </div>
                                </div>
                            </div>
                        `)
						$('#btn-popup-telp-' + v.user_id).off('click');
						$('#content-sales-' + v.user_id).off('click');
						setTimeout(function () {
							var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
							$('#btn-popup-telp-' + v.user_id).on('click', function (e) {
								$('#btn-choose-telp-wa').off('click');
								$('#btn-choose-telp-phone').off('click');
								setTimeout(function () {
									$('#btn-choose-telp-wa').on('click', function () {
										window.location.href = linkWaMe
									});
									$('#btn-choose-telp-phone').on('click', function () {
										window.location.href = 'tel://' + linkNo
									});
								}, 200)
								$('#btn-telp-choose').click()
							});
							$('#content-sales-' + v.user_id).on('click', function (e) {
								HELPER.setItem('kios_varietas_user_id', v.user_id)
								HELPER.setItem('from_page_detail_k_v', 'detail-kebutuhan-benih')
								// HELPER.setItem('farmer_sales_detail_tradder_id', v.tradder_id)
								onPage('detail-kios-varietas')
							});

						}, 200)
					});
				}
				next()
			}, '2').enqueue(function (next) {
				HELPER.unblock(500)
				$('.show-blink').remove()
				next()
			}, '3').dequeueAll()
		},
		scrollCek: function (callLoadMore) {
			$('#btn-more-kios').off('click').on('click', function (e) {
				callLoadMore()
			});
		},
		callbackEnd: function (dd) {
			$('#btn-more-kios').hide()
		}
	})
}
