var KURS_POIN = 0;
var MY_POIN = 0;
var TUKAR_KUPON = 0;
var SUBTOTAL = 0;
$(function () {
    loadPoin();
    // $(".show-end-year").text(moment().format("YYYY"));
    loadHistroyKupon();
    loadAllKupon();
    $(".header-banner").css(
        "background-image",
        `url(${BASE_ASSETS}undian_kupon/banner_conf/${HELPER.getItem(
            "banner_special_program"
        )})`
    );
    showDivSnk();
    loadConfig()
});

function loadConfig() {
    HELPER.ajax({
        url: BASE_URL + "Voucher/loadConfig",
        complete: function (res) {
            $.each(res.data, function (iData, vData) {
                if (iData == "reset_poin") {
                    if (vData[0].conf_value == "end_year" || vData[1].conf_value == "end_year") {
                        var dateEndYear = moment().format('YYYY')+"-12-31";
                        $('.show-end-year').text(moment(dateEndYear).format('DD MMMM YYYY'));
                    } else {
                        if (vData[0].conf_value == "end_date") {
                            $('.show-end-year').text(moment(vData[1].conf_value, "DD-MM-YYYY").format('DD MMMM YYYY'));
                        } else {
                            $('.show-end-year').text(moment(vData[0].conf_value, "DD-MM-YYYY").format('DD MMMM YYYY'));
                        }
                    }
                }
            });
        },
    });
}

function loadPoin() {
    HELPER.ajax({
        url: BASE_URL + "Kupon/totalPoin",
        data: { id: HELPER.getItem("user_id") },
        complete: function (res) {
            KURS_POIN = parseFloat(res.kurs_poin);
            MY_POIN = parseInt(res.user_total_poin);
            $(".user-poin").text(HELPER.nullConverter(res.user_total_poin, 0));
            $(".user-kupon").text(
                HELPER.nullConverter(res.user_total_kupon, 0)
            );
        },
    });
}

function resetTukar() {
    $(".list_kupon").empty();
    TUKAR_KUPON = 0;
    $(".total_tukar").text(0);
    $(".subtotal_poin").text(0);
}

function changeKupon(n) {
    let total = (TUKAR_KUPON + n) * KURS_POIN;
    if (total >= 0) {
        TUKAR_KUPON += n;
        $(".total_tukar").text(TUKAR_KUPON);
        $(".subtotal_poin").text(total);
        if (total > MY_POIN) {
            $(".msg-poin").show();
        } else {
            $(".msg-poin").hide();
        }
    }
}

function submitTukar() {
    if (TUKAR_KUPON * KURS_POIN <= MY_POIN && TUKAR_KUPON > 0) {
        HELPER.ajax({
            url: BASE_URL + "Kupon/tukarKupon",
            data: { id: HELPER.getItem("user_id"), total_kupon: TUKAR_KUPON },
            complete: function (res) {
                if (res.success) {
                    onPage("kupon");
                    HELPER.showMessage({
                        success: "info",
                        title: "Terima Kasih !!",
                        message: `Terima kasih sudah berpartisipasi di program spesial kami! Pengundian kupon akan dilakukan pada tanggal ${res.conf.conf_value}! Semoga Anda beruntung`,
                    });
                } else {
                    HELPER.showMessage({
                        success: "info",
                        title: "Info",
                        message: res.message,
                        callback: function () {
                            if(res.type=='sahabat'){
                                UserisPromote(null, false);
                            }
                        },
                    });
                }
            },
        });
    }
}

function loadHistroyKupon() {
    HELPER.block();
    $("#list_history_kupon").html("");
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Kupon/listHistoriKuponExist",
        dataExist: {
            user: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Kupon/listHistoriKuponMore",
        dataMore: {
            user: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list_history_kupon")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                  <div class="not-found">
                                                      <div></div>
                                                      <h3 class bhsConf-no_histori>No history available.</h3>
                                                  </div>
                                              </div>`);
                $("#btn-more-scan").hide();
            } else {
                $("#btn-more-scan").show();
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
                        var tanggal = moment(v.history_kupon_tanggal).format(
                            "DD MMMM YYYY"
                        );
                        if (v.history_kupon_tipe == 1) {
                            $("#list_history_kupon").append(`
                                <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-detail-${
                                    v.history_kupon_id
                                }" style="padding: 0px;border:solid;border-color:#33B368">
                                        <div class="row" style="padding: 10px 20px 10px 20px;background-color: #33B368;">
                                            <div class="col-auto right-10">
                                                <i class="fa fa-calendar-alt font-15" style="color:#e3f2e9;"></i>
                                            </div>
                                            <div class="col">
                                                <span  style="color:#e3f2e9;">${tanggal}</span>
                                            </div>
                                        </div>
                                    <div class="row" style="width: 100%;padding: 14px 20px 14px 20px;">
                                       <div class="col">
                                                <label style="font-weight: 300;font-size: 14px;">Total Kupon</label>
                                                <span class="color-custom-gray" style="font-weight: 700;font-size: 20px;">${HELPER.nullConverter(
                                                    v.history_kupon_total_kupon
                                                )}</span>
                                        </div>
                                        <div class="col">
                                                <label style="font-weight: 300;font-size: 14px;">Kurs</label>
                                                <span class="color-custom-gray" style="font-weight: 700;font-size: 20px;">${HELPER.nullConverter(
                                                    v.history_kupon_kurs
                                                )}</span>
                                        </div>
                                        <div class="col">
                                                <label style="font-weight: 300;font-size: 14px;">Poin</label>
                                                <span class="color-custom-gray" style="font-weight: 700;font-size: 20px;">
                                                ${
                                                    HELPER.nullConverter(
                                                        v.history_kupon_kurs
                                                    ) *
                                                    HELPER.nullConverter(
                                                        v.history_kupon_total_kupon
                                                    )
                                                }
                                                </span>
                                        </div>
                                    </div>
                                </div>
                            `);

                            $(".btn-detail-" + v.history_kupon_id).off("click");
                            setTimeout(function () {
                                $(".btn-detail-" + v.history_kupon_id).on(
                                    "click",
                                    function (event) {
                                        // onDetailHistory(v.history_kupon_id);
                                        loadKupon(v.history_kupon_id);
                                    }
                                );
                            }, 200);
                        } else if (v.history_kupon_tipe == 2) {
                            $("#list_history_kupon").append(`
                                <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-detail-${
                                    v.history_kupon_id
                                }" 
                                            style="padding: 0px;border:solid;border-color:#DA4453">
                                        <div class="row" style="padding: 10px 20px 10px 20px;background-color: #DA4453;">
                                            <div class="col-auto right-10">
                                                <i class="fa fa-calendar-alt font-15" style="color:#e3f2e9;"></i>
                                            </div>
                                            <div class="col">
                                                <span  style="color:#e3f2e9;">${tanggal}</span>
                                            </div>
                                        </div>
                                    <div class="row" style="width: 100%;padding: 14px 20px 14px 20px;">
                                        <div class="col">
                                                <label style="font-weight: 300;font-size: 14px;">Total Kupon</label>
                                                <span class="color-custom-gray" style="font-weight: 700;font-size: 20px;">- ${HELPER.nullConverter(
                                                    v.history_kupon_total_kupon
                                                )}</span>
                                        </div>
                                        <div class="col">
                                                <label style="font-weight: 300;font-size: 14px;">Keterangan</label>
                                                <span class="color-custom-gray" style="font-weight: 500;font-size: 12px;">${HELPER.nullConverter(
                                                    v.history_kupon_keterangan
                                                )}</span>
                                        </div>
                                    </div>
                                </div>
                            `);

                            $(".btn-detail-" + v.history_kupon_id).off("click");
                            if (!HELPER.isNull(v.history_kupon_kurs)) {
                                setTimeout(function () {
                                    $(".btn-detail-" + v.history_kupon_id).on(
                                        "click",
                                        async function (event) {
                                            // onDetailHistory(v.history_kupon_id);
                                            await HELPER.setItem(
                                                "history_kupon_detail_id",
                                                v.history_kupon_detail_id
                                            );
                                            onPage("undian-detail");
                                        }
                                    );
                                }, 200);
                            }
                        }
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    $(".show-blink").remove();
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-history")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-history").hide();
            $("#btn-more-history").off("click");
        },
    });
}

function loadAllKupon() {
    HELPER.block();
    $("#list-coupon").html("");
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Kupon/listAllKuponExist",
        dataExist: {
            user: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Kupon/listAllKuponMore",
        dataMore: {
            user: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list-coupon")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                  <div class="not-found">
                                                      <div></div>
                                                      <h3>Tidak ada Kupon yang tersedia.</h3>
                                                  </div>
                                              </div>`);
                $("#btn-more-coupon").hide();
            } else {
                $("#btn-more-coupon").show();
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
                    var data_kupon = $.parseJSON(data.responseText);
                    $.each(data_kupon.data, function (i, v) {
                        $("#list-coupon").append(`
                                <div class="content content-box content-boxed shadow-medium round-small left-0 right-0 bottom-10 show-overlay" style="padding: 0px;border:solid;border-color:#33B368">
                                    <div style="display: flex;flex-direction:column;width: 100%;background-color: #33B368;">
                                        <div class="shadow-large round-small mr-auto ml-auto top-10 bottom-5 bg-white" style="width: 70%;border:solid;border-color:#72727260;padding: 10px;text-align: center;">
                                            <span class="font-16" style="font-weight: 600;">${v.kupon_kode}</span>
                                        </div>
                                        <span class="mr-auto ml-auto font-16" style="color:#e3f2e9;font-weight: 600;">No. Kupon Anda</span>
                                        <div style="background-color: #005286;">
                                            <span class="font-10 left-10" style="color:#e3f2e9;"><span style="color: #FF0000;">*</span> Kupon digital dari poin yang Anda tukarkan</span>
                                        </div>
                                    </div>
                                </div>
                            `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    $(".show-blink").remove();
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-coupon")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-coupon").hide();
            $("#btn-more-coupon").off("click");
        },
    });
}

async function loadKupon(idd) {
    $("#list_kupon").html("");
    // var idd = HELPER.getItem('history_kupon_id');

    await HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Kupon/listKuponExist",
        dataExist: {
            id: idd,
        },
        urlMore: BASE_URL + "Kupon/listKuponMore",
        dataMore: {
            id: idd,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list_kupon")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                  <div class="not-found">
                                                      <div></div>
                                                      <h3>Kupon tidak ditemukan</h3>
                                                  </div>
                                              </div>`);
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
                    var data_kupon = $.parseJSON(data.responseText);
                    $.each(data_kupon.data, function (i, v) {
                        //     $("#list_kupon").append(`
                        //       <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay" style="background-color: #F1FFF0;padding:10px;">
                        //         <div class="row">
                        //             <div class="col-auto right-10">
                        //                 <i class="fa fa-circle" style="color:#2ECC71;"></i>
                        //             </div>
                        //             <div class="col">
                        //                 <span>Kode : ${HELPER.nullConverter(
                        //                     v.kupon_kode
                        //                 )}</span>
                        //             </div>
                        //         </div>
                        //       </div>
                        //   `);
                        $("#list_kupon").append(`
                                <div class="content content-box content-boxed shadow-medium round-small left-0 right-0 bottom-10 show-overlay" style="padding: 0px;border:solid;border-color:#33B368">
                                    <div style="display: flex;flex-direction:column;width: 100%;background-color: #33B368;">
                                        <div class="shadow-large round-small mr-auto ml-auto top-10 bottom-5 bg-white" style="width: 70%;border:solid;border-color:#72727260;padding: 10px;text-align: center;">
                                            <span class="font-16" style="font-weight: 600;">${HELPER.nullConverter(
                                                v.kupon_kode
                                            )}</span>
                                        </div>
                                        <span class="mr-auto ml-auto font-16" style="color:#e3f2e9;font-weight: 600;">No. Kupon Anda</span>
                                        <div style="background-color: #005286;">
                                            <span class="font-10 left-10" style="color:#e3f2e9;"><span style="color: #FF0000;">*</span> Kupon digital dari poin yang Anda tukarkan</span>
                                        </div>
                                    </div>
                                </div>
                            `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    $(".show-blink").remove();
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-kupon")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-kupon").hide();
            $("#btn-more-kupon").off("click");
        },
    });

    $("#btn-menu-kupon").trigger("click");
}

function onTukar() {
    if (HELPER.getItem("snk_kupon") == 1) {
        resetTukar();
        $("#btn-menu-tukar-kupon").trigger("click");
    } else {
        $("#btn-tukar-kupon-snk").trigger("click");
    }
}

function saveSnk() {
    if ($("#syarat_kupon").is(":checked")) {
        HELPER.setItem("snk_kupon", 1);
        resetTukar();
        setTimeout(() => {
            $("#btn-menu-tukar-kupon").trigger("click");
        }, 300);
    } else {
        HELPER.setItem("snk_kupon", 0);
    }
}

function openTab(item) {
    if (item == "coupon") {
        $(".tab-menu-coupon").css({
            color: "#33B368",
            "border-bottom": "solid",
        });
        $(".tab-menu-history").css({
            color: "#73777B",
            "border-bottom": "none",
        });
        $(".tab-item-coupon").show();
        $(".tab-item-history").hide();
    } else if (item == "history") {
        $(".tab-menu-coupon").css({
            color: "#73777B",
            "border-bottom": "none",
        });
        $(".tab-menu-history").css({
            color: "#33B368",
            "border-bottom": "solid",
        });
        $(".tab-item-coupon").hide();
        $(".tab-item-history").show();
    }
}

function showDivSnk() {
    HELPER.ajax({
        url: BASE_URL + "Kupon/showSnkKupon",
        type: "POST",
        complete: function (res) {
            var decode = atob(res.html);
            $("#div-show-snk-kupon").html(decode);
        },
    });
}
