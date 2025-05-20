$(function () {
	$('.slider-splash').owlCarousel({ dots: false, loop: false, margin: 0, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000 });
	if (parseInt(HELPER.getItem('status_acc_snk')) == 1) {
		onPage('login')
	}
	checkSnk()
})
function showSnk() {
	$('.slider-splash').hide()
	$('#menu-snk').show()
	showDivSnk()
}
function hideSnk() {
	$('.slider-splash').show()
	$('.owl-carousel').trigger('to.owl.carousel', 1)
	$('#menu-snk').hide()
}
function agreeSnk() {
	HELPER.confirm({
		message: 'Apakah Anda yakin menyetujui Syarat dan Ketentuan yang berlaku ?',
		confirmLabel: '<i class="fa fa-check"></i> Yakin',
		cancelLabel: '<i class="fa fa-times"></i> Tidak',
		callback: function (oke) {
			if (oke) {
				HELPER.setItem('status_acc_snk', 1)
				setTimeout(function () {
					onPage('login')
				}, 500)
			}
		}
	})
}

function checkSnk() {
	$('input[type="checkbox"]').click(function () {
		if ($('#syarat_1').prop("checked") == true && $('#syarat_2').prop("checked") == true && $('#syarat_3').prop("checked") == true) {
			console.log("Checkbox is checked.");
			$('#btnAgree').removeClass('btn-disabled');
		}
		else if ($(this).prop("checked") == false) {
			console.log("Checkbox is unchecked.");
			$('#btnAgree').addClass('btn-disabled');
		}
	});
}

function showDivSnk() {
	HELPER.ajax({
		url: BASE_URL + 'Main/showSnk',
		type: "POST",
		complete: function (res) {
			var decode = atob(res.html)
			$('#div-show-snk').html(decode);
		}
	})
}