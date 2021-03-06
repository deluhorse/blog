/**
 * @author: delu
 * @file: init.js
 * @time: 18/8/27 16:25
 */

var script_list = [
  '../core.js',
  '../base.js'
];

var nav_list = [
    {
        src: 'index.html',
        name: '主页'
    },
    {
        src: 'blog_list.html',
        name: '博客管理'
    },
    {
        src: 'photo.html',
        name: '资源库'
    },
    {
        src: 'about.html',
        name: '更新日志'
    },
    {
        src: 'mind_manager.html',
        name: '知识图谱'
    }
];

$(function () {

    for (let script_str of script_list){

        $("body").append(`<script src="${script_str}"></script>`);
    }

    for (let nav of nav_list){

        $('.navigation').append(`<a href=${nav.src} class="nav-item">${nav.name}</a>`);
    }
});