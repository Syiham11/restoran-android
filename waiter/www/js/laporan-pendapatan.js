var $ = jQuery.noConflict();

function laporan_tahunan() {
    $('#table_data').empty();
    $('#label-laporan').html('Laporan Tahunan');

    var tbl_header =
        '<tr>' +
        '   <th class="even">Tahun</th>' +
        '   <th class="even">Pendapatan</th>' +
        '</tr>';

    $('#table_data').append(tbl_header);

    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=laporan-tahunan',
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

            } else {

                $('#table_data').show();
                total = 0;
                $.each(dataItems, function (index, loadData) {
                    var row =
                        '<tr>' +
                        '   <td><a href="#" onclick="laporan_bulanan(' + loadData.tahun + ')" style="color:#8EADF0;text-align:center">' + loadData.tahun + '</a></td>' +
                        '   <td>Rp ' + addCommas(loadData.total_pendapatan) + '</td>' +
                        '</tr>';
                    $('#table_data').append(row);
                    total += parseInt(loadData.total_pendapatan,10);
                });

                var tbl_footer =
                    '<tr>' +
                    '   <td style="text-align:right">TOTAL</td>' +
                    '   <td style="text-align:center">Rp ' + addCommas(total) +'</td>' +
                    '</tr>';

                $('#table_data').append(tbl_footer);
            }
        },
        error: function () {
            $('#conn_failed').show();

        }

    });

}

function laporan_bulanan(tahun) {
    $('#table_data').empty();
    $('#label-laporan').html('Laporan Bulanan untuk Tahun ' + tahun);

    var tbl_header =
        '<tr>' +
        '   <th class="even">Bulan</th>' +
        '   <th class="even">Pendapatan</th>' +
        '</tr>';

    $('#table_data').append(tbl_header);

    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=laporan-bulanan&tahun=' + tahun,
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

            } else {

                $('#table_data').show();
                total = 0;
                $.each(dataItems, function (index, loadData) {
                    var row =
                        '<tr>' +
                        '   <td><a href="#" onclick="laporan_mingguan(' + tahun + ',' + loadData.bulan + ')" style="color:#8EADF0;text-align:center">' + loadData.bulan + '</a></td>' +
                        '   <td>Rp ' + addCommas(loadData.total_pendapatan) + '</td>' +
                        '</tr>';
                    $('#table_data').append(row);
                    total += parseInt(loadData.total_pendapatan,10);
                });
                
                var tbl_footer =
                    '<tr>' +
                    '   <td style="text-align:right">TOTAL</td>' +
                    '   <td style="text-align:center">Rp ' + addCommas(total) +'</td>' +
                    '</tr>';

                $('#table_data').append(tbl_footer);
            }
        },
        error: function () {
            $('#conn_failed').show();

        }

    });


}

function laporan_mingguan(tahun, bulan) {
    $('#table_data').empty();
    $('#label-laporan').html('Laporan Mingguan untuk Tahun ' + tahun + ' Bulan ' + bulan);

    var tbl_header =
        '<tr>' +
        '   <th class="even">Minggu ke</th>' +
        '   <th class="even">Pendapatan</th>' +
        '</tr>';
    $('#table_data').append(tbl_header);

    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=laporan-mingguan&tahun=' + tahun + '&bulan=' + bulan,
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

            } else {

                $('#table_data').show();
                total = 0;
                $.each(dataItems, function (index, loadData) {
                    var row =
                        '<tr>' +
                        '   <td><a href="#" onclick="laporan_harian(' + tahun + ',' + bulan + ',' + loadData.minggu_ke + ')" style="color:#8EADF0;text-align:center">' + loadData.minggu_ke + '</a></td>' +
                        '   <td>Rp ' + addCommas(loadData.total_pendapatan) + '</td>' +
                        '</tr>';
                    $('#table_data').append(row);
                    total += parseInt(loadData.total_pendapatan,10);
                });
                
                var tbl_footer =
                    '<tr>' +
                    '   <td style="text-align:right">TOTAL</td>' +
                    '   <td style="text-align:center">Rp ' + addCommas(total) +'</td>' +
                    '</tr>';

                $('#table_data').append(tbl_footer);
            }
        },
        error: function () {
            $('#conn_failed').show();

        }

    });



}

function laporan_harian(tahun, bulan, minggu) {
    $('#table_data').empty();
    $('#label-laporan').html('Laporan Harian untuk Tahun ' + tahun + ' Bulan ' + bulan + ' Minggu ke' + minggu);

    var tbl_header =
        '<tr>' +
        '   <th class="even">Tanggal</th>' +
        '   <th class="even">Pendapatan</th>' +
        '</tr>';
    $('#table_data').append(tbl_header);

    $.ajax({
        type: 'GET',
        url: rootWebService + '/laporan.php?cmd=laporan-harian&tahun=' + tahun + '&bulan=' + bulan + '&minggu=' + minggu,
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

            } else {

                $('#table_data').show();
                var total = 0;
                $.each(dataItems, function (index, loadData) {
                    var row =
                        '<tr>' +
                        '   <td style="text-align:center">' + loadData.hari_ke + '</td>' +
                        '   <td>' + loadData.total_pendapatan + '</td>' +
                        '</tr>';
                    $('#table_data').append(row);
                    total += parseInt(loadData.total_pendapatan,10);
                });
                
                var tbl_footer =
                    '<tr>' +
                    '   <td style="text-align:right">TOTAL</td>' +
                    '   <td style="text-align:center">Rp ' + addCommas(total) +'</td>' +
                    '</tr>';

                $('#table_data').append(tbl_footer);
            }
        },
        error: function () {
            $('#conn_failed').show();

        }

    });



}

function laporan_details(tahun, bulan, minggu, hari) {
    $('#table_data').empty();
}

$(document).ready(function () {
    laporan_tahunan();
});