var $ = jQuery.noConflict();

function act_update(id) {

    $.ajax({
        url: rootWebService + '/member.php?cmd=update&id=' + id,
        type: 'POST',
        cache: false,
        async: false,
        data: $('#memberForm').serialize(),
        success: function (data) {

            window.location = "member.html";

        },
        error: function () {

            console.error('errrorrrrr');

        }

    });
}


function update(id) {

    $('#column_table').fadeOut();
    $('#memberForm').delay(350).fadeIn("slow");

    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=getbyid&id=' + id,
        async: true,
        success: function (data) {
            //window.location = "user.html";
            $('#id_card').attr('value', data.password);
            $('#nama').attr('value', data.nama);
            $('#email').attr('value', data.email);
            $('#alamat').attr('value', data.alamat);
            $('select[name="id_region"]').find('option[value="' + data.id_region + '"]').attr("selected", true);
            $('#SubmitButton').attr('onclick', 'act_update(' + id + ');return false');
        },
        error: function () {

        }

    })
}

function del(id) {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=delete&id=' + id,
        async: true,
        success: function (data) {
            window.location = "member.html";
        },
        error: function () {

        }

    });
}

function del_deposit(id) {
    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=delete_deposit&id=' + id,
        async: true,
        success: function (data) {
            window.location = "member.html";
        },
        error: function () {

        }

    });
}
//berikan form untuk mengisi data baru
function add() {

    $('#column_table').fadeOut();
    $('#memberForm').delay(350).fadeIn("slow");

    $('#formSuccessMessageWrap').hide(0);
    $('.formValidationError').fadeOut(0);
}



function act_add() {
    //localStorage.setItem('submit','ok');
    $.ajax({
        url: rootWebService + '/member.php?cmd=insert',
        data: $('#memberForm').serialize(),
        type: 'POST',
        success: function (msg) {
            window.location = "member.html";

        },
        error: function (msg) {

        }
    });
}


function cancel() {
    $('#memberForm').fadeOut();
    $('#column_table').delay(350).fadeIn("slow");
}

function add_deposit(id_member, nama) {

    var deposit = $('#deposit').val();
    var datastring = 'id_member=' + jQuery.trim(id_member) + '&deposit=' + jQuery.trim(deposit);
    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=insert-deposit&' + datastring,
        dataType: 'json',
        success: function (response) {

            window.location = "member.html";

        },
        error: function (xhr, ajaxOption, thrownError) {

        }
    });

    //getdeposit(id_member,nama);
}

function getdeposit(id_member, nama) {

    $('#column_table').fadeOut();
    $('#btnAddDeposit').attr('onclick', 'add_deposit(' + id_member + ',\'' + nama + '\');return false');
    $('#header-deposit').replaceWith('<h4 class="icon-heading" id="header-deposit">Data deposit untuk: ' + nama + '</h4>');

    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=list-deposit&id_member=' + id_member,
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

                //$('#data_not_found').delay(350).fadeIn("slow");
                $('#depositForm').delay(350).fadeIn("slow");

            } else {

                $('#column-deposit').delay(350).fadeIn("slow");
                $('#depositForm').delay(350).fadeIn("slow");



                $.each(dataItems, function (index, loadData) {
                    var row =
                        '<tr>' +
                        '   <td>' + loadData.created_at + '</td>' +
                        '   <td style="text-align:left">' + addCommas(loadData.deposit) + '</td>' +
                        '   <td><a href="#" onclick="del_deposit(' + loadData.id + ');return false">Hapus</a></td>' +
                        '</tr>';
                    $('#table-deposit').append(row);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
            //$('#btn_tambah').hide();
        }

    });
}

function search() {
    var id_card = $('#id-card-cari').val();

    var link_url;
    if (id_card.length == 0) {
        link_url = rootWebService + '/member.php?cmd=showlist';
    } else {
        link_url = rootWebService + '/member.php?cmd=showlist-by-password&password=' + id_card;
    }
    //showlist-by-password
    $('#table_data').empty();
    $('#cari-not-found').hide();
    $('#conn_failed').hide();

    $.ajax({
        type: 'GET',
        url: link_url,
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

                $('#cari-not-found').show();

            } else {

                $('#table_data').show();

                var tbl_header =
                    '<tr>' +
                    '    <th class="even">Nama</th>' +
                    '    <th class="even">ID Card</th>' +
                    '    <th class="even">Sisa Deposit</th>' +
                    '    <th class="even">#</th>' +
                    '</tr>';

                $('#table_data').append(tbl_header);

                $.each(dataItems, function (index, loadData) {

                    var row =
                        '<tr id=row_' + loadData.id + '">' +
                        '   <td><a href="#" onclick="update(' + loadData.id + ')" style="color:#8EADF0;text-align:left">' + loadData.nama + '</a></td>' +
                        '   <td style="text-align:left">' + loadData.password + '</td>' +
                        '   <td style="text-align:left"><a href="#" onclick="getdeposit(' + loadData.id + ',\'' + loadData.nama + '\');return false" style="color:#8EADF0;text-align:left">Rp ' + addCommas(loadData.sisa_deposit) + '</a></td>' +
                        '   <td><a href="#" onclick="del(' + loadData.id + ');return false">Hapus</a></td>' +
                        '</tr>';

                    $('#table_data').append(row);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();

        }

    });
}

$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: rootWebService + '/member.php?cmd=showlist',
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
                        '<tr id=row_' + loadData.id + '">' +
                        '   <td><a href="#" onclick="update(' + loadData.id + ')" style="color:#8EADF0;text-align:left">' + loadData.nama + '</a></td>' +
                        '   <td style="text-align:left">' + loadData.password + '</td>' +
                        '   <td style="text-align:left"><a href="#" onclick="getdeposit(' + loadData.id + ',\'' + loadData.nama + '\');return false" style="color:#8EADF0;text-align:left">Rp ' + addCommas(loadData.sisa_deposit) + '</a></td>' +
                        '   <td><a href="#" onclick="del(' + loadData.id + ');return false">Hapus</a></td>' +
                        '</tr>';

                    $('#table_data').append(row);
                });
            }
        },
        error: function () {
            $('#conn_failed').show();
            $('#btn_tambah').hide();
            $('#text-cari').hide();
        }

    });


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

                $('#data_not_found').show();

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
            $('#btn_tambah').hide();
            $('#text-cari').hide();
        }

    });

    //$('#nama').attr('value','ini_hanya_test');



});