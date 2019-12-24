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
    const pageName = '工艺路线组';
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
                        { required: true, message: '请输入工艺组名称', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入工艺组代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入工艺组名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatRouteGroupController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatRouteGroupController/addMatRouteGroup',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatRouteGroupController/updateMatRouteGroup',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatRouteGroupController/deleteMatRouteGroup',
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
                        'name':'工艺组代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isRead':true,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'输入工艺组代码/名称',
                    },
                    {
                        'name':'工艺组名称',
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
                        'showRemark':true,
                    }
                ]
            }
        }
    }
</script>
