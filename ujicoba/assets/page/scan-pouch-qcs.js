var mymap;
$(function () {
    setTimeout(function () {
        listApprovalScan()
        loadReasonReject()
        
        $('#input_reason').off('change').on('change', function () {
            if (this.value) {
                $('#input_reason_list').val(this.value)
                $('.list-form-scan-data').find('.list_reason').val(this.value)
                $('.list-form-scan-data').find('.list_reason_text').text($('#input_reason :selected').text())
                $('.reason-desc').show().find('div').html(atob($('#input_reason :selected').data('desc')))
                $('.reason-desc-list').show().find('div').html(atob($('#input_reason :selected').data('desc')))
            }else{
                $('.reason-desc').hide().find('div').html('')
                $('.reason-desc-list').hide().find('div').html('')
            }
        })
        $('#input_reason_list').off('change').on('change', function () {
            if (this.value) {
                $('.reason-desc-list').show().find('div').html(atob($('#input_reason_list :selected').data('desc')))
            }else{
                $('.reason-desc-list').hide().find('div').html('')
            }
        })
    }, 300)
})

function loadReasonReject() {
    HELPER.ajax({
        url: BASE_URL +'Mainqcs/loadReasonReject',
        success: function (res) {
            if (res.success) {
                $.each(res.data, function (i, v) { 
                    $('#input_reason').append(`<option data-desc="${v.reason_reject_desc}" value="${v.reason_reject_id}">${v.reason_reject_text}</option>`)
                    $('#input_reason_list').append(`<option data-desc="${v.reason_reject_desc}" value="${v.reason_reject_id}" ${i==0?'selected':''}>${v.reason_reject_text}</option>`)
                });
            }
        }
    })
}

function listApprovalScan() {
    
    $('#list-approval-req').html('')
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + 'Mainqcs/listApproveReqExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Mainqcs/listApproveReqMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#list-approval-req').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada data.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-approval-req').hide()
            }else{
                $('#btn-more-approval-req').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_req = $.parseJSON(data.responseText);
                $.each(data_req.data, function(i, v) {

                    var bgStatusHead = "", textStatusHead = "";
                    if (parseInt(v.approval_req_is_draft) == 1) { bgStatusHead = "bg-gray2-dark";textStatusHead="Draft";}
                    else if (parseInt(v.approval_req_approve_status) == 0) { bgStatusHead = "bg-yellow2-dark";textStatusHead="Waiting";}
                    else if (parseInt(v.approval_req_approve_status) == 1) { bgStatusHead = "bg-green2-dark";textStatusHead="Disetujui";}
                    else if (parseInt(v.approval_req_approve_status) == 2) { bgStatusHead = "bg-red2-dark";textStatusHead="Ditolak";}
                    else if (parseInt(v.approval_req_approve_status) == 3) { bgStatusHead = "bg-green1-dark";textStatusHead="Disetujui Sebagian";}
                    else if (parseInt(v.approval_req_approve_status) == 4) { bgStatusHead = "bg-gray2-dark";textStatusHead="Menunggu Rollback";}

                    $('#list-approval-req').append(`
                        <div class="content bottom-20">
                            <a href="javascript:;" class="caption round-medium shadow-large bg-theme bottom-15 show-overlay color-custom-dark" onclick="onCreateFormScan('${v.approval_req_id}')">
                                <div class="custom-caption-header-left-half bg-green2-dark"><span>Pouch ${HELPER.ucwords(v.approval_req_type)}</span></div>
                                <div class="custom-caption-header-right-half ${bgStatusHead}"><span>${textStatusHead}</span></div>
                                <div class="clear"></div>
                                <div class="content bottom-5 top-30">
                                    <div class="row bottom-5">
                                        <div class="col-auto right-10 align-self-center">
                                            <i class="fa fa-calendar color-green2-dark"></i>
                                        </div>
                                        <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                            <span class="d-block">Dibuat : ${moment(v.approval_req_updated_at).format('DD-MM-YYYY')}</span>
                                            <span class="d-block">Diubah : ${moment(v.approval_req_updated_at).format('DD-MM-YYYY')}</span>
                                        </div>
                                    </div>
                                    <div class="row bottom-5">
                                        <div class="col-auto right-10">
                                            <i class="fa fa-user color-green2-dark"></i>
                                        </div>
                                        <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                            <span>Penyetuju : ${HELPER.nullConverter(v.user_nama)} (${HELPER.nullConverter(v.jabatan_name)})</span>
                                        </div>
                                    </div>
                                    <div class="row bottom-5">
                                        <div class="col-auto right-10">
                                            <i class="fa fa-box color-green2-dark"></i>
                                        </div>
                                        <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                            <span>Total : ${HELPER.nullConverter(v.approval_req_total_pouch)}</span>
                                        </div>
                                    </div>
                                    <div class="row bottom-5">
                                        <div class="col-auto right-10">
                                            <i class="fa fa-box color-green2-dark"></i>
                                        </div>
                                        <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                            <span>Total Acc : ${HELPER.nullConverter(v.approval_req_total_pouch_acc)}</span>
                                        </div>
                                    </div>
                                    <div class="row bottom-5">
                                        <div class="col-auto right-10">
                                            <i class="fa fa-sync color-green2-dark"></i>
                                        </div>
                                        <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                            <span>Total Rollback : ${HELPER.nullConverter(v.approval_req_total_pouch_rollback)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="content-footer">
                                    <span class="bhsConf-ketuk_detail">Ketuk untuk detail</span>
                                    <i class="fa fa-angle-right fa-lg"></i>
                                </div>
                                <div class="clear"></div>
                            </a>
                        </div>
                    `)
                    
                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                setTimeout(function () {setLangApp()}, 500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-approval-req').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-approval-req').hide()
            $('#btn-more-approval-req').off('click');
        }

    })
}

function onBackTableScan() {
    HELPER.toggleForm({tohide:'form-data-scan',toshow:'table-data-scan'})
    $("#plus-menu").show()
    listApprovalScan()
}

function onCreateFormScan(approval_req_id=null, type=null) {
    $('#plus-menu').hide()
    $('.close-menu').click()
    if (approval_req_id == null) {
        createNewFormScan(type)
    } else {
        updateFormScan(approval_req_id)
    }
    setTimeout(function () {$('#plus-menu').hide()}, 500)
}

function createNewFormScan(type){
    HELPER.toggleForm({tohide:'table-data-scan',toshow:'form-data-scan'})
    $('#type_scan').val(type)
    $('.text-type-scan').text(HELPER.ucwords(type))
    $('#user_id_approval, #approval_req_id').val('')
    $('.approval-foto, .approval-nama, .approval-jabatan').text('-')
    $('#list-pouch-scan').html('')
    $('.btn-form-scan-draft, .btn-form-scan-save, .btn-choose-approval, .btn-choose-scan').show()
    $('.reason-desc').hide().find('div').html('')
    if ($('#type_scan').val() == "reject") {
        $('.div-reason').show()
        $('.div-reason').removeClass('btn-disabled')
    }else{
        $('.div-reason').hide()
        $('.div-reason').addClass('btn-disabled')
    }
    countTotalListPouch()
}

function updateFormScan(approval_req_id) {
    HELPER.ajax({
        url: BASE_URL + 'Mainqcs/readApprovalReq',
        data: {id: approval_req_id},
        success: function(res){
            var dataApprovalReq = res.data.dataApprovalReq;
            var dataApprovalScan = res.data.dataApprovalScan;
            new Promise((resolve, reject) => {
                HELPER.block();
                $('#user_id_approval').val('')
                $('.approval-foto, .approval-nama, .approval-jabatan').text('-')
                $('#list-pouch-scan').html('')
                $('.reason-desc').hide().find('div').html('')
                if (parseInt(dataApprovalReq.approval_req_is_draft) == 0) {
                    $('.btn-form-scan-draft, .btn-form-scan-save, .btn-choose-approval, .btn-choose-scan').hide()
                    $('.div-reason').addClass('btn-disabled')
                    if (dataApprovalReq.approval_req_type == "reject") {
                        $('.div-reason').show()
                    }else{
                        $('.div-reason').hide()
                    }
                }else{
                    $('.btn-form-scan-draft, .btn-form-scan-save, .btn-choose-approval, .btn-choose-scan').show()
                    if (dataApprovalReq.approval_req_type == "reject") {
                        $('.div-reason').show()
                        $('.div-reason').removeClass('btn-disabled')
                    }else{
                        $('.div-reason').hide()
                    }
                }
                resolve();
            }).then(() => {
                $('.text-type-scan').text(HELPER.ucwords(dataApprovalReq.approval_req_type))
                $('#type_scan').val(dataApprovalReq.approval_req_type)
                $('#approval_req_id').val(approval_req_id)
                $('#approval_req_data').val(btoa(JSON.stringify(dataApprovalReq)))
                if (!HELPER.isNull(dataApprovalReq.approval_req_approval_id)) {
                    var img = 'assets/images/avatars/6s.png';
                    if (dataApprovalReq.user_foto) img = BASE_ASSETS+'user/'+dataApprovalReq.user_foto;
                    $('#user_id_approval').val(dataApprovalReq.approval_req_approval_id)
                    $('.approval-foto').attr('src', img)
                    $('.approval-nama').text(dataApprovalReq.user_nama)
                    $('.approval-jabatan').text(dataApprovalReq.jabatan_name)
                }
                $.each(dataApprovalScan, function (i, v) { 
                    setToListScan(v, true)
                });
            }).then(() => {
                HELPER.toggleForm({tohide:'table-data-scan',toshow:'form-data-scan'})
                HELPER.unblock(500);
            });
        }
    })
}




/* ======= APROVAL ============== */
function chooseApproval(type) {
    $('#btn-approval-scan').click()
    $('#list_approval_scan').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Mainqcs/loadApprovalUserExist',
        dataExist: {user_kode: HELPER.getItem('user_kode')},
        urlMore: BASE_URL + 'Mainqcs/loadApprovalUserMore',
        dataMore: {user_kode: HELPER.getItem('user_kode')},
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
                        <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay" onclick="onChooseApproval('${btoa(JSON.stringify(v))}')">
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

function onChooseApproval(data) {
    data = JSON.parse(atob(data))
    var img = 'assets/images/avatars/6s.png';
    if (data.user_foto) {
        img = BASE_ASSETS+'user/'+data.user_foto;
    }
    $('#user_id_approval').val(data.user_id)
    $('.approval-foto').attr('src', img)
    $('.approval-nama').text(data.user_nama)
    $('.approval-jabatan').text(data.jabatan_name)
    $('.close-menu').click()
    setTimeout(() => {
        onDrafFormScan()
    }, 500);
}
/* ======= END APROVAL ============== */


/* ======= SCAN CAMERA & NO SERI ============== */
function onScanWithCamera() {
    scanOpen(function (result) {
        switch ($('#type_scan').val()) {
            case 'reject':
                cekPouchReject(result)
                break;
            case 'sisa':
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
                switch ($('#type_scan').val()) {
                    case 'reject':
                        cekPouchReject(result.text)
                        break;
                    case 'sisa':
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

function scanInputNoSeri() {
    if (HELPER.isNull($('#input_no_pouch').val())) {
        HELPER.showMessage({
            success: false,
            title:'',
            message:'Lengkapi form dahulu !'
        })
    } else {
        switch ($('#type_scan').val()) {
            case 'reject':
                cekPouchReject(null, $('#input_no_batch').val(), $('#input_no_pouch').val())
                break;
            case 'sisa':
                cekPouchSisa(null, $('#input_no_batch').val(), $('#input_no_pouch').val())
                break;
            default:
                HELPER.showMessage({
                    title: 'Gagal !!',
                    message: "Scanning failed "
                })
                break;
        }
    }
}

function cekPouchReject(text=null, no_batch=null, no_pouch=null) {
    $('.btn-pouch-reject-action, .btn-pouch-reject-delete, .btn-pouch-reject-rollback').off().hide()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Scan/cekPouchReject',
        data: {
            user_id: HELPER.getItem('user_id'),
            qrcode: text,
            no_batch: no_batch,
            no_pouch: no_pouch,
        },
        success: function (res) {
            HELPER.unblock()
            if (res.success && res.data) {
                if (res.data.length) {
                    $.each(res.data[0], function(i, v) {
                        if (!Array.isArray(v) && i != 'pouch_number') {
                            $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                    $('.detail_reject-pouch_number').text(no_pouch)
                } else {
                    $.each(res.data, function(i, v) {
                        if (!Array.isArray(v)) {
                            $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                }
                $('#btn-pouch-reject').click();
                setTimeout(function () {
                    $('.btn-pouch-reject-action').show().on('click', function (e) {
                        e.preventDefault();
                        setToListScan(res.data)
                        setTimeout(() => {
                            onDrafFormScan()
                        }, 1000);
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
}

function cekPouchSisa(text=null, no_batch=null, no_pouch=null) {
    $('.btn-pouch-sisa-action, .btn-pouch-sisa-delete, .btn-pouch-sisa-rollback').off().hide()
    HELPER.block()
    HELPER.ajax({
        url: BASE_URL + 'Scan/cekPouchSisa',
        data: {
            user_id: HELPER.getItem('user_id'),
            qrcode: text,
            no_batch: no_batch,
            no_pouch: no_pouch,
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
                        $('.btn-pouch-sisa-action').show().on('click', function (e) {
                            e.preventDefault();
                            setToListScan(res.data)
                            setTimeout(() => {
                                onDrafFormScan()
                            }, 1000);
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
}
/* ======= END SCAN CAMERA ============== */


/* ======= SET LIST SCAN ================ */

function setToListScan(data, fromRead=false) {
    $('.close-menu').click()
    if ($('.list-scan-'+data.pouch_id).length == 0) {
        var bgStatusHead = "bg-yellow2-dark", textStatusHead = "Menunggu", textReason = "-", valReason = "-";
        if (fromRead) {
            textReason = HELPER.nullConverter(data.approval_scan_reason_text)
            valReason  = HELPER.nullConverter(data.approval_scan_reason_id)
            if (parseInt(data.approval_scan_approve_status) == 0) { bgStatusHead = "bg-yellow2-dark";textStatusHead="Menunggu";}
            else if (parseInt(data.approval_scan_approve_status) == 1) { 
                bgStatusHead = "bg-green2-dark";textStatusHead="Disetujui";
                if (parseInt(data.approval_scan_rollback_status) == 1) {
                    bgStatusHead = "bg-gray2-light";textStatusHead="Menunggu Rollback";
                    if (parseInt(data.approval_scan_rollback_approve) == 1) {
                        bgStatusHead = "bg-red2-light";textStatusHead="Rollback Disetujui";
                    }else if(parseInt(data.approval_scan_rollback_approve) == 0){
                        bgStatusHead = "bg-red2-dark";textStatusHead="Rollback Ditolak";
                    }
                }
            }else if (parseInt(data.approval_scan_approve_status) == 2) { bgStatusHead = "bg-red2-dark";textStatusHead="Ditolak";}
        }else{
            if ($('#type_scan').val() == "reject") {
                if ($('#input_reason').val()) {
                    textReason = HELPER.nullConverter($('#input_reason :selected').text())
                    valReason  = HELPER.nullConverter($('#input_reason').val())
                } else {
                    textReason = HELPER.nullConverter($('#input_reason_list :selected').text())
                    valReason  = HELPER.nullConverter($('#input_reason_list').val())
                }
            }
        }
        if (data.length) {
            $.each(data, function (i, v) { 
                $('#list-pouch-scan').append(`
                    <div class="content round-small list-form-scan-data show-overlay-list right-5 left-5 list-scan-${v.pouch_id}" onclick="readDetailListScan('${btoa(JSON.stringify(v))}')">
                        <input type="hidden" name="list_pouch[]" value="${v.pouch_id}">
                        <input type="hidden" class="list_reason" name="list_reason[]" value="${valReason}">
                        <div class="row">
                            <div class="col">
                                <label class="color-custom-dark"><b>Pouch :</b> ${HELPER.nullConverter(v.pouch_number)}</label>
                                <label class="color-custom-dark"><b>Batch :</b> ${HELPER.nullConverter(v.batch_code)}</label>
                                <label class="color-custom-dark"><b>Line  :</b> ${HELPER.nullConverter(v.qr_export_detail_line)}</label>
                                <label class="color-custom-dark"><b>Alasan:</b> <span class="list_reason_text">${HELPER.nullConverter(textReason)}</span></label>
                            </div>
                            <div class="col-auto align-self-center">
                                <i class="fa fa-angle-right" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="row list-scan-status-${v.pouch_id}">
                            <div class="col text-center ${bgStatusHead}">
                                <span>${textStatusHead}</span>
                            </div>
                        </div>
                    </div>
                `)
            });
        } else {
            $('#list-pouch-scan').append(`
                <div class="content round-small list-form-scan-data show-overlay-list right-5 left-5 list-scan-${data.pouch_id}" onclick="readDetailListScan('${btoa(JSON.stringify(data))}')">
                    <input type="hidden" name="list_pouch[]" value="${data.pouch_id}">
                    <input type="hidden" class="list_reason" name="list_reason[]" value="${valReason}">
                    <div class="row">
                        <div class="col">
                            <label class="color-custom-dark"><b>Pouch :</b> ${HELPER.nullConverter(data.pouch_number)}</label>
                            <label class="color-custom-dark"><b>Batch :</b> ${HELPER.nullConverter(data.batch_code)}</label>
                            <label class="color-custom-dark"><b>Line  :</b> ${HELPER.nullConverter(data.qr_export_detail_line)}</label>
                            <label class="color-custom-dark"><b>Alasan:</b> <span class="list_reason_text">${HELPER.nullConverter(textReason)}</span></label>
                        </div>
                        <div class="col-auto align-self-center">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="row list-scan-status-${data.pouch_id}">
                        <div class="col text-center ${bgStatusHead}">
                            <span>${textStatusHead}</span>
                        </div>
                    </div>
                </div>
            `)
        }
        countTotalListPouch()
    }
}

function readDetailListScan(data) {
    data = JSON.parse(atob(data))
    $('.btn-pouch-reject-action, .btn-pouch-reject-rollback, .btn-pouch-reject-delete, .btn-pouch-sisa-action, .btn-pouch-sisa-rollback, .btn-pouch-sisa-delete').hide().off('click')
    switch ($('#type_scan').val()) {
        case 'reject':
            
            $.each(data, function(i, v) {
                if (!Array.isArray(v)) {
                    $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                }
            });
            $('#input_reason').val( $('.list-scan-'+data.pouch_id).find('.list_reason').val() )
            $('#btn-pouch-reject').click();
            setTimeout(function () {
                if (HELPER.isNull($('#approval_req_id').val())) {
                    $('.btn-pouch-reject-delete').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        deleteListScan(data)
                    })
                    $('.btn-pouch-reject-action, .btn-pouch-reject-rollback').hide().off('click')
                }else{
                    var dataApproveReq = JSON.parse(atob($('#approval_req_data').val()));
                    if (parseInt(dataApproveReq.approval_req_is_draft) == 1) {
                        $('.btn-pouch-reject-delete').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            deleteListScan(data)
                        })
                        $('.btn-pouch-reject-action, .btn-pouch-reject-rollback').hide().off('click')
                    } else {
                        if (data.hasOwnProperty('approval_scan_id')) {
                            if (parseInt(data.approval_scan_approve_status) == 1 && parseInt(data.approval_scan_rollback_status) == 0 && moment().diff(data.approval_scan_created_at, 'days') <= 3) {
                                $('.btn-pouch-reject-rollback').show().off('click').on('click', function (e) {
                                    e.preventDefault();
                                    rollbackListScan(data)
                                })
                                $('.btn-pouch-reject-action, .btn-pouch-reject-delete').hide().off('click')
                            }
                        }
                    }
                }
            }, 500)

            break;
        case 'sisa':
            
            var start_pouch = parseInt(data.pouch_number) + 1;
            $.each(data, function(i, v) {
                if (!Array.isArray(v)) {
                    $('.detail_sisa-'+i).text(HELPER.nullConverter(v))
                }
            });
            $('.detail_sisa-no_seri_awal').text(start_pouch)
            $('.detail_sisa-no_seri_akhir').text(data.qr_export_detail_end)
            $('#btn-pouch-sisa').click();
            setTimeout(function () {
                if (HELPER.isNull($('#approval_req_id').val())) {
                    $('.btn-pouch-sisa-delete').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        deleteListScan(data)
                    })
                    $('.btn-pouch-sisa-action, .btn-pouch-sisa-rollback').hide().off('click')
                }else{
                    var dataApproveReq = JSON.parse(atob($('#approval_req_data').val()));
                    if (parseInt(dataApproveReq.approval_req_is_draft) == 1) {
                        $('.btn-pouch-sisa-delete').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            deleteListScan(data)
                        })
                        $('.btn-pouch-sisa-action, .btn-pouch-sisa-rollback').hide().off('click')
                    } else {
                        if (data.hasOwnProperty('approval_scan_id')) {
                            if (parseInt(data.approval_scan_approve_status) == 1) {
                                $('.btn-pouch-sisa-rollback').show().off('click').on('click', function (e) {
                                    e.preventDefault();
                                    rollbackListScan(data)
                                })
                                $('.btn-pouch-sisa-action, .btn-pouch-sisa-delete').hide().off('click')
                            }
                        }
                    }
                }
            }, 500)

            break;
        default:
            HELPER.showMessage({
                title: 'Gagal !!',
                message: "Tipe tidak terindikasi"
            })
            break;
    }
}

function deleteListScan(data) {
    $('.list-scan-'+data.pouch_id).remove()
    $('.close-menu').click()
    countTotalListPouch()
    onDrafFormScan()
}

function rollbackListScan(data) {
    HELPER.confirm({
        message: 'Apakah Anda ingin mengajukan rollback pada pouch ini ?',
        callback: function(oke){
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL + 'Mainqcs/reqRollback',
                    data: {id: data.approval_scan_id},
                    success: function(res){
                        listApprovalScan()
                        $('.close-menu').click();
                        $('.list-scan-status-'+data.pouch_id).find('div').addClass('bg-gray2-light').find('span').text('Menunggu Rollback')
                    }
                })
            }
        }
    })
}

function countTotalListPouch() {
    setTimeout(function () {
        $('.total_list_pouch').text($('.list-form-scan-data').length)
    }, 1000)
}

/* ======= END SET LIST SCAN ============ */


/* ========== SAVE DATA ================= */

function onDrafFormScan() {
    onSaveFormScan(1)
}

function onSaveFormScan(is_draft=0) {
    if (is_draft == 0 && (HELPER.isNull($('#user_id_approval').val()) || $('.list-form-scan-data').length == 0)) {
        HELPER.showMessage({
            success: 'warning',
            title: '',
            message: 'Harap pilih approval dan isi list pouch !'
        });
    } else {
        if (is_draft==0) {
            $('.div-btn-action-form').hide()
        }
        var form = $('#form-scan')[0];
        var formData = new FormData(form);
        formData.append('is_draft', is_draft);
        formData.append('user_id', HELPER.getItem('user_id'));
        HELPER.save({
            url: BASE_URL+'Mainqcs/saveListScan',
            cache : false,
            data  : formData,
            contentType : false,
            processData : false,
            confirm: is_draft==1?false:true,
            success : function(success)
            {
                if (is_draft) {
                    try {
                        if (success.id) {
                            $('#approval_req_id').val(success.id)
                            $('#approval_req_data').val(btoa(JSON.stringify(success.data)))
                        }
                    } catch (error) {
                        
                    }
                } else {
                    listApprovalScan()
                    onBackTableScan()
                    HELPER.showMessage({
                        success: true,
                        title: 'Information !',
                        message: 'Anda berhasil menyimpan !',
                    })
                    setTimeout(() => {$('.div-btn-action-form').show()}, 1000);
                }
                HELPER.unblock(500)
            },
            error: function(){
                setTimeout(() => {$('.div-btn-action-form').show()}, 1000);
                HELPER.unblock(500)
            },
            oncancel: function(){
                setTimeout(() => {$('.div-btn-action-form').show()}, 1000);
                HELPER.unblock(500)
            }
        });
    }
}

/* ========== END SAVE DATA ================= */

/* ========== START DELETE DRAFT ================= */
function onDeleteFormScan() {
    HELPER.confirm({
        message: 'Apakah Anda ingin menghapus pengajuan ini ?',
        callback: function(oke){
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL + 'Mainqcs/deleteReq',
                    data: {id: $('#approval_req_id').val()},
                    success:function () {
                        listApprovalScan()
                        onBackTableScan()
                        setTimeout(() => {$('.div-btn-action-form').show()}, 1000);
                    }
                })
            }
        }
    })
}
/* ========== END DELETE DRAFT ================= */
