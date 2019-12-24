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
    const pageName = '标签类型';
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
                        { required: true, message: '请输入标签类型名称', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入标签类型代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入标签类型名称', trigger: 'blur' }
                    ],
                },

                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/MdmLabelMethodController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/MdmLabelMethodController/addMdmLabelMethod',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/MdmLabelMethodController/updateMdmLabelMethod',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/MdmLabelMethodController/deleteMdmLabelMethod',
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
                        'name':'标签类型代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入标签类型代码/名称',
                    },
                    {
                        'name':'标签类型名称',
                        'prop':'fname',
                        'type':'normal',
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
