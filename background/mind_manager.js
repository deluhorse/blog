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

$(function (e) {

    $('.mind-manager-content').delegate('.mind-manager-btn-expand', 'click', function (e) {
        var $target = $(e.currentTarget);

        if ($target.parent().next()){
            $target.parent().next().slideToggle();
        }
    });

    $('.mind-manager-content').delegate('span', 'blur', function (e) {
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

                        var $span = $(`<span contenteditable="true" data-group_id=${res.data.last_id}>新节点</span>`);

                        var $div = $('<div class="mind-manager-operate-group"></div>');

                        $div.append(`<button class="mind-manager-btn-add" data-group_id=${res.data.last_id}>add</button>`);
                        $div.append(`<button class="mind-manager-btn-remove" data-group_id=${res.data.last_id}>remove</button>`);
                        $div.append('<button class="mind-manager-btn-expand">expand</button>');

                        $li.append($span);
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

        var $span = $(`<span contenteditable="true" data-group_id=${sub_group.group_id}>${sub_group.group_name}</span>`);

        var $div = $('<div class="mind-manager-operate-group"></div>');

        $div.append(`<button class="mind-manager-btn-add" data-group_id=${sub_group.group_id}>add</button>`);
        $div.append(`<button class="mind-manager-btn-remove" data-group_id=${sub_group.group_id}>remove</button>`);
        $div.append('<button class="mind-manager-btn-expand">expand</button>');

        $li.append($span);
        $li.append($div);

        var $ul = $('<ul></ul>');

        if (sub_group.sub_group_list.length > 0){
            $span.css({'background-color': '#ddd'});
            build_sub_group($ul, sub_group.sub_group_list);
        }

        $li.append($ul);

        group.append($li);
    }
}