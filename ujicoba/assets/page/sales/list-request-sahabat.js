$(function () {
    listRequestSahabat();
    listHistorySahabat();
});

function listRequestSahabat() {
    $("#list-request-sahabat").html("");
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + "Sahabat/listReqSahabatExist",
        dataExist: {
            user_id: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Sahabat/listReqSahabatMore",
        dataMore: {
            user_id: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list-request-sahabat")
                    .html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada data.</h3>
                                                </div>
                                            </div>`);
                $("#btn-more-approval-req").hide();
            } else {
                $("#btn-more-approval-req").show();
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
                    var data_req = $.parseJSON(data.responseText);
                    $.each(data_req.data, function (i, v) {
                        var img = "assets/images/avatars/6s.png";
                        if (v.user_foto) {
                            if (v.user_foto.indexOf("http") >= 0) {
                                img = v.user_foto;
                            } else {
                                img =
                                    BASE_ASSETS + "user_mobile/" + v.user_foto;
                            }
                        }
                        $("#list-request-sahabat").append(`
                        <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailRequest('${
                            v.request_sahabat_id
                        }')">
                            <div class="caption-center left-20">
                                <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Sales Photo" style="width: 60px; height: 60px;">
                            </div>
                            <div class="caption-center left-90">
                                <div class="right-30">
                                    <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(
                                        v.user_nama
                                    )}</h1>
                                </div>
                                <label class="font-12">${
                                    v.farmer_sales_distance
                                } KM</label>
                            </div>
                            <div class="caption-center">
                                <div class="float-right">
                                    <label class="right-15">${moment(
                                        v.request_sahabat_created_at
                                    ).format("DD-MM-YYYY")}</label>
                                    <div style="display: block;">
                                        <div class="right-15 float-right"><i class="fa fa-angle-right fa-lg"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    setTimeout(function () {
                        setLangApp();
                    }, 500);
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-request-sahabat")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-request-sahabat").hide();
            $("#btn-more-request-sahabat").off("click");
        },
    });
}

function listHistorySahabat() {
    $("#list-history-sahabat").html("");
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + "Sahabat/listHistoryExist",
        dataExist: {
            user_id: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Sahabat/listHistoryMore",
        dataMore: {
            user_id: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list-history-sahabat")
                    .html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada data.</h3>
                                                </div>
                                            </div>`);
                $("#btn-more-approval-req").hide();
            } else {
                $("#btn-more-approval-req").show();
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
                    var data_req = $.parseJSON(data.responseText);
                    $.each(data_req.data, function (i, v) {
                        var img = "assets/images/avatars/6s.png";
                        if (v.user_foto) {
                            if (v.user_foto.indexOf("http") >= 0) {
                                img = v.user_foto;
                            } else {
                                img =
                                    BASE_ASSETS + "user_mobile/" + v.user_foto;
                            }
                        }
                        let status;
                        let color;
                        if (v.request_sahabat_acc_status == 2) {
                            status = "Ditolak";
                            color = "#EE5662";
                        } else if (v.request_sahabat_acc_status == 3) {
                            status = "Diterima";
                            color = "#33B368";
                        }
                        $("#list-history-sahabat").append(`
                        <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailRequest('${
                            v.request_sahabat_id
                        }')">
                            <div class="caption-center left-20">
                                <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Sales Photo" style="width: 60px; height: 60px;">
                            </div>
                            <div class="caption-center left-90">
                                <div class="right-30">
                                    <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.text_truncate(
                                        v.user_nama,
                                        15
                                    )}</h1>
                                </div>
                                <label class="font-12" style="color:${color};">${status}</label>
                            </div>
                            <div class="caption-center">
                                <div class="float-right">
                                    <label class="right-15">${moment(
                                        v.request_sahabat_created_at
                                    ).format("DD-MM-YYYY")}</label>
                                    <div style="display: block;">
                                        <div class="right-15 float-right"><i class="fa fa-angle-right fa-lg"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    setTimeout(function () {
                        setLangApp();
                    }, 500);
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-history-sahabat")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-history-sahabat").hide();
            $("#btn-more-history-sahabat").off("click");
        },
    });
}

function onDetailRequest(request_sahabat_id) {
    HELPER.setItem("request_sahabat_id", request_sahabat_id);
    setTimeout(function () {
        onPage("detail-request-sahabat");
    }, 100);
}

function onBackTable() {
    listRequestSahabat();
    HELPER.toggleForm({
        tohide: "form-detail-request",
        toshow: "table-data-request",
    });
}

function openTab(item) {
    if (item == "new") {
        $(".tab-menu-new").css({ color: "#33B368", "border-bottom": "solid" });
        $(".tab-menu-history").css({
            color: "#73777B",
            "border-bottom": "none",
        });
        $(".tab-item-new").show();
        $(".tab-item-history").hide();
    } else if (item == "history") {
        $(".tab-menu-new").css({ color: "#73777B", "border-bottom": "none" });
        $(".tab-menu-history").css({
            color: "#33B368",
            "border-bottom": "solid",
        });
        $(".tab-item-new").hide();
        $(".tab-item-history").show();
    }
}
