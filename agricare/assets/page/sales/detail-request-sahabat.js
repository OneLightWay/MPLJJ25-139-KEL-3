$(function () {
    setTimeout(() => {
        onDetailRequest(HELPER.getItem("request_sahabat_id"));
    }, 200);
});

function onDetailRequest(request_sahabat_id) {
    $("#list-lahan").empty();
    total_luas_lahan = 0;
    HELPER.ajax({
        url: BASE_URL + "Sahabat/readRequest",
        data: { id: request_sahabat_id },
        success: function (res) {
            if(res.request_sahabat_acc_status==2||res.request_sahabat_acc_status==3){
                $('.btn-aksi').hide()
            }

            if(res.user_foto){
                if (res.user_foto.indexOf("http") >= 0) {
                    img = res.user_foto;
                } else {
                    img =BASE_ASSETS + "user_mobile/" + res.user_foto;
                }
                $('#foto-petani').attr('src', img)
            }
            $("#request_sahabat_id").val(request_sahabat_id);
            $(".show-farmer-nik").text(res.request_sahabat_nik);
            $(".show-farmer-name").text(res.user_nama);
            $(".show-farmer-distance").text(res.farmer_sales_distance);
            $(".show-farmer-address").text(res.user_alamat);
            $(".show-farmer-email").text(res.user_email);
            $(".show-farmer-poin").text(res.user_total_poin);
            $(".show-farmer-scan-success").text(res.user_total_scan);
            $(".show-farmer-scan-failed").text(res.user_total_scan_failed);
            $(".show-nama-lahan").text(res.lahan_nama);
            $(".show-luas-lahan").text(res.lahan_luas);
            $(".show-alamat-lahan").text(res.lahan_alamat);
            $("#foto-ktp").attr(
                "src",
                `https://syngenta-project.skwn.dev/qrdev/dokumen/reqSahabat/${res.request_sahabat_file_ktp}`
            );
            $("#foto-selfie").attr(
                "src",
                `https://syngenta-project.skwn.dev/qrdev/dokumen/reqSahabat/${res.request_sahabat_file_selfie}`
            );
            var linkNo = "#";
            if (res.user_telepon) {
                if (res.user_telepon.charAt(0) == "0") {
                    linkNo = "62" + res.user_telepon.substring(1);
                } else if (res.user_telepon.charAt(0) == "+") {
                    linkNo = res.user_telepon.substring(1);
                } else if (res.user_telepon.charAt(0) != "6") {
                    linkNo = "62" + res.user_telepon.substring(1);
                } else {
                    linkNo = res.user_telepon;
                }
            }
            $(".show-farmer-telepon").text(res.user_telepon).data("no", linkNo);
            if (res.lahan.success) {
                $.each(res.lahan.data, (k, v) => {
                    total_luas_lahan += Number(v.lahan_luas);
                    $("#list-lahan").append(`
                    <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;">
                        <div class="caption-center left-30">
                            <div class="right-30">
                                <h1 class="font-16 bottom-0 color-custom-dark" style="line-height: 20px;">${
                                    v.lahan_nama
                                }</h1>
                            </div>
                            <label class="font-12 color-custom-dark">${HELPER.toRp(
                                v.lahan_luas
                            )} Ha</label>
                            <label class="font-12 color-custom-dark"><i class="fa fa-map-marker-alt fa-lg" style="color:#2ECC71"></i> ${
                                v.lahan_alamat
                            }</label>
                        </div>
                    </div>
                    `);
                });
            }
            $(".show-total-luas-lahan").text(
                `${HELPER.toRp(total_luas_lahan)} Ha`
            );
            HELPER.removeItem(["request_sahabat_id"]);
        },
    });
}

function onPromote() {
    HELPER.ajax({
        url: BASE_URL + "Sahabat/promoteFarmer",
        data: {
            id: $("#request_sahabat_id").val(),
            date: $("#input_date_promote").val(),
        },
        success: function (res) {
            if (res.success) {
                onPage("list-request-sahabat");
            } else {
                HELPER.showMessage({
                    success: "info",
                    title: "Info",
                    message: "Error Terjadi kesalahan",
                });
            }
        },
    });
}

function onReject() {
    HELPER.ajax({
        url: BASE_URL + "Sahabat/rejectPromote",
        data: {
            id: $("#request_sahabat_id").val(),
            description: $("#reject_description").val(),
        },
        success: function (res) {
            if (res.success) {
                onPage("list-request-sahabat");
            } else {
                HELPER.showMessage({
                    success: "info",
                    title: "Info",
                    message: "Error Terjadi kesalahan",
                });
            }
        },
    });
}
