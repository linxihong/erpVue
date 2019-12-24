<template>
    <CommonPage
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData"
        :formProp="formProp">
    </CommonPage>
</template>
<script>
    const pageName = '价格区域';
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
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],

                },
                ajaxConfig: {
                    dataObj: {
                        url: '/oms/pqm/PqmRegionController/selectPqmRegion',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/oms/pqm/PqmRegionController/insertPqmRegion',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/oms/pqm/PqmRegionController/updatePqmRegion',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/oms/pqm/PqmRegionController/deletePqmRegion',
                        method: 'fetch'
                    }
                },
                formProp: [
                    {
                        'name':'fid',
                        'prop':'fid',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,

                    },
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入价格区域代码',
                        'width':'180',
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'状态',
                        'prop':'inactive',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,

                    },
                ],
                propData: [
                    {
                        'name':'fid',
                        'prop':'fid',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,

                    },
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入价格区域代码',
                        'width':'180',
                    },
                    {
                        'name':'名称',
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

                    },
                ]
            }
        }
    }
</script>
