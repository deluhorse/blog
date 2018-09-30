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

var app = new Vue({
    el: '#app',
    data: function() {
        return {
            activeIndex: '1',
            currentDate: timestamp_to_str(Date.parse( new Date()) / 1000),
            blog_list: []
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        query_blog_detail(blog_id){
            location.assign(`blog_edit.html?blog_id=${blog_id}`);
        }
    }
});

$(function () {

    $('.btn-create-blog').on('click', function (e) {
        save_blog({
            content: ''
        })
    });

    query_blog_list();
});

function query_blog_list() {

    wc._get(api_dict.query_blog, {}, function (res) {

        var blog_list = res.data.blog_list;

        app.blog_list = blog_list;
    });
}

/**
 * 保存博文
 * @param blog_id
 */
function save_blog(params){

    wc._post(
        api_dict.create_blog,
        params,
        function (res) {
            var blog_id = res.data.blog_id;

            location.assign(`blog_edit.html?blog_id=${blog_id}`);
        }
    );
}