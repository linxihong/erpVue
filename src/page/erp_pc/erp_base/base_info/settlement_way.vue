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
    const pageName = '结算方式';
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
                        { required: true, message: '请输入结算方式名称', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入结算方式名称', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入结算方式名称', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/MdmSettlementMethodController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/MdmSettlementMethodController/addMdmSettlementMethod',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/MdmSettlementMethodController/updateMdmSettlementMethod',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/MdmSettlementMethodController/deleteMdmSettlementMethod',
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
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'结算方式代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入结算方式代码',
                        'width':'',
                    },
                    {
                        'name':'结算方式名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isRead':true,
                        'isMain':false,
                        'width':'',
                    },
                    {
                        'name':'重量结算',
                        'prop':'wghtSettleName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                    },{
                        'name':'面积结算',
                        'prop':'sqmSettleName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                    },
                ]
            }
        }
    }
</script>
