<template>
    <CommonPage
        ref="commonpage"
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData"
        :formProp="formProp"
        :isTreeTable="isTreeTable"
        @getFid="getFid">
        <template slot="other-common-btn">
            <el-button @click="toggleTree">切换</el-button>
        </template>
    </CommonPage>
</template>
<script>
    const pageName = '型材系列';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                isTreeTable: true,
                excludeId: null,
                otherVariable: {
                    detailTitle: `${pageName}`,
                    addTitle: `新建${pageName}`,
                    isMulSelect: false
                },
                editRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatSeriesController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatSeriesController/addMatSeries',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatSeriesController/updateMatSeries',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatSeriesController/deleteMatSeries',
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
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'placeholder':'请输入型材代码',
                        'width':'',
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name': '上级',
                        'prop': 'parentId',
                        'type': 'select',
                        'isMainSearch': false,
                        'isMain': false,
                        'disabledInput': true,
                        'selectList': []
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,
                    }
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
                        'type':'first',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入型号价格组代码',
                        'width':'180'
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

                    }
                ]
            }
        },
        mounted(){
            this.getAllStripType()
        },
        methods: {
            toggleTree() {
                this.isTreeTable = !this.isTreeTable;
                this.$refs.commonpage.getData();
            },
            getFid(row) {
                this.excludeId = row.fid;
                // 过滤下级
                this.getStripType()
            },
            getStripType() {
                this.fetch('/basedata/Mat/MatSeriesController/selectByQueryModel',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            let resultData = this.formatArray(result.data.list,'fcode','fid');
                            resultData = this.deleteSelfandChild(resultData,this.excludeId,'parentId','fid');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            },
            getAllStripType() {
                this.fetch('/basedata/Mat/MatSeriesController/selectByQueryModel',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            let resultData = this.formatArray(result.data.list,'fcode','fid');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            }
        }
    }
</script>
