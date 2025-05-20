$(() => {
    init();
});

function init() {
    onDetailUndian(HELPER.getItem("history_kupon_detail_id"));
    sales = JSON.parse(HELPER.getItem("configDataSales"));
    loadDataSales(sales[0]["user_id"]);

    $('.back-button').off();
    if (HELPER.getItem('from_page')) {
        var fromPage   = HELPER.getItem('from_page');
        $('.back-button').removeAttr('onclick')
        $('.back-button').on('click', ()=> {onPage(fromPage)});
        HELPER.removeItem(['from_page'])
    }else{
        $('.back-button').on('click', ()=> {onPage('kupon')});
    }
}

function onDetailUndian(history_kupon_detail_id) {
    HELPER.ajax({
        url: BASE_URL + "Kupon/undianDetail",
        data: { id: history_kupon_detail_id },
        success: function (res) {
            $(".detail-undian_banner").attr(
                "src",
                BASE_ASSETS +
                    `undian_kupon/banner/` +
                    res.undian.undian_kupon_banner
            );
            $(".detail-undian_keterangan").html(
                HELPER.nullConverter(atob(res.undian.undian_kupon_keterangan))
            );
            $(".detail-undian_kupon_nama").text(res.undian.undian_kupon_nama);
            $(".detail-hadiah_undian_list_nama").text(res.hadiah);
            HELPER.removeItem(["history_kupon_detail_id"]);
        },
    });
}

function loadDataSales(sales_id) {
    HELPER.ajax({
        url: BASE_URL + "Login/loadDataSRAccWaiting",
        data: { id: sales_id },
        success: function (res) {
            if (res.success) {
                $(".show-sr-waiting-img").attr(
                    "src",
                    BASE_ASSETS + "user/thumbs/" + res.data.user_foto
                );
                $(".show-sr-waiting-nama").text(
                    HELPER.nullConverter(res.data.user_nama)
                );
                $(".show-sr-waiting-no-div").data("no", res.data.user_telepon);
                $(".show-sr-waiting-no").text(res.data.user_telepon);
                $(".div-sr-waiting").show();

                $('.show-sr-waiting-no-div').off('click');
                setTimeout(function () {
                    $('.show-sr-waiting-no-div').on('click', function () {
                        
                        HELPER.ajax({
                            url: BASE_URL + 'Trader/clickLog',
                            data: {
                                user: res.data.user_id,
                                type: 3,
                                petani: HELPER.getItem('user_id')
                            },
                            complete: function (res) {
                            }
                        })
                    });
                }, 300)
            }
        },
    });
}
