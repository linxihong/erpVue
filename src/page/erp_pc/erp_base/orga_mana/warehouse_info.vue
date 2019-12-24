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
    const pageName = '仓库资料';
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
                        { required: true, message: '请输入仓库名称', trigger: 'blur' }
                    ],
                    'tel':[
                        { required: true, message: '请输入联系电话', trigger: 'blur' }
                    ],
                    'address':[
                        { required: true, message: '请输入生产基地', trigger: 'blur' }
                    ],

                    'inactive':[
                        { required: true, message: '请输入公司状态', trigger: 'change' }
                    ],
                    'dataState':[
                        { required: true, message: '请输入备注', trigger: 'change' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入仓库代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入仓库名称', trigger: 'blur' }
                    ],
                    'tel':[
                        { required: true, message: '请输入联系电话', trigger: 'blur' }
                    ],
                    'address':[
                        { required: true, message: '请输入生产基地', trigger: 'blur' }
                    ],

                    'inactive':[
                        { required: true, message: '请输入公司状态', trigger: 'change' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Wms/Storage/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Wms/Storage/addStorage',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Wms/Storage/updateStorage',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Wms/Storage/deleteStorage',
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
                        'width':'undefined',
                        'sortable':false
                    },
                    {
                        'name':'仓库代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'',
                        'width':'undefined',
                    },
                    {
                        'name':'仓库名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'undefined',
                    },
                    {
                        'name':'联系电话',
                        'prop':'tel',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'sortable':false
                    },
                    {
                        'name':'生产基地',
                        'prop':'address',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'公司状态',
                        'prop':'inactive',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'地址',
                        'prop':'address',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    }
                ]
            }
        }
    }
</script>
