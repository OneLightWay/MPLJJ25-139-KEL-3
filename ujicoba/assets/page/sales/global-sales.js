$(() => {
    totalRequestMain();
});
function onSamplingSales() {
    scanOpen(function (result) {
        cekSamplingSales(result)
    }, function (error) {
        HELPER.showMessage({
            title: 'Gagal !!',
            message: "Scanning failed: " + error
        })
    })
    /* cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                cekSamplingSales(result.text)
            }
        },
        function (error) {
            HELPER.showMessage({
                title: 'Gagal !!',
                message: "Scanning failed: " + error
            })
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : false, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Letakkan qrcode pada area pindai", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    ); */
}

function cekSamplingSales(text) {
    HELPER.block();
    HELPER.ajax({
        url: BASE_URL + "Scan/sampling",
        data: {
            user_id: HELPER.getItem("user_id"),
            qrcode: text,
        },
        success: function (res) {
            HELPER.unblock();
            if (res.success) {
                HELPER.showMessage({
                    success: res.data.pouch_status == 1 ? true : "info",
                    title:
                        res.data.pouch_status == 1
                            ? "Scan Berhasil!"
                            : "Pouch Tidak Aktif",
                    message:
                        res.data.pouch_status == 1
                            ? "Produk terdaftar!"
                            : "QR Code Anda terdaftar, namun QR Code sudah di Scan oleh petani. Mohon cek keaslian produk Anda",
                    callback: function () {
                        $("#btn-scan-choose").click();
                    },
                });
                if (
                    res.data.type == "pouch" &&
                    res.data.pouch_qr_code.indexOf("http") >= 0
                ) {
                    HELPER.block();
                    $("#btn-choose-scan-app").off("click");
                    $("#btn-choose-scan-browser").off("click");
                    setTimeout(function () {
                        $("#btn-choose-scan-app").on("click", function (e) {
                            HELPER.unblock();
                            HELPER.setItem(
                                "detail_scan",
                                JSON.stringify(res.data)
                            );
                            setTimeout(function () {
                                onPage("detail-scan");
                            }, 100);
                        });
                        $("#btn-choose-scan-browser").on("click", function (e) {
                            HELPER.unblock();
                            window.open(res.data.pouch_link);
                        });
                    }, 500);
                } else {
                    HELPER.setItem("detail_scan", JSON.stringify(res.data));
                    setTimeout(function () {
                        onPage("detail-scan");
                    }, 100);
                }
            } else {
                showFailedScan(res.message, false, text, res.type, false);
            }
        },
        error: function (err) {
            HELPER.unblock();
            HELPER.showMessage({
                success: false,
                title: "Failed !",
                message: "Oops, terjadi kesalahan teknis.",
            });
        },
    });
}

function loadConfig() {
    var detailScanReaderAkumulation = 0;
    var detailScanReader;
    HELPER.ajax({
        url: BASE_URL + "Main/loadConfig",
        complete: function (res) {
            var configMaster = JSON.stringify(res.master_label);
            var configSett = JSON.stringify(res.sett_label);
            HELPER.setItem("configMaster", configMaster);
            HELPER.setItem("configSett", configSett);
            $.each(res.sett_data_scan, function (i, v) {
                if (v.conf_code == "sett_data_scan_aktual") {
                    if (v.conf_value == 1) {
                        HELPER.setItem("configSettDataScanAktual", 1);
                    } else {
                        HELPER.setItem("configSettDataScanAktual", 0);
                    }
                } else {
                    if (
                        v.conf_code == "sett_data_scan_read_synegnta" &&
                        v.conf_value == 1
                    ) {
                        // $('.show_'+v.conf_code).hide()
                        detailScanReaderAkumulation =
                            detailScanReaderAkumulation + 1;
                        detailScanReader = v.conf_code;
                    } else if (
                        v.conf_code == "sett_data_scan_read_simperbenih" &&
                        v.conf_value == 1
                    ) {
                        // $('.show_'+v.conf_code).show()
                        detailScanReaderAkumulation =
                            detailScanReaderAkumulation + 1;
                        detailScanReader = v.conf_code;
                    }
                }
            });
            HELPER.setItem("configSettScanReader", detailScanReader);
            HELPER.setItem("configSettScanReaderAkumulation", 2);
        },
    });
}

function totalRequestMain() {
    HELPER.ajax({
        url: BASE_URL + "Sahabat/countRequest",
        data: { user_id: HELPER.getItem("user_id") },
        complete: function (res) {
            if (res.jumlah_request > 0) {
                $(".sales-req-sahabat").text(res.jumlah_request);
            }
        },
    });
}
