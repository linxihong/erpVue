<template>
    <CommonPage
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>
<script>
    const pageName = '会计类型';
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
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Cst/AccountType/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Cst/AccountType/addAccountType',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Cst/AccountType/updateAccountType',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Cst/AccountType/deleteByFid',
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
                        'name':'会计类型代码',
                        'prop':'fCode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'会计类型名称',
                        'prop':'fName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'公司',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'排序',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'状态',
                        'prop':'inactive',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'备注',
                        'prop':'memo',
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
