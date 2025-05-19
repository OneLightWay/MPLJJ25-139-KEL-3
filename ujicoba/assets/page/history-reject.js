var mymap;
$(function () {
    $('#form-search-history-scan').off('change').on('change', function(){
        listApprove(this.value)
    })
    listApprove()
})

function listApprove(search) {
    $('#show_list_approve').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Mainqcs/listApproveExistHistory',
        dataExist: {
            pouch_number: search,
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Mainqcs/listApproveMoreHistory',
        dataMore: {
            pouch_number: search,
            user_id: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#show_list_approve').html(`<div class="content-boxed content-box bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada data pengajuan baru.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-approve').hide()
            }else{
                $('#btn-more-approve').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_approve = $.parseJSON(data.responseText);
                $.each(data_approve.data, function(i, v) {
                    var bgStatusHead = "", textStatusHead = "";
                    if (parseInt(v.approval_scan_approve_status) == 0) { bgStatusHead = "bg-yellow2-dark";textStatusHead="Waiting";}
                    else if (parseInt(v.approval_scan_approve_status) == 1) { 
                        bgStatusHead = "bg-green2-dark";textStatusHead="Disetujui";
                        if (parseInt(v.approval_scan_rollback_status) == 1) {bgStatusHead = "bg-red2-light";textStatusHead="Dibatalkan";}
                    }
                    else if (parseInt(v.approval_scan_approve_status) == 2) { bgStatusHead = "bg-red2-dark";textStatusHead="Ditolak";}

                    $('#show_list_approve').append(`
                        <div class="content bottom-20">
                            <a href="javascript:;" class="caption round-medium shadow-large bg-theme bottom-15 show-overlay" onclick="onDetailApproval('${v.approval_scan_type}', '${v.approval_scan_id}')">
                                <div class="custom-caption-header-left-half bg-green2-dark"><span>Pouch ${HELPER.ucwords(v.approval_scan_type)}</span></div>
                                <div class="custom-caption-header-right-half ${bgStatusHead}"><span>${textStatusHead}</span></div>
                                <div class="clear"></div>
                                <div class="content left-20 bottom-10 top-30">
                                    <div class="top-5">
                                        <label class="color-custom-dark"><b>Penyetuju :</b> ${v.user_nama}</label>
                                        <label class="color-custom-dark"><b>Pouch   :</b> ${v.pouch_number}</label>
                                        <label class="color-custom-dark"><b>Tanggal :</b> ${moment(v.approval_scan_created_at).format('D/MM/YYYY HH:mm')}</label>
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
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-approve').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-approve').hide()
            $('#btn-more-approve').off('click');
        }

    })
}

function onDetailApproval(type, idd) {
    HELPER.ajax({
        url: BASE_URL+'Mainqcs/detailApprovalHistory',
        data: {id: idd},
        success: function(res){
            if (res.success) {
                var img = 'assets/images/avatars/6s.png';
                if (res.data.approval.user_foto) {
                    img = BASE_ASSETS+'user/'+data.user_foto;
                }
                if (type == "reject") {
                    $('.approval-reject-foto').attr('src', img)
                    $('.approval-reject-nama').text(res.data.approval.user_nama)
                    $('.approval-reject-jabatan').text(res.data.approval.jabatan_name)
                    $.each(res.data.pouch, function(i, v) {
                        if (!Array.isArray(v)) {
                            $('.detail_reject-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                    $('.content-detail_sisa').hide()
                    $('.content-detail_reject').show()
                } else {
                    $('.approval-sisa-foto').attr('src', img)
                    $('.approval-sisa-nama').text(res.data.approval.user_nama)
                    $('.approval-sisa-jabatan').text(res.data.approval.jabatan_name)
                    var start_pouch = parseInt(res.data.pouch.pouch_number) + 1;
                    $('.detail_sisa-no_seri_awal').text(start_pouch)
                    $('.detail_sisa-no_seri_akhir').text(res.data.pouch.qr_export_detail_end)
                    $.each(res.data.pouch, function(i, v) {
                        if (!Array.isArray(v)) {
                            $('.detail_sisa-'+i).text(HELPER.nullConverter(v))
                        }
                    });
                    $('.content-detail_reject').hide()
                    $('.content-detail_sisa').show()
                }
                $('#btn-approval-detail-scan').click()
            }
        }
    })
}
