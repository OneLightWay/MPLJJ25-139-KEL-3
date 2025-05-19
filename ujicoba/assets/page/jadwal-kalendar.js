var calendarObj=null;
$(function () {
	initKalendar()
	setTimeout(function () {
		$('.back-button').off()
		$('.back-button').removeAttr('onclick')
		setTimeout(function () {
			$('.show-date-listed').text(moment().format('DD MMM YYYY'))
			if (HELPER.getItem('from_page')) {
				var fromPage = HELPER.getItem('from_page');
				$('.back-button').on('click', function() {
					onPage(fromPage)
				});
				HELPER.removeItem('from_page')
			}else{
				$('.back-button').on('click', function() {
					onPage('main')
				});
			}
		}, 300)
	}, 300)
})

function initKalendar() {
	var calendarEl = document.getElementById('calendar');

	/*calendarObj = new FullCalendar.Calendar(calendarEl, {
		themeSystem: 'standard',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: '',
		},
		buttonText: {
            today: 'Today'
        },
		height: '70vh',
		initialView: 'dayGridWeek',
		initialDate: moment().format('YYYY-MM-DD'),
		navLinks: false,
		editable: true,
		dayMaxEvents: true,
		eventClick: function(arg) {
			arg.jsEvent.stopImmediatePropagation();
			onGoAksiTanam(arg.event)
		},
		eventSources: [
		{
			url: BASE_URL+'LokasiLahan/loadJadwalKalendar',
			method: 'POST',
			extraParams: {
				farmer_id: HELPER.getItem('user_id'),
			},
			failure: function() {
				alert('there was an error while fetching events!');
			},
		}],
	});

	calendarObj.render();*/

	calendarObj = $('#calendar').simpleCalendar({
        displayYear: true,              // Display year in header
        fixedStartDay: true,            // Week begin always by monday or by day set by number 0 = sunday, 7 = saturday, false = month always begin by first day of the month
        displayEvent: true,             // Display existing event
        disableEventDetails: false, // disable showing event details
        disableEmptyDetails: false, // disable showing empty date details
        onInit: function (calendar) {setTimeout(()=>{loadKalendar()}, 500);setTimeout(()=>{$('.today').click()}, 2000);}, // Callback after first initialization
        onMonthChange: function (month, year) {
        	calendarObj.data('plugin_simpleCalendar').settings.events = [];
        	setTimeout(function () {
		        loadKalendar(year, month)
        	}, 300)
        }, // Callback on month change
        onDateSelect: function (date, events) {showListJadwal(date, events)}, // Callback on date selection
    })
}

function loadKalendar(year=moment().format('YYYY'), month=(parseInt(moment().format('MM'))-1)) {
	HELPER.ajax({
		url: BASE_URL+'LokasiLahan/loadJadwalKalendar',
		data:{
			year: year,
			month: parseInt(month)+1,
			farmer_id: HELPER.getItem('user_id'),
		},
		complete: function (res) {
			var $calendar = calendarObj.data('plugin_simpleCalendar')
			if (res.success) {
				$.each(res.data, function(i, v) {
					$calendar.addEvent(v)
				});
			}
		}
	})
}

function showListJadwal(date, events) {
	$('.show-date-listed').text(moment(date).format('DD MMM YYYY'))
	if (events.length > 0) {
		$('.div-list-jadwal').html('')
		setTimeout(function () {
			$.each(events, function(i, v) {
				$('.div-list-jadwal').append(`
					<label class="radius-5" style="padding:10px;margin:10px 0;color: ${v.textColor};background-color: ${v.backgroundColor}" data-tanam="${btoa(JSON.stringify(v))}" onclick="onGoAksiTanam(this)">
						<i class="fas fa-circle color-white"></i> 
						<span>${v.title}</span>
					</label>
				`)
			});
		}, 300)
	}else{
		$('.div-list-jadwal').html(`<div class="content-boxed content-box shadow-medium top-5 left-0 right-0 bottom-10">
										<div class="not-found">
											<div></div>
											<h3 class="bhsConf-no_jadwal">Belum ada jadwal yang diatur.</h3>
										</div>
									</div>`)
		setTimeout(() => {
			setLangApp()
		}, 500);
	}
}

function onGoAksiTanam(el) {
	var evt = JSON.parse(atob($(el).data('tanam')))
	$('.btn-lihat-detail').off();
	$('#show_jadwal_title').text(evt.title)
    $('.show_jadwal_date').text(moment(evt.start).format('DD/MM') + " - " + moment(evt.end).format('DD/MM'))
    if (parseInt(evt.fase_type) == 1) {
        $('.show-kebutuhan-pupuk').show()
        $('.list-kebutuhan-pupuk').html('')
        $('#menu-jadwal-lihat .menu-title').removeClass('bottom-15')
        setTimeout(function () {
        	HELPER.ajax({
                url: BASE_URL+'LokasiLahan/readJadwal',
                data: {id: evt.id},
                complete: function (res) {
                    if (res.success) {
			            $.each(JSON.parse(res.data.pt_detail_data_pupuk), function(iPuk, vPuk) {
			                $('.list-kebutuhan-pupuk').append(`
			                    <div class="row">
			                        <div class="col-auto right-15">${iPuk}</div>
			                        <div class="col">${vPuk} Kg</div>
			                    </div>
			                    <div class="clear"></div>
			                `)
			            });
                    }
                }
            })
        }, 200)
    }else{
        $('#menu-jadwal-lihat .menu-title').addClass('bottom-15')
        $('.show-kebutuhan-pupuk').hide()
    }

    setTimeout(function () {
    	$('.btn-lihat-detail').on('click', function(e) {
			HELPER.setItem('lokasi_lahan_detail_tanam', evt.jadwal_id)
			HELPER.setItem('petani_lahan_id', evt.lahan_id)
			setTimeout(function () {
				onPage('lokasi-lahan-detail')
			}, 300)
    	});
    }, 200)
    $('#btn-jadwal-lihat').click()
}
