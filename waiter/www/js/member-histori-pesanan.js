var $ = jQuery.noConflict();

function get_total() {

    var id_member = localStorage.getItem('id_user');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=member-histori-pembelian-total&id_member=' + id_member,
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
                $.each(dataItems, function (index, loadData) {

                    $('#text-total-pembelian').html('Total Keseluruhan : Rp ' + addCommas(loadData.total));

                });

            }
        },
        error: function () {

        }
    });
}

$(document).ready(function () {

    var id_member = localStorage.getItem('id_user');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/pesanan.php?cmd=member-histori-pembelian&id_member=' + id_member,
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

                $('#column_table').show();

                var curr_id = 0;
                var row;
                var total_bayar = 0;

                var limit = 10;
                var curr_limit = 0;

                $.each(dataItems, function (index, loadData) {


                    if (curr_id != loadData.id_pesanan) {

                        if (curr_id != 0) {
                            row =
                                '<tr>' +
                                '   <td colspan="3" style="text-align:right">TOTAL</td>' +
                                '   <td> ' + addCommas(total_bayar) + '</td>' +
                                '</tr>';
                            total_bayar = 0;
                            $('#table_data').append(row);
                        }

                        row =
                            '<tr>' +
                            '   <td rowspan="' + loadData.row_count + '" style="text-align:center">' + loadData.id_pesanan + '<br>(' + loadData.created_at + ')</td>' +
                            '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                            '   <td style="text-align:center">' + loadData.jumlah + '</td>' +
                            '   <td style="text-align:left">Rp ' + addCommas(loadData.sub_total) + '</td>' +
                            '</tr>';

                        total_bayar += parseInt(loadData.sub_total, 10);
                        curr_id = loadData.id_pesanan;
                        $('#table_data').append(row);

                    } else {

                        row =
                            '<tr>' +
                            '   <td style="text-align:left">' + loadData.nama_item + '</td>' +
                            '   <td style="text-align:center">' + loadData.jumlah + '</td>' +
                            '   <td style="text-align:left">Rp ' + addCommas(loadData.sub_total) + '</td>' +
                            '</tr>';

                        total_bayar += parseInt(loadData.sub_total, 10);
                        curr_limit + 1;
                        $('#table_data').append(row);
                    }


                });

                row =
                    '<tr>' +
                    '   <td colspan="3" style="text-align:right">TOTAL</td>' +
                    '   <td> ' + addCommas(total_bayar) + '</td>' +
                    '</tr>';
                total_bayar = 0;
                $('#table_data').append(row);



            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });

    get_total();

});