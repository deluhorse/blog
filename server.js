var http = require('http');
var querystring = require('querystring');
const fs = require('fs');
var Server = {

    init: function(local_port){
        /**
         * 读取配置文件
         */
        var result = JSON.parse(fs.readFileSync('/apps/conf/blog/blog_web.json'));
        var remote_port = parseInt(result.port);
        var host = result.host;
        this.run(local_port, host, remote_port);

    },
    run: function (local_port, host, remote_port) {
        /**
         * 1. 获取请求内容
         * 2. 组织参数请求转发
         * 3. 获取响应，执行回调函数
         */
        var self = this;
        http.createServer(function (req, res) {
            //请求静态资源
            if (self.check_static(req.url)){
                self.load_static(req.url, res)
            }
            else {
                // 1. 获取请求参数
                // 定义了一个post变量，用于暂存请求体的信息
                var post_params = '';

                // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
                req.on('data', function(chunk){
                    post_params += chunk;
                });
                // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
                req.on('end', function(){
                    // 2. 组织参数，请求转发，如果是静态资源则不必请求转发
                    var path = req.url;
                    console.log(path);
                    // 3. 获取响应，执行回调函数
                    var header = req.headers;
                    var headers = {
                        'user-agent': header['user-agent'],
                        'cookie': header.hasOwnProperty('cookie') ? header['cookie'] : '',
                        'content-type': header['content-type'] || 'application/x-www-form-urlencoded; charset=UTF-8'
                    };
                    var options = {
                        host: host,
                        path: path,
                        port: remote_port,
                        method: req.method,
                        headers: headers
                    };
                    self.send_request(options, res, post_params)
                });
            }
        }).listen(local_port)
    },
    // 向服务器发出请求
    send_request: function (options, response, data) {
        // 向远程服务器发请求
        var callback = function (res) {
            // 不断更新数据
            var headers = res.headers;
            var body = '';
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                // 数据接收完成
                console.log(body);
                var cookieList = headers['set-cookie'];
                if (cookieList) {
                    var cookieListLen = cookieList.length;
                    for (var i = 0; i < cookieListLen; i++) {
                        cookieList[i] = cookieList[i].replace(/Domain=.*;?/, 'Domain=localhost;Path=/;');
                    }
                    response.setHeader('Set-Cookie', cookieList.join(';'));
                }
                response.end(body)
            });
        };
        var req = http.request(options, callback);
        if (data){
            if (typeof data === 'string') {
                console.log('post_params: ' + data)
                req.write(data);
            } else {
                req.write(querystring.stringify(data));
            }
        }
        req.end()
    },
    /**
     * 加载静态文件
     * @param url
     * @param response
     */
    load_static: function (path, response) {
        // 返回url对应的页面
        var url = path.split('?')[0];
        var suffix = url.split('.');
        //设置响应头
        response.setHeader("Content-Type", this.static_content_type[suffix[suffix.length - 1]]);
        if (this.check_binary(url)){
            // 如果是二进制文件
            var content =  fs.readFileSync(url.substring(1),"binary");
            response.write(content,"binary"); //格式必须为 binary，否则会出错
            response.end();
        } else{
            try{
                const rr = fs.createReadStream(url.substring(1));
                var file_content = '';
                rr.on('readable', () => {
                    var file_data = rr.read();
                    if (file_data){
                        file_content += file_data;
                    }
                });
                rr.on('end', () => {
                    response.end(file_content);
                });
            } catch (e) {
                console.log('error')
            }
        }
    },
    check_static: function (path) {
        var url = path.split('?')[0];
        if (url.endsWith('.html') || url.endsWith('.css') || url.endsWith('.js') ||
            url.endsWith('.ico') || url.endsWith('.jpg') || url.endsWith('.woff2') ||
            url.endsWith('.woff') || url.endsWith('.ttf') || url.endsWith('.png')){
            return true;
        } else{
            return false;
        }
    },
    check_binary: function (url) {
        if (url.endsWith('.jpg') || url.endsWith('.ico')){
            return true;
        } else{
            return false;
        }
    },
    static_content_type: {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml"
    }
};

Server.init(3000);
