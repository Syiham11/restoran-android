var $ = jQuery.noConflict();

$(document).ready(function () {

    var id = localStorage.getItem('id_user');
    
    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=list-deposit&id_member=' + id,
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

                    var row =
                        '<tr>' +
                        '   <td>' + loadData.created_at + '</td>' +
                        '   <td>Rp ' + addCommas(loadData.deposit) + '</td>' +
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