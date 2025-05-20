let sseClient;
document.addEventListener("deviceready", channelActive, false);

function channelActive() {
    if (!HELPER.getItem("user_id")) {
        return false;
    }
    try {
        HELPER.ajax({
            url: BASE_URL + "Main/getChannel",
            data: {
                id: HELPER.getItem("user_id"),
            },
            complete: function (res) {
                json_data = JSON.stringify({
                    user_id: HELPER.getItem("user_id"),
                    key: res.key_user,
                });
                let EMITTER = {};
                if (BASE_URL == 'https://syngenta-project.skwn.dev/qrdev/index.php/MobileApp/') {
                    EMITTER = {
                        host: "emitter-sse.skwn.dev",
                        port: 443,
                        secure: true,
                        username: json_data,
                    };
                } else {
                    EMITTER = {
                        host: "socket.petani-nk.com",
                        port: 443,
                        secure: true,
                        username: json_data,
                    };
                }
                sseClient = emitter.connect(EMITTER);
                sseClient
                    .on("connect", function () {
                        // channelActive();
                        sseClient.subscribe({
                            channel: "user/#/",
                            key: res.key_user,
                        });
                        $.each(res.data, function (i, v) {
                            channel = v.user_channel_name;
                            key = v.user_channel_key;
                            sseClient.subscribe({
                                channel,
                                key,
                            });
                        });
                    })
                    .on("disconnect", function () {
                        console.log("Disconnected from sse");
                    })
                    .on("error", function (error) {
                        console.log("Sse send an ERROR", error);
                    })
                    .on("offline", function () {
                        console.log("Sse is OFFLINE");
                    })
                    .on("message", function (msg) {
                        const data = msg.asObject();
                        if (data.payload.sender) {
                            loadChat(data);
                        }
                        if (data.payload.read_by) {
                            chatReadStatus(data);
                        }
                        if (data.payload.stop_by) {
                            stopRoomChat(data);
                        }
                    });
            },
        });
    } catch (error) {
        console.log(error);
    }
}

function loadChat(data) {
    if ($("#channel_name").val() == data.payload.channel) {
        if (data.payload.msg_type == 1) {
            // message = data.payload.message;
            message = JSON.parse((data.payload.message).replace(/\\n/g,'<br>'));
        } else if (data.payload.msg_type == 2) {
            message = `
                <a href="${BASE_ASSETS}message/image/${data.payload.message}" data-lightbox="${data.payload.message}">
                    <img src="${BASE_ASSETS}message/image/${data.payload.message}" onerror="this.src='./assets/images/noimage.png'"  style="height: 150px;margin-left: 5px;border-radius: 10px;">
                </a>`;
        }
        var tanggal = moment(data.payload.send_at).format(
            "D MMM YY"
        );
        if(moment(data.payload.send_at).isSame(moment(), 'day')){
            var tanggal = moment(data.payload.send_at).format(
                "hh.mm"
                );
        }
        if (data.payload.sender == HELPER.getItem("user_id")) {
            html = `<div class="speech-bubble bg-highlight" style="border-top-right-radius: 0px;color: white;padding-right:45px;margin-left:auto;max-width:80%;word-break:break-word;">
                        ${message}
                       <span style="position:absolute;right:18px;bottom:7px;font-size:8px">${tanggal}</span>
                        <i class="fas fa-check read_check" style="color:#fff;position:absolute;right:4px;bottom:12px;font-size:8px"></i>
                    </div>`;
        } else {
            html = `<div class="speech-bubble color-black" style="border-top-left-radius:0px;margin-right:auto;padding-right:45px;max-width:80%;word-break:break-word;">
                        ${message}
                        <span style="position:absolute;right:8px;bottom:4px;font-size:8px">${tanggal}</span>
                    </div>`;
        }
        $("#chat-dokter").append(`${html}`);
        // $("#filler-chat").after(`${html}`);
    }
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
}

function chatReadStatus(data) {
    if ($("#channel_name").val() == data.payload.channel) {
        if (data.payload.sender != HELPER.getItem("user_id")) {
            $(".read_check").css("color", "#53bdeb");
        }
    }
}

function stopRoomChat(data) {
    if (
        $("#channel_name").val() == data.payload.channel ||
        $(".halaman-list-chat").length > 0
    ) {
        onPage("dokternk-list-chat");
    }
}
