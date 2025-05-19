$(function () {
    HELPER.block()
    setTimeout(function () {
        $(".back-button").off();
        setTimeout(function () {
            if (HELPER.getItem("from_page")) {
                fromPage = HELPER.getItem("from_page");
                $(".back-button").on("click", function () {
                    setTimeout(function () {
                        onPage(fromPage);
                    }, 100);
                });
                HELPER.removeItem(["from_page"]);
            } else {
                $(".back-button").on("click", function () {
                    setTimeout(function () {
                        onPage("main");
                    }, 100);
                });
            }
        }, 300);
        HELPER.unblock(3000)
    }, 300);
    loadMarketplace();
});

function loadMarketplace() {
    HELPER.ajax({
        url: BASE_URL + 'Main/getLinkMarket',
        complete: function (res) {
            if (res.marketplace.total > 0) {
                $.each(res.marketplace.data, function (i, v) {
                    $('#list-toko-online').append(`
                        <div class="content-boxed shadow-huge show-overlay left-0 top-15 right-0 bottom-15">
                            <div class="content bottom-20">
                                <div class="text-center">
                                    <a href="javascript:void(0)" class="font-15 color-custom-gray" onclick="window.open('${(v.link_market_val)}');">${(v.link_market_nama)}</a>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                    `)
                });
            } else {
                // $('.detail-nearby-link').hide()
            }
            $("#banner-marketplace").attr("src",`${BASE_ASSETS}images/banner_marketplace/${res.banner_marketplace}`);

        }
    })
}
