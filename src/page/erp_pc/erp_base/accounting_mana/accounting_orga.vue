<template>
    <CommonPage
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>
<script>
    const pageName = '会计组织';
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
                        url: '/basedata/Org/OrgAccount/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Org/OrgAccount/addOrgAccount',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Org/OrgAccount/updateOrgAccount',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Org/OrgAccount/deleteOrgAccount',
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
                        'name':'会计组织代码',
                        'prop':'fCode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'',
                        'sortable':false
                    },
                    {
                        'name':'会计组织名称',
                        'prop':'fName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',

                    },
                    {
                        'name':'销售公司',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',

                    },
                    {
                        'name':'供货公司',
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
                        'prop':'inactive ',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),

                    },
                    {
                        'name':'排序',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',
                        'width':'',
                        'sortable':true
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'placeholder':'',

                    }
                ]
            }
        }
    }
</script>
