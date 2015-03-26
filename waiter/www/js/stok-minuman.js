var $ = jQuery.noConflict();

function change_status(id, status) {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/paket.php?cmd=update-habis&id=' + id + '&habis=' + status,
        async: true,
        success: function (data) {

            //window.location = 'stok-makanan.html';
            if (status === 'N') {

                $('#td_' + id).html(
                    '   <a href="#" onclick="change_status(' + id + ',\'Y\');return false">' +
                    '       <img src="img/ui/switch-on.png" alt="img" style="float:center">' +
                    '   </a>');


            } else {
                $('#td_' + id).html(
                    '   <a href="#" onclick="change_status(' + id + ',\'N\');return false">' +
                    '       <img src="img/ui/switch-off.png" alt="img" style="float:center">' +
                    '   </a>');

            }

        },
        error: function () {

        }

    })
}


$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: rootWebService + '/paket.php?cmd=showlist&jenis=minuman',
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
                $.each(dataItems, function (index, loadData) {

                    var row_habis;
                    if (loadData.habis === 'Y') {
                        row_habis =
                            '<td id="td_' + loadData.id + '" style="width: 1px;white-space: nowrap;">' +
                            '   <a href="#" onclick="change_status(' + loadData.id + ',\'N\');return false">' +
                            '       <img src="img/ui/switch-off.png" alt="img" style="float:center">' +
                            '   </a>' +
                            '</td>';
                    } else {
                        row_habis =
                            '<td id="td_' + loadData.id + '" style="width: 1px;white-space: nowrap;">' +
                            '   <a href="#" onclick="change_status(' + loadData.id + ',\'Y\');return false">' +
                            '       <img src="img/ui/switch-on.png" alt="img">' +
                            '   </a>' +
                            '</td>';
                    }

                    var row =
                        '<tr>' +
                        '   <td> ' + loadData.nama + '</td>' +
                        row_habis +
                        '</tr>';

                    $('#table_data').append(row);
                });
            }
        },
        error: function () {

            $('#conn_failed').show();

        }

    });


});