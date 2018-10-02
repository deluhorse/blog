/**
 * @author: delu
 * @file: index.js.js
 * @time: 18/8/26 23:20
 */

var api_list = {
    query_blog_list: '/blog/visitor/query'
};

$(function () {
    /**
     * 首次进入博客列表，则调用接口显示博文列表
     */
    $('.article-list').delegate('.article', 'click', function (e) {

        var $target = $(e.currentTarget);

        var blog_id = $target.data('blog_id');

        location.assign(`frontpage/blog_detail.html?blog_id=${blog_id}`);

    });

    query_blog_list({});

    show_left_days();

});

/**
 * 查询博文列表
 * @param params
 */
function query_blog_list(params) {

    wc._get(api_list.query_blog_list, params, function (res) {

        $('.article-list').empty();

        for (let article of res.data.list){

            $('.article-list').append(`<div class="article" data-blog_id=${article.blog_id}>${article.title}<div style="text-align: right"><span style="font-size: 14px;color: lightgrey;">${article.create_time}</span></div></div>`);
        }

    });
}

function show_left_days() {

    var x = new Date('2019-03-01');

    var today = new Date();

    var left_days = parseInt((x - today) / (1000 * 60 * 60 * 24));

    $('.left-days').html(left_days);

}