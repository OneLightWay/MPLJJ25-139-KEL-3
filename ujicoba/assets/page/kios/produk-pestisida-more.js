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
                $('.div-button').show()
                $('.back-button').on('click', function () {
                    setTimeout(function () {
                        onPage('main-kios')
                    }, 100)
                });
            }
        }, 300)
    }, 300)
    produkPestisida()
})


function produkPestisida() {
    var user_id = HELPER.getItem('user_id');
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Kios/produkPestisida',
        data: {
            user: user_id,
        },
        complete: function (res) {
            if (res.total > 0) {
                var produk = '';
                $.each(res.data, function (i, v) {
                    var img = './assets/images/noimage.png';
                    if (v.kios_pestisida_image) {
                        img = BASE_ASSETS + 'images/pestisida/thumbs/' + v.kios_pestisida_image;
                    }
                    $('.link-kios_pestisida_image').attr({
                        'href': img,
                        'data-lightbox': img
                    });
                    $('.detail-kios_pestisida_image').attr({
                        'src': img,
                        'title': v.kios_pestisida_image
                    });
                    var icon_harga = "fas fa-dollar-sign";
                    var icon_stok = "fas fa-boxes";
                    var icon_jumlah = "fas fa-weight";
                    var icon_total = "fa fa-money-bill";

                    produk += ` <div class="one-half">
                                <div class="item bg-theme round-small shadow-small bottom-10">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:100%;" onclick="detailProductPestisida('`+ v.kios_pestisida_id + `')">
                                    <div class="caption bottom-10">
                                      <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="`+ img + `" class="centerimg detail-kios_pestisida_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_pestisida_nama + `</h5>
                                        <h5 class="bottom-0 lh-20 font-12 center-text">`+ v.kios_pestisida_kemasan + `  ${HELPER.nullConverter(v.pestisida_satuan)}</h5>
                                    </div>    
                                    <div>
                                        <label class="left-15 bottom-0 font-12 lh-20"><i class="${icon_harga} color-highlight"></i>Harga : Rp. ` + HELPER.toRp(v.kios_pestisida_harga) + `</label>
                                        <label class="left-10 bottom-0 font-12 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_pestisida_stok + ` Pack</label>
                                    </div>
                               </a>  
                               </div> 
                            </div>`;
                });

                $('.show-produk').html(produk)
                $('.no-image').hide()
            } else {
                $('.no-image').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <h4 class="bolder artikel-judul bottom-20 center-text color-custom-black">No Caption</h4>
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No image available.</h3>
                                        </div>
                                    </div>`)
                $('.no-image').show()
                $('.show-card-galeri').hide()
            }
            HELPER.unblock(100)
            // onPage('main-kios')
        }
    })
}

function detailProductPestisida(id) {
    HELPER.setItem('detail_produk_pestisida_id', id)
    HELPER.setItem('from_page', 'produk-pestisida-more')
    onPage('detail-jual-pestisida')
}