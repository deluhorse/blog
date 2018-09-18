/**
 * core.js
 * 核心
 * 解析路由
 * 注册控制器对象、数据对象、组件对象、视图对象并加载它们
 * author: onlyfu
 * update: 2017-01-13
 */
var Core = {

    /**
     * POST请求
     * @param url
     * @param params
     * @param on_success
     * @param on_error
     * @param header
     * @private
     */
    _post: function (url, params, on_success, on_error){
        this._ajax('POST', url, params, on_success, on_error)
    },

    /**
     * GET请求
     * @param url
     * @param params
     * @param on_success
     * @param on_error
     * @private
     */
    _get: function(url, params, on_success, on_error){
        this._ajax('GET', url, params, on_success, on_error)
    },

    /**
     * AJAX请求
     * @param options 参数对象
     */
    _ajax: function (type, url, params, on_success, on_error) {

        var xhr = null;
        try {
            if (window.XMLHttpRequest) {
                xhr = new window.XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
            }
        } catch (e) {
            console.log(e)
        }

        if (!xhr) {
            console.log('无法创建XMLHttpRequest对象');
            return false;
        }

        // 针对某些特定版本的mozillar浏览器的BUG进行修正
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }

        xhr.open(type, url, true);
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        var para = '';
        if (params) {
            for (var x in params) {
                var data_x = typeof params[x] === 'object' ? JSON.stringify(params[x]) : params[x];
                para += x + '=' + data_x + '&';
            }
            para = para.substring(0, para.length - 1);
            // console.log(para);
        }
        if (type == 'GET') {
            if (params) {
                var para = '';
                for (var x in params) {
                    var data_x = typeof params[x] === 'object' ? JSON.stringify(params[x]) : params[x];
                    para += x + '=' + data_x + '&';
                }
                para = para.substring(0, para.length - 1);
                xhr.open(type, url + '?' + para, true);
            }
            xhr.send();
        } else if (type == 'POST' || type == 'PUT') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            // if (options.headers) {
            //     for (var i in headers) {
            //         xhr.setRequestHeader(i, options.headers[i]);
            //     }
            // }
            xhr.send(para);
        } else if (type == 'DELETE') {
            // if (options.headers) {
            //     xhr.setRequestHeader("para", options.headers.para);
            // }
            xhr.send(null);
        }

        // 注册回调函数
        xhr.onreadystatechange = function () {
            // 0未初始化, 还没有调用send()方法
            // 1载入, 已调用send()方法，正在发送请求
            // 2载入完成, send()方法执行完成，已经接收到全部响应内容
            // 3交互, 正在解析响应内容
            // 4完成, 响应内容解析完成，可以在客户端调用了
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    var responseData;
                    try {
                        responseData = JSON.parse(xhr.response);
                    } catch (e) {
                        responseData = xhr.responseText;
                    }
                    on_success(responseData);
                } else {
                    on_error(xhr.responseText || 'error');
                }
            }
        };

        return xhr;
    }
};

// module.exports = Core
