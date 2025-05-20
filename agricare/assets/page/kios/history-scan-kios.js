$(function () {
  loadScanHistroyMain();
});

function onScan() {
  $(".btn-kios-scan").click();
}

function loadScanHistroyMain() {
  $("#list_scan_main").html("");
  HELPER.initLoadMore({
    perPage: 10,
    urlExist: BASE_URL + 'Toolkit/listSamplingExist',
    dataExist: {
        user: HELPER.getItem('user_id'),
    },
    urlMore: BASE_URL + 'Toolkit/listSamplingMore',
    dataMore: {
        user: HELPER.getItem('user_id'),
    },
    callbackExist: function (data) {
      if (data.hasOwnProperty("success")) {
        $("#list_scan_main")
          .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
												<div class="not-found">
													<div></div>
						                            <h3 class bhsConf-no_histori>No history available.</h3>
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
          var data_riwayat = $.parseJSON(data.responseText);
          $(".total_scan_pouch").text(HELPER.convertK(data_riwayat.total));
          $.each(data_riwayat.data, function (i, v) {
            var tanggal = moment(v.qr_scan_insert_at).format(
              "DD MMMM YYYY HH:mm"
            );
            var status = parseInt(v.qr_scan_status);
            var colorStatus = "";
            var backgroundStatus = "";
            var content = "";

            if (status == 1) {
              colorStatus = "color-highlight";
              backgroundStatus = "#f0fff0";
              content = `
							<div class="row bottom-5">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>Material : ${HELPER.nullConverter(
                                v.product_name
                              )}</span>
			                    </div>
			                </div>
			                <div class="row">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>Varietas : ${HELPER.nullConverter(
                                v.product_group
                              )}</span>
			                    </div>
			                </div>
						`;
            } else {
              colorStatus = "color-red2-light";
              backgroundStatus = "#fcecec";
              var typeContent = "";
              if (status == 0) {
                if (
                  HELPER.getItem("user_language") == 0 ||
                  HELPER.getItem("user_language") == null
                ) {
                  typeContent = "Kode QR code tidak ditemukan !";
                } else {
                  typeContent = "QR code not found !";
                }
              } else if (status == 2) {
                if (
                  HELPER.getItem("user_language") == 0 ||
                  HELPER.getItem("user_language") == null
                ) {
                  typeContent = "Produk non-aktif !";
                } else {
                  typeContent = "Product non-active !";
                }
              } else if (status == 3) {
                if (
                  HELPER.getItem("user_language") == 0 ||
                  HELPER.getItem("user_language") == null
                ) {
                  typeContent = "Produk melewati akhir masa edar !";
                } else {
                  typeContent =
                    "The product has passed the end of its distribution period !";
                }
              }
              content = `
							<div class="row">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-circle ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${typeContent}</span>
			                    </div>
			                </div>
						`;
            }

            $("#list_scan_main").append(`
						<div class="content content-box content-boxed shadow-medium round-medium left-0 right-0 bottom-10 show-overlay btn-detail-${v.qr_scan_id}" style="background: ${backgroundStatus};">
							<div class="row bottom-10">
			                    <div class="col-auto right-10">
			                        <i class="fa fa-calendar-alt font-20 ${colorStatus}"></i>
			                    </div>
			                    <div class="col" style="border-bottom: 0.6px solid rgba(0, 0, 0, 0.15);">
			                        <span>${tanggal}</span>
			                    </div>
			                </div>
			                ${content}
		                </div>
					`);

            $(".btn-detail-" + v.qr_scan_id).off("click");
            setTimeout(function () {
              $(".btn-detail-" + v.qr_scan_id).on("click", function (event) {
                onDetailScan(v.qr_scan_id, status, v.qr_scan_code);
              });
            }, 200);
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
      $("#btn-more-scan")
        .off("click")
        .on("click", function () {
          HELPER.block();
          callLoadMore();
        });
    },
    callbackEnd: function () {
      $("#btn-more-scan").hide();
      $("#btn-more-scan").off("click");
    },
  });
  // loadTotalScan();
}

// function loadTotalScan() {
//   HELPER.ajax({
//     url: BASE_URL + "Main/totalScanUser",
//     data: { user_id: HELPER.getItem("user_id") },
//     complete: function (res) {
//       if (res.success) {
//         $(".total_scan_pouch").text(HELPER.convertK(res.data.totalScanPouch));
//       }
//     },
//   });
// }

function onDetailScan(idd, status, code) {
  if (status == 1) {
    HELPER.block();
    HELPER.ajax({
      url: BASE_URL + "Toolkit/detailSampling",
      data: { id: idd },
      complete: function (res) {
        HELPER.unblock();
        if (res.success) {
          if (
            parseInt(res.data.qr_scan_type) == 0 &&
            res.data.pouch_qr_code.indexOf("http") >= 0
          ) {
            if (
              parseInt(HELPER.getItem("configSettScanReaderAkumulation")) == 1
            ) {
              if (
                HELPER.getItem("configSettScanReader") ==
                "sett_data_scan_read_synegnta"
              ) {
                HELPER.unblock();
                HELPER.setItem("detail_scan", JSON.stringify(res.data));
                setTimeout(function () {
                  onPage("detail-scan");
                }, 100);
              } else {
                HELPER.unblock();
                window.open(res.data.pouch_link);
              }
            } else {
              HELPER.block();
              $("#btn-choose-scan-app").off("click");
              $("#btn-choose-scan-browser").off("click");
              setTimeout(function () {
                $("#btn-choose-scan-app").on("click", function (e) {
                  HELPER.unblock();
                  HELPER.setItem("detail_scan", JSON.stringify(res.data));
                  setTimeout(function () {
                    onPage("detail-scan");
                  }, 100);
                });
                $("#btn-choose-scan-browser").on("click", function (e) {
                  HELPER.unblock();
                  window.open(res.data.pouch_link);
                });
              }, 500);
              $("#btn-scan-choose").click();
            }
          } else if(parseInt(res.data.qr_scan_type) == 1){
            HELPER.setItem("detail_scan", JSON.stringify(res.data));
            setTimeout(function () {
              onPage("detail-scan");
            }, 100);
          }
        } else {
          showFailedScan("Kode QR tidak ditemukan !", false, null, "not-found");
        }
      },
      error: function () {
        HELPER.unblock();
      },
    });
  } else {
    var message = "";
    var type = null;
    if (status == 0) {
      message = `Kode QR code tidak ditemukan, silahkan cek keaslian produk yang Anda beli, atau hubungi call center dibawah ini:`;
      type = "not-found";
    } else if (status == 2) {
      message = `Produk yang anda beli telah non-aktif, Call Center Sales Representative wilayah Anda :`;
      type = "non-aktif";
    } else if (status == 3) {
      message = `Produk telah melewati akhir masa edar, silahkan cek kembali produk yang Anda beli, atau hubungi call center dibawah ini:`;
      type = "expired";
    }
    showFailedScan(message, false, code, type);
  }
}

function kiosScanPouch() {
  scanOpen(function (result) {
    cekSampling(result)
  }, function (error) {
    HELPER.showMessage({
        title: 'Gagal !!',
        message: "Scanning failed: " + error
    })
  })
  /* cordova.plugins.barcodeScanner.scan(
    function (result) {
      if (!result.cancelled) {
        kiosCekSampling(result.text);
      }
    },
    function (error) {
      HELPER.showMessage({
        title: "Gagal !!",
        message: "Scanning failed: " + error,
      });
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt: "Letakkan qrcode pada area pindai", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false, // iOS and Android
    }
  ); */
}

function kiosCekSampling(text = null, batch_no = null, pouch_no = null) {
  HELPER.block();
  HELPER.ajax({
    url: BASE_URL + "Scan/sampling",
    data: {
      user_id: HELPER.getItem("user_id"),
      qrcode: text,
      batch_no: batch_no,
      pouch_no: pouch_no,
    },
    success: function (res) {
      HELPER.unblock();
      if (res.success) {
        if (
          res.data.type == "pouch" &&
          res.data.pouch_qr_code.indexOf("http") >= 0
        ) {
          if (
            parseInt(HELPER.getItem("configSettScanReaderAkumulation")) == 1
          ) {
            if (
              HELPER.getItem("configSettScanReader") ==
              "sett_data_scan_read_syngenta"
            ) {
              HELPER.unblock();
              HELPER.setItem("detail_scan", JSON.stringify(res.data));
              setTimeout(function () {
                onPage("kios-detail-scan");
              }, 100);
            } else {
              HELPER.unblock();
              window.open(res.data.pouch_link);
            }
          } else {
            HELPER.block();
            $("#btn-choose-scan-app").off("click");
            $("#btn-choose-scan-browser").off("click");
            setTimeout(function () {
              $("#btn-choose-scan-app").on("click", function (e) {
                HELPER.unblock();
                HELPER.setItem("detail_scan", JSON.stringify(res.data));
                setTimeout(function () {
                  onPage("kios-detail-scan");
                }, 100);
              });
              $("#btn-choose-scan-browser").on("click", function (e) {
                HELPER.unblock();
                window.open(res.data.pouch_link);
              });
            }, 500);
            $("#btn-scan-choose").click();
          }
        } else {
          HELPER.setItem("detail_scan", JSON.stringify(res.data));
          setTimeout(function () {
            onPage("kios-detail-scan");
          }, 100);
        }
      } else {
        HELPER.unblock();
        $("#show-msg-error-sampling").text(HELPER.nullConverter(res.message));
        $("#btn-sampling-failed").click();
      }
    },
    error: function (err) {
      HELPER.unblock();
      HELPER.showMessage({
        success: false,
        title: "Failed !",
        message: "Oops, terjadi kesalahan teknis.",
      });
    },
  });
}

function kiosCheckPouchByNo() {
  cekSampling(null, $("#input_no_batch").val(), $("#input_no_pouch").val());

  setTimeout(function () {
    $("#input_no_pouch, #input_no_batch").val("");
  }, 300);
}
