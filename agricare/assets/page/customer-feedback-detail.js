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
            <p id="${name}" class="font-12 bottom-10 customer-feedback-deskripsi top-5" style="background-color : #f7f7f7; border-radius: 7px !important; padding: 7px !important;">${value}</p>
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
            onPage('customer-feedback');
        });
    }, 300);
    
    loadPage();

    HELPER.removeItem('feedback_detail_sales_id');
});


function loadForm(_id, value) {
    $('#feedback_detail').html("");
    var fieldData = value.customer_feedback_data;
    HELPER.ajax({
        url: BASE_URL + 'CustomerFeedback/readKategori',
        type: 'POST',
        data: {
            id: _id
        },
        success: (data) => {
            let timeDisplay = moment(value.customer_feedback_created_at).format('DD MMM YYYY - HH:mm');
            // if status is closed
            if (value.customer_feedback_status == 2) {
                statusLabel = `<span class="bhsConf-feedback_closed" style="padding: 2px 5px;color : #16A34A; background-color:#E9FFF0; border-radius: 5px;">Tutup</span>`;

                let follup = value.feedback_follup;
                let time = moment(follup.feedback_follup_created_at).format('ddd, DD MMM YYYY HH:mm');
                let headerText = `${follup.user_nama} - ${time}`;

                $('#detail_follup_header').html(headerText);
                $('#detail_follup_deskripsi').html(follup.feedback_follup_deskripsi);
                $('#detail_follup_foto').prop("src", follup.feedback_follup_foto);
                $('#follup_box').css({
                    display: 'block'
                });
            }
            else {
                statusLabel = `<span class="bhsConf-feedback_open" style="padding: 2px 5px;color : #555; background-color:#F2F2F2; border-radius: 5px;">Proses</span>`;
                $('#follup_box').css({
                    display: 'none'
                });
            }

            $('#customer-feedback-detail-title').html(value.kategori_customer_feedback_nama);
            $('#customer-feedback-detail-subtitle').html(`${statusLabel} ${timeDisplay}`);
            let html = "";
            $.each(data.fields, (i, fld) => {
                switch (fld.feedback_field_type) {
                    case '2':
                        html += formTypes.text(fld.feedback_field_fieldname, fld.feedback_field_name, fieldData[fld.feedback_field_fieldname]);
                        break;
                    case '3':
                        html += formTypes.boolean(fld.feedback_field_fieldname, fld.feedback_field_name, fieldData[fld.feedback_field_fieldname]);
                        break;
                    case '4':
                        html += formTypes.image(fld.feedback_field_fieldname, fld.feedback_field_name, fieldData[fld.feedback_field_fieldname]);
                        break;
                    case '1':
                        html += formTypes.longText(fld.feedback_field_fieldname, fld.feedback_field_name, fieldData[fld.feedback_field_fieldname]);
                        break;
                }
            });
            $('#feedback_detail').html(html);
        },
        error: (err, message) => {
            HELPER.showMessage(message);
        }
    });
}

//image processing
function openFile(name) {
    $('#' + name).click();
}

function previewImage(params, prevEl) {
    console.log(params.target.id);
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = $(`#show-${prevEl}`).attr('src', e.target.result);
    }
    reader.readAsDataURL(params.target.files[0]);
}

//basic page functionality
function loadPage() {
    var _id = HELPER.getItem('feedback_detail_sales_id');

    HELPER.ajax({
        url: BASE_URL + 'CustomerFeedback/read',
        type: 'POST',
        data: {
            id: _id
        },
        success: (res) => {
            loadForm(res.customer_feedback_kategori_id, res);
        },
        error: (err, message) => {
            HELPER.showMessage(message);
        }
    });
}

//etc
function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}
function setWord(str) {
    var arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }
    var result = arr.join(" ");
    return result;
}