$(function () {
    $(".input_password").off();
    loadAkun();
    avgStar();
    try {
        cordova.getAppVersion.getVersionNumber().then(function (versionNow) {
            $("#show_version_app").text(versionNow);
        });
    } catch (e) {
        console.log(e);
    }
});

function loadAkun() {
    $(".user-name").text(HELPER.getItem("user_nama"));
    $(".user-jabatan").text(HELPER.ucwords(HELPER.getItem("jabatan_name")));
    $(".tanggal-now").text(moment().locale("id").format("dddd, DD MMMM YYYY"));
    if (!HELPER.isNull(HELPER.getItem("user_foto"))) {
        $(".user-foto").attr(
            "src",
            BASE_ASSETS + "user/thumbs/" + HELPER.getItem("user_foto")
        );
    }
}

function onChangeLanguage() {
    if (
        HELPER.getItem("user_language") == 0 ||
        HELPER.getItem("user_language") == null
    ) {
        $(".LanguegeCheckIdn").html(
            `<i class="fa fa-check" aria-hidden="true"></i>`
        );
        $(".LanguegeCheckEn").html(``);
    } else {
        $(".LanguegeCheckIdn").html(``);
        $(".LanguegeCheckEn").html(
            `<i class="fa fa-check" aria-hidden="true"></i>`
        );
    }

    $(".language-modal").click();
}

function changeLanguage(setLang) {
    if (setLang == 0) {
        var title = "Change Language";
        var message = "Are you sure to change the language setting ?";
    } else {
        var title = "Ubah Bahasa";
        var message = "Apakah anda yakin ingin mengubah settingan bahasa ?";
    }
    HELPER.confirm({
        title: title,
        message: message,
        type: "warning",
        callback: function (success, id, record, message) {
            if (success) {
                HELPER.ajax({
                    url: BASE_URL + "Akun/changeLanguage",
                    data: { id: HELPER.getItem("user_id"), language: setLang },
                    type: "POST",
                    dataType: "JSON",
                    complete: function (data) {
                        HELPER.showMessage({
                            title: "Success!",
                            message: "Data updated successfully",
                            success: true,
                        });
                        HELPER.setItem("user_language", setLang);
                        setLangApp();

                        if (setLang == 0) {
                            moment.locale("id");
                            $(".LanguegeCheckIdn").html(
                                `<i class="fa fa-check" aria-hidden="true"></i>`
                            );
                            $(".LanguegeCheckEn").html(``);
                        } else {
                            moment.locale("en");
                            $(".LanguegeCheckIdn").html(``);
                            $(".LanguegeCheckEn").html(
                                `<i class="fa fa-check" aria-hidden="true"></i>`
                            );
                        }

                        $(".btn_close_language").click();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        HELPER.showMessage();
                    },
                });
            }
        },
    });
}

function onChangePassword() {
    $(".input_password").off();
    setTimeout(function () {
        $(".input_password_baru").on("keyup focusout", function () {
            $(".error-password-miss-match").remove();
            if (
                $("#password_baru").val() != "" &&
                $("#password_baru_confirm").val() != "" &&
                $("#password_baru_confirm").val() ==
                    $("#password_baru").val() &&
                $("#password_baru").val().length >= 8 &&
                $("#password_baru_confirm").val().length >= 8
            ) {
                $(".input_password_baru")
                    .parent()
                    .find("em")
                    .html('<i class="fa fa-check color-green1-dark"></i>');
            } else {
                $(".input_password_baru")
                    .parent()
                    .find("em")
                    .html(
                        '<i class="fa fa-exclamation-triangle color-red2-light"></i>'
                    );
                $("#password_baru_confirm").after(
                    '<b class="font-10 error-invalid color-red2-light error-password-miss-match">Password not match</b>'
                );
            }
        });
    }, 200);
    $(".btn-menu-ubah-password").click();
}

function changePassword() {
    if (
        $("#password_lama").val() != "" &&
        $("#password_baru").val() != "" &&
        $("#password_baru_confirm") != ""
    ) {
        if ($("#password_baru_confirm").val() == $("#password_baru").val()) {
            HELPER.block();
            HELPER.ajax({
                url: BASE_URL + "AkunSales/changePassword",
                data: {
                    user: HELPER.getItem("user_id"),
                    old: $("#password_lama").val(),
                    new: $("#password_baru").val(),
                },
                complete: function (res) {
                    HELPER.unblock();
                    HELPER.showMessage({
                        success: res.success,
                        message: res.message,
                        allowOutsideClick: false,
                        callback: function () {
                            onPage("akun-sales");
                        },
                    });
                },
                error: function () {
                    HELPER.unblock();
                    HELPER.showMessage({
                        title: "Perhatian",
                        message: "Oops, terjadi kesalahan teknis.",
                    });
                },
            });
        } else {
            HELPER.showMessage({
                title: "Data Belum Lengkap",
                message: "Password confirm tidak cocok !",
                allowOutsideClick: false,
                callback: function (arg) {
                    $(".btn-menu-ubah-password").click();
                },
            });
        }
    } else {
        HELPER.showMessage({
            title: "Data Belum Lengkap",
            message: "Pastikan semua inputan terisi !",
            allowOutsideClick: false,
            callback: function (arg) {
                $(".btn-menu-ubah-password").click();
            },
        });
    }
}

function downloadPanduan() {
    var url = BASE_ASSETS + "manbook/manbook-syngenta-fase2.pdf";
    window.location.href = url;
}

function downloadGuideDokter() {
    var url = BASE_ASSETS + "manbook/dokter-nk-for-sales.pdf";
    window.location.href = url;
}

function onRefreshData() {
    HELPER.block();
    HELPER.ajax({
        url: BASE_URL + "Akun/readNonPetani",
        data: {
            user_id: HELPER.getItem("user_id"),
        },
        complete: function (res) {
            HELPER.unblock();
            $.each(res, function (i, v) {
                window.localStorage.setItem(i, v);
            });
            setTimeout(function () {
                onPage("main-sales");
            }, 300);
        },
        error: function () {
            HELPER.unblock();
            HELPER.showMessage({
                message: "Oops, terjadi kesalahan teknis.",
            });
        },
    });
}
/*function checkUpdate() {
	$.get(BASE_URL + 'Main/versionCheck', r => {
		
        var fileTransfer = new FileTransfer();
        fileTransfer.onprogress = function (progressEvent) {
            console.log((progressEvent.loaded / progressEvent.total) * 100, "%");
            var prog = parseFloat((progressEvent.loaded / progressEvent.total)*100).toFixed(2);
            $('#progress-update').css('width',`${prog}%`);
            $("#progress-update").next().html(`${prog}% - Progress Download`);
        };
        var uri = encodeURI('https://smscrops.com/apks/SMSCrops-latest.apk');
        var fileURL = cordova.file.externalDataDirectory + 'SMSCrops-latest.apk';

        fileTransfer.download(
            uri,
            fileURL,
            function (entry) {
                console.log("download complete: " + entry.toURL());
                cordova.plugins.exit();
                cordova.plugins.fileOpener2.open(
                    entry.toURL(),
                    'application/vnd.android.package-archive',
                    {
                        error: function (e) {
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success: function () {
                            console.log('file opened successfully');
                        }
                    }
                )
            },
            function (error) {
                console.log(error);
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
        );

    })
}*/

function avgStar() {
    HELPER.ajax({
        url: BASE_URL + "AkunSales/avgStar",
        data: {
            user_id: HELPER.getItem("user_id"),
        },
        complete: function (res) {
            if (!res.hasOwnProperty("success")) {
                $("#avg-star").text(Number(res).toFixed(1));
            }
        },
    });
}
