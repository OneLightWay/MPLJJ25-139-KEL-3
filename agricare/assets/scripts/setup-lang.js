var DB_NK = null;
document.addEventListener('deviceready', init_lang, false);

function init_lang() {
    try {
        DB_NK = window.sqlitePlugin.openDatabase({
            name: 'nk.db',
            location: 'default',
        });
        setTimeout(function () {
            init_table_db()
        }, 300)
    } catch(e) {
        console.log(e);
    }
}

function init_table_db() {
    DB_NK.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS bhs_config (id, code, bhs_id, bhs_en)');
        tx.executeSql('SELECT count(*) AS mycount FROM bhs_config', [], function(tx, rs) {
            if (rs.rows.item(0).mycount <= 0) {
                init_new_lang()
            }else{
                init_new_lang(false)
            }
        }, function(tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function() {
        console.log('Populated database OK');
    });
}

function init_new_lang(is_lang=true) {
    HELPER.ajax({
        url: BASE_URL + 'Login/getAllLang',
        complete: function (res) {
            if (res.data) {
                var nameState = 'INSERT OR REPLACE INTO bhs_config VALUES (?,?,?,?)';
                var dataArr = [];
                $.each(res.data, function(i, v) {
                    var tempField = [v.bahasa_id, v.bahasa_label, v.bahasa_idn, v.bahasa_en];
                    dataArr.push([nameState, tempField])
                });
                DB_NK.sqlBatch(dataArr, function() {
                    console.log('Populated database OK');
                }, function(error) {
                    console.log('SQL batch ERROR: ' + error.message);
                });
            }
        }
    })
}

function setLangApp() {
    try {
        DB_NK.executeSql('SELECT * FROM bhs_config', [], function (rs) {
            for (var i = 0; i <= rs.rows.length; i++) {
                var dataLang = rs.rows.item(i)
                if (parseInt(HELPER.getItem('user_language')) == 0 || HELPER.getItem('user_language') == null) {
                    $('.bhsConf-' + dataLang.code).text(dataLang.bhs_id)
                } else {
                    $('.bhsConf-' + dataLang.code).text(dataLang.bhs_en)
                }
            }
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });
    } catch (e) {
        console.log(e);
    }
}