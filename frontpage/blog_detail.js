/**
 * @author: delu
 * @file: blog_detail.js
 * @time: 18/8/27 14:45
 */

var api_dict = {
    query_blog_list: '/blog/visitor/query',
    create_blog_comment: '/blog/comments/create',
    query_blog_comments: '/blog/comments/query',
    create_blog_comments_reply: '/blog/comments/reply/create'
};

var comment_dict = {};

$(function () {
    /**
     * 首次进入博客列表，则调用接口显示博文列表
     */
    $('.main-category').on('click', function (e) {
        location.assign('../index.html');
    });

    /**
     * 显示评论区
     */
    $('.js-show-blog-comment-block').on('click', function () {
        show_comment_block();
    });

    /**
     * 隐藏评论区
     */
    $('.js-comment_close').on('click', function () {
        hide_comment_block();
    });

    /**
     * 隐藏回复区
     */
    $('.js-reply_close').on('click', function (e) {
        hide_reply_block();
    });

    var params = wc.get_params();

    var blog_id = params.blog_id;

    query_blog_detail(blog_id);

    query_comment_block(blog_id);

    $('.js-blog-comment-create').on('click', {blog_id: blog_id}, create_blog_comment);

    $('.js-blog-reply-create').on('click', function (e) {

        var comment_id = $('.blog-comment-reply-block').data('comment_id');

        var comment_item = comment_dict['' + comment_id];

        wc._post(
            api_dict.create_blog_comments_reply,
            {
                blog_id: comment_item.blog_id,
                comment_id: comment_item.comment_id,
                nick_name: $('.reply-nickname').val(),
                reply_content: $('.js-blog-reply-content').val()
            },
            function (res) {
                query_comment_block(comment_item.blog_id);
            }
        )
    });


});

/**
 * 查询博文详情
 * @param params
 */
function query_blog_detail(blog_id) {

    wc._get(api_dict.query_blog_list, {blog_id: blog_id}, function (res) {

        var blog = res.data.list[0];

        $('.article-title').text(blog.title);

        $('.article-content').html(blog.content);
    });
}

/**
 * 创建博文评论
 */
function create_blog_comment(e){
    wc._post(
        api_dict.create_blog_comment,
        {
           blog_id: e.data.blog_id,
           nick_name: encodeURIComponent($('.comment-nickname').val()),
           comment_content: encodeURIComponent($('.js-blog-comment-content').val())
        }, function (res) {
            // 刷新评论区
            query_comment_block(e.data.blog_id);
        });
}

/**
 * 更新评论区
 * @param blog_id
 * 1. 获取博文的评论列表并渲染
 * 2. 绑定回复事件
 */
function query_comment_block(blog_id){

    comment_dict = {};

    wc._get(api_dict.query_blog_comments, {blog_id: blog_id}, function (res) {

        hide_reply_block();

        $('.blog-comment-list').empty();

        $('.blog-comment-list').append('<h3>评论</h3>');

        for (let comment_item of res.data){

            comment_dict['' + comment_item.comment_id] = comment_item;

            var blog_comment_item = $(`<div class="blog-comment-item" data-comment_id=${comment_item.comment_id}></div>`);
            blog_comment_item.append(`<span style="font-size: 14px;">${htmlDecodeJQ(comment_item.nick_name)}</span>`);
            blog_comment_item.append(`<span style="font-size: 10px;color: powderblue;margin-left: 10px;">created at : ${timestamp_to_str(comment_item.create_time)}</span>`);
            blog_comment_item.append(`<div class="comment-button-group"><span>回复</span></div>`)

            var blog_comment_content = $('<div class="blog-comment-content"></div>');
            blog_comment_content.append(`<pre>${htmlDecodeJQ(comment_item.comment_content)}</pre>`);

            var reply_list = $('<div class="blog-comment-reply-list"></div>');
            for (let comment_reply_item of comment_item.reply_list){

                var reply_item = $('<div class="blog-comment-reply-item"></div>');
                reply_item.append(`<span style="font-size: 14px;">${htmlDecodeJQ(comment_reply_item.nick_name)}</span>`);
                reply_item.append(`<span style="font-size: 10px;color: powderblue;margin-left: 10px;">created at : ${timestamp_to_str(comment_reply_item.create_time)}</span>`);
                reply_item.append(`<div class="blog-comment-reply-content"><pre>${htmlDecodeJQ(comment_reply_item.reply_content)}</pre></div>`);

                reply_list.append(reply_item);
            }

            blog_comment_content.append(reply_list);

            blog_comment_item.append(blog_comment_content);

            $('.blog-comment-list').append(blog_comment_item);
        }

        $('.comment-button-group > span').on('click', function (e) {
            /**
             * 显示回复区并传入comment_id
             * @type {jQuery|HTMLElement}
             */
            $target = $(e.currentTarget);

            var comment_id = $target.parent().parent().data('comment_id');

            var comment_item = comment_dict['' + comment_id];
            // 显示回复区
            show_reply_block();

            $('.blog-comment-reply-block').data('comment_id', comment_id);

            var comment_nickname = comment_item.nick_name;

            $('.js-blog-reply-content').attr('placeholder', `@${comment_nickname}`);
        });
    });
}

/**
 * 显示评论区
 */
function show_comment_block(){
    $('.js-show-blog-comment-block').fadeOut('slow');
    $('.blog-comment-reply-block').fadeOut('slow');
    $('.blog-comment-block').fadeIn('slow');
}

/**
 * 隐藏评论区
 */
function hide_comment_block() {
    $('.blog-comment-block').fadeOut('slow');
    $('.js-show-blog-comment-block').fadeIn('slow');
}

/**
 * 显示回复区
 */
function show_reply_block() {
    $('.blog-comment-reply-block').fadeIn('slow');
    $('.blog-comment-block').fadeOut('slow');
    $('.js-show-blog-comment-block').fadeIn('slow');
}

/**
 * 隐藏回复区
 */
function hide_reply_block() {
    $('.blog-comment-reply-block').fadeOut('slow');
}