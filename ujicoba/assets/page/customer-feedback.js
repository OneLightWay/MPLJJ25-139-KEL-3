// inputs for different types 
var formTypes = {
    text: (name, label, value) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label}</label>
            <input type="text" id="${name}" class="font-12 bottom-10 ${name}" style="height: 30px; background-color: #f7f7f7; border-radius: 7px !important; padding-left : 7px !important;" name="${name}" value="${value}" disabled>
        </div>`,
    longText: (name, label, value) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label_${name} bhsConf-col_${name}">${label}</label>
            <textarea name="${name}" id="${name}" class="font-12 bottom-10 customer-feedback-deskripsi top-5" style="background-color : #f7f7f7; border-radius: 7px !important; padding-left : 7px !important;" rows="3" disabled>${value}</textarea>
        </div>`,
    boolean: (name, label, value) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label}</label>
            <input type="text" id="${name}" class="font-12 bottom-10 ${name}" style="height: 20px; background-color : #f7f7f7; border-radius: 7px !important; padding-left : 7px !important;" name="${name}" value="${value}" disabled>
        </div>`,
    image: (name, label, value) => `    
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10" >
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label}
            <div class="content bottom-10 color-white text-center"  style="margin-top : 10px">
                <img src="${value}" onerror="this.src='./assets/images/noimage.png'" class="bg-highlight shadow-large cusfomer-feedback-foto round-medium" id="show-${name}" style="width: 100%">
            </div>
        </div>`
}

$(function () {
    setTimeout(() => {
        $('.back-button').off('click');
        $('.back-button').on('click', () => {
            onPage('main');
        });
    }, 200)

    HELPER.createCombo({
        el: 'filter_kategori',
        valueField: 'kategori_customer_feedback_id',
        displayField: 'kategori_customer_feedback_nama',
        url: BASE_URL + 'CustomerFeedback/getKategori',
        withNull: true,
        isSelect2: false,
        placeholder: 'Pilih Kategori'
    });
    loadPage();
});

function feedbackDetail(_id) {
    HELPER.setItem('feedback_detail_sales_id', _id);
    setTimeout(function () {
        onPage('customer-feedback-detail');
    }, 200);
}
function applyFilter() {
    $('#feedback-filter-close-btn').trigger('click');
    loadPage()
}

function resetFilter() {
    onPage('feedback-list-sales');
}

function loadPage() {
    $('.list_customer_feedback').html('');
    var farmer_id = HELPER.getItem('user_id');
    var filter_status = $('#filter_status').val();
    var filter_sort = $('#filter_order_asc').is(':checked') ? 'asc' : 'desc';
    var filter_search = $("#filter_search").val();
    var filter_kategori = $("#filter_kategori").val();

    HELPER.initLoadMore({
        perPage: 10,
        urlExist: BASE_URL + 'CustomerFeedback/listFeedbackExist',
        dataExist: {
            customer_feedback_farmer_id: farmer_id,
            status : filter_status,
            sort : filter_sort,
            search : filter_search,
            kategori : filter_kategori
        },
        urlMore: BASE_URL + 'CustomerFeedback/list',
        dataMore: {
            customer_feedback_farmer_id: farmer_id,
            status : filter_status,
            sort : filter_sort,
            search : filter_search,
            kategori : filter_kategori
        },
        callbackExist: function (data) {
            if (data.hasOwnProperty('success')) {
                $('.list_customer_feedback').html(`<div class="content-boxed content-box left-15 right-0 bottom-10 shadow-large" style="width: 91%;">
                                                <div class="not-found">
                                                    <div></div>
                                                    <h3>Tidak ada feedback</h3>
                                                </div>
                                            </div>`)
                $('.customer-feedback-load-more').hide()
            } else {
                $('.customer-feedback-load-more').show()
            }
        },
        callbackMore: function (data) {
            var myQueue = new Queue()
            myQueue.enqueue(function (next) {
                HELPER.block()
                next()
            }, '1').enqueue(function (next) {
                var customer_feedback = JSON.parse(data.responseText);
                $.each(customer_feedback.data, function (i, v) {
                    let timeDisplay = "";
                    let data = JSON.parse(v.customer_feedback_data);
                    var statusLabel = ``;

                    if (moment(v.customer_feedback_created_at).isSame(moment(), 'day')) {
                        timeDisplay = moment(v.customer_feedback_created_at).format('HH:mm');
                    }
                    else {
                        timeDisplay = moment(v.customer_feedback_created_at).format('DD MMM YYYY');
                    }

                    if (v.customer_feedback_status == 2) {
                        statusLabel = `<span class="bhsConf-feedback_closed" style="padding: 2px 5px;color : #16A34A; background-color:#E9FFF0; border-radius: 5px;">Tutup</span>`;
                    }
                    else {
                        statusLabel = `<span class="bhsConf-feedback_open" style="padding: 2px 5px;color : #555; background-color:#F2F2F2; border-radius: 5px;">Proses</span>`;
                    }

                    $('.list_customer_feedback').append(`
                        <div class="content bottom-20"> 
                            <a href="javascript:void(0)" class="caption round-medium shadow-large bg-theme bottom-15 show-overlay" onclick="feedbackDetail('${v.customer_feedback_id}')">
                                <div class="" style="display: flex;">
                                    <div style="width : 75%; margin: 15px; margin-bottom: 0;">
                                        <h2 class="font-16 color-custom-dark" style="margin-bottom: 0">` + v.kategori_customer_feedback_nama + `</h2>
                                        <span style="color:#828282"><small>${timeDisplay}</small></span>
                                    </div>
                                    <div class="color-custom-dark" style="width : 25%; margin-top: 15px; margin-right: 15px; text-align : right;">
                                        ${statusLabel}
                                    </div>
                                </div>
                                <div class="content left-20" style="margin-bottom: 15px">
                                    <div class="">
                                        <p class="color-custom-dark" style="margin-bottom : 0 !important">` + getSafe(() => data.deskripsi, '') + `</p>
                                    </div>
                                </div>
                                <div class="content-footer">
                                    <span class="bhsConf-ketuk_detail">Ketuk untuk detail</span>
                                    <i class="fa fa-angle-right fa-lg"></i>
                                </div>
                                <div class="clear"></div>
                            </a>
                        </div>
                    `);

                });
                next()
            }, '2').enqueue(function (next) {
                HELPER.unblock(500)
                setTimeout(function () { setLangApp() }, 500)
                next()
            }, '3').dequeueAll()
        },
        scrollCek: function (callLoadMore) {
            $('.customer-feedback-load-more').off('click').on('click', function () {
                HELPER.block()
                callLoadMore()
            });
        },
        callbackEnd: function () {
            $('.customer-feedback-load-more').hide()
            $('.customer-feedback-load-more').off('click');
        }

    });
}


function filterStatus(status = null) {
    switch (status) {
        case '1':
            $('#filter_btn_open').prop('data-tab-active', true);
            $('#filter_btn_closed').prop('data-tab-active', false);
            $('#filter_btn_all').prop('data-tab-active', false);
            $('#filter_status').val(1);
            loadPage();
            break;
        case '2':
            $('#filter_btn_open').prop('data-tab-active', false);
            $('#filter_btn_closed').prop('data-tab-active', true);
            $('#filter_btn_all').prop('data-tab-active', false);
            $('#filter_status').val(2);
            loadPage();
            break;
        default:
            $('#filter_btn_open').prop('data-tab-active', false);
            $('#filter_btn_closed').prop('data-tab-active', false);
            $('#filter_btn_all').prop('data-tab-active', true);
            $('#filter_status').val('');
            loadPage();
            break;
    }
}

function getSafe(fn, defaultValue) {
    try {
        return fn();
    }
    catch (e) {
        return defaultValue;
    }
}

function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}