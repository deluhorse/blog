/**
 * @author: delu
 * @file: blog_edit.js
 * @time: 18/8/30 10:40
 */

var api_dict = {
    query_blog_detail: '/blog/detail/query',
    update_blog: '/blog/update'
};

$(function (){

    var E = window.wangEditor;

    var editor = new E('#blog_edit');

    editor.create();

    var params = wc.get_params();

    var blog_id = params.blog_id;

    query_blog_detail(blog_id, editor);

    $('.js-blog-update').on('click', function (e) {
        var $target = $(e.currentTarget);
        wc._post(
            api_dict.update_blog,
            {
                blog_id: $target.data('blog_id'),
                title: $('.js-article-title').val(),
                content: encodeURIComponent(editor.txt.html())
            },
            function (res) {
                console.log(res);
                location.assign('blog_list.html');
            }
        )
    });

});

function query_blog_detail(blog_id, editor) {
    wc._get(api_dict.query_blog_detail, {blog_id: blog_id}, function (res) {
        $('.js-blog-update').data('blog_id', res.data.blog_id);
        $('.js-article-title').val(res.data.title);
        editor.txt.html(res.data.content);
    });
}