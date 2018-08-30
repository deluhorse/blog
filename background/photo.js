Qiniu_upload.initUpload({
    btnId: 'photo_upload',
    domain: 'http://oom122w4d.bkt.clouddn.com/',
    containerId: 'photo_preview',
    callback: function (params) {
        wc._post('/photo/create', params, query_photo);
    }
});

// 显示图片列表
function query_photo(){
    // 向后端请求图片数据
    wc._get('/photo/query', {}, function (res) {

        $('#photo_list').empty();

        for (let photo of res.data){

            $('#photo_list').append(`<li class="photo-item"><div style="height: 100%;"><img class="photo-display" src=${photo.img_url} /></div></li>`)
        }
    });
}

$(function () {
    query_photo();
});
