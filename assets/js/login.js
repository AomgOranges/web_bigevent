
$(function () {
    //点击注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //从latui身上获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过form.verify()函数来自定义
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码输入不一致！'
            }
        }
    })

    //监听注册表单的提交
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {

                return layer.msg(res.message);
            }
            layer.msg('注册成功');

            //模拟自动跳转
            $('#link_login').click();
        })


    })
    //监听登录表单的提交
    $('#form_login').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // console.log(res.token);

                //将登录成功得到的token保存到localStorage
                localStorage.setItem('token', res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }


        })
    })


})

