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
        if (checkIsPetani()) {
            if (
                res.notif_manual &&
                res.notif_manual.notif_manual_is_linked == 1
            ) {
                page = switchPage(res.notif_manual.notif_manual_link_fitur);
                if (res.notif_manual.notif_manual_is_direct == 1) {
                    HELPER.setItem('notif_manual_ref_id', res.notif_manual.notif_manual_link_fitur_ref_id)
                    setTimeout(() => {
                        onPage(page[0]);
                    }, 500);
                } else if (res.notif_manual.notif_manual_is_direct == 0) {
                    $("#btn-link").html(`Menuju Halaman ${page[1]}`);
                    $("#btn-link").off("click");
                    $("#btn-link").on("click", () => {
                        onPage(page[0]);
                    });
                    $("#btn-link").show();
                }
            } else {
                if (res.user_notif_type == 'poin') {
                    $("#btn-link").html(`Lihat Poin`);
                    $("#btn-link").off("click");
                    $("#btn-link").on("click", () => {
                        onPage('voucher');
                    });
                    $("#btn-link").show()
                }
                else if (res.user_notif_type == 'notif-feedback-follup') {
                    HELPER.setItem('feedback_detail_sales_id', res.user_notif_source_id);
                    $("#btn-link").html(`Detail Feedback`);
                    $("#btn-link").off("click");

                    $("#btn-link").on("click", () => {
                        onPage('customer-feedback-detail');
                    });
                    $("#btn-link").show();
                }
                else {
                    $("#btn-link").hide();
                }
            }
        }
        else if (checkIsSales()) { 
            // tambahan kondisi jika user sales
            if (res.user_notif_type == 'notif-customer-feedback') {
                HELPER.setItem('feedback_detail_sales_id', res.user_notif_source_id);
                $("#btn-link").html(`Detail Feedback`);
                $("#btn-link").off("click");

                $("#btn-link").on("click", () => {
                    onPage('feedback-detail-sales');
                });
                $("#btn-link").show();
            }
        }
        else {
            page = switchPageNotPetani(res.user_notif_type);
            if (page) {
                onPage(page);
            }
        }

        HELPER.removeItem(["user_notif_id"]);
        HELPER.removeItem(["user_notif_source_id"]);
    });
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
                if (res.notif_manual) {
                    $(".detail-notif_manual_content").html(
                        HELPER.nullConverter(
                            atob(res.notif_manual.notif_manual_content)
                        )
                    );
                    // notif_manual = res.notif_manual;
                }
                resolve(res);
            },
            error: function (error) {
                HELPER.removeItem(["user_notif_id"]);
                HELPER.removeItem(["user_notif_source_id"]);
            },
        });
    });
}

function switchPage(key) {
    switch (key) {
        case "cuaca":
            return ["cuaca", "Cuaca"];
            break;
        case "artikel":
            return ["informasi", "Artikel"];
            break;
        case "lahan":
            return ["lokasi-lahan", "Lahan"];
            break;
        case "jadwal":
            return ["jadwal-kalendar", "Jadwal"];
            break;
        case "budidaya":
            return ["budidaya", "Budidaya"];
            break;
        case "aut":
            return ["petani-roi", "AUT"];
            break;
        case "produk":
            return ["rekomendasi-produk", "Produk"];
            break;
        case "kalkulator_benih":
            return ["kalkulasi-kebutuhan-benih", "Kalkulator Benih"];
            break;
        case "kalkulator_pupuk":
            return ["kalkulasi-dosis-pupuk", "Kalkulator Pupuk"];
            break;
        case "kalkulator_hpt":
            return ["hpt-hamatanaman", "Kalkulator HPT"];
            break;
        case "daftar_trader":
            return ["list-trader", "Daftar Trader"];
            break;
        case "daftar_kios":
            return ["list-kios", "Daftar Kios"];
            break;
        case "scan":
            return ["history-scan-farmer", "Scan"];
            break;
        case "poin":
            return ["voucher", "Voucher"];
            break;
        case "nearby":
            return ["sales-wilayah", "Sales Terdekat"];
            break;
        default:
            return ["main", "Beranda"];
            break;
    }
}

function switchPageNotPetani(key) {
    switch (key) {
        case "request-sahabat-nk":
            return "list-request-sahabat";
            break;
        case "sales-acc":
            return "sales-req-login";
        default:
            break;
    }
}