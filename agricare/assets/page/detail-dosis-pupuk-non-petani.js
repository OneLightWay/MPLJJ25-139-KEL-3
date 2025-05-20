var markerblock = [];
var markeritem = [];
$(function () {
	setTimeout(function () {
		$('.back-button').off();
        $('.btn-back-logo').off();

        if (HELPER.getItem('user_category') == 3) {
            $('.back-button').on('click', function () {
				setTimeout(function () {
					HELPER.removeItem('dari_lahan')
					HELPER.removeItem('dari_custom')
					HELPER.removeItem('lahan_check')
					HELPER.removeItem('custom_check')
					onPage('kalkulator-pupuk-non-petani')
				}, 100)
			});
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-kios')
                }, 100)
            });
        } else if (HELPER.getItem('user_category') == 4){
            $('.back-button').on('click', function () {
                setTimeout(function () {
					HELPER.removeItem('dari_lahan')
					HELPER.removeItem('dari_custom')
					HELPER.removeItem('lahan_check')
					HELPER.removeItem('custom_check')
					onPage('kalkulator-pupuk-non-petani')
				}, 100)
            });
            $('.btn-back-logo').on('click', function () {
                setTimeout(function () {
                    onPage('main-trader')
                }, 100)
            });
        }
	
		detailKebutuhanPupuk()
		loadKios()
	}, 300)

});

function detailKebutuhanPupuk() {
	var pupuk_luas_lahan = HELPER.getItem('pupuk_luas_lahan')
	var pupuk_luas_lahan_uncek = HELPER.getItem('pupuk_luas_lahan_uncek')
	var pupuk_varietas_name = HELPER.getItem('pupuk_varietas_name')
	var pupuk_varietas = HELPER.getItem('pupuk_varietas')
	var pupuk_expecting_yield = HELPER.getItem('pupuk_expecting_yield')
	var pupuk_expecting_yield_uncek = HELPER.getItem('pupuk_expecting_yield_uncek')
	var pupuk_soil_a = HELPER.getItem('pupuk_soil_a')
	var pupuk_soil_b = HELPER.getItem('pupuk_soil_b')
	var pupuk_soil_c = HELPER.getItem('pupuk_soil_c')
	var pupuk_soil_d = HELPER.getItem('pupuk_soil_d')
	var pupuk_urea = HELPER.getItem('pupuk_urea')
	var pupuk_sp36 = HELPER.getItem('pupuk_sp36')
	var pupuk_kcl = HELPER.getItem('pupuk_kcl')
	var urea_majemuk = HELPER.getItem('urea_majemuk')
	var sp36_majemuk = HELPER.getItem('sp36_majemuk')
	var kcl_majemuk = HELPER.getItem('kcl_majemuk')
	var input_analisa_tanah = HELPER.getItem('input_analisa_tanah')
	var from_custom = HELPER.getItem('from_custom')
	var dari_lahan = HELPER.getItem('dari_lahan')

	// console.log(input_analisa_tanah)
	// console.log(pupuk_soil_b)
	// console.log(pupuk_soil_c)
	// console.log(pupuk_soil_d)
	// console.log('pupuk urea = ' + pupuk_urea)
	// console.log(pupuk_luas_lahan_uncek)
	// console.log(pupuk_expecting_yield_uncek)

	var x = (sp36_majemuk * 100) / 15;
	var hasil_sp36_majemuk = x.toFixed(2);
	var y = (urea_majemuk - sp36_majemuk) * 100 / 45;
	var hasil_urea_majemuk = y.toFixed(2);
	var z = (kcl_majemuk - sp36_majemuk) * 100 / 60;
	var hasil_kcl_majemuk = z.toFixed(2);

	if (HELPER.getItem('input_analisa_tanah')) {
		//urea
		var pupuk_luas_lahan = HELPER.getItem('pupuk_luas_lahan')
		var pupuk_expecting_yield = HELPER.getItem('pupuk_expecting_yield')
		var pupuk_soil_a = HELPER.getItem('pupuk_soil_a')
		var pupuk_soil_b = HELPER.getItem('pupuk_soil_b')
		var bushel = pupuk_expecting_yield * 15.932;
		var count1 = 1.2 * bushel;
		var count2 = 8 * pupuk_soil_a;
		var count3 = 0.14 * bushel * pupuk_soil_b;
		var nFertilizer = 35 + (count1 - count2 - count3);
		var nFertilizerkg = nFertilizer * 1.1198;
		var x = nFertilizerkg * 100 / 45;
		var urea = x * pupuk_luas_lahan;
		var hasilUrea = urea.toFixed(2);
		console.log(hasilUrea)

		//sp36
		var pupuk_luas_lahan = HELPER.getItem('pupuk_luas_lahan')
		var pupuk_soil_c = HELPER.getItem('pupuk_soil_c')
		var pFertilizer = (25 - pupuk_soil_c) * 4;
		var pFertilizerkg = pFertilizer * 1.1198;
		var y = pFertilizerkg * 100 / 36;
		var sp36 = y * pupuk_luas_lahan;
		var hasilSp36 = sp36.toFixed(2);
		console.log(hasilSp36)

		//kcl
		var pupuk_luas_lahan = HELPER.getItem('pupuk_luas_lahan')
		var pupuk_soil_d = HELPER.getItem('pupuk_soil_d')
		var rekKalium = 125 - pupuk_soil_d;
		var kalium = rekKalium * 1.1198;
		var z = kalium * 100 / 60;
		var kcl = z * pupuk_luas_lahan;
		var hasilKcl = kcl.toFixed(2);
		console.log(hasilKcl)
	} else {
		//urea
		var pupuk_luas_lahan_uncek = HELPER.getItem('pupuk_luas_lahan_uncek')
		var pupuk_expecting_yield_uncek = HELPER.getItem('pupuk_expecting_yield_uncek')
		var pupuk_soil_a = HELPER.getItem('pupuk_soil_a')
		var pupuk_soil_b = HELPER.getItem('pupuk_soil_b')
		var bushel = pupuk_expecting_yield_uncek * 15.932;
		var count1 = 1.2 * bushel;
		var count2 = 8 * pupuk_soil_a;
		var count3 = 0.14 * bushel * pupuk_soil_b;
		var nFertilizer = 35 + (count1 - count2 - count3);
		var nFertilizerkg = nFertilizer * 1.1198;
		var x = nFertilizerkg * 100 / 45;
		var urea = x * pupuk_luas_lahan_uncek;
		var hasilUrea = urea.toFixed(2);
		console.log('pupuk_luas_lahan_uncek = ' + pupuk_luas_lahan_uncek)
		console.log('pupuk_expecting_yield_uncek = ' + pupuk_expecting_yield_uncek)
		console.log('pupuk_soil_a = ' + pupuk_soil_a)
		console.log(urea)

		//sp36
		var pupuk_luas_lahan_uncek = HELPER.getItem('pupuk_luas_lahan_uncek')
		var pupuk_soil_c = HELPER.getItem('pupuk_soil_c')
		var pFertilizer = (25 - pupuk_soil_c) * 4;
		var pFertilizerkg = pFertilizer * 1.1198;
		var y = pFertilizerkg * 100 / 36;
		var sp36 = y * pupuk_luas_lahan_uncek;
		var hasilSp36 = sp36.toFixed(2);
		console.log(hasilSp36)

		//kcl
		var pupuk_luas_lahan_uncek = HELPER.getItem('pupuk_luas_lahan_uncek')
		var pupuk_soil_d = HELPER.getItem('pupuk_soil_d')
		var rekKalium = 125 - pupuk_soil_d;
		var kalium = rekKalium * 1.1198;
		var z = kalium * 100 / 60;
		var kcl = z * pupuk_luas_lahan_uncek;
		var hasilKcl = kcl.toFixed(2);
		console.log(hasilKcl)
	}

	//urea majemuk
	var a = (nFertilizerkg - pFertilizerkg) * 100 / 45;
	var ureaMajemuk = a.toFixed(2);

	//sp36 majemuk
	var b = (pFertilizerkg * 100) / 15;
	var sp36Majemuk = b.toFixed(2);

	//kcl majemuk
	var c = (kalium - pFertilizerkg) * 100 / 60;
	var kclMajemuk = c.toFixed(2);

	var d = 20 / 100;
	var pembagi1 = d;
	var e = 40 / 100;
	var pembagi2 = e;
	var f = 80 / 100;
	var pembagi3 = f;

	//aplikasi Urea
	var au1 = pupuk_urea * d;
	var aplikasi1urea = Math.round(au1);
	var au2 = pupuk_urea * e;
	var aplikasi2urea = Math.round(au2);
	var au3 = pupuk_urea * e;
	var aplikasi3urea = Math.round(au3);

	//custom
	var cau1 = hasilUrea * d;
	var caplikasi1urea = Math.round(cau1);
	var cau2 = hasilUrea * e;
	var caplikasi2urea = Math.round(cau2);
	var cau3 = hasilUrea * e;
	var caplikasi3urea = Math.round(cau3);

	//aplikasi Sp36
	var asp1 = pupuk_sp36 * d;
	var aplikasi1sp36 = Math.round(asp1);
	var asp2 = pupuk_sp36 * f;
	var aplikasi2sp36 = Math.round(asp2);

	//custom
	var casp1 = hasilSp36 * d;
	var caplikasi1sp36 = Math.round(casp1);
	var casp2 = hasilSp36 * f;
	var caplikasi2sp36 = Math.round(casp2);

	//aplikasi kcl
	var ak1 = pupuk_kcl * d;
	var aplikasi1kcl = Math.round(ak1);
	var ak2 = pupuk_kcl * e;
	var aplikasi2kcl = Math.round(ak2);
	var ak3 = pupuk_kcl * e;
	var aplikasi3kcl = Math.round(ak3);

	//custom
	var cak1 = hasilKcl * d;
	var caplikasi1kcl = Math.round(cak1);
	var cak2 = hasilKcl * e;
	var caplikasi2kcl = Math.round(cak2);
	var cak3 = hasilKcl * e;
	var caplikasi3kcl = Math.round(cak3);

	//aplikasi Urea Majemuk
	var aum1 = ureaMajemuk * d;
	var aplikasi1ureamajemuk = Math.round(aum1);
	var aum2 = ureaMajemuk * e;
	var aplikasi2ureamajemuk = Math.round(aum2);
	var aum3 = ureaMajemuk * e;
	var aplikasi3ureamajemuk = Math.round(aum3);

	//custom
	var caum1 = hasil_urea_majemuk * d;
	var caplikasi1ureamajemuk = Math.round(caum1);
	var caum2 = hasil_urea_majemuk * e;
	var caplikasi2ureamajemuk = Math.round(caum2);
	var caum3 = hasil_urea_majemuk * e;
	var caplikasi3ureamajemuk = Math.round(caum3);

	//aplikasi Sp36 majemuk
	var aspm1 = sp36Majemuk * d;
	var aplikasi1sp36majemuk = Math.round(aspm1);
	var aspm2 = sp36Majemuk * f;
	var aplikasi2sp36majemuk = Math.round(aspm2);

	//custom
	var caspm1 = hasil_sp36_majemuk * d;
	var caplikasi1sp36majemuk = Math.round(caspm1);
	var caspm2 = hasil_sp36_majemuk * f;
	var caplikasi2sp36majemuk = Math.round(caspm2);

	//aplikasi kcl majemuk
	var akm1 = kclMajemuk * d;
	var aplikasi1kclmajemuk = Math.round(akm1);
	var akm2 = kclMajemuk * e;
	var aplikasi2kclmajemuk = Math.round(akm2);
	var akm3 = kclMajemuk * e;
	var aplikasi3kclmajemuk = Math.round(akm3);

	//custom
	var cakm1 = hasil_kcl_majemuk * d;
	var caplikasi1kclmajemuk = Math.round(cakm1);
	var cakm2 = hasil_kcl_majemuk * e;
	var caplikasi2kclmajemuk = Math.round(cakm2);
	var cakm3 = hasil_kcl_majemuk * e;
	var caplikasi3kclmajemuk = Math.round(cakm3);

	if (HELPER.getItem('dari_lahan')) {
		$('.detail_pupuk_urea').text(hasilUrea)
		$('.detail_pupuk_sp36').text(hasilSp36)
		$('.detail_pupuk_kcl').text(hasilKcl)

		$('.detail_pupuk_urea_majemuk').text(ureaMajemuk)
		$('.detail_pupuk_sp36_majemuk').text(sp36Majemuk)
		$('.detail_pupuk_kcl_majemuk').text(kclMajemuk)

		$('.detail_aplikasi_urea_1').text(caplikasi1urea)
		$('.detail_aplikasi_urea_2').text(caplikasi2urea)
		$('.detail_aplikasi_urea_3').text(caplikasi3urea)

		$('.detail_aplikasi_sp36_1').text(caplikasi1sp36)
		$('.detail_aplikasi_sp36_2').text(caplikasi2sp36)

		$('.detail_aplikasi_kcl_1').text(caplikasi1kcl)
		$('.detail_aplikasi_kcl_2').text(caplikasi2kcl)
		$('.detail_aplikasi_kcl_3').text(caplikasi3kcl)

		$('.detail_aplikasi_urea_majemuk_1').text(aplikasi1ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_2').text(aplikasi2ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_3').text(aplikasi3ureamajemuk)

		$('.detail_aplikasi_sp36_majemuk_1').text(aplikasi1sp36majemuk)
		$('.detail_aplikasi_sp36_majemuk_2').text(aplikasi2sp36majemuk)

		$('.detail_aplikasi_kcl_majemuk_1').text(aplikasi1kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_2').text(aplikasi2kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_3').text(aplikasi3kclmajemuk)
	}

	$('.detail_pupuk_luas_lahan').text(HELPER.toRp(pupuk_luas_lahan))
	if (pupuk_luas_lahan == ""){
		$('.detail_pupuk_luas_lahan').text(HELPER.toRp(pupuk_luas_lahan_uncek))
	}
	if (from_custom == 0) {

		$('.detail_pupuk_urea').text(pupuk_urea)
		$('.detail_pupuk_sp36').text(pupuk_sp36)
		$('.detail_pupuk_kcl').text(pupuk_kcl)

		$('.detail_pupuk_urea_majemuk').text(hasil_urea_majemuk)
		$('.detail_pupuk_sp36_majemuk').text(hasil_sp36_majemuk)
		$('.detail_pupuk_kcl_majemuk').text(hasil_kcl_majemuk)

		$('.detail_aplikasi_urea_1').text(aplikasi1urea)
		$('.detail_aplikasi_urea_2').text(aplikasi2urea)
		$('.detail_aplikasi_urea_3').text(aplikasi3urea)

		$('.detail_aplikasi_sp36_1').text(aplikasi1sp36)
		$('.detail_aplikasi_sp36_2').text(aplikasi2sp36)

		$('.detail_aplikasi_kcl_1').text(aplikasi1kcl)
		$('.detail_aplikasi_kcl_2').text(aplikasi2kcl)
		$('.detail_aplikasi_kcl_3').text(aplikasi3kcl)

		$('.detail_aplikasi_urea_majemuk_1').text(caplikasi1ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_2').text(caplikasi2ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_3').text(caplikasi3ureamajemuk)

		$('.detail_aplikasi_sp36_majemuk_1').text(caplikasi1sp36majemuk)
		$('.detail_aplikasi_sp36_majemuk_2').text(caplikasi2sp36majemuk)

		$('.detail_aplikasi_kcl_majemuk_1').text(caplikasi1kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_2').text(caplikasi2kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_3').text(caplikasi3kclmajemuk)
	} else {
		$('.detail_pupuk_urea').text(hasilUrea)
		$('.detail_pupuk_sp36').text(hasilSp36)
		$('.detail_pupuk_kcl').text(hasilKcl)

		$('.detail_pupuk_urea_majemuk').text(ureaMajemuk)
		$('.detail_pupuk_sp36_majemuk').text(sp36Majemuk)
		$('.detail_pupuk_kcl_majemuk').text(kclMajemuk)

		$('.detail_aplikasi_urea_1').text(caplikasi1urea)
		$('.detail_aplikasi_urea_2').text(caplikasi2urea)
		$('.detail_aplikasi_urea_3').text(caplikasi3urea)

		$('.detail_aplikasi_sp36_1').text(caplikasi1sp36)
		$('.detail_aplikasi_sp36_2').text(caplikasi2sp36)

		$('.detail_aplikasi_kcl_1').text(caplikasi1kcl)
		$('.detail_aplikasi_kcl_2').text(caplikasi2kcl)
		$('.detail_aplikasi_kcl_3').text(caplikasi3kcl)

		$('.detail_aplikasi_urea_majemuk_1').text(aplikasi1ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_2').text(aplikasi2ureamajemuk)
		$('.detail_aplikasi_urea_majemuk_3').text(aplikasi3ureamajemuk)

		$('.detail_aplikasi_sp36_majemuk_1').text(aplikasi1sp36majemuk)
		$('.detail_aplikasi_sp36_majemuk_2').text(aplikasi2sp36majemuk)

		$('.detail_aplikasi_kcl_majemuk_1').text(aplikasi1kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_2').text(aplikasi2kclmajemuk)
		$('.detail_aplikasi_kcl_majemuk_3').text(aplikasi3kclmajemuk)
	}

	/*
		if (HELPER.getItem('from_lahan')) {
	
			$('.detail_pupuk_luas_lahan').text(pupuk_luas_lahan_uncek)
			$('.detail_pupuk_varietas').text(pupuk_varietas_name)
	
		} else {
			$('.detail_pupuk_luas_lahan').text(pupuk_luas_lahan)
			$('.detail_pupuk_varietas').text(pupuk_varietas_name)
	
			$('.detail_pupuk_urea').text(pupuk_urea)
			$('.detail_pupuk_sp36').text(pupuk_sp36)
			$('.detail_pupuk_kcl').text(pupuk_kcl)
	
			$('.detail_pupuk_urea_majemuk').text(hasil_urea_majemuk)
			$('.detail_pupuk_sp36_majemuk').text(hasil_sp36_majemuk)
			$('.detail_pupuk_kcl_majemuk').text(hasil_kcl_majemuk)
	
			$('.detail_aplikasi_urea_1').text(caplikasi1urea)
			$('.detail_aplikasi_urea_2').text(caplikasi2urea)
			$('.detail_aplikasi_urea_3').text(caplikasi3urea)
	
			$('.detail_aplikasi_sp36_1').text(caplikasi1sp36)
			$('.detail_aplikasi_sp36_2').text(caplikasi2sp36)
	
			$('.detail_aplikasi_kcl_1').text(caplikasi1kcl)
			$('.detail_aplikasi_kcl_2').text(caplikasi2kcl)
			$('.detail_aplikasi_kcl_3').text(caplikasi3kcl)
		}
	
		if (from_custom == 1) {
			$('.detail_pupuk_urea').text(pupuk_urea)
			$('.detail_pupuk_sp36').text(pupuk_sp36)
			$('.detail_pupuk_kcl').text(pupuk_kcl)
	
			$('.detail_pupuk_urea_majemuk').text(hasil_urea_majemuk)
			$('.detail_pupuk_sp36_majemuk').text(hasil_sp36_majemuk)
			$('.detail_pupuk_kcl_majemuk').text(hasil_kcl_majemuk)
	
			$('.detail_aplikasi_urea_1').text(aplikasi1urea)
			$('.detail_aplikasi_urea_2').text(aplikasi2urea)
			$('.detail_aplikasi_urea_3').text(aplikasi3urea)
	
			$('.detail_aplikasi_sp36_1').text(aplikasi1sp36)
			$('.detail_aplikasi_sp36_2').text(aplikasi2sp36)
	
			$('.detail_aplikasi_kcl_1').text(aplikasi1kcl)
			$('.detail_aplikasi_kcl_2').text(aplikasi2kcl)
			$('.detail_aplikasi_kcl_3').text(aplikasi3kcl)
	
			$('.detail_aplikasi_urea_majemuk_1').text(caplikasi1ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_2').text(caplikasi2ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_3').text(caplikasi3ureamajemuk)
	
			$('.detail_aplikasi_sp36_majemuk_1').text(caplikasi1sp36majemuk)
			$('.detail_aplikasi_sp36_majemuk_2').text(caplikasi2sp36majemuk)
	
			$('.detail_aplikasi_kcl_majemuk_1').text(caplikasi1kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_2').text(caplikasi2kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_3').text(caplikasi3kclmajemuk)
		} else {
			$('.detail_pupuk_urea').text(hasilUrea)
			$('.detail_pupuk_sp36').text(hasilSp36)
			$('.detail_pupuk_kcl').text(hasilKcl)
	
			$('.detail_pupuk_urea_majemuk').text(ureaMajemuk)
			$('.detail_pupuk_sp36_majemuk').text(sp36Majemuk)
			$('.detail_pupuk_kcl_majemuk').text(kclMajemuk)
	
			$('.detail_aplikasi_urea_1').text(caplikasi1urea)
			$('.detail_aplikasi_urea_2').text(caplikasi2urea)
			$('.detail_aplikasi_urea_3').text(caplikasi3urea)
	
			$('.detail_aplikasi_sp36_1').text(caplikasi1sp36)
			$('.detail_aplikasi_sp36_2').text(caplikasi2sp36)
	
			$('.detail_aplikasi_kcl_1').text(caplikasi1kcl)
			$('.detail_aplikasi_kcl_2').text(caplikasi2kcl)
			$('.detail_aplikasi_kcl_3').text(caplikasi3kcl)
	
			$('.detail_aplikasi_urea_majemuk_1').text(aplikasi1ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_2').text(aplikasi2ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_3').text(aplikasi3ureamajemuk)
	
			$('.detail_aplikasi_sp36_majemuk_1').text(aplikasi1sp36majemuk)
			$('.detail_aplikasi_sp36_majemuk_2').text(aplikasi2sp36majemuk)
	
			$('.detail_aplikasi_kcl_majemuk_1').text(aplikasi1kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_2').text(aplikasi2kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_3').text(aplikasi3kclmajemuk)
		}
	
		if (HELPER.getItem('from_lahan')) {
			HELPER.removeItem(pupuk_luas_lahan)
			HELPER.removeItem(pupuk_expecting_yield)
			$('.detail_pupuk_urea').text(hasilUrea)
			$('.detail_pupuk_sp36').text(hasilSp36)
			$('.detail_pupuk_kcl').text(hasilKcl)
	
			$('.detail_pupuk_urea_majemuk').text(ureaMajemuk)
			$('.detail_pupuk_sp36_majemuk').text(sp36Majemuk)
			$('.detail_pupuk_kcl_majemuk').text(kclMajemuk)
	
			$('.detail_aplikasi_urea_1').text(caplikasi1urea)
			$('.detail_aplikasi_urea_2').text(caplikasi2urea)
			$('.detail_aplikasi_urea_3').text(caplikasi3urea)
	
			$('.detail_aplikasi_sp36_1').text(caplikasi1sp36)
			$('.detail_aplikasi_sp36_2').text(caplikasi2sp36)
	
			$('.detail_aplikasi_kcl_1').text(caplikasi1kcl)
			$('.detail_aplikasi_kcl_2').text(caplikasi2kcl)
			$('.detail_aplikasi_kcl_3').text(caplikasi3kcl)
	
			$('.detail_aplikasi_urea_majemuk_1').text(aplikasi1ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_2').text(aplikasi2ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_3').text(aplikasi3ureamajemuk)
	
			$('.detail_aplikasi_sp36_majemuk_1').text(aplikasi1sp36majemuk)
			$('.detail_aplikasi_sp36_majemuk_2').text(aplikasi2sp36majemuk)
	
			$('.detail_aplikasi_kcl_majemuk_1').text(aplikasi1kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_2').text(aplikasi2kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_3').text(aplikasi3kclmajemuk)
		} else {
			$('.detail_pupuk_urea').text(pupuk_urea)
			$('.detail_pupuk_sp36').text(pupuk_sp36)
			$('.detail_pupuk_kcl').text(pupuk_kcl)
	
			$('.detail_pupuk_urea_majemuk').text(hasil_urea_majemuk)
			$('.detail_pupuk_sp36_majemuk').text(hasil_sp36_majemuk)
			$('.detail_pupuk_kcl_majemuk').text(hasil_kcl_majemuk)
	
			$('.detail_aplikasi_urea_1').text(aplikasi1urea)
			$('.detail_aplikasi_urea_2').text(aplikasi2urea)
			$('.detail_aplikasi_urea_3').text(aplikasi3urea)
	
			$('.detail_aplikasi_sp36_1').text(aplikasi1sp36)
			$('.detail_aplikasi_sp36_2').text(aplikasi2sp36)
	
			$('.detail_aplikasi_kcl_1').text(aplikasi1kcl)
			$('.detail_aplikasi_kcl_2').text(aplikasi2kcl)
			$('.detail_aplikasi_kcl_3').text(aplikasi3kcl)
	
			$('.detail_aplikasi_urea_majemuk_1').text(caplikasi1ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_2').text(caplikasi2ureamajemuk)
			$('.detail_aplikasi_urea_majemuk_3').text(caplikasi3ureamajemuk)
	
			$('.detail_aplikasi_sp36_majemuk_1').text(caplikasi1sp36majemuk)
			$('.detail_aplikasi_sp36_majemuk_2').text(caplikasi2sp36majemuk)
	
			$('.detail_aplikasi_kcl_majemuk_1').text(caplikasi1kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_2').text(caplikasi2kclmajemuk)
			$('.detail_aplikasi_kcl_majemuk_3').text(caplikasi3kclmajemuk)
		}
	*/

	$('.btn-back').on('click', function () { onPage('kalkulasi-dosis-pupuk') });
	$('.collapse-detail').show()
	$('.collapse-pengaplikasian').show()
}

function loadKios() {
	markeritem = [];
	$('#show_list_kios').html('')
	$('#show_list_kios_exist').html('')

	var nearby_lat = HELPER.getItem('user_lat');
	var nearby_long = HELPER.getItem('user_long');
	if (HELPER.getItem('nearby_lat_now') && HELPER.getItem('nearby_long_now')) {
		nearby_lat = HELPER.getItem('nearby_lat_now');
		nearby_long = HELPER.getItem('nearby_long_now');
	}
	HELPER.initLoadMore({
		perPage: 5,
		urlExist: BASE_URL + 'Kios/searchKiosExistPupuk',
		dataExist: {
			user_id: HELPER.getItem('user_id'),
			// kios_id: HELPER.getItem('kios_id'),
			nearby_lat: nearby_lat,
			nearby_long: nearby_long,
		},
		urlMore: BASE_URL + 'Kios/searchKiosMorePupuk',
		dataMore: {
			user_id: HELPER.getItem('user_id'),
			// kios_id: HELPER.getItem('kios_id'),
			nearby_lat: nearby_lat,
			nearby_long: nearby_long,
		},
		callbackExist: function (data) {
			if (data.hasOwnProperty('success')) {
				$('#show_list_kios').html(`<div class="content-boxed content-box shadow-medium left-0 right-0 top-10">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Kios tidak tersedia.</h3>
                                                <p>Hubungi Sales Representative Anda</p>
                                            </div>
                                            <div class="content-boxed shadow-large div-sr m-0" padding-top: 15px;">
                                                <div class="caption bg-white2-dark bg-theme bottom-15" style="height: 50px;">
                                                    <div class="caption-center left-20">
                                                        <img src="" onerror="this.src='./assets/images/noimage.png'" class="round-small show-sr-waiting-img" alt="Sales Photo" style="width: 60px; height: 60px;">
                                                    </div>
                                                    <div class="caption-center left-90">
                                                        <div class="right-30">
                                                            <h1 class="font-16 bottom-0 lh-20 show-sr-waiting-nama"></h1>
                                                        </div>
                                                        <label class="font-13 show-sr-waiting-no-div" onclick="onCallWa(this)"><i class="fab fa-whatsapp color-highlight"></i> <span class="show-sr-waiting-no"></span></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`)
				$('#btn-more-kios').hide()
				$('.div-kios').hide()

			} else {
				$('#btn-more-kios').show()
			}
		},
		callbackMore: function (data) {
			var myQueue = new Queue()
			myQueue.enqueue(function (next) {
				HELPER.block()
				next()
			}, '1').enqueue(function (next) {
				var data_notifikasi = $.parseJSON(data.responseText);
				if (data_notifikasi.data) {
					$('#show_list_kios_exist').html('')
					$.each(data_notifikasi.data, function (i, v) {
						var linkNo = "#";
						if (v.user_telepon) {
							if (v.user_telepon.charAt(0) == "0") {
								linkNo = "62" + v.user_telepon.substring(1)
							} else if (v.user_telepon.charAt(0) == "+") {
								linkNo = v.user_telepon.substring(1)
							} else if (v.user_telepon.charAt(0) != "6") {
								linkNo = "62" + v.user_telepon.substring(1)
							} else {
								linkNo = v.user_telepon
							}
						}
						var jarak_sales = 'Unknown';
						if (v.distance) {
							var distance_count = Math.round(v.distance * 100) / 100;
							jarak_sales = HELPER.nullConverter(distance_count, 0) + " KM"
						}

						var img = 'assets/images/avatars/6s.png';
						if (v.user_foto) { img = BASE_ASSETS + 'user/thumbs/' + v.user_foto; }

						var ikon_nearby = 'ikon-user.svg';
						var nearby_nama = HELPER.nullConverter(v.user_nama);
						if (v.user_category == 3) {
							ikon_nearby = 'ikon-kios.svg';
							var img = 'assets/images/avatars/6s.png';
							var nearby_nama = HELPER.nullConverter(v.kios_nama);
							if (v.kios_banner) { img = BASE_ASSETS + 'kiosBanner/thumbs/' + v.kios_banner; }
						}
						//tambah latlong
						markerblock.push([v.user_lat, v.user_long])
						markeritem.push(data_notifikasi.data[i])

						$('#show_list_kios').append(`
                            <div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" id="content-sales-${v.user_id}" style="height:100px;">
                                    <div class="caption-center left-20">
                                        <img src=${img} onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="" style="width:60px;">
                                    </div>
                                    <div class="caption-center left-90">
                                        <div class="top-8">
                                            <div class="row">
                                                <div class="right-10">
                                                    <h1 class="color-theme font-16 bottom-0">${nearby_nama}</h1>
                                                </div>
                                                <div class="top-5">
                                                    <img src="assets/images/nearby/${ikon_nearby}" alt="">
                                                </div>
                                            </div>
                                            <label class="color-theme font-12">${HELPER.nullConverter(jarak_sales)}</label>
                                        </div>
                                    </div>
                                    <div class="caption-center">
                                        <p class="float-right top-25 right-15"><i class="fa fa-angle-right fa-lg"></i></p>
                                    </div>
                                </div>
                            </div>
                        `)
						$('#btn-popup-telp-' + v.user_id).off('click');
						$('#content-sales-' + v.user_id).off('click');
						setTimeout(function () {
							var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
							$('#btn-popup-telp-' + v.user_id).on('click', function (e) {
								$('#btn-choose-telp-wa').off('click');
								$('#btn-choose-telp-phone').off('click');
								setTimeout(function () {
									$('#btn-choose-telp-wa').on('click', function () {
										window.location.href = linkWaMe
									});
									$('#btn-choose-telp-phone').on('click', function () {
										window.location.href = 'tel://' + linkNo
									});
								}, 200)
								$('#btn-telp-choose').click()
							});
							$('#content-sales-' + v.user_id).on('click', function (e) {
								HELPER.setItem('kios_pupuk_user_id', v.user_id)
								// HELPER.setItem('farmer_sales_detail_kios_id', v.kios_id)
								// HELPER.setItem('farmer_sales_detail_tradder_id', v.tradder_id)
								onPage('detail-kios-pupuk')
							});

						}, 200)
					});
				}
				next()
			}, '2').enqueue(function (next) {
				HELPER.unblock(500)
				$('.show-blink').remove()
				next()
			}, '3').dequeueAll()
		},
		scrollCek: function (callLoadMore) {
			$('#btn-more-kios').off('click').on('click', function (e) {
				callLoadMore()
			});
		},
		callbackEnd: function (dd) {
			$('#btn-more-kios').hide()
		}
	})
}