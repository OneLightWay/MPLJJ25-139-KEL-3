$(function () {
    $('.show-date').text(moment().format('dddd, DD MMMM YYYY'))
    $('.show-alamat').text(HELPER.ucwords(HELPER.getItem('user_district_name') + ", " + HELPER.getItem('user_regency_name')))
    // $('.show-jabatan').text(HELPER.ucwords(HELPER.getItem('jabatan_name')))
    $('.show-name').text(HELPER.ucwords(HELPER.getItem('user_nama')))
    if (!HELPER.isNull(HELPER.getItem('user_foto'))) {
        $('.user-foto').attr('src', BASE_ASSETS + 'user/thumbs/' + HELPER.getItem('user_foto'));
    }

    $('button[data-type][data-caption]').off('click').on('click', (event) => {
        var data = $(event.target).data();
        console.log(data);
        $('span.jenis_harga').html(data.caption)
        $('input[name=tipe]').val(data.type)
        $('a.deployer').trigger('click')
    })

    $('#ubah_harga').inputmask('currency', {
        rightAlign: false,
        prefix: "",
    });

    // if(HELPER.getItem('configDataSales')==null){
    //     getSalesTrader()
    //   }

    grabPrice();
    loadConfig()
})

var grabPrice = () => {
    $.get(BASE_URL + '/Trader/grabPrice/' + window.localStorage.getItem('user_id'), response => {
        $.each(response.data, (i, v) => {
            $(`.harga.corn_price_detailed_price_${
                v.corn_price_type
            }`).html(`Rp. ${
                HELPER.toRp(v.corn_price_detailed_price)
            },00`)
        })
    })
}

var saveHarga = () => {
    var harga = $('input[name=harga]').val();
    var tipe = $('input[name=tipe]').val();
    var trader = window.localStorage.getItem('user_id');
    var jenis_jagung = (tipe == 1) ? 'Jagung Pipilan Basah' : (tipe == 2 ? 'Jagung Pipilan Kering' : 'Jagung Gelondong')

    Swal.fire({
        title: 'Apakah Anda yakin akan merubah harga ini?',
        text: `Anda akan merubah harga ${jenis_jagung} menjadi harga Rp. ${harga} !`,

        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ubah sekarang!',
        cancelButtonText: 'Batal'

    }).then((result) => {
        if (result.isConfirmed) {
            $.post(BASE_URL + '/Trader/savePrice', {
                harga: harga,
                tipe: tipe,
                trader: trader
            }, response => {
                grabPrice();
                $('.close-menu').trigger('click')

                Swal.fire('Berhasil !', `Harga ${jenis_jagung} berhasil diubah`, 'success');
            })
        }
    })

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