var $ = jQuery.noConflict();

function sisa_deposit() {
    var id = localStorage.getItem('id_user');
    
    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=get-last-deposit-by-id&id=' + id,
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

                //$('#data_not_found').show();

            } else {
                $('#sisa-deposit').show();
                //$('#table-data-makanan-top5').show();
                
                $.each(dataItems, function (index, loadData) {

                    $('#text-sisa-deposit').html('Sisa Deposit Anda : Rp ' + addCommas(loadData.sisa_deposit));

                    
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });

}

function pendapatan_hari_ini(){
        $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=get-pendapatan-hari-ini',
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

                //$('#data_not_found').show();
                $('#pendapatan-hari-ini').html('Pendapatan Hari ini:Rp 0');

            } else {
                $('#pendapatan-hari-ini').show();
                //$('#table-data-makanan-top5').show();
                
                $.each(dataItems, function (index, loadData) {

                    $('#pendapatan-hari-ini').html('Pendapatan Hari ini: Rp ' + addCommas(loadData.total_pendapatan));

                    
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}

function laporan_makanan_top5() {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=get-makanan-top5',
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

                //$('#data_not_found').show();

            } else {
                $('#laporan-makanan-top5').show();
                //$('#table-data-makanan-top5').show();
                var i = 1;
                $.each(dataItems, function (index, loadData) {

                    var row =
                        '<tr>' +
                        '   <td style="text-align:center">' + i + '</a></td>' +
                        '   <td style="text-align:left">' + loadData.nama + '</td>' +
                        '</tr>';

                    $('#table-data-makanan-top5').append(row);
                    i += 1;
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}

function laporan_minuman_top5() {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=get-minuman-top5',
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

                //$('#data_not_found').show();

            } else {
                $('#laporan-minuman-top5').show();
                //$('#table-data-minuman-top5').show();
                var i = 1;
                $.each(dataItems, function (index, loadData) {

                    var row =
                        '<tr>' +
                        '   <td style="text-align:center">' + i + '</a></td>' +
                        '   <td style="text-align:left">' + loadData.nama + '</td>' +
                        '</tr>';

                    $('#table-data-minuman-top5').append(row);
                    i += 1;
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}

function laporan_hari_ini() {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=get-list-pendapatan-hari-ini',
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

                //$('#data_not_found').show();

            } else {
                $('#laporan-hari-ini').show();
                var total = 0;
                var row;
                $.each(dataItems, function (index, loadData) {

                    row +=
                        '<tr>' +
                        '   <td style="text-align:left">' + loadData.id + '</a></td>' +
                        '   <td style="text-align:left">Rp ' + addCommas(loadData.total_pendapatan) + '</td>' +
                        '</tr>';

                    total += parseInt(loadData.total_pendapatan, 10);

                });

                row +=
                    '<tr>' +
                    '   <td style="text-align:right">TOTAL PENDAPATAN</a></td>' +
                    '   <td style="text-align:left">Rp ' + addCommas(total) + '</td>' +
                    '</tr>';

                $('#table-data-laporan-hari-ini').append(row);
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
}

$(document).ready(function () {

    var level = localStorage.getItem('level');
    $('#laporan-makanan-top5').hide();
    $('#laporan-minuman-top5').hide();
    $('#laporan-hari-ini').hide();

    if (level === 'admin') {
        //$('#admin-laporan-hari-ini').show();
        laporan_hari_ini();
    }else if(level === 'member'){
        sisa_deposit();
    }

    laporan_makanan_top5();
    laporan_minuman_top5();


});