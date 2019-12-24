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
    const pageName = '机台级别';
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
                        { required: true, message: '请输入机台级别名称', trigger: 'blur' }
                    ],
                    'level':[
                        { required: true, message: '请输入机台吨位', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入机台级别代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入机台级别名称', trigger: 'blur' }
                    ],
                    'level':[
                        { required: true, message: '请输入机台吨位', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/MdmMachineLevelController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/MdmMachineLevelController/addMdmMachineLevel',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/MdmMachineLevelController/updateMdmMachineLevel',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/MdmMachineLevelController/deleteMdmMachineLevel',
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
                        'name':'机台级别代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入机台级别代码'
                    },
                    {
                        'name':'机台级别名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'机台吨位',
                        'prop':'level',
                        'type':'number',
                        'isMainSearch':false,
                        'isMain':true,
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
