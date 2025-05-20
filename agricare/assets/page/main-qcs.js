$(function () {
    if (checkIsSampling()) {
        $('.div-last-print').show()
    }
    loadConfig()
	loadMain()
    loadMenu()
    countPengajuanApprove()
})

function loadMain() {
	$('.user-name').text(HELPER.getItem('user_nama'))
	$('.user-email').text(HELPER.getItem('user_email'))
	$('.tanggal-now').text(moment().locale('id').format('dddd, DD MMMM YYYY'))
	if (!HELPER.isNull(HELPER.getItem('user_foto'))) {
		if (HELPER.getItem('user_foto').indexOf('http') >= 0) {
			$('.user-foto').attr('src', HELPER.getItem('user_foto'));
		}else{
			if (checkIsPetugas()) {
				$('.user-foto').attr('src', BASE_ASSETS+'user/thumbs/'+HELPER.getItem('user_foto'));
			}else{
				$('.user-foto').attr('src', BASE_ASSETS+'user_mobile/thumbs/'+HELPER.getItem('user_foto'));
			}
		}
	}
    if (HELPER.isNull('user_village_id')) {
        HELPER.showMessage({
            success: 'info',
            title: 'Info',
            message: 'Data profil Anda belum lengkap, lengkapi terlebih dahulu !',
            allowOutsideClick: false,
            callback: function(){
                onPage('edit-akun-qcs')
            }
        })
    }
}

function loadConfig() {
    var detailScanReaderAkumulation = 0;
    var detailScanReader;
    HELPER.ajax({
        url: BASE_URL+'Main/loadConfig',
        complete: function (res) {
            var configMaster    = JSON.stringify(res.master_label)
            var configSett      = JSON.stringify(res.sett_label)
            var configSettDataScan      = JSON.stringify(res.sett_data_scan)
            HELPER.setItem('configMaster', configMaster)
            HELPER.setItem('configSett', configSett)
            $.each(res.sett_data_scan, function(i, v) {
                if (v.conf_code == 'sett_data_scan_aktual') {
                    if (v.conf_value == 1) {
                        HELPER.setItem('configSettDataScanAktual', 1)
                    }else{
                        HELPER.setItem('configSettDataScanAktual', 0)
                    }
                }else{
                    if (v.conf_code == 'sett_data_scan_read_synegnta' && v.conf_value == 1) {
                        // $('.show_'+v.conf_code).hide()
                        detailScanReaderAkumulation = detailScanReaderAkumulation + 1 ;
                        detailScanReader = v.conf_code;
                    }else if(v.conf_code == 'sett_data_scan_read_simperbenih' && v.conf_value == 1){
                        // $('.show_'+v.conf_code).show()
                        detailScanReaderAkumulation = detailScanReaderAkumulation + 1 ;
                        detailScanReader = v.conf_code;
                    }
                }
            });
            HELPER.setItem('configSettScanReader', detailScanReader)
            HELPER.setItem('configSettScanReaderAkumulation', detailScanReaderAkumulation)
        }
    })
}

function onSampling() {
    scanOpen(function (result) {
        cekSampling(result)
    }, function (error) {
        HELPER.showMessage({
            title: 'Gagal !!',
            message: "Scanning failed: " + error
        })
    })
    /* cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                cekSampling(result.text)
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

function onLastQr(type=0) {
    scanOpen(function (result) {
        switch (type) {
            case 0:
                cekLastQr(result)
                break;
            case 1:
                cekPouchReject(result)
                break;
            case 2:
                cekPouchSisa(result)
                break;
            default:
                HELPER.showMessage({
                    title: 'Gagal !!',
                    message: "Scanning failed "
                })
                break;
        }
    }, function (error) {
        HELPER.showMessage({
            title: 'Gagal !!',
            message: "Scanning failed: " + error
        })
    })
    /* cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                switch (type) {
                    case 0:
                        cekLastQr(result.text)
                        break;
                    case 1:
                        cekPouchReject(result.text)
                        break;
                    case 2:
                        cekPouchSisa(result.text)
                        break;
                    default:
                        HELPER.showMessage({
                            title: 'Gagal !!',
                            message: "Scanning failed "
                        })
                        break;
                }
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

function cekLastQr(text) {
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Scan/lastPrint',
        data: {
            user_id: HELPER.getItem('user_id'),
            qrcode: text,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success) {
                $.each(res.data, function(i, v) {
                    if (!Array.isArray(v)) {
                        $('.foundprint-'+i).text(HELPER.nullConverter(v))
                    }
                });
                $('#btn-lastprint-success').click();
            }else{
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

function cekPouchReject(text) {
    $('.btn-pouch-reject-action').off()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Scan/cekPouchReject',
        data: {
            user_id: HELPER.getItem('user_id'),
            qrcode: text,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success && res.data) {
                $.each(res.data, function(i, v) {
                    if (!Array.isArray(v)) {
                        $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                    }
                });
                $('#btn-pouch-reject').click();
                $('.menu-hider').addClass('menu-active no-click')
                $('#user_id_approval_reject').val('')
                $('.approval-reject-nama, .approval-reject-jabatan').text('-')
                setTimeout(function () {
                    $('.menu-hider').addClass('menu-active').show()
                    $('.btn-pouch-reject-action').on('click', function (e) {
                        e.preventDefault();
                        goPouchReject(res.data.pouch_id, res.data.pouch_number)
                    })
                }, 500)
            }else{
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
    setTimeout(function () {
        $('.menu-hider').addClass('menu-active').show()
    }, 500)
}

function goPouchReject(pouch_id, pouch_number) {
    if (HELPER.isNull($('#user_id_approval_reject').val())) {
        HELPER.showMessage({
            success: 'warning',
            title: '',
            message: 'Silahkan pilih penyetuju dahulu !'
        })
    } else {
        $('.menu-hider').addClass('menu-active').show()
        HELPER.confirm({
            message: 'Apakah Anda yakin ingin menonaktifkan Pouch dengan no seri "'+pouch_number+'" ?',
            allowOutsideClick: false,
            callback: function (oke) {
                if (oke) {
                    HELPER.block()
                    HELPER.ajax({
                        url: BASE_URL + 'Scan/actPouchReject',
                        data: {
                            user_id: HELPER.getItem('user_id'),
                            pouch_id: pouch_id,
                            approval: $('#user_id_approval_reject').val()
                        },
                        success: function (res) {
                            if (res.success) {
                                $('.close-menu').click()
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Berhasil',
                                    message: 'Pengajuan menonaktifkan Pouch pada no seri "'+pouch_number+'" telah berhasil'
                                })
                            }else{
                                $('.menu-hider').addClass('menu-active').show()
                                HELPER.showMessage({
                                    success: false,
                                    title: 'Gagal !',
                                    message: res.message
                                })
                            }
                            HELPER.unblock(500)
                        },
                        error: function (err) {
                            HELPER.showMessage({
                                success: false,
                                title: 'Failed !',
                                message: 'Oops, terjadi kesalahan teknis.'
                            })
                        }
                    })
                }
                setTimeout(function () {
                    $('.menu-hider').addClass('menu-active').show()
                }, 500)
            }
        })
    }
}


function cekPouchSisa(text) {
    $('.btn-pouch-sisa-action').off().hide()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Scan/cekPouchSisa',
        data: {
            user_id: HELPER.getItem('user_id'),
            qrcode: text,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success && res.data) {
                var start_pouch = parseInt(res.data.pouch_number) + 1;
                if (start_pouch > parseInt(res.data.qr_export_detail_end)) {
                    $('.btn-pouch-sisa-action').hide()
                    HELPER.showMessage({
                        success: 'info',
                        title: 'Info',
                        message: 'Tidak ada pouch sisa !'
                    })
                }else{
                    $.each(res.data, function(i, v) {
                        if (!Array.isArray(v)) {
                            $('.detail_sisa-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                    $('.detail_sisa-no_seri_awal').text(start_pouch)
                    $('.detail_sisa-no_seri_akhir').text(res.data.qr_export_detail_end)
                    $('#btn-pouch-sisa').click();
                    setTimeout(function () {
                        $('.menu-hider').addClass('menu-active').show()
                        $('.btn-pouch-sisa-action').show().on('click', function (e) {
                            e.preventDefault();
                            goPouchSisa(res.data.pouch_id, start_pouch, res.data.qr_export_detail_end)
                        })
                    }, 500)
                }
            }else{
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
    setTimeout(function () {
        $('.menu-hider').addClass('menu-active').show()
    }, 500)
}

function goPouchSisa(pouch_id, start, end) {
    if (HELPER.isNull($('#user_id_approval_sisa').val())) {
        HELPER.showMessage({
            success: 'warning',
            title: '',
            message: 'Silahkan pilih penyetuju dahulu !'
        })
    } else {
        $('.menu-hider').addClass('menu-active').show()
        HELPER.confirm({
            message: 'Apakah Anda yakin ingin menonaktifkan Pouch dari no seri "'+start+'" - "'+end+'" ?',
            allowOutsideClick: false,
            callback: function (oke) {
                if (oke) {
                    HELPER.block()
                    HELPER.ajax({
                        url: BASE_URL + 'Scan/actPouchSisa',
                        data: {
                            user_id: HELPER.getItem('user_id'),
                            pouch_id: pouch_id,
                            approval: $('#user_id_approval_sisa').val()
                        },
                        success: function (res) {
                            if (res.success) {
                                $('.close-menu').click()
                                HELPER.showMessage({
                                    success: true,
                                    title: 'Berhasil',
                                    message: 'Pengajuan menonaktifkan Pouch dari no seri "'+start+'" - "'+end+'" telah berhasil.',
                                })
                            }else{
                                $('.menu-hider').addClass('menu-active').show()
                                HELPER.showMessage({
                                    success: false,
                                    title: 'Gagal !',
                                    message: res.message
                                })
                            }
                            HELPER.unblock(500)
                        },
                        error: function (err) {
                            HELPER.showMessage({
                                success: false,
                                title: 'Failed !',
                                message: 'Oops, terjadi kesalahan teknis.'
                            })
                        }
                    })
                }
                setTimeout(function () {
                    $('.menu-hider').addClass('menu-active').show()
                }, 500)
            }
        })
    }
}

function chooseApproval(type) {
    $('.close-approval').off('click')
    setTimeout(function () {
        $('.close-approval').on('click', function () {
            if (type == "reject") {
                $('.btn-pouch-reject').click()
            } else {
                $('.btn-pouch-sisa').click()
            }
        })
    }, 500)
    $('#btn-approval-scan').click()
    $('.menu-hider').addClass('menu-active no-click')
    $('#list_approval_scan').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Mainqcs/loadApprovalUserExist',
        dataExist: {},
        urlMore: BASE_URL + 'Mainqcs/loadApprovalUserMore',
        dataMore: {},
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#list_approval_scan').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>No approval available.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-approval-scan').hide()
            }else{
                $('#btn-more-approval-scan').show()
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
                    var tanggal = moment(v.qr_scan_insert_at).format('DD MMMM YYYY HH:mm')
                    var img = 'assets/images/avatars/6s.png';
                    if (v.user_foto) {
                        img = BASE_ASSETS+'user/'+v.user_foto;
                    }
                    $('#list_approval_scan').append(`
                        <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay" onclick="onChooseApproval('${type}', '${btoa(JSON.stringify(v))}')">
                            <div class="row">
                                <div class="col-auto">
                                    <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="radius-50 bg-highlight" alt="Petugas" style="width: 60px;height: 60px;">
                                </div>
                                <div class="col left-10">
                                    <span class="font-19 color-custom-gray bold d-block">${HELPER.nullConverter(v.user_nama)}</span>
                                    <span class="bottom-0 font-12 color-custom-gray d-block" style="line-height: 13px;">${HELPER.nullConverter(v.jabatan_name)}</span>
                                </div>
                            </div>
                        </div>
                    `)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-approval-scan').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-approval-scan').hide()
            $('#btn-more-approval-scan').off('click');
        }
    })
}

function onChooseApproval(type, data) {
    if (type == "reject") {
        data = JSON.parse(atob(data))
        var img = 'assets/images/avatars/6s.png';
        if (data.user_foto) {
            img = BASE_ASSETS+'user/'+data.user_foto;
        }
        $('#user_id_approval_reject').val(data.user_id)
        $('.approval-reject-foto').attr('src', img)
        $('.approval-reject-nama').text(data.user_nama)
        $('.approval-reject-jabatan').text(data.jabatan_name)
        $('#btn-pouch-reject').click()
    } else {
        data = JSON.parse(atob(data))
        var img = 'assets/images/avatars/6s.png';
        if (data.user_foto) {
            img = BASE_ASSETS+'user/'+data.user_foto;
        }
        $('#user_id_approval_sisa').val(data.user_id)
        $('.approval-sisa-foto').attr('src', img)
        $('.approval-sisa-nama').text(data.user_nama)
        $('.approval-sisa-jabatan').text(data.jabatan_name)
        $('#btn-pouch-sisa').click()
    }
}

function countPengajuanApprove(){
    HELPER.ajax({
        url: BASE_URL+'Mainqcs/countPengajuanApprove',
        data: {user_id:HELPER.getItem('user_id')},
        success: function(res){
            if (res.success && res.total > 0) {
                $('.text-total-approve').text(res.total).parent().show()
            }
        }
    })
}

function loadMenu() {
    HELPER.ajax({
        url: BASE_URL + "Main/loadMenu",
        complete: function (res) {
            confPetugas = res.data.data.menu_petugas;
            count = res.data.countPetugas
            $.each(confPetugas, function (i, v) {
                if (count % 3 == 0) {
                    $('#div-' + v.conf_mobile_code).addClass('one-third')
                    $('#div-' + v.conf_mobile_code).addClass('last-column')
                    $('#div-' + v.conf_mobile_code).addClass('right-5')
                } else {
                    $('#div-' + v.conf_mobile_code).addClass('one-third')
                    $('#div-' + v.conf_mobile_code).addClass('last-column')
                    $('#div-' + v.conf_mobile_code).addClass('right-5')
                }

                if (parseInt(v.conf_mobile_value) == 1) {
                    $('#div-' + v.conf_mobile_code).show()
                } else {
                    $('#div-' + v.conf_mobile_code).hide()

                }
            });

        }
    });
}