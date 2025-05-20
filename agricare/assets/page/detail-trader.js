var fromPage   = null;
$(function () {
	setTimeout(function () {
		$('.back-button').off();
		setTimeout(function () {
			if (HELPER.getItem('from_page')) {
				fromPage   = HELPER.getItem('from_page');
				$('.back-button').on('click', function() {
					setTimeout(function () {
						onPage(fromPage)
					}, 100)
				});
				HELPER.removeItem(['from_page'])
			}else{
				$('.back-button').on('click', function() {
					setTimeout(function () {
						onPage('sales-nearby')
					}, 100)
				});
			}
		}, 300)
	}, 300)
	loadDetailTrader(HELPER.getItem('detail_trader_id'))
})

function loadDetailTrader(user_id) {
	HELPER.ajax({
		url: BASE_URL+'AkunTrader/detailTrader',
		data: {user_id: user_id},
		complete: function (res) {
			if (res.success) {
				$('.div-trader').show()
				var dataTrader = res.data;

				// var img = 'assets/images/avatars/6s.png';
                // if (dataTrader.user_foto) {
                //     if (dataTrader.user_foto.indexOf('http') >= 0) {
                //         img = dataTrader.user_foto;
                //     }else{
                //         img = BASE_ASSETS+'user/'+dataTrader.user_foto;
                //     }
                // }
				
				if (dataTrader.user_category == 4) {
					ikon_nearby = 'ikon-trader.svg';
					var nearby_nama = HELPER.nullConverter(dataTrader.tradder_name);
					var img = 'assets/images/avatars/trader_icon.png';
					if (dataTrader.tradder_banner) { img = BASE_ASSETS + 'traderBanner/thumbs/' + dataTrader.tradder_banner; }
				}

				var trader_wilayah = HELPER.nullConverter(dataTrader.tradder_regency_name) + ", " + HELPER.nullConverter(dataTrader.tradder_province_name);
				var linkNo = dataTrader.user_telepon;
				
				$('.btn-call-wa').data('no', linkNo)
				// $('.btn-call-wa').data(linkNo)
                $('.btn-call-wa').off('click');
                setTimeout(function () {
                    $('.btn-call-wa').on('click', function () {
                        
                        HELPER.ajax({
                            url: BASE_URL + 'Trader/clickLog',
                            data: {
                                user: dataTrader.user_id,
                                type: 2,
                                petani: HELPER.getItem('user_id')
                            },
                            complete: function (res) {
                            }
                        })
                    });
                }, 300)

                $('.show-trader-foto').attr('src', img);
                $('.show-trader-name').text(HELPER.ucwords(nearby_nama))
                $('.show-trader-district').text(HELPER.ucwords(trader_wilayah.toLowerCase()))
				$('.show-trader-address').text(HELPER.nullConverter(dataTrader.tradder_alamat))
                $('.show-trader-email').text(dataTrader.user_email)
                $('.show-trader-harga-pipilan').text("Rp. "+HELPER.toRp(dataTrader.harga_pipilan))
                $('.show-trader-harga-gelondong').text("Rp. "+HELPER.toRp(dataTrader.harga_gelondong))
                $('.show-trader-telepon').text(dataTrader.user_telepon)
			}else{
				$('.div-trader').show().html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Sorry data not found.</h3>
                                            </div>
                                        </div>`)
			}
		}
	})
}
