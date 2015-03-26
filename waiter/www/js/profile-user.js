function update() {

    var id_user = localStorage.getItem('id_user');

    $.ajax({
        url: rootWebService + '/user.php?cmd=update&id=' + id_user,
        type: 'POST',
        cache: false,
        async: false,
        data: $('#memberForm').serialize(),
        success: function (data) {

            window.location = "profile-user.html";

        },
        error: function () {
            console.error('errrorrrrr');
        }

    });
}

$(document).ready(function () {

    var id_user = localStorage.getItem('id_user');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/user.php?cmd=getbyid&id=' + id_user,
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
                $('#username').val(data.username);
                $('#nama').val(data.nama);
                $('#email').val(data.email);
                $('#alamat').val(data.alamat);

            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
});