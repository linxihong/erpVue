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
    const pageName = '涂层信息';
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
                    isMulSelect: false
                },
                editRules: {
                    'fname':[
                        { required: true, message: '请输入涂层名称', trigger: 'blur' }
                    ],
                    'coat':[
                        { required: true, message: '请输入涂层数', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入涂层代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入涂层名称', trigger: 'blur' }
                    ],
                    'coat':[
                        { required: true, message: '请输入涂层数', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatCoatController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatCoatController/addMatCoat',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatCoatController/updateMatCoat',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatCoatController/deleteMatCoat',
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
                    },
                    {
                        'name':'涂层代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'   输入涂层代码/名称',
                    },
                    {
                        'name':'涂层名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'涂层数',
                        'prop':'coat',
                        'type':'number',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,
                    }
                ]
            }
        }
    }
</script>
