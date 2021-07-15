$(function () {
    //加载文章分类
    var layer = layui.layer
    var form = layui.form
    initCate();
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败')
                }
                // 调用模板
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //记得调用form.render()
                form.render()
            }
        })
    }
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为选择封面绑定
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    //coverFilecoverFilecoverFile change事件
    $('#coverFile').on('change', function (e) {
        //获取文件列表数据
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])

        //为裁剪区重新赋值
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //定义文章发布的状态
    var art_state = '已发布'
    //为村委草稿 绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于表单创建一个Formdata
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)

                //发起请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/artcle/art_list.html'
            }
        })
    }
})