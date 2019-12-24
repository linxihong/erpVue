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
    const pageName = '机台棒径';
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
                        { required: true, message: '请输入机台棒径名称', trigger: 'blur' }
                    ],
                    'diameter':[
                        { required: true, message: '请输入棒径', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入机台棒径代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入机台棒径名称', trigger: 'blur' }
                    ],
                    'diameter':[
                        { required: true, message: '请输入棒径', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatAlDiameterController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatAlDiameterController/addMatAlDiameter',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatAlDiameterController/updateMatAlDiameter',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatAlDiameterController/deleteMatAlDiameter',
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
                        'name':'机台棒径代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'isRead':true,
                        'placeholder':'输入机台棒径代码/名称',
                    },
                    {
                        'name':'机台棒径名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'棒径',
                        'prop':'diameter',
                        'type':'number',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                    }
                ]
            }
        }
    }
</script>
