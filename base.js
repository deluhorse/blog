var host = 'http://localhost:3000/api/v3';
var wc = {
    param_dict: undefined,

    //默认错误处理函数, 如果在get和post时不传入错误处理函数on_error,则调用这个默认处理函数
    default_on_error: function(data){
        console.log(data);
    },
    /**
     *
     * @param url         请求url, 不包含服务器域名
     * @param params      请求参数, 字典
     * @param on_success  http请求成功回调函数
     * @param on_error    http请求失败回调函数
     * @private
     */
    _get: function (url, params, on_success, on_error) {
        if (!on_error){
            on_error = this.default_on_error
        }
        Core._get(host + url, params, function(data){
            if (data.code === 1007){
                // 用户未登录, 跳转至登陆页
                location.assign('login.html');
            } else if (data.code != 0){
                on_error(data);
            } else {
                // 成功获取数据, 则执行回调函数
                on_success(data);
            }
        }, on_error);
    },
    _post: function (url, params, on_success, on_error) {
        if (!on_error){
            on_error = this.default_on_error
        }
        Core._post(host + url, params, function (data) {
            if (data.code === 1007){
                // 用户未登录, 跳转至登陆页
                location.assign('login.html');
            } else if (data.code != 0){
                on_error(data);
            } else {
                // 成功获取数据, 则执行回调函数
                on_success(data);
            }
        }, on_error);
    },
    /**
     * 获取路径上的参数
     */
    get_params: function(){
        if (!this.param_dict){
            this.param_dict = {};
            var params_str = location.search.replace('?', '');
            var param_item_str_list = params_str.split('&');
            for( var index in param_item_str_list){
                var param_item = param_item_str_list[index].split('=');
                if (param_item.length === 2){
                    this.param_dict[param_item[0]] = param_item[1];
                } else{
                    this.param_dict[param_item[0]] = null;
                }
            }
        }
        return this.param_dict;
    },
    /**
     * 用指定模板渲染某个区域
     * @param el        需要被渲染的区域
     * @param data      渲染的数据
     * @param template_id  渲染使用的模板编号
     */
    output: function (el, data, template_id) {

    }
};
