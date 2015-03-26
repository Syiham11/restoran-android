    function changeSettings(id) {

        //console.log('test');

        var content_setting = $('#setting_id_' + id).val();
        var dataString = 'id=' + id + '&content_setting=' + jQuery.trim(content_setting);

        $.ajax({
            url: rootWebService + '/settings.php?cmd=update&',
            type: 'GET',
            data: dataString,
            success: function (data) {

            },
            error: function () {
                console.error('errrorrrrr');

            }

        });


    }

    $(document).ready(function () {

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
                if (dataItems == '') {

                    $('#data_not_found').show();

                } else {

                    $('#table_data').show();

                    $.each(dataItems, function (index, loadData) {
                        var row = '<tr><td>' + loadData.id + '</td><td>' + loadData.title + '</td><td>' + loadData.tipe + '</td><td><input type="text" id="setting_id_' + loadData.id + '" name="setting_id_' + loadData.id + '" style="width:100%"  onchange="changeSettings(' + loadData.id + ');" value="' + loadData.content_setting + '"></td></tr>';
                        $('#table_data').append(row);

                    });

                }
            },
            error: function () {
                $('#conn_failed').show();
            }

        });
    });