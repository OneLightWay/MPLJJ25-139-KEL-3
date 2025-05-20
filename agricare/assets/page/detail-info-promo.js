$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page')) {
                fromPage = HELPER.getItem('from_page');
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage(fromPage)
                    }, 300)
                });
                HELPER.removeItem(['from_page'])
            } else {
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('informasi')
                    }, 100)
                });
            }
        }, 300)
    }, 300)
    showDetailInfo()
})

function showDetailInfo() {
    var artikel_content = atob(HELPER.getItem('detail_informasi_content'));
    var artikel_start_date = HELPER.getItem('detail_informasi_start_date');
    var artikel_end_date = HELPER.getItem('detail_informasi_end_date');
    var artikel_video = HELPER.getItem('detail_informasi_video');
    // console.log(artikel_end_date)
    $('.detail-info-artikel_judul').text(HELPER.getItem('detail_informasi_judul'))
    $('.detail-info-artikel_periode').text('Periode Promo '+artikel_start_date+' - '+artikel_end_date)
    $('.detail-info-artikel_content').html(artikel_content)
    preventHrefWysiwyg(['detail-info-artikel_content'])
    $('.detail-info-artikel_banner').attr('src',BASE_ASSETS+`ArtikelImage/`+HELPER.getItem('detail_informasi_banner'))
	if (artikel_video == "null" ) {
        // $('.no-video').show()
        $('.video-available').hide()
    }else if (artikel_video == "" ) {
        // $('.no-video').show()
        $('.video-available').hide()
    }else{
        $('.video-available').show()
        $('.detail-artikel_video').attr('src',`https://www.youtube.com/embed/`+artikel_video)
    }
    

}

