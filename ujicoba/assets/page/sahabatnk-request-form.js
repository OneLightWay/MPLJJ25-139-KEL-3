let typeTake;
function takeKtp() {
    typeTake = "ktp";
    navigator.camera.getPicture(imageReceived, cameraFail, {
        quality: 40,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        allowEdit: false,
        correctOrientation: true,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK,
        saveToPhotoAlbum: false,
    });
}
function takeSelfie() {
    typeTake = "selfie";
    try {
        navigator.camera.getPicture(imageReceived, cameraFail, {
            quality: 40,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            allowEdit: false,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false,
        });
    } catch (error) {
        HELPER.showMessage({
            success: false,
            title: 'Terdapat kesalahan !',
            message: error
        })
    }
}

function imageReceived(imageURI) {
    try {
        $(".img-" + typeTake).show();
        // $(".img-" + typeTake).attr("src", imageURI);
        var options = new FileUploadOptions();
        options.fileKey = "foto";
        options.fileName = imageURI.substr(imageURI.lastIndexOf("/") + 1);
    
        var params = new Object();
    
        if (typeTake === "ktp") {
            typeDok = 1;
        } else if (typeTake === "selfie") {
            typeDok = 2;
        }
        options.params = {
            user_id: HELPER.getItem("user_id"),
            type_dok: typeDok,
        };
        
        var ft = new FileTransfer();
        ft.upload(
            imageURI,
            encodeURI(BASE_URL + "Sahabat/saveTemp"),
            function (succ) {
                console.log(succ);
                if (succ.response) {
                    try {
                        var datatemp = JSON.parse(succ.response)
                        if (datatemp.record) {
                            $(".img-" + typeTake).attr("src", BASE_ASSETS+'temp_sahabat/'+datatemp.record.temp_sahabat_file_nama);
                        }
                    } catch (error) {
                        
                    }
                }
            },
            function (err) {
                HELPER.showMessage({
                    title: "Gagal !",
                    message: "Silahkan periksa koneksi internet Anda !",
                });
            },
            options
        );
    } catch (error) {
        HELPER.showMessage({
            success: false,
            title: 'Terdapat kesalahan !',
            message: error
        })
    }
}

function cameraFail(message) {
    HELPER.showMessage({
        title: "Gagal !!",
        message: "Harap untuk foto kembali "+message,
    });
}

function save(name) {
    var form = $("#" + name)[0];
    var formData = new FormData(form);
    formData.append("user_id", HELPER.getItem("user_id"));
    HELPER.save({
        url: BASE_URL + "Sahabat/store",
        cache: false,
        data: formData,
        contentType: false,
        processData: false,
        form: name,
        confirm: true,
        callback: function (success, id, record, message) {
            HELPER.unblock(100);
            if (success == true) {
                onPage("sahabatnk-waiting");
            } else if (success == "info") {
                HELPER.showMessage({
                    success: 'info',
                    title: "Info",
                    message: "Cek form berikut "+message.toString(),
                });
            } else {
                HELPER.showMessage({
                    success: false,
                    title: "Failed",
                    message: "Failed to save data",
                });
            }
        },
        oncancel: function (result) {
            HELPER.unblock(100);
        },
    });
}
