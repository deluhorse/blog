var app = new Vue({
    el: '#app',
    data: function() {
        return {
            action: host + '/photo/upload/create',
            visible: false,
            activeIndex: '2',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: []
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
});
// 显示图片列表
function query_photo(){
    // 向后端请求图片数据
    wc._get('/photo/query', {}, function (res) {

        $('#photo_list').empty();

        var file_list = [];

        for (let photo of res.data){

            $('#photo_list').append(`<li class="photo-item"><div style="height: 100%;"><img class="photo-display" src=${photo.img_url} /></div></li>`);

            file_list.push({
               name: photo.nick_name,
               url: photo.img_url
            });
        }
        app.fileList = file_list;
    });
}

$(function () {
    query_photo();
});
