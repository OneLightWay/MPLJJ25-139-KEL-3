var mymap;
$(function () {
    setTimeout(function () {
        listApprovalScan()
    }, 300)
})

function listApprovalScan() {
    
    $('#list-approval-req').html('')
    HELPER.initLoadMore({
        perPage: 5,
        urlExist: BASE_URL + 'Mainqcs/listApproveScanExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Mainqcs/listApproveScanMore',
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
                                            <span>Petugas : ${HELPER.nullConverter(v.user_nama)} (${HELPER.nullConverter(v.jabatan_name)})</span>
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
}

function onCreateFormScan(approval_req_id=null) {
    $('.close-menu').click()
    updateFormScan(approval_req_id)
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
                if (parseInt(dataApprovalReq.approval_req_approve_status) > 0) {
                    $('.btn-tolak-semua, .btn-setuju-semua').addClass('btn-disabled')
                }else{
                    $('.btn-tolak-semua, .btn-setuju-semua').removeClass('btn-disabled')
                }
                $('.approval-foto, .approval-nama, .approval-jabatan').text('-')
                $('#list-pouch-scan').html('')
                resolve();
            }).then(() => {
                $('.text-type-scan').text(HELPER.ucwords(dataApprovalReq.approval_req_type))
                $('#type_scan').val(dataApprovalReq.approval_req_type)
                $('#approval_req_id').val(approval_req_id)
                $('#approval_req_data').val(btoa(JSON.stringify(dataApprovalReq)))
                if (!HELPER.isNull(dataApprovalReq.approval_req_user_id)) {
                    var img = 'assets/images/avatars/6s.png';
                    if (dataApprovalReq.user_foto) img = BASE_ASSETS+'user/'+dataApprovalReq.user_foto;
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

function approveAll(type) {
    var msg = "Apakah Anda ingin menyetujui semua list ?";
    if (type == 2) msg = "Apakah Anda ingin menolak semua list ?";
    Swal.fire({
        title: '',
        text: msg,
        icon: 'warning',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check"></i> Yes',
        confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',
        cancelButtonText: '<i class="fa fa-times"></i> No',
        cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark',
        background: '#f5f5f5',
        customClass: {
            title   : 'font-23',
            content : 'font-18'
        },
        input: 'textarea',
        inputLabel: 'Deskripsi',
        inputPlaceholder: 'Ketik deksripsi disini...',
        inputAttributes: {
            'aria-label': 'Ketik deksripsi disini'
        },
    }).then(function(result) {
        if (result.isConfirmed) {
            HELPER.block()
            HELPER.ajax({
                url: BASE_URL + 'Mainqcs/approveAll',
                data: {id: $('#approval_req_id').val(), type: type, desc: result.value},
                success: function(){
                    HELPER.unblock(500)
                    setTimeout(() => {
                        HELPER.showMessage({
                            success: true,
                            title:'',
                            message:'Berhasil update data'
                        })
                        onBackTableScan()
                        listApprovalScan()
                    }, 500);
                },
                error: function(){
                    HELPER.unblock(500)
                }
            })
        }
    });
}

/* ======= SET LIST SCAN ================ */

function setToListScan(data, fromRead=false) {
    $('.close-menu').click()
    if ($('.list-scan-'+data.pouch_id).length == 0) {
        var bgStatusHead = "bg-yellow2-dark", textStatusHead = "Menunggu", listIsWaiting = "is-wait", textReason = "-";
        if (fromRead) {
            textReason = HELPER.nullConverter(data.approval_scan_reason_text)
            if (parseInt(data.approval_scan_approve_status) == 0) { bgStatusHead = "bg-yellow2-dark";textStatusHead="Menunggu";}
            else if (parseInt(data.approval_scan_approve_status) == 1) { 
                bgStatusHead = "bg-green2-dark";textStatusHead="Disetujui";listIsWaiting=""
                if (parseInt(data.approval_scan_rollback_status) == 1) {
                    bgStatusHead = "bg-gray2-light";textStatusHead="Menunggu Rollback";
                    if (parseInt(data.approval_scan_rollback_approve) == 1) {
                        bgStatusHead = "bg-red2-light";textStatusHead="Rollback Disetujui";
                    }else if(parseInt(data.approval_scan_rollback_approve) == 0){
                        bgStatusHead = "bg-red2-dark";textStatusHead="Rollback Ditolak";
                    }
                }
            }else if (parseInt(data.approval_scan_approve_status) == 2) { bgStatusHead = "bg-red2-dark";textStatusHead="Ditolak";}
        }
        $('#list-pouch-scan').append(`
            <div class="content round-small list-form-scan-data show-overlay-list right-5 left-5 list-scan-${data.pouch_id} ${listIsWaiting}" onclick="readDetailListScan('${btoa(JSON.stringify(data))}')">
                <input type="hidden" name="list_pouch[]" value="${data.pouch_id}">
                <div class="row">
                    <div class="col">
                        <label class="color-custom-dark"><b>Pouch :</b> ${HELPER.nullConverter(data.pouch_number)}</label>
                        <label class="color-custom-dark"><b>Batch :</b> ${HELPER.nullConverter(data.batch_code)}</label>
                        <label class="color-custom-dark"><b>Line  :</b> ${HELPER.nullConverter(data.qr_export_detail_line)}</label>
                        <label class="color-custom-dark"><b>Alasan:</b> ${HELPER.nullConverter(textReason)}</label>
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
        countTotalListPouch()
    }
}

function readDetailListScan(data) {
    data = JSON.parse(atob(data))
    $('.btn-pouch-reject-tolak, .btn-pouch-reject-setuju, .btn-pouch-sisa-tolak, .btn-pouch-sisa-setuju').hide().off('click')
    switch ($('#type_scan').val()) {
        case 'reject':
            
            $.each(data, function(i, v) {
                if (!Array.isArray(v)) {
                    $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                }
            });
            $('#btn-pouch-reject').click();
            setTimeout(function () {
                if (parseInt(data.approval_scan_approve_status) == 0) {
                    $('.btn-pouch-reject-tolak').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        actionApproveListScan(data, 2)
                    })
                    $('.btn-pouch-reject-setuju').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        actionApproveListScan(data, 1)
                    })
                }else if (parseInt(data.approval_scan_approve_status) == 1) { 
                    if (parseInt(data.approval_scan_rollback_status) == 1 && HELPER.isNull(data.approval_scan_rollback_approve)) {
                        $('.btn-pouch-reject-setuju').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            actionApproveListScan(data, 1, 1)
                        })
                        $('.btn-pouch-reject-tolak').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            actionApproveListScan(data, 2, 1)
                        })
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
                if (parseInt(data.approval_scan_approve_status) == 0) {
                    $('.btn-pouch-sisa-tolak').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        actionApproveListScan(data, 2)
                    })
                    $('.btn-pouch-sisa-setuju').show().off('click').on('click', function (e) {
                        e.preventDefault();
                        actionApproveListScan(data, 1)
                    })
                }else if (parseInt(data.approval_scan_approve_status) == 1) { 
                    if (parseInt(data.approval_scan_rollback_status) == 1 && HELPER.isNull(data.approval_scan_rollback_approve)) {
                        $('.btn-pouch-sisa-setuju').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            actionApproveListScan(data, 1, 1)
                        })
                        $('.btn-pouch-sisa-tolak').show().off('click').on('click', function (e) {
                            e.preventDefault();
                            actionApproveListScan(data, 2, 1)
                        })
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

function actionApproveListScan(data, is_approve, is_rollback=0) {
    var msg = "Apakah Anda ingin menyetujui ?";
    if (is_approve == 1) {
        if (is_rollback == 1) {
            msg = "Apakah Anda ingin menyetujui rollback pouch tersebut ?";
        } else {
            msg = "Apakah Anda ingin menyetujui pouch tersebut ?";
        }
    } else {
        if (is_rollback == 1) {
            msg = "Apakah Anda ingin menolak rollback pouch tersebut ?";
        } else {
            msg = "Apakah Anda ingin menolak pouch tersebut ?";
        }
    }
    Swal.fire({
        title: '',
        text: msg,
        icon: 'warning',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check"></i> Yes',
        confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',
        cancelButtonText: '<i class="fa fa-times"></i> No',
        cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark',
        background: '#f5f5f5',
        customClass: {
            title   : 'font-23',
            content : 'font-18'
        },
        input: 'textarea',
        inputLabel: 'Deskripsi',
        inputPlaceholder: 'Ketik deksripsi disini...',
        inputAttributes: {
            'aria-label': 'Ketik deksripsi disini'
        },
    }).then(function(result) {
        if (result.isConfirmed) {
            HELPER.block()
            HELPER.ajax({
                url: BASE_URL + 'Mainqcs/actApproveListScan',
                data: {
                    id: data.approval_scan_id,
                    is_approve: is_approve,
                    is_rollback: is_rollback,
                    desc: result.value
                },
                success: function (res) {
                    $('.close-menu').click()
                    if (res.success) {
                        listApprovalScan()
                        $('.list-scan-'+data.pouch_id).removeClass('is-wait')
                        setTimeout(() => {
                            if($('.is-wait').length == 0) $('.btn-tolak-semua, .btn-setuju-semua').addClass('btn-disabled')
                        }, 500);
                        if (is_approve == 1) {
                            if (is_rollback == 1) {
                                $('.list-scan-status-'+data.pouch_id).find('div').addClass('bg-green2-light').find('span').text('Rollback Disetujui')
                            } else {
                                $('.list-scan-status-'+data.pouch_id).find('div').addClass('bg-green2-dark').find('span').text('Disetujui')
                            }
                        } else {
                            if (is_rollback == 1) {
                                $('.list-scan-status-'+data.pouch_id).find('div').addClass('bg-red2-light').find('span').text('Rollback Ditolak')
                            } else {
                                $('.list-scan-status-'+data.pouch_id).find('div').addClass('bg-red2-dark').find('span').text('Ditolak')
                            }
                        }
                    }
                    HELPER.unblock(500)
                },
                error: function(){
                    HELPER.unblock(500)
                }
            })
        }
    });
}

function countTotalListPouch() {
    setTimeout(function () {
        $('.total_list_pouch').text($('.list-form-scan-data').length)
    }, 1000)
}

/* ======= END SET LIST SCAN ============ */
