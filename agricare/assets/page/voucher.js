var KURS_POIN = 0;
var MY_POIN = 0;
$(function () {
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
    }, 300);
    loadPoin();
    loadConfig();
});

function loadConfig() {
    HELPER.ajax({
        url: BASE_URL + "Voucher/loadConfig",
        complete: function (res) {
            if (res.data.point[1].conf_value == 1) {
                $.each(res.data, function (iData, vData) {
                    if (iData == "undian") {
                        $.each(vData, (i, v) => {
                            if (v.conf_code == "undian_is_active") {
                                if (v.conf_value != 1) {
                                    $("#div-special-program").hide();
                                    $(".poin_nonactive").html(`
                                        <div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Segera hadir untuk Anda!</h3>
                                            </div>
                                        </div>`);
                                }
                            }
                            if (v.conf_code == "undian_banner") {
                                HELPER.setItem(
                                    "banner_special_program",
                                    v.conf_value
                                );
                                $("#banner-special-program").attr(
                                    "src",
                                    `${BASE_ASSETS}undian_kupon/banner_conf/${v.conf_value}`
                                );
                            }
                        });
                    }
                    if (iData == "article_poin") {
                        $.each(vData, (i, v) => {
                            if (v.conf_code == "article_poin_is_active") {
                                if (v.conf_value != 1) {
                                    $(".div-article-poin").hide();
                                }
                            }
                            if (v.conf_code == "article_poin_img") {
                                $(".article-img").attr(
                                    "src",
                                    `${BASE_ASSETS}undian_kupon/artikel_img/${v.conf_value}`
                                );
                            }
                            if (v.conf_code == "article_poin_title") {
                                $(".article-title").text(v.conf_value);
                            }
                            if (v.conf_code == "article_poin_content") {
                                $(".articel-content").html(atob(v.conf_value));
                            }
                        });
                    }
                    if (iData == "reset_poin") {
                        if (vData[0].conf_value == "end_year" || vData[1].conf_value == "end_year") {
                            var dateEndYear = moment().format('YYYY')+"-12-31";
                            $('.show-date-reset').text(moment(dateEndYear).format('DD MMMM YYYY'));
                        } else {
                            if (vData[0].conf_value == "end_date") {
                                $('.show-date-reset').text(moment(vData[1].conf_value, "DD-MM-YYYY").format('DD MMMM YYYY'));
                            } else {
                                $('.show-date-reset').text(moment(vData[0].conf_value, "DD-MM-YYYY").format('DD MMMM YYYY'));
                            }
                        }
                    }
                });
            } else {
                $("#div-special-program").hide();
                $(".div-article-poin").hide();
                $(".div-list-voucher").hide();
                $(".title_h3").hide()
                $(".poin_nonactive").html(`
                            <div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                <div class="not-found">
                                    <div></div>
                                    <h3>Segera hadir untuk Anda!.</h3>
                                </div>
                            </div>`);
            }
        },
    });
}

function loadPoin() {
    HELPER.ajax({
        url: BASE_URL + "Voucher/mainVoucher",
        data: { id: HELPER.getItem("user_id") },
        complete: function (res) {
            KURS_POIN = parseFloat(res.kurs_poin);
            MY_POIN = parseInt(res.user_total_poin);
            $(".user-poin").text(HELPER.nullConverter(res.user_total_poin, 0));
            setTimeout(function () {
                loadListVoucher();
            }, 300);
        },
    });
}

function loadListVoucher() {
    $(".list-voucher").html("");
    HELPER.block();
    HELPER.ajax({
        url: BASE_URL + "Voucher/listMainVoucher",
        complete: function (res) {
            if (res.success && res.data.length > 0) {
                $.each(res.data, function (ik, vk) {
                    if (vk.voucher.length > 0) {
                        let hasil_voucher = "";
                        $.each(vk.voucher, function (index, val) {
                            let voucher_price = HELPER.toRp(
                                parseFloat(val.voucher_value)
                            );
                            let bg_img =
                                "assets/images/pictures/bg-voucher.jpg";
                            if (val.voucher_image) {
                                bg_img =
                                    BASE_ASSETS +
                                    "voucher/" +
                                    val.voucher_image;
                            }
                            let total_poin_used = Math.ceil(
                                parseFloat(val.voucher_value) / KURS_POIN
                            );
                            hasil_voucher += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 280px;" onclick="onDetailVoucher('${
                                val.voucher_id
                            }')">
                                                    <div class="color-theme m-0 content-box voucher-card">
                                                        <div class="voucher-card-image" style="background-image: url(${bg_img});">
                                                            <div></div>
                                                        </div>
                                                        <div class="voucher-card-body color-custom-black">
                                                            <p class="m-0 lh-20 font-13">${HELPER.nullConverter(
                                                                HELPER.ucwords(
                                                                    val.voucher_name
                                                                ),
                                                                "-"
                                                            )}</p>
                                                            <div class="font-15">
                                                                <i class="fa fa-heart color-highlight"></i> <span class="bold">Rp ${voucher_price} <span class="font-11">(${total_poin_used} Poin)</span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
                            if (
                                vk.voucher.length >= 1 &&
                                vk.voucher.length - 1 == index
                            ) {
                                hasil_voucher += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 204px;height:204px;" onclick="loadVoucherOther('${vk.voucher_kategori_id}', '${vk.voucher_kategori_name}')">
                                                    <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                                        <div class="voucher-card-body color-custom-black text-center">
                                                            <i class="fa fa-angle-right fa-3x text-center"></i>
                                                            <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                                        </div>
                                                    </div>
                                                </div>`;
                            }
                        });
                        let hasil = `
                            <div class="bykategori bottom-20">
                                <h3 class="color-custom-dark">${vk.voucher_kategori_name}</h3>
                                <div class="owl-carousel owl-no-dots show-voucher-list">
                                    ${hasil_voucher}
                                </div>
                            </div>
                        `;
                        $(".list-voucher").append(hasil);
                        setTimeout(function () {
                            $(".show-voucher-list").owlCarousel({
                                dots: false,
                                loop: false,
                                margin: 20,
                                nav: false,
                                lazyLoad: true,
                                items: 2,
                                autoWidth: true,
                                autoplay: false,
                                stagePadding: 20,
                            });
                        }, 300);
                    }
                });
            } else {
                $(".list-voucher")
                    .html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Segera Hadir Untuk Anda!.</h3>
                                            </div>
                                        </div>`);
            }
            setTimeout(function () {
                $(".list-voucher").show();
                HELPER.unblock(500);
            }, 1000);
        },
    });
}

function onDetailVoucher(voucher_id) {
    HELPER.setItem("detail_my_poin", MY_POIN);
    HELPER.setItem("detail_kurs_poin", KURS_POIN);
    HELPER.setItem("detail_voucher_id", voucher_id);
    HELPER.setItem("from_page", "voucher");
    setTimeout(function () {
        onPage("voucher-detail");
    }, 300);
}

function loadVoucherOther(voucher_kategori_id, voucher_kategori_name) {
    $(".load-list-voucher").html("");
    $(".load-kategori-name").text(voucher_kategori_name);
    $("#btn-load-voucher").click();
    HELPER.initLoadMore({
        perPage: 20,
        urlExist: BASE_URL + "Voucher/loadVoucherByKategoriExist",
        dataExist: {
            voucher_kategori_id: voucher_kategori_id,
        },
        urlMore: BASE_URL + "Voucher/loadVoucherByKategoriMore",
        dataMore: {
            voucher_kategori_id: voucher_kategori_id,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $(".load-list-voucher")
                    .html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Segera Hadir Untuk Anda!.</h3>
                                                </div>
                                            </div>`);
                $("#btn-more-load-voucher").hide();
            } else {
                $("#btn-more-load-voucher").show();
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue();
            myQueue
                .enqueue(function (next) {
                    HELPER.block();
                    next();
                }, "1")
                .enqueue(function (next) {
                    var data_riwayat = $.parseJSON(data.responseText);
                    $.each(data_riwayat.data, function (i, v) {
                        let voucher_price = HELPER.toRp(
                            parseFloat(v.voucher_value)
                        );
                        let bg_img = "assets/images/pictures/bg-voucher.jpg";
                        if (v.voucher_image) {
                            bg_img = BASE_ASSETS + "voucher/" + v.voucher_image;
                        }
                        let total_poin_used = Math.ceil(
                            parseFloat(v.voucher_value) / KURS_POIN
                        );
                        $(".load-list-voucher").append(`
                        <div class="content-boxed content-box p-0 voucher-card shadow-small show-overlay-list" onclick="onDetailVoucher('${
                            v.voucher_id
                        }')">
                            <div class="voucher-card-image" style="background-image: url(${bg_img});">
                                <div></div>
                            </div>
                            <div class="voucher-card-body color-custom-black">
                                <p class="m-0 lh-20 font-15">${HELPER.nullConverter(
                                    HELPER.ucwords(v.voucher_name),
                                    "-"
                                )}</p>
                                <div class="font-18">
                                    <i class="fa fa-heart color-highlight"></i> Rp ${voucher_price} <span class="font-11">(${total_poin_used} Poin)</span>
                                </div>
                            </div>
                        </div>
                    `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-load-voucher").off();
            setTimeout(function () {
                $("#btn-more-load-voucher")
                    .off("click")
                    .on("click", function () {
                        HELPER.block();
                        callLoadMore();
                    });
            }, 500);
        },
        callbackEnd: function () {
            $("#btn-more-load-voucher").hide();
            $("#btn-more-load-voucher").off("click");
        },
    });
}
