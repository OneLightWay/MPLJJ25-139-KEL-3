$(function () {
    loadActiveDokter();
    // loadDokter();
    if (HELPER.getItem("user_chat_time")) {
        hour = format(HELPER.getItem("user_chat_time"));
        $(".chat_time").text(hour);
    }
});
function format(second) {
    var sec_num = parseInt(second, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    // if (hours < 10) {
    //     hours = "0" + hours;
    // }
    // if (minutes < 10) {
    //     minutes = "0" + minutes;
    // }
    // if (seconds < 10) {
    //     seconds = "0" + seconds;
    // }
    return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
}

function loadActiveDokter() {
    HELPER.block();
    $(".dt-doktere").html("");
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Dokter/getDokter",
        dataExist: {
            id: HELPER.getItem("user_id"),
        },
        urlMore: BASE_URL + "Dokter/getDokter",
        dataMore: {
            id: HELPER.getItem("user_id"),
        },
        callbackExist: function (data) {
            console.log(data);
            if (!data.success) {
                $(".dt-dokter")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                              <div class="not-found">
                                  <h3 class bhsConf-no_histori>No Doctor available.</h3>
                              </div>
                          </div>`);
            }
            $(".loading-dokter").hide();
            $(".list-dokter").show();
        },
        callbackMore: function (data) {
            var myQueue = new Queue();
            myQueue
                .enqueue(function (next) {
                    HELPER.block();
                    next();
                }, "1")
                .enqueue(function (next) {
                    var data_chat = $.parseJSON(data.responseText);
                    $.each(data_chat.data, async (i, v) => {
                        pengalaman = moment().diff(
                            moment(v.user_is_dokter_at),
                            "days"
                        );
                        tahun = 0;
                        bulan = 0;
                        hari = 0;
                        if (pengalaman > 360) {
                            tahun = pengalaman / 360;
                            m_tahun = pengalaman % 360;
                            bulan = m_tahun / 30;
                            hari = m_tahun % 30;
                        } else if (pengalaman > 30) {
                            bulan = pengalaman / 30;
                            hari = pengalaman % 30;
                        } else {
                            hari = pengalaman;
                        }
                        html = `<a href="javascript:void(0)" id="card_detail_${
                            v.user_id
                        }" style="padding-left:0px;padding-bottom:10px;margin-top:15px;">
                            <div style="display:flex;">
                                <img src="${
                                    BASE_ASSETS + "user/" + v.user_foto
                                }" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 40px;margin: auto;border-radius:10px;">
                                <div style="width:100%;">
                                    <div style="display:flex;">
                                        <div style="padding-left:20px;margin-right:auto;display:flex;gap:5px;line-height:normal;">
                                            <span>${v.user_nama}</span>
                                            <i class="fa fa-star" style="margin-left:6px;margin-top: -5px;color:#FDD84D;font-size:10px;"></i>
                                            <span style="font-size:12px;padding-top:5px;">${
                                                v.avg_star > 0
                                                    ? Number(
                                                          v.avg_star
                                                      ).toFixed(1)
                                                    : "-"
                                            }</span>
                                        </div>
                                        <span class="text-right" style="padding-left:20px;line-height:normal;">${Number(
                                            v.distance
                                        ).toFixed(2)} km</span>
                                    </div>
                                    <p style="padding-left:20px;padding-right: 15px;padding-top:20px;width: max-content;">Pengalaman : ${
                                        tahun
                                            ? Math.floor(tahun) + " tahun"
                                            : ""
                                    } 
                                    ${
                                        bulan
                                            ? Math.floor(bulan) + " bulan"
                                            : ""
                                    } 
                                    ${tahun ? "" : hari + " hari"}</p>
                                </div>
                            </div>
                        </a>`;
                        $(".dt-dokter").append(`
                        ${html}
                    `);

                        await $("#card_detail_" + v.user_id).off("click");
                        await $("#card_detail_" + v.user_id).on(
                            "click",
                            function () {
                                readDokter(v.user_id, v.avg_star, v.distance);
                            }
                        );
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
            $("#btn-more-active")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-active").hide();
            $("#btn-more-active").off("click");
        },
    });
}

function loadDokter() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/getDokter",
        data: { id: HELPER.getItem("user_id") },
        complete: function (res) {
            if (res.success) {
                $.each(res.data, async (i, v) => {
                    pengalaman = moment().diff(
                        moment(v.user_is_dokter_at),
                        "days"
                    );
                    tahun = 0;
                    bulan = 0;
                    hari = 0;
                    if (pengalaman > 360) {
                        tahun = pengalaman / 360;
                        m_tahun = pengalaman % 360;
                        bulan = m_tahun / 30;
                        hari = m_tahun % 30;
                    } else if (pengalaman > 30) {
                        bulan = pengalaman / 30;
                        hari = pengalaman % 30;
                    } else {
                        hari = pengalaman;
                    }
                    html = `<a href="javascript:void(0)" id="card_detail_${
                        v.user_id
                    }" style="padding-left:0px;">
                            <div style="display:flex;">
                                <img src="${
                                    BASE_ASSETS + "user/" + v.user_foto
                                }" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;">
                                <div style="width:100%;">
                                    <div style="display:flex;">
                                        <span style="padding-left:20px;margin-right:auto;">${
                                            v.user_nama
                                        }</span>
                                        <span style="padding-left:20px;">${Number(
                                            v.distance
                                        ).toFixed(2)} km</span>
                                    </div>
                                    <p style="padding-left:20px;padding-right: 15px;width: max-content;">Pengalaman : ${
                                        tahun
                                            ? Math.floor(tahun) + " tahun"
                                            : ""
                                    } 
                                    ${
                                        bulan
                                            ? Math.floor(bulan) + " bulan"
                                            : ""
                                    } 
                                    ${tahun ? "" : hari + " hari"}</p>
                                </div>
                            </div>
                        </a>`;
                    $(".dt-dokter").append(`
                    ${html}
                `);

                    await $("#card_detail_" + v.user_id).off("click");
                    await $("#card_detail_" + v.user_id).on(
                        "click",
                        function () {
                            readDokter(v.user_id);
                        }
                    );
                });
            } else {
                $(".dt-dokter")
                    .append(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                <div class="not-found">
                                    <div></div>
                                    <h3>No dokter available.</h3>
                                </div>
                            </div>`);
            }
            $(".loading-dokter").hide();
            $(".list-dokter").show();
        },
    });
}

function readDokter(id, star, distance) {
    HELPER.ajax({
        url: BASE_URL + "Akun/readNonPetani",
        data: { user_id: id },
        complete: function (res) {
            if (res) {
                $("#dokter_id").val(res.user_id);
                $(".btn-menu-dokter-nk").click();
                $(".show-dokter-foto").attr(
                    "src",
                    `${BASE_ASSETS + "user/" + res.user_foto}`
                );
                $(".show-dokter-star").text(
                    star > 0 ? Number(star).toFixed(1) : "-"
                );
                $(".show-dokter-distance").text(
                    Number(distance).toFixed(2) + " km"
                );
                $(".show-dokter-name").text(res.user_nama);
                $(".show-dokter-email").text(res.user_email);
                $(".show-dokter-provinsi").text(res.user_province_name);
                $(".show-dokter-region").text(res.user_nama_wilayah);

                pengalaman = moment().diff(
                    moment(res.user_is_dokter_at),
                    "days"
                );
                hari = 0;
                tahun = 0;
                bulan = 0;
                if (pengalaman > 360) {
                    tahun = pengalaman / 360;
                    m_tahun = pengalaman % 360;
                    bulan = m_tahun / 30;
                    hari = m_tahun % 30;
                } else if (pengalaman > 30) {
                    bulan = pengalaman / 30;
                    hari = pengalaman % 30;
                } else {
                    hari = pengalaman;
                }
                $(".show-dokter-exp").text(
                    `${tahun ? Math.floor(tahun) + " tahun" : ""} ${
                        bulan ? Math.floor(bulan) + " bulan" : ""
                    } ${tahun ? "" : hari + " hari"}`
                );
            }
        },
    });
}

function chatDokter() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/createChat",
        data: {
            user_id: HELPER.getItem("user_id"),
            dokter_id: $("#dokter_id").val(),
        },
        complete: function (res) {
            if (res) {
                sseClient.subscribe({
                    channel: res.room.channel,
                    key: res.room.key,
                });
                HELPER.setItem("room_session_id", res.room_session_id);
                HELPER.setItem("chat_user_id", $("#dokter_id").val());
                HELPER.setItem("chat_user_type", "petani");
                onPage("dokternk-chat");
            }
        },
    });
}
