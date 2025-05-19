$(function () {
    showInformasiSlider()
    $('#Artikel_search_done').donetyping(function (e) {
        loadArtikel(this.value)
    })
    setTimeout(() => {
        if (HELPER.isNull(HELPER.getItem('notif_manual_ref_id'))) {
            loadArtikel()
            HELPER.removeItem('notif_manual_ref_id')
        } else {
            detailInfo(HELPER.getItem('notif_manual_ref_id'))
            setTimeout(() => {
                HELPER.removeItem('notif_manual_ref_id')
            }, 500);
        }
    }, 500);
})

function showInformasiSlider() {
    var lc;
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL+'Artikel/showSlider',
        complete: function (res) {
           var slider='';
           $.each(res.data, function(i, v) {
                slider+=`
                    <div onclick="detailInfo('`+v.artikel_id+`','`+v.artikel_jenis+`')">
                        <img src="`+ BASE_ASSETS + `ArtikelImage/` + v.artikel_banner +`" onerror="this.src='./assets/images/noimage.png'" style="width :100%;height:auto;">
                    </div>
                `;
          });
           $('.banner-slider').html(slider)
           if (res.total > 1) {
               setTimeout(function(){
                $('.banner-slider').owlCarousel({dots:false, loop:true, margin:0, nav:false, lazyLoad:true, items:1, autoplay: true, autoplayTimeout:5000});     
                //    $('.owl-dots').addClass('top-10')
               },100)

           }else {
                setTimeout(function(){
                    $('.banner-slider').owlCarousel({dots:false, loop:false, margin:0, nav:false, lazyLoad:true, items:1, autoplay: false, autoplayTimeout:5000});     
                    // $('.owl-dots').addClass('top-10')
                   },100)               
           }

        }
    })
   HELPER.unblock()
}

// function changeFilterNearby() {
//     if ($('#filter-nearby-sales-representative').is(':checked')) {
//         HELPER.setItem('nearby_kategory', 2);
//     } else if ($('#filter-nearby-kios').is(':checked')) {
//         HELPER.setItem('nearby_kategory', 3);
//     } else if ($('#filter-nearby-trader').is(':checked')) {
//         HELPER.setItem('nearby_kategory', 4);
//     } else {
//         window.localStorage.removeItem('nearby_kategory')
//     }

//     loadKios()
//     $('.close-nearby-filter').click()
// }

function changeFilterArtikel() {
    if ($('#filter-informasi-hpt').is(':checked')) {
        HELPER.setItem('artikel_jenis', 2);
    }else if ($('#filter-informasi-umum').is(':checked')){
        HELPER.setItem('artikel_jenis', 1);
    }else if ($('#filter-informasi-promosi').is(':checked')){
        HELPER.setItem('artikel_jenis', 3);
    }else{
        window.localStorage.removeItem('artikel_jenis')
    }

    if ($('#filter-urutan-terbaru').is(':checked')) {
        HELPER.setItem('artikel_urutan', 0);
    }else if ($('#filter-urutan-populer').is(':checked')){
        HELPER.setItem('artikel_urutan', 1);
    }else{
        window.localStorage.removeItem('artikel_urutan')
    }

   loadArtikel()
   $('.close-artikel-filter').click()
}

function resetFilterArtikel() {
    $('#filter-informasi-umum').prop("checked", false);
    $('#filter-informasi-hpt').prop("checked", false);
    $('#filter-informasi-promosi').prop("checked", false);
    $('#filter-urutan-populer').prop("checked", false);
    $('#filter-urutan-terbaru').prop("checked", false);

    window.localStorage.removeItem('artikel_jenis')
    window.localStorage.removeItem('artikel_urutan')

   loadArtikel()
   $('.close-artikel-filter').click()
}

function modalArtikelFilter() {
    var artikel_type = HELPER.getItem('artikel_jenis');
    var artikel_arrange = HELPER.getItem('artikel_urutan');
    console.log('jenis/'+artikel_type)

    if (artikel_type) {
        if (parseInt(artikel_type) == 1) {
                $('#filter-informasi-umum').prop("checked", true);
                $('#filter-informasi-hpt').prop("checked", false);
                $('#filter-informasi-promosi').prop("checked", false);
        }else  if (parseInt(artikel_type) == 2) {
                $('#filter-informasi-umum').prop("checked", false);
                $('#filter-informasi-hpt').prop("checked", true);
                $('#filter-informasi-promosi').prop("checked", false);
        }else{
                $('#filter-informasi-umum').prop("checked", false);
                $('#filter-informasi-hpt').prop("checked", false);
                $('#filter-informasi-promosi').prop("checked", true);
        }
    }else{
        $('#filter-informasi-umum').prop("checked", false);
        $('#filter-informasi-hpt').prop("checked", false);
        $('#filter-informasi-promosi').prop("checked", false);
    }

    
    if(artikel_arrange){
         if (artikel_arrange == 0) {
                $('#filter-urutan-terbaru').prop("checked", true);
                $('#filter-urutan-populer').prop("checked", false);
        }else{
                $('#filter-urutan-terbaru').prop("checked", false);
                $('#filter-urutan-populer').prop("checked", true);
        } 
    }else {
        $('#filter-urutan-populer').prop("checked", false);
        $('#filter-urutan-terbaru').prop("checked", false);
    }

   
}



function loadArtikel(search) {
    $('.artikel-news').html('')
   

    var artikel_type = HELPER.getItem('artikel_jenis');
    var artikel_arrange = HELPER.getItem('artikel_urutan');
    var artikelView = 0;
    
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + 'Artikel/listArtikelExist',
        dataExist: {
            search: search,
            jenis: artikel_type,
            urutan: artikel_arrange,
        },
        urlMore: BASE_URL + 'Artikel/listArtikelMore',
        dataMore: {
            search: search,
            jenis: artikel_type,
            urutan: artikel_arrange,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.artikel-news').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No Article available.</h3>
                                                </div>
                                            </div>`)
                $('.artikel-load-more').hide()
            }else{
                $('.artikel-load-more').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_artikel = $.parseJSON(data.responseText);
                $.each(data_artikel.data, function(i, v) {
                    if (v.artikel_jenis == 1) {
                        var jenis_artikel = 'Informasi Umum'                        
                    }else if(v.artikel_jenis == 2){
                        var jenis_artikel = 'Informasi Hpt'
                    }else{
                        var jenis_artikel = 'Informasi Promosi'
                    }

                    var img = 'assets/images/noimage.png';
                    if (v.artikel_banner) {
                        
                        img = BASE_ASSETS+`ArtikelImage/thumbs/`+v.artikel_banner;
                    }
                    var icon_view = "fa fa-eye";


                    $('.artikel-news').append(`
                            <a href="javascript:;" class = "show-overlay-list" onclick="detailInfo('`+v.artikel_id+`','`+v.artikel_jenis+`')">
                                <div class="caption-center">
                                    <img src="`+img+`" alt="" width="60" class="round-small">
                                </div>
                                <span class="article-category under-heading font-12 left-20 bottom-10 opacity-50">`+jenis_artikel+`</span>
                                <strong class="article-title color-custom-black font-14 left-20 bottom-20" style="position:inherit;margin-top:-40px;">
                                    <p style ="padding-bottom:20px; padding-right:20px;text-align:justify;">`+v.artikel_judul+`</p></strong>
                                <strong class="article-title color-custom-black font-14 left-20 bottom-20" style="padding-top: 20px;">
                                    <i class="${icon_view} color-custom-gray" style="padding-right: 13px; padding-top: 9px;"></i>
                                    <p style ="padding-left: 20px;padding-top: 38px;text-align:justify;">`+v.artikel_total_view+`</p>
                                </strong>
                               
                                <i class="fa fa-angle-right fa-lg" style="margin:inherit;"></i>

                            </a>

                    `)

                });
                // $('.artikel-news').waitMe('hide')
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('.artikel-load-more').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('.artikel-load-more').hide()
            $('.artikel-load-more').off('click');
        }

    })
}

function detailInfo(id, jenis=1) {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL+'Artikel/read',
            data: {artikel_id: id},
            complete: function (res) {
                addView(id)
                HELPER.setItem('artikel_id', res.artikel_id);
                HELPER.setItem('detail_informasi_judul', res.artikel_judul);
                HELPER.setItem('detail_informasi_content', res.artikel_content);
                HELPER.setItem('detail_informasi_banner', res.artikel_banner);
                HELPER.setItem('detail_informasi_video', res.artikel_video);
                if (parseInt(res.artikel_jenis)  == 1) {
                    onPage('detail-info-umum')
                    HELPER.setItem('from_page', 'informasi')
                }else if (parseInt(res.artikel_jenis) == 2) {
                    HELPER.setItem('detail_informasi_perawatan', res.artikel_perawatan);
                    HELPER.setItem('detail_informasi_pencegahan', res.artikel_pencegahan);
                    HELPER.setItem('detail_informasi_ciri', res.artikel_ciri_hpt);
                    HELPER.setItem('artikel_hama_kategori_id', res.artikel_hama_kategori_id);
                    HELPER.setItem('artikel_hama_kategori_nama', res.hama_kategori_nama);
                    HELPER.setItem('artikel_hama_id', res.artikel_hama_id);
                    HELPER.setItem('artikel_hama_nama', res.hama_nama);
                    HELPER.setItem('artikel_hama_image', res.hama_image);
                    HELPER.setItem('artikel_hama_keterangan', res.hama_keterangan);
                    onPage('detail-info-hpt')
                    HELPER.setItem('from_page', 'informasi')
                }else{
                    HELPER.setItem('detail_informasi_start_date', moment(res.artikel_start_date).format('DD MMMM YYYY'));
                    HELPER.setItem('detail_informasi_end_date', moment(res.artikel_end_date).format('DD MMMM YYYY'));
                    onPage('detail-info-promo')
                    HELPER.setItem('from_page', 'informasi')
                }
                HELPER.unblock()
            }
           
        })
    
}

function addView(id) {
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Artikel/addView',
        data: { artikel_id: id },
        complete: function (res) {
            console.log(res)
        }

    })

}