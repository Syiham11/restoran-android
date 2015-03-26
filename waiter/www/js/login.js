$(function () {

    // Checking for CSS 3D transformation support
    $.support.css3d = supportsCSS3D();

    var formContainer = $('#formContainer');

    // Listening for clicks on the ribbon links
    $('.flipLink').click(function (e) {

        // Flipping the forms
        formContainer.toggleClass('flipped');

        // If there is no CSS3 3D support, simply
        // hide the login form (exposing the recover one)
        if (!$.support.css3d) {
            $('#login').toggle();
        }
        e.preventDefault();
    });

    formContainer.find('form').submit(function (e) {
        // Preventing form submissions. If you implement
        // a backend, you might want to remove this code
        e.preventDefault();

        $('#login').hide();
        $('#recover').hide();
        
        var username = $('#loginUsername').val();
        var password = $('#loginPass').val();
        
        var datastring;
        
        if(username !== 'member'){
            datastring = 'username=' + jQuery.trim(username) + '&password=' + $.md5(jQuery.trim(password));
        }else{
            datastring = 'username=' + jQuery.trim(username) + '&password=' + jQuery.trim(password);
        }

        if (jQuery.trim(username) === "" && jQuery.trim(password) === "") {
            $('#wrong_password').show();
            return false;
        }

        $('#progress').show();
        
        dataSetup();

        $.ajax({
            type: 'GET',
            url: rootWebService + '/login.php',
            dataType: 'json',
            
            data: datastring,
            success: function (response) {

                $('#progress').hide();
                var st = response.st;

                var id_user = response.id_user;
                var nama_lengkap = response.nama_lengkap;
                var username = response.username;
                var email = response.email;
                var alamat = response.alamat;
                var level = response.level;

                if (st === 'not_found') {

                    $('#wrong_password').show();

                } else {

                    localStorage.setItem('status_login', 'logged_in');
                    localStorage.setItem('id_user', id_user);
                    localStorage.setItem('nama_lengkap', nama_lengkap);
                    localStorage.setItem('username', username);
                    localStorage.setItem('email', email);
                    localStorage.setItem('alamat', alamat);
                    localStorage.setItem('level', level);
                    localStorage.setItem('pesanan_count',0);

                    $.mobile.changePage($(document.location.href = "dashboard.html"), 'slide');
                }
            }, //success
            error: function (xhr, ajaxOption, thrownError) {

                $('#progress').hide();
                $('#connection_failed').show();
                
            } //error
        }); //ajax

    });

    

    // A helper function that checks for the 
    // support of the 3D CSS3 transformations.
    function supportsCSS3D() {
        var props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective'],
            testDom = document.createElement('a');

        for (var i = 0; i < props.length; i++) {
            if (props[i] in testDom.style) {
                return true;
            }
        }

        return false;
    }
});