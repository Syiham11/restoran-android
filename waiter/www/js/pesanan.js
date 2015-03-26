var $ = jQuery.noConflict();

function update(id, status) {

    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=update-status&id=' + id + '&status=' + status,
        async: true,
        success: function (data) {
            window.location = "pesanan.html";
            //$('#nama').attr('value', data.nama);
            //$('select[name="status"]').find('option[value="' + data.status + '"]').attr("selected", true);
            //$('#SubmitButton').attr('onclick', 'act_update(' + id + ');return false');
        },
        error: function () {

        }

    });
}

function act_bayar(id) {

    //jika sisa deposit UNLIMITED maka lanjut, jika tidak maka error!
    var id_card = $('#id-card-cari').val();
    var jumlah_harga_pesanan = $('#jumlah-harga-pesanan').val();
    var nilai_bayar = $('#text-nilai-bayar').val();

    $('#nilai-bayar-tidak-cukup').hide();

    var url_link;

    if (parseInt(nilai_bayar, 10) < parseInt(jumlah_harga_pesanan, 10) || jQuery.trim(nilai_bayar).length === 0) {
        $('#nilai-bayar-tidak-cukup').show();
        return;
    }

    if (id_card !== 'guest') {

        url_link = rootWebService + '/pesanan.php?cmd=update-status&id=' + id + '&password=' + jQuery.trim(id_card) + '&status=selesai';

    } else {

        url_link = rootWebService + '/pesanan.php?cmd=update-status&id=' + id + '&status=selesai';

    }

    //return;
    $.ajax({
        type: 'GET',
        url: url_link,
        async: true,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (response) {

            //window.location = "pesanan.html";
            $('#warning-msg').hide();
            $('#text-cari').hide();
            $('#text-saldo').hide();
            $('#nilai-bayar').hide();
            
            var bayar = $('#text-nilai-bayar').val();
            var kembalian = parseInt(bayar,10) - parseInt(jumlah_harga_pesanan,10);

            var row =
                '<tr>' +
                '   <td style="text-align:right" colspan="4">Bayar</td>' +
                '   <td style="text-align:left">Rp ' + addCommas(bayar) + '</td>' +
                '</tr>';
            
            row +=
                '<tr>' +
                '   <td style="text-align:right" colspan="4">Kembalian</td>' +
                '   <td style="text-align:left">Rp ' + addCommas(kembalian) + '</td>' +
                '</tr>';
            
            $('#table_bayar').append(row);
            $('#link_bayar').attr('onclick','window.location = "pesanan.html";return false');
            $('#link_bayar').html('OK');


        },
        error: function () {
            $('#conn_failed').show();
        }
    });


}

function cek_deposit() {

    //jika guest, maka UNLIMITED jika tidak maka cari datanya

    var id_card = $('#id-card-cari').val();
    $('#text-nilai-bayar').val(0);
    $('#id-card-not-found').hide();
    //showlist-by-password
    if (id_card === 'guest') {
        $('#text-saldo').show();
        $('#text-saldo').html('Jumlah Depostit terakhir: UNLIMITED');
        //$('#text-nilai-bayar').val(0);
        document.getElementById("text-nilai-bayar").readOnly = false;
        return;
    }

    $('#data_not_found').hide();
    $('#conn_failed').hide();

    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=showlist-by-password&password=' + id_card,
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

                $('#text-saldo').show();
                $('#text-saldo').html('Jumlah Depostit terakhir: Rp 0');
                $('#id-card-not-found').show();
                document.getElementById("text-nilai-bayar").readOnly = true;

            } else {

                $('#text-saldo').show();

                $.each(dataItems, function (index, loadData) {
                    $('#text-saldo').html('Jumlah Depostit terakhir: Rp ' + addCommas(loadData.sisa_deposit));

                    var jumlah_harga_pesanan = $('#jumlah-harga-pesanan').val();
                    if (parseInt(loadData.sisa_deposit, 10) > parseInt(jumlah_harga_pesanan, 10)) {
                        $('#text-nilai-bayar').val(jumlah_harga_pesanan);
                    } else {
                        $('#text-nilai-bayar').val(0);
                    }
                    document.getElementById("text-nilai-bayar").readOnly = true;
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });

}

function show_FormBayar(id) {

    //window.location = "dashboard.html";
    $('#btn_bayar').show();
    $('#table_bayar').show();
    $('#table_data').hide();
    $('#nilai-bayar').show();

    $('#link_bayar').attr('onclick', 'act_bayar(' + id + ')');


    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=showlist-by-id&id=' + id,
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

                $('#data_not_found').show();


            } else {

                $('#table_bayar').show();
                $('#text-cari').show();

                var total_bayar = 0;

                $.each(dataItems, function (index, loadData) {
                    //nama_item,jumlah,harga,diskon
                    var jumlah = loadData.jumlah;
                    var harga = loadData.harga;
                    var diskon = loadData.diskon;

                    var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
                    total_bayar += sub_total;

                    var row =
                        '<tr>' +
                        '   <td style="text-align:center">' + loadData.nama_item + '</td>' +
                        '   <td style="text-align:left">' + loadData.jumlah + '</td>' +
                        '   <td style="text-align:left">' + loadData.harga + '</td>' +
                        '   <td style="text-align:left">' + loadData.diskon + '</td>' +
                        '   <td style="text-align:left">Rp ' + addCommas(sub_total) + '</td>' +
                        '</tr>';


                    $('#table_bayar').append(row);

                });

                var row_total =
                    '<tr>' +
                    '   <td style="text-align:right" colspan="4">Total</td>' +
                    '   <td style="text-align:left">Rp ' + addCommas(total_bayar) + '</td>' +
                    '</tr>';

                $('#table_bayar').append(row_total);
                $('#jumlah-harga-pesanan').val(total_bayar);


            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}



function pesanan2server() {
    //pertama kirim header

    var last_id = 0;    
    var id_meja = localStorage.getItem('meja_aktif');
    var status_pesanan = localStorage.getItem('status_pesanan');
    var id_pesanan = localStorage.getItem('id_pesanan');
    //header
    
    if(status_pesanan == 1){
        //jika edit
        last_id = id_pesanan;
        localStorage.removeItem('meja_aktif');
        localStorage.removeItem('status_pesanan');
        localStorage.removeItem('id_pesanan'); 
        
    }else{
        $.ajax({
            type: 'GET',
            url: rootWebService + '/pesanan.php?cmd=insert&id_meja=' + id_meja,
            async: false,
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            dataType: 'json',
            success: function (response) {
                last_id = response.last_id; 
                //localStorage.removeItem('meja_aktif');
                localStorage.removeItem('meja_aktif');
                localStorage.removeItem('status_pesanan');
                localStorage.removeItem('id_pesanan'); 
            },
            error: function () {
                $('#conn_failed').show();
            }

        });
    }
    


    if (last_id != 0) {
        //sekarang masukin pesanan_details
        var pesanan_count = localStorage.getItem('pesanan_count');
        for (var i = 0; i < pesanan_count; i++) {
            //item_1 => id_paket|nama_paket|jumlah|harga|diskon
            var item = localStorage.getItem('item_' + i).split('|');
            var id_paket = item[0];
            var jumlah = item[2];
            var harga = item[3];
            var diskon = item[4];
            var status = item[5];
            var datastring =
                'id_pesanan=' + last_id +
                '&id_paket=' + id_paket +
                '&jumlah=' + jumlah +
                '&harga=' + harga +
                '&diskon=' + diskon;

            if(status === 'new'){
                $.ajax({
                    type: 'GET',
                    url: rootWebService + '/pesanan.php?cmd=insert-detail',
                    dataType: 'json',
                    data: datastring,
                    async: false,
                    success: function (response) {
                        //for (var i = 0; i < pesanan_count; i++) {
                        //    localStorage.removeItem('item_' + i);
                        //}
                        //localStorage.setItem('pesanan_count', 0);
                        //window.location = "pesanan.html";
                    },
                    error: function () {

                    }
                });    
            }else{
                //jika bukan baru maka 
            }
        }

        update(last_id,'pending');
        
        for (var i = 0; i < pesanan_count; i++) {
            localStorage.removeItem('item_' + i);
        }
       
        localStorage.setItem('pesanan_count', 0);
        window.location = "pesanan.html";
        
    }

}

//localstorage edit
function edit_pesanan(id){
    var item_pesan = localStorage.getItem('item_' + id).split('|');
    var id_paket = item_pesan[0];
    var nama_item = item_pesan[1];
    var jumlah = $('#jumlah_' + id).val();
    var harga = parseInt(item_pesan[3], 10);
    var diskon = parseInt(item_pesan[4], 10);
    var status = item_pesan[5]; 

    var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
    $('#subtotal_' + id).html('Rp ' + addCommas(sub_total));
    
    var data_input = id_paket + '|' + nama_item + '|' + jumlah + '|' + harga + '|' + diskon + '|' + status;

    localStorage.setItem('item_' + id, data_input);

    if(status === 'pending'){
        var id_pesanan = localStorage.getItem('id_pesanan');
        $.ajax({
            type: 'GET',
            url: rootWebService + '/pesanan.php?cmd=update-jumlah&id_pesanan=' + id_pesanan + '&jumlah=' + jumlah + '&id_paket=' + id_paket,
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
                $('#conn_failed').show();
            }

        });
    }
    
    
    //getPesananFromLocalStorage();
    //window.location = "pesanan.html";
    var pesanan_count = localStorage.getItem('pesanan_count');
    var total = 0;
    for (var i = 0; i < parseInt(pesanan_count, 10); i++) {
        item_pesan = localStorage.getItem('item_' + i).split('|');        
        id_paket = item_pesan[0];
        nama_item = item_pesan[1];
        jumlah = item_pesan[2];
        harga = parseInt(item_pesan[3], 10);
        diskon = parseInt(item_pesan[4], 10);

        sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
        total += sub_total;
    }
    $('#total').html('Rp ' + addCommas(total));
}

function getPesananFromLocalStorage() {
    var pesanan_count = localStorage.getItem('pesanan_count');
    //semua menggunakan localStorage
    /*
            ex struktur pesanan
            item_1 => id_paket|nama_paket|jumlah|harga|diskon
        
        */

    if (pesanan_count > 0) {
        $('#table_data').show();
    } else {
        $('#data_not_found').show();
        $('#btn_kirimdata').hide();
        $('#meja_stuff').hide();
    }

    var tbl_header =
        '<tr>' +
        '   <th class="even">Item</th>' +
        '   <th class="even">Jumlah</th>' +
        '   <th class="even">Sub Total (+diskon)</th>' +
        '<th class="even">#</th></tr>';

    $('#table_data').append(tbl_header);

    var total = 0;
    var tbl_row = "";
    for (i = 0; i < parseInt(pesanan_count, 10); i++) {

        var item_pesan = localStorage.getItem('item_' + i).split('|');
        //var id_paket = item_pesan[0];
        var nama_item = item_pesan[1];
        var jumlah = parseInt(item_pesan[2], 10);
        var harga = parseInt(item_pesan[3], 10);
        var diskon = parseInt(item_pesan[4], 10);
        var status = item_pesan[5];

        var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
        total += sub_total;

        if(status === 'new'){
            tbl_row =
                '<tr id="row_' + i + '">' +
                '   <td style="text-align:left">' + nama_item + '</td>' +
                '   <td style="text-align:center"><input type="text" style="width:10px;margin-bottom:0px" class="contactField" id="jumlah_' + i + '"value="' + jumlah +'" onkeyup="edit_pesanan(' + i +');" /></td>' +
                '   <td style="text-align:left" id="subtotal_' + i + '">Rp ' + addCommas(sub_total) + '</td>' +
                '   <td><a href="#" onclick="del_pesanan(\'item_' + i + '\');return false">Hapus</a></td>' +
                '</tr>';    
        }else if(status === 'pending'){
            tbl_row =
                '<tr id="row_' + i + '">' +
                '   <td style="text-align:left">' + nama_item + '</td>' +
                '   <td style="text-align:center"><input type="text" style="width:10px;margin-bottom:0px" class="contactField" id="jumlah_' + i + '"value="' + jumlah +'" onkeyup="edit_pesanan(' + i +');" /></td>' +
                '   <td style="text-align:left" id="subtotal_' + i + '">Rp ' + addCommas(sub_total) + '</td>' +
                '   <td><a href="#" onclick="del_pesanan(\'item_' + i + '\');return false">Hapus</a></td>' +
                '</tr>';  
        }else{
            //menu selesai atau dalam proses
            tbl_row =
                '<tr id="row_' + i + '">' +
                '   <td style="text-align:left">' + nama_item + '</td>' +
                '   <td style="text-align:center">' + jumlah + '</td>' +
                '   <td style="text-align:left" id="subtotal_' + i + '">Rp ' + addCommas(sub_total) + '</td>' +
                '   <td>' + status + '</td>' +
                '</tr>';
        }
        
        
        if (i == (pesanan_count - 1)) {

            $('#table_data').append(tbl_row);

            var tbl_footer =
                '<tr>' +
                '   <td colspan ="2" style="text-align:right">Total</td>' +
                '   <td colspan ="2" style="text-align:left" id="total">Rp ' + addCommas(total) + '</td>' +
                '</tr>';
            $('#table_data').append(tbl_footer);
        } else {
        
            $('#table_data').append(tbl_row);
        }
    }
}

function getPesananFromDB(level) {
    //ngambil dari database

    $('#table_data').empty();
    //$('#btn_tambah').hide();
    $('#data_not_found').hide();
    $('#btn_kirimdata').hide();
    $('#meja_stuff').hide();

    //var level = localStorage.getItem('level');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=showlist&level=' + level,
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

                $('#table_data').show();

                var tbl_header;
                if (level === 'dapur') {

                    tbl_header =
                        '<tr>' +
                        '   <th class="even">Meja</th>' +
                        '   <th class="even">Item</th>' +
                        '   <th class="even">Jumlah</th>' +
                        '   <th class="even">#</th>' +
                        '</tr>';

                } else if (level === 'kasir') {

                    tbl_header =
                        '<tr>' +
                        '   <th class="even">Meja</th>' +
                        '   <th class="even">Item</th>' +
                        '   <th class="even">Harga</th>' +
                        '   <th class="even">#</th>' +
                        '</tr>';

                }


                var curr_id = 0;
                var row;
                var total_bayar = 0;

                $.each(dataItems, function (index, loadData) {

                    var jumlah = loadData.jumlah;
                    var harga = loadData.harga;
                    var diskon = loadData.diskon;
                    var status_pesanan = loadData.status_pesanan;

                    var sub_total = (jumlah * harga) - ((jumlah * harga) * (diskon / 100));
                    total_bayar += sub_total;

                    if (curr_id != loadData.id) {

                        var action = '';

                        if (level === 'dapur') {
                            if(status_pesanan === 'pending'){
                                action = '   <td rowspan="' + loadData.row_count + '"><a href="#" onclick="update(' + loadData.id + ',\'proses\');return false">Proses</a></td>';    
                            }else if(status_pesanan === 'proses'){
                                action = '   <td rowspan="' + loadData.row_count + '"><a href="#" onclick="update(' + loadData.id + ',\'matang\');return false">Selesai</a></td>';
                            }
                            
                        } else if (level === 'kasir') {
                            action = '   <td rowspan="' + loadData.row_count + '"><a href="#" onclick="show_FormBayar(' + loadData.id + ');return false">Bayar</a></td>';
                        }

                        if (curr_id !== 0) {
                            row += '<tr><td colspan="4"></td></tr>';
                        }

                        if (level === 'dapur') {

                            row +=
                                '<tr>' +
                                '   <td rowspan="' + loadData.row_count + '" style="text-align:center">' + loadData.nama_meja + '</td>' +
                                '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                                '   <td>' + loadData.jumlah + '</td>' +
                                action +
                                '</tr>';

                        } else if (level === 'kasir') {
                            row +=
                                '<tr>' +
                                '   <td rowspan="' + loadData.row_count + '" style="text-align:center">' + loadData.nama_meja + '</td>' +
                                '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                                '   <td style="text-align:left">Rp ' + addCommas(sub_total) + '</td>' +
                                action +
                                '</tr>';

                        }


                        curr_id = loadData.id;

                    } else {
                        if (level === 'dapur') {
                            row +=
                                '<tr>' +
                                '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                                '   <td>' + loadData.jumlah + '</td>' +
                                '</tr>';
                        } else if (level === 'kasir') {
                            row +=
                                '<tr>' +
                                '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                                '   <td style="text-align:left">Rp ' + addCommas(sub_total) + '</td>' +
                                '</tr>';
                        }
                    }


                });

                $('#table_data').html(tbl_header + row);
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}


function cekLastUpdate() {

    var lastUpdate;
    var level = localStorage.getItem('level');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=get-max-created_at&level=' + level,
        async: false,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (response) {
            lastUpdate = response.last_update;
        },
        error: function () {
            $('#conn_failed').show();
        }

    });

    return lastUpdate;
}


$(function () {
    startRefresh();
});


function startRefresh() {

    setTimeout(startRefresh, 1000);

    var level = localStorage.getItem('level');

    if (level === 'member' || level === 'waiter') {

    } else if (level === 'dapur' || level === 'kasir') {

        var lastUpdate = cekLastUpdate();

        if (localStorage.getItem('last_update') !== lastUpdate) {
            getPesananFromDB(level);
            localStorage.setItem('last_update', lastUpdate);
        }
    }
}

$(document).ready(function () {

    var level = localStorage.getItem('level');
    var nilai_bayar = $('#text-nilai-bayar').val();
    

    if (level === 'member' || level === 'waiter') {
        getPesananFromLocalStorage();
        //localStorage.setItem('last_update', cekLastUpdate());
        //getPesananFromDB(level);
        $('#warning-msg').hide();

    } else if (level === 'dapur' || level === 'kasir') {
        localStorage.setItem('last_update', cekLastUpdate());
        getPesananFromDB(level);
    }

    /*
    $.ajax({
        type: 'GET',
        url: rootWebService + '/meja.php?cmd=showlist-digunakan-kosong',
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

                $.each(dataItems, function (index, loadData) {
                    var option = $('<option/>', {
                        value: loadData.id,
                        text: loadData.nama
                    });
                    $('#id_meja').append(option);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
    */


});