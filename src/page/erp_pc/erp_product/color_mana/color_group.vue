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
    const pageName = '颜色分组';
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
                treeObject: {
                    isNotList: true,
                    childField: 'fcode',
                    parentField: 'parentId'
                },
                editRules: {
                    'fname':[
                        { required: true, message: '请输入颜色名称', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入颜色大类代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入颜色名称', trigger: 'blur' }
                    ]
                },
                ajaxConfig: {
                    defaultParams: {inactive: 0},
                    dataObj: {
                        url: '/basedata/Mat/MatColorGroupController/selectByQueryModelNoPage',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatColorGroupController/addMatColorGroup',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatColorGroupController/updateMatColorGroup',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatColorGroupController/deleteMatColorGroup',
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
                        'placeholder':'请输入颜色分组代码',
                        'width':'180'
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
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
                        'placeholder':'请输入颜色组代码',
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
                        'prop':'parentId',
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
                        'placeholder':'请输入颜色代码',
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
            this.getAllColorGroup();
        },
        methods: {
            toggleTree(val) {
                val === 1 ? this.isTreeTable = false : this.isTreeTable = true;
            },
            getFid(row) {
                this.excludeId = row.fid;
                // 过滤下级
                this.getColorGroup()
            },
            getColorGroup() {
                this.fetch('/basedata/Mat/MatColorGroupController/selectByQueryModelNoPage',{})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            let resultData = this.formatArray(result.data,'fcode','fcode');
                            resultData = this.deleteSelfandChild(resultData,this.excludeId,'parentId','fid');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            },
            getAllColorGroup() {
                this.fetch('/basedata/Mat/MatColorGroupController/selectByQueryModelNoPage',{})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            let resultData = this.formatArray(result.data,'fcode','fcode');
                            this.formProp[3].selectList = resultData;
                        }else {
                            this.formProp[3].selectList = [];
                        }
                    })
            },
        }
    }
</script>
