
function _get_meja_kosong(){
    var meja_kosong = '<option value="">pilih meja</option>';
    
    $.ajax({
        type: 'GET',
        url: rootWebService + '/meja.php?cmd=showlist-digunakan-kosong',
        async: false,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        dataType: 'json',
        success: function (data) {
            var dataItems = data.items;

            if (dataItems === '') {
                
            } else {
                $.each(dataItems, function (index, loadData) {
                   meja_kosong += '<option value="' + loadData.id +'">' + loadData.nama + '</option>'; 
                    //$('#id_meja').append(option);
                });
                
            }
        },
        error: function () {
            $('#conn_failed').show();
        }

    });
    
    return meja_kosong;
}

function ganti_meja(id){
    var meja_awal = id;
    var meja_baru = $('#meja_' + id).val();
    
    $.ajax({
        type: 'GET',
        url: rootWebService + '/meja.php?cmd=ganti-meja&awal=' + meja_awal + '&baru=' + meja_baru,
        async: false,
        beforeSend: function (x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },        
        success: function (response) {
            window.location="ganti-meja.html";
        },
        error: function () {
        
        }

    });
}

$(document).ready(function (){
    
    var meja_kosong = _get_meja_kosong();
    
    $.ajax({
        type: 'GET',
        url: rootWebService + '/meja.php?cmd=showlist-aktif',
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
                $('#table_data').hide();
            } else {
                $.each(dataItems, function (index, loadData) {                    
                    var row =
                        '<tr style="padding:5px" id="row_' + loadData.id + '">' +
                        '   <td class="table-sub-title" style="text-align:center">' +
                        '     ' + loadData.nama + 
                        '   </td>' +
                        '   <td><select id="meja_'+ loadData.id +'" onchange="ganti_meja(' + loadData.id +')">'+ meja_kosong +'</select></td>' +                        
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