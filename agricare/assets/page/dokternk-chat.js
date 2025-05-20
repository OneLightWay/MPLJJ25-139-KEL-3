var total_time = 0;
var start_at = "";
$(async function () {
    room_session_id = HELPER.getItem("room_session_id");
    chat_user_id = HELPER.getItem("chat_user_id");
    // room_session_channel_name = HELPER.getItem("room_session_channel_name");
    chat_user_type = HELPER.getItem("chat_user_type");
    init(room_session_id, chat_user_id, chat_user_type)
        .then((value) => {
            $("#channel_name").val(
                value.room_session.room_session_channel_name
            );
            $("#user_nama").text(value.chat_user.user_nama);
            $(".page-content").addClass(`halaman-chat_${room_session_id}`);
            if (checkIsPetani()) {
                $(".rating_sub_title").text("Anda Memberika Rating");
                $("#user_foto").attr(
                    "src",
                    BASE_ASSETS + "user/" + value.chat_user.user_foto
                );
            } else {
                if (value.chat_user.user_foto.indexOf("http") >= 0) {
                    user_foto = value.chat_user.user_foto;
                } else {
                    user_foto =
                        BASE_ASSETS +
                        "user_mobile/" +
                        value.chat_user.user_foto;
                }
                $(".rating_sub_title").text("Anda Mendapatkan Rating");
                $("#user_foto").attr("src", user_foto);
            }

            $("#user_nama, #user_foto").click(function () {
                HELPER.ajax({
                    url: BASE_URL + "Dokter/readProfile",
                    data: {
                        user_id: value.chat_user.user_id,
                    },
                    complete: function (res) {
                        $(".btn-menu-profile").click();
                        if (checkIsPetani()) {
                            $(".show-profile-foto").attr(
                                "src",
                                BASE_ASSETS + "user/" + res.user_foto
                            );
                        } else {
                            if (res.user_foto.indexOf("http") >= 0) {
                                user_foto = res.user_foto;
                            } else {
                                user_foto =
                                    BASE_ASSETS +
                                    "user_mobile/" +
                                    res.user_foto;
                            }
                            $(".show-profile-foto").attr("src", user_foto);
                        }
                        $(".show-profile-name").text(res.user_nama);
                        $(".show-profile-email").text(res.user_email);
                        $(".show-profile-provinsi").text(
                            res.user_province_name
                        );
                        $(".show-profile-region").text(res.user_nama_wilayah);
                        if (res.user_is_dokter_at) {
                            $(".alamat_user").hide();
                            pengalaman = moment().diff(
                                moment(res.user_is_dokter_at),
                                "days"
                            );
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
                            $(".show-profile-exp").text(
                                `${tahun ? Math.floor(tahun) + " tahun" : ""} ${
                                    bulan ? Math.floor(bulan) + " bulan" : ""
                                } ${tahun ? "" : hari + " hari"}`
                            );
                        } else {
                            $(".pengalaman_sales").hide();
                            $(".show-profile-alamat").text(res.user_alamat);
                        }
                    },
                });
            });
            getHistoryChat();
            statusChat();
            if (value.chat_user.user_channel_end_at) {
                getReview();
                total_time = moment(value.chat_user.user_channel_end_at).diff(
                    moment(value.chat_user.user_channel_start_at),
                    "seconds"
                );
                hour = new Date(1000 * total_time).toISOString().substr(11, 8);
                $(".user_chat_time").text(hour);
            }
        })
        .then(() => {
            intervalTime = setInterval(() => {
                if ($(".halaman-chat").length > 0) {
                    if (start_at) {
                        total_time = moment().diff(moment(start_at), "seconds");
                        operation = 0;
                        if (checkIsPetani()) {
                            operation =
                                HELPER.getItem("user_chat_time") - total_time;
                        } else {
                            operation = total_time;
                        }
                        hour = new Date(1000 * operation)
                            .toISOString()
                            .substr(11, 8);
                        $(".user_chat_time").text(hour);
                        if (checkIsPetani()) {
                            if (operation < 1) {
                                clearInterval(intervalTime);
                                HELPER.ajax({
                                    url: BASE_URL + "Dokter/stopChat",
                                    data: {
                                        user_id: HELPER.getItem("user_id"),
                                        channel_name: $("#channel_name").val(),
                                        total_time: total_time,
                                    },
                                    complete: function (res) {
                                        HELPER.setItem("user_chat_time", 0);
                                        onPage("dokternk-list-chat");
                                    },
                                });
                            }
                        }
                    }
                } else {
                    clearInterval(intervalTime);
                }
            }, 1000);
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        });
    HELPER.removeItem(["room_session_id", "chat_user_id", "chat_user_type"]);
    readChat();
    loadQuickReply()
    if (checkIsPetani()) {
        $('.btn-quick-reply-chat').hide()
    }else{
        $('.btn-quick-reply-chat').show()
    }
});

function init(room_session_id, chat_user_id, chat_user_type) {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Dokter/getDataChat",
            data: {
                room_session_id: room_session_id,
                chat_user_id: chat_user_id,
                chat_user_type: chat_user_type,
            },
            complete: function (res) {
                if (res.success) {
                    resolve(res);
                }
            },
        });
    });
}

function statusChat() {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Dokter/getChannel",
            data: {
                user_id: HELPER.getItem("user_id"),
                channel_name: $("#channel_name").val(),
            },
            complete: function (res) {
                $("#chat-time").off("click");
                if (res.user_channel_end_at) {
                    $(".rating_section").show();
                    $("#footer-menu").hide();
                    $(".end_history_chat").show();
                    $("#chat-dokter").css("margin-bottom", "65px");
                    $("#chat-dokter").css("min-height", "60vh");
                    $(".halaman-chat").css("padding-top", "260px");
                } else {
                    start_at = res.user_channel_start_at;
                    $("#footer-menu").show();
                    $(".rating_section").hide();
                    $(".end_history_chat").hide();
                    $("#chat-dokter").css("margin-bottom", "60px");
                    $("#chat-dokter").css("min-height", "90vh");
                    $(".halaman-chat").css("padding-top", "50px");

                    $("#chat-time").on(
                        "click",
                        function () {
                            stopChat()
                        }
                    );
                }
                resolve(true);
            },
        });
    });
}

function sentChat(name) {
    if ($("#input-chat").val() != "" || $("#input_img").val() != "") {
        var form = $("#" + name)[0];
        var formData = new FormData(form);
        formData.append("user_id", HELPER.getItem("user_id"));
        formData.append("room_session_id", room_session_id);
        formData.append("channel_name", $("#channel_name").val());
        formData.append("message", JSON.stringify($("#input-chat").val()));
        $.ajax({
            type: "POST",
            url: BASE_URL + "Dokter/sentChat",
            cache: false,
            data: formData,
            contentType: false,
            processData: false,
            form: name,
            success: function (res) {
                $("#input-chat").val("");
                $("#input-chat").keydown();
                resetFile();
                if (!res.success) {
                    HELPER.showMessage({
                        title: "Pesan Gagal",
                        text: "file yang anda upload tidak sesuai dengan format",
                        icon: "warning",
                    });
                } else {
                    getHistoryChat()
                }
            },
        });
    }
}

function getHistoryChat() {
    HELPER.block();
    $("#chat-dokter").html("");
    $("#chat-dokter").append(
        `<div id="filler-chat" style="margin-bottom: auto;"></div>`
    );
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Dokter/chatExist",
        dataExist: {
            room_session_id: room_session_id,
        },
        urlMore: BASE_URL + "Dokter/chatMore",
        dataMore: {
            room_session_id: room_session_id,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
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
                    chat_date = "";
                    $.each(data_chat.data, function (i, v) {
                        read_color = v.room_chat_read_at ? "#53bdeb" : "#fff";
                        if (v.room_chat_type == 1) {
                            message = JSON.parse(
                                v.room_chat_message.replace(/\\n/g, "<br>")
                            );
                        } else if (v.room_chat_type == 2) {
                            message = `
                                <a href="${BASE_ASSETS}message/image/${v.room_chat_message}" data-lightbox="${v.room_chat_message}">
                                  <img src="${BASE_ASSETS}message/image/${v.room_chat_message}" onerror="this.src='./assets/images/noimage.png'"  style="height: 150px;margin-left: 5px;border-radius: 10px;">
                                </a>`;
                        }
                        var tanggal = moment(v.room_chat_created_at).format(
                            "D MMM YY"
                        );
                        if (
                            moment(v.room_chat_created_at).isSame(
                                moment(),
                                "day"
                            )
                        ) {
                            var tanggal = moment(v.room_chat_created_at).format(
                                "hh.mm"
                            );
                        }

                        if (v.room_chat_sender == HELPER.getItem("user_id")) {
                            html = `
                            <div class="speech-bubble bg-highlight" style="border-top-right-radius: 0px;color: white;padding-right:55px;margin-left:auto;max-width:80%;word-break:break-word;">
                                ${message}
                                <span style="position:absolute;right:18px;bottom:4px;font-size:8px">${tanggal}</span>
                                <i class="fas fa-check read_check" style="color:${read_color};position:absolute;right:4px;bottom:12px;font-size:8px"></i>
                            </div>`;
                        } else {
                            html = `
                            <div class="speech-bubble color-black" style="border-top-left-radius:0px;margin-right:auto;padding-right:45px;max-width:80%;word-break:break-word;">
                                ${message}
                                <span style="position:absolute;right:8px;bottom:4px;font-size:8px">${tanggal}</span>
                            </div>
                            `;
                        }
                        // $("#chat-dokter").prepend(`${html}`);
                        $("#filler-chat").after(`${html}`);

                        if (
                            moment(v.room_chat_created_at).format(
                                "DD/MM/YYYY"
                            ) != chat_date &&
                            chat_date != ""
                        ) {
                            $("#filler-chat").after(
                                `<div style="width:margin-top:10px;margin-bottom:10px;">
                                    <div style="border: 1px solid gray;border-radius: 10px; box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);margin: auto;padding-left: 20px;padding-right: 20px;width:fit-content;">
                                        <p style="text-align: center;margin-bottom: 0px;font-size: 10px;">${moment(
                                            v.room_chat_created_at
                                        ).format("DD/MM/YYYY")}</p>
                                    </div>
                                </div>`
                            );
                        } else {
                            chat_date = moment(v.room_chat_created_at).format(
                                "DD/MM/YYYY"
                            );
                        }
                    });
                    $("#filler-chat").after(
                        `<div style="width:margin-top:10px;margin-bottom:10px;">
                            <div style="border: 1px solid gray;border-radius: 10px; box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);margin: auto;padding-left: 20px;padding-right: 20px;width:fit-content;">
                                <p style="text-align: center;margin-bottom: 0px;font-size: 10px;">${chat_date}</p>
                            </div>
                        </div>`
                    );
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

function stopChat() {
    HELPER.confirm({
        title: "Akhiri Percakapan",
        message: "Anda yakin ingin menghentikan percakapan ?",
        type: "warning",
        callback: function (success, id, record, message) {
            if (success) {
                HELPER.ajax({
                    url: BASE_URL + "Dokter/stopChat",
                    data: {
                        user_id: HELPER.getItem("user_id"),
                        channel_name: $("#channel_name").val(),
                        total_time: total_time,
                    },
                    complete: function (res) {
                        // HELPER.setItem("user_chat_time", res.new_time);
                        onPage("dokternk-list-chat");
                    },
                });
            }
        },
    });
}

function readChat() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/readChat",
        data: {
            user_id: HELPER.getItem("user_id"),
            room_session_id: room_session_id,
        },
        complete: function (res) {},
    });
}

function previewImage() {
    var image = $("#input_img").val().split("\\").pop();
    if (image) {
        $("#input-chat").attr("placeholder", image);
        $("#input-chat").prop("disabled", true);
        $(".empty-file").show();
        $(".input-file").hide();
    }
}

function resetFile() {
    $("#input_img").val("");
    $("#input-chat").attr("placeholder", "Tulis pesan anda");
    $("#input-chat").prop("disabled", false);
    $(".empty-file").hide();
    $(".input-file").show();
}

function getReview() {
    HELPER.ajax({
        url: BASE_URL + "Dokter/getReview",
        data: {
            room_session_id: room_session_id,
        },
        complete: function (res) {
            if (res.rating_dokter_score) {
                $(".rating_star").text(res.rating_dokter_score);
                $(".rating_note").text(res.rating_dokter_note);
            } else {
                $(".rating_section").hide();
                $(".halaman-chat").css("padding-top", "100px");
            }
        },
    });
}

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = 3 + element.scrollHeight + "px";
}

function takePhoto() {
    navigator.camera.getPicture(imageReceived, cameraFail, {
        quality: 60,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        allowEdit: false,
        correctOrientation: true,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK,
        saveToPhotoAlbum: false,
    });
}


function imageReceived(imageURI) {

    var options = new FileUploadOptions();
    options.fileKey = "input_img";
    options.fileName = imageURI.substr(imageURI.lastIndexOf("/") + 1);

    var params = new Object();

    options.params = {
        user_id: HELPER.getItem("user_id"),
        room_session_id: room_session_id,
        channel_name: $("#channel_name").val(),
    };

    var ft = new FileTransfer();
    ft.upload(
        imageURI,
        encodeURI(BASE_URL + "Dokter/sentChat"),
        function (succ) {
            console.log(succ);
            setTimeout(function () {
                getHistoryChat()
            }, 500)
        },
        function (err) {
            HELPER.showMessage({
                title: "Gagal !",
                message: "Silahkan periksa koneksi internet Anda !",
            });
        },
        options
    );
}

function cameraFail(message) {
    HELPER.showMessage({
        title: "Gagal !!",
        message: "Harap untuk foto kembali",
    });
}

function loadQuickReply() {
	$('#list_quick_reply').html('')
	HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Dokter/listQuickReplyExist',
        dataExist: {
        },
        urlMore: BASE_URL + 'Dokter/listQuickReplyMore',
        dataMore: {
        },
        callbackExist: function(data) {
			if (data.hasOwnProperty('success')) {
				$('#list_quick_reply').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
												<div class="not-found">
													<div></div>
						                            <h3 class bhsConf-no_histori>No quick reply available.</h3>
						                        </div>
											</div>`)
				$('#btn-more-list-quick-reply').hide()
			}else{
				$('#btn-more-list-quick-reply').show()
			}
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
				var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, v) {
                    var backgroundStatus = "#f0fff0";
                    
					$('#list_quick_reply').append(`
						<div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-select-${v.quick_reply_id}" style="background: ${backgroundStatus};">
							<div class="row bottom-10">
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span class="font-size-14" style="font-weight:bold;text-transform:uppercase;">${v.quick_reply_title}</span>
			                    </div>
			                </div>
                            <div class="row bottom-10">
			                    <div class="col color-custom-gray" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);    height: 44px;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;">
			                        <span>${JSON.parse(v.quick_reply_message.replace(/\\n/g, "<br>"))}</span>
			                    </div>
			                </div>
		                </div>
					`)

					$('.btn-select-'+v.quick_reply_id).off('click').on('click', function(event) {
                        $('#input-chat').val(JSON.parse(v.quick_reply_message)).trigger('keydown')
                        $('.menu-hider').click()
                    });

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-list-quick-reply').off('click').on('click', function() {
            	HELPER.block()
            	callLoadMore()
            });
        },
        callbackEnd: function () {
        	$('#btn-more-list-quick-reply').hide()
        	$('#btn-more-list-quick-reply').off('click');
        }
    })
}