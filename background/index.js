/**
 * @author: delu
 * @file: index.js
 * @time: 18/8/30 17:05
 */
$(function () {

    $('#blog-list-a').on('mousemove', function (e) {

        $('.blog_list_show').show();
    }).on('mouseleave', function (e) {

        $('.blog_list_show').hide();
    });

});