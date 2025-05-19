// inputs for different types 
var formType = {
    text: (name, label) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label}</label>
            <em>(Required)</em>
            <input type="text" id="${name}" class="font-12 bottom-10 ${name}" style="height: 20px;" name="${name}"  required>
        </div>`,
    longText: (name, label) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label_${name} bhsConf-col_${name}">${label}</label>
            <em>(Required)</em>
            <textarea name="${name}" id="${name}" class="font-12 bottom-10 customer-feedback-deskripsi" rows="10" required></textarea>
        </div>`,
    boolean: (name, label) => `
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10">
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label}</label>
            <em>(Required)</em>
            <select class="font-12 bottom-10 ${name}" id="${name}" name="${name}" required>
                <option value="" selected> Pilih ${label} </option>
                <option value="1">Ya</option>
                <option value="2">Tidak</option>
            </select>
        </div>`,
    image: (name, label) => `    
        <div class="font-12 input-style input-style-1  form-group input-required bottom-10" >
            <label class="color-highlight label-${name} bhsConf-col_${name}">${label} <em>(Required)</em></label>
            <div class="content bottom-10 color-white text-center"  style="margin-top : 25px">
                <img src="assets/images/uploadimage.png" onerror="this.src='./assets/images/noimage.png'" class="bg-highlight shadow-large cusfomer-feedback-foto round-medium" id="show-${name}" style="width: 100%" onclick="openFile('${name}')">
                <span style="position: absolute;right: 0%;bottom: 0;" class="bg-gray1-light">
                    <i class="fa fa-camera color-blue2-dark left-5 right-5 top-5 bottom-5 fa-2x"></i>
                </span>
            </div>
            <input type="file" class="font-12 ${name}" name="${name}" id="${name}" accept="image/*" style="margin-bottom : 15px; background-color : white; display: none" onChange="previewImage(event,'${name}')">
        </div>`
}

$(function () {
    HELPER.createCombo({
        el: 'customer_feedback_kategori_id',
        valueField: 'kategori_customer_feedback_id',
        displayField: 'kategori_customer_feedback_nama',
        url: BASE_URL + 'CustomerFeedback/getKategori',
        withNull: true,
        isSelect2: false,
        placeholder: 'Pilih Kategori'
    });

    $(document).on('change', '#customer_feedback_kategori_id', () => {
        let _id = $('#customer_feedback_kategori_id').val()
        HELPER.ajax({
            url: BASE_URL + "CustomerFeedback/readKategori",
            data: {
                id: _id
            },
            complete: function (res) {
                loadForm(res);
            }
        });
    });

    $('.back-button').on('click', function (event) {
        onPage('main')
    });
})

function previewImage(params, prevEl) {
    console.log(params.target.id);
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = $(`#show-${prevEl}`).attr('src', e.target.result);
    }
    reader.readAsDataURL(params.target.files[0]);
}

function openFile(name) {
    $('#' + name).click();
}

function loadForm(data) {
    $('#main-inputs').html("");
    $('#customer_feedback_farmer_id').val(HELPER.getItem('user_id'));
    let html = "";
    $.each(data.fields, (i, fld) => {
        switch (fld.feedback_field_type) {
            case '2':
                html += formType.text(fld.feedback_field_fieldname, fld.feedback_field_name);
                break;
            case '3':
                html += formType.boolean(fld.feedback_field_fieldname, fld.feedback_field_name);
                break;
            case '4':
                html += formType.image(fld.feedback_field_fieldname, fld.feedback_field_name);
                break;
            case '1':
                html += formType.longText(fld.feedback_field_fieldname, fld.feedback_field_name);
                break;
        }
    });
    //configure lat long
    try {
        navigator.geolocation.getCurrentPosition(function (pos) {
            $('#customer_feedback_lat').val(pos.coords.latitude);
            $('#customer_feedback_long').val(pos.coords.longitude);
        });
    }
    catch (e) {
        var now_latlng = null;
        if (HELPER.isNull(HELPER.getItem('user_lat')) == false || HELPER.isNull(HELPER.getItem('user_long')) == false) {
            now_latlng = new L.LatLng(HELPER.getItem('user_lat'), HELPER.getItem('user_long'));
        } else {
            if (HELPER.isNull(USER_LAT) || HELPER.isNull(USER_LONG)) {
                reqLocPermission();
                now_latlng = new L.LatLng(HELPER.getItem('user_lat'), HELPER.getItem('user_long'));
            }
        }

        $('#customer_feedback_lat').val(now_latlng.lat);
        $('#customer_feedback_long').val(now_latlng.lng);
    }
    $('#main-inputs').html(html);
}

function save(name) {
    var form = $('#' + name)[0];
    var formData = new FormData(form);
    HELPER.save({
        cache: false,
        data: formData,
        url: BASE_URL + 'CustomerFeedback/create',
        confirm: true,
        contentType: false,
        processData: false,
        form: name,
        callback: function (success, id, record, message) {
            HELPER.unblock(100);
            if (success) {
                HELPER.showMessage({
                    success: true,
                    title: "Success",
                    message: "Terima kasih sudah menghubungi Syngenta, pelaporan Anda sudah kami terima dengan Baik. Untuk keluhan/pelaporan mohon ditunggu ya, kami sedang proses keluhan Anda. Anda akan dihubungi oleh tim kami untuk membantu Anda, terima kasih!"
                });
                onPage('customer-feedback');
            } else {
                HELPER.showMessage({
                    success: false,
                    title: 'Failed',
                    message: 'Gagal mengirim feedback'
                })
            }
        },
        oncancel: function (result) {
            HELPER.unblock(100);
        }
    });
}

