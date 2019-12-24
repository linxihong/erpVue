<template>
    <CommonPage
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>
<script>
    const pageName = '会计科目';
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
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Cst/AccountSubject/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Cst/AccountSubject/addAccountSubject',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Cst/AccountSubject/updateAccountSubject',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Cst/AccountSubject/deleteAccountSubject',
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
                        'name':'会计科目代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':false
                    },
                    {
                        'name':'会计科目名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'undefined',
                        'width':'undefined',
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

                    },
                    {
                        'name':'状态',
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
