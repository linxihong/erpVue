<template>
    <CommonPage
        ref="commonpage"
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :searchProp="searchProp"
        :propData="propData"
        :formProp="formProp"
        :isTreeTable="isTreeTable"
        :isOpenChild="true"
        :treeObject="treeObject"
        @toggleTree="toggleTree"
        @getFid="getFid"
    >
    </CommonPage>
</template>
<script>
    const pageName = '型号价格组';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                isTreeTable: true,
                excludeCode: null,
                otherVariable: {
                    detailTitle: `${pageName}`,
                    addTitle: `新建${pageName}`,
                    isMulSelect: false
                },
                treeObject: {
                    isNotList: true,
                    childField: 'fcode',
                    parentField: 'parentCode'
                },
                editRules: {
                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    'guidePrice':[
                        { required: true, message: '请填写市场单价', trigger: 'blur' }
                    ],
                    'mixPrice':[
                        { required: true, message: '请填写最低单价', trigger: 'blur' }
                    ],
                    'maxPrice':[
                        { required: true, message: '请填写最高单价', trigger: 'blur' }
                    ],
                    'currency':[
                        { required: true, message: '请填写货币', trigger: 'blur' }
                    ],
                    'uom':[
                        { required: true, message: '请填写单位', trigger: 'blur' }
                    ],
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    'guidePrice':[
                        { required: true, message: '请填写市场单价', trigger: 'blur' }
                    ],
                    'mixPrice':[
                        { required: true, message: '请填写最低单价', trigger: 'blur' }
                    ],
                    'maxPrice':[
                        { required: true, message: '请填写最高单价', trigger: 'blur' }
                    ],
                    'currency':[
                        { required: true, message: '请填写货币', trigger: 'blur' }
                    ],
                    'uom':[
                        { required: true, message: '请填写单位', trigger: 'blur' }
                    ],
                },
                ajaxConfig: {
                    defaultParams: {inactive: 0},
                    dataObj: {
                        url: '/oms/pqm/PqmModelGroupController/selectRouteGroupList',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/oms/pqm/PqmModelGroupController/addPriceList',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/oms/pqm/PqmModelGroupController/updatePriceList',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/oms/pqm/PqmModelGroupController/detelePriceList',
                        method: 'fetch'
                    }
                },
                searchProp: [
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入颜色价格组代码',
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
                        'name':'状态',
                        'prop':'inactive',
                        'type':'changeStatus',
                        'selectList': this.getStaticList('whetherUseAll'),
                        'isMainSearch':false,
                        'isMain':false,
                    },
                ],
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
                        'placeholder':'请输入颜色价格组代码',
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
                        'name':'上级代码',
                        'prop':'parentCode',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],
                    },
                    {
                        'name':'状态',
                        'prop':'inactive',
                        'type':'select',
                        'selectList': this.getStaticList('whetherUse'),
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'市场单价',
                        'prop':'guidePrice',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'成本单价',
                        'prop':'cstPrice',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'最低单价',
                        'prop':'mixPrice',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'最高单价',
                        'prop':'maxPrice',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,

                    },
                    {
                        'name':'货币',
                        'prop':'currency',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],

                    },
                    {
                        'name':'单位',
                        'prop':'uom',
                        'type':'select',
                        'isMainSearch':false,
                        'selectList': [],
                        'isMain':false,
                        'showRemark':true,
                        'isRead':true,

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
            this.getAllMatGroup();
            this.getCurrentType();
            this.getUom();
        },
        methods: {
            toggleTree(val) {
                val === 1 ? this.isTreeTable = false : this.isTreeTable = true;
            },
            getFid(row) {
                this.excludeCode = row.fcode;
                // 过滤下级
                this.getMatGroup()
            },
            getMatGroup() {
                this.fetch('/oms/pqm/PqmModelGroupController/selectRouteGroupList',{})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            let resultData = this.formatArray(result.data,'fcode','fcode');
                            resultData = this.deleteSelfandChild(resultData,this.excludeCode,'parentCode','fcode');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            },
            getAllMatGroup() {
                this.fetch('/oms/pqm/PqmModelGroupController/selectRouteGroupList',{})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            let resultData = this.formatArray(result.data,'fcode','fcode');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            },
            //获取货币类型
            getCurrentType() {
                this.getAjax('/oms/sys/DataDictionary/getCurrencyType')
                    .then(result => {
                        if(result.data) {
                            this.formProp[9].selectList = this.formatArray(result.data, 'dicttext', 'dicttext');
                        }else{
                            this.formProp[9].selectList =[];
                        }
                    })
            },

            //获取单位
            getUom() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30133')
                    .then(result => {
                        if(result.data) {
                            this.formProp[10].selectList = this.formatArray(result.data, 'dictText', 'dictText');
                        }else{
                            this.formProp[10].selectList =[];
                        }
                    })
            },


        }
    }
</script>
