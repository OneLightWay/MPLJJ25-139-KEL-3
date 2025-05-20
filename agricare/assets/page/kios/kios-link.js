$(function () {
    setTimeout(function () {
        $('.back-button').off();
        setTimeout(function () {
            $('.back-button').on('click', function () {
                setTimeout(function () {
                    onPage('akun-kios')
                }, 100)
            });
        }, 300)
    }, 300)
    $('#plus-menu').toggle( "bounce", { times: 1, distance: 100 }, 5000 );
    $('#link_type').on('change', function() {
        if (this.value == "Lainnya") {
            $('#link_name').val('').attr('required', true)
            $('.div_link_name').show()
        }else{
            $('#link_name').val('').removeAttr('required')
            $('.div_link_name').hide()
        }
    });
    $('#link_user_id').val(HELPER.getItem('user_id'))
	loadKiosLink()
})

function loadKiosLink() {
	$('#list-kios-link').html('')
    HELPER.ajax({
        url: BASE_URL+'AkunKios/loadKiosLink',
        data: {user_id: HELPER.getItem('user_id')},
        complete: function (res) {
            if (res.success && res.total) {
                $.each(res.data, function(i, v) {
                    var img = null;
                    if (v.kios_link_type == 'Shopee') { img = '<img src="./assets/images/marketplace/logo-shopee.png" style="width: 60%;height: 50px;">'}
                    else if (v.kios_link_type == 'Tokopedia') { img = '<img src="./assets/images/marketplace/logo-tokopedia.png" style="width: 60%;height: 50px;">'}
                    else if (v.kios_link_type == 'Bukalapak') { img = '<img src="./assets/images/marketplace/logo-bukalapak.png" style="width: 60%;height: 50px;">'}
                    else if (v.kios_link_type == 'Lainnya') { img = '<i class="fa fa-globe"></i> '+HELPER.nullConverter(v.kios_link_name)}
                    $('#list-kios-link').append(`
                        <div class="row bottom-10">
                            <div class="col text-center left-20">
                                <a href="javascript:void(0)" class="font-18 color-highlight" onclick="window.open('${atob(v.kios_link_url)}');">${img}</a>
                            </div>
                            <div class="col-auto left-10 right-20">
                                <a href="javascript:void(0)" data-link="${btoa(JSON.stringify(v))}" onclick="onEditKiosLink(this)" class="button bg-blue2-dark button-xs round-large bottom-0"><i class="fas fa-pen"></i></a>
                            </div>
                        </div>
                    `)
                });
            }else {
                $('#list-kios-link').html(`<div class="content-boxed content-box left-0 right-0 bottom-10 shadow-large">
                                            <div class="not-found">
                                                <div></div>
                                                <h3>Data tidak tersedia.</h3>
                                            </div>
                                        </div>`)
            }
        }
    })
}

function onAddLink() {
    $('#form-link').trigger('reset')
    $('#link_link_id').val('')
    $('#link_type').val('Shopee').trigger('change')
    $('.for-link-add').show()
    $('.for-link-edit').hide()
    $('.btn-kios-link-tambah').click()
}

function saveLink() {
    var form = $('#form-link')[0];
    var formData = new FormData(form);
    $('.close-menu').click()
    HELPER.save({
        url: BASE_URL+'AkunKios/addKiosLink',
        cache : false,
        data  : formData, 
        contentType : false, 
        processData : false,
        confirm: true,
        callback : function(success,id,record,message)
        {
            loadKiosLink()
        },
        oncancel: function () {
            $('.btn-kios-link-tambah').click()
        }
    })
}

function onEditKiosLink(el) {
    var data = JSON.parse(atob($(el).data('link')))
    if (data) {
        $('#link_link_id').val(data.kios_link_id)
        $('#link_type').val(data.kios_link_type).trigger('change')
        $('#link_url').val(atob(data.kios_link_url))
        $('.btn-delete-link').data('link-id', data.kios_link_id)
        setTimeout(function () {
            $('.for-link-add').hide()
            $('.for-link-edit').show()
            $('#link_name').val(data.kios_link_name)
            $('.btn-kios-link-tambah').click()
        }, 300)
    }
}

function onDeleteLink(el) {
    var kios_link_id = $(el).data('link-id')
    $('.close-menu').click()
    HELPER.confirm({
        message: 'Apakah Anda ingin menghapusnya ?',
        callback: function (oke) {
            if (oke) {
                HELPER.ajax({
                    url: BASE_URL+'AkunKios/deleteKiosLink',
                    data:{link_id: kios_link_id},
                    complete: function(){loadKiosLink()}
                })
            }else{
                $('.btn-kios-link-tambah').click()
            }
        }
    })
}