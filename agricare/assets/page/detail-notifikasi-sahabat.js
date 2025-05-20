$(() => {
    init();
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
});

function init() {
    id = HELPER.getItem("user_notif_id")
        ? HELPER.getItem("user_notif_id")
        : HELPER.getItem("user_notif_source_id");
    onDetailNotif(id).then((res) => {
        readSahabatReject(res.user_notif_source_id);
    });
    HELPER.removeItem(["user_notif_id"]);
    HELPER.removeItem(["user_notif_source_id"]);
}

function onDetailNotif(idd) {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Main/readNotif",
            data: { id: idd },
            success: function (res) {
                if (res.user_notif_img) {
                    $(".detail-notif_img").show();
                    $(".detail-notif_img").attr("src", res.user_notif_img);
                } else {
                    $(".detail-notif_img").hide();
                }
                $(".detail-user_notif_title").text(
                    HELPER.nullConverter(res.user_notif_title)
                );
                $(".detail-user_notif_body").text(
                    HELPER.nullConverter(res.user_notif_body)
                );
                $(".detail-user_notif_created_at").text(
                    moment(res.user_notif_created_at).format(
                        "DD MMMM YYYY HH.mm"
                    )
                );
                resolve(res);
            },
            error: function (error) {
                HELPER.removeItem(["user_notif_id"]);
                HELPER.removeItem(["user_notif_source_id"]);
            },
        });
    });
}

function readSahabatReject(idd) {
    HELPER.ajax({
        url: BASE_URL + "Sahabat/readRequestSahabat",
        data: { id: idd },
        success: function (res) {
            if(res.request_sahabat_acc_status=="2"){
                $('#btn-link').text('Ajukan Kembali')
                $('#btn-link').show()
                $('.req_penolakan').show()
                $(".detail-reject_reason").text(
                    res.request_sahabat_acc_description
                );
            }else if(res.request_sahabat_acc_status=="3"){
                $('#btn-link').text('Lihat Kartu')
                $('#btn-link').show()
                $('.req_penolakan').hide()
            }else{
                $('#btn-link').hide()
                $('.req_penolakan').hide()
            }
        },
        error: function (error) {},
    });
}