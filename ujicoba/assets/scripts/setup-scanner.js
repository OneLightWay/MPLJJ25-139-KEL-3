function scanOpen(suc, error) {
    try {
        QRScanner.prepare(function onDone(err, status){
            if (err) {
                console.log(err);
                error(err.name)
            }else{
                if (status.authorized){
                    $('#page').hide()
                    $('#btn-open-scanner').click()
                    QRScanner.show();
                    QRScanner.scan(function(errr, contents){
                        if (errr) {
                            scanClose()
                            if (errr.name != "SCAN_CANCELED") {
                                setTimeout(() => {
                                    error(errr.name)
                                }, 500);
                            }
                        } else {
                            scanClose()
                            setTimeout(() => {
                                suc(contents)
                            }, 500);
                        }
                    });
                }else{
                    error(err.name)
                }
            }
        });


    } catch (error) {
        $('#page').show()
        console.log(error);
    }
}

function scanClose() {
    try {
        $('#page').show();
        $('.menu-hider').click()
        $('#page').show();
        HELPER.block()
        setTimeout(() => {
            $('#page').show();
            QRScanner.cancelScan();
            QRScanner.hide();
            setTimeout(() => {
                QRScanner.destroy();
                HELPER.unblock(1000)
            }, 1000);
        }, 1000);
    } catch (error) {
        $('#page').show();
        console.log(error);
    }
}

function scanToggleFlash(el) {
    try {
        if ($(el).hasClass('light-active')) {
            $(el).addClass('bg-yellow1-light').removeClass(['bg-gray1-light', 'bg-gray1-dark', 'light-active'])
            QRScanner.disableLight();
        }else{
            $(el).addClass(['light-active', 'bg-gray1-light']).removeClass(['bg-yellow1-light', 'bg-gray1-dark'])
            QRScanner.enableLight();
        }
    } catch (error) {
        console.log(error);
    }
}