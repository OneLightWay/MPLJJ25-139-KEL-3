var selectListScan = [];
$(function () {
	loadHistroyReportProduk()
})

function loadHistroyReportProduk() {
	$('#list-report-produk').html('')
	HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/listReportProdukExist',
        dataExist: {
			user: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'AkunSales/listReportProdukMore',
        dataMore: {
			user: HELPER.getItem('user_id'),
        },
        callbackExist: function(data) {
			if (data.hasOwnProperty('success')) {
				$('#list-report-produk').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
												<div class="not-found">
													<div></div>
						                            <h3 class bhsConf-no_histori>No history available.</h3>
						                        </div>
											</div>`)
				$('#btn-more-report-produk').hide()
			}else{
				$('#btn-more-report-produk').show()
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
					var tanggal = moment(v.laporan_sales_created_at).format('DD MMMM YYYY HH:mm')
                    var colorStatus = "color-highlight";
                    var backgroundStatus = "#f0fff0";
                    var content = `
                        <div class="row bottom-5">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span>Kategori : ${HELPER.nullConverter(v.laporan_sales_kategori_nama)}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-auto right-10">
                                <i class="fa fa-circle ${colorStatus}"></i>
                            </div>
                            <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                <span class="text-break text-wrap">Keterangan : ${HELPER.nullConverter(v.laporan_sales_keterangan)}</span>
                            </div>
                        </div>
                    `;
					
					$('#list-report-produk').append(`
						<div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-select-${v.laporan_sales_id}" style="background: ${backgroundStatus};">
							<div class="row bottom-10">
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${tanggal}</span>
			                    </div>
			                </div>
			                ${content}
		                </div>
					`)

					$('.btn-select-'+v.laporan_sales_id).off('click').on('click', function(event) {
                        onSelectScan(v)
                    });

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-report-produk').off('click').on('click', function() {
            	HELPER.block()
            	callLoadMore()
            });
        },
        callbackEnd: function () {
        	$('#btn-more-report-produk').hide()
        	$('#btn-more-report-produk').off('click');
        }
    })
}

function onSelectScan(v) {
    HELPER.confirm({
        message: 'Apakah Anda ingin membatalkan aksi report tersebut ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL+'AkunSales/rollbackReportProduk',
                    data:{id: v.laporan_sales_id},
                    success: function (res) {
                        if (res.success) {
                            HELPER.showMessage({
                                success: true,
                                message: 'Berhasil membatalkan data !'
                            })
                            loadHistroyReportProduk()
                        } else {
                            HELPER.showMessage()
                        }
                    }
                })
            }
        }
    })
}