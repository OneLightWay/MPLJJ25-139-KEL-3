$(function () {
  $(".show-date").text(moment().format("dddd, DD MMMM YYYY"));
  $(".show-alamat").text(
    HELPER.ucwords(
      HELPER.getItem("user_district_name") +
        ", " +
        HELPER.getItem("user_regency_name")
    )
  );
  // $('.show-jabatan').text(HELPER.ucwords(HELPER.getItem('jabatan_name')))
  $(".show-name").text(HELPER.ucwords(HELPER.getItem("user_nama")));
  if (!HELPER.isNull(HELPER.getItem("user_foto"))) {
    $(".user-foto").attr(
      "src",
      BASE_ASSETS + "user/thumbs/" + HELPER.getItem("user_foto")
    );
  }

  // if (HELPER.getItem("configDataSales") == null) {
  //   let x = getSalesKios();
  // }
  // showProductBenih();
  // showProductPestisida();
  // showProductPupuk();
  initProducts();
  loadTotalBenih();
  loadConfig();
  loadMenu();
  if (HELPER.isNull("user_village_id")) {
    HELPER.showMessage({
      success: "info",
      title: "Info",
      message: "Data profil Anda belum lengkap, lengkapi terlebih dahulu !",
      allowOutsideClick: false,
      callback: function () {
        onPage("edit-akun-kios");
      },
    });
  }
});

function onScan() {
  $(".btn-kios-scan").click();
}

function initProducts() {
  Promise.all([
    showProductBenih(),
    showProductPestisida(),
    showProductPupuk(),
  ]).then((val) => {
    // check apakan semuanya kosong
    if (val[0] == false && val[1] == false && val[2] == false) {
      $("#no-products").show();
    } else {
      $("#no-products").hide();
    }
  });
}

function showProductBenih() {
  $(".list-produk-benih").html("");
  var user_id = HELPER.getItem("user_id");
  HELPER.block();
  return new Promise((resolve) => {
    HELPER.ajax({
      url: BASE_URL + "Kios/produkBenih",
      data: {
        user: user_id,
      },
      complete: function (res) {
        if (res.total > 0) {
          var slider = "";
          $.each(res.data, function (i, v) {
            var img = "./assets/images/noimage.png";
            if (v.kios_varietas_image) {
              img = BASE_ASSETS + "varietas/thumbs/" + v.kios_varietas_image;
            }
            $(".link-kios_varietas_image").attr({
              href: img,
              "data-lightbox": img,
            });
            $(".detail-kios_varietas_image").attr({
              src: img,
              title: v.kios_varietas_image,
            });
            var icon_harga = "assets/images/icons/icon-rp.png";
            var icon_stok = "assets/images/icons/icon-layer.png";
            var icon_jumlah = "fas fa-weight";
            var icon_total = "fa fa-money-bill";

            var color = "";
            var available = "";
            if (v.kios_varietas_available == 1) {
              available = "Aktif";
              color = "#2ecc71";
            } else {
              available = "Tidak Aktif";
              color = "#D8334A";
            }

            slider +=
              `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductBenih('` +
              v.kios_varietas_id +
              `')">
                                    <div data-height="200" class="caption bottom-0">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="` +
              img +
              `" class="centerimg detail-kios_varietas_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="custom-card-header-full bottom-0 lh-20 font-12 center-text color-white" style="background-color: ${color}">` +
              v.kios_varietas_nama +
              ` </h5>
                                    </div>    
                                    <label class="bottom-0 lh-20 font-12 center-text top-25 bold">` +
              v.kios_varietas_kemasan +
              ` Kg</label>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_harga +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">Harga : ` +
              HELPER.toRp(v.kios_varietas_harga) +
              `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_stok +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">Stok : ${v.kios_varietas_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
            if (res.total > 2 && res.total - 1 == i) {
              slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductVarietas('${v.kios_varietas_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
            }
            // <label class="left-10 bottom-0 font-12 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_varietas_stok + ` Pack</label>
          });

          $(".show-product-benih").html(slider);
          $(".no-product").hide();
          if (res.total > 1) {
            setTimeout(function () {
              $(".show-product-benih").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          } else {
            setTimeout(function () {
              $(".show-product-benih").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          }
          resolve(true);
        } else {
          // $('.show-product-benih').hide()
          $(".no-product")
            .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`);
          $(".div-benih").hide();
          resolve(false);
        }

        HELPER.unblock();
        $(".btn-back").on("click", function () {
          onPage("");
        });
      },
    });
  });
}

function showProductPestisida() {
  var user_id = HELPER.getItem("user_id");
  HELPER.block();
  return new Promise((resolve) => {
    HELPER.ajax({
      url: BASE_URL + "Kios/produkPestisida",
      data: {
        user: user_id,
      },
      complete: function (res) {
        if (res.kategori_produk == 1) {
          $(".kategori-produk").text("Produk Benih");
        } else if (res.kategori_produk == 2) {
          $(".kategori-produk").text("Produk Pestisida");
        } else if (res.kategori_produk == 3) {
          $(".kategori-produk").text("Produk Pupuk");
        }
        if (res.total > 0) {
          var slider = "";
          $.each(res.data, function (i, v) {
            var img2 = "./assets/images/noimage.png";
            if (v.kios_pestisida_image) {
              img2 =
                BASE_ASSETS +
                "images/pestisida/thumbs/" +
                v.kios_pestisida_image;
            }
            $(".link-kios_pestisida_image").attr({
              href: img2,
              "data-lightbox": img2,
            });
            $(".detail-kios_pestisida_image").attr({
              src: img2,
              title: v.kios_pestisida_image,
            });
            var icon_harga = "assets/images/icons/icon-rp.png";
            var icon_stok = "assets/images/icons/icon-layer.png";
            var icon_jumlah = "fas fa-weight";
            var icon_total = "fa fa-money-bill";

            var color = "";
            var available = "";
            if (v.kios_pestisida_available == 1) {
              available = "Aktif";
              color = "#2ecc71";
            } else {
              available = "Tidak Aktif";
              color = "#D8334A";
            }

            slider +=
              `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductPestisida('` +
              v.kios_pestisida_id +
              `')">
                                    <div data-height="200" class="caption bottom-0">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="` +
              img2 +
              `" class="centerimg detail-kios_pestisida_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="custom-card-header-full bottom-0 font-12 lh-20 center-text color-white" style="background-color: ${color}">` +
              v.kios_pestisida_nama +
              `</h5>
                                    </div>    
                                    <label class="bottom-0 font-12 lh-20 center-text top-25 bold">` +
              v.kios_pestisida_kemasan +
              `  ${HELPER.nullConverter(v.pestisida_satuan)}</label>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_harga +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">Harga : ` +
              HELPER.toRp(v.kios_pestisida_harga) +
              `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_stok +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">Stok : ${v.kios_pestisida_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
            if (res.total > 2 && res.total - 1 == i) {
              slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductPestisida('${v.kios_pestisida_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
            }
            // <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_pestisida_stok + ` Botol</label>
          });

          $(".show-product-pestisida").html(slider);
          $(".no-product").hide();
          if (res.total > 1) {
            setTimeout(function () {
              $(".show-product-pestisida").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          } else {
            setTimeout(function () {
              $(".show-product-pestisida").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          }
          resolve(true);
        } else {
          // $('.show-product-pestisida').hide()
          $(".div-pestisida").hide();
          $(".no-product")
            .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`);
          resolve(false);
        }

        HELPER.unblock();
        $(".btn-back").on("click", function () {
          onPage("detail-produk");
        });
      },
    });
  });
}

function showProductPupuk() {
  var user_id = HELPER.getItem("user_id");
  HELPER.block();
  return new Promise((resolve) => {
    HELPER.ajax({
      url: BASE_URL + "Kios/produkPupuk",
      data: {
        user: user_id,
      },
      complete: function (res) {
        if (res.kategori_produk == 1) {
          $(".kategori-produk").text("Produk Benih");
        } else if (res.kategori_produk == 2) {
          $(".kategori-produk").text("Produk Pestisida");
        } else if (res.kategori_produk == 3) {
          $(".kategori-produk").text("Produk Pupuk");
        }
        if (res.total > 0) {
          var slider = "";
          $.each(res.data, function (i, v) {
            var img3 = "./assets/images/noimage.png";
            if (v.kios_pupuk_image) {
              img3 = BASE_ASSETS + "images/pupuk/thumbs/" + v.kios_pupuk_image;
            }
            $(".link-kios_pupuk_image").attr({
              href: img3,
              "data-lightbox": img3,
            });
            $(".detail-kios_pupuk_image").attr({
              src: img3,
              title: v.kios_pupuk_image,
            });
            var icon_harga = "assets/images/icons/icon-rp.png";
            var icon_stok = "assets/images/icons/icon-layer.png";
            var icon_jumlah = "fas fa-weight";
            var icon_total = "fa fa-money-bill";

            var color = "";
            var available = "";
            if (v.kios_pupuk_available == 1) {
              available = "Aktif";
              color = "#2ecc71";
            } else {
              available = "Tidak Aktif";
              color = "#D8334A";
            }

            slider +=
              `<div class="item bg-theme round-small">
                                <a href="javascript:;" class="color-theme caption m-0" style="height:200px; width:150px;" onclick="detailProductPupuk('` +
              v.kios_pupuk_id +
              `')">
                                    <div data-height="200" class="caption bottom-0">
                                        <div class="caption-overlay bg-gradient opacity-10"></div>
                                        <img src="` +
              img3 +
              `" class="centerimg detail-kios_pupuk_image" style="height:100px;">
                                    </div>
                                    <div>
                                        <h5 class="custom-card-header-full bottom-0 lh-20 font-12 center-text color-white" style="background-color: ${color}">` +
              v.kios_pupuk_nama +
              `</h5>
                                    </div>
                                    <label class="bottom-0 lh-20 font-12 center-text top-25 bold">` +
              v.kios_pupuk_kemasan +
              ` Kg</label>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_harga +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 20px;margin-top: 0px;margin-left: 1px; ">
                                        <label style="padding-left:5px;">Harga : ` +
              HELPER.toRp(v.kios_pupuk_harga) +
              `</label>
                                    </div>
                                    <div class="row" style="padding-left: 10px;">
                                        <img src="` +
              icon_stok +
              `" onerror="this.src='./assets/images/noimage.png'" style="height: 14px; margin-top: 4px; margin-left: 5px;">
                                        <label style="padding-left:5px;">Stok : ${v.kios_pupuk_stok}</label>
                                    </div>
                                </a>
                            </div>
                        `;
            if (res.total > 2 && res.total - 1 == i) {
              slider += `<div class="item round-small bg-theme show-overlay-list bottom-10" style="width: 100px;height:200px;" onclick="loadProductPupuk('${v.kios_pupuk_id}')">
                                        <div class="color-theme m-0 content-box voucher-card" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                                            <div class="voucher-card-body color-custom-black text-center">
                                                <i class="fa fa-angle-right fa-3x text-center"></i>
                                                <p class="m-0 lh-20 font-15">Lihat Lainnya</p>
                                            </div>
                                        </div>
                                    </div>`;
            }
            // <label class="left-10 font-12 bottom-0 lh-20"><i class="${icon_stok} color-highlight" style="padding-right: 4px;"></i>Stok : ` + v.kios_pupuk_stok + ` Pack</label>
          });

          $(".show-product-pupuk").html(slider);
          $(".no-product").hide();
          if (res.total > 1) {
            setTimeout(function () {
              $(".show-product-pupuk").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          } else {
            setTimeout(function () {
              $(".show-product-pupuk").owlCarousel({
                dots: true,
                loop: false,
                margin: 20,
                nav: false,
                lazyLoad: true,
                items: 1,
                autoplay: false,
                autoplayTimeout: 5000,
                autoWidth: true,
              });
            }, 100);
          }
          resolve(true);
        } else {
          // $('.show-product-pupuk').hide()
          $(".div-pupuk").hide();
          $(".no-product")
            .html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                        <div class="not-found">
                                            <div></div>
                                            <h3>No product available.</h3>
                                        </div>
                                    </div>`);
        }
        resolve(false);

        HELPER.unblock();
        $(".btn-back").on("click", function () {
          onPage("detail-produk");
        });
      },
    });
  });
}

function loadTotalBenih() {
  HELPER.ajax({
    url: BASE_URL + "Kios/totalProdukKios",
    data: { user_id: HELPER.getItem("user_id") },
    complete: function (res) {
      if (res.success) {
        $(".total_produk_benih").text(
          HELPER.convertK(res.data.totalProdukBenih)
        );
        $(".total_pestisida").text(
          HELPER.convertK(res.data.totalProdukPestisida)
        );
        $(".total_pupuk").text(HELPER.convertK(res.data.totalProdukPupuk));
      }
    },
  });
}

function detailProductBenih(id) {
  HELPER.setItem("detail_produk_varietas_id", id);
  onPage("detail-jual-benih");
}

function detailProductPestisida(id) {
  HELPER.setItem("detail_produk_pestisida_id", id);
  onPage("detail-jual-pestisida");
}

function detailProductPupuk(id) {
  HELPER.setItem("detail_produk_pupuk_id", id);
  onPage("detail-jual-pupuk");
}

function loadProductVarietas() {
  onPage("produk-varietas-more");
}

function loadProductPestisida() {
  onPage("produk-pestisida-more");
}

function loadProductPupuk() {
  onPage("produk-pupuk-more");
}

function loadConfig() {
  var detailScanReaderAkumulation = 0;
  var detailScanReader;
  HELPER.ajax({
    url: BASE_URL + "Main/loadConfig",
    complete: function (res) {
      var configMaster = JSON.stringify(res.master_label);
      var configSett = JSON.stringify(res.sett_label);
      var configSettDataScan = JSON.stringify(res.sett_data_scan);
      HELPER.setItem("configMaster", configMaster);
      HELPER.setItem("configSett", configSett);
      $.each(res.sett_data_scan, function (i, v) {
        if (v.conf_code == "sett_data_scan_aktual") {
          if (v.conf_value == 1) {
            HELPER.setItem("configSettDataScanAktual", 1);
          } else {
            HELPER.setItem("configSettDataScanAktual", 0);
          }
        } else {
          if (
            v.conf_code == "sett_data_scan_read_synegnta" &&
            v.conf_value == 1
          ) {
            // $('.show_'+v.conf_code).hide()
            detailScanReaderAkumulation = detailScanReaderAkumulation + 1;
            detailScanReader = v.conf_code;
          } else if (
            v.conf_code == "sett_data_scan_read_simperbenih" &&
            v.conf_value == 1
          ) {
            // $('.show_'+v.conf_code).show()
            detailScanReaderAkumulation = detailScanReaderAkumulation + 1;
            detailScanReader = v.conf_code;
          }
        }
      });
      HELPER.setItem("configSettScanReader", detailScanReader);
      HELPER.setItem(
        "configSettScanReaderAkumulation",
        detailScanReaderAkumulation
      );
    },
  });
}

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
      message = `Kode QR code tidak ditemukan. Mohon cek keaslian produk Anda`;
      type = "not-found";
    } else if (status == 2) {
      message = `QR Code Anda terdaftar, namun QR Code sudah di Scan oleh petani. Mohon cek keaslian produk Anda`;
      type = "non-aktif";
    } else if (status == 3) {
      message = `Produk telah melewati akhir masa edar. Mohon cek keaslian produk Anda`;
      type = "expired";
    }
    showFailedScan(message, false, code, type);
  }
}

function kiosScanPouch() {
  scanOpen(function (result) {
    kiosCekSampling(result)
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
        url: BASE_URL + "Scan/samplingKiosTrader",
        data: {
            user_id: HELPER.getItem("user_id"),
            qrcode: text,
            batch_no: batch_no,
            pouch_no: pouch_no,
        },
        success: function (res) {
            HELPER.unblock();
            if (res.success) {
                if (res.data.pouch_status == 1) {
                    if (
                        res.data.type == "pouch" &&
                        res.data.pouch_qr_code.indexOf("http") >= 0
                    ) {
                        if (
                            parseInt(
                                HELPER.getItem(
                                    "configSettScanReaderAkumulation"
                                )
                            ) == 1
                        ) {
                            if (
                                HELPER.getItem("configSettScanReader") ==
                                "sett_data_scan_read_syngenta"
                            ) {
                                HELPER.unblock();
                                HELPER.setItem(
                                    "detail_scan",
                                    JSON.stringify(res.data)
                                );
                                HELPER.showMessage({
                                    success: true,
                                    title: "Scan Berhasil!",
                                    message: "Produk terdaftar!",
                                    callback: function () {
                                        onPage("detail-scan");
                                    },
                                });
                            } else {
                                HELPER.unblock();
                                HELPER.showMessage({
                                    success: true,
                                    title: "Scan Berhasil!",
                                    message: "Produk terdaftar!",
                                    callback: function () {
                                        window.open(res.data.pouch_link);
                                    },
                                });
                            }
                        } else {
                            HELPER.block();
                            HELPER.showMessage({
                                success: true,
                                title: "Scan Berhasil!",
                                message: "Produk terdaftar!",
                                callback: function () {
                                    $("#btn-scan-choose").click();
                                },
                            });
                            $("#btn-choose-scan-app").off("click");
                            $("#btn-choose-scan-browser").off("click");
                            setTimeout(function () {
                                $("#btn-choose-scan-app").on(
                                    "click",
                                    function (e) {
                                        HELPER.unblock();
                                        HELPER.setItem(
                                            "detail_scan",
                                            JSON.stringify(res.data)
                                        );
                                        onPage("detail-scan");
                                    }
                                );
                                $("#btn-choose-scan-browser").on(
                                    "click",
                                    function (e) {
                                        HELPER.unblock();
                                        window.open(res.data.pouch_link);
                                    }
                                );
                            }, 500);
                        }
                    } else {
                        HELPER.setItem("detail_scan", JSON.stringify(res.data));
                        HELPER.showMessage({
                            success: true,
                            title: "Scan Berhasil!",
                            message: "Produk terdaftar!",
                            callback: function () {
                                // $("#btn-scan-choose").click();
                                onPage("detail-scan");
                            },
                        });
                    }
                } else {
                    showFailedScan(res.message, false, text, res.type);
                }
            } else {
              showFailedScan(res.message, false, text, res.type);
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
    kiosCekSampling(
        null,
        $("#input_no_batch").val(),
        $("#input_no_pouch").val()
    );

    setTimeout(function () {
        $("#input_no_pouch, #input_no_batch").val("");
    }, 300);
}

function loadMenu() {
    HELPER.ajax({
        url: BASE_URL + "Main/loadMenu",
        complete: function (res) {
            console.log(res);
            confKios = res.data.data.menu_kios;
            jumlah = res.data.countKios;
            $.each(confKios, function (i, v) {
                if (jumlah % 3) {
                    $("#div-" + v.conf_mobile_code).addClass("one-third");
                    $("#div-" + v.conf_mobile_code).addClass("last-column");
                    $("#div-" + v.conf_mobile_code).addClass("right-5");
                } else {
                    $("#div-" + v.conf_mobile_code).addClass("one-third");
                    $("#div-" + v.conf_mobile_code).addClass("last-column");
                    $("#div-" + v.conf_mobile_code).addClass("right-5");
                }

                if (parseInt(v.conf_mobile_value) == 1) {
                    $("#div-" + v.conf_mobile_code).show();
                } else {
                    $("#div-" + v.conf_mobile_code).hide();
                }
                if (v.conf_mobile_image) {
                  $("#div-" + v.conf_mobile_code).find('.caption-bg').css('background-image', `url(${BASE_ASSETS+'icon_feature/'+v.conf_mobile_image})`);
              }
            });
        },
    });
}