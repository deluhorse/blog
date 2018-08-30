/**
 * @author: delu
 * @file: blog_new.js
 * @time: 18/8/29 10:57
 */

var api_dict = {
    blog_create: '/blog/create'
};

$(function () {

    var E = window.wangEditor;

    var editor = new E('#blog_create');

    editor.create();

   $('.js-blog-create').on('click', function (e) {

       wc._post(api_dict.blog_create,
           {
               title: $('.js-article-title').val(),
               content: encodeURIComponent(editor.txt.html())
           }, function (res) {

               location.assign('blog_list.html');
           }
           );
   });
});