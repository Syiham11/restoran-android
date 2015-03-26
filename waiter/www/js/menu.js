//id_paket|nama_paket|jumlah|harga|diskon
var $ = jQuery.noConflict();

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode != 45 && (charCode != 46 || $(this).val().indexOf('.') != -1) &&
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}



function set_meja(id_meja,status_pesanan,id_pesanan){
    localStorage.setItem('meja_aktif',id_meja);
    localStorage.setItem('status_pesanan',status_pesanan);
    localStorage.setItem('id_pesanan',id_pesanan);
    
    if(status_pesanan == 1 ){
        //lets load data from db to local storage
        //localStorage.setItem('status_pesanan','uye');
         $.ajax({
            type: 'GET',
            url: rootWebService + '/pesanan.php?cmd=showlist-by-id&id=' + id_pesanan ,
            async: false,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            dataType: 'json',
            success: function (data) {
                var dataItems = data.items;

                if (dataItems === '') {
                /*  b.id_paket
                    b.jumlah,
                    b.harga,
                    b.diskon,
                    c.nama as nama_item
                */        
                } else {
                    
                    //var pesanan_count = parseInt(localStorage.getItem('pesanan_count'), 10);
                    var pos = 0;
                    $.each(dataItems, function (index, loadData) {
                        var id_paket = loadData.id_paket;
                        var nama_paket  = loadData.nama_item;
                        var jumlah = loadData.jumlah;
                        var harga = loadData.harga;
                        var diskon = loadData.diskon;   
                        var status = loadData.status;
                        
                        var data_input = id_paket + '|' + nama_paket + '|' + jumlah + '|' + harga + '|' + diskon + '|' + status ;
                        localStorage.setItem('item_' + pos, data_input);
                        pos++;
                    });
                    
                    localStorage.setItem('pesanan_count',(pos));
                }
            },
            error: function () {
                $('#conn_failed').show();
            }

        });
        
        
    }
    
}

function get_meja_kosong()
{
    $.ajax({
        type: 'GET',
        url: rootWebService + '/meja.php?cmd=show-list-with-status',
        async: true,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (data) {
            var dataItems = data.items;

            if (dataItems === '') {

                //$('#data_not_found').show();

            } else {
                var start_col = '<div class="column">';
                var end_col = '</div>';                
                var int_col = 1;
                var html_meja = "";
                $.each(dataItems, function (index, loadData) {
                    
                    if(loadData.status !== '-'){
                        var col =   '<div class="one-third">' + 
                                    '    <a href="menu.html" onclick="set_meja(' + loadData.id + ',1,' + loadData.id_pesanan + ')"><img class="center-icon" src="img/meja_makan.jpg" alt="img"></a>' +
                                    '    <a href="menu.html" onclick="set_meja(' + loadData.id + ',1,' + loadData.id_pesanan + ')"><h5 class="center-text" style="color:red"><b>[ ' + loadData.nama.toUpperCase() +' ]</b></h5></a>' +                    
                                    '</div>';    
                    }else{
                        var col =   '<div class="one-third">' + 
                                '    <a href="menu.html" onclick="set_meja(' + loadData.id + ',0,0)"><img class="center-icon" src="img/meja_makan.jpg" alt="img"></a>' +
                                '    <a href="menu.html" onclick="set_meja(' + loadData.id + ',0,0)"><h5 class="center-text" style="color:green">' + loadData.nama +'</h5></a>' +                    
                                '</div>';
                    }
                    
                    //$('#pilih-meja').append(option);
                    if(int_col == 1){
                        html_meja += start_col;
                        html_meja += col;
                    }else if(int_col == 3){
                        html_meja += col;
                        html_meja += end_col;
                        int_col = 0;
                    }else{
                        html_meja += col;
                    }
                    
                    int_col++;
                    
                });
                
                $('#pilih-meja').html(html_meja);
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}

$(document).ready(function () {

    get_meja_kosong();
    var pesanan_count = localStorage.getItem('pesanan_count');
    var not_in = "0,";

    var meja = localStorage.getItem('meja_aktif');    
    
    if (pesanan_count > 0 || meja !== null) {
        /*
        var item_pesan = localStorage.getItem('item_' + i).split('|');
        var nama_item = item_pesan[1];
        var jumlah = parseInt(item_pesan[2], 10);
        var harga = parseInt(item_pesan[3], 10);
        var diskon = parseInt(item_pesan[4], 10);

        var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
        
        */
        var total = 0;
        for (i = 0; i < pesanan_count; i++) {
            var item_pesan = localStorage.getItem('item_' + i).split('|');
            var nama_item = item_pesan[1];
            var jumlah = parseInt(item_pesan[2], 10);
            var harga = parseInt(item_pesan[3], 10);
            var diskon = parseInt(item_pesan[4], 10);

            var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
            total += sub_total;
            not_in += item_pesan[0] + ',';
        }

        $('#total_harga').html('Total Harga: Rp ' + addCommas(total));
        $('#div-meja').hide();
        $('#table_data').show();
        
    } else {
        
        $('#total_harga').hide();
        $('#div-meja').show();
        $('#table_data').hide();
        
    }

    not_in = not_in.slice(0, -1);

    var status_pesanan = localStorage.getItem('status_pesanan');
    var id_pesanan = localStorage.getItem('id_pesanan');
    
    if(status_pesanan == 0){
        //pesanan baru
        $.ajax({
            type: 'GET',
            url: rootWebService + '/paket.php?cmd=showlistnothabis&not_in=' + not_in,
            async: true,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            dataType: 'json',
            success: function (data) {
                var dataItems = data.items;

                if (dataItems == '') {

                    $('#data_not_found').show();
                    $('#table_data').hide();


                } else {
                    $.each(dataItems, function (index, loadData) {
                        //item_1 => id_paket|nama_paket|jumlah|harga|diskon
                        var row =
                            '<tr style="padding:5px" id="row_' + loadData.id + '">' +
                            '   <td class="table-sub-title" style="text-align:center">' +
                            '       ' + loadData.nama + '<br>(Rp' + addCommas(loadData.harga) + ' -' + loadData.diskon + '%)' +
                            '   </td>' +
                            '   <td>' +
                            '       <input type="text" name="jumlah" id="jumlah_' + loadData.id + '" style="width:10px;margin-bottom:0px" onkeypress="return isNumberKey(event)" class="contactField" />' +
                            '   </td>' +
                            '       <td><a href="#" class="no-bottom demo-button button-minimal grey-minimal fullscreen-button" onclick="add_pesanan(\'' + loadData.id + '|' + loadData.nama + '|' + loadData.harga + '|' + loadData.diskon + '|new' + '\');return false">OK</a>' +
                            '   </td>' +
                            '</tr>';

                        $('#table_data').append(row);

                    });
                }
            },
            error: function () {
                $('#conn_failed').show();
            }

        });
    }else{
        //pesanan lama
        $('#btn_batal').show();
        
        $.ajax({
            type: 'GET',
            url: rootWebService + '/paket.php?cmd=showlistnothabis-editmode&id_pesanan=' + id_pesanan,
            async: true,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            dataType: 'json',
            success: function (data) {
                var dataItems = data.items;

                if (dataItems == '') {

                    $('#data_not_found').show();
                    $('#table_data').hide();


                } else {
                    $.each(dataItems, function (index, loadData) {
                        //item_1 => id_paket|nama_paket|jumlah|harga|diskon
                        var row =
                            '<tr style="padding:5px" id="row_' + loadData.id + '">' +
                            '   <td class="table-sub-title" style="text-align:center">' +
                            '       ' + loadData.nama + '<br>(Rp' + addCommas(loadData.harga) + ' -' + loadData.diskon + '%)' +
                            '   </td>' +
                            '   <td>' +
                            '       <input type="text" name="jumlah" id="jumlah_' + loadData.id + '" style="width:10px;margin-bottom:0px" onkeypress="return isNumberKey(event)" class="contactField" />' +
                            '   </td>' +
                            '       <td><a href="#" class="no-bottom demo-button button-minimal grey-minimal fullscreen-button" onclick="add_pesanan(\'' + loadData.id + '|' + loadData.nama + '|' + loadData.harga + '|' + loadData.diskon + '|new' +  '\');return false">OK</a>' +
                            '   </td>' +
                            '</tr>';

                        $('#table_data').append(row);

                    });
                }
            },
            error: function () {
                $('#conn_failed').show();
            }

        });
        
        
    }
    
    


});