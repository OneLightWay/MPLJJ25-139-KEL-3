$(function () {
    loadKupon();
});

function loadKupon() {
    $("#list_kupon").html("");
    var idd = HELPER.getItem('history_kupon_id');
    
    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + "Kupon/listKuponExist",
        dataExist: {
            id: idd,
        },
        urlMore: BASE_URL + "Kupon/listKuponMore",
        dataMore: {
            id: idd,
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty("success")) {
                $("#list_kupon")
                    .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                                  <div class="not-found">
                                                      <div></div>
                                                      <h3>Kupon tidak ditemukan</h3>
                                                  </div>
                                              </div>`);
                $("#btn-more-scan").hide();
            } else {
                $("#btn-more-scan").show();
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
                    var data_kupon = $.parseJSON(data.responseText);
                    $.each(data_kupon.data, function (i, v) {
                        $("#list_kupon").append(`
                          <div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay">
                            <div class="row">
                                <div class="col-auto right-10">
                                    <i class="fa fa-circle" style="color:#2ECC71;"></i>
                                </div>
                                <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
                                    <span>Kode : ${HELPER.nullConverter(
                                        v.kupon_kode
                                    )}</span>
                                </div>
                            </div>
                          </div>
                      `);
                    });
                    next();
                }, "2")
                .enqueue(function (next) {
                    HELPER.unblock(500);
                    $(".show-blink").remove();
                    next();
                }, "3")
                .dequeueAll();
        },
        scrollCek: function (callLoadMore) {
            $("#btn-more-kupon")
                .off("click")
                .on("click", function () {
                    HELPER.block();
                    callLoadMore();
                });
        },
        callbackEnd: function () {
            $("#btn-more-kupon").hide();
            $("#btn-more-kupon").off("click");
        },
    });
}
