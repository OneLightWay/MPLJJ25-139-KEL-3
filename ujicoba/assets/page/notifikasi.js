$(function () {
    // var hasil = `
    //     <a href="javascript:void(0)" id="card_pt_detail_${v.pt_detail_id}" style="padding-left:0px;">
    //         <div class="row">
    //             <img src="${icon_fase}" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;">
    //             <span style="padding-left:20px;">${tgl_from} - ${tgl_to}</span>
    //             <p style="padding-left:55px;padding-right: 15px;">${HELPER.nullConverter(v.fase_detail_nama)}</p>
    //             ${is_done}
    //             <i class="fa fa-angle-right"></i>
    //         </div>
    //     </a>
    // `;
    $(".back-btn").off("click");
    if (checkIsPetani()) {
        $(".btn-back")
            .off("click")
            .on("click", () => {
                onPage("main");
            });
    } else if (checkIsSales()) {
        $(".btn-back")
            .off("click")
            .on("click", () => {
                onPage("main-sales");
            });
    } else if (checkIsKios()) {
        $(".btn-back")
            .off("click")
            .on("click", () => {
                onPage("main-kios");
            });
    } else if (checkIsTrader()) {
        $(".btn-back")
            .off("click")
            .on("click", () => {
                onPage("main-trader");
            });
    } else if (checkIsPetugas()) {
        $(".btn-back")
            .off("click")
            .on("click", () => {
                onPage("main-qcs");
            });
    }
    loadNotifikasi();
});

function loadNotifikasi() {
    HELPER.block();
    $(".dt-list-notif").html("");
    HELPER.initLoadMore({
        perPage: 20,
        urlExist: BASE_URL + "Main/notifExist",
        dataExist: {
            id: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Main/notifMore",
        dataMore: {
            id: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $(".dt-list-notif")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                <div class="not-found">
                                    <div></div>
                                    <h3 class bhsConf-no_histori>No data available.</h3>
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
                    var data_notif = $.parseJSON(data.responseText);
                    $.each(data_notif.data, function (i, v) {
                        var tanggal = moment(v.user_notif_created_at).format(
                            "D MMM YY"
                        );
                        if (
                            moment(v.user_notif_created_at).isSame(
                                moment(),
                                "day"
                            )
                        ) {
                            var tanggal = moment(
                                v.user_notif_created_at
                            ).format("hh.mm");
                        }
                        style = "";
                        if (v.user_notif_read_at) {
                            style = "color: #a2a2a2;";
                        }
                        $(".dt-list-notif").append(`
                             <a class="show-overlay-list" href="javascript:void(0)" id="card_detail_${
                                 v.user_notif_id
                             }" style="padding-left:0px;">
                                 <div style="display:flex;">
                                    <div style="margin-right:auto;">
                                        <div style="display:flex;">
                                            <span style="padding-left:20px;${style}">${v.user_notif_title}</span>
                                            <span style="padding-left:5px;font-size:9px;color:#a2a2a2;width:max-content;">${tanggal}</span>
                                        </div>
                                        <p style="padding-left:20px;padding-right: 15px;">${HELPER.text_truncate(
                                            HELPER.nullConverter(
                                                v.user_notif_body
                                            ),
                                            75
                                        )}</p>
                                     </div>
                                     <div style="margin-right:20px;">
                                        <i class="fa fa-angle-right mt-8"></i>
                                     </div>
                                 </div>
                             </a>
                            `);

                        $("#card_detail_" + v.user_notif_id).off("click");
                        setTimeout(function () {
                            $("#card_detail_" + v.user_notif_id).on(
                                "click",
                                function (event) {
                                    onReadNotif(v.user_notif_id);
                                    if (v.user_notif_type =="approval-sahabat-nk") {
                                        onPage("detail-notifikasi-sahabat");
                                        HELPER.setItem(
                                            "user_notif_id",
                                            v.user_notif_id
                                        );
                                    }else if(v.user_notif_type =="reject-sahabat-nk"){
                                        onPage("detail-notifikasi-sahabat");
                                        HELPER.setItem(
                                            "user_notif_id",
                                            v.user_notif_id
                                        );
                                    } else if (v.user_notif_type == "pemenang-undian") {
                                        HELPER.setItem(
                                            "from_page",
                                            "notifikasi"
                                        );
                                        onPage("undian-detail");
                                        HELPER.setItem(
                                            "history_kupon_detail_id",
                                            v.user_notif_source_id
                                        );
                                    } else {
                                        onPage("detail-notifikasi");
                                        HELPER.setItem(
                                            "user_notif_id",
                                            v.user_notif_id
                                        );
                                    }
                                }
                            );
                        }, 200);
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

function onReadNotif(id) {
    HELPER.ajax({
        url: BASE_URL + "Main/readNotif",
        data: {
            id: id,
        },
        success: function (res) {},
    });
}
