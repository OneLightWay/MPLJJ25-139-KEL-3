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
    // detailInfo()
    showDetailInfo()
    galeriArtikel()
})

function showDetailInfo() {
    var artikel_id = HELPER.getItem('artikel_id');
    var artikel_content = atob(HELPER.getItem('detail_informasi_content'));
    var artikel_video = HELPER.getItem('detail_informasi_video');
    
    $('.detail-info-artikel_judul').text(HELPER.getItem('detail_informasi_judul'))
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

function galeriArtikel() {
    var artikel_id = HELPER.getItem('artikel_id');
    var detail_informasi_judul = HELPER.getItem('detail_informasi_judul');
    var artikel_content = atob(HELPER.getItem('detail_informasi_content'));

    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Artikel/getArtikelGaleri',
        data: {
            kategori: artikel_id,
        },
        complete: function (res) {
            if (res.total > 0) {
                var galeri='';
                $.each(res.data, function(i, v) {
                    var img = './assets/images/noimage.png';
                    if (v.artikel_image_name) {
                        img = BASE_ASSETS+'ArtikelImage/'+v.artikel_image_name;
                    }
                    $('.link-artikel_image_name').attr({
                        'href': img,
                        'data-lightbox': img
                    });
                    $('.detail-artikel_image_name').attr({
                        'src': img,
                        'title': v.artikel_image_name
                    });

                    // galeri+=`<a class="example-image-link link-artikel_image_name" href="`+img+`" data-lightbox="`+img+`">
                    //             <img src="`+img+`" data-src="" class="top-0 symbol w-100px example-image border border-secondary detail-artikel_image_name rounded" alt="img" style="border-radius:5px; height:94px;">
                    //         </a>`;
                    // galeri+=`<a class="default-link" data-lightbox="`+img+`" href="`+img+`" title="Vynil and Typerwritter">
                    //             <img src="`+img+`" data-src="" class="preload-image responsive-image" alt="img">
                    //         </a>`;
                    galeri+=`<a class="default-link" data-lightbox="`+img+`" href="`+img+`" style="padding:0px;">
                                <img src="`+ img +`" onerror="this.src='./assets/images/noimage.png'" data-src="" class="round-small preload-image shadow-small responsive-image" alt="img" style="border-radius:5px; height:94px;">
                            </a>`;
                            
                });

                $('.show-galeri').html(galeri)
                $('.artikel-judul').html(detail_informasi_judul)
                $('.no-image').hide()
            }else{
                $('.no-image').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <h4 class="bolder artikel-judul bottom-20 center-text color-custom-black">No Caption</h4>
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No image available.</h3>
                                        </div>
                                    </div>`)
                $('.no-image').show()
                $('.show-card-galeri').hide()
                $('#galeri-card').hide()
                $('.artikel-judul').html(detail_informasi_judul)

            }

            $('.btn-back').on('click', function() {onPage('informasi')});
            // onPage('artikel-galeri')
            HELPER.unblock()
        }
    })
}

function detailInfo() {
    var artikel_id = HELPER.getItem('artikel_id');
    console.log(artikel_id)
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL+'Artikel/read',
        data: {artikel_id: artikel_id},
        complete: function (res) {
            console.log(res)
        }
       
    })
    
}