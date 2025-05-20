type = "";
$(function () {
    init();
    $("#rating_score").barrating({
        theme: "css-stars",
    });
});

async function init() {
    if (checkIsPetani()) {
        await readPetani();
        $(".on-back-button")
            .off("click")
            .on("click", () => {
                onPage("main");
            });
        $(".switch_dokter").hide();
        $(".chat-time").show();
        $("#chat_search").attr("placeholder", "Cari Dokter NK");
        type = "Petani";
        countChannelActive();
        loadActiveChat();
        loadInactiveChat();
        if (HELPER.getItem("user_chat_time")) {
            hour = new Date(1000 * HELPER.getItem("user_chat_time"))
                .toISOString()
                .substr(11, 8);
            $(".user_chat_time").text(hour);
        }
    } else {
        await readDokter();
        $(".on-back-button")
            .off("click")
            .on("click", () => {
                onPage("main-sales");
            });
        $(".switch_dokter").show();
        $(".chat-time").hide();
        $("#chat_search").attr("placeholder", "Cari Petani");
        type = "Sales";
        $("#plus-menu").hide();
        toggleDokter();
        loadActiveChat();
        loadInactiveChat();
    }
}

function toggleDokter() {
    if (HELPER.getItem("user_is_dokter") == 1) {
        $(".switch_dokter").removeClass("toggle-off");
        $(".switch_circle").css("transform", "translateX(27px)");
        $(".switch_dokter strong").addClass("bg-mint-dark");
        $(".switch_dokter u")
            .addClass("bg-mint-light")
            .removeClass("bg-gray2-dark");
    } else {
        $(".switch_dokter").addClass("toggle-off");
        $(".switch_circle").css("transform", "translateX(-2px)");
        $(".switch_dokter strong").removeClass("bg-mint-dark");
        $(".switch_dokter u")
            .addClass("bg-gray2-dark")
            .removeClass("bg-mint-light");
    }
}

function countDownTime(start_at, channel_name) {
    intervalTimePetani = setInterval(() => {
        if ($(".halaman-list-chat").length > 0) {
            total_time = moment().diff(moment(start_at), "seconds");

            operation = HELPER.getItem("user_chat_time") - total_time;
            hour = new Date(1000 * operation).toISOString().substr(11, 8);
            $(".user_chat_time").text(hour);

            if (operation < 1) {
                clearInterval(intervalTimePetani);
                HELPER.ajax({
                    url: BASE_URL + "Dokter/stopChat",
                    data: {
                        user_id: HELPER.getItem("user_id"),
                        channel_name: channel_name,
                        total_time: total_time,
                    },
                    complete: function (res) {
                        HELPER.setItem("user_chat_time", 0);
                        onPage("dokternk-list-chat");
                    },
                });
            }
        } else {
            clearInterval(intervalTimePetani);
        }
    }, 1000);
}

function loadActiveChat(search) {
    HELPER.block();
    $(".dt-list-chat-active").html("");
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + "Dokter/countRoomActive",
        dataExist: {
            id: HELPER.getItem("user_id"),
            search: search,
            type: type,
        },
        urlMore: BASE_URL + "Dokter/getRoomActive",
        dataMore: {
            id: HELPER.getItem("user_id"),
            search: search,
            type: type,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $(".dt-list-chat-active")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                <div class="not-found">
                                    <h3>Tidak Ada Chat Aktif</h3>
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
                    var data_chat = $.parseJSON(data.responseText);
                    $.each(data_chat, async (i, v) => {
                        if (v.room_session_id) {
                            if (checkIsPetani()) {
                                user_active = v.user[0];
                                countDownTime(
                                    v.room_session_created_at,
                                    v.room_session_channel_name
                                );
                                user_foto =
                                    BASE_ASSETS +
                                    "user/" +
                                    user_active.user_foto;
                                user_type = "petani";
                            } else {
                                user_active = v.user[0];
                                // user_foto = user_active.user_foto;
                                if (
                                    user_active.user_foto.indexOf("http") >= 0
                                ) {
                                    user_foto = user_active.user_foto;
                                } else {
                                    user_foto =
                                        BASE_ASSETS +
                                        "user_mobile/" +
                                        user_active.user_foto;
                                }
                                user_type = "dokter";
                            }
                            msg = "";
                            not_readed = false;
                            if (v.last_msg) {
                                if (v.last_msg.room_chat_type > 1) {
                                    msg = "File";
                                } else {
                                    msg = JSON.parse(
                                        v.last_msg.room_chat_message
                                    );
                                }
                                if (
                                    !v.last_msg.room_chat_read_at &&
                                    v.last_msg.room_chat_sender !=
                                        HELPER.getItem("user_id")
                                ) {
                                    not_readed = true;
                                }
                            }
                            html = `<a href="javascript:void(0)" id="card_detail_${
                                v.room_session_id
                            }" style="padding-left:0px;">
                                        <div style="display:flex;">
                                            <img src="${user_foto}" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;border-radius:10px;">
                                            <div style="margin-right:auto;">
                                                <div style="display:flex;">
                                                    <span style="padding-left:20px;">${
                                                        user_active.user_nama
                                                    }</span>
                                                    <span style="padding-left:5px;font-size:9px;color:#a2a2a2;width:max-content;">${moment(
                                                        v.room_session_created_at
                                                    ).format("hh.mm")}</span>
                                                </div>
                                                <p style="padding-left:20px;padding-right: 15px;width: 100%;">${HELPER.text_truncate(
                                                    msg,
                                                    35
                                                )}</p>
                                            </div>
                                            ${
                                                not_readed
                                                    ? `<div class="chat-dokter-dot color-white bg-red1-light" 
                                                style="position: absolute;top:21px;border-radius: 50%;right: 6px;width: 10px;height: 10px;"></div>`
                                                    : ""
                                            }
                                        </div>
                                    </a>`;
                            $(".dt-list-chat-active").append(`
                                ${html}
                            `);
                            await $("#card_detail_" + v.room_session_id).off(
                                "click"
                            );
                            await $("#card_detail_" + v.room_session_id).on(
                                "click",
                                function () {
                                    onPage("dokternk-chat");
                                    sseClient.subscribe({
                                        channel: v.room_session_channel_name,
                                        key: v.room_session_channel_key,
                                    });
                                    HELPER.setItem(
                                        "room_session_id",
                                        v.room_session_id
                                    );
                                    // if (type == "Petani") {
                                    HELPER.setItem(
                                        "chat_user_id",
                                        v.user[0].user_id
                                    );
                                    // } else {
                                    //     HELPER.setItem(
                                    //         "chat_user_id",
                                    //         v.user[0].user_id
                                    //     );
                                    // }
                                    HELPER.setItem("chat_user_type", user_type);
                                }
                            );
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

function loadInactiveChat(search) {
    HELPER.block();
    $(".dt-list-chat-inactive").html("");
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + "Dokter/countRoomInactive",
        dataExist: {
            id: HELPER.getItem("user_id"),
            search: search,
            type: type,
        },
        urlMore: BASE_URL + "Dokter/getRoomInactive",
        dataMore: {
            id: HELPER.getItem("user_id"),
            search: search,
            type: type,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $(".dt-list-chat-inactive")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                <div class="not-found">
                                    <h3>Tidak Ada Histori Chat</h3>
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
                    var data_chat = $.parseJSON(data.responseText);
                    $.each(data_chat, async (i, v) => {
                        if (v.room_session_id) {
                            if (checkIsPetani()) {
                                user = v.user[0];
                                user_foto =
                                    BASE_ASSETS + "user/" + user.user_foto;
                                user_type = "petani";
                            } else {
                                user = v.user[0];
                                if (user.user_foto.indexOf("http") >= 0) {
                                    user_foto = user.user_foto;
                                } else {
                                    user_foto =
                                        BASE_ASSETS +
                                        "user_mobile/" +
                                        user.user_foto;
                                }
                                user_type = "dokter";
                            }
                            msg = "";
                            if (v.last_msg) {
                                if (v.last_msg.room_chat_type > 1) {
                                    msg = "File";
                                } else {
                                    msg = JSON.parse(
                                        v.last_msg.room_chat_message
                                    );
                                }
                            }
                            var tanggal = moment(
                                v.room_session_created_at
                            ).format("D MMM YY");
                            if (
                                moment(v.room_session_created_at).isSame(
                                    moment(),
                                    "day"
                                )
                            ) {
                                var tanggal = moment(
                                    v.room_session_created_at
                                ).format("HH.mm");
                            }
                            html = `<a href="javascript:void(0)" id="card_detail_${
                                v.room_session_id
                            }" style="padding-left:0px;">
                                        <div style="display:flex;">
                                            <img src="${user_foto}" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;border-radius:10px;">
                                            <div style="margin-right:auto;">
                                                <div style="display:flex;">
                                                    <span style="padding-left:20px;">${
                                                        user.user_nama
                                                    }</span>
                                                    <span style="padding-left:5px;font-size:9px;color:#a2a2a2;width:max-content;">${tanggal}</span>
                                                </div>
                                                <p style="padding-left:20px;padding-right: 15px;width: 100%;">${HELPER.text_truncate(
                                                    msg,
                                                    35
                                                )}</p>
                                            </div>
                                            <div>
                                                <div style="display:flex;">
                                                    <i class="fa fa-star" style="margin:auto;color:#FDD84D;font-size:14px;position:static;width:fit-content;"></i>
                                                    <span class="show-dokter-star" style="position:relative;top:12px;">${
                                                        v.rating
                                                            ? HELPER.nullConverter(
                                                                  v.rating
                                                                      .rating_dokter_score
                                                              )
                                                            : "-"
                                                    }</span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>`;

                            $(".dt-list-chat-inactive").append(`
                                ${html}
                            `);
                            await $("#card_detail_" + v.room_session_id).off(
                                "click"
                            );
                            await $("#card_detail_" + v.room_session_id).on(
                                "click",
                                function () {
                                    if (
                                        user_type == "petani" &&
                                        !v.rating.rating_dokter_score
                                    ) {
                                        user_rating = v.user[0];
                                        user_rating_foto =
                                            BASE_ASSETS +
                                            "user/" +
                                            user_rating.user_foto;
                                        $("#rating_score").barrating("set", 5);
                                        $("#rating_note").val("");
                                        $(".show-dokter-foto").attr(
                                            "src",
                                            user_rating_foto
                                        );
                                        $("#rating_dokter_id").val(
                                            v.rating.rating_dokter_id
                                        );
                                        $("#rating_session_id").val(
                                            v.room_session_id
                                        );
                                        $("#rating_dokter_sales_id").val(
                                            v.user[0].user_id
                                        );
                                        $(".btn-rating-dokter-nk").click();
                                    } else {
                                        onPage("dokternk-chat");
                                        sseClient.subscribe({
                                            channel:
                                                v.room_session_channel_name,
                                            key: v.room_session_channel_key,
                                        });
                                        HELPER.setItem(
                                            "room_session_id",
                                            v.room_session_id
                                        );
                                        HELPER.setItem(
                                            "chat_user_id",
                                            v.user[0].user_id
                                        );
                                        HELPER.setItem(
                                            "chat_user_type",
                                            user_type
                                        );
                                    }
                                }
                            );
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
            $("#btn-more-inactive")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-inactive").hide();
            $("#btn-more-inactive").off("click");
        },
    });
}

function getChannel(type) {
    HELPER.ajax({
        url: BASE_URL + "Dokter/" + type,
        data: { id: HELPER.getItem("user_id") },
        complete: function (res) {
            $.each(res, async (i, v) => {
                if (v.room_session_id) {
                    if (checkIsPetani()) {
                        user = v.user[0];
                        user_foto = BASE_ASSETS + "user/" + user.user_foto;
                    } else {
                        user = v.user[1];
                        user_foto = user.user_foto;
                    }
                    msg = "";
                    if (v.last_msg) {
                        msg = v.last_msg.room_chat_message;
                    }
                    html = `<a href="javascript:void(0)" id="card_detail_${
                        v.room_session_id
                    }" style="padding-left:0px;">
                                <div style="display:flex;">
                                    <img src="${
                                        user.user_foto
                                    }" onerror="this.src='./assets/images/noimage.png'" class="icon-ulat" style="height: 30px;margin-top: 15px;margin-left: 5px;">
                                    <div style="margin-right:auto;">
                                        <div style="display:flex;">
                                            <span style="padding-left:20px;">${
                                                user.user_nama
                                            }</span>
                                            <span style="padding-left:5px;font-size:9px;color:#a2a2a2;width:max-content;">${moment(
                                                v.room_session_created_at
                                            ).format("hh.mm")}</span>
                                        </div>
                                        <p style="padding-left:20px;padding-right: 15px;width: max-content;">${HELPER.nullConverter(
                                            msg
                                        )}</p>
                                    </div>
                                </div>
                            </a>`;
                    if (v.is_active == 1) {
                        $(".dt-list-chat-active").append(`
                            ${html}
                        `);
                    } else {
                        $(".dt-list-chat-inactive").append(`
                            ${html}
                        `);
                    }
                    await $("#card_detail_" + v.room_session_id).off("click");
                    await $("#card_detail_" + v.room_session_id).on(
                        "click",
                        function () {
                            onPage("dokternk-chat");
                            sseClient.subscribe({
                                channel: v.room_session_channel_name,
                                key: v.room_session_channel_key,
                            });
                            HELPER.setItem(
                                "room_session_channel_name",
                                v.room_session_channel_name
                            );
                            HELPER.setItem(
                                "room_session_id",
                                v.room_session_id
                            );
                            HELPER.setItem("chat_user_foto", user.user_foto);
                            HELPER.setItem("chat_user_nama", user.user_nama);
                        }
                    );
                }
            });
        },
    });
}

function countChannelActive() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/countChatActive",
        data: {
            user_id: HELPER.getItem("user_id"),
        },
        complete: function (res) {
            if (res > 1) {
                $("#plus-menu").hide();
            }
        },
    });
}

function onStatusDokter(change_status = false) {
    if (HELPER.getItem("user_is_dokter") == 1) {
        HELPER.ajax({
            url: BASE_URL + "Dokter/onStatusDokter",
            data: { user_id: HELPER.getItem("user_id"), status: 0 },
            complete: function (res) {
                if (res.success) {
                    HELPER.setItem("user_is_dokter", 0);
                    setTimeout(() => {
                        toggleDokter();
                    }, 200);
                }
            },
        });
    } else if (change_status) {
        dokter_date = $("#input_date_dokter").val();
        HELPER.ajax({
            url: BASE_URL + "Dokter/onStatusDokter",
            data: {
                user_id: HELPER.getItem("user_id"),
                status: 1,
                dokter_at: dokter_date,
            },
            complete: function (res) {
                if (res.success) {
                    HELPER.setItem("user_is_dokter_at", dokter_date);
                    HELPER.setItem("user_is_dokter", 1);
                    setTimeout(() => {
                        toggleDokter();
                    }, 200);
                }
            },
        });
    } else if (
        HELPER.getItem("user_is_dokter_at") &&
        HELPER.getItem("user_is_dokter_at") != "null"
    ) {
        console.log(HELPER.getItem("user_is_dokter_at"));
        // $(".btn-activate-dokter-nk").trigger("click");
        // $("#input_date_dokter").val(
        //     moment(HELPER.getItem("user_is_dokter_at")).format("YYYY-MM-DD")
        // );
        HELPER.ajax({
            url: BASE_URL + "Dokter/onStatusDokter",
            data: { user_id: HELPER.getItem("user_id"), status: 1 },
            complete: function (res) {
                if (res.success) {
                    HELPER.setItem("user_is_dokter", 1);
                    setTimeout(() => {
                        toggleDokter();
                    }, 200);
                }
            },
        });
    } else {
        $(".btn-activate-dokter-nk").trigger("click");
        $("#input_date_dokter").val(
            moment(HELPER.getItem("user_is_dokter_at")).format("YYYY-MM-DD")
        );
    }
}

function onReview() {
    HELPER.confirm({
        title: "Konfirmasi Review",
        message: "Apakah anda yakin ingin mengirimkan review?",
        type: "warning",
        callback: function (success, id, record, message) {
            if (success) {
                HELPER.ajax({
                    url: BASE_URL + "Dokter/ratingDokter",
                    data: {
                        rating_dokter_id: $("#rating_dokter_id").val(),
                        rating_dokter_sales_id: $(
                            "#rating_dokter_sales_id"
                        ).val(),
                        rating_dokter_score: $("#rating_score").val(),
                        rating_dokter_note: $("#rating_note").val(),
                    },
                    complete: function (res) {
                        if (res.success) {
                            $(".btn-next-chat").click();
                            loadInactiveChat();
                        }
                    },
                });
            }
        },
    });
}

function onNextChat() {
    onPage("dokternk-chat");
    HELPER.setItem("room_session_id", $("#rating_session_id").val());
    HELPER.setItem("chat_user_id", $("#rating_dokter_sales_id").val());
    HELPER.setItem("chat_user_type", "petani");
}

function searchChat() {
    name_user = $("#chat_search").val();
    loadActiveChat(name_user);
    loadInactiveChat(name_user);
}

function searchDokter() {
    if (HELPER.getItem("user_chat_time") > 1) {
        onPage("dokternk-loading");
    } else {
        HELPER.showMessage({
            success: "warning",
            title: "Warning",
            message: "Anda tidak memiliki cukup waktu untuk chat",
        });
    }
}

function readDokter() {
    return new Promise(async (resolve, reject) => {
        HELPER.ajax({
            url: BASE_URL + "Akun/readNonPetani",
            data: {
                user_id: HELPER.getItem("user_id"),
            },
            complete: function (res) {
                // $.each(res, function (i, v) {
                //     window.localStorage.setItem(i, v);
                // });
                HELPER.setItem("user_is_dokter", res.user_is_dokter);
                resolve();
            },
            error: function () {
                HELPER.showMessage({
                    message: "Oops, terjadi kesalahan teknis.",
                });
            },
        });
    });
}

function readPetani() {
    return new Promise(async (resolve, reject) => {
        HELPER.ajax({
            url: BASE_URL + "Akun/read",
            data: {
                user_id: HELPER.getItem("user_id"),
            },
            complete: function (res) {
                // $.each(res, function (i, v) {
                //     window.localStorage.setItem(i, v);
                // });
                HELPER.setItem("user_chat_time", res.user_chat_time);
                resolve();
            },
        });
    });
}
