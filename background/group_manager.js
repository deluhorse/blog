/**
 * @author: delu
 * @file: mind_manager.js
 * @time: 18/9/6 10:22
 */
var api_dict = {
    create_group: '/blog/group/create',
    query_group: '/blog/group/query',
    delete_group: '/blog/group/delete',
    update_group: '/blog/group/update'
};

// 不同深度显示的颜色不同
var tag_color_dict = {
    '1': {'background-color': 'cornflowerblue', 'color': 'white'},
    '2': {'background-color': 'greenyellow'},
    '3': {'background-color': 'mistyrose'},
    '4': {},
    '5': {},
    '6': {},
    '7': {}
};

$(function (e) {

    $('.mind-manager-content').delegate('.mind-manager-btn-expand', 'click', function (e) {
        var $target = $(e.currentTarget);

        if ($target.parent().next()){
            $target.parent().next().slideToggle();
        }
    });

    $('.mind-manager-content').delegate('.tag', 'blur', function (e) {
        var $target = $(e.currentTarget);

        wc._post(api_dict.update_group,
            {
                group_id: $target.data('group_id'),
                group_name: $target.text()
            }, function (res) {
                console.log(res);
            });
    });

    /**
     * 添加子元素
     */
    $('.mind-manager-content').delegate('.mind-manager-btn-add', 'click', function (e) {
        var $target = $(e.currentTarget);
        wc._post(
                api_dict.create_group,
                {
                    parent_group_id: $target.data('group_id'),
                    group_name: '新节点'
                },
                function(res){
                    if ($target.parent().next()){

                        var $li = $('<li></li>');

                        var $tag = $(`<div contenteditable="true" class="tag" data-group_id=${res.data.last_id}>新节点</div>`);

                        var $div = $('<div class="mind-manager-operate-group"></div>');

                        $div.append(`<button class="mind-manager-btn-add" data-group_id=${res.data.last_id}>add</button>`);
                        $div.append(`<button class="mind-manager-btn-remove" data-group_id=${res.data.last_id}>remove</button>`);
                        $div.append('<button class="mind-manager-btn-expand">expand</button>');

                        $tag.css(tag_color_dict['' + res.data.height]);

                        $li.append($tag);
                        $li.append($div);
                        $li.append('<ul></ul>');

                        $target.parent().next().append($li);
                    }
                }
            );
    });


    /**
     * 移除子元素
     */
    $('.mind-manager-content').delegate('.mind-manager-btn-remove', 'click', function (e) {

        var $target = $(e.currentTarget);

        wc._post(api_dict.delete_group,
            {group_id: $target.data('group_id')},
            function (res) {
                if ($target.parent().parent()){
                    $target.parent().parent().remove();
                }
            });
    });

    query_group();
});

function query_group() {

    wc._get(api_dict.query_group, {}, function (res) {

        $('.group-list').empty();

        build_sub_group($('.group-list'), res.data);

    });
}

function build_sub_group(group, sub_group_list) {

    for (let sub_group of sub_group_list){

        var $li = $('<li></li>');

        var $tag = $(`<div contenteditable="true" class="tag" data-group_id=${sub_group.group_id}>${sub_group.group_name}</div>`);

        var $div = $('<div class="mind-manager-operate-group"></div>');

        $div.append(`<button class="mind-manager-btn-add" data-group_id=${sub_group.group_id}>add</button>`);
        $div.append(`<button class="mind-manager-btn-remove" data-group_id=${sub_group.group_id}>remove</button>`);
        $div.append('<button class="mind-manager-btn-expand">expand</button>');

        $tag.css(tag_color_dict['' + sub_group.height]);
        $li.append($tag);
        $li.append($div);

        var $ul = $('<ul></ul>');

        if (sub_group.sub_group_list.length > 0){

            build_sub_group($ul, sub_group.sub_group_list);
        }

        $li.append($ul);

        group.append($li);
    }
}