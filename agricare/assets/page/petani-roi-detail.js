var kat_roi = [
    'Benih',
    'Pengolahan Tanah',
    'Pupuk',
    'Pestisida',
    'Tenaga Kerja',
    'Pasca Panen',
    'Pengeluaran Tambahan',
    'Pemasukan Tambahan',
];
$(function () {
	loadRoiDetail(HELPER.getItem('detail_roi_petani_tanam_id'))
    setTimeout(() => {
        if (parseInt(HELPER.getItem('intro-aut-detail')) <= 5 || HELPER.isNull(HELPER.getItem('intro-aut-detail'))) {
            introJs().setOptions({'buttonClass': 'bg-highlight color-white radius-5 wrapped-text-small', 'nextLabel': 'Lanjut', 'prevLabel': 'Kembali', 'doneLabel': 'Oke'}).start();
            HELPER.setItem('intro-aut-detail', HELPER.isNull(HELPER.getItem('intro-aut-detail')) ? 1 : parseInt(HELPER.getItem('intro-aut-detail'))+1)
        }
    }, 500);
    setTimeout(function () {
        $('.back-button, #roi_input_kategori, #roi_input_pupuk, #roi_input_pestisida, #roi_input_satuan, #roi_input_harga, .btn-lihat-jadwal-tanam, .btn-export-roi').off();
        setTimeout(function () {
            if (HELPER.getItem('from_page')) {
                var fromPage   = HELPER.getItem('from_page');
                $('.back-button').removeAttr('onclick')
                setTimeout(function () {
                    $('.back-button').on('click', function() {onPage(fromPage)});
                }, 200)
                HELPER.removeItem(['from_page','team_user_id_back'])
            }else{
                $('.back-button').on('click', function() {onPage('petani-roi')});
            }
            // $('#plus-menu').toggle( "bounce", { times: 1, distance: 100 }, 1000 );
            $('#roi_input_kategori').on('change', function(e) {
                $('#roi_input_deskripsi, #roi_input_pupuk, #roi_input_pestisida').val('')
                if (this.value == "Pupuk") {
                    $('.show-input-pestisida').hide()
                    $('.show-input-pupuk').show()
                    $('#roi_input_pupuk').val('').attr('required', true);
                    $('#roi_input_deskripsi, #roi_input_pestisida').removeAttr('required');
                }else if (this.value == "Pestisida") {
                    $('.show-input-pupuk').hide()
                    $('.show-input-pestisida').show()
                    $('#roi_input_pestisida').val('').attr('required', true);
                    $('#roi_input_deskripsi, #roi_input_pupuk').removeAttr('required');
                }else{
                    $('.roi-input-deskripsi').show()
                    $('#roi_input_pestisida, #roi_input_pupuk').removeAttr('required');
                    $('.show-input-pupuk, .show-input-pestisida').hide()
                    $('#roi_input_deskripsi').removeClass('btn-disabled').val('').parent().show()
                    // $('#roi_input_deskripsi').attr('required', true)
                }
            });
            $('#roi_input_pupuk, #roi_input_pestisida').on('change', function(e) {
                if (this.value == "Lainnya") {
                    $('.roi-input-deskripsi').hide()
                    $('#roi_input_deskripsi').removeClass('btn-disabled').val('').parent().show()
                }else{
                    $('#roi_input_deskripsi').addClass('btn-disabled').val('').parent().hide()
                }
            });
            $('#roi_input_unit').inputmask({
                'alias': 'decimal',
                'placeholder': '0',
                'rightAlign': false,
                'radixPoint': ',',
                'digits': 2,
                isComplete: function (e) {
                    var satuan = $('#roi_input_unit').val() ? parseFloat($('#roi_input_unit').val().replace(",", ".")) : 0;
                    var harga  = $('#roi_input_harga').val() ? parseFloat($('#roi_input_harga').val().replace(",", ".")) : 0;
                    $('#roi_input_total').val(parseFloat(parseFloat(satuan*harga).toFixed(2)))
                }
            });
            $('#roi_input_harga').inputmask({
                'alias': 'currency',
                'autoUnmask': true,
                'placeholder': '0',
                'rightAlign': false,
                'radixPoint': ',',
                isComplete: function (e) {
                    var satuan = $('#roi_input_unit').val() ? parseFloat($('#roi_input_unit').val().replace(",", ".")) : 0;
                    var harga  = $('#roi_input_harga').val() ? parseFloat($('#roi_input_harga').val().replace(",", ".")) : 0;
                    $('#roi_input_total').val(parseFloat(parseFloat(satuan*harga).toFixed(2)))
                }
            });
            $('#roi_input_total').inputmask({
                'alias': 'currency',
                'autoUnmask': true,
                'placeholder': '0',
                'rightAlign': false,
                'radixPoint': ',',
            });
            $('#roi_input_harga_panen').inputmask({
                'alias': 'currency',
                'autoUnmask': true,
                'placeholder': '0',
                'rightAlign': false,
                'radixPoint': ',',
            });
        }, 200)
    }, 300)
    
    HELPER.createCombo({
        el: 'roi_input_pupuk',
        url: BASE_URL+'Roi/getDataPupuk',
        valueField: 'id',
        displayField: 'name',
        withNull: false,
        isSelect2: false,
        optionCustom: {id:'Lainnya',name:'Lainnya'},
    })
    HELPER.createCombo({
        el: 'roi_input_pestisida',
        url: BASE_URL+'Roi/getDataPestisida',
        valueField: 'id',
        displayField: 'name',
        withNull: false,
        isSelect2: false,
        optionCustom: {id:'Lainnya',name:'Lainnya'},
    })
})

function loadRoiDetail(petani_tanam_id) {
    $('#div-data-roi').html('')
    HELPER.ajax({
        url: BASE_URL+'Roi/loadRoiDetail',
        data:{petani_tanam_id: petani_tanam_id},
        complete: function (res) {
            if (res.success) {
                var dataTanam = res.data;
                var tanggal_tanam = moment(dataTanam.petani_tanam_date).format('DD-MM-YYYY')
                var tanggal_panen = dataTanam.petani_tanam_panen_date ? moment(dataTanam.petani_tanam_panen_date).format('DD-MM-YYYY') : "-"
                var panen_qty = dataTanam.petani_tanam_panen_qty ? parseFloat(dataTanam.petani_tanam_panen_qty) : 0;
                $('.roi-varietas-name').text(dataTanam.varietas_name)
                $('.roi-lahan-name').text(HELPER.nullConverter(dataTanam.lahan_nama) + " ("+HELPER.toRp(dataTanam.lahan_luas)+" Ha)")
                $('.roi-tgl-tanam').text(tanggal_tanam)
                $('.roi-tgl-panen').text(tanggal_panen)
                $('.roi-qty-panen').text(panen_qty + " KG")
                $('.roi-pendapatan').text('Rp '+HELPER.toRp(dataTanam.petani_tanam_roi_total_in))
                $('.roi-pengeluaran').text('Rp '+HELPER.toRp(dataTanam.petani_tanam_roi_total_out))
                $('.roi-nett').text('Rp '+HELPER.toRp(dataTanam.petani_tanam_roi_total_nett))

                $('#roi_input_jadwal_id').val(petani_tanam_id)
                $('#roi_input_petani_id').val(HELPER.getItem('user_id'))
                $('#roi_input_province_id').val(HELPER.getItem('user_province_id'))
                $('#roi_input_regency_id').val(HELPER.getItem('user_regency_id'))
                $('#roi_input_district_id').val(HELPER.getItem('user_district_id'))
                $('#roi_input_village_id').val(HELPER.getItem('user_village_id'))


                var total_biaya = 0;
                var harga_panen = parseFloat(dataTanam.petani_tanam_roi_harga_panen)
            	$.each(kat_roi, function(iKat, vKat) {

                    var body_isi_roi = "";
                    var roi_sub_total = 0;
                    if (dataTanam.data_isi.hasOwnProperty(vKat)) {
                        $.each(dataTanam.data_isi[vKat], function(iIsi, vIsi) {
                            var isi_flag = parseInt(vIsi.roi_flag) == 0 ? "color-green2-light" : "color-red2-light";
                            if (parseInt(vIsi.roi_flag) == 0) {
                                roi_sub_total += parseFloat(vIsi.roi_data_total);
                            }else{
                                roi_sub_total -= parseFloat(vIsi.roi_data_total);
                            }
                            body_isi_roi += `
                                <div class="row" data-roi-name="${HELPER.nullConverter(vIsi.roi_data_name)}" data-roi-id="${vIsi.roi_id}" data-roi="${btoa(JSON.stringify(vIsi))}" onclick="onEditRoi(this)">
                                    <div class="col text-left">
                                        <p class="lh-15 m-0 bold">${HELPER.nullConverter(vIsi.roi_data_name)}</p>
                                        <p class="lh-15 m-0 bold">${HELPER.nullConverter(vIsi.roi_data_unit, 0)} ${HELPER.nullConverter(vIsi.roi_data_satuan)} (Rp ${HELPER.toRp(vIsi.roi_data_price)})</p>
                                    </div>
                                    <div class="col-auto text-right">
                                        <span class="${isi_flag}">Rp ${HELPER.toRp(vIsi.roi_data_total)}</span>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    setTimeout(function () {
                        total_biaya += roi_sub_total;
                        $('#div-data-roi').append(`
                            <div class="content-box box-roi">
                                <div class="row box-roi-header bg-blue1-light" data-setaccordion="accordion-content-${iKat}">
                                    <div class="col"><span>${vKat}</span></div>
                                    <div class="col-auto"><span>Rp ${HELPER.toRp(roi_sub_total)}</span></div>
                                </div>
                                <div class="clear"></div>
                                <div class="box-roi-body accordion-content" id="accordion-content-${iKat}" style="display: block;">
                                    ${body_isi_roi}
                                </div>
                            </div>
                        `)
                    }, 300)
                });
                setTimeout(function () {
                    activate_setaccordions()
                    var pendapatan_kotor  = (harga_panen*panen_qty);
                    var pendapatan_bersih = (pendapatan_kotor-total_biaya);
                    $('.roi-total-biaya').text(HELPER.toRp(total_biaya))
                    $('.roi-harga-panen').text(HELPER.toRp(harga_panen))
                    $('.roi-pendapatan-kotor').text(HELPER.toRp(pendapatan_kotor))
                    $('.roi-pendapatan-bersih').text(HELPER.toRp(pendapatan_bersih))
                    if (dataTanam.petani_tanam_roi_harga_panen > 50000) {
                        var pendapatan_bersih = (dataTanam.petani_tanam_roi_harga_panen) - (dataTanam.petani_tanam_roi_total_out)
                        $('.roi-harga-panen').text(HELPER.toRp(dataTanam.petani_tanam_roi_harga_panen))
                        $('.roi-pendapatan-kotor').text(HELPER.toRp(dataTanam.petani_tanam_roi_harga_panen))
                        $('.roi-pendapatan-bersih').text(HELPER.toRp(pendapatan_bersih))
                    }
                    $('#roi_input_harga_panen').val(harga_panen)
                    $('.btn-lihat-jadwal-tanam').on('click', function(e) {
                        HELPER.setItem('lokasi_lahan_detail_tanam', dataTanam.petani_tanam_id)
                        HELPER.setItem('petani_lahan_id', dataTanam.petani_tanam_lahan_id)
                        setTimeout(function () {
                            onPage('lokasi-lahan-detail')
                        }, 300)
                    });
                    $('.btn-export-roi').on('click', function(e) {
                        onExportRoi(dataTanam)
                    });
                }, 500)
            }else{
                HELPER.showMessage({
                    title: 'Gagal !',
                    message: 'Data tidak ditemukan !',
                    allowOutsideClick: false,
                    callback: function () {
                        $('.back-button').click()
                    }
                })
            }
        }
    })
}


function activate_setaccordions(){
    var accordion = $('[data-setaccordion]');
    if(accordion.length){
        accordion.on("click", function() {
            var accordion_number = $(this).data('setaccordion');
            $(this).parent().find('.accordion-content').slideUp(200);
            if ($('#' + accordion_number).is(":visible")) {
                $('#' + accordion_number).slideUp(200);
            } else {
                $('#' + accordion_number).slideDown(200);
            }
        });
    }
}

function onAddRoi() {
    $('#roi_input_pupuk, #roi_input_pestisida, #roi_input_deskripsi, #roi_input_unit, #roi_input_satuan, #roi_input_harga, #roi_input_total, #roi_input_id').val('')
    $('.roi-title-action').text('Tambah Detail')
    $('.for-roi-add').show()
    $('.for-roi-edit').hide()
    $('#btn-add-roi').click()
}

function saveRoi() {
    var form = $('#form-roi')[0];
    var formData = new FormData(form);
    $('.close-menu').click()
    HELPER.save({
        url: BASE_URL+'Roi/saveData',
        cache : false,
        data  : formData, 
        contentType : false, 
        processData : false,
        confirm: true,
        success : function(success)
        {
            HELPER.unblock(100);
            loadRoiDetail($('#roi_input_jadwal_id').val())
        },
        oncancel: function (result) {
            $('#btn-add-roi').click()
        }
    });
}

function saveHargaPanen() {
    HELPER.ajax({
        url: BASE_URL+'Roi/setHargaPanen',
        data: {
            harga: $('#roi_input_harga_panen').val(),
            roi_input_petani_id: $('#roi_input_petani_id').val(),
            roi_input_jadwal_id: $('#roi_input_jadwal_id').val(),
        },
        success: function (res) {
            $('.close-menu').click()
            loadRoiDetail($('#roi_input_jadwal_id').val())
        }
    })
}

function onDeleteRoi(el) {
    if (el) {
        $('.close-menu').click()
        var roi_name = $(el).data('roi-name')
        var roi_id = $(el).data('roi-id')
        HELPER.confirm({
            message: 'Apakah Anda ingin menghapus data "'+roi_name+'" ?',
            allowOutsideClick: false,
            callback: function (oke) {
                if (oke) {
                    HELPER.ajax({
                        url: BASE_URL+'Roi/deleteRoiData',
                        data: {
                            roi_id: roi_id,
                        },
                        success: function (res) {
                            loadRoiDetail($('#roi_input_jadwal_id').val())
                        }
                    })
                }else{
                    $('#btn-add-roi').click()
                }
            }
        })
    }
}

function onEditRoi(el) {
    onAddRoi()
    setTimeout(function () {
        $('.for-roi-add').hide()
        $('.for-roi-edit').show()
        var data = JSON.parse(atob($(el).data('roi')))
        $('#roi_input_id').val(data.roi_id)
        $('#roi_input_kategori').val(data.roi_kategori).trigger('change')
        $('.roi-title-action').text('Edit Detail')
        setTimeout(function () {
            $('.btn-delete-roi').data('roi-name', HELPER.nullConverter(data.roi_data_name))
            $('.btn-delete-roi').data('roi-id', data.roi_id)
            if (data.roi_kategori == "Pupuk") {
                if (data.roi_data_ext_id == null) {
                    $('#roi_input_pupuk').val('Lainnya').trigger('change')
                }else{
                    $('#roi_input_pupuk').val(data.roi_data_ext_id).trigger('change')
                }
            }else if (data.roi_kategori == "Pestisida") {
                if (data.roi_data_ext_id == null) {
                    $('#roi_input_pestisida').val('Lainnya').trigger('change')
                }else{
                    $('#roi_input_pestisida').val(data.roi_data_ext_id).trigger('change')
                }
            }
            setTimeout(function () {
                $('#roi_input_deskripsi').val(data.roi_data_name)
                $('#roi_input_unit').val(data.roi_data_unit.replace(".", ","))
                $('#roi_input_satuan').val(data.roi_data_satuan)
                $('#roi_input_harga').val(data.roi_data_price).trigger('keyup')
                setTimeout(function () {
                    $('#roi_input_unit').inputmask('isComplete')
                }, 200)
            }, 200)
        }, 200)
    }, 200)

}

/* function onExportRoi(dataTanam) {
    HELPER.block()
    var nameFile = "Data AUT Lahan "+dataTanam.lahan_nama+".xlsx";
    var uri = BASE_URL + 'Roi/export/'+dataTanam.petani_tanam_id;
    var fileURL = cordova.file.externalDataDirectory + nameFile;
    var fileTransfer = new FileTransfer();
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            HELPER.unblock(100)
            window.plugins.toast.showWithOptions(
                {
                    message: "File berhasil di export !",
                    duration: "short",
                    position: "bottom",
                    addPixelsY: -40
                }
            );

            setDownloadFile(nameFile, fileURL)
            
            cordova.plugins.fileOpener2.open(
                fileURL,
                'application/vnd.ms-excel',
                {
                    error: function (e) {
                        HELPER.unblock(100)
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success: function () {
                        HELPER.unblock(100)
                        console.log('file opened successfully');
                    }
                }
            )
        },
        function (e) {
            HELPER.unblock(100)
            console.log(e);
            HELPER.showMessage()
        },
    );
} */

function onExportRoi(dataTanam) {
    HELPER.block()
    var uri = BASE_URL + 'Roi/newExport/'+dataTanam.petani_tanam_id;
    HELPER.ajax({
        url: uri,
        success: function (res) {
            HELPER.showMessage({
                success: true,
                message: 'Laporan akan dikirim ke No Whatsapp Anda !'
            })
        }
    })
    HELPER.unblock(1000)
}

function setDownloadFile(nameFile, fileURL) {
    var permissions = cordova.plugins.permissions;
    var list = [permissions.WRITE_EXTERNAL_STORAGE, permissions.READ_EXTERNAL_STORAGE];
    cordova.plugins.permissions.checkPermission(list, function (authorized) {
        console.log("Storage permission is " + (authorized ? "authorized" : "unauthorized"));
        if (!authorized.hasPermission) {
            permissions.requestPermissions(
                list,
                function (status) {
                    runDownloadFile(nameFile, fileURL)
                    
                },
                null);
        } else {
            runDownloadFile(nameFile, fileURL)
        }
    }, function (error) {
        console.error("The following error occurred: " + error);
    });
}

function runDownloadFile(nameFile, fileURL) {
    window.resolveLocalFileSystemURL('file:///storage/emulated/0/Download', function (fileEntry) {
        var filepath = fileEntry.toURL() + nameFile;
        var fileTransfer = new FileTransfer();
        fileTransfer.download(fileURL, filepath,
            function (fileEntry) {
                window.plugins.toast.showWithOptions(
                    {
                        message: "File berhasil di unduh !",
                        duration: "short",
                        position: "bottom",
                        addPixelsY: -40
                    }
                );
            },
            function (error) {
                console.log("ErrorDownload: " + JSON.stringify(error));
            },
            true,
            {}
        );
    });
}
