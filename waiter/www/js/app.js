/*
 * Please see the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// See app.initEvents() in init-app.js for e vent initialization.



var rootWebService = "http://localhost/restoran_webservice";

function myEventHandler() {
    "use strict";

    var ua = navigator.userAgent;
    var str;

    if (window.Cordova && dev.isDeviceReady.c_cordova_ready__) {
        str = "It worked! Cordova device ready detected at " + dev.isDeviceReady.c_cordova_ready__ + " milliseconds!";
    } else if (window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______) {
        str = "It worked! Intel XDK device ready detected at " + dev.isDeviceReady.d_xdk_ready______ + " milliseconds!";
    } else {
        str = "Bad device ready, or none available because we're running in a browser.";
    }

    alert(str);
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split(',');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}


function AksesMenu() {

    if (localStorage.getItem('status_login') !== null) {

        var level = localStorage.getItem('level');

        $('#menu-sidebar').each(function(){
            $(this).find('.menu-item').hide();
            
        });
        
        /*
        $('#dashboard').hide();
        $('#makanan').hide();
        $('#minuman').hide();
        $('#pesanan').hide();
        $('#member-laporan').hide();
        $('#stok').hide();

        $('#laporan').hide();
        $('#paket').hide();
        $('#region').hide();
        $('#meja').hide();
        $('#member').hide();
        $('#user').hide();
        $('#settings').hide();
        */
        
        $('#dashboard').show();   
        
        if (level === 'member') {
            $('#member-laporan').show();

        } else if (level === 'waiter') {
            $('#menu').show(); 
            $('#pesanan').show();
            $('#ganti-meja').show();
            $('#edit-pesanan').show();

        } else if (level === 'dapur') {

            $('#pesanan').show();
            $('#stok').show();

        } else if (level === 'kasir') {

            $('#pesanan').show();
            $('#member').show();

        } else if (level === 'admin') {

            $('#laporan').show();
            $('#paket').show();
            $('#region').show();
            $('#meja').show();
            $('#member').show();
            $('#user').show();
            $('#settings').show();
        }

    }
}


function cekLogin_index() {

    if (localStorage.getItem('status_login') !== null) {
        window.location = 'dashboard.html';
    }
}

function cekLogin() {

    AksesMenu();

    if (localStorage.getItem('status_login') === null) {
        window.location = 'index.html';
    }
}


function logout() {
    localStorage.clear();
    window.location = "index.html";
}

function dataSetup() {

    $.ajax({
        type: 'GET',
        url: rootWebService + '/settings.php?cmd=showlist',
        async: true,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (data) {
            var dataItems = data.items;

            if (dataItems !== '') {
                $.each(dataItems, function (index, loadData) {
                    localStorage.setItem(loadData.tipe, loadData.content_setting);
                });

            }
        },
        error: function () {
            //$('#conn_failed').show();
            localStorage.setItem('datasetup', 'error');
        }

    });
}





function add_pesanan(data_paket) {
    //item_1 => id_paket|nama_paket|harga|diskon|
    
    var pesanan_count = parseInt(localStorage.getItem('pesanan_count'), 10);
    
    var data = data_paket.split('|');

    var id_paket = data[0];
    var nama_paket = data[1];
    var harga = data[2];
    var diskon = data[3];
    var jumlah = $('#jumlah_' + id_paket).val();
    var status = data[4];

    if (jumlah.length > 0) {
        //item_1 => id_paket|nama_paket|jumlah|harga|diskon
        var data_input = id_paket + '|' + nama_paket + '|' + jumlah + '|' + harga + '|' + diskon + '|' + status;

        localStorage.setItem('item_' + pesanan_count, data_input);
        pesanan_count += 1;
        localStorage.setItem('pesanan_count', pesanan_count);


        var tr = $('#row_' + id_paket);
        tr.css("background-color", "#FF3700");
        tr.fadeOut(400, function () {
            tr.remove();
        });
        return false;
    }

}

function del_pesanan(data_item) {

    var isi_item = localStorage.getItem(data_item).split('|');
    
    //localStorage.setItem('ini_adalah_isi_item_5',isi_item[5]);
    if(isi_item[5] !== 'new'){
        var id_pesanan = localStorage.getItem('id_pesanan');
        var id_paket = isi_item[0];
        $.ajax({
            type: 'GET',
            url: rootWebService + '/pesanan.php?cmd=delete-from-edit&id_pesanan=' + id_pesanan + '&id_paket=' + id_paket ,
            async: false,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function () {

            }

        });
    }
    
    
    var pesanan_count = parseInt(localStorage.getItem('pesanan_count'), 10);
    var item = data_item.split('_');
    var posisi = item[1];
    
    
    if(parseInt(posisi) < parseInt(pesanan_count - 1)){
        for(var i = parseInt(posisi,10); i < parseInt(pesanan_count,10) - 1;i++)
        {
            if(localStorage.getItem('item_' + (i + 1)) !== null){
                var data_string = localStorage.getItem('item_' + ( i + 1 ));
                localStorage.setItem('item_' + i,data_string);        
            }
        }
        
        localStorage.removeItem('item_' + (pesanan_count - 1));
        pesanan_count -= 1;
        localStorage.setItem('pesanan_count',pesanan_count);
        
    }else{
        
        localStorage.removeItem(data_item);
        pesanan_count -= 1;
        localStorage.setItem('pesanan_count',pesanan_count);
        
    }
    
     window.location = 'pesanan.html';
 
}

function pesanan_batal(){
    localStorage.removeItem('meja_aktif');
    localStorage.removeItem('status_pesanan');
    localStorage.removeItem('id_pesanan'); 
    
    window.location = "menu.html";
    var pesanan_count = parseInt(localStorage.getItem('pesanan_count'), 10);
    
    for(var i = 0; i < pesanan_count;i++){
        localStorage.removeItem('item_' + i);
    }
    
    localStorage.setItem('pesanan_count',0);
    
    
}
// ...additional event handlers here...