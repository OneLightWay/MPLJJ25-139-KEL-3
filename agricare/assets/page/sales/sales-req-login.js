$(function () {
    loadRiwayatWaiting()
	loadRiwayatFinish()
})

function loadRiwayatWaiting() {
	$('.list-riwayat-waiting').html('')
    var user_id = HELPER.getItem('user_id')

    HELPER.initLoadMore({
        perPage: 50,
        urlExist: BASE_URL + 'ReqLogin/riwayatWaitingExist',
        dataExist: {
            user_id: user_id,
        },
        urlMore: BASE_URL + 'ReqLogin/riwayatWaitingMore',
        dataMore: {
            user_id: user_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.list-riwayat-waiting').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Belum ada riwayat</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-riwayat-waiting').hide()
            }else{
                $('#btn-more-riwayat-waiting').show()
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
                	var login_time = moment(v.request_email_date).format('DD-MM-YYYY HH:mm')
                    var isihtml = ""; htmlTelpDiff = "";
                    if (v.request_email_kios_id) {
                        if (v.user_telepon != v.kios_telp_temp) {
                            htmlTelpDiff = `<label class="color-custom-black" data-no="${v.kios_telp_temp}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>Login : ${HELPER.nullConverter(v.kios_telp_temp)}</label>
                                            <label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>Terdaftar : ${HELPER.nullConverter(v.user_telepon)}</label>`;
                        }else{
                            htmlTelpDiff = `<label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>${HELPER.nullConverter(v.user_telepon)}</label>`;
                        }
                        isihtml = `
                            <div class="div-list-waiting content-boxed shadow-large m-0 bottom-10">
                                <div class="content bottom-10">
                                    <div class="row">
                                        <div class="col-auto right-10" style="align-self: center;">
                                            <img src="./assets/images/nearby/ikon-kios.svg" style="width: 65px;">
                                        </div>
                                        <div class="col">
                                            <label class="color-custom-black"><i class="fas fa-store color-highlight"></i>${HELPER.nullConverter(v.kios_nama)}</label>
                                            <label class="color-custom-black"><i class="fas fa-list color-highlight"></i>${HELPER.nullConverter(v.kios_partner_code)}</label>
                                            <label class="color-custom-black"><i class="fas fa-user color-highlight"></i>${HELPER.nullConverter(v.user_nama)}</label>
                                            ${htmlTelpDiff}
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i>${login_time}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="content-footer">
                                    <div class="one-half">
                                        <a href="javascript:void(0)" class="button button-full bg-red2-dark round-small show-overlay left-5 top-5 right-5 bottom-5" onclick="onRejectReq('${v.request_email_id}','${HELPER.nullConverter(v.kios_nama)}')">Reject</a>
                                    </div>
                                    <div class="one-half last-column">
                                        <a href="javascript:void(0)" class="button button-full bg-green2-light round-small show-overlay left-5 top-5 right-5 bottom-5" onclick="onAcceptReq('${v.request_email_id}','${HELPER.nullConverter(v.kios_nama)}')">Accept</a>
                                    </div>
                                    <div class="clear"></div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        `;
                    }else{
                        if (v.user_telepon != v.tradder_telp_temp) {
                            htmlTelpDiff = `<label class="color-custom-black" data-no="${v.tradder_telp_temp}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>Login : ${HELPER.nullConverter(v.tradder_telp_temp)}</label>
                                            <label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>Terdaftar : ${HELPER.nullConverter(v.user_telepon)}</label>`;
                        }else{
                            htmlTelpDiff = `<label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>${HELPER.nullConverter(v.user_telepon)}</label>`;
                        }
                        isihtml = `
                            <div class="div-list-waiting content-boxed shadow-large m-0 bottom-10">
                                <div class="content bottom-10">
                                    <div class="row">
                                        <div class="col-auto right-10" style="align-self: center;">
                                            <img src="./assets/images/nearby/ikon-trader.svg" style="width: 65px;">
                                        </div>
                                        <div class="col">
                                            <label class="color-custom-black"><i class="fas fa-store color-highlight"></i>${HELPER.nullConverter(v.tradder_name)}</label>
                                            <label class="color-custom-black"><i class="fas fa-user color-highlight"></i>${HELPER.nullConverter(v.user_nama)}</label>
                                            ${htmlTelpDiff}
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i>${login_time}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="content-footer">
                                    <div class="one-half">
                                        <a href="javascript:void(0)" class="button button-full bg-red2-dark round-small show-overlay left-5 top-5 right-5 bottom-5" onclick="onRejectReq('${v.request_email_id}','${HELPER.nullConverter(v.tradder_name)}')">Reject</a>
                                    </div>
                                    <div class="one-half last-column">
                                        <a href="javascript:void(0)" class="button button-full bg-green2-light round-small show-overlay left-5 top-5 right-5 bottom-5" onclick="onAcceptReq('${v.request_email_id}','${HELPER.nullConverter(v.tradder_name)}')">Accept</a>
                                    </div>
                                    <div class="clear"></div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        `;
                    }
                    $('.list-riwayat-waiting').append(isihtml)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-riwayat-waiting').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-riwayat-waiting').hide()
            $('#btn-more-riwayat-waiting').off('click');
        }

    })
}

function loadRiwayatFinish() {
    $('.list-riwayat-finish').html('')
    var user_id = HELPER.getItem('user_id')

    HELPER.initLoadMore({
        perPage: 50,
        urlExist: BASE_URL + 'ReqLogin/riwayatFinishExist',
        dataExist: {
            user_id: user_id,
        },
        urlMore: BASE_URL + 'ReqLogin/riwayatFinishMore',
        dataMore: {
            user_id: user_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('.list-riwayat-finish').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Belum ada riwayat.</h3>
                                                </div>
                                            </div>`)
                $('#btn-more-riwayat-finish').hide()
            }else{
                $('#btn-more-riwayat-finish').show()
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
                    var login_time = moment(v.request_email_date).format('DD-MM-YYYY HH:mm')
                    var login_time_act = moment(v.request_email_date_acc).format('DD-MM-YYYY HH:mm')
                    var login_status_color = "bg-red2-dark";
                    var login_status_text  = "Reject";
                    if (parseInt(v.request_email_status) == 1) {
                        login_status_color = "bg-green2-light";
                        login_status_text  = "Accept";
                    }else if (parseInt(v.request_email_status) == 3) {
                        login_status_color = "bg-red2-light";
                        login_status_text  = "Cancel";
                    }
                    var isihtml = "";
                    if (v.request_email_kios_id) {
                        isihtml = `
                            <div class="div-list-waiting content-boxed shadow-large m-0 bottom-10">
                                <div class="content bottom-10">
                                    <div class="row">
                                        <div class="col-auto right-10" style="align-self: center;">
                                            <img src="./assets/images/nearby/ikon-kios.svg" style="width: 65px;">
                                        </div>
                                        <div class="col">
                                            <label class="color-custom-black"><i class="fas fa-store color-highlight"></i>${HELPER.nullConverter(v.kios_nama)}</label>
                                            <label class="color-custom-black"><i class="fas fa-list color-highlight"></i>${HELPER.nullConverter(v.kios_partner_code)}</label>
                                            <label class="color-custom-black"><i class="fas fa-user color-highlight"></i>${HELPER.nullConverter(v.user_nama)}</label>
                                            <label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>${HELPER.nullConverter(v.user_telepon)}</label>
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i>${login_time}</label>
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i><span class="radius-5 ${login_status_color}" style="padding: 5px;">${login_status_text} : ${login_time_act}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        `;
                    }else{
                        isihtml = `
                            <div class="div-list-waiting content-boxed shadow-large m-0 bottom-10">
                                <div class="content bottom-10">
                                    <div class="row">
                                        <div class="col-auto right-10" style="align-self: center;">
                                            <img src="./assets/images/nearby/ikon-trader.svg" style="width: 65px;">
                                        </div>
                                        <div class="col">
                                            <label class="color-custom-black"><i class="fas fa-store color-highlight"></i>${HELPER.nullConverter(v.tradder_name)}</label>
                                            <label class="color-custom-black"><i class="fas fa-user color-highlight"></i>${HELPER.nullConverter(v.user_nama)}</label>
                                            <label class="color-custom-black" data-no="${v.user_telepon}" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i>${HELPER.nullConverter(v.user_telepon)}</label>
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i>${login_time}</label>
                                            <label class="color-custom-black"><i class="fas fa-clock color-highlight"></i><span class="radius-5 ${login_status_color}" style="padding: 5px;">${login_status_text} : ${login_time_act}</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        `;
                    }
                    $('.list-riwayat-finish').append(isihtml)
                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-riwayat-finish').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-riwayat-finish').hide()
            $('#btn-more-riwayat-finish').off('click');
        }

    })
}

function onRejectReq(idd, name) {
    HELPER.confirm({
        allowOutsideClick: false,
        message: 'Apakah Anda ingin menolak permintaan login "'+name+'" ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL+'ReqLogin/reject',
                    data:{id: idd},
                    complete: function (res) {
                        loadRiwayatWaiting()
                        loadRiwayatFinish()
                    }
                })
            }
        }
    })
}

function onAcceptReq(idd, name) {
    HELPER.confirm({
        allowOutsideClick: false,
        message: 'Apakah Anda ingin menyetujui permintaan login "'+name+'" ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL+'ReqLogin/accept',
                    data:{id: idd},
                    complete: function (res) {
                        loadRiwayatWaiting()
                        loadRiwayatFinish()
                    }
                })
            }
        }
    })
}