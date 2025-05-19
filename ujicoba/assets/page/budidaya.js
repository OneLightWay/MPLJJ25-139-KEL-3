$(function () {
	HELPER.block()
	setSliderBudidaya()
	setTimeout(function () {
		HELPER.unblock()
	}, 4000)
})

function setSliderBudidaya() {
	HELPER.ajax({
		url: BASE_URL+'Main/loadBudidaya',
		complete: function (res) {
			$.each(res.data, function(index, val) {
				var bud_title = HELPER.nullConverter(val.budidaya_title)
				var bud_body  = "-";
				if (parseInt(val.budidaya_type) == 0) {
					bud_body = atob(val.budidaya_body)
				}else if (parseInt(val.budidaya_type) == 1) {
					var img = BASE_ASSETS+'images/budidaya/'+val.budidaya_body;
					bud_body = `<a class="example-image-link" href="${img}" data-lightbox="${img}">
	                                <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="top-0 symbol w-100 example-image rounded" alt="img" style="border-radius:5px;max-height:80vh">
	                            </a>`
				}else if (parseInt(val.budidaya_type) == 2) {
					var filebud = BASE_ASSETS+'images/budidaya/'+val.budidaya_body;
					bud_body = `<iframe width="100%" style="height:80vh;" src="https://docs.google.com/viewer?url=${filebud}&embedded=true" frameborder="0"></iframe>`
				}else if (parseInt(val.budidaya_type) == 3) {
					var ytId = "";
					try {
						var temp = new URL(val['budidaya_body']);
						ytId = temp.searchParams.get('v');
					} catch(e) {
						console.log(e);
					}
					var filebud = "https://www.youtube.com/embed/"+ytId;
					bud_body = `<iframe width="100%" height="250px" src="${filebud}" 
							frameborder="0" allow="accelerometer; encrypted-media; gyroscope;" allowfullscreen></iframe>`
				}
				var isihtml = `
					<div class="caption bottom-0 round-medium" style="height: 80vh;">
	                    <div class="caption-top bottom-10 center-text">
	                        <h1 class="bolder font-20 top-0">${bud_title}</h1>
	                        <div class="top-10">
			                    ${bud_body}
	                        </div>
	                    </div>
	                    <div class="caption-overlay bg-gradient-fade"></div>
	                </div>
				`
				$('.slider-budidaya').append(isihtml)
			});
		    setTimeout(function () {
			    $('.slider-budidaya').owlCarousel({loop:false, margin:5, nav:false, lazyLoad:true, items:1, autoplay: false});
		    }, 500)
		}
	})
}