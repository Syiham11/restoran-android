function update() {

    var id_user = localStorage.getItem('id_user');

    $.ajax({
        url: rootWebService + '/member.php?cmd=update&id=' + id_user,
        type: 'POST',
        cache: false,
        async: false,
        data: $('#memberForm').serialize(),
        success: function (data) {

           window.location = "dashboard.html";

        },
        error: function () {
            console.error('errrorrrrr');
        }

    });
}


function get_region(){
       $.ajax({
        type: 'GET',
        url: rootWebService + '/region.php?cmd=showlist',
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

               // $('#data_not_found').show();

            } else {

                $('#table_data').show();
                $.each(dataItems, function (index, loadData) {
                    var option = $('<option/>', {
                        value: loadData.id,
                        text: loadData.nama
                    });
                    $('#id_region').append(option);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();            
        }

    });
}

$(document).ready(function () {

    var id_user = localStorage.getItem('id_user');
    
    get_region();

    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=getbyid&id=' + id_user,
        async: true,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (data) {
            if (data == '') {
                $('#data_not_found').show();
            } else {
                $('#id_card').val(data.password);
                $('#username').val(data.username);
                $('#nama').val(data.nama);
                $('#email').val(data.email);
                $('#alamat').val(data.alamat);
                $('select[name="id_region"]').find('option[value="' + data.id_region + '"]').attr("selected", true);

            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
    
    
});