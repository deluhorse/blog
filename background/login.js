/**
 * @author: delu
 * @file: login.js
 * @time: 18/8/28 10:47
 */

var api_dict = {
    login: '/user/login/create'
};

$(function (e) {

    $('#btn-login').on('click', function () {
        wc._post(
            api_dict.login,
            {
                user_name: $('#username').val(),
                password: $('#password').val()
            }, function (res) {
                location.assign('index.html');
            });
    });
});