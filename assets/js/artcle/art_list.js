$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义梅花时间的的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }
    //定义补0方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1, //页码
        pagesize: 2, //每页几条数据
        cate_id: '', //文章分类
        state: ''   //发布状态
    }
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }


        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        //获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //为查询对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新筛选条件 重新渲染
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用
        laypage.render({
            elem: 'pageBox',
            counl: total,
            limit: q.pagesize,
            currt: q.pagenum,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            //分页切换触发
            jump: function (obj, first) {
                q.pagenum = obj.currt
                q.pagesize = obj.limit
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})