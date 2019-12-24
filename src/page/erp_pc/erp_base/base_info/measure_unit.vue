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
    const pageName = '计量单位';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                otherVariable: {
                    contentWidth: 50,
                    detailTitle: `${pageName}`,
                    addTitle: `新建${pageName}`,
                },
                editRules: {
                    'uomName':[
                        { required: true, message: '请输入计量单位名称', trigger: 'blur' }
                    ],
                    'uomType':[
                        { required: true, message: '请输入单位类型', trigger: 'blur' }
                    ],
                    'isBaseUom':[
                        { required: true, message: '请输入基本单位', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'uom':[
                        { required: true, message: '请输入计量单位代码', trigger: 'blur' }
                    ],

                    'uomName':[
                        { required: true, message: '请输入计量单位名称', trigger: 'blur' }
                    ],
                    'uomType':[
                        { required: true, message: '请输入单位类型', trigger: 'blur' }
                    ],
                    'isBaseUom':[
                        { required: true, message: '请输入基本单位', trigger: 'blur' }
                    ],
                    'remark':[
                        { required: true, message: '请输入备注', trigger: 'change' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/Uom/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/Uom/addUom',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/Uom/updateUom',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/Uom/deleteUom',
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
                        'name':'计量单位代码',
                        'prop':'uom',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入计量单位代码',
                        'sortable':false
                    },
                    {
                        'name':'计量单位名称',
                        'prop':'uomName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                    },
                    {
                        'name':'单位类型',
                        'prop':'uomType',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                    },
                    {
                        'name':'基本单位',
                        'prop':'isBaseUom',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':''
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':''
                    }
                ]
            }
        }
    }
</script>
