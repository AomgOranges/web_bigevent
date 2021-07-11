$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    //统一为有权限接口设置headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function (res) {
        // console.log('执行了');
        console.log(res);

        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //1 清空token
            localStorage.removeItem('token')

            location.href = '/login.html'
        }
    }

})