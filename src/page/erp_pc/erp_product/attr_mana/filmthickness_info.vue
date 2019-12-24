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
    const pageName = '膜厚资料';
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
                        { required: true, message: '请输入膜厚名称', trigger: 'blur' }
                    ],
                    'thick':[
                        { required: true, message: '请输入膜厚数值', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fname':[
                        { required: true, message: '请输入膜厚名称', trigger: 'blur' }
                    ],
                    'fcode':[
                        { required: true, message: '请输入膜厚代码', trigger: 'blur' }
                    ],
                    'thick':[
                        { required: true, message: '请输入膜厚数值', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatThick/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatThick/addMatThick',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatThick/updateMatThick',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatThick/deleteMatThick',
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
                        'name':'膜厚代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入膜厚代码',
                    },
                    {
                        'name':'膜厚名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'膜厚数值',
                        'prop':'thick',
                        'type':'number',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                ]
            }
        }
    }
</script>
