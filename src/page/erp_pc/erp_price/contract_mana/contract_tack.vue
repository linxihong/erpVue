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
    const pageName = '合同附件条款';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                otherVariable: {
                    detailTitle: `查看${pageName}`,
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
                    //TODO
                    dataObj: {
                        url: '',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '',
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
                        'name':'条款代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'条款类型',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'条款描述',
                        'prop':'pvcTypeId',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入条款描述',
                    },
                    {
                        'name':'条件字段',
                        'prop':'meterWght',
                        'type': 'select',
                        'isMainSearch': false,
                        'isMain': false,
                        'disabledInput': true,
                        'showRemark':true,
                        'selectList': []
                    },
                    {
                        'name':'逻辑比较',
                        'prop':'meterWght',
                        'type': 'select',
                        'isMainSearch': false,
                        'isMain': false,
                        'disabledInput': true,
                        'showRemark':true,
                        'selectList': []
                    },
                    {
                        'name':'条件值',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'showRemark':true,
                    },
                    {
                        'name':'费用金额',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'showRemark':true,
                    },
                    {
                        'name':'生效日期',
                        'prop':'',
                        'type':'date',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'showRemark':true,
                    },
                    {
                        'name':'失效日期',
                        'prop':'',
                        'type':'date',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'showRemark':true,
                    },
                    {
                        'name':'备注',
                        'prop':'',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'showRemark':true,
                    },

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
                            this.propData[3].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.propData[3].selectList = [];
                        }
                    })
            }
        }
    }
</script>
