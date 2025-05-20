$(function () {
	loadData()
})

function loadData() {
	$('#list-jadwal-tanam').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'Roi/jadwalTanamExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'Roi/jadwalTanamMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#list-jadwal-tanam').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Anda tidak memiliki Jadwal Tanam.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-jadwal-tanam').hide()
            }else{
                $('#btn-more-jadwal-tanam').show()
            }
        },
        callbackMore: function(data) {
            var myQueue = new Queue()
            myQueue.enqueue(function(next) {
                HELPER.block()
                next()
            }, '1').enqueue(function(next) {
                var data_riwayat = $.parseJSON(data.responseText);
                $.each(data_riwayat.data, function(i, val) {
                    var tanggal_tanam = moment(val.petani_tanam_date).format('DD-MM-YYYY')
                    var tanggal_panen = val.petani_tanam_panen_date ? moment(val.petani_tanam_panen_date).format('DD-MM-YYYY') : "-"
                    var panen_qty = val.petani_tanam_panen_qty ? val.petani_tanam_panen_qty + " KG" : "-"
                    var icon_rp = "assets/images/icons/icon-rp-green.png";

                    var hasil = `
                        <div class="div-list-tanam content-boxed shadow-large show-overlay left-0 top-15 right-0 bottom-15" onclick="onRoiTanam('${val.petani_tanam_id}')">
                            <div class="custom-card-header-left-half color-white" style="line-height: 20px;">${val.varietas_name.toUpperCase()}</div>
                            <div class="content bottom-10">
                                <div class="top-10">
                                    <label class="color-custom-black"><i class="fas fa-square color-highlight"></i> Lahan : ${HELPER.nullConverter(val.lahan_nama)}</label>
                                    <label class="color-custom-black"><i class="fas fa-calendar color-highlight"></i> Tgl. Tanam : ${tanggal_tanam}</label>
                                    <label class="color-custom-black"><i class="fas fa-calendar color-highlight"></i> Tgl. Panen : ${tanggal_panen}</label>
                                    <label class="color-custom-black"><i class="fas fa-weight color-highlight"></i> Jumlah Panen : ${panen_qty}</label>
                                    <div class="row">
                                        <img src="`+ icon_rp + `" onerror="this.src='./assets/images/noimage.png'" style="height: 12px; margin-top: 5px; margin-left: 0px;">
                                        <label class="color-custom-black" style="padding-left:6px;"> Pendapatan : Rp ${HELPER.toRp(val.petani_tanam_roi_total_in)}</label>
                                    </div>
                                    <div class="row">
                                        <img src="`+ icon_rp + `" onerror="this.src='./assets/images/noimage.png'" style="height: 12px; margin-top: 5px; margin-left: 0px;">
                                        <label class="color-custom-black" style="padding-left:6px;"> Pengeluaran : Rp ${HELPER.toRp(val.petani_tanam_roi_total_out)}</label>
                                    </div>
                                    <div class="row">
                                        <img src="`+ icon_rp + `" onerror="this.src='./assets/images/noimage.png'" style="height: 12px; margin-top: 5px; margin-left: 0px;">
                                        <label class="color-custom-black" style="padding-left:6px;"> AUT  : Rp ${HELPER.toRp(val.petani_tanam_roi_total_nett)}</label>
                                    </div>
                                </div>
                            </div>
                            <div class="content-footer">
                                <span>Ketuk untuk detail</span>
                                <i class="fa fa-angle-right fa-lg"></i>
                            </div>
                            <div class="clear"></div>
                        </div>
                    `;
                    $('#list-jadwal-tanam').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-jadwal-tanam').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-jadwal-tanam').hide()
            $('#btn-more-jadwal-tanam').off('click');
        }
    })
}

function onRoiTanam(petani_tanam_id) {
    HELPER.setItem('from_page', 'petani-roi');
	HELPER.setItem('detail_roi_petani_tanam_id', petani_tanam_id)
	setTimeout(function () {
		onPage('petani-roi-detail')
	}, 100)
}