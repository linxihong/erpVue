<template>
    <CommonPage
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>
<script>
    const pageName = '颜色大类';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                otherVariable: {
                    detailTitle: `${pageName}`,
                    addTitle: `新建${pageName}`,
                },
                editRules: {
                    'fname':[
                        { required: true, message: '请输入颜色大类名称', trigger: 'blur' }
                    ],
                    'fcode':[
                        { required: true, message: '请输入颜色大类代码', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入颜色大类代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入颜色大类名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatColorTypeController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatColorTypeController/addMatColorType',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatColorTypeController/updateMatColorType',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatColorTypeController/deleteMatColorType',
                        method: 'fetch'
                    }
                },
                propData: [
                    {
                        'name':'fid',
                        'prop':'fid',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                        'placeholder':'',
                    },
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入颜色大类代码',
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'showRemark':true,
                    }
                ]
            }
        }
    }
</script>
