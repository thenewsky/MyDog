<#assign l_ent_name=entity.entityName?lower_case/>
<#assign pagination=entity.pagination/>
;(function (global) {
    'use strict';

    var ${l_ent_name}Table = $('#${l_ent_name}Tb');
    var tpl = '<tr><#list entity.fields as field><td>{{ ${field.fieldName} }}</td></#list><td><button class="btn btn-sm btn-${l_ent_name}-edit" data-toggle="modal" data-target="#${l_ent_name}Modal" data-whatever="{{ id }}"><i class="fa fa-edit"></i></button><button class="btn btn-sm btn-${l_ent_name}-del" data-toggle="modal" data-target="#${l_ent_name}DelModal" data-whatever="{{ id }}"><i class="fa fa-trash"</button></td></tr>';
    var lists = [];
    var editModal = $('#${l_ent_name}Modal');
    var delModal = $('#${l_ent_name}DelModal');
    <#if pagination.enabled >
    var currentPage = 1;
    var pageSize = ${pagination.pageSize}
    </#if>

    function init() {

        <#if pagination.enabled >
        getPage(1, pageSize);
        // 分页事件
        $(".${l_ent_name}Box").find('.pagination').on('click','.p-item',function(e){
            e.preventDefault();
            var _this = $(e.target);
            getPage(_this.html(),pageSize);
        });
        $(".${l_ent_name}Box").find('.pagination').on('click','.p-prev',function(e){
            e.preventDefault();
            // 当前页码 － 1
            getPage(currentPage - 1,pageSize);
        });
        $(".${l_ent_name}Box").find('.pagination').on('click','.p-next',function(e){
            e.preventDefault();
            // 当前页码 ＋ 1
            getPage(currentPage + 1,pageSize);
        });
        <#else>
        getAll();
        </#if>

        // 新增 ｜ 编辑
        editModal.on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);
            var id = button.data('whatever');
            var modal = $(this);

            if(id && id!=''){
                modal.find('#id_${l_ent_name}_edit').val(id);
                modal.find('.modal-title em').html('编辑');
                $_ajax.get('/${l_ent_name}/'+id).then(function (res) {
                    if(res && res.resCode == 200){
                        var d = res.data || {};
                        modal.find('#${l_ent_name}').val(d.name || '');
                        modal.find('#${l_ent_name}_'+d.available).prop('checked',true);
                    }
                });
            } else {
                modal.find('.modal-title em').html('新建');
            }
        });
        $(".${l_ent_name}Box").on('click','.btn-${l_ent_name}-save',function(e){
            // save data
            var id = editModal.find('#id_${l_ent_name}_edit').val();
            var flag = $("#${l_ent_name}Form").data("bootstrapValidator").isValid();
            if(flag){
                var param = {
                    <#list entity.fields as f>
                    <#assign t=f["viewProp"].type/><#assign fn=f.fieldName/>
                    <#if t=="radio">
                    '${fn}':$("input[name='${fn}']").prop("checked")
                    <#else>
                    '${fn}':$("#${fn}").val()
                    </#if>
                    <#if f_has_next>,</#if>
                    </#list>
                };
                if(id && id!=''){
                    edit(param);
                } else {
                    add(param);
                }
            }
        });
        // 初始化校验
        $("#${l_ent_name}Form").bootstrapValidator({
            message: '校验不通过',
            feedbackIcons: {        //提示图标
                valid: 'fa fa-check-square-o',
                invalid: 'fa fa-times',
                validating: 'fa fa-exclamation'
            },
            fields:{
                <#list entity.fields as f>
                ${f.fieldName}:{
                <#if f.validates??>
                    <#assign valids = f.validates />
                    validators:{
                    <#list valids as v>
                        <#--"${v}" ---->
                        <#--<#assign  res = v?matches(r"(NotNull)[\(]")>-->
                        <#assign  res = v?matches(r"(^@\S+)[(]") />
                        <#list res as m>
                        <#if m?groups[1] == "@NotNull">
                        notEmpty: {
                            message: "${f.label}是必填的,不能为空"
                        }
                        </#if>
                        <#if m?groups[1] =="@Size">
                        stringLength: {
                            min: 6,
                            max: 18,
                            message: "${f.label}长度为{6}-{18}个字符"
                        }
                        </#if>
                        <#if m?groups[1] == "@Pattern">
                        regexp: {
                            regexp: /^[A-Za-z0-9]+$/,
                            message: "${f.label}格式不正确"
                        }
                        </#if>
                        <#if m?groups[1] == "@DecimalMax">
                        <#assign hasAge = true />
                        regexp: {
                            regexp:/(9[0-9])|([1-8][0-9])/,
                            message: "${f.label}数值不能大于{99}"
                        }
                        </#if>
                        <#if m?groups[1] == "@DecimalMin">
                        regexp: {
                            regexp: /(1[1-8])|[2-9][0-9]/,
                            message: "${f.label}数值不能小于{18}"
                        }
                        </#if><#if v_has_next>,</#if>
                        </#list>

                        <#--<#if res>-->
                        <#--<#if res?groups[1] == "@NotNull">-->
                        <#--notEmpty: {-->
                            <#--message: "${f.label}是必填的,不能为空"-->
                        <#--}-->
                        <#--</#if>-->

                        <#--</#if>-->
                    </#list>
                    }
                </#if>
                }
                <#if f_has_next>,</#if>
                </#list>
            }
        });

        delModal.on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);
            var id = button.data('whatever');
            var modal = $(this);

            if(id && id!=''){
                modal.find('#id_${l_ent_name}_del').val(id);
            }
        });
        $(".${l_ent_name}Box").on('click','.btn-${l_ent_name}-delete',function(e){
            // delete
            var id = delModal.find('#id_${l_ent_name}_del').val();
            if(id && id!=''){
                del(id);
            }else{
                delModal.modal('hide');
            }
        });

    }


    function getAll() {
        $_ajax.get('/${l_ent_name}').then(function (res) {
            if(res.resCode == 200 && res.data){
                var d = res.data;
                var lists = [];
                if(Utils.isArray(d) && d.length>0){
                    for(var i=0,l=d.length;i<l;i++){
                        lists.push(Utils.parseTemplate(tpl,d[i]));
                    }

                    ${l_ent_name}Table.find('tbody').html(lists.join(''));
                }
            }
        });
    }
    // 分页数据
    function getPage(pageIndex,pageSize) {
        $_ajax.get('/${l_ent_name}/page?pageNum='+pageIndex+'&pageSize='+pageSize).then(function (res) {
            if(res && res.resCode == 200){
                var d = res.data;
                var lists = [];
                if(Utils.isArray(d) && d.length>0){
                    for(var i=0,l=d.length;i<l;i++){
                        lists.push(Utils.parseTemplate(tpl,d[i]));
                    }

                    ${l_ent_name}Table.find('tbody').html(lists.join(''));

                    // 处理分页
                    refreshPagination(res.pageNum || 1,res.pageSize || 10,res.total || 0,res.pages || 0)
                }
            }
        });
    }
    // 刷新分页
    function refreshPagination(pageIndex,pageS,total,pages){
        if(total == 0 || pages == 0) return;
        currentPage = pageIndex;
        pageSize = pageS;
        var pagin = $('#pagination');
        var pas = [];
        pas.push('<li'+(pageIndex==1?' class="disabled"':'')+'><a href="#" aria-label="Previous" class="p-prev"><span aria-hidden="true">&laquo;</span></a></li>');
        for(var i=1;i<=pages;i++){
            pas.push('<li'+(i == pageIndex?' class="active"':'')+'><a href="#" class="p-item">'+i+'</a></li>');
        }
        pas.push('<li'+(pageIndex==pages?' class="disabled"':'')+'><a href="#" aria-label="Next" class="p-next"><span aria-hidden="true">&raquo;</span></a></li>');
        pagin.html(pas.join(''));
    }


    function add(obj) {
        if(!Utils.isObject(obj)){
            return;
        }
        $_ajax.post('/${l_ent_name}',obj).then(function (res) {
            if(res && res.resCode == 200){
                // 刷新数据
                <#if pagination.enabled >
                getPage(currentPage,pageSize)
                <#else>
                getAll();
                </#if>
                editModal.find('input').val('');
                editModal.modal('hide');
            }
        });
    }
    function edit(obj) {
        if(!Utils.isObject(obj)){
            return;
        }
        $_ajax.put('/${l_ent_name}/',obj).then(function (res) {
            if(res && res.resCode == 200){
                // 刷新数据
                <#if pagination.enabled >
                getPage(currentPage,pageSize)
                <#else>
                getAll();
                </#if>
                editModal.find('input').val('');
                editModal.modal('hide');
            }
        });
    }
    function del(id) {
        $_ajax.del('/${l_ent_name}/'+id).then(function (res) {
            if(res && res.resCode == 200){
                // 刷新数据
                <#if pagination.enabled >
                getPage(currentPage,pageSize)
                <#else>
                getAll();
                </#if>
                delModal.modal('hide');
            }
        });
    }

    $(document).ready(function() {
        init();
    });

}(window,undefined))

