$(function () {
    loadData();
    countTotalSahabat();
    totalRequest();
});

function countTotalSahabat() {
    HELPER.ajax({
        url: BASE_URL + "AkunSales/countTotalSahabat",
        data: { user_id: HELPER.getItem("user_id") },
        complete: function (res) {
            if (res.success) {
                $(".show-total-farmer").text(res.data.total_farmer);
                $(".show-total-team").text(res.data.total_team);
            }
        },
    });
}

function loadData(search) {
    $("#div-my-farmer").html("");
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "AkunSales/mySahabatExist",
        dataExist: {
            user_id: HELPER.getItem("user_id"),
            search: search,
        },
        urlMore: BASE_URL + "AkunSales/mySahabatMore",
        dataMore: {
            user_id: HELPER.getItem("user_id"),
            search: search,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#div-my-farmer")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Anda tidak memiliki Petani Sahabat NK.</h3>
                                            </div>
                                        </div>`);
                $("#btn-more-sahabat").hide();
            } else {
                $("#btn-more-sahabat").show();
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue();
            myQueue
                .enqueue(function (next) {
                    HELPER.block();
                    next();
                }, "1")
                .enqueue(function (next) {
                    var data_riwayat = $.parseJSON(data.responseText);
                    $.each(data_riwayat.data, function (i, val) {
                        var img = "assets/images/avatars/6s.png";
                        if (val.user_foto) {
                            if (val.user_foto.indexOf("http") >= 0) {
                                img = val.user_foto;
                            } else {
                                img =
                                    BASE_ASSETS +
                                    "user_mobile/" +
                                    val.user_foto;
                            }
                        }
                        var hasil = `
						<div class="caption bg-white2-dark round-medium shadow-large bg-theme bottom-15 show-overlay" style="height: 90px;" onclick="onDetailFarmer('${
                            val.farmer_sales_farmer_id
                        }')">
		                    <div class="caption-center left-20">
		                        <img src="${img}" onerror="this.src='./assets/images/noimage.png'" class="round-small" alt="Farmer Photo" style="width: 60px; height: 60px;">
		                    </div>
		                    <div class="caption-center left-90">
		                        <div class="right-30">
		                            <h1 class="font-16 bottom-0" style="line-height: 20px;">${HELPER.ucwords(
                                        val.user_nama
                                    )}</h1>
		                        </div>
		                        <label class="font-12"><i class="fas fa-star color-highlight"></i> ${
                                    val.user_total_poin
                                } Poin</label>
		                        <label class="font-12"><i class="fas fa-route color-highlight"></i> ${
                                    val.farmer_sales_distance
                                } KM</label>
		                    </div>
		                    <div class="caption-center">
		                        <div class="float-right right-15"><i class="fa fa-angle-right fa-lg"></i></div>
		                    </div>
		                </div>
					`;
                        $("#div-my-farmer").append(hasil);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-sahabat")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-sahabat").hide();
            $("#btn-more-sahabat").off("click");
        },
    });
}

function onDetailFarmer(user_id) {
    HELPER.setItem("sahabatnk_user_id", user_id);
    setTimeout(function () {
        onPage("sales-sahabatnk-detail");
    }, 100);
}

function totalRequest() {
    HELPER.ajax({
        url: BASE_URL + "Sahabat/countRequest",
        data: { user_id: HELPER.getItem("user_id") },
        complete: function (res) {
            if (res.success) {
                $(".show-total-request").text(res.jumlah_request);
            }
        },
    });
}

function searchSahabat() {
    name_user = $("#sahabat_search").val();
    loadData(name_user);
}