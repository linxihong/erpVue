<template>
    <CommonPage
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :searchProp="searchProp"
        :propData="propData"
        :formProp="formProp"
    >
    </CommonPage>
</template>
<script>
    const pageName = '价目信息';
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
                    ]
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
                    defaultParams: {inActive: 0},
                    dataObj: {
                        url: 'oms/pqm/PqmPriceListController/selectPriceList',
                        method: 'fetch',
                    },
                    addObj: {
                        url: 'oms/pqm/PqmPriceListController/addPriceList',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: 'oms/pqm/PqmPriceListController/updatePriceList',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: 'oms/pqm/PqmPriceListController/detelePriceList',
                        method: 'fetch'
                    }
                },
                searchProp: [
                    {
                        'name':'价目表代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入价目表代码',
                        'width':'180',
                    },
                    {
                        'name':'价目表名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'状态',
                        'prop':'inActive',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
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
                        'name':'价目表代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入价目表代码',
                        'width':'180',
                    },
                    {
                        'name':'价目表名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'价目表类型',
                        'prop':'listType',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],
                    },
                    {
                        'name':'状态',
                        'prop':'inActive',
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
                        'name':'价目表代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入价目表代码',
                        'width':'180',
                    },
                    {
                        'name':'价目表名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'价目表类型',
                        'prop':'listType',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,
                    }
                ]
            }
        },
        mounted() {
            this.getStripType()
        },
        methods: {
            //价目表类型
            getStripType() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30129',{})
                    .then(result => {
                        if(result.data) {
                            this.formProp[3].selectList = this.formatArray(result.data, 'dictText', 'dictText');
                        }else{
                            this.formProp[3].selectList=[];
                        }
                    })
            }
        }

    }
</script>
