async function showNotif(log) {
    if (
        !log.hasOwnProperty("title") &&
        !log.hasOwnProperty("body")
    ) {
        runBackgroundCmd(log);
    } else {
        navigator.vibrate(500);
        var data = log;
        var title = "Notifikasi";
        var body = "Notifikasi untuk Anda";
        var icon_notif = "fa-bell";
        var time = moment().format("HH:mm");
        if (data.source_id) {
            HELPER.setItem("user_notif_source_id", data.source_id);
            var notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('detail-notifikasi')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        } else {
            HELPER.setItem("user_notif_source_id", data.idd);
            var notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('detail-notifikasi')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }
        if (data.title) {
            title = data.title;
        }
        if (data.body) {
            body = data.body;
        }

        if (data.hasOwnProperty("type") && data.type == "sales-acc") {
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('sales-req-login')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }
        if (data.hasOwnProperty("type") && data.type == "approval-sahabat-nk") {
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('detail-notifikasi-sahabat')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }
        if (data.hasOwnProperty("type") && data.type == "reject-sahabat-nk") {
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('detail-notifikasi-sahabat')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }
        if (data.hasOwnProperty("type") && data.type == "request-sahabat-nk") {
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('list-request-sahabat')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }
        if (data.hasOwnProperty("type") && data.type == "pemenang-undian") {
            HELPER.setItem("history_kupon_detail_id", data.source_id);
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('undian-detail')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }

        if (data.hasOwnProperty("type") && data.type == "dokternk-chat") {
            if ($(".halaman-chat_" + data.room_session_id).length > 0) {
                return "";
            }
            body = JSON.parse(data.body);
            notif_btn = `<div class="one-half">
                                <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                            </div>
                            <div class="one-half last-column">
                                <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('dokternk-list-chat')"><i class="fa fa-info-circle"></i>Lihat</a>
                            </div>
                            <div class="clear"></div>
                        `;
        }

        if (data.hasOwnProperty("type") && data.type == "notif-manual") {
            await readNotifManual(data.source_id).then((res) => {
                if (res.notif_manual_is_linked == 1) {
                    if (res.notif_manual_is_direct == 1) {
                        notif_btn = `<div class="one-half">
                                            <a href="javascript:void(0)" id="btn-notif-tutup"><i class="fa fa-times"></i>Tutup</a>
                                        </div>
                                        <div class="one-half last-column">
                                            <a href="javascript:void(0)" onclick="$('.notification-driver').removeClass('notification-active');onPage('${switchPage(
                                                res.notif_manual_link_fitur
                                            )}')"><i class="fa fa-info-circle"></i>Lihat</a>
                                        </div>
                                        <div class="clear"></div>`;
                    }
                }
            });
        }

        var body_notif = `
            <div class="notification-style notification-android bg-dark1-dark notification-active notification-driver">
                <i class="fa ${icon_notif} bg-blue1-dark"></i>
                <h1 class="font-15">${title}</h1>
                <strong>${time}</strong>
                <p class="lh-15" style="word-break:break-word;">
                    ${body}
                </p>
                <div class="notification-buttons">
                    ${notif_btn}
                </div>
            </div>    
    
        `;

        var myQ = new Queue();
        myQ.enqueue(function (next) {
            $(".notification-driver").remove();
            $("#btn-notif-tutup").off("click");
            $("#btn-notif-lihat-detail").off("click");
            next();
        }, "satu")
            .enqueue(function (next) {
                $("body").append(body_notif);
                next();
            }, "dua")
            .enqueue(function (next) {
                setTimeout(function () {
                    $("#btn-notif-tutup").on("click", function (e) {
                        $(".notification-driver").removeClass(
                            "notification-active"
                        );
                    });
                }, 300);
                next();
            }, "tiga")
            .dequeueAll();
    }
}

function setupOnTokenRefresh() {
    try {
        FirebasePlugin.onTokenRefresh(function(fcmToken) {
            var oldToken = FCM_TOKEN;
            window.localStorage.setItem("fcm_token", fcmToken);
            if (window.localStorage.getItem("user_id") && fcmToken != FCM_TOKEN) {
                try {
                    HELPER.ajax({
                        url: BASE_URL + "Login/changeToken",
                        data: {
                            user_id: window.localStorage.getItem("user_id"),
                            new_token: fcmToken,
                            old_token: oldToken,
                        },
                        success: function (res) {
                            FCM_TOKEN = fcmToken;
                            // console.log(res)
                        },
                    });
                } catch (error) {
                    
                }
            }
        }, function(error) {
            console.error(error);
        });
    } catch (error) {
        
    }
}

function setupOnNotification() {
    try {
        FirebasePlugin.onMessageReceived(function(message) {
            console.log("Message type: " + message.messageType);
            if(message.messageType === "notification"){
                console.log("Notification message received");
                if(message.tap){
                    console.log("Tapped in " + message.tap);
                }
                showNotif(message);
            }
            console.log(message)
        }, function(error) {
            console.error(error);
        });
    } catch (error) {
        
    }
}

function logFCMToken(tries = 100) {
    try {
        FirebasePlugin.getToken(function(fcmToken) {
            window.localStorage.setItem("fcm_token", fcmToken);
            FCM_TOKEN = fcmToken;
        }, function(error) {
            if (tries>0) {
                tries--;
                logFCMToken(tries)
            }
        });
    } catch (error) {
        
    }
}

function waitForPermission(callback) {
    try {
        FirebasePlugin.hasPermission(function(hasPermission){
            if (hasPermission) {
                callback();
            } else {
                console.log("Permission is push notif " + (hasPermission ? "granted" : "denied"));
            }
        });
    } catch (error) {
        
    }
}

function setupListeners() {
    waitForPermission(function () {
        // Define custom  channel - all keys are except 'id' are optional.
        var channel  = {
            // channel ID - must be unique per app package
            id: "notif_fcm",

            // Channel description. Default: empty string
            description: "Notifikasi Pemberitahuan",

            // Channel name. Default: empty string
            name: "Notifikasi Pemberitahuan",

            //The sound to play once a push comes. Default value: 'default'
            //Values allowed:
            //'default' - plays the default notification sound
            //'ringtone' - plays the currently set ringtone
            //'false' - silent; don't play any sound
            //filename - the filename of the sound file located in '/res/raw' without file extension (mysound.mp3 -> mysound)
            sound: "default",

            //Vibrate on new notification. Default value: true
            //Possible values:
            //Boolean - vibrate or not
            //Array - vibration pattern - e.g. [500, 200, 500] - milliseconds vibrate, milliseconds pause, vibrate, pause, etc.
            vibration: true,

            // Whether to blink the LED
            light: true,

            //LED color in ARGB format - this example BLUE color. If set to -1, light color will be default. Default value: -1.
            lightColor: parseInt("00926F", 16).toString(),

            //Importance - integer from 0 to 4. Default value: 4
            //0 - none - no sound, does not show in the shade
            //1 - min - no sound, only shows in the shade, below the fold
            //2 - low - no sound, shows in the shade, and potentially in the status bar
            //3 - default - shows everywhere, makes noise, but does not visually intrude
            //4 - high - shows everywhere, makes noise and peeks
            importance: 4,

            //Show badge over app icon when non handled pushes are present. Default value: true
            badge: true,

            //Show message on locked screen. Default value: 1
            //Possible values (default 1):
            //-1 - secret - Do not reveal any part of the notification on a secure lockscreen.
            //0 - private - Show the notification on all lockscreens, but conceal sensitive or private information on secure lockscreens.
            //1 - public - Show the notification in its entirety on all lockscreens.
            visibility: 1,

            // Optionally specify the usage type of the notification. Defaults to USAGE_NOTIFICATION_RINGTONE ( =6)
            // For a list of all possible usages, see https://developer.android.com/reference/android/media/AudioAttributes.Builder#setUsage(int)

            usage: 6,
            // Optionally specify the stream type of the notification channel.
            // For a list of all possible values, see https://developer.android.com/reference/android/media/AudioAttributes.Builder#setLegacyStreamType(int)
            streamType: 5,
        };

        // Create the channel
        FirebasePlugin.createChannel(channel,
        function(){
            console.log('Channel created: ' + channel.id);
        },
        function(error){
        console.log('Create channel error: ' + error);
        });
        logFCMToken();
        setupOnTokenRefresh();
        setupOnNotification();
    });
}

function runBackgroundCmd(log) {
    var dataPayload = log;
    try {
        if (dataPayload.type == "refresh-sales-data") {
            if (checkIsKios() || checkIsTrader()) {
                getSalesInfoKios();
            } else if (!HELPER.isNull(HELPER.getItem("user_google_id"))) {
                getSalesInfo();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function readNotifManual(idd) {
    return new Promise((resolve) => {
        HELPER.ajax({
            url: BASE_URL + "Main/getNotifManual",
            data: { id: idd },
            type: "POST",
            dataType: "JSON",
            complete: function (data) {
                resolve(data);
            },
        });
    });
}

function switchPage(key) {
    switch (key) {
        case "cuaca":
            return "cuaca";
        case "artikel":
            return "informasi";
        case "lahan":
            return "lokasi-lahan";
        case "jadwal":
            return "jadwal-kalendar";
        case "budidaya":
            return "budidaya";
        case "aut":
            return "petani-roi";
        case "produk":
            return "rekomendasi-produk";
        case "kalkulator_benih":
            return "kalkulasi-kebutuhan-benih";
        case "kalkulator_pupuk":
            return "kalkulasi-dosis-pupuk";
        case "kalkulator_hpt":
            return "hpt-hamatanaman";
        case "daftar_trader":
            return "list-trader";
        case "daftar_kios":
            return "list-kios";
        case "scan":
            return "history-scan-farmer";
        case "poin":
            return "voucher";
        case "nearby":
            return "sales-wilayah";
        case "list-ecommerce":
            return "list-ecommerce";
        default:
            return "main";
    }
}

document.addEventListener("deviceready", setupListeners, false);
