var mymap;
$(function () {
    ListLahan()
    setTimeout(function () {
        var back = HELPER.getItem('LokasiLahan');
        $('.back-button').off('click');
        setTimeout(function () {
            if (parseInt(back) == 1) {
                $('.back-button').on('click', function(event) {onPage('akun')});
            }else{
                $('.back-button').on('click', function(event) {
                    onPage('main')
                });
            }
            // $( "#plus-menu" ).toggle( "bounce", { times: 1, distance: 100 }, 5000 );
        }, 300)
    }, 300)
})

function ListLahan() {
    
    $('.list_lahan_farmer').html('')
    var farmer_id = HELPER.getItem('user_id')

    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + 'LokasiLahan/listLahanExist',
        dataExist: {
            lahan_farmer_id: farmer_id,
        },
        urlMore: BASE_URL + 'LokasiLahan/listLahanMore',
        dataMore: {
            lahan_farmer_id: farmer_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.list_lahan_farmer').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada data lahan.</h3>
                                                </div>
                                            </div>`)
                $('.lahan-load-more').hide()
            }else{
                $('.lahan-load-more').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_lahan = $.parseJSON(data.responseText);
                $.each(data_lahan.data, function(i, v) {
                    var labelMain = ''
                    var lokasiLahan = HELPER.nullConverter(v.lahan_nama);
                    if (v.varietas_name) {
                        lokasiLahan += " ( "+ v.varietas_name +")"
                    }

                    $('.list_lahan_farmer').append(`
                        <div class="content bottom-20">
                            <a href="javascript:;" class="caption round-medium shadow-large bg-theme bottom-15 show-overlay" onclick="detailLahan('`+v.lahan_id+`')">
                                <div class="float-right right-10 top-5" style="color: #${v.lahan_color}">
                                    <i class="fa fa-circle"></i>
                                </div>
                                <div>
                                    <h1 class="font-16 color-custom-dark float-left left-20 right-50 top-20 bottom-0">`+lokasiLahan+`</h1>
                                </div>
                                <div class="clear"></div>
                                <div class="content left-20 bottom-20">
                                    <div class="top-5">
                                        <label class="color-custom-dark"><i class="fas fa-square color-highlight right-10"></i>`+HELPER.toRp(v.lahan_luas)+` Ha</label>
                                        <label class="color-custom-dark"><i class="fas fa-map-marked-alt color-highlight right-10"></i>`+HELPER.nullConverter(v.lahan_alamat)+`</label>
                                    </div>
                                </div>
                                <div class="content-footer">
                                    <span class="bhsConf-ketuk_detail">Ketuk untuk detail</span>
                                    <i class="fa fa-angle-right fa-lg"></i>
                                </div>
                                <div class="clear"></div>
                            </a>
                        </div>
                    `)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                setTimeout(function () {setLangApp()}, 500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('.lahan-load-more').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('.lahan-load-more').hide()
            $('.lahan-load-more').off('click');
        }

    })
}

function detailLahan(id) {
    HELPER.setItem('petani_lahan_id',id)
    setTimeout(function () {
        onPage('lokasi-lahan-detail')
    }, 200)
}










