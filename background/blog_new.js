/**
 * @author: delu
 * @file: blog_new.js
 * @time: 18/8/29 10:57
 */

var api_dict = {
    query_blog_detail: '/blog/detail/query',
    create_blog: '/blog/create'
};

$(function () {

    var blog_id = wc.get_params().blog_id;

    var E = window.wangEditor;

    var editor = new E('#tool-bar', '#editor-content');

    editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片

    editor.create();

    query_blog_detail(blog_id, editor);

    var observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function(mutation) {
            return
        });
        save_blog(blog_id, editor);
    });

    var options = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
    } ;

    observer.observe($('.editor-wrapper').get(0), options);
});

/**
 * 查询博文详情
 * @param blog_id
 * @param editor
 */
function query_blog_detail(blog_id, editor) {

    wc._get(api_dict.query_blog_detail, {blog_id: blog_id}, function (res) {

        $('.js-blog-update').data('blog_id', res.data.blog_id);

        $('.js-article-title').val(res.data.title);

        editor.txt.html(res.data.content);

    });
}

/**
 * 保存博文
 * @param blog_id
 */
function save_blog(blog_id, editor){

    wc._post(
        api_dict.create_blog,
        {
            blog_id: blog_id,
            title: $('.js-article-title').val(),
            content: encodeURIComponent(editor.txt.html())
        },function (res) {
            console.log('auto save success');
        }
    );
}