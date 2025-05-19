$(function () {
	showKategori()
    // $('.btn-back').off('click').removeAttr('onclick')
	setTimeout(function () {
		$('.back-button').off();
		setTimeout(function () {
			if (HELPER.getItem('from_page')) {
				fromPage = HELPER.getItem('from_page');
				$('.back-button').on('click', function () {
					setTimeout(function () {
						onPage(fromPage)
					}, 300)
				});
				HELPER.removeItem(['from_page'])
			} else {
				$('.back-button').on('click', function () {
					setTimeout(function () {
						onPage('detail-info-hpt')
					}, 100)
				});
			}
		}, 300)
	}, 300)
	$("#input_luas_lahan").inputmask('currency', {
        rightAlign: false ,
        prefix: "",
        // min:0.01,
        max:5
    });

	$('.input-nama-lahan').show()

	var farmer_id = HELPER.getItem('user_id')
	HELPER.createCombo({
		el : 'input_pestisida_name',
		valueField : 'lahan_id',
		displayField : 'lahan_nama',
		url : BASE_URL+'LokasiLahan/getLokasiLahan',
		data : {farmer_id:farmer_id},
		withNull : true,
		isSelect2 : false,
		placeholder: '-Pilih Lokasi-',
		callback : function(){}
	});

	$('#input_pestisida_name').on('change', function (e) {
		HELPER.ajax({
            url: BASE_URL+'LokasiLahan/readEdit',
            data: {lahan_id: $('#input_pestisida_name').val()},
            complete: function (res) {
            	console.log(res);
            	$('#input_luas_lahan').val(res.lahan_luas);
            }
           
        });
	});

    HELPER.createCombo({
		el : 'pestisida_varietas',
		valueField : 'varietas_id',
		displayField : 'varietas_name',
		url : BASE_URL+'Pestisida/getVarietas',
		withNull : true,
		isSelect2 : false,
		placeholder: '-Pilih varietas-',
		callback : function(){}
	});
})

function onReset() {
	$('#input_luas_lahan').val('')
	$('#pestisida_varietas').val('').trigger('change')
	$('#input_luas_hama').val('').trigger('change')
	$('#from_lahan').prop('checked', true)
	$('#from_custom').prop('checked', false)
}

function searchPestisidaRecommedation() {
	// if ($('#input_luas_lahan').val() != "" && $('#pestisida_varietas').val() != "" && $('#input_luas_hama').val() != "") {	
	if ($('#input_luas_lahan').val() > "0.00" && $('#input_hama_nama').val() != "") {	
		HELPER.block()
		HELPER.ajax({
	        url: BASE_URL+'Pestisida/getCount',
	        data:{input_luas_lahan:$('#input_luas_lahan').val(),input_nama_hama:$('#input_hama_nama').val(),input_luas_hama:$('#input_hama_kategori_id').val()},

	        complete: function (res) {
				try {
					FirebasePlugin.logEvent("cal_hpt", {nk_user_id: HELPER.getItem('user_id'), nk_varietas: $('#pestisida_varietas').val(), nk_hama: $('#input_hama_kategori_id').val()});
					facebookConnectPlugin.logEvent("cal_hpt", {nk_user_id: HELPER.getItem('user_id'), nk_varietas: $('#pestisida_varietas').val(), nk_hama: $('#input_hama_kategori_id').val()}, 1, ()=>{}, ()=>{})
				} catch (error) {
				}

			    HELPER.setItem('pestisida_varietas', $('#pestisida_varietas').val());
			    HELPER.setItem('pestisida_luas_lahan', $('#input_luas_lahan').val());
				HELPER.setItem('pestisida_hama_kategori_id', $('#input_hama_kategori_id').val());
				HELPER.setItem('pestisida_hama_kategori_nama', $('#input_hama_kategori_nama').val());
				HELPER.setItem('pestisida_hama_nama', $('#input_hama_nama').val());
				HELPER.setItem('pestisida_artikel', $('#input_from_artikel').val());
			    HELPER.setItem('pestisida_for_farmer', res.hasil[0]);
			    HELPER.setItem('pestisida_total_botol', res.hasil[1]);
		           
		        onPage('detail-rekomendasi-pestisida')
		        onReset()
	           	HELPER.unblock()
	        }
	    })
	}else{
		Swal.fire(
			'Pemberitahuan',
			'Lengkapi data terlebih dahulu !',
			'warning'
		)
	}
	    
}

function getLahan(val) {
	if (val == 1) {
		$('.input-nama-lahan').show()
		$('#input_luas_lahan').attr('readonly', true)
	} else {
		$('.input-nama-lahan').hide()
		$('#input_luas_lahan').removeAttr('readonly')
	}
}

function showKategori() {
    var artikel_hama_kategori_id = HELPER.getItem('artikel_hama_kategori_id');
    var artikel_hama_kategori_nama = HELPER.getItem('artikel_hama_kategori_nama');
    var artikel_hama_id = HELPER.getItem('artikel_hama_id');
    var artikel_hama_nama = HELPER.getItem('artikel_hama_nama');
    var artikel_hama_keterangan = HELPER.getItem('artikel_hama_keterangan');
    
    $('#input_hama_kategori_id').val(HELPER.getItem('artikel_hama_kategori_id'))
    $('#input_hama_kategori_nama').val(HELPER.getItem('artikel_hama_kategori_nama'))
	// $('#input_hama_id').val(HELPER.getItem('artikel_hama_id'))
    $('#input_hama_nama').val(HELPER.getItem('artikel_hama_id'))
    $('#input_from_artikel').val('1')
    $('.detail-hama_nama').html(artikel_hama_nama);
	$('.detail-hama_keterangan').html(atob(artikel_hama_keterangan));
    $('.detail-hama_image').attr('src',BASE_ASSETS+`hama/thumbs/`+HELPER.getItem('artikel_hama_image'))

    // $('.btn-back').on('click', function() {onPage('detail-info-hpt')});

}
    


