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
    const pageName = '表面描述';
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
                        { required: true, message: '请输入颜色名称', trigger: 'blur' }
                    ],
                    'inactive':[
                        { required: true, message: '请输入状态', trigger: 'change' }
                    ],
                    'colorTypeName':[
                        { required: true, message: '请输入颜色大类', trigger: 'change' }
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
                    ],
                    'colorTypeName':[
                        { required: true, message: '请输入颜色大类', trigger: 'change' }
                    ]


                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata/Mat/MatColorDescribeController/selectByQueryModel',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatColorDescribeController/addColorDescribe',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatColorDescribeController/updateColorDescribe',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatColorDescribeController/deleteColorDescribe',
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
                        'placeholder':'输入表面描述',
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
                        'name':'状态',
                        'prop':'inactive',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': this.getStaticList('whetherUse'),
                        'showRemark':true,
                        'disabledInput': true

                    },
                    {
                        'name':'颜色大类',
                        'prop':'fid',
                        'type':'select',
                        'isMainSearch':false,
                        'isMain':false,
                        'selectList': [],
                        'showRemark':true,

                    },
                    {
                        'name':'备注',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                        'disabledInput': true

                    }
                ]
            }
        },
        mounted() {
            this.getStripType()
        },
        methods: {
            //颜色大类下拉接口
            getStripType() {
                this.fetch('/basedata/Mat/MatColorTypeController/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            //console.log(result)
                            this.propData[4].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.propData[4].selectList = [];
                        }
                    })
            }
        }
    }
</script>
