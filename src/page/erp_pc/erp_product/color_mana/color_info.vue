<template>
    <CommonPage
        :editRules="editRules"
        :addRules="addRules"
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData"
    >
    </CommonPage>
</template>
<script>
    const pageName = '色号资料';
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
                    isMulSelect: false,
                },
                editRules: {
                    'fname':[
                        { required: true, message: '请输入颜色名称', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入颜色大类代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入颜色名称', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ]
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatColorController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatColorController/addMatColor',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatColorController/updateMatColor',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatColorController/deleteMatColor',
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
                        'name':'代码',
                        'prop':'fcode',
                        'isRead':true,
                        'type':'normal',
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'输入颜色大类代码',
                        'width':'',
                    },
                    {
                        'name':'表面色号',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'英文颜色',
                        'prop':'enName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true
                    },
                    {
                        'name':'颜色大类',
                        'prop':'colorTypeName',
                        'type':'selectChange',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],
                        'disabledInput': true,
                        'selectParam': 'colorType',
                        'paramList': ['fid','fcode','fname'],
                        'reflectList': ['colorTypeId','colorTypeCode','colorTypeName']
                    },
                    {
                        'name':'颜色大类',
                        'prop':'colorTypeName',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledcolor':true
                    },
                    {
                        'name':'表面描述',
                        'prop':'colorDescribeName',
                        'type':'select',
                        'selectList': [],
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true
                    },
                    {
                        'name':'光泽度',
                        'prop':'gloss',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true
                    },
                    {
                        'name':'光粉/喷砂',
                        'prop':'sprayType',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true
                    },
                    {
                        'name':'木纹',
                        'prop':'isGrain',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true,
                        'selectList': this.getStaticList('isTrue'),
                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'disabledInput': true
                    },
                ]
            }
        },
        mounted(){
            this.getColorType();
            this.getChangeType();
        },
        methods:{
            getColorType(){
                this.fetch('/basedata/Mat/MatColorTypeController/selectByQueryModel',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.propData[4].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.propData[4].selectList = [];
                        }
                    })

            },
            getChangeType(){
                this.fetch('/basedata/Mat/MatColorDescribeController/selectByQueryModel',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.propData[5].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.propData[5].selectList = [];
                        }
                    })

            }
        }

    }
</script>
