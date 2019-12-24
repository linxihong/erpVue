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
    const pageName = '材质资料';
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
                        { required: true, message: '请输入材质名称', trigger: 'blur' }
                    ],
                    'specialType':[
                        { required: true, message: '请输入合金类型', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入材质代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入材质名称', trigger: 'blur' }
                    ],
                    'specialType':[
                        { required: true, message: '请输入合金类型', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/Alloy/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/Alloy/insert',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/Alloy/update',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/Alloy/deleteByFid',
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
                        'name':'材质代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入材质代码/名称',
                    },
                    {
                        'name':'材质名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'合金类型',
                        'prop':'specialType',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                    }
                ]
            }
        }
    }
</script>
