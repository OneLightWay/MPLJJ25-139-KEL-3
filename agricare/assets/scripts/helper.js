var syngentastorage = window.localStorage;

var HELPER = function()
{
    var menuid=null;
    var role_access = [];
    var loadBlock = function(message, el)
    {
        if (el) {
            $(el).block({ 
                message: '<div class="lds-ring" style="z-index: 10000"><div></div><div></div><div></div><div>' ,
                css: {border: 'none', backgroundColor: 'rgba(47, 53, 59, 0)'}
            });
        }else{
            $.blockUI({ 
                message: '<div class="lds-ring" style="z-index: 10000"><div></div><div></div><div></div><div>' ,
                css: {border: 'none', backgroundColor: 'rgba(47, 53, 59, 0)'}
            }); 
        }
    }

    var unblock = function(delay, el)
    {
        window.setTimeout(function() {
            if (el) {
                $(el).unblock();
            }else{
                $.unblockUI();
            }
        }, delay);
    }

    var html_entity_decode = function(txt){
        var randomID = Math.floor((Math.random()*100000)+1);
        $('body').append('<div id="random'+randomID+'"></div>');
        $('#random'+randomID).html(txt);
        var entity_decoded = $('#random'+randomID).html();
        $('#random'+randomID).remove();
        return entity_decoded;
    }

    return {
        block: function(msg,el=null)
        {
            loadBlock(msg,el);
        },
        unblock: function(delay=0,el=null)
        {
            unblock(delay,el);
        },
        getItem : (itemname) => {
            return syngentastorage.getItem(itemname);
        },

        removeItem:  (itemname) => {
            if (Array.isArray(itemname)) {
                $.each(itemname, function(i, v) {
                    syngentastorage.removeItem(v)
                });
                return true;
            }else{
                return syngentastorage.removeItem(itemname);
            }
        },

        setItem : (itemname,value)=> {
            return syngentastorage.setItem(itemname,value);
        },
        toRp : function(angka, num=false){
            if (angka == "" || angka == 'undefined' || angka == null) {
                angka = 0;
            }
            var hasil = 0;
            try {
                hasil = new Intl.NumberFormat('id-ID').format(angka);
            } catch(e) {
                var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
                var rev2    = '';
                var zero = num ? ',00' : '';
                for(var i = 0; i < rev.length; i++){
                    rev2  += rev[i];
                    if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
                        rev2 += '.';
                    }
                }
                hasil = '' + rev2.split('').reverse().join('') + zero;
            }
            return hasil;
        },
        logout: function()
        {
            $.ajax({
                url: BASE_URL + 'Login/logout',
                complete: function(response) {
                    window.location.reload();
                }
            })
        },
        html_entity_decode: function(txt)
        {
            html_entity_decode(txt);
        },
        getCookie: function(cname)
        {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        },
        nullConverter : function(val,xval){
            var retval = val;
            if (val === null || val === '' || typeof val == 'undefined') {
                retval = (typeof xval != 'undefined') ? xval : "-" ;
            }
            return retval;
        },
        isNull : function(val){
            var retval = val;
            if (val === null || val === '' || typeof val == 'undefined' || val == "null") {
                return true;
            }
            return false;
        },
        loadPage: function(el)
        {
            loadBlock();
            $(window).unbind('scroll');
            // $('li.kt-menu__item').removeClass('menu-currently-visited');
            $('li.kt-menu__item').removeClass('kt-menu__item--active');
            var page = $(el).data();
            // var dataSend = {'con':page.con,'menuid':page.menuid};
            menuid=page.menuid;
            $.ajax({
                url: BASE_URL + "Main/getPage",
                data: page,
                type: "POST",
                complete: function(pages)
                {
                    var resp_object = $.parseJSON(pages.responseText);
                    if (! resp_object.islogin) window.location.reload();
                    var title = (resp_object.menu_keterangan !=null) ? resp_object.menu_keterangan : '';
                    var role_name = (resp_object.role_name !=null) ? resp_object.role_name : '';

                    $.when(function(){
                        $("#pagecontainer").css('visibility','hidden');
                        $("#pagecontainer").html(atob(resp_object.view));
                        // $('#page-title').html("<h1>"+resp_object.menu_title+" <small>"+resp_object.menu_title+"</small></h1>");
                        $('#page-title').html("<h1>"+resp_object.role_name+" - "+resp_object.menu_title+"</h1>");
                        $('#page_breadcrumb').html(atob(resp_object.breadcrumb));
                        $('#box-title').html('Table ' + resp_object.menu_title);
                        $('#form-title').html('Form ' + resp_object.menu_title);
                        $('#pagesubtitle').html(resp_object.menu_keterangan);
                    }()).then(function(){
                        var container = $("#pagecontainer");
                        role_access = [];
                        if (resp_object.rights.length > 0){
                            $.each(resp_object.rights,function(i,v){
                                role_access.push(v.menu_code)
                                var role_object = $("[data-role="+v.menu_code+"]",container);
                                if ($(role_object).data('roleable')){
                                    $(role_object).addClass('aman');
                                }
                            });
                            $.each($('[data-roleable=true]',container),function(i,v){
                                if (! $(v).hasClass('aman')) {
                                    if ($(v).data('tab')) {
                                        window.li = $(v)[0];
                                        if (li) {
                                            $(li.nextElementSibling).find('a').trigger('click');
                                        }
                                    }
                                    $(v).remove();
                                } else {
                                    $(v).removeClass('aman');
                                }
                            })
                        }
                    }()).then(function(){
                        $("#pagecontainer").css('visibility','visible');
                        $('.disable').attr('disabled',true);
                        unblock(100);
                    }())
                },
                error: function(pages, status, errorname)
                {
                    $('#page-title').html(errorname);
                    $('#box-title').html('');
                    $('#pagesubtitle').html('');
                    $('#page_breadcrumb').html('');
                    $("#pagecontainer").html(pages.responseText);
                    unblock(100);
                }
            }).done(function() {
                $('html,body').animate({
                    scrollTop: 0
                }, 'fast');
            }());
            $(".menu_parent").each(function(i, v)
            {
                $(v).removeClass('kt-menu__item--active');
            });
            $('li').removeClass('kt-menu__item--active');
            $('li').removeClass('kt-menu__item--here');
            // $(el).parent('li').addClass('menu-currently-visited');
            $(el).parent().addClass('kt-menu__item--active');
            $(el).parent().addClass('menu-open');
            $(el).parents('.kt-menu__item--open').addClass('kt-menu__item--here menu-open');
            $('.kt-menu__item--open').not('.kt-menu__item--here').removeClass('kt-menu__item--open')
        },

        get_role_access: function () {
            return role_access;
        },
        
        initTable: function(config)
        {
            // console.log(config);
            // console.log(config.searchAble);
            config.columnDefs.push({defaultContent: "-",targets: "_all"},{targets:0,searchable:false,orderable:false});
            config = $.extend(true,{
                el: '',
                multiple: false,
                sorting: 'asc',
                index: 1,
                force: false,
                parentCheck: 'checkAll',
                childCheck: 'checkbox',
                searchAble: false,
                scrollAble: false,
                scrollYAble: false,
                clickAble: false,
                checkboxAble: false,
                destroyAble: false,
                tabDetails: false,
                showCheckbox: false,
                data: {
                    // 
                },
                filterColumn : {
                    state : true,
                    exceptionIndex : []
                },
                callbackClick: function () {},
            },config);
            var xdefault = 
            {
                //== Pagination settings
                // dom: '\`'+search_able+'\`',
                dom:`<'row'<'col-sm-12'ftr>>
                <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,
                // read more: https://datatables.net/examples/basic_init/dom.html
                destroy:config.destroyAble,
                lengthMenu: [5, 10, 25, 50, 100],

                pageLength: 10,

                language: {
                    'lengthMenu': 'Tampil _MENU_ data per halaman',
                    "emptyTable": "Tidak ada data yang dapat ditampilkan",
                    "info": "Menampilkan _START_ s/d _END_ dari _TOTAL_ data",
                    "infoEmpty": "Tidak ada data yang dapat ditampilkan",
                    "infoFiltered": "(Ditemukan dari  total _MAX_ data)",
                    "search": "Pencarian:",
                    "zeroRecords": "Tidak ada data yang dapat ditampilkan",
                    "processing":     "Memuat data...",
                },

                searchDelay: 500,
                processing: true,
                serverSide: true,
                ajax: {
                    // url: 'https://keenthemes.com/metronic/themes/themes/metronic/dist/preview/inc/api/datatables/demos/server.php',
                    url: config.url,
                    type: 'POST',
                    // data: {
                    //  // parameters for custom backend script demo
                    //  columnsDef: [
                    //      'RecordID', 'OrderID', 'Country', 'ShipCity', 'CompanyAgent',
                    //      'ShipDate', 'Status', 'Type', 'Actions',],
                    // },
                    data: config.data,
                },          

                //== Order settings
                order: [[config.index, config.sorting]],
                /*"aoColumnDefs": [
                    //{ "bSearchable": false, "aTargets": [ 0 ] }
                ],*/
                fnDrawCallback: function(oSettings)                
                {                    
                    // console.log(oSettings);
                    if (config.clickAble) {
                        $('thead').find('th').css({'text-align':'center'});
                        $("#"+config.el+" tbody").off('click');
                        if (config.multiple===false){
                            $('tbody').find('tr').each(function(i,v){
                                $('td:eq(0)',v).css({'text-align':'center'});
                                $(v).addClass('clickable');
                            })
                            $('.row_selected').removeClass('row_selected');
                            $("#"+config.el+" tr").css('cursor', 'pointer');
                            $("#"+config.el+" tbody tr").each(function(i, v) {
                                if (config.showCheckbox == true) {
                                    $('input[name=checkbox]',v).removeClass('d-none').addClass('d-block');
                                }
                                $(v).on('click', function() {
                                    if (oSettings.aoData.length > 0){
                                        $(v).addClass('row_selected');
                                        if ( $(this).hasClass('selected') ) {
                                            $(v).removeClass('selected');    
                                            $(v).removeAttr('checked'); 
                                            $('input[name=checkbox]',v).prop('checked',false);
                                            $('.disable').attr('disabled',true);
                                            $('.row_selected').removeClass('row_selected');
                                        }else {
                                            $(".checkbox").removeAttr('checked');
                                            $(".selected").removeClass('selected');
                                            $('#'+config.el+'.dataTable tbody tr.selected').removeClass('selected');
                                            $(v).addClass('selected');
                                            $('.row_selected').removeClass('row_selected');
                                            $(v).addClass('row_selected');
                                            $('input[name=checkbox]',v).prop('checked',true);
                                            $('.disable').attr('disabled',false);
                                        }  
                                    }
                                });
                            });
                        }else{
                            $('tbody').find('tr').each(function(i,v){
                                $(v).addClass('clickable');
                            })
                            var cnt = 0;
                            $("#"+config.el+" tr").css('cursor', 'pointer');
                            $("#"+config.el+" tbody tr").each(function(i, v){
                                if (config.showCheckbox == true) {
                                    $('input[name=checkbox]',v).removeClass('d-none').addClass('d-block');
                                }
                                $(v).on('click', function() {
                                    var run = config.callbackClick(this);
                                    if ( $(this).hasClass('selected') ) {
                                        --cnt;
                                        $(v).removeClass('selected');    
                                        $(v).removeAttr('checked'); 
                                        $('input[name=checkbox]',v).prop('checked',false);
                                        $(v).removeClass('row_selected');
                                    }else {
                                        ++cnt;
                                        $('input[name=checkbox]',v).prop('checked',true);
                                        $(v).addClass('selected');
                                        $(v).addClass('row_selected');
                                    }  

                                    if (cnt>0) {
                                        $('.disable').attr('disabled',false);
                                    }else{
                                        $('.disable').attr('disabled',true);
                                    }
                                });
                            });

                            $('.'+config.parentCheck).click(function(event){ 
                                if(this.checked) {
                                    $('.'+config.childCheck).each(function() {
                                        this.checked = true;       
                                        $("#"+config.el+" tbody tr").each(function(i, v){
                                            $(v).addClass('selected');
                                            $(v).addClass('row_selected');
                                        });
                                    });
                                    $('.'+config.parentCheck).addClass('selected');
                                    $('.disable').attr('disabled',false);
                                }else{
                                    $('.'+config.childCheck).each(function() { 
                                        this.checked = false; 
                                        $("#"+config.el+" tbody tr").each(function(i, v){
                                            $(v).removeClass('row_selected');
                                            $(v).removeClass('selected');    
                                            $(v).removeAttr('checked'); 
                                        });
                                    });        
                                    $('.disable').attr('disabled',true);
                                }
                            });

                            $('th').click(function(i,v){
                                if($(this).hasClass('sorting_disabled')){}else{
                                    $("#"+config.el+" tbody tr").each(function(i2, v2){
                                        $(v2).removeClass('row_selected');
                                        $(v2).removeClass('selected');    
                                        $(v2).removeAttr('checked'); 
                                    });
                                    $('.'+config.parentCheck).removeClass('selected');
                                    $('.'+config.parentCheck).prop('checked',false);
                                }
                            })   
                        }                    
                    }
                },
                fnRowCallback: function(row, data, index, rowIndex){
                    $('.disable').attr('disabled',true);
                },
                fnInitComplete: function(oSettings, data){
                },
                headerCallback: function(thead, data, start, end, display) {
                    if (config.checkboxAble) {
                        thead.getElementsByTagName('th')[0].innerHTML = '\
                            <label class="m-checkbox m-checkbox--single m-checkbox--solid m-checkbox--brand">\
                                <input type="checkbox" value="" class="m-group-checkable">\
                                <span></span>\
                            </label>';
                    }
                },

                // "ajax": {
                //     'url': config.url,
                //     'type': 'POST',
                //     'data': config.data
                // },
            };

            // var search_able=``;
            if (!config.searchAble) {
                xdefault.dom =  `<'row'<'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`;
            }
            if (config.scrollAble) {
                xdefault.scrollX= true;
                xdefault.scrollCollapse= true;
            }else{
                xdefault.responsive=true;
            }
            if (config.scrollYAble) {
                xdefault.scrollY= '50vh';
                xdefault.scrollCollapse= true;
                xdefault.paging= false;
            }else{
                xdefault.responsive=true;
            }
            // console.log(search_able);


            /*add input filter column*/
            // if (config.filterColumn.state) {
            //     $("#" + config.el+ ' tfoot').remove();
            //     $("#" + config.el).append('<tfoot>'+$("#" + config.el+' thead').html()+'</tfoot>');                                
            // }            

            var el = $("#" + config.el);
            if (! config.force) {
                var dt = $(el).DataTable($.extend(true, xdefault, config));                
            } else {
                var dt = $(el).KTDatatable(config);
            }
            //m_search
            $('.m_search').off('select2:select');
            $('.m_search').on('select2:select', function(e) {
                e.preventDefault();
                console.log('panggil')
                var table = config.el;
                var multiTable = false;
                if ($(e.target).data('idtable')) {
                    table = $(e.target).data('idtable');
                }
                //if has multiple datatable in one page and each page has filter select
                if ($(e.target).data('multitable')) {
                    multiTable = true;
                }

                if (multiTable) {
                    console.log('multi')
                    $('#'+table).DataTable().column($(this).data('col-index')).search($(this).val() ? $(this).val() : '', false, false).draw();
                }else{
                    var params=[];
                    $('.m_search').each(function() {
                        var i = $(this).data('col-index');
                        if (params[i]) {
                            params[i] += '|' + $(this).val();
                        }
                        else {
                            params[i] = $(this).val();
                        }
                        $('#'+table).DataTable().column(i).search($(this).val() ? $(this).val() : '', false, false);
                    });
                    $('#'+table).DataTable().table().draw();
                }

                // $('#'+table).DataTable().column($(this).data('col-index')).search($(this).val() ? $(this).val() : '', false, false);
                // $.each(params, function(i, val) {
                    // apply search params to datatable
                    // console.log(i+' : '+val);
                    
                    // $('#'+table).DataTable().column(i).search(val ? val : '', false, false);
                    // $('#'+config.el).DataTable().column(.).data();
                    // console.log($('#'+config.el).DataTable().column(1));
                // });
            });

            //checkbox checked all
            var dt = $('#'+config.el).DataTable().on('change', '.m-group-checkable', function() {
                // console.log('checkbox all');
                var set = $(this).closest('table').find('td:first-child .m-checkable');
                var checked = $(this).is(':checked');

                $(set).each(function() {
                    if (checked) {
                        $(this).prop('checked', true);
                        $(this).closest('tr').addClass('active');
                    }
                    else {
                        $(this).prop('checked', false);
                        $(this).closest('tr').removeClass('active');
                    }
                });
            });

            //searchbox
            $('.m_searchBox').off( 'keyup')
            $('.m_searchBox').on( 'keyup', function (currentTarget) {
                var table = config.el;
                if ($(currentTarget.target).data('idtable')) {
                    table = $(currentTarget.target).data('idtable');
                }
                console.log(table)
                $('#'+table).DataTable()
                    .search( this.value )
                    .draw();
            });

            //tabDetails
            // Add event listener for opening and closing details
            if (config.tabDetails) {
                $('#'+config.el+' tbody').off('click');
                $('#'+config.el+' tbody').on('click', 'td.details-control', function () {
                    HELPER.block(0);
                    var tr = $(this).closest('tr');
                    var row = $("#" + config.el).DataTable().row( tr );
                    // var xdata = $.parseJSON(atob($($(full[0])[2]).data('record')));
             
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        console.log('This row is already open - close it');
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        // Open this row
                        console.log('open this row');
                        row.child( format(row.data() )).show();
                        tr.addClass('shown');
                    }
                    HELPER.unblock(500);
                } );
            }

            // Sort by columns 1 and 2 and redraw
            /* table
                .order( [ 1, 'asc' ], [ 2, 'asc' ] )
                .draw();*/

            $(el).addClass('table-condensed').removeClass('table-striped').addClass('compact nowrap hover dt-head-left');
            return dt;
        },
        getRowData : function(config){
            var xdata = $.parseJSON(atob($($(config.data[0])[2]).data('record')));
            return xdata;
        },

        getRowDataMultiple : function(config){
            var xdata = $.parseJSON(atob($(config.data[0]).data('record')));
            return xdata;
        },

        getRecord : function(el){
            return JSON.parse(atob($($($(el).parents('tr').children('td')[0]).children('input')).data('record')));
        },

        getRecordChild : function(el){
            return JSON.parse(atob($($($(el).children('td')[0]).children('input')).data('record')));
        },

        toggleForm: function(config)
        {
            config = $.extend(true, {
                speed: 'fast',
                easing: 'swing',
                callback: function() {},
                tohide: 'table_data',
                toshow: 'form_data',
                animate: null,
                scrollTop: true
            }, config);

            if (config.animate!==null)
            {
                if (config.animate==='toogle')
                {
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function(index, valHide) {
                            $("." + valHide).fadeToggle(config.speed, function() {
                                if (Array.isArray(config.toshow)) {
                                    $.each(config.toshow, function(index, valShow) {
                                        $("." + valShow).fadeToggle(config.speed, config.callback)
                                    })
                                }else{
                                    $("." + config.toshow).fadeToggle(config.speed, config.callback)
                                }
                            });
                        })
                    }else{
                        $("." + config.tohide).fadeToggle(config.speed, function() {
                            $("." + config.toshow).fadeToggle(config.speed, config.callback)
                        });
                        
                    }
                }
                else if (config.animate==='slide')
                {
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function(index, valHide) {
                            $("." + valHide).slideUp(config.speed, function() {
                                if (Array.isArray(config.toshow)) {
                                    $.each(config.toshow, function(index, valShow) {
                                        $("." + valShow).slideDown(config.speed, config.callback)
                                    })
                                }else{
                                    $("." + config.toshow).slideDown(config.speed, config.callback)
                                }
                            });
                        })
                    }else{
                        $("." + config.tohide).slideUp(config.speed, function() {
                            $("." + config.toshow).slideDown(config.speed, config.callback)
                        });
                        
                    }
                }else{
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function(index, valHide) {
                            $("." + valHide).fadeOut(config.speed, function() {
                                if (Array.isArray(config.toshow)) {
                                    $.each(config.toshow, function(index, valShow) {
                                        $("." + valShow).fadeIn(config.speed, config.callback)
                                    })
                                }else{
                                    $("." + config.toshow).fadeIn(config.speed, config.callback)
                                }
                            });
                        })
                    }else{
                        $("." + config.tohide).fadeOut(config.speed, function() {
                            $("." + config.toshow).fadeIn(config.speed, config.callback)
                        });
                        
                    }
                }
            }
            else
            {
                if (Array.isArray(config.tohide)) {
                    $.each(config.tohide, function(index, valHide) {
                        $("." + valHide).fadeOut(config.speed, function() {
                            if (Array.isArray(config.toshow)) {
                                $.each(config.toshow, function(index, valShow) {
                                    $("." + valShow).fadeIn(config.speed, config.callback)
                                })
                            }else{
                                $("." + config.toshow).fadeIn(config.speed, config.callback)
                            }
                        });
                    })
                }else{
                    $("." + config.tohide).fadeOut(config.speed, function() {
                        $("." + config.toshow).fadeIn(config.speed, config.callback)
                    });
                    
                }
            }

            if (config.scrollTop) {
                $('html,body').animate({
                    scrollTop: 0 /*pos + (offeset ? offeset : 0)*/
                }, 'slow');
            }
        },

        refresh: function(config)
        {
            config = $.extend(true,{
                table:null
            },config);

            if (config.table !== null)
            {
                if(config.table.constructor === Object)
                {
                    $.each(config.table,function(i,v){
                        $("#"+v).dataTable().fnReloadAjax();
                    });
                }
                else if (config.table.constructor === Array)
                {
                    $.each(config.table,function(i,v){
                        $("#"+v).dataTable().fnReloadAjax();
                    });
                }
                else
                {
                    $("#"+config.table).dataTable().fnReloadAjax();
                }
            }
            $('.disable').attr('disabled',true);
        },

        back: function(config)
        {
            config = $.extend(true, {
                speed: 'fast',
                easing: 'swing',
                callback: function() {},
                tohide: 'form_data',
                toshow: 'table_data',
                animate: null,
                loadPage: true,
                table: null,
            }, config);

            $.when(function(){
                if (config.table !==null)
                {
                    if(config.table.constructor === Object)
                    {
                        $.each(config.table,function(i,v){
                            $("#"+v).dataTable().fnReloadAjax();
                        });
                    }
                    else if (config.table.constructor === Array)
                    {
                        $.each(config.table,function(i,v){
                            $("#"+v).dataTable().fnReloadAjax();
                        });
                    }
                    else
                    {
                        $("#"+config.table).dataTable().fnReloadAjax();
                    }
                }

                if (config.animate!==null)
                {
                    if (config.animate==='fade')
                    {
                        $("." + config.tohide).fadeOut(config.speed, function() {
                            $("." + config.toshow).fadeIn(config.speed, config.callback)
                        });
                    }
                    else if (config.animate==='toogle')
                    {
                        $("." + config.tohide).fadeToggle(config.speed, function() {
                            $("." + config.toshow).fadeToggle(config.speed, config.callback)
                        });
                    }
                    else if (config.animate==='slide')
                    {
                        $("." + config.tohide).slideUp(config.speed, function(){
                            $("." + config.toshow).slideDown(config.speed,config.callback);                
                        });
                    }
                    else{
                        $("." + config.tohide).fadeOut(config.speed, function() {
                            $("." + config.toshow).fadeIn(config.speed, config.callback)
                        });
                    }
                }
                else
                {
                    $("." + config.tohide).fadeOut(config.speed, function() {
                        $("." + config.toshow).fadeIn(config.speed, config.callback)
                    });
                }
            }()).done(function(){
                if (config.loadPage===true)
                {
                    $("[data-menuid='"+menuid+"']").trigger('click');
                }
            }());           
        },

        reloadPage: function()
        {
            $("[data-menuid='"+menuid+"']").trigger('click');
        },

        getActivePage: function()
        {
            return menuid;
        },

        save: function(config)
        {
            var xurl = null;
            if (config.addapi===true)
            {
                xurl = ($("[name=" + HELPER[config.fields][0] + "]").val() === "") ? HELPER[config.api].store : HELPER[config.api].update;
            }
            else
            {
                if (typeof HELPER.api != 'undefined') {
                    xurl = ($("[name=" + HELPER.fields[0] + "]").val() === "") ? HELPER.api.store : HELPER.api.update;
                }
            }
            config = $.extend(true, {
                form: null,
                confirm: false,
                // data: $('[name=' + config.form + ']').serialize(),
                data: $.extend($('[name=' + config.form + ']').serializeObject(),{
                    csrf_sms: null
                }),
                method: 'POST',
                fields: 'fields',
                api: 'api',
                addapi: false, 
                url  : xurl,
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                cache: false,
                contentType: 'application/x-www-form-urlencoded',
                // processData: false,
                success: function(response)
                {
                    HELPER.showMessage({
                        success: response.success,
                        message: response.message,
                        title: ((response.success) ? 'Sukses' : 'Gagal')
                    });
                    unblock(100);
                },
                error: function(response, status, errorname)
                {
                    HELPER.showMessage({
                        success: false,
                        title: errorname,
                        message: 'Sistem dalam perbaikan. Kami sarankan akses kembali secara berkala.'
                    });
                    unblock(100);
                },
                complete: function(response)
                {
                    var rsp = $.parseJSON(response.responseText);
                    config.callback(rsp.success,rsp.id,rsp.record,rsp.message,response);
                },
                callback: function(arg) {},
                oncancel : function(arg) {}
            }, config);

            var do_save = function(_config)
            {                
                loadBlock('Sedang menyimpan data...');
                $.ajax({
                    url: _config.url,
                    data: _config.data,
                    type: _config.method,
                    cache: _config.cache,
                    contentType: _config.contentType,
                    processData: _config.processData,
                    xhr: function() {
                        var myXhr = $.ajaxSettings.xhr();
                        return myXhr;
                    },
                    success: _config.success,
                    error: _config.error,
                    complete: _config.complete
                });
            }

            if (config.confirm)
            {
                Swal.fire({
                        title: 'Informasi',
                        text: "Anda yakin ingin menyimpan data?",
                        icon: 'info',
                        confirmButtonText: '<i class="fa fa-check"></i> Yes',
                        confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',
                        reverseButtons: true,
                        showCancelButton: true,
                        cancelButtonText: '<i class="fa fa-times"></i> No',
                        background: '#f5f5f5',
                        cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark',
                        customClass: {
                            title   : 'font-23',
                            content : 'font-15'
                        }
                    }).then(function(result) {
                        if (result.value) {
                            do_save(config);
                        }else{
                            config.oncancel(result)
                        }
                    });
            }
            else
            {
                do_save(config);
            }
        },

        destroy: function(config)
        {
            config = $.extend(true, {
                table: null,
                confirm: true,
                method: 'POST',
                api: 'api',                
                data: null,
                multiple: false,
                fields: 'fields',
                callback: function(arg) {}
            }, config);

            var do_destroy = function(_config, id)
            {
                loadBlock('Sedang menghapus data...');
                var dataSend = {};
                if (_config.data===null){
                    dataSend['id'] = id;
                }
                else
                {
                    dataSend['id'] = id;
                    $.each(_config.data, function(i, v) {
                        dataSend[i]=v;
                    });
                }
                $.ajax({
                    url: HELPER[config.api].destroy,
                    data: $.extend(dataSend,{}),
                    type: _config.method,
                    success: function(response)
                    {
                        HELPER.showMessage({
                            success: response.success,
                            message: response.message,
                            title: ((response.success) ? 'Sukses' : 'Gagal')
                        });
                        unblock(100);
                    },
                    error: function(response, status, errorname)
                    {
                        HELPER.showMessage({
                            success: false,
                            title: 'Failed to operate',
                            message: errorname,
                        });
                        unblock(100);
                    },
                    complete: function(response)
                    {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success,rsp.id,rsp.record,rsp.message);
                    },
                })
            }
            
            var do_destroy_multiple = function(_config, data)
            {
                var dataSend = {};
                $.each(data,function(i,v){
                    dataSend[i] = v;
                });
                loadBlock('Sedang menghapus data...');
                $.ajax({
                    url: config.url,
                    data: $.extend(dataSend,{}),
                    type: _config.method,
                    success: function(response)
                    {
                        HELPER.showMessage({
                            success: response.success,
                            message: response.message,
                            title: ((response.success) ? 'Sukses' : 'Gagal')
                        });
                        unblock(100);
                    },
                    error: function(response, status, errorname)
                    {
                        HELPER.showMessage({
                            success: false,
                            title: 'Failed to operate',
                            message: errorname,
                        });
                        unblock(100);
                    },
                    complete: function(response)
                    {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success,rsp.id,rsp.record,rsp.message);
                    },
                })
            }
            if (config.multiple===false)
            {
                var data = null;
                $("#" + config.table).find('input[name=checkbox]').each(function(key, value)
                {
                    if ($(value).is(":checked")) {
                        data = $.parseJSON(atob($(value).data('record')));
                    }
                });
                if (data !== null)
                {
                    var id = data[HELPER[config.fields][0]];
                    if (config.confirm)
                    {
                        Swal.fire({
                                title: 'Informasi',
                                text: "Anda yakin ingin menghapus data?",
                                icon: 'warning',
                                confirmButtonText: '<i class="fa fa-check"></i> Yes',
                                confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',

                                background: '#f5f5f5',
                                showCancelButton: true,
                                cancelButtonText: '<i class="fa fa-times"></i> No',
                                cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark'
                            }).then(function(result) {
                                if (result.value) {
                                    do_destroy(config, id);
                                }
                            });
                    }
                    else
                    {
                        do_destroy(config, id);
                    }
                }
                else
                {
                    HELPER.showMessage({
                        title: 'Information',
                        message: 'You have not selected any data in the table ...!',
                        image: './assets/img/information.png',
                        time: 2000
                    })
                }
            }
            else
            {
                var data = [];
                $("#" + config.table).find('input[name=checkbox]').each(function(key, value)
                {
                    if ($(value).is(":checked")) {
                        var cek   = $.parseJSON(atob($(value).data('record')));
                        data[key] = cek;
                    }
                });

                if (data.length>0)
                {
                    if (config.confirm)
                    {
                        Swal.fire({
                                title: 'Informasi',
                                text: "Anda yakin ingin menghapus data?",
                                icon: 'warning',
                                confirmButtonText: '<i class="fa fa-check"></i> Yes',
                                confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',

                                background: '#f5f5f5',
                                showCancelButton: true,
                                cancelButtonText: '<i class="fa fa-times"></i> No',
                                cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark'
                            }).then(function(result) {
                                if (result.value) {
                                    do_destroy_multiple(config, data);
                                }
                            });
                    }
                    else
                    {
                        do_destroy_multiple(config, data);
                    }
                }
                else
                {
                    HELPER.showMessage({
                        title: 'Information',
                        message: 'You have not selected any data in the table ...!',
                        image: './assets/img/information.png',
                        time: 2000
                    })
                }
            }
        },

        getDataFromTable: function(config)
        {
            config = $.extend(true, {
                table: null,
                multiple: false,
                callback: function(args){}
            }, config);
            var data = '';
            var multidata = [];

            $("#"+config.table).find('input[name=checkbox]').each(function(key, value) {
                if ($(value).is(":checked")) {
                    if(config.multiple){
                        multidata.push($.parseJSON(atob($(value).data('record'))));
                    }else{
                        data = $.parseJSON(atob($(value).data('record')));
                    }
                }
            });
            if(config.multiple){
                config.callback(multidata);
            }else{
                config.callback(data);
            }
        },

        saveMultiple: function(config)
        {
            config = $.extend(true, {
                url: null,
                table: null,
                confirm: true,
                method: 'POST',
                data: null,
                message: true,
                callback: function(arg) {},
                success: function(arg) {},
                error: function(arg) {},
                complete: function(arg) {},
                cache: false,
                contentType: false,
                processData: false,
                xhr: null,
            }, config);

            var sentData = function(_config, data)
            {
                var dataSend = {};
                var localdataSend = {};
                var xdataSend = {};

                if (config.data===null){
                    $.each(data.server,function(i,v){
                        dataSend[i] = v;
                    });
                    xdataSend = dataSend;
                }else{
                    $.each(data.server,function(i,v){
                        dataSend[i] = v;
                    });
                    $.each(data.local,function(i,v){
                        localdataSend[i] = v;
                    });
                    xdataSend['server'] = dataSend;
                    xdataSend['data'] = localdataSend;
                }

                loadBlock('');
                $.ajax({
                    url: config.url,
                    data: $.extend(xdataSend,{}),
                    type: _config.method,
                    cache: config.cache,
                    contentType: config.contentTypes,
                    processData: config.processDatas,
                    xhr: (config.xhr===null) ? function() {
                        var myXhr = $.ajaxSettings.xhr();
                        return myXhr;
                    } : config.xhr,
                    success: function(response)
                    {
                        if (config.message==false) {
                            config.success(response);
                        }else{
                            config.success(response);
                            HELPER.showMessage({
                                success: response.success,
                                message: response.message,
                                title: ((response.success) ? 'Success' : 'Failed')
                            });
                        }
                    },
                    error: function(response, status, errorname)
                    {
                        if (config.message==false) {
                            config.error(response, status, errorname);
                        }else{
                            config.error(response, status, errorname);
                            HELPER.showMessage({
                                success: false,
                                title: 'Failed to operate',
                                message: errorname,
                            });
                        }
                    },
                    complete: function(response)
                    {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success,rsp.id,rsp.record,rsp.message,rsp);
                        unblock(1000);
                    },
                });
            }

            var data = [];
            var xdata = [];
            $("#" + config.table).find('input[name=checkbox]').each(function(key, value)
            {
                if ($(value).is(":checked")) {
                    var cek = null;
                    if ($(value).val().length==32){
                        cek = $(value).val();
                    }else{
                        var cek   = $.parseJSON(atob($(value).data('record')));
                    }
                    data[key] = cek;
                }
                xdata['server'] = data;
                xdata['local']  = config.data;
            });
            if (xdata.server.length>0){
                if (config.confirm)
                {
                    Swal.fire({
                            title: 'Information',
                            text: "Are you sure you want to save the data?",
                            icon: 'info',
                            confirmButtonText: '<i class="fa fa-check"></i> Yes',
                            confirmButtonClass: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',

                            background: '#f5f5f5',
                            showCancelButton: true,
                            cancelButtonText: '<i class="fa fa-times"></i> No',
                            cancelButtonClass: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark'
                        }).then(function(result) {
                            if (result.value) {
                                sentData(config, xdata);
                            }
                        });
                }
                else
                {
                    sentData(config, xdata);
                }
            }
        },

        setRowDataTable: function(config)
        {
            HELPER.saveMultiple(config);
        },

        loadData: function(config) {
            config = $.extend(true, {
                debug: false,
                table: null,
                type: 'POST',
                url: null,
                server: false,
                data: null,
                fields: 'fields',
                loadToForm : true,
                multiple : false,
                before_load: function() {},
                after_load: function() {},
                callback: function(arg) {}
            }, config);
            config.before_load();
            loadBlock('Displaying the result ...');
            if (config.server===true)
            {
                var dataserver = [];
                $("#" + config.table).find('input[name=checkbox]').each(function(key, value)
                {
                    if ($(value).is(":checked")) {
                        dataserver          = $.parseJSON(atob($(value).data('record')));
                        dataserver['id']    = dataserver[HELPER.fields[0]];
                        dataserver['data']  = config.data;
                        $.ajax({
                            url: config.url,
                            data: dataserver,
                            type: config.type,
                            success: function(response)
                            {
                                var data = '';
                                if (response.constructor===Object)
                                {
                                    data = response;
                                }
                                else if (response.constructor===Array)
                                {
                                    data = response[0];
                                }

                                if (data !==null && config.loadToForm) 
                                {
                                    $.when(function(){
                                        $.each(data,function(i,v)
                                        {
                                            if ($("[name="+ i +"]").find("option:selected").length)
                                            {
                                                $('[name="'+ i +'"]').select2('val',data[v]);
                                            }
                                            else if ($("[name=" + i + "]").attr('type') == 'checkbox') 
                                            {
                                                $('[name="' + i + '"][value="' + v + '"]').prop('checked', true);
                                            }
                                            else if ($("[name=" + i + "]").attr('type') == 'radio')
                                            {
                                                $('[name="' + i + '"][value="' + v + '"]').prop('checked', true);
                                            }
                                            else if ($("[name='"+i+"']").attr('type') == 'file')
                                            {
                                                $("[name=" + i + "]").val("");
                                            }
                                            else
                                            {
                                                $("[name=" + i + "]").val(html_entity_decode(v))
                                            }
                                        })
                                        if (dataserver['data'] !==null) {
                                            $.each(dataserver['data'],function(i,v)
                                            {
                                                if ($("[name=" + i + "]").attr('type') == 'checkbox') 
                                                {
                                                    $('[name="' + i + '"][value="' + v + '"]').prop('checked', true);
                                                }
                                                else if ($("[name=" + i + "]").attr('type') == 'radio')
                                                {
                                                    $('[name="' + i + '"][value="' + v + '"]').prop('checked', true);
                                                }
                                                else
                                                {
                                                    $("[name=" + i + "]").val(html_entity_decode(v))
                                                }
                                            })
                                        }
                                        config.callback(data,dataserver);
                                        return data;
                                    }()).done(unblock(100))
                                }
                                else
                                {
                                    $.when(unblock(100)).then(function(){
                                        HELPER.showMessage({
                                            title: 'Information',
                                            message: 'No data selected on the table ...!',
                                            image: './assets/img/information.png',
                                            time: 2000
                                        })
                                    }());
                                }
                            }
                        });
                        if (config.debug){}
                    }
                });
            }
            else
            {
                var data = (config.multiple) ? [] : null;
                $("#" + config.table).find('input[name=checkbox]').each(function(key, value) {
                    if ($(value).is(":checked")) {
                        if (config.multiple) {
                            data.push($.parseJSON(atob($(value).data('record'))));
                        } else {
                            data = $.parseJSON(atob($(value).data('record')));                            
                        }
                        if (config.debug) {console.log(data)}
                    }
                });
                if (data !== null) {
                    $.when(function(){
                        if (config.loadToForm){                            
                            HELPER[config.fields].forEach(function(v, i, a) {
                                if ($("[name="+ v +"]").find("option:selected").length)
                                {
                                    if ($('[name="'+ v +'"]').hasClass('select2-hidden-accessible')) {
                                        // $('[name="'+ v +'"]').select2('val',data[v]);
                                        $('[name="'+ v +'"]').val(data[v]).trigger('change');
                                    } else {
                                        $('[name="'+ v +'"]').val(data[v]);
                                    }
                                }
                                else if ($("[name=" + v + "]").attr('type') == 'checkbox') 
                                {
                                    $('[name="' + v + '"][value="' + data[v] + '"]').prop('checked', true);
                                }
                                else if ($("[name=" + v + "]").attr('type') == 'radio') {
                                    $('[name="' + v + '"][value="' + data[v] + '"]').prop('checked', true);
                                } else {                                    
                                    $("[name=" + v + "]").val(html_entity_decode(data[v]))
                                }
                            });
                        }
                        config.callback(data);
                        return data;
                    }()).done(unblock(500));
                    
                } else {
                    $.when(unblock(500)).then(function(){
                        HELPER.showMessage({
                            title: 'Information',
                            message: 'No data selected on the table ...!',
                            image: './assets/img/information.png',
                            time: 2000
                        })
                    }());
                }
            }
            
        },

        createCombo: function (config) {
            config = $.extend(true, {
                el: null,
                valueField: null,
                valueGroup: null,
                valueAdd: null,
                selectedField: null,
                displayField: null,
                displayField2: null,
                displayField3: null,
                url: null,
                placeholder: '-Choose-',
                optionCustom: null,
                grouped: false,
                withNull: true,
                data: null,
                chosen: false,
                sync: true,
                disableField: null,
                dropdownParent: '',
                elClass: false,
                allowClear: true,
                isSelect2: true,
                callback: function () { }
            }, config);

            if (config.url !== null) {
                $.ajax({
                    url: config.url,
                    data: $.extend(config.data, {  }),
                    type: 'POST',
                    async: config.sync,
                    complete: function (response) {
                        var html = (config.withNull === true) ? "<option value>" + config.placeholder + "</option>" : "";
                        html += (config.optionCustom != null) ? "<option value='" + config.optionCustom.id + "'>" + config.optionCustom.name + "</option>" : "";
                        var data = $.parseJSON(response.responseText);
                        if (data.success) {
                            $.each(data.data, function (i, v) {
                                var selectedFix = '';
                                var disable_field = '';
                                if (config.disableField != null) {
                                    if (v[config.disableField]) {
                                        disable_field = 'disabled';
                                    }
                                }
                                var sarr = Array.isArray(config.selectedField);
                                if (sarr) {
                                    $.each(config.selectedField, function (isf, vsf) {
                                        if (vsf == v[config.valueField]) {
                                            selectedFix = 'selected';
                                        }
                                    })
                                } else {
                                    if (Number.isInteger(config.selectedField)) {
                                        if (config.selectedField == i) {
                                            selectedFix = 'selected';
                                            disable_field = '';
                                        }
                                    } else {
                                        if (config.selectedField == v[config.valueField]) {
                                            selectedFix = 'selected';
                                            disable_field = '';
                                        }
                                    }
                                }
                                if (config.grouped) {
                                    if (config.displayField3 != null) {
                                        html += "<option " + selectedFix + " value='" + v[config.valueField] + "' data-add='" + v[config.valueAdd] + "'  " + disable_field + " >" + v[config.displayField] + " - " + v[config.displayField2] + " ( " + v[config.displayField3] + " ) " + "</option>";
                                    } else {
                                        html += "<option " + selectedFix + " value='" + v[config.valueField] + "' data-add='" + v[config.valueAdd] + "'  " + disable_field + " >" + v[config.displayField] + " - " + v[config.displayField2] + "</option>";
                                    }
                                } else {
                                    var disable_field = '';
                                    if (config.disableField != null) {
                                        disable_field = 'disabled';
                                    }
                                    html += "<option " + selectedFix + " value='" + v[config.valueField] + "' data-add='" + v[config.valueAdd] + "' " + disable_field + " >" + v[config.displayField] + "</option>";
                                }
                            });
                            if (config.el.constructor === Array) {
                                $.each(config.el, function (i, v) {
                                    (config.elClass == true) ? $('.' + v).html(html) : $('#' + v).html(html);
                                    // $('#'+v).html(html);
                                })
                            } else {
                                (config.elClass == true) ? $('.' + config.el).html(html) : $('#' + config.el).html(html);
                                // $('#' + config.el).html(html);
                            }
                            if (config.isSelect2) {
                                if (config.chosen) {
                                    if (config.el.constructor === Array) {
                                        $.each(config.el, function (i, v) {
                                            (config.elClass == true) ? $('.' + v).addClass(v) : $('#' + v).addClass(v);
                                            // $('#'+v).addClass(v);
                                            $('.' + v).select2({
                                                allowClear: config.allowClear,
                                                dropdownAutoWidth: true,
                                                width: '100%',
                                                placeholder: config.placeholder,
                                                dropdownParent: config.dropdownParent,
                                            });
                                        })
                                    } else {
                                        (config.elClass == true) ? $('.' + config.el).addClass(config.el) : $('#' + config.el).addClass(config.el);
                                        // $('#' + config.el).addClass(config.el);
                                        $('.' + config.el).select2({
                                            allowClear: config.allowClear,
                                            dropdownAutoWidth: true,
                                            width: '100%',
                                            placeholder: config.placeholder,
                                            dropdownParent: config.dropdownParent,
                                        });
                                    }
                                } else {
                                    if (config.el.constructor === Array) {
                                        $.each(config.el, function (i, v) {
                                            (config.elClass == true) ? $('.' + v).addClass(v) : $('#' + v).addClass(v);
                                            // $('#'+v).addClass(v);
                                            $('.' + v).select2({
                                                allowClear: config.allowClear,
                                                dropdownAutoWidth: true,
                                                width: '100%',
                                                dropdownParent: config.dropdownParent,
                                            });
                                        })
                                    } else {
                                        (config.elClass == true) ? $('.' + config.el).addClass(config.el) : $('#' + config.el).addClass(config.el);
                                        // $('#' + config.el).addClass(config.el);
                                        $('.' + config.el).select2({
                                            allowClear: config.allowClear,
                                            dropdownAutoWidth: true,
                                            width: '100%',
                                            dropdownParent: config.dropdownParent,
                                        });
                                    }
                                }
                            }
                        }
                        config.callback(data);
                    }
                });
            }else {
                var response = { success: false, message: 'Url kosong' };
                config.callback(response);
            }
        },

        createComboAPI: function(config) {
            config = $.extend(true, {
                el: null,
                valueField: null,
                valueGroup: null,
                valueAdd: null,
                selectedField: null,
                displayField: null,
                displayField2: null,
                displayField3: null,
                url: null,
                placeholder: '-Choose-',
                optionCustom: null,
                grouped: false,
                withNull : true,
                data : null,
                chosen : false,
                sync: true,
                disableField: null,
                dropdownParent: '',
                elClass: false,
                callback: function() {}
            }, config);

            if (config.url !== null){
                $.ajax({
                    url: config.url,
                    data : $.extend(config.data,{}),
                    type:'POST',
                    async: config.sync,
                    complete: function(response) {
                        var html = (config.withNull === true) ? "<option value>"+config.placeholder+"</option>" : "";
                        html += (config.optionCustom != null) ? "<option value='"+config.optionCustom.id+"'>"+config.optionCustom.name+"</option>" : "";
                        var data = $.parseJSON(response.responseText);
                        if (data.status) {
                            $.each(data.results, function(i, v) {
                                var selectedFix = '';
                                var disable_field = '';
                                if (config.disableField!=null) {
                                    if (v[config.disableField]) {
                                        disable_field = 'disabled';
                                    }
                                }
                                var sarr = Array.isArray(config.selectedField);
                                if (sarr) {
                                    $.each(config.selectedField, function(isf, vsf) {
                                        if (vsf == v[config.valueField]) {
                                            selectedFix = 'selected';
                                        }
                                    })
                                }else{
                                    if (Number.isInteger(config.selectedField)) {
                                        if (config.selectedField == i) {
                                            selectedFix = 'selected';
                                            disable_field = '';
                                        }
                                    }else{
                                        if (config.selectedField == v[config.valueField]) {
                                            selectedFix = 'selected';
                                            disable_field = '';
                                        }
                                    }
                                }
                                if (config.grouped) {
                                    if (config.displayField3!=null){
                                        html += "<option "+selectedFix+" value='" + v[config.valueField] + "' data-add='"+v[config.valueAdd]+"'  "+disable_field+" >" + v[config.displayField] + " - " + v[config.displayField2] + " ( "+ v[config.displayField3] +" ) " + "</option>";
                                    }else{
                                        html += "<option "+selectedFix+" value='" + v[config.valueField] + "' data-add='"+v[config.valueAdd]+"'  "+disable_field+" >" + v[config.displayField] + " " + v[config.displayField2] + "</option>";
                                    }
                                } else {
                                    var disable_field = '';
                                    if (config.disableField!=null) {
                                        disable_field = 'disabled';
                                    }
                                    html += "<option "+selectedFix+" value='" + v[config.valueField] + "' data-add='"+v[config.valueAdd]+"' "+disable_field+" >" + v[config.displayField] + "</option>";
                                }
                            });
                            if (config.el.constructor === Array){
                                $.each(config.el,function(i,v){
                                    (config.elClass == true) ? $('.'+v).html(html) : $('#'+v).html(html);
                                    // $('#'+v).html(html);
                                })
                            }else{
                                (config.elClass == true) ? $('.'+config.el).html(html) : $('#'+config.el).html(html);
                                // $('#' + config.el).html(html);
                            }
                            if (config.chosen){
                                if (config.el.constructor === Array){
                                    $.each(config.el,function(i,v){
                                        (config.elClass == true) ? $('.'+v).addClass(v) : $('#'+v).addClass(v);
                                        // $('#'+v).addClass(v);
                                        $('.'+v).select2({
                                            allowClear: true,
                                            dropdownAutoWidth : true,
                                            width: '100%',
                                            placeholder: config.placeholder,
                                            dropdownParent: config.dropdownParent,
                                        });
                                    })
                                }else{
                                    (config.elClass == true) ? $('.'+config.el).addClass(config.el) : $('#'+config.el).addClass(config.el);
                                    // $('#' + config.el).addClass(config.el);
                                    $('.'+ config.el).select2({
                                        allowClear: true,
                                        dropdownAutoWidth : true,
                                        width: '100%',
                                        placeholder: config.placeholder,
                                        dropdownParent: config.dropdownParent,
                                    });
                                }
                            }else{
                                if (config.el.constructor === Array){
                                    $.each(config.el,function(i,v){
                                        (config.elClass == true) ? $('.'+v).addClass(v) : $('#'+v).addClass(v);
                                        // $('#'+v).addClass(v);
                                        $('.'+v).select2({
                                            allowClear: true,
                                            dropdownAutoWidth : true,
                                            width: '100%',
                                            dropdownParent: config.dropdownParent,
                                        });
                                    })
                                }else{
                                    (config.elClass == true) ? $('.'+config.el).addClass(config.el) : $('#'+config.el).addClass(config.el);
                                    // $('#' + config.el).addClass(config.el);
                                    $('.'+ config.el).select2({
                                        allowClear: true,
                                        dropdownAutoWidth : true,
                                        width: '100%',
                                        dropdownParent: config.dropdownParent,
                                    });
                                }
                            }
                        }
                        config.callback(data);
                    }
                });
            }
            else
            {
                var response = {success:false,message:'Url kosong'};
                config.callback(response);
            }
        },

        createGroupCombo: function(config) {
            config = $.extend(true, {
                el: null,
                valueField: null,
                valueGroup: null,
                displayField: null,
                url: null,
                grouped: false,
                withNull : true,
                data : null,
                chosen : false,
                callback: function() {}
            }, config);

            if (config.url !== null){
                $.ajax({
                    url: config.url,
                    data : $.extend(config.data,{
                        id: config.valueField,
                        id_group: config.valueGroup,
                    }),
                    type:'POST',
                    complete: function(response) {
                        var data = $.parseJSON(response.responseText);
                        var html = (config.withNull === true) ? "<option value>-Pilih-</option>" : "";
                        if (data.success) {
                            if (config.grouped) {
                                $.each(data.data,function(i,v){
                                    html +='<optgroup label="'+i+'" style="font-wight:bold;">';
                                        $.each(v,function(i2,v2){
                                            html += '<option value="'+v2[config.valueField]+'">'+v2[config.displayField]+'</option>';
                                        });
                                    html +='</optgroup>';
                                });
                            }else{

                            }

                            if (config.el.constructor === Array){
                                $.each(config.el,function(i,v){
                                    $('#'+v).html(html);
                                })
                            }else{
                                $('#' + config.el).html(html);
                            }

                            if (config.chosen){
                                if (config.el.constructor === Array){
                                    $.each(config.el,function(i,v){
                                        $('#'+v).addClass(v);
                                        $('.'+v).select2({
                                            allowClear: true,
                                            dropdownAutoWidth : true,
                                            width: 'auto',
                                            placeholder: "-Choose-",
                                        });
                                    })
                                }else{
                                    $('#' + config.el).addClass(config.el);
                                    $('.'+ config.el).select2({
                                        allowClear: true,
                                        dropdownAutoWidth : true,
                                        width: 'auto',
                                         placeholder: "-Choose-",
                                    });
                                }
                            }

                        }
                        config.callback(data);
                    }
                });
            }else{
                var response = {success:false,message:'Url kosong'};
                config.callback(response);
            }
        },

        createChangeCombo: function(config)
        {
            config = $.extend(true,{
                el:null,
                data:null,
                url:null,
                reset:null,
                callback: function() {}
            },config);

            $('#'+config.el).change(function(){
                var id = $(this).val();
                var data = {};
                if (config.reset!==null){
                    $('[name="'+config.reset+'"]').val("").select2("");
                    // $("[name="+config.reset+"]").select2().val("");
                }if (config.data===null){
                    data['id'] = id;
                }else{
                    data = config.data;
                    data['id'] = id;
                }
                $.ajax({
                    url: config.url,
                    data: data,
                    type: 'POST',
                    complete: function(response){
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success,id,rsp.data,rsp.total,response);
                    },
                    callback: function(arg){}
                });
            });
        },

        setChangeCombo: function(config)
        {
            config = $.extend(true,{
                el: null,
                data: null,
                valueField: null,
                valueAdd:null,
                displayField: null,
                displayField2: null,
                grouped : false,
                withNull : true,
                idMode : false,
                placeholder: '-Pilih-',
            },config);
            
            if(config.idMode === true)
            {
                var html = (config.withNull === true) ? "<option value>"+config.placeholder+"</option>" : "";
                $.each(config.data, function(i, v) {
                    var vAdd = '';
                    if (v[config.valueAdd]) {
                        vAdd = " data-add='" + v[config.valueAdd] + "'";
                    }
                    if (config.grouped) {
                        if (config.displayField3!=null)
                        {
                            html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField2] + " - " + v[config.displayField] + " ( "+ v[config.displayField3] +" ) " + "</option>";
                        }
                        else
                        {
                            html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField2] + " - " + v[config.displayField] + "</option>";
                        }
                    } else {
                        html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField] + "</option>";
                    }
                });
                $('#' + config.el).html(html);
            }
            else
            {
                var html = (config.withNull === true) ? "<option value>"+config.placeholder+"</option>" : "";
                $.each(config.data, function(i, v) {
                    var vAdd = '';
                    if (v[config.valueAdd]) {
                        vAdd = " data-add='" + v[config.valueAdd] + "'";
                    }
                    if (config.grouped) {
                        if (config.displayField3!=null)
                        {
                            html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField2] + " - " + v[config.displayField] + " ( "+ v[config.displayField3] +" ) " + "</option>";
                        }
                        else
                        {
                            html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField2] + " - " + v[config.displayField] + "</option>";
                        }
                    } else {
                        html += "<option value='" + v[config.valueField] + "' "+vAdd+">" + v[config.displayField] + "</option>";
                    }
                });
                $('#' + config.el).html(html);
            }
            // $('#'+config.el).select2({
            //     allowClear: true,
            //     dropdownAutoWidth : true,
            //     width: '100%',
            //     placeholder: "-Choose-",
            // });
        },

        ajaxCombo: function(config) {
            config = $.extend(true, {
	                el      : null,
	                limit   :30,
	                url     : null,
	                tempData: null,
	                data    : {},
	                placeholder : null,
	                displayField: null,
	                selected:null,
	                callback: function(res) {}
	            }, config);
	        var myQ = new Queue();

	        myQ.enqueue(function (next) {

		        $(config.el).select2({
		            ajax: {
		                url : config.url,
		                dataType : 'json',
		                type : 'post',
		                data: function (params) {
		                    // var search = null;
		                    // if (params.term==null && config.sea) {}
		                  return {
		                    q   : params.term, // search term
		                    page : params.page,
		                    limit : config.limit,
		                    fdata : config.data,
		                    selectedId: (config.selected != null ? config.selected.id : null)
		                  };
		                }, 
		                processResults: function (data, params) {
		                  params.page = params.page || 1;
		                  return {
		                    results: data.items,
		                    pagination: {
		                      more: (params.page * config.limit) < data.total_count
		                    }
		                  };
		                },
		                cache: true
		            },
		            placeholder: 'Ketik atau Pilih '+(config.placeholder?config.placeholder:'Data'),
		            minimumInputLength: 0,
		            templateSelection: function (data, container) {
		                $(data.element).attr('data-temp', data.saved);
		                $.each(config.tempData, function(i, v) {
		                    $(data.element).attr('data-'+v.key, v.val);                        
		                })
		                return data[config.displayField] || data.text;
		            }
		        });
	        	next()
	        }, 'pertama').enqueue(function (next) {
	        	if (config.selected) {
	        		var option = new Option(config.selected.name, config.selected.id, true, true);
				    $(config.el).append(option).trigger('change');
	        	}
	        	next()
	        }, 'kedua').dequeueAll()
        },

        ajax: function(config)
        {
            config = $.extend(true,{
                data: null,
                url: null,
                type: "POST",
                dataType: null,
                success: function(){},
                complete: function(){},
                error: function(){}
            },config);
            $.ajax({
                url: config.url,
                data: $.extend(config.data,{}),
                type: config.type,
                dataType: config.dataType,
                success: function(data){
                    config.success(data);
                },
                complete: function(response){
                    var rsp = $.parseJSON(response.responseText);
                    config.complete(rsp,response);
                },
                error: function(error){
                    config.error(error);
                },
            })
        },

        showMessage: function(config)
        {
            config = $.extend(true, {
                success: false,
                message: 'Sistem dalam perbaikan. Kami sarankan akses kembali secara berkala.',
                title: 'Gagal',
                time: 5000,
                sticky: false,
                allowOutsideClick: true,
                // image: ((config.success) ? './assets/img/success.png' : './assets/img/error.png'),
                callback: function() {},
            }, config);
            if (config.success == true)
            {
                Swal.fire({
                    title: (config.title=="Gagal")?"Sukses":config.title,
                    text: config.message,
                    icon: "success",
                    allowOutsideClick: config.allowOutsideClick,
                    background: '#f5f5f5',
                    customClass: {
                        title   : 'font-23',
                        content : 'font-15'
                    }
                }).then(function (result) {
                    config.callback(result);
                });
            }else{
                if(config.success == false){
                    Swal.fire({
                        title: config.title,
                        text: config.message,
                        icon: "error",
                        allowOutsideClick: config.allowOutsideClick,
                        background: '#f5f5f5',
                        customClass: {
                            title   : 'font-23',
                            content : 'font-15'
                        }
                    }).then(function (result) {
                        config.callback(result);
                    });
                }else{
                    Swal.fire({
                        title: config.title,
                        text: config.message,
                        icon: config.success,
                        allowOutsideClick: config.allowOutsideClick,
                        background: '#f5f5f5',
                        customClass: {
                            title   : 'font-23',
                            content : 'font-15'
                        }
                    }).then(function (result) {
                        config.callback(result);
                    });
                }
            }            

            // config.callback();
        },

        newHandleValidation: function (config) {
            
            config = $.extend(true, {
                el: null,
                setting: null,
                declarative: false,
                customPlugin: null,
                submit: true,
            }, config);

            if (config.el != null && (config.setting != null || config.declarative == true)) {

                var fields = [];

                $.each(config.setting, function (i, v) {

                    var temp_validators = [];
                    $.each(v.rule, function (ii, vv) {

                        var temp_val = {};

                        if (v.hasOwnProperty('maxlength') && v.hasOwnProperty('minlength')) {
                            temp_validators['stringLength'] = {
                                max: v.maxlength,
                                min: v.minlength
                            }
                        } else {
                            if (ii == 'maxlength') {
                                temp_validators['stringLength'] = {
                                    max: vv
                                }
                            }
                            if (ii == 'minlength') {
                                temp_validators['stringLength'] = {
                                    min: vv
                                }
                            }
                        }
                        if (ii == 'required' && vv == true) {
                            temp_validators['notEmpty'] = {}
                            $(v.selector).attr('required', true)
                            if ($(v.selector).parents('.form-group').children('label').children('span.required').length <= 0) {
                                $(v.selector).parents('.form-group').children('label').append('<span class="required" aria-required="true"> *</span>')

                            }
                        }else if (ii == 'readonly' && vv == true) {
                            temp_validators['notEmpty'] = {}
                            $(v.selector).attr('readonly', true)
                        }else if (ii == 'email' && vv == true) {
                            temp_validators['emailAddress'] = {}
                        }else if (ii == 'disabled' && vv == true) {
                            temp_validators['notEmpty'] = {}
                            $(v.selector).attr('disabled', true)
                        }else if (ii == 'max') {
                            temp_validators['lessThan'] = {
                                max: vv
                            }
                        }else if (ii == 'min') {
                            temp_validators['greaterThan'] = {
                                min: vv
                            }
                        }else if (ii == 'callback') {
                            temp_validators['callback'] = vv
                        }else if (ii == 'promise') {
                            temp_validators['promise'] = vv
                        }else{
                            temp_validators[ii] = vv
                        }

                    });

                    fields[v.name] = {
                        selector: v.selector,
                        validators: temp_validators
                    }

                });

                var pluginValidation = { //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                };

                if (config.submit) {
                    // Validate fields when clicking the Submit button
                    pluginValidation['submitButton'] = new FormValidation.plugins.SubmitButton()
                    // Submit the form when all fields are valid
                    pluginValidation['defaultSubmit'] = new FormValidation.plugins.DefaultSubmit()
                }

                if (config.declarative) {
                    pluginValidation['declarative'] = new FormValidation.plugins.Declarative({
                                                        html5Input: true,
                                                      });
                }
                if (config.customPlugin) {
                    if (Array.isArray(config.customPlugin)) {
                        $.each(config.customPlugin, function(i, v) {
                            if (v.hasOwnProperty('pluginName') && v.hasOwnProperty('pluginConfig')) {
                                pluginValidation[v.pluginName] = v.pluginConfig;
                            }
                        });
                    }else{
                        if (config.customPlugin.hasOwnProperty('pluginName') && config.customPlugin.hasOwnProperty('pluginConfig')) {
                            pluginValidation[config.customPlugin.pluginName] = config.customPlugin.pluginConfig;
                        }
                    }
                    
                }

                const fv = FormValidation.formValidation(
                            document.getElementById(config.el),
                            {
                                locale: 'id_ID',
                                localization: FormValidation.locales.id_ID,
                                fields: fields,
                                plugins: pluginValidation
                            }
                        );
                fv.on('core.field.invalid', function(e) {
                    $('#'+e).parent().find('em').html("<i class='fa fa-exclamation-triangle color-red2-light'></i>")
                });
                fv.on('core.field.valid', function(e) {
                    $('#'+e).parent().find('em').html("")
                });
                return fv;

            }else{
                return false;
            }

        },

        handleValidation: function(config){

            config = $.extend(true,{
                el: null,
                rules: null,
                alert: null,
            },config);

            $.each(config.rules, function(i,v){
                if (v.required && typeof(v.required) !== 'undefined') {
                    $(i).parents('.form-group').children('.col-form-label').append('<span class="required">* </span>')
                    $(i).attr('required', true);
                }
                if (v.maxlength && typeof(v.maxlength) !== 'undefined') {
                    $(i).attr('maxlength', v.maxlength);
                    $(i).maxlength({
                        warningClass: "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                        limitReachedClass: "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                        appendToParent: true,
                        threshold: 10,
                    });
                }
            });

            var form = $('#'+config.el);

            form.validate({
                ignore: ":hidden, .ignore",
                
                invalidHandler: function (event, validator) { //display error alert on form submit   
                    config.callback(false);
                },
                submitHandler: function (form) {
                    config.callback(true, form);
                }

            });

            return form;
        },

        setRequired: function(el)
        {
            $(el).each(function(i, v) {
                $("[name=" + v + "]").attr('required', true).parents('.form-group').children('label').append('<span class="required" aria-required="true"> *</span>')
            })
        },

        print: function(config)
        {
            config = $.extend(true,{
                el: 'bodylaporan',
                page: null,
                csslink: null,
                historyprint: null,
                callback: function(){}
            },config);

            var contents = (config.el.length > 32) ? config.el : $("#"+config.el).html();
            var frame1 = $('<iframe />');
            frame1[0].name = "frame1";
            frame1.css({ "position": "absolute", "top": "-1000000px" });
            $("body").append(frame1);
            var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
            frameDoc.document.open();
            frameDoc.document.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
            frameDoc.document.write('<html>');
            frameDoc.document.write('</head>');
            frameDoc.document.write('</body>');
            if (config.csslink!=null)
            {
                if (config.csslink.constructor === Array)
                {
                    $.each(config.csslink,function(i,v){
                        frameDoc.document.write('<link href="'+v+'" rel="stylesheet" type="text/css" />');
                    })
                }
                else
                {
                    frameDoc.document.write('<link href="'+config.csslink+'" rel="stylesheet" type="text/css" />');
                }
            }
            frameDoc.document.write(contents);
            frameDoc.document.write('</body></html>');
            frameDoc.document.close();
            if (config.historyprint!=null)
            {
                $.ajax({
                    url : config.historyprint,
                    success : function(response){},
                    complete: function(response)
                    {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success,id,rsp.data,rsp.total);
                    },
                    callback: function(arg){}
                });
            }
            setTimeout(function () {
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                frame1.remove();
            }, 300);
        },

        confirm: function(config)
        {
            config = $.extend(true,{
                title: 'Information',
                message: null,
                size: 'small',
                type: 'warning',
                confirmLabel: '<i class="fa fa-check"></i> Yes',
                confirmClassName: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',
                cancelLabel: '<i class="fa fa-times"></i> No',
                cancelClassName: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark',
                showLoaderOnConfirm: false,
                allowOutsideClick: true,
                callback: function(){}
            },config);
            Swal.fire({
                title: config.title,
                text: config.message,
                icon: config.type,
                confirmButtonText: config.confirmLabel,
                confirmButtonClass: config.confirmClassName,
                reverseButtons: true,
                showCancelButton: true,
                cancelButtonText: config.cancelLabel,
                cancelButtonClass: config.cancelClassName,
                background: '#f5f5f5',
                allowOutsideClick: config.allowOutsideClick,
                customClass: {
                    title   : 'font-23',
                    content : 'font-15'
                }
            }).then(function(result) {
                config.callback(result.value);
            });
        },

        prompt: function(config)
        {
            config = $.extend(true,{
                title: null,
                inputType: null,
                confirmLabel: '<i class="fa fa-check"></i> Yes',
                confirmClassName: 'button button-m shadow-small button-round-small font-14 bg-green2-dark',
                cancelLabel: '<i class="fa fa-times"></i> No',
                cancelClassName: 'button button-m shadow-small button-round-small font-14 bg-gray2-dark',
                inputOptions: null,
                html: '',
                size: null,
                type: 'info',
                message: null,
                callback: function(){}
            },config);

                Swal.fire({
                        title: (config.title!=null) ? config.title : 'Information' ,
                        input: config.inputType,
                        text: config.message,
                        html: config.html,
                        icon: config.type,
                        confirmButtonText: config.confirmLabel,
                        confirmButtonClass: config.confirmClassName,

                        background: '#f5f5f5',
                        reverseButtons: true,
                        showCancelButton: true,
                        cancelButtonText: config.cancelLabel,
                        cancelButtonClass: config.cancelClassName
                    }).then(function(result) {
                        config.callback(result);
                    });
        }, 

        toExcel: function(config)
        {
            config = $.extend(true,{
                el: null,
                title: null,
            },config);

            if (config.el.constructor===Array) {
                $.each(config.el,function(i,v){
                    if (i==0) {
                        tableToExcel(v,config.title);
                    }else{
                        tableToExcel(v,config.title+'-'+(i+2));
                    }
                });
            }else{
                tableToExcel(config.el,config.title);
            }
        },

        toWord: function(config)
        {
            config = $.extend(true,{
                el: null,
                title: null,
                paperSize: null,
                style: null,
                margin: null,
            },config);

            var html, link, blob, url, css, margin;
            margin = (config.margin!=null) ? config.margin : '1cm 1cm 1cm 1cm';
            css = (
                '<style>' +
                    '@page '+config.el+'{size: '+paperSize(config.paperSize)+'; margin: '+margin+';}' +
                    'div.'+config.el+' {page: '+config.el+';} '+config.style+
                '</style>'
            );
            
            html = window.$('#'+config.el).html();
            blob = new Blob(['\ufeff', css + html], { type: 'application/msword;charset=utf-8' });
            url = URL.createObjectURL(blob);
            link = document.createElement('A');
            link.href = url;
            // Set default file name. 
            // Word will append file extension - do not add an extension here.
            link.download = config.title;   
            document.body.appendChild(link);
            if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, config.title+'.doc'); // IE10-11
              else link.click();  
            document.body.removeChild(link);
        },

        initChart : function(config) {
            if (typeof(AmCharts) === 'undefined' || $('#'+config.container).length === 0) {
                return;
            }

            config = $.extend(true,config,{
                valueAxes : [{
                    "axisAlpha": 0,
                    "position": "left"
                }],
                categoryAxis : {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0
                },
                type : 'serial',
            })

            var chart = AmCharts.makeChart(config.container, {
                "type": config.type,
                "addClassNames": true,
                "theme": "light",
                "path": "../assets/global/plugins/amcharts/ammap/images/",
                "autoMargins": true,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 10,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },

                "dataProvider": config.dataProvider,
                "valueAxes": config.valueAxes,
                //"startDuration": 1,
                "graphs": config.graphs,
                "categoryField": config.categoryField,
                "categoryAxis": config.categoryAxis,
                "export": {
                    "enabled": true
                },
                legend: {
                    bulletType: "round",
                    equalWidths: false,
                    valueWidth: 120,
                    useGraphSettings: true,
                    color: "#6c7b88"
                }
            });
        },

        addText :function(elemento,valor)
        {
            var elemento_dom=document.getElementById(elemento);
            if(document.selection){
                elemento_dom.focus();
                sel=document.selection.createRange();
                sel.text=valor;
                return;
            }
            if(elemento_dom.selectionStart||elemento_dom.selectionStart=="0"){
                var t_start=elemento_dom.selectionStart;
                var t_end=elemento_dom.selectionEnd;
                var val_start=elemento_dom.value.substring(0,t_start);
                var val_end=elemento_dom.value.substring(t_end,elemento_dom.value.length);
                elemento_dom.value=val_start+valor+val_end;
            }else{
                elemento_dom.value+=valor;
            }
        },

        months: function (index, short = false, indo = 'en') {
            var month1 = {'en':['','January','February','March','April','May','June','July','August','September','October','November','December'],'in':['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']};
            var month2 = {'in':['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 'in':['','Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']};
            var month = '';
            if (short){month=month2[indo][index]}else{month=month1[indo][index]}
            // if (short){month=month2[index][indo]}else{month=month1[index][indo]}
            return month;
        },

        days: function (index, short = false) {
            var day1 = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var day2 = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
            var day = '';
            if (short){day=day2[index.getDay()]} else {day=day1[index.getDay()]}
            return day;
        },

        reset_format: function(_number){
            var number = numeral(_number.toString().replace(/,/g,''));
            return number.value();
        },

        number_format: function(_number){
            if(_number == null || isNaN(_number)){
                _number = 0;
            }
            
            var number = numeral(_number.toString().replace(/,/g,''));
            var num = number.format('0,0.00');
            return num;
        },

        toFixed: function (n, fixed) {
            return `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];
        },

        protect_email: function (user_email) {
            var avg, splitted, part1, part1_2, part2, part2_1, part3;
            splitted = user_email.split("@");
            part1 = splitted[0];
            avg   = part1.length / 2;
            length = part1.length;
            part1 = part1.substring(0, (part1.length - avg));
            part1_2 = "";
            for (var i = 0; i <= length - avg; i++) {
                part1_2 += "*";
            };
            part2 = splitted[1].split('.');
            part3 = part2.pop();
            part2 = part2.join('');
            avg   = part2.length / 2;
            length = part2.length;
            part2 = part2.substring(0, (part2.length - avg));
            part2_2 = "";
            for (var i = 0; i <= length - avg; i++) {
                part2_2 += "*";
            };
            return part1 + part1_2 + "@" + part2 + part2_2 + "." + part3;
        },

        colorIsDark: function(color) {

              // Check the format of the color, HEX or RGB?
              if (color.match(/^rgb/)) {

                // If HEX --> store the red, green, blue values in separate variables
                color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

                r = color[1];
                g = color[2];
                b = color[3];
              } 
              else {

                // If RGB --> Convert it to HEX: http://gist.github.com/983661
                color = +("0x" + color.slice(1).replace( 
                  color.length < 5 && /./g, '$&$&'
                )
                         );

                r = color >> 16;
                g = color >> 8 & 255;
                b = color & 255;
              }

              // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
              hsp = Math.sqrt(
                0.299 * (r * r) +
                0.587 * (g * g) +
                0.114 * (b * b)
              );

              // Using the HSP value, determine whether the color is light or dark
              if (hsp>127.5) {

                return false;
              } 
              else {

                return true;
              }
        },
        
        text_truncate: function(str, length=null, ending=null) {
            str=HELPER.nullConverter(str);
            if (length == null) {
                length = 100;
            }
            if (ending == null) {
                ending = '...';
            }
            if (str.length > length) {
                return str.substring(0, length - ending.length) + ending;
            } else {
                return str;
            }
        },

        arrayUnique: function(array) {
            var a = array.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        },

        setMaxLength: function(config)
        {
            config = $.extend(true,{
                el: null,
                modal: false,
                maxlength: null,
            },config);
            
            if (config.el !== null) {
                var append = false;
                if (config.modal) {
                    append = true;
                }
                if (config.el.constructor === Array){
                    $.each(config.el, function(i, v) {
                        if (config.maxlength !== null) {
                            $(v).attr('maxlength', config.maxlength);
                        }
                        $(v).maxlength({
                            warningClass: "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                            limitReachedClass: "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                            appendToParent: append,
                            threshold: 10,
                        });
                    });
                }else{
                    if (config.maxlength !== null) {
                        $(config.el).attr('maxlength', config.maxlength);
                    }
                    $(config.el).maxlength({
                        warningClass: "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                        limitReachedClass: "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                        appendToParent: append,
                        threshold: 10,
                    });
                }
            }
        },

        settingForm: function(config)
        {
            config = $.extend(true,{
                el: null,
                modal: false
            },config);
            
            if (config.el !== null) {
                var append = false;
                if (config.modal) {
                    append = true;
                }
                if (config.el.constructor === Array){
                    $.each(config.el, function(i, v) {
                        $(v).maxlength({
                            warningClass: "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                            limitReachedClass: "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                            appendToParent: append,
                            threshold: 10,
                        });
                    });
                }else{
                    $(config.el).maxlength({
                        warningClass: "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                        limitReachedClass: "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                        appendToParent: append,
                        threshold: 10,
                    });
                }
            }
        },

        initLoadMore: function(config) {
            config = $.extend(true, {
                el: window,
                perPage: 10,
                urlExist: null,
                dataExist: null,
                callbackExist: function (){},
                urlMore: null,
                dataMore: null,
                callbackMore: function (){},
                callbackEnd: function (){},
                callLoadMore: function (){},
                callBeforeLoad: function (){},
                callAfterLoad: function (){},
                cekLoadMore: function (){},
                countCek: function (){},
            }, config);

            var total_record_data = 0;
            var total_group_data = 0;

            if (config.urlExist !== null){
                $.ajax({
                    url: config.urlExist,
                    data : $.extend(config.dataExist,{}),
                    type:'POST',
                    complete: function(response) {
                        
                        var data = $.parseJSON(response.responseText);
                        var myQueue = new Queue();
                        myQueue.enqueue(function (next) {
                            if (data.hasOwnProperty('success')) {
                                total_group_data = 0;
                            }else{
                                total_group_data = data;
                            }
                            config.callbackExist(data);
                            config.callLoadMore()
                            next()
                        }, '1').enqueue(function (next) {
                            setTimeout(function () {
                                config.scrollCek(config.callLoadMore);
                            }, 300)
                            next();
                        }, '2').dequeueAll();
                    },
                    error: function () {
                        HELPER.unblock()
                        HELPER.showMessage()
                    }
                });
            }
            else
            {
                var response = {success:false,message:'Url kosong'};
                config.callback(response);
            }

            config.callLoadMore = function () {
                if (total_record_data <= total_group_data) {
                    var heightWindow = window.scrollY;
                    config.callBeforeLoad()
                    $.ajax({
                        url: config.urlMore,
                        data : $.extend(config.dataMore,{
                            start: total_record_data, 
                            limit: config.perPage
                        }),
                        type:'POST',
                        complete: function(responseMore) {
                            var dataMore = responseMore;
                            var myQueueMore = new Queue();
                            myQueueMore.enqueue(function (next) {
                                total_record_data += config.perPage;
                                next()
                            }, '1m').enqueue(function (next) {
                                config.callbackMore(dataMore);
                                if (total_record_data >= total_group_data) {
                                    config.callbackEnd(dataMore)
                                }
                                next();
                            }, '2m').enqueue(function (next) {
                                window.scrollTo(0, heightWindow)
                                config.callAfterLoad()
                                next()
                            }, '3m').dequeueAll();
                        },
                        error: function () {
                            HELPER.unblock()
                            HELPER.showMessage()
                        }
                    });
                }
            }
        },

        unsetArray: function(arr, item) {
            var index = arr.indexOf(item);
            if (index !== -1) arr.splice(index, 1);
            return arr;
        },

        populateForm: function (frm, data) {
            $.each(data, function (key, value) {
                var $ctrl = $('[name="' + key + '"]', frm);
                if ($ctrl.is('select')) {
                    if ($ctrl.data().hasOwnProperty('select2')) {
                        $ctrl.val(value).trigger('change');
                    }else{
                        $("option", $ctrl).each(function () {
                            if (this.value == value) {
                                this.selected = true;
                            }
                        });
                    }
                } else {
                    switch ($ctrl.attr("type")) {
                        case "text":
                        case "email":
                        case "number":
                        case "hidden":
                        case "textarea":
                        $ctrl.val(value);
                        break;
                        case "radio":
                        case "checkbox":
                        $ctrl.each(function () {
                            if ($(this).attr('value') == value) {
                                $(this).attr("checked", value);
                            }
                        });
                        break;
                    }
                }
            });
        },

        detailmodal: function (modal,data){
            $.each(data, function (key, value) {
                $('.detail-'+key).html(value);
            });
            $(modal).modal('show');
        },

        convertK: function(num, digits=1, lang="id") {
            var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: lang=="id" ? "rb" : "k" },
            { value: 1E6, symbol: lang=="id" ? "jt" : "M" },
            { value: 1E9, symbol: lang=="id" ? "M" : "G" },
            { value: 1E12, symbol: lang=="id" ? "T" : "T" },
            { value: 1E15, symbol: lang=="id" ? "P" : "P" },
            { value: 1E18, symbol: lang=="id" ? "E" : "E" }
            ];
            var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var i;
            for (i = si.length - 1; i > 0; i--) {
                if (num >= si[i].value) {
                    break;
                }
            }
            return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        },

        showProgress: function(config)
        {
            config = $.extend(true, {
                success: null,
                title: 'Information',
                message: 'Please wait...',
                time: 2000,
                progressBar: true,
                allowOutsideClick: true,
                callback: function() {},
            }, config);
            let timerInterval
            Swal.fire({
                icon: config.success,
                title: config.title,
                html: config.message,
                timer: config.time,
                timerProgressBar: config.progressBar,
                allowOutsideClick: config.allowOutsideClick,
                customClass: {
                    title   : 'font-23',
                    content : 'font-15'
                },
                onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const b = content.querySelector('b')
                            if (b) {
                                b.textContent = Swal.getTimerLeft()
                            }
                        }
                    }, 100)
                },
                onClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    config.callback(result);
                }
            })

        },

        ucwords: function(str=""){
            str = HELPER.nullConverter(str);
            str = str.toLowerCase();
            return str.replace(/(\b)([a-zA-Z])/g,
                function(firstLetter){
                    return   firstLetter.toUpperCase();
                });
        }
    }
}();

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

$.fn.randBetween = function (min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
};

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        // window.location.href = uri + base64(format(template, ctx))
        var dataFormat = uri + base64(format(template, ctx));
        var $a = $("<a>");
        $a.attr("href",dataFormat);
        $('body').append($a);
        $a.attr("download",name+'.xls');
        $a[0].click();
        $a.remove();
    }
})();

function paperSize(data_tipe)
{
    var tipe = data_tipe.toUpperCase();
    switch(tipe) {
        case 'A4' :     return '21cm 29.7cm';       break;
        case 'LETTER':  return '21.6cm 27.9cm';     break;
        case 'LEGAL' :  return '21.6cm 35.6cm';     break;
        case 'FOLIO' :  return '21.5cm 33.0cm';     break;
        case 'A0' : return '84.1cm 118.9cm';    break;
        case 'A1' : return '59.4cm 84.1cm';     break;
        case 'A2' : return '42.0cm 59.4cm';     break;
        case 'A3' : return '29.7cm 42.0cm';     break;
        case 'A4' : return '21.0cm 29.7cm';     break;
        case 'A5' : return '14.8cm 21.0cm';     break;
        case 'A6' : return '10.5cm 14.8cm';     break;
        case 'A7' : return '7.4cm 10.5cm';      break;
        case 'A8' : return '5.2cm 7.4cm';       break;
        case 'A9' : return '3.7cm 5.2cm';       break;
        case 'A10': return '2.6cm 3.7cm';       break;
        case 'B0' : return '100.0cm 141.4cm';   break;
        case 'B1' : return '70.7cm 100.0cm';    break;
        case 'B2' : return '50.0cm 70.7cm';     break;
        case 'B3' : return '35.3cm 50.0cm';     break;
        case 'B4' : return '25.0cm 35.3cm';     break;
        case 'B5' : return '17.6cm 25.0cm';     break;
        case 'B6' : return '12.5cm 17.6cm';     break;
        case 'B7' : return '8.8cm 12.5cm';      break;
        case 'B8' : return '6.2cm 8.8cm';       break;
        case 'B9' : return '4.4cm 6.2cm';       break;
        case 'B10' : return '3.1cm 4.4cm';      break;
    }
}


Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}
function Queue(){
    this.queue = [];
}

Queue.prototype = {
    constructor: Queue,
    enqueue: function (fn, queueName) {
        this.queue.push({
            name: queueName || 'global',
            fn: fn || function (next) {
                next()
            }
        });
        return this
    },
    dequeue: function (queueName) {
        var allFns = (!queueName) ? this.queue : this.queue.filter(function (current) {
            return (current.name === queueName)
        });
        var poppedFn = allFns.pop();
        if (poppedFn) poppedFn.fn.call(this);
        return this
    },
    dequeueAll: function (queueName) {
        var instance = this;
        var queue = this.queue;
        var allFns = (!queueName) ? this.queue : this.queue.filter(function (current) {
            return (current.name === queueName)
        });
        (function recursive(index) {
            var currentItem = allFns[index];
            if (!currentItem) return;
            currentItem.fn.call(instance, function () {
                queue.splice(queue.indexOf(currentItem), 1);
                recursive(index)
            })
        }(0));
        return this
    }
};

$.fn.extend({
    donetyping: function(callback,timeout){
        timeout = timeout || 1e3; // 1 second default timeout
        var timeoutReference,
            doneTyping = function(el){
                if (!timeoutReference) return;
                timeoutReference = null;
                callback.call(el);
            };
        return this.each(function(i,el){
            var $el = $(el);
            // Chrome Fix (Use keyup over keypress to detect backspace)
            // thank you @palerdot
            $el.off('keyup keypress paste blur change')
            $el.is(':input') && $el.on('keyup keypress paste',function(e){
                // This catches the backspace button in chrome, but also prevents
                // the event from triggering too preemptively. Without this line,
                // using tab/shift+tab will make the focused element fire the callback.
                if (e.type=='keyup' && e.keyCode!=8) return;
                
                // Check if timeout has been set. If it has, "reset" the clock and
                // start over again.
                if (timeoutReference) clearTimeout(timeoutReference);
                timeoutReference = setTimeout(function(){
                    // if we made it here, our timeout has elapsed. Fire the
                    // callback
                    doneTyping(el);
                }, timeout);
            }).on('blur',function(){
                // If we can, fire the event since we're leaving the field
                doneTyping(el);
            }).on('change', function(){
                /*if (timeoutReference) clearTimeout(timeoutReference);
                timeoutReference = setTimeout(function(){
                    doneTyping(el);
                }, timeout);*/
            });
        });
    }
});