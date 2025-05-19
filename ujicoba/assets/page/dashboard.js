$(function () {
    showPromosiSlider()
    $('.double-slider').owlCarousel({loop:true, margin:20, nav:false, lazyLoad:true, items:2, autoplay: false, stagePadding:20, autoplayTimeout:4000});    

})

function showPromosiSlider() {
  HELPER.block()
  HELPER.ajax({
    url: BASE_URL + 'Main/getPromotion',
    complete: function (res) {
      console.log(res)
      $('.dashboard-promo').show()
      var slider = '';
      $.each(res.data, function (i, v) {
        if (v.artikel_jenis == 1 || v.artikel_jenis == 2) {
          slider += `
                    <div class="artikel-promo" onclick="detailInfo('`+ v.artikel_id + `','` + v.artikel_jenis + `')">
                        <img src="`+ BASE_ASSETS + `ArtikelImage/` + v.artikel_banner + `" class="" style="width :100%;height:auto;">
                    </div>
                `;
        } else {
          slider += `
                     <div class="artikel-promo">
                         <img src="`+ BASE_ASSETS + `ArtikelImage/` + v.artikel_banner + `" class="" style="width :100%;height:auto;">
                     </div>
                 `;
        }
      });
      $('.banner-slider').html(slider)

      if (res.total > 1) {
        setTimeout(function () {
          $('.banner-slider').owlCarousel({ dots: false, loop: true, margin: 0, nav: false, lazyLoad: true, items: 1, autoplay: true, autoplayTimeout: 5000 });
          // $('.owl-dots').addClass('top-10')
        }, 100)

      } else {
        setTimeout(function () {
          $('.banner-slider').owlCarousel({ dots: false, loop: false, margin: 0, nav: false, lazyLoad: true, items: 1, autoplay: false, autoplayTimeout: 5000 });
          // $('.owl-dots').addClass('top-10')
        }, 100)
      }


      HELPER.unblock()
    }
  })
}

function detailInfo(id, jenis) {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL+'Artikel/read',
            data: {artikel_id: id},
            complete: function (res) {
                addView(id)
                HELPER.setItem('detail_informasi_judul', res.artikel_judul);
                HELPER.setItem('detail_informasi_content', res.artikel_content);
                HELPER.setItem('detail_informasi_banner', res.artikel_banner);
                if (parseInt(jenis)  == 1) {
                  onPage('detail-info-umum')
                }else if (jenis == 2) {
                  HELPER.setItem('detail_informasi_perawatan', res.artikel_perawatan);
                  HELPER.setItem('detail_informasi_pencegahan', res.artikel_pencegahan);
                    HELPER.setItem('detail_informasi_ciri', res.artikel_ciri_hpt);
                  HELPER.setItem('artikel_hama_kategori', res.artikel_hama_kategori_id);
                  onPage('detail-info-hpt')
                }else{
                  HELPER.setItem('detail_informasi_start_date', moment(res.artikel_start_date).format('DD MMMM YYYY'));
                  HELPER.setItem('detail_informasi_end_date', moment(res.artikel_end_date).format('DD MMMM YYYY'));
                  onPage('detail-info-promo')
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
