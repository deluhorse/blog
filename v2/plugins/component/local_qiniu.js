var Qiniu_upload = {
    initUpload: function (params) {
        var self = this;
        var filesArr = [];
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式,依次退化
            browse_button: params.btnId,         // 上传选择的点选按钮，**必需**
            uptoken_url: '/api/v3/plugins/qiniu/token/query',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
            unique_names: false,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
            save_key: false,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
            domain: params.domain,     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
            container: params.containerId,             // 上传区域 DOM ID，默认是 browser_button 的父元素，
            max_file_size: '2mb',             // 最大文件体积限制
            max_retries: 3,                     // 上传失败最大重试次数
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: params.containerId,          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
            chunk_size: '2mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
            filters: {
                max_file_size: '2mb',
                prevent_duplicates: true,
                // Specify what files to browse for
                mime_types: [
                    {title: "Image files", extensions: "jpg,gif,png,jpeg"} // 限定jpg,gif,png后缀上传
                ]
            },
            init: {
                'FilesAdded': function (up, files) {
                    // plupload.each(files, function (file) {
                    //     // 文件添加进队列后,处理相关的事情
                    // });
                },
                'BeforeUpload': function (up, file) {
                    // 每个文件上传前,处理相关的事情

                },
                'UploadProgress': function (up, file) {
                    // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function (up, file, info) {
                    var data = JSON.parse(info.response);
                    data['host'] = 1;
                    data.nick_name = file.name;

                    params.callback(data)
                },
                'Error': function (up, err, errTip) {
                    //上传出错时,处理相关的事情
                    console.log(errTip);
                    if (err.code === -600) {
                        // self.callComponent({
                        //     name: 'common.top_notifications',
                        //     data: {
                        //         'type': 'danger',
                        //         'msg': '文件大小不能超过2M'
                        //     }
                        // }, 'show')
                    } else if (err.code === -601) {
                        // self.callComponent({
                        //     name: 'common.top_notifications',
                        //     data: {
                        //         'type': 'danger',
                        //         'msg': '请上传jpg、gif、png、jpeg格式的图片'
                        //     }
                        // }, 'show')
                    } else {
                        // self.callComponent({
                        //     name: 'common.top_notifications',
                        //     data: {
                        //         'type': 'danger',
                        //         'msg': errTip
                        //     }
                        // }, 'show')
                    }
                    // wc.isFunction(params.error)&& params.error(up, err, errTip);
                },
                'UploadComplete': function (up) {
                    // //队列文件处理完毕后,处理相关的事情
                    // wc.isFunction(params.confirm)&& params.confirm(filesArr);
                    // wc.isFunction(params.upload_complete)&& params.upload_complete(up);
                    filesArr = [];
                    up.files.splice(0, up.files.length); //将之前上传的文件清空
                },
                'Key': function (up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效

                    return guid();
                }
            }
        });

        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}