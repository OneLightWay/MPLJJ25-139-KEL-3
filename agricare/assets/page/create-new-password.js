var fvFormNewPass
$(function () {
	$('#input_user_verifikator_id').val(HELPER.getItem('user_verifikator_id'))
	fvFormNewPass = HELPER.newHandleValidation({
		el: 'form-new-password',
		setting: [
			{
				name: "Confirm Password",
				selector: "#input_password_confirm",
				rule: {
					identical: {
                        compare: function() {
                            return $('#input_password').val();
                        },
                        message: 'The password and its confirm are not the same'
                    }
				},
			}
		],
		declarative: true
	})
})

function saveNewPassword(name) {
	HELPER.confirm({
		message: 'Apakah Anda yakin ingin menyimpan password baru ?',
		callback: function (cek) {
			if (cek) {
				HELPER.ajax({
					url: BASE_URL+'Login/newPassword',
					data: {
						id: btoa(HELPER.getItem('user_verifikator_id')),
						pass: btoa($('#input_password').val())
					},
					success: function (res) {
						if (res.success) {
							HELPER.showProgress({
								success: 'info',
								title: "Berhasil Reset Password !",
								message: 'Silahkan login untuk melanjutkan !',
								time: 4000,
								callback: function (r) {
									HELPER.removeItem([
										'user_verifikator_id',
										'user_verifikator_email',
										'user_verifikasi',
										'user_verifikasi_type',
										'countdown_verifikasi',
									])
									onPage('index')
								}
							})
						}else{
							HELPER.showMessage({
								message: res.message
							})
						}
					}
				})
			}
		}
	})
}