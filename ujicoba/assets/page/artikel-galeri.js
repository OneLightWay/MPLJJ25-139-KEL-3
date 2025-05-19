$(function () {
    $('.btn-back').off('click').removeAttr('onclick')

    galeriArtikel()
    // $('.show-product').owlCarousel({loop:false, margin:200, nav:false, lazyLoad:true, items:1, autoplay: false, stagePadding:20, autoplayTimeout:4000, autoWidth:true});    

})


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

                    galeri+=`<a class="example-image-link link-artikel_image_name" href="`+img+`" data-lightbox="`+img+`">
                                <img src="`+img+`" data-src="" class="top-0 symbol w-100px example-image border border-secondary detail-artikel_image_name rounded" alt="img" style="border-radius:5px;height:94px;">
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
                $('.artikel-judul').html(detail_informasi_judul)
            }

            // onPage('artikel-galeri')
            HELPER.unblock()
        }
    })
}