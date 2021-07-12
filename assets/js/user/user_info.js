$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须1~6个字符'
            }
        }
    })
    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                //调用form.val()快速赋值

                form.val('formUserInfo', res.data)
            }

        })
    }

    //重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //监听表单的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        //发起AJAX
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //调用父元素的方法 重新渲染用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})