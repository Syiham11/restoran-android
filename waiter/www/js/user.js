var $ = jQuery.noConflict();

function act_update(id) {

    $.ajax({
        url: rootWebService + '/user.php?cmd=update&id=' + id,
        type: 'POST',
        cache: false,
        async: false,
        data: $('#userForm').serialize(),
        success: function (data) {
            
            window.location = "user.html";

        },
        error: function () {

            console.error('errrorrrrr');

        }

    });
}


function update(id) {

    $('#column_table').fadeOut();
    $('#userForm').delay(350).fadeIn("slow");

    $.ajax({
        type: 'GET',
        url: rootWebService + '/user.php?cmd=getbyid&id=' + id,
        async: true,
        success: function (data) {
            //window.location = "user.html";
            $('#username').attr('value', data.username);
            $('#nama').attr('value', data.nama);            
            $('#email').attr('value', data.email);
            $('#alamat').attr('value', data.alamat);            
            $('select[name="level"]').find('option[value="' + data.level + '"]').attr("selected", true);
            $('#SubmitButton').attr('onclick', 'act_update(' + id + ');return false');
        },
        error: function () {

        }

    })
}

function del(id) {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/user.php?cmd=delete&id=' + id,
        async: true,
        success: function (data) {
            window.location = "user.html";
        },
        error: function () {

        }

    });
}

//berikan form untuk mengisi data baru
function add() {

    $('#column_table').fadeOut();
    $('#userForm').delay(350).fadeIn("slow");

    $('#formSuccessMessageWrap').hide(0);
    $('.formValidationError').fadeOut(0);
}



function act_add() {
    //localStorage.setItem('submit','ok');
    $.ajax({
        url: rootWebService + '/user.php?cmd=insert',
        data: $('#userForm').serialize(),
        type: 'POST',
        success: function (msg) {
            window.location = "user.html";

        },
        error: function (msg) {

        }
    });
}


function cancel() {
    $('#userForm').fadeOut();
    $('#column_table').delay(350).fadeIn("slow");
}


$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: rootWebService + '/user.php?cmd=showlist',
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
                    var row = '<tr id=row_' + loadData.id + '"><td><a href="#" onclick="update(' + loadData.id + ')" style="color:#8EADF0;text-align:center">' + loadData.username + '</a></td><td>' + loadData.level + '</td><td><a href="#" onclick="del(' + loadData.id + ');return false">Hapus</a></td></tr>';
                    $('#table_data').append(row);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
            $('#btn_tambah').hide();
        }

    });

    //$('#nama').attr('value','ini_hanya_test');



});