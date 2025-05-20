var fromPage   = null;
var userIdBack = null;
var userIdBackNew = [];
$(function () {
	setTimeout(function () {
		$('.back-button').off();
		if (HELPER.getItem('from_page') && HELPER.getItem('team_user_id_back')) {
			fromPage   = HELPER.getItem('from_page');
			var userIdBackTemp = HELPER.getItem('team_user_id_back');
			$.each(userIdBackTemp, function(index, val) {
				if (index == userIdBackTemp.length-1) {
					userIdBack = val;
				}else{
					userIdBackNew.push(val)
				}
			});
			$('.back-button').removeAttr('onclick')
			setTimeout(function () {
				$('.back-button').on('click', function() {
					HELPER.setItem('team_user_id', userIdBack)
					if (userIdBackNew) {
						HELPER.setItem('team_user_id_back', userIdBackNew)
					}
					setTimeout(function () {
						onPage(fromPage)
					}, 100)
				});
			}, 200)
			HELPER.removeItem(['from_page','team_user_id_back'])
		}
	}, 300)
	loadDataTeam(HELPER.getItem('team_user_id'))
})

function loadDataTeam(user_id) {
	HELPER.ajax({
		url: BASE_URL+'AkunSales/detailTeam',
		data: {user_id: user_id},
		complete: function (res) {
			if (res.success) {
				$('.div-team').show()
				var dataTeam = res.data;

				var img = 'assets/images/avatars/6s.png';
                if (dataTeam.user_foto) {
                    if (dataTeam.user_foto.indexOf('http') >= 0) {
                        img = dataTeam.user_foto;
                    }else{
                        img = BASE_ASSETS+'user/'+dataTeam.user_foto;
                    }
                }
				var user_address = HELPER.nullConverter(dataTeam.user_alamat) + ", " + HELPER.nullConverter(dataTeam.user_regency_name) + ", " + HELPER.nullConverter(dataTeam.user_province_name);
				var linkNo = "#";
                if (dataTeam.user_telepon) {
                    if (dataTeam.user_telepon.charAt(0) == "0") {
                        linkNo = "62" + dataTeam.user_telepon.substring(1)
                    } else if (dataTeam.user_telepon.charAt(0) == "+") {
                        linkNo = dataTeam.user_telepon.substring(1)
                    } else if (dataTeam.user_telepon.charAt(0) != "6") {
                        linkNo = "62" + dataTeam.user_telepon.substring(1)
                    } else {
                        linkNo = dataTeam.user_telepon
                    }
                }

                $('.show-team-foto').attr('src', img);
                $('.show-team-name').text(HELPER.ucwords(dataTeam.user_nama))
                $('.show-team-kode').text(dataTeam.kode_sales_kode)
                $('.show-team-address').text(HELPER.ucwords(user_address.toLowerCase()))
                $('.show-team-email').text(dataTeam.user_email)
                $('.show-team-total-farmer').text(dataTeam.user_total_farmer_sahabat)
                $('.show-team-total-team').text(dataTeam.user_total_team_sales)
                $('.show-team-telepon').text(dataTeam.user_telepon)
                $('.btn-call-wa').off('click');
                setTimeout(function () {
	                var linkWaMe = `https://wa.me/${linkNo}?text=Halo !`;
	                $('.btn-call-wa').on('click', function(e) {
	                    $('#btn-choose-telp-wa').off('click');
	                    $('#btn-choose-telp-phone').off('click');
	                    setTimeout(function () {
	                        $('#btn-choose-telp-wa').on('click', function() {
	                            window.location.href = linkWaMe
	                        });
	                        $('#btn-choose-telp-phone').on('click', function() {
	                            window.location.href = 'tel://'+linkNo
	                        });
	                    }, 200)
	                    $('#btn-telp-choose').click()
	                });
	            }, 200)

	            loadDataListTeam(user_id)
	            loadDataListFarmer(user_id)
			}else{
				$('.div-sahabat').show().html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Sorry data not found.</h3>
                                            </div>
                                        </div>`)
			}
		}
	})
}

function loadDataListTeam(user_id) {
	$('#div-my-team').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/myTeamExist',
        dataExist: {
            user_id: user_id,
        },
        urlMore: BASE_URL + 'AkunSales/myTeamMore',
        dataMore: {
            user_id: user_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#div-my-team').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Anda tidak memiliki Team.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-team').hide()
            }else{
                $('#btn-more-team').show()
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
                    var img = 'assets/images/avatars/6s.png';
                    if (val.user_foto) {
                        img = BASE_ASSETS+'user/thumbs/'+val.user_foto;
                    }
					var hasil = `
						<div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailTeam('${val.user_id}')">
		                    <div class="caption-center left-20">
		                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Sales Photo" style="width: 60px; height: 60px;">
		                    </div>
		                    <div class="caption-center left-90">
		                        <div class="right-30">
		                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(val.user_nama)}</h1>
		                        </div>
		                        <label class="font-12"><i class="fas fa-users color-highlight"></i> ${val.user_total_farmer_sahabat} Petani</label>
		                        <label class="font-12"><i class="fas fa-user-friends color-highlight"></i> ${val.user_total_team_sales} Team</label>
		                    </div>
		                    <div class="caption-center">
		                        <div class="float-right right-15"><i class="fa fa-angle-right fa-lg"></i></div>
		                    </div>
		                </div>
					`;
					$('#div-my-team').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-team').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-team').hide()
            $('#btn-more-team').off('click');
        }
    })
}

function onDetailTeam(user_id) {
	userIdBackNew.push(HELPER.getItem('team_user_id'))
	setTimeout(function () {
		HELPER.setItem('team_user_id', user_id)
		HELPER.setItem('from_page', 'sales-team-detail')
		HELPER.setItem('team_user_id_back', userIdBackNew)
		setTimeout(function () {
			onPage('sales-team-detail')
		}, 100)
	}, 100)
}

function loadDataListFarmer(user_id) {
	$('#div-my-farmer').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/myFarmerNeabyExist',
        dataExist: {
            user_id: user_id,
        },
        urlMore: BASE_URL + 'AkunSales/myFarmerNeabyMore',
        dataMore: {
            user_id: user_id,
        },
        callbackExist: function(data) {
            if (data.hasOwnProperty('success')) {
                $('#div-my-farmer').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>You don't have a farmer.</h3>
                                            </div>
                                        </div>`)
                $('#btn-more-nearby').hide()
            }else{
                $('#btn-more-nearby').show()
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
                    var img = 'assets/images/avatars/6s.png';
                    if (val.user_foto) {
                        if (val.user_foto.indexOf('http') >= 0) {
                            img = val.user_foto;
                        }else{
                            img = BASE_ASSETS+'user_mobile/'+val.user_foto;
                        }
                    }
                    var bg_sahabat = parseInt(val.user_is_promoted) == 1 ? "#2aba6638" : "";
					var hasil = `
						<div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;background-color:${bg_sahabat};" onclick="onDetailFarmer('${val.farmer_sales_farmer_id}')">
		                    <div class="caption-center left-20">
		                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Farmer Photo" style="width: 60px; height: 60px;">
		                    </div>
		                    <div class="caption-center left-90">
		                        <div class="right-30">
		                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(val.user_nama)}</h1>
		                        </div>
		                        <label class="font-12"><i class="fas fa-star color-highlight"></i> ${val.user_total_poin} Poin</label>
		                        <label class="font-12"><i class="fas fa-route color-highlight"></i> ${val.farmer_sales_distance} KM</label>
		                    </div>
		                    <div class="caption-center">
		                        <div class="float-right right-15"><i class="fa fa-angle-right fa-lg"></i></div>
		                    </div>
		                </div>
					`;
					$('#div-my-farmer').append(hasil)

                });
                next()
            }, '2').enqueue(function(next) {
                HELPER.unblock(500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function(callLoadMore) {
            $('#btn-more-nearby').off('click').on('click', function() {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('#btn-more-nearby').hide()
            $('#btn-more-nearby').off('click');
        }
    })
}

function onDetailFarmer(user_id) {
	setTimeout(function () {
		HELPER.setItem('team_user_id', HELPER.getItem('team_user_id'))
		HELPER.setItem('from_page', 'sales-team-detail')
		HELPER.setItem('team_user_id_back', userIdBackNew)
		HELPER.setItem('sahabatnk_user_id', user_id)
		setTimeout(function () {
			onPage('sales-sahabatnk-detail')
		}, 100)
	}, 100)
}