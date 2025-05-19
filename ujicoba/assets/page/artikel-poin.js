$(() => {
    loadArtikel()
});

loadArtikel = () => {
    HELPER.ajax({
        url: BASE_URL + "Voucher/loadConfig",
        complete: function (res) {
            $.each(res.data, function (iData, vData) {
                if (iData == "article_poin") {
                    $.each(vData, (i, v) => {
                        if (v.conf_code == "article_poin_img") {
                            $(".detail-article_img").attr(
                                "src",
                                `${BASE_ASSETS}undian_kupon/artikel_img/${v.conf_value}`
                            );
                        }
                        if (v.conf_code == "article_poin_title") {
                            $(".detail-article_title").text(v.conf_value);
                        }
                        if (v.conf_code == "article_poin_content") {
                            $(".detail-article_content").html(atob(v.conf_value));
                        }
                    });
                }
            });
        },
    });
};
