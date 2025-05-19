    // var BASE_URL        = 'https://syngenta-project.skwn.dev/qrdev/index.php/MobileApp/';
    // var BASE_ASSETS     = 'https://syngenta-project.skwn.dev/qrdev/dokumen/';

    var BASE_URL        = 'https://petani-nk.com/index.php/MobileApp/';
    var BASE_ASSETS     = 'https://petani-nk.com/dokumen/';

    var WEB_CLIENT_ID   = '144271624253-5tm80d6inir251q6dls4ge9sr281fnhn.apps.googleusercontent.com';
    var FCM_TOKEN = null;


    var USER_LAT = null;
    var USER_LONG = null;
    var USER_LAST_LAT  = null;
    var USER_LAST_LONG = null;
    var colorArray = ["color-plum-light", "color-plum-dark", "color-violet-light", "color-violet-dark", "color-magenta3-light", "color-magenta3-dark", "color-red3-light", "color-red3-dark", "color-green3-light", "color-green3-dark", "color-sky-light", "color-sky-dark", "color-pumpkin-light", "color-pumpkin-dark", "color-dark3-light", "color-dark3-dark", "color-yellow3-light", "color-yellow3-dark", "color-red1-light", "color-red1-dark", "color-red2-light", "color-red2-dark", "color-orange-light", "color-orange-dark", "color-yellow1-light", "color-yellow1-dark", "color-yellow2-light", "color-yellow2-dark", "color-green1-light", "color-green1-dark", "color-green2-light", "color-green2-dark", "color-mint-light", "color-mint-dark", "color-teal-light", "color-teal-dark", "color-aqua-light", "color-aqua-dark", "color-blue1-light", "color-blue1-dark", "color-blue2-light", "color-blue2-dark", "color-magenta1-light", "color-magenta1-dark", "color-magenta2-light", "color-magenta2-dark", "color-pink1-light", "color-pink1-dark", "color-pink2-light", "color-pink2-dark", "color-brown1-light", "color-brown1-dark", "color-brown2-light", "color-brown2-dark", "color-gray1-light", "color-gray1-dark", "color-gray2-light", "color-gray2-dark", "color-dark1-light", "color-dark1-dark", "color-dark2-light", "color-dark2-dark"];


    document.addEventListener('deviceready', init_first, false);

    function onPage(name) {
        window.localStorage.removeItem('is_first_open')
        if (name == 'index') {
            window.location = 'index.html'
        } else {
            if (name == "main" && parseInt(HELPER.getItem('is_petugas')) > 0) { name = shouldGoTo(); }
            else if (name == "main-qcs" && !checkIsPetugas()) { name = shouldGoTo(); }
            else if (name == "main-sales" && !checkIsSales()) { name = shouldGoTo(); }
            else if (name == "main-kios" && !checkIsKios()) { name = shouldGoTo(); }
            else if (name == "main-trader" && !checkIsTrader()) { name = shouldGoTo(); }
            setTimeout(function () {
                try {
                    FirebasePlugin.setScreenName(name);
                    FirebasePlugin.logEvent("sv_"+name.replace('-', '_'), {nk_user_id: HELPER.getItem('user_id'), nk_page_name: name});
                    facebookConnectPlugin.logEvent("sv_"+name.replace('-', '_'), {nk_user_id: HELPER.getItem('user_id'), nk_page_name: name}, 1, ()=>{}, ()=>{})
                } catch (error) {
                    console.log(error);
                }
                $('#btn-go-to-' + name).click()
                if (name == 'sales-wilayah') {
                    window.localStorage.removeItem('nearby_kategory')
                    HELPER.setItem('nearby_base_location', 1);
                }
                setTimeout(() => {
                    setLangApp()
                }, 500);
            }, 200);
        }
    }

    function shouldGoTo() {
        if (parseInt(HELPER.getItem('is_petugas')) == 0 || HELPER.getItem('user_is_petugas') == null) { return "main"; }
        else if (checkIsPetugas()) { return "main-qcs"; }
        else if (checkIsSales()) { return "main-sales"; }
        else if (checkIsKios()) { return "main-kios"; }
        else if (checkIsTrader()) { return "main-trader"; }
    }

    function init_first() {
        if (parseInt(HELPER.getItem("user_language")) == 0) {
            moment.locale("id");
        }
        reqLocPermission()
        init_global()
        loadGlobalConfig()
        preventBackButton()
        behaviorNotif()
        checkHasSalesOrNot()
        setTimeout(function () {
            checkSessionOver()
            setupOnTokenRefresh()
        }, 3000)
        getSalesInfo()
        window.addEventListener('online',  updateOnlineStatus);
        window.addEventListener('offline', updateOfflineStatus);
        navigator.geolocation.getCurrentPosition(function (pos) {
            USER_LAST_LAT  = pos.coords.latitude;
            USER_LAST_LONG = pos.coords.longitude;
        });
    }

	function init_global() {
        if (window.MobileAccessibility) {
            window.MobileAccessibility.usePreferredTextZoom(false);
        }
        if (FCM_TOKEN == null) {
            logFCMToken();
        }
        if (HELPER.isNull(HELPER.getItem('status_acc_snk')) || parseInt(HELPER.getItem('status_acc_snk')) == 0) {
            setTimeout(function () {
                if ($('.halaman-splash').length <= 0) {
                    onPage('index')
                }
            }, 500)
        }else if ($('.halaman-login, .halaman-verifikasi').length <= 0) {
            if (HELPER.isNull(HELPER.getItem('user_id')) || HELPER.isNull(HELPER.getItem('status_acc_snk')) || parseInt(HELPER.getItem('status_acc_snk')) == 0) { 
                if (HELPER.getItem('user_verifikasi') == null) {
                    onPage('login') 
                }else if (HELPER.getItem('user_verifikasi') == "false" && HELPER.getItem('user_verifikasi_type') == 'login') {
                    onPage('email-verifikasi')
                }else if (HELPER.getItem('user_verifikasi') == "false" && HELPER.getItem('user_verifikasi_type') == 'forgot_password') {
                    onPage('email-verifikasi-forgot-password')
                }else if (HELPER.getItem('user_verifikasi') == "true" && HELPER.getItem('user_verifikasi_type') == 'forgot_password') {
                    onPage('create-new-password')
                }else if (HELPER.getItem('user_verifikasi') == "true" && HELPER.getItem('user_verifikasi_type') == 'acc') {
                    onPage('waiting-acc')
                }
            }else{
                setTimeout(function () {
                    if (HELPER.isNull(HELPER.getItem('user_lat')) || HELPER.isNull(HELPER.getItem('user_long'))) {
                        reqLocPermission()
                    }else{
                        USER_LAT = HELPER.getItem('user_lat');
                        USER_LONG = HELPER.getItem('user_long');
                    }
                    try {
                        FirebasePlugin.setUserId(HELPER.getItem('user_id'));
                        FirebasePlugin.setUserProperty("name", HELPER.getItem('user_nama'));
                    } catch (error) {
                        console.log(error);
                    }
                }, 300)
                cekTokenLogin()
            }
        }
        if (checkIsPetugas()) {
            $('[data-roleable="true"]').hide()
            setTimeout(function () {
                $('[data-role="qcs"]').show()
            }, 300)
            $('.menu-default').hide()
            $('.menu-qcs').show()
            $('#footer-menu').removeClass('footer-menu-3-icons').addClass('footer-menu-2-icons')
        }
        if (checkIsSales()) {
            loadJS('assets/page/sales/global-sales.js')
        }
        $(window).on('scroll', () => {
            if ($(this).scrollTop() > 20) {
                $('.header.header-fixed').addClass('header-active')
            } else {
                $('.header.header-fixed').removeClass('header-active')
            }
        })
        setTimeout(() => {
            checkForUpdate()
            setLangApp()
        }, 500);
        setTimeout(() => {
            $('.plus-menu-label').hide(15000)
        }, 10000);
        try {
            installReferrer.getReferrer(function (params) {
                if (params && params.utm_source) {
                    try {
                        FirebasePlugin.logEvent("utm_source", {source: params.utm_source});
                        facebookConnectPlugin.logEvent("utm_source", {source: params.utm_source}, 1, ()=>{}, ()=>{})
                    } catch (error) {
                    }
                }
                console.log(params)
            }, function (err) {
                console.log(err)
            });
        } catch (ee) {
            
        }
	}

    function loadGlobalConfig() {
        HELPER.ajax({
            url: BASE_URL+'Main/loadGlobalConfig',
            complete: function (res) {
                $.each(res.data, function(i, v) {
                    HELPER.setItem('global_config_'+v.conf_code, v.conf_value)
                });
            }
        })
    }

    function loadJS(url){
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.type = "text/javascript";
        document.body.appendChild(scriptTag);
    }

    function checkIsPetani() {
        if (HELPER.isNull(HELPER.getItem('user_google_id'))) {
            return false;
        } else {
            return true;
        }
    }

    function checkIsPetugas() {
        if (parseInt(HELPER.getItem('is_petugas')) == 1) {
            return true;
        } else {
            return false;
        }
    }

    function checkIsSampling() {
        if (parseInt(HELPER.getItem('jabatan_is_sampling')) == 1) {
            return true;
        } else {
            return false;
        }
    }

    function checkIsSales() {
        if (parseInt(HELPER.getItem('is_petugas')) == 2) {
            return true;
        } else {
            return false;
        }
    }

    function checkIsKios() {
        if (parseInt(HELPER.getItem('is_petugas')) == 3) {
            return true;
        } else {
            return false;
        }
    }

    function checkIsTrader() {
        if (parseInt(HELPER.getItem('is_petugas')) == 4) {
            return true;
        } else {
            return false;
        }
    }

    function onLogout() {
        HELPER.confirm({
            title: 'Info',
            message: 'Anda ingin keluar ?',
            allowOutsideClick: false,
            callback: function (has) {
                if (has) {
                    runLogout();
                }
            },
        });
    }

    function cekTokenLogin() {
        if (!HELPER.isNull(window.interval_login)) {
            clearInterval(window.interval_login);
        }
        setTimeout(function () {
            window.interval_login = setInterval(function () {
                if (HELPER.getItem('user_id') && !HELPER.isNull(FCM_TOKEN)) {
                    $.ajax({
                        url: BASE_URL + "Login/cekTokenLogin",
                        type: "POST",
                        dataType: "json",
                        data: {
                            user: HELPER.getItem('user_id'),
                            token: FCM_TOKEN,
                        },
                        success: function (res) {
                            if (res.success == false) {
                                // runLogout('Sesi Anda telah habis !')
                                HELPER.ajax({
                                    url: BASE_URL + "Login/changeToken",
                                    data: {
                                        user_id: window.localStorage.getItem("user_id"),
                                        new_token: FCM_TOKEN,
                                        // old_token: oldToken,
                                    },
                                    success: function (res) {
                                        // console.log(res)
                                    },
                                });
                            }
                        }
                    })
                }
            }, 300000)
        }, 500)
    }

    function reqLocPermission() {
        cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
            console.log("Location is " + (authorized ? "authorized" : "unauthorized"));
            if (!authorized) {
                cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                    switch(status){
                        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                            console.log("Permission not requested");
                            Swal.fire({
                                title: 'Ijin tidak diberikan !',
                                text: "Aplikasi ini membutuhkan ijin untuk menentukan lokasi Anda sekarang !",
                                icon: 'warning',
                                backdrop: true,
                                allowOutsideClick: false,
                                showCancelButton: true,
                                confirmButtonText: 'Ya, berikan.',
                                cancelButtonText: 'Keluar aplikasi'
                            }).then((result) => {
                                if (result.value) {
                                    reqLocPermission()
                                } else {
                                    navigator.app.exitApp();
                                }
                            });
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                            console.log("Permission denied");
                            Swal.fire({
                                title: 'Ijin tidak diberikan !',
                                text: "Aplikasi ini membutuhkan ijin untuk menentukan lokasi Anda sekarang !",
                                icon: 'warning',
                                backdrop: true,
                                allowOutsideClick: false,
                                showCancelButton: true,
                                confirmButtonText: 'Ya, berikan.',
                                cancelButtonText: 'Keluar aplikasi'
                            }).then((result) => {
                                if (result.value) {
                                    reqLocPermission()
                                } else {
                                    navigator.app.exitApp();
                                }
                            });
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                            Swal.fire({
                                title: 'Ijin tidak diberikan sama sekali !',
                                text: "Aplikasi ini membutuhkan ijin untuk menentukan lokasi Anda sekarang, untuk memberikannya silahkan melalui pengaturan aplikasi dan berikan ijin lokasi !",
                                icon: 'warning',
                                backdrop: true,
                                allowOutsideClick: false,
                                showCancelButton: true,
                                confirmButtonText: 'Ya, ke pengaturan.',
                                cancelButtonText: 'Keluar aplikasi'
                            }).then((result) => {
                                if (result.value) {
                                    setTimeout(function () {
                                        navigator.app.exitApp();
                                    }, 200)
                                    cordova.plugins.diagnostic.switchToSettings();
                                } else {
                                    navigator.app.exitApp();
                                }
                            });
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                            console.log('GRANTED')
                            refreshLoc()
                            break;
                        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                            console.log('GRANTED_WHEN_IN_USE')
                            refreshLoc()
                            break;
                    }
                }, function(error){
                    console.error(error);
                });
            }else{
                refreshLoc()
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        });
    }

    function refreshLoc() {
        cordova.plugins.diagnostic.isLocationAvailable(function (props) {
            if (props) {
                HELPER.showProgress({
                    title: '',
                    time: 10000,
                    allowOutsideClick: false,
                })
                navigator.geolocation.getCurrentPosition(function (pos) {
                    USER_LAT = pos.coords.latitude;
                    USER_LONG = pos.coords.longitude;
                    Swal.close();
                });
            }else{
                Swal.fire({
                    title: 'GPS Nonaktif !',
                    text: "Aplikasi ini membutuhkan GPS untuk menentukan lokasi Anda sekarang, Klik Ya untuk mengaktifkan GPS !",
                    icon: 'warning',
                    backdrop: true,
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonText: 'Ya, aktifkan.',
                    cancelButtonText: 'Keluar aplikasi'
                }).then((result) => {
                    if (result.value) {
                        cordova.plugins.diagnostic.switchToLocationSettings();
                        navigator.app.exitApp();
                    } else {
                        navigator.app.exitApp();
                    }
                });
            }
        }, function (err) {
            console.log(err)
        })
    }

    function runLogout(customTitle = 'Berhasil Keluar') {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL + 'Login/logout',
            data: {
                user_id: HELPER.getItem('user_id'),
                token: FCM_TOKEN,
            },
            success: function () {
                var accSnk = HELPER.getItem('status_acc_snk');
                window.localStorage.clear();
                HELPER.setItem('status_acc_snk', accSnk)
                try {
                    FirebasePlugin.unregister();
                    window.plugins.googleplus.logout()
                } catch(e) {
                    console.log(e);
                }
                HELPER.showProgress({
                    title: customTitle,
                    message: 'Sedang mengkonfigurasi tampilan, mohon menunggu ...',
                    time: 3000,
                    callback: function () {
                        onPage('login')
                    }
                })
            },
            error: function () {
                clearInterval(window.interval_login)
                var accSnk = HELPER.getItem('status_acc_snk');
                window.localStorage.clear();
                HELPER.setItem('status_acc_snk', accSnk)
                try {
                    FirebasePlugin.unregister();
                    window.plugins.googleplus.logout()
                } catch(e) {
                    console.log(e);
                }
                HELPER.showProgress({
                    title: customTitle,
                    message: 'Sedang mengkonfigurasi tampilan, mohon menunggu ...',
                    time: 3000,
                    callback: function () {
                        onPage('login')
                    }
                })
            }
        })
    }

    function cekLastPassword() {
        if ($('.halaman-login').length <= 0) {
            if (HELPER.getItem('user_id') != "" && HELPER.getItem('user_id') != null) { 
                HELPER.ajax({
                    url: BASE_URL + 'Login/cekLastPassword',
                    data: {user: HELPER.getItem('user_id')},
                    complete: function (res) {
                        if (res.success) {
                            var date = moment(res.data.date)
                            var diff = moment().diff(date, 'days')
                            if (diff >= 80 && diff <= 90) {
                                HELPER.showMessage({
                                    success: 'warning',
                                    title: 'Perhatian !',
                                    message: 'Segera melakukan penggantian password untuk keamanan !'
                                })
                            }else if (diff > 90) {
                                HELPER.showMessage({
                                    success: 'warning',
                                    title: 'Perhatian !',
                                    message: 'Anda tidak melakukan penggantian password lebih dari 90 hari, silahkan menghubungi Admin untuk reset password',
                                    allowOutsideClick: false,
                                    callback: function () {
                                        runLogout()
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
    }

    function scanPouch() {
        scanOpen(function (result) {
            cekPouch(result)
        }, function (error) {
            HELPER.showMessage({
                title: 'Gagal !!',
                message: "Scanning failed: " + error
            })
        })
        /* cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    cekPouch(result.text)
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

    function cekPouch(text = null, batch_no = null, pouch_no = null) {
        FirebasePlugin.logEvent("farmer_scan_product_click", {nk_user_id: HELPER.getItem('user_id'), nk_user_province: HELPER.getItem('user_province_name'), nk_user_region: HELPER.getItem('user_region_name')});
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL + 'Scan/commercial',
            data: {
                user_id: HELPER.getItem('user_id'),
                qrcode: text,
                batch_no: batch_no,
                pouch_no: pouch_no,
                user_lat: USER_LAST_LAT,
                user_long: USER_LAST_LONG,
            },
            success: function (res) {
                HELPER.unblock()
                if (res.success) {
                    FirebasePlugin.logEvent("farmer_scan_product_active", {nk_user_id: HELPER.getItem('user_id'), nk_user_province: HELPER.getItem('user_province_name'), nk_user_region: HELPER.getItem('user_region_name')});
                    if (res.data.type == "pouch" && res.data.pouch_qr_code.indexOf("http") >= 0) {
                        if (parseInt(HELPER.getItem('configSettScanReaderAkumulation')) == 1) {
                            if (HELPER.getItem('configSettScanReader') == "sett_data_scan_read_syngenta") {
                                HELPER.unblock()
                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Scan Berhasil!',
                                    message: 'Produk terdaftar dan Anda mendapatkan poin!',
                                    callback:function(){
                                        // setTimeout(function () {
                                            onPage('detail-scan')
                                        // }, 100)
                                    }
                                })
                            } else {
                                HELPER.unblock()
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Scan Berhasil!',
                                    message: 'Produk terdaftar dan Anda mendapatkan poin!',
                                    callback:function(){
                                        window.open(res.data.pouch_link)
                                    }
                                })
                            }
                        } else {
                            HELPER.block()
                            HELPER.showMessage({
                                success: true,
                                title: 'Scan Berhasil!',
                                message: 'Produk terdaftar dan Anda mendapatkan poin!',
                                callback:function(){
                                    $('#btn-scan-choose').click()
                                }
                            })
                            $('#btn-choose-scan-app').off('click')
                            $('#btn-choose-scan-browser').off('click')
                            setTimeout(function () {
                                $('#btn-choose-scan-app').on('click', function (e) {
                                    HELPER.unblock()
                                    HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                    setTimeout(function () {
                                        onPage('detail-scan')
                                    }, 100)
                                });
                                $('#btn-choose-scan-browser').on('click', function (e) {
                                    HELPER.unblock()
                                    window.open(res.data.pouch_link)
                                });
                            }, 500)
                        }
                    } else {
                        HELPER.showMessage({
                            success: true,
                            title: 'Scan Berhasil!',
                            message: 'Produk terdaftar!',
                            callback:function(){
                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                onPage('detail-scan')
                            }
                        })
                        // setTimeout(function () {
                        // }, 100)
                    }
                } else {
                    if (res.type == "expired") {
                        FirebasePlugin.logEvent("farmer_scan_product_expired", {nk_user_id: HELPER.getItem('user_id'), nk_user_province: HELPER.getItem('user_province_name'), nk_user_region: HELPER.getItem('user_region_name')});
                    }else if(res.type == "non-aktif"){
                        FirebasePlugin.logEvent("farmer_scan_product_inactive", {nk_user_id: HELPER.getItem('user_id'), nk_user_province: HELPER.getItem('user_province_name'), nk_user_region: HELPER.getItem('user_region_name')});
                    }else if(res.type == "not-found"){
                        FirebasePlugin.logEvent("farmer_scan_product_notfound", {nk_user_id: HELPER.getItem('user_id'), nk_user_province: HELPER.getItem('user_province_name'), nk_user_region: HELPER.getItem('user_region_name')});
                    }
                    showFailedScan(res.message, true, text, res.type)
                }
            },
            error: function (err) {
                HELPER.unblock()
                HELPER.showMessage({
                    success: false,
                    title: 'Failed !',
                    message: 'Oops, terjadi kesalahan teknis.'
                })
            }
        })
    }

    function cekSampling(text = null, batch_no = null, pouch_no = null) {
        HELPER.block()
        HELPER.ajax({
            url: BASE_URL + 'Scan/sampling',
            data: {
                user_id: HELPER.getItem('user_id'),
                qrcode: text,
                batch_no: batch_no,
                pouch_no: pouch_no,
                user_lat: USER_LAST_LAT,
                user_long: USER_LAST_LONG,
            },
            success: function (res) {
                HELPER.unblock()
                if (res.success) {
                    if (res.data.type == "pouch" && res.data.pouch_qr_code.indexOf("http") >= 0) {
                        if (parseInt(HELPER.getItem('configSettScanReaderAkumulation')) == 1) {
                            if (HELPER.getItem('configSettScanReader') == "sett_data_scan_read_syngenta") {
                                HELPER.unblock()
                                HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                setTimeout(function () {
                                    onPage('detail-scan')
                                }, 100)
                            } else {
                                HELPER.unblock()
                                window.open(res.data.pouch_link)
                            }
                        } else {
                            HELPER.block()
                            $('#btn-choose-scan-app').off('click')
                            $('#btn-choose-scan-browser').off('click')
                            setTimeout(function () {
                                $('#btn-choose-scan-app').on('click', function (e) {
                                    HELPER.unblock()
                                    HELPER.setItem('detail_scan', JSON.stringify(res.data));
                                    setTimeout(function () {
                                        onPage('detail-scan')
                                    }, 100)
                                });
                                $('#btn-choose-scan-browser').on('click', function (e) {
                                    HELPER.unblock()
                                    window.open(res.data.pouch_link)
                                });
                            }, 500)
                            $('#btn-scan-choose').click()
                        }
                    } else {
                        HELPER.setItem('detail_scan', JSON.stringify(res.data));
                        setTimeout(function () {
                            onPage('detail-scan')
                        }, 100)
                    }
                } else {
                    HELPER.unblock()
                    $('#show-msg-error-sampling').text(HELPER.nullConverter(res.message))
                    $('#btn-sampling-failed').click();
                }
            },
            error: function (err) {
                HELPER.unblock()
                HELPER.showMessage({
                    success: false,
                    title: 'Failed !',
                    message: 'Oops, terjadi kesalahan teknis.'
                })
            }
        })
    }

    function showFailedScan(message=null, load_history=true, code=null, type=null, show_sales=true) {
        if (message == null) {
            if (checkIsPetani()) {
                message = 'Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli, atau hubungi tim lapangan kami di wilayah Anda:';
            }else{
                message = 'QR Code Anda terdaftar, namun QR Code sudah di Scan oleh petani. Mohon cek keaslian produk Anda';
            }
        }
        $('#show-sales').html('')
        var addMesg = (code != null) ? `<span class="font-11" style="display: block;white-space:normal;word-break:break-all;"><code>${code}</code></span>` : "";
        $('#show-msg-error').html(addMesg+message);

        if (show_sales) {
            var dataSales   = HELPER.getItem('configDataSales') == null ? [] : JSON.parse(HELPER.getItem('configDataSales'))
            var dataManager = HELPER.getItem('configDataManager') == null ? [] : JSON.parse(HELPER.getItem('configDataManager'))
            if (dataSales.length) {
                $.each(dataSales, function(i, v) {
                    var linkNo = "#";
                    if (v.user_telepon) {
                        if (v.user_telepon.charAt(0) == "0") {
                            linkNo = "62" + v.user_telepon.substring(1)
                        } else if (v.user_telepon.charAt(0) == "+") {
                            linkNo = v.user_telepon.substring(1)
                        } else if (v.user_telepon.charAt(0) != "6") {
                            linkNo = "62" + v.user_telepon.substring(1)
                        } else {
                            linkNo = v.user_telepon
                        }
                    }
                    $('#show-sales').append(`
                        <div class="row left-10 top-5 right-10 bottom-5" style="border-bottom: 1px solid #f1f1f1;padding-bottom:5px;">
                            <div class="col">
                                ${HELPER.nullConverter(v.user_nama)} (${HELPER.nullConverter(v.user_telepon)})
                            </div>
                            <div class="col-auto text-right">
                                <a href="javascript:void(0)" id="btn-popup-telp-${v.user_id}">
                                    <img src="assets/images/icons/whatsapp.png">
                                </a>
                            </div>
                        </div>
                    `)
                    $('#btn-popup-telp-'+v.user_id).off('click');
                    $('#btn-choose-telp-wa').off('click');
                    $('#btn-choose-telp-phone').off('click');
                    setTimeout(function () {
                        var linkWaMe = `https://wa.me/${linkNo}?text=Gagal%20scan%20product%20!`;
                        $('#btn-popup-telp-'+v.user_id).on('click', function(e) {
                            $('#btn-choose-telp-wa').on('click', function() {
                                window.location.href = linkWaMe

                                HELPER.ajax({
                                    url: BASE_URL + 'Trader/clickLog',
                                    data: {
                                        user: v.user_id,
                                        type: 3,
                                        petani: HELPER.getItem('user_id')
                                    },
                                    complete: function (res) {
                                    }
                                })
                            });
                            $('#btn-choose-telp-phone').on('click', function() {
                                window.location.href = 'tel://'+linkNo
                            });
                            $('#btn-telp-choose').click()
                        });
                    }, 200)
                });
            }
            if (dataManager.length) {
                $.each(dataManager, function(i, v) {
                    var linkNo = "#";
                    if (v.user_telepon) {
                        if (v.user_telepon.charAt(0) == "0") {
                            linkNo = "62" + v.user_telepon.substring(1)
                        } else if (v.user_telepon.charAt(0) == "+") {
                            linkNo = v.user_telepon.substring(1)
                        } else if (v.user_telepon.charAt(0) != "6") {
                            linkNo = "62" + v.user_telepon.substring(1)
                        } else {
                            linkNo = v.user_telepon
                        }
                    }
                    $('#show-sales').append(`
                        <div class="row left-10 top-5 right-10 bottom-5" style="border-bottom: 1px solid #f1f1f182;padding-bottom:5px;">
                            <div class="col">
                                ${HELPER.nullConverter(v.user_nama)} (${HELPER.nullConverter(v.user_telepon)})
                            </div>
                            <div class="col-auto text-right">
                                <a href="javascript:void(0)" id="btn-popup-telp-${v.user_id}">
                                    <img src="assets/images/icons/whatsapp.png">
                                </a>
                            </div>
                        </div>
                    `)
                    $('#btn-popup-telp-'+v.user_id).off('click');
                    $('#btn-choose-telp-wa').off('click');
                    $('#btn-choose-telp-phone').off('click');
                    setTimeout(function () {
                        var linkWaMe = `https://wa.me/${linkNo}?text=Gagal%20scan%20product%20!`;
                        $('#btn-popup-telp-'+v.user_id).on('click', function(e) {
                            HELPER.block()
                            $('#btn-choose-telp-wa').on('click', function() {
                                window.location.href = linkWaMe

                                HELPER.ajax({
                                    url: BASE_URL + 'Trader/clickLog',
                                    data: {
                                        user: v.user_id,
                                        type: 3,
                                        petani: HELPER.getItem('user_id')
                                    },
                                    complete: function (res) {
                                    }
                                })
                            });
                            $('#btn-choose-telp-phone').on('click', function() {
                                window.location.href = 'tel://'+linkNo
                            });
                            $('#btn-telp-choose').click()
                        });
                    }, 200)
                });
            }
            if (dataSales.length == 0 && dataManager.length == 0) {
                $('#show-sales').append(`
                    <div class="row left-10 top-5 right-10 bottom-5" style="border-bottom: 1px solid #f1f1f182;padding-bottom:5px;">
                        <div class="col text-center">
                            <b>syngenta.qrcomm@gmail.com</b>
                        </div>
                    </div>
                `)
            }
        }
        
        if (type == 'not-found') {
            $('#menu-scan-failed .img-failed-scan').prop('src', 'assets/images/pictures/qr-not-found.svg').show()
        }else if (type == 'expired') {
            $('#menu-scan-failed .img-failed-scan').prop('src', 'assets/images/pictures/qr-expired.svg').show()
        }else if (type == 'non-aktif') {
            $('#menu-scan-failed .img-failed-scan').prop('src', 'assets/images/pictures/qr-non-aktif.svg').show()
        }else{
            $('#menu-scan-failed .img-failed-scan').hide()
        }
        $('#btn-scan-failed').click()
        if (load_history && $('.halaman-main').length >= 1 && typeof loadScanHistroyMain === "function") { loadScanHistroyMain() }
        if ($('.halaman-detail-scan').length > 0) { onPage('main') }
    }

    function loadSession() {
        HELPER.ajax({
            url: BASE_URL+'Login/loadSession',
            data: {user_id: HELPER.getItem('user_id'), type: HELPER.getItem('is_petugas')},
            complete: function (res) {
                if (res.success && res.data) {
                    $.each(res.data,function(i,v){
                        window.localStorage.setItem(i,v);
                    });
                }
            }
        })
    }

    function preventBackButton() {
        var lastTimeBackPress = 0;
        var timePeriodToExit = 2000;

        function onBackKeyDown(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                QRScanner.getStatus((stt)=>{
                    if (stt.showing) {
                        scanClose()
                    }else if ($('.page-title-small .fa.fa-arrow-left:first').length > 0) {
                        $('.page-title-small .fa.fa-arrow-left:first').click()
                    } else {
                        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                            navigator.app.exitApp();
                        } else {
                            window.plugins.toast.showWithOptions(
                                {
                                    message: "Press again to exit.",
                                    duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                                    position: "bottom",
                                    addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                }
                            );
        
                            lastTimeBackPress = new Date().getTime();
                        }
                    }
                })
            } catch (error) {
                if ($('.page-title-small .fa.fa-arrow-left:first').length > 0) {
                    $('.page-title-small .fa.fa-arrow-left:first').click()
                } else {
                    if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                        navigator.app.exitApp();
                    } else {
                        window.plugins.toast.showWithOptions(
                            {
                                message: "Press again to exit.",
                                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                                position: "bottom",
                                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                            }
                        );
    
                        lastTimeBackPress = new Date().getTime();
                    }
                }
                console.log(error);
            }
            
        };

        document.addEventListener("backbutton", onBackKeyDown, false);

        window.interval_backdrop = setInterval(function () {
            if ($('.menu.menu-box-modal.menu-active').length > 0 || $('.menu.menu-box-bottom.menu-active').length) {
                $('.menu-hider').addClass('menu-active')
                if ($('.menu.menu-box-modal.menu-active.set-no-click').length > 0 || $('.menu.menu-box-bottom.menu-active.set-no-click').length > 0) {
                    $('.menu-hider').addClass('menu-active no-click')
                }
            }
        }, 500)
    }

    function generateSales() {
        HELPER.ajax({
            url: BASE_URL+'Sales/generateSales',
            data: {
                user_id: HELPER.getItem('user_id'),
                lat: HELPER.getItem('user_lat'),
                long: HELPER.getItem('user_long'),
            },
            complete: function (res) {
                if (res.success) {
                    getSalesInfo()
                }
            }
        })
    }

    function getSalesInfo() {
        var u_id = HELPER.getItem('user_id');
        if (u_id) {
            var configDataSales = [];
            var configDataManager = [];
            HELPER.ajax({
                url: BASE_URL+'Sales/getSalesInfo',
                data: {user_id: u_id},
                complete: function (res) {
                    if (res.success) {
                        configDataSales = JSON.stringify(res.data)
                        configDataManager = JSON.stringify([])
                        HELPER.setItem('configDataSales', configDataSales)
                        HELPER.setItem('configDataManager', configDataManager)
                    }
                }
            })
        }
    }

    function getSalesKios(){
        var u_id = HELPER.getItem('user_id');
        if (u_id) {
            var configDataSales = [];
            HELPER.ajax({
                url: BASE_URL+'Sales/getSalesKios',
                data: {user_id: u_id},
                complete: function (res) {
                    if (res) {
                        configDataSales =JSON.stringify(res.data)
                        HELPER.setItem('configDataSales', configDataSales)
                    }
                }
            })
        }
    }

    function getSalesTrader(){
        var u_id = HELPER.getItem('user_id');
        if (u_id) {
            var configDataSales = [];
            HELPER.ajax({
                url: BASE_URL+'Sales/getSalesTrader',
                data: {user_id: u_id},
                complete: function (res) {
                    if (res.success) {
                        configDataSales =JSON.stringify(res.data)
                        HELPER.setItem('configDataSales', configDataSales)
                    }
                }
            })
        }
    }

    function checkForUpdate(checkAuto = true) {
        try {
            cordova.getAppVersion.getVersionCode().then(function (versionNow) {
                HELPER.ajax({
                    url: BASE_URL+'Main/getLatestVersion',
                    data: {user_id: HELPER.getItem('user_id'),type: HELPER.getItem('is_petugas')},
                    complete: function (res) {
                        if (versionNow < parseInt(res.latest)) {
                            var isMustUpdate = false;
                            try {
                                if (!HELPER.isNull(res.version_required)) {
                                    var requiredRole = res.version_required.split(',');
                                    $.each(requiredRole, function (i, v) { 
                                        if (parseInt(v) == 0 && checkIsPetani()) {
                                            isMustUpdate = true;
                                        }else if(parseInt(v) == 1 && checkIsPetugas()) {
                                            isMustUpdate = true;
                                        }else if(parseInt(v) == 2 && checkIsSales()) {
                                            isMustUpdate = true;
                                        }else if(parseInt(v) == 3 && checkIsKios()) {
                                            isMustUpdate = true;
                                        }else if(parseInt(v) == 4 && checkIsTrader()) {
                                            isMustUpdate = true;
                                        }
                                    });
                                }else{
                                    isMustUpdate = true;
                                }
                            } catch (error) {
                                console.log(error)
                            }
                            if (isMustUpdate) {
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Information',
                                    text: 'Update tersedia, versi terbaru ' + res.number + ' .Silahkan update aplikasi untuk melanjutkan !',
                                    allowOutsideClick: false,
                                    onClose: () => {
                                        checkForUpdate()
                                    },
                                }).then((result) => {
                                    if (result.value) {
                                        window.open('https://play.google.com/store/apps/details?id=com.syngenta.commercial')
                                    }
                                })
                            }
                        }else{
                            if (checkAuto==false) {
                                HELPER.showMessage({
                                    success:'info',
                                    title:'Information',
                                    message:'There is no update available !'
                                })
                            }
                        }
                    },
                    error: function (err) {
                        Swal.fire({
                            title: 'Oopss !',
                            text: "Sistem dalam perbaikan. Kami sarankan akses kembali secara berkala.",
                            icon: 'warning',
                            backdrop: true,
                            allowOutsideClick: false,
                            showCancelButton: false,
                            confirmButtonText: 'Keluar',
                        }).then((result) => {
                            if (result.value) {
                                navigator.app.exitApp();
                            }
                        });
                    }
                })
            });
        } catch (error) {
            console.log(error)
        }
    }

    function Constraction() {
        HELPER.showMessage({
            success: 'warning',
            title: 'Warning !',
            message: 'Under Maintenance !'
        })
    }

    function checkPouchByNo() {
        if (checkIsSampling() || checkIsSales()) {
            cekSampling(null, $('#input_no_batch').val(), $('#input_no_pouch').val())
        } else {
            cekPouch(null, $('#input_no_batch').val(), $('#input_no_pouch').val())
        }
        setTimeout(function () {
            $('#input_no_pouch, #input_no_batch').val('')
        }, 300)
    }

    function onCallWa(el) {
        try {
            if ($(el).length > 0 && typeof $(el).data('no') != 'undefined') {
                var linkNo = "#";
                var dataNo = $(el).data('no')
                if (dataNo) {
                    if (dataNo.charAt(0) == "0") {
                        linkNo = "62" + dataNo.substring(1)
                    } else if (dataNo.charAt(0) == "+") {
                        linkNo = dataNo.substring(1)
                    } else if (dataNo.charAt(0) != "6") {
                        linkNo = "62" + dataNo.substring(1)
                    } else {
                        linkNo = dataNo
                    }
                }
                var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
                $('#btn-choose-telp-wa').off('click');
                $('#btn-choose-telp-phone').off('click');
                setTimeout(function () {
                    $('#btn-choose-telp-wa').on('click', function () {
                        window.location.href = linkWaMe
                    });
                    $('#btn-choose-telp-phone').on('click', function () {
                        window.location.href = 'tel://' + linkNo
                    });
                    $('#btn-telp-choose').click()
                }, 200)
            }
        } catch (e) {
            // statements
            console.log(e);
        }
    }

    function behaviorNotif() {
        setTimeout(function () {
            if (HELPER.getItem('behaviorNotif') == "sales-acc") {
                HELPER.removeItem('behaviorNotif')
                onPage('sales-req-login')
            }
        }, 2000)
    }

    function checkHasSalesOrNot() {
        try {
            if (checkIsPetani() && HELPER.isNull(JSON.parse(HELPER.getItem('configDataSales')))) {
                getSalesInfo()
            }
        } catch (error) {
            console.log(error);
        }
    }

    function checkSessionOver() {
        var daysAutoLogout = HELPER.getItem('global_config_mobile_auto_logout') ? parseInt(HELPER.getItem('global_config_mobile_auto_logout')) : 25;
        if (HELPER.isNull(HELPER.getItem('open_app_date'))) {
            window.localStorage.setItem('open_app_date', moment().format('YYYY-MM-DD HH:mm:ss'))
        } else if(moment().diff(moment(HELPER.getItem('open_app_date')), 'days') >= daysAutoLogout) {
            runLogout('Sesi Anda telah habis')
        } else {
            window.localStorage.setItem('open_app_date', moment().format('YYYY-MM-DD HH:mm:ss'))
        }
    }

    function updateOnlineStatus() {
        Swal.close()
    }
    function updateOfflineStatus() {
        Swal.fire({
            title: 'Internet tidak terdeteksi !',
            text: "Aplikasi ini membutuhkan koneksi internet !",
            icon: 'warning',
            backdrop: true,
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
        })
    }

    function preventHrefWysiwyg(cls) {
        setTimeout(() => {
            $.each(cls, function (ii, vv) { 
                $('.'+vv).css('word-break', 'break-word')
                $.each($('.'+vv).find('a'), function (i, v) { 
                    $(v).on('click', () => {window.location.href = $(v).attr('href')})
                });
            });
        }, 2000)
    }

    function onRefreshData() {
        HELPER.block();
        HELPER.ajax({
            url: BASE_URL + "Akun/read",
            data: {
                user_id: HELPER.getItem("user_id"),
            },
            complete: function (res) {
                HELPER.unblock();
                $.each(res, function (i, v) {
                    window.localStorage.setItem(i, v);
                });
                setTimeout(function () {
                    onPage("main");
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

    function asyncRefreshData() {
        return new Promise((resolve) => {
            HELPER.block();
            HELPER.ajax({
                url: BASE_URL + "Akun/read",
                data: {
                    user_id: HELPER.getItem("user_id"),
                },
                complete: function (res) {
                    HELPER.unblock();
                    $.each(res, function (i, v) {
                        window.localStorage.setItem(i, v);
                    });
                    resolve(true)
                },
                error: function () {
                    HELPER.unblock();
                    HELPER.showMessage({
                        message: "Oops, terjadi kesalahan teknis.",
                    });
                    resolve(false)
                },
            });
        });
    }

    
