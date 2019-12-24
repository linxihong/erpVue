<template>
    <CommonPage
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>a
<script>
    const pageName = '工艺路线';
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
                        { required: true, message: '请输入工艺路线名称', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入工艺路线代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入工艺路线名称', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatRouteController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatRouteController/addMatRouteMaster',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatRouteController/updateMatRouteMaster',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatRouteController/deleteMatRouteMaster',
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
                        'name':'工艺路线代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入工艺路线代码/名称',
                    },
                    {
                        'name':'工艺路线名称',
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
