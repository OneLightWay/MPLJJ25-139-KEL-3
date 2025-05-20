$(function(){
	// HELPER.getItem('user_id')
	// console.log(sales[0])
    loadDataSRAccWaiting(HELPER.getItem('user_id'))
})

function loadDataSRAccWaiting(idd) {
	HELPER.ajax({
		url: BASE_URL + 'Login/loadDataSRAccWaiting',
		data: { id: idd },
		success: function (res) {
			if (res.success) {
				$('.show-sr-waiting-img').attr('src', BASE_ASSETS + 'user/thumbs/' + res.data.user_foto);
				$('.show-sr-waiting-nama').text(HELPER.nullConverter(res.data.user_nama))
				$('.show-sr-waiting-no-div').data('no', res.data.user_telepon)
				$('.show-sr-waiting-no').text(res.data.user_telepon)
				$('.div-sr-waiting').show()
			}
		}
	})
}