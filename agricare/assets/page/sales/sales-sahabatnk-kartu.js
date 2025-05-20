$(function () {
	loadDataFarmer(HELPER.getItem('sahabatnk_user_id'))
})

function loadDataFarmer(user_id) {
	HELPER.block()
	var uri_kartu = BASE_URL + 'AkunSales/kartuSahabat/' + user_id;
	var uri_embed = "https://docs.google.com/viewer?url="+uri_kartu+"&embedded=true";
	var target = document.getElementById("div-iframe-kartu");
	var newFrame = document.createElement("iframe");
	newFrame.setAttribute("src", uri_embed);
	newFrame.height = "100%";
	newFrame.width = "100%";
	newFrame.setAttribute("frameBorder", "0");
	if (target !== null) target.appendChild(newFrame);
	setTimeout(function () {
		HELPER.unblock(1000)
	}, 2000)
}
