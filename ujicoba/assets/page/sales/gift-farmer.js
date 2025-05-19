$(function () {
    setTimeout(() => {
        $('.back-button').off('click');
        $('.back-button').on('click', () => {
            onPage('main-sales');
        });
    }, 300);
    loadHistoryGift();
});

function loadHistoryGift() {
    $('.list_gift_farmer').html('');
    var sales_id = HELPER.getItem('user_id');

    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Sales/listHistoryGiftFarmerExist',
        dataExist: {
            user_id : sales_id,
        },
        urlMore: BASE_URL + 'Sales/listHistoryGiftFarmerMore',
        dataMore: {
            user_id: sales_id,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('.list_gift_farmer').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak Ada History</h3>
                                                </div>
                                            </div>`)
                $('.gift-farmer-load-more').hide()
            } else {
                $('.gift-farmer-load-more').show()
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue()
            myQueue.enqueue(function (next) {
                HELPER.block()
                next()
            }, '1').enqueue(function (next) {
                var gift_farmer = JSON.parse(data.responseText);
                $.each(gift_farmer.data, function (i, v) {
                    let timeDisplay = moment(v.gift_farmer_created_at).format('ddd, DD MMM YYYY HH:mm:ss')
                    let imgFarmer = "";
                    let imgSales = v.sales_foto ? BASE_ASSETS+'user/'+v.sales_foto : 'assets/images/avatars/6s.png';
                    if (v.farmer_foto.indexOf('http') >= 0) {
                        imgFarmer = v.farmer_foto;
                    }else{
                        imgFarmer = BASE_ASSETS+'user_mobile/'+v.farmer_foto;
                    }

                    $('.list_gift_farmer').append(`
                        <div class="content bottom-20"> 
                            <a href="javascript:void(0)" class="caption round-medium shadow-large bg-theme bottom-15 show-overlay">
                                <div class="content" style="margin-top: 10px; margin-bottom: 10px">
                                    <p class="color-custom-dark mb-0 font-14">Data Petani</p>
                                    
                                    <div class="row">
                                        <img src="${imgFarmer}" onerror="this.src='./assets/images/noimage.png'" style="margin-right: 15px ;height: 50px; height : 50px; aspect-ratio : 1/1; border-radius : 25px;"/>
                                        <div style="width : 50%; display: flex; flex-direction: column">
                                            <h2 class="font-12 color-custom-dark" style="margin-bottom: 0">${v.farmer_nama}</h2>
                                            <label class="font-10 color-custom-dark"><i class="fa fa-map-marker color-highlight"></i> ${HELPER.nullConverter(v.farmer_alamat)}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                                <div class="content" style="margin-bottom: 10px">
                                    <p class="color-custom-dark mb-0 font-14">Data Sales</p>
                                    
                                    <div class="row">
                                        <img src="${imgSales}" onerror="this.src='./assets/images/noimage.png'" style="margin-right: 15px ;height: 50px; height : 50px; aspect-ratio : 1/1; border-radius : 25px;"/>
                                        <div style="width : 50%; display: flex; flex-direction: column">
                                            <h2 class="font-12 color-custom-dark" style="margin-bottom: 0">${v.sales_nama}</h2>
                                            <label class="font-10 color-custom-dark"><i class="fa fa-map-marker color-highlight"></i> ${HELPER.nullConverter(v.sales_alamat)}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                                <p class="color-custom-dark mb-0 font-16 left-10 bottom-10">Waktu : ${timeDisplay}</p>
                            </a>
                        </div>
                    `);

                });
                next()
            }, '2').enqueue(function (next) {
                HELPER.unblock(500)
                setTimeout(function () { setLangApp() }, 500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function (callLoadMore) {
            $('.gift-farmer-load-more').off('click').on('click', function () {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('.gift-farmer-load-more').hide();
            $('.gift-farmer-load-more').off('click');
        }

    });
}