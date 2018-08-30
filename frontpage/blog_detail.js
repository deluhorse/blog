/**
 * @author: delu
 * @file: blog_detail.js
 * @time: 18/8/27 14:45
 */

var api_list = {
    query_blog_list: '/blog/visitor/query'
};

$(function () {
    /**
     * 首次进入博客列表，则调用接口显示博文列表
     */
    $('.main-category').on('click', function (e) {
        location.assign('../index.html');
    });

    var params = wc.get_params();

    var blog_id = params.blog_id;

    query_blog_detail(blog_id);
});

/**
 * 查询博文详情
 * @param params
 */
function query_blog_detail(blog_id) {

    wc._get(api_list.query_blog_list, {blog_id: blog_id}, function (res) {

        var blog = res.data.list[0];

        $('.article-title').text(blog.title);

        $('.article-content').html(blog.content);
    });
}

