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
    const pageName = '装车方式';
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
                        { required: true, message: '请输入装车方式名称', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入装车方式代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入装车方式名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mdm/LoadMethod/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mdm/LoadMethod/addLoadMethod',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mdm/LoadMethod/updateLoadMethod',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mdm/LoadMethod/deleteLoadMethod',
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
                        'name':'装车方式代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'请输入装车方式代码',
                        'width':'',
                        'isRead':true,
                    },
                    {
                        'name':'装车方式名称',
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
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    }
                ]
            }
        }
    }
</script>
