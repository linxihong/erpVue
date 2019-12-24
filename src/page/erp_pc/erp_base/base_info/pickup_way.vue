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
    const pageName = '提货方式';
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
                        { required: true, message: '请输入提货方式名称', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入提货代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入提货方式名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/DeliveryMethod/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/DeliveryMethod/addDeliveryMethod',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/DeliveryMethod/updateDeliveryMethod',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/DeliveryMethod/deleteDeliveryMethod',
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
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'提货方式代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isRead':true,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'请输入提货代码',
                        'width':'',

                    },
                    {
                        'name':'提货方式名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'',
                        'width':''
                    },
                    {
                        'name':'状态',
                        'prop':'inactive',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'width':'',
                        'showRemark':true,
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
