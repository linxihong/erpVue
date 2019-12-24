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
    const pageName = '喷码要求';
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
                        { required: true, message: '请输入喷码要求名称', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入喷码要求代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入喷码要求名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/MdmMarkMethodController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/MdmMarkMethodController/addMdmMarkMethod',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/MdmMarkMethodController/updateMdmMarkMethod',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/MdmMarkMethodController/deleteMdmMarkMethod',
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
                        'name':'喷码要求代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入喷码要求代码/名称',
                    },
                    {
                        'name':'喷码要求名称',
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
