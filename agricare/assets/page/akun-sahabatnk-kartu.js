$(function () {
	HELPER.block()
	setTimeout(function(){
		loadDataFarmer(HELPER.getItem('user_id'))
	}, 2000)
})

function loadDataFarmer(user_id) {
	HELPER.block()
	var uri_kartu = BASE_URL + 'AkunSales/kartuSahabat/' + user_id;
	var uri_embed = "https://docs.google.com/viewer?url="+uri_kartu+"&embedded=true";
	$('#div-frame-kartu').attr('src', uri_embed);
	setTimeout(function () {
		HELPER.unblock(1000)
		$('#div-frame-kartu').attr('src', uri_embed);
	}, 2000)
}
