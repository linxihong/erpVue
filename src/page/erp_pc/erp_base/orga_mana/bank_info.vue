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
    const pageName = '银行资料';
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
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    'dataState':[
                        { required: true, message: '请输入备注', trigger: 'change' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入银行代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入银行名称', trigger: 'blur' }
                    ],
                    'tel':[
                        { required: true, message: '请输入联系电话', trigger: 'blur' }
                    ],
                    'adress':[
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    'dataState':[
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/Bank/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/Bank/addBank',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/Bank/updateBank',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/Bank/deleteBank',
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
                        'name':'银行代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'输入银行代码',
                    },
                    {
                        'name':'银行名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'联系电话',
                        'prop':'tel',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'状态',
                        'prop':'dataState',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                    },
                    {
                        'name':'地址',
                        'prop':'adress',
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
                    }
                ]
            }
        }
    }
</script>
