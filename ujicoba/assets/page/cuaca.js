$(function () {
	HELPER.block()
	setTimeout(function (){
		loadCuaca()
		if (checkIsPetugas()) {
			$('.btn-back').removeAttr('onclick').on('click', function() {onPage('main-qcs')});
			$('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-qcs')});
		}else if (checkIsSales()) {
			$('.btn-back').removeAttr('onclick').on('click', function() {onPage('main-sales')});
			$('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-sales')});
		}else if(checkIsKios()){
			$('.btn-back').removeAttr('onclick').on('click', function() {onPage('main-kios')});
			$('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-kios')});
		}else if(checkIsTrader()){
			$('.btn-back').removeAttr('onclick').on('click', function() {onPage('main-trader')});
			$('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main-trader')});
		}else{
			$('.btn-back').removeAttr('onclick').on('click', function() {onPage('main')});
			$('.btn-back-logo').removeAttr('onclick').on('click', function() {onPage('main')});
		}
	}, 200);
})

function loadCuaca() {
	HELPER.ajax({
		url: BASE_URL+'Weather/load',
		data:{user_id: HELPER.getItem('user_id')},
		success: function(res){
			if (res.success) {
				var dataCurrent = res.data.current;
				var dataForecast = res.data.forecast;

				// Show Current Data
					var imgCurrent = imgWeather(dataCurrent.weather_detail_main)
					var dataTempCurrent = JSON.parse(dataCurrent.weather_detail_temp);
					var tempCurrent = tempWeather(dataCurrent.weather_detail_temp, false) + "<sup>&#8451;</sup>"
					$('.show-kecamatan').text(HELPER.ucwords(HELPER.getItem('user_district_name')+", "+HELPER.getItem('user_regency_name')))
					$('.show-current-img-weather').prop('src', imgCurrent)
					$('.show-current-weather').text(HELPER.ucwords(dataCurrent.weather_detail_description))
					$('.show-current-date').text(moment(dataCurrent.weather_detail_date).format('dddd, DD MMMM YYYY'))
					$('.show-current-temp').html(tempCurrent)

				// Show Forecast
					$.each(dataForecast, function(i, val) {
						var metadataForecast = JSON.parse(val.weather_detail_metadata);
						var dataTempForecast = JSON.parse(val.weather_detail_temp);
						var imgForecast = imgWeather(val.weather_detail_main)
						var tempForecast = dataTempForecast.max.toFixed() + "° / " + dataTempForecast.min.toFixed() + "°";
						var descForecast = HELPER.ucwords(val.weather_detail_description)
						var dateForecast = moment(val.weather_detail_date).format('dddd, DD MMMM YYYY')
						var dayForecast  = moment(val.weather_detail_date).format('ddd')
						var dateSimpleForecast  = moment(val.weather_detail_date).format('D/M')
						var tempMinForecast  = dataTempForecast.min.toFixed() + "°"
						var tempMaxForecast  = dataTempForecast.max.toFixed() + "°"
						var winDegForecast   = metadataForecast.wind_deg;
						var winSpeedForecast = (parseFloat(metadataForecast.wind_speed) * 3.6).toFixed(1)


						$('.list-cuaca').append(`
							<div class="content content-box content-boxed shadow-medium round-medium bottom-10 show-overlay" onclick="onDetailCuaca()">
		                        <div class="row">
		                            <div class="col-auto right-15">
		                                <img src="${imgForecast}" style="width: 60px;">
		                            </div>
		                            <div class="col right-5">
		                                <h4>${descForecast}</h4>
		                                <span class="color-custom-gray">${dateForecast}</span>
		                            </div>
		                            <div class="col-auto" style="margin: auto;">
		                                <h3>${tempForecast}</h3>
		                            </div>
		                        </div>
		                    </div>
						`)

						$('.show-cuaca').append(`
							<div class="item round-small center-text bg-theme show-overlay" onclick="onDetailCuaca(false)">
		                        <div class="color-theme caption m-0" style="height:40vh; width:120px;">
		                        	<div>
										<p class="bottom-5 top-10 bolder">${dayForecast}</p>
										<p class="bottom-30 bolder">${dateSimpleForecast}</p>
		                                <img class="bottom-30" src="${imgForecast}" style="width: 60px;">
										<p class="font-22">${tempMaxForecast} / ${tempMinForecast}</p>
		                        	</div>
		                        	<div style="position: absolute;bottom: 0;width: 100%;">
										<p class="bottom-10"><i class="fa fa-angle-up" style="transform: rotate(${winDegForecast}deg)"></i> ${winSpeedForecast} km/j</p>
		                        	</div>
								</div>
							</div>
						`)
					});
					$('.show-cuaca-head').show()
					setTimeout(function () {
		            	$('.show-cuaca').owlCarousel({dots:false, loop:false, margin:20, nav:false, lazyLoad:true, items:1, autoplay: false, autoplayTimeout:5000, autoWidth:true}); 
					}, 500)

			}else{
				$('.bhsConf-perkiraan_cuaca').addClass('font-white')
				$('.list-cuaca').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Belum tersedia, silahkan coba beberapa saat lagi.</h3>
                                            </div>
                                        </div>`)
			}
			HELPER.unblock()
		},
		error: function () {
			HELPER.unblock()
		}
	})
}

function imgWeather(main="") {
	main = main.toLowerCase()
	var cuaca = "cerah-berawan";
	if (main == "rain" || main == "drizzle" || main == "snow") {
		cuaca = "hujan";
	}else if (main == "thunderstorm") {
		cuaca = "hujan-badai";
	}else if (main == "clouds") {
		cuaca = "berawan"
	}else if (main == "clear") {
		cuaca = "cerah"
	}
	return "assets/images/weather/"+cuaca+".svg";
}

function tempWeather(paramTemp, onlyday=true) {
	var dataTemp = JSON.parse(paramTemp)
	if (onlyday) {
		return dataTemp.day
	}else{
		var currentHour = moment().format("HH");
		if (currentHour >= 3 && currentHour < 12){
		  return dataTemp.morn;
		} else if (currentHour >= 12 && currentHour < 15){
		  return dataTemp.day;
		} else if (currentHour >= 15 && currentHour < 20){
		  return dataTemp.eve;
		} else if (currentHour >= 20 && currentHour < 3){
		  return dataTemp.night;
		} else {
		  return dataTemp.day;
		}
	}
}

function onDetailCuaca(cek=true) {
	if (cek) {
		$('.list-cuaca').hide()
		$('.list-cuaca-detail').show('fast', function() {
			$('.show-cuaca').trigger('refresh.owl.carousel');
		});
	}else{
		$('.list-cuaca-detail').hide()
		$('.list-cuaca').show()
	}
}