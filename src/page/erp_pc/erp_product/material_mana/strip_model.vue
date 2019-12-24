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
    const pageName = '胶条型号';
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
                    'pvcTypeId':[
                        { required: true, message: '请输入胶条型号名称', trigger: 'blur' }
                    ],
                    'meterWght':[
                        { required: true, message: '请输入米重', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],

                    'pvcTypeId':[
                        { required: true, message: '请输入胶条型号名称', trigger: 'blur' }
                    ],
                    'meterWght':[
                        { required: true, message: '请输入米重', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请输入状态', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/PvcModel/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/PvcModel/addPvcModel',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/PvcModel/updatePvcModel',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/PvcModel/deletePvcModel',
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
                    },
                    {
                        'name':'胶条型号编码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入胶条型号编码',
                    },
                    {
                        'name':'胶条型号名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'胶条类型',
                        'prop':'pvcTypeId',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],
                    },
                    {
                        'name':'米重',
                        'prop':'meterWght',
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
                        'name':'排序',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
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
        },
        mounted() {
            this.getStripType()
        },
        methods: {
            getStripType() {
                this.fetch('/basedata/Mat/PvcType/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            console.log(result)
                            this.propData[3].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.propData[3].selectList = [];
                        }
                    })
            }
        }
    }
</script>
