$(function () {
    var larer = layui.layer
    var form = layui.form
    initArtCateList();
    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    //给添加类别绑定click事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });

    })
    //发请求发表类别 动态元素必须代理请求
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！')
                //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    // 给编辑添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出修改信息
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });

        var id = $(this).attr("data-id")
        console.log(id);
        //发起请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }

        })
    })
    //通过代理的形式，为修改分类 表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //为删除绑定
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('ok');
        var id = $(this).attr('data-id')
        //eg1
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
            layer.close(index);
        });


    })
})