$(function () {
	loadData()
})

function loadData() {
	$('#div-my-team').html('')
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'AkunSales/myTeamExist',
        dataExist: {
            user_id: HELPER.getItem('user_id'),
        },
        urlMore: BASE_URL + 'AkunSales/myTeamMore',
        dataMore: {
            user_id: HELPER.getItem('user_id'),
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
	HELPER.setItem('team_user_id', user_id)
	setTimeout(function () {
		onPage('sales-team-detail')
	}, 100)
}