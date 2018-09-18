/**
 * @author: delu
 * @file: blog_list.js
 * @time: 18/8/28 17:14
 */
var api_dict = {
    query_blog: '/blog/query',
    delete_blog: '/blog/delete',
    create_blog: '/blog/create'
};

$(function () {

    $('#btn-create-blog').on('click', function (e) {

        wc._post(
                api_dict.create_blog,
                {
                    content: '<p><br></p>'
                },function (res) {
                    var blog_id = res.data.blog_id;
                    location.assign(`blog_new.html?blog_id=${blog_id}`);
                }
            );
    });

    query_blog_list();
});

/**
 * 查询博文列表
 */
function query_blog_list() {
    wc._get(api_dict.query_blog, {}, function (res) {
        var blog_list = res.data.blog_list;

        for (let blog of blog_list){
            $('.blog-list').append(`<div class="blog" data-blog_id=${blog.blog_id}><span>${blog.title}</span><div class="blog-edit-component"><input type="button" class="btn-blog-edit" value="编辑"><input type="button" class="btn-blog-delete" value="删除"></div></div>`);
        }

        $('.blog').on('click', function (e) {

            var blog_id = $(e.currentTarget).data('blog_id');

            console.log(blog_id);
        });

        $('.btn-blog-edit').unbind('click').on('click', function (e) {

            e.stopPropagation();

            var blog_id = $(e.currentTarget).parent().parent().data('blog_id');

            location.assign(`blog_new.html?blog_id=${blog_id}`);
        });

        $('.btn-blog-delete').on('click', function (e) {

            e.stopPropagation();

            var blog_id = $(e.currentTarget).parent().parent().data('blog_id');

            wc._post(api_dict.delete_blog, {blog_id: blog_id}, function (res) {

                location.assign('blog_list.html');
            });
        });
    });
}