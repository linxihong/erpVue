<template>
    <div class="page-secondnav page-commonnav create-code-wrap">
        <div class="create-code-left">
            <el-form :model="codeForm" label-width="120px">
                <el-form-item label="模块名称">
                    <el-input v-model="codeForm.moduleName"></el-input>
                </el-form-item>
                <el-form-item label="获取接口">
                    <el-input v-model="codeForm.getUrl"></el-input>
                </el-form-item>
                <el-form-item label="新增接口">
                    <el-input v-model="codeForm.addUrl"></el-input>
                </el-form-item>
                <el-form-item label="修改接口">
                    <el-input v-model="codeForm.updateUrl"></el-input>
                </el-form-item>
                <el-form-item label="删除接口">
                    <el-input v-model="codeForm.deleteUrl"></el-input>
                </el-form-item>
                <el-col :span="12">
                    <el-form-item label="右区域占比">
                        <el-input v-model="codeForm.contentWidth"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否多选">
                        <el-select v-model="codeForm.isMulSelect" style="width: 100%">
                            <el-option :value="true" label="是"></el-option>
                            <el-option :value="false" label="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-table stripe max-height="325" :data="codeForm.fieldList" style="width: 100%" class="console-mt5">
                <el-table-column width="55" align="center" :render-header="(h, col) => renderTable(h, col)">
                    <template slot-scope="scope">
                        <i :class="scope.row._curdFlag==='d'?'icon-item revert-icon':'table-icon el-icon-remove' " @click="deleteRow(scope.$index)"></i>
                    </template>
                </el-table-column>
                <template v-for="(item,index) in rowParams">
                    <el-table-column align="center" :label="item.fname" v-if="item.ftype === 'normal'">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row[item.fcode]"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="item.fname" v-if="item.ftype === 'select'">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row[item.fcode]">
                                <el-option :value="true" label="是"></el-option>
                                <el-option :value="false" label="否"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" :label="item.fname" v-if="item.ftype === 'typeselect'">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row[item.fcode]">
                                <el-option
                                    v-for="(o,i) in selectType"
                                    :key="i"
                                    :label="o.label"
                                    :value="o.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="console-mt5">
                <el-button @click="generateCode">生成</el-button>
                <el-button @click="init(true)">重置</el-button>
            </div>
        </div>
        <div class="create-code-right">
            <el-input ref="copyContent" type="textarea" v-model="vueContent" :rows="30"></el-input>
            <el-button @click="copyCode" class="console-mt2">复制</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tempContent: '',
                vueContent: '',
                rowParams: [
                    {ftype:'normal',fname:'字段名称',fcode:'name'},
                    {ftype:'normal',fname:'字段代码',fcode:'prop'},
                    {ftype:'typeselect',fname:'类型',fcode:'type'},
                    {ftype:'select',fname:'主查询',fcode:'isMainSearch'},
                    {ftype:'select',fname:'主键',fcode:'isMain'},
                    {ftype:'normal',fname:'提示',fcode:'placeholder'},
                    {ftype:'normal',fname:'宽度',fcode:'width'},
                    {ftype:'select',fname:'是否排序',fcode:'sortable'}
                ],
                selectType: [
                    {label:'normal',value:'normal'},
                    {label:'select',value:'select'}
                ],
                rowForm: {},
                copyList: [],
                codeForm: {
                    moduleName: '',
                    getUrl: '',
                    addUrl: '',
                    updateUrl: '',
                    deleteUrl: '',
                    contentWidth: '',
                    isMulSelect: false,
                    fieldList: [
                        {name:'fid',prop:'fid',type:'normal',isMainSearch:false,isMain:true,placeholder:'',width:'',sortable:false,_curdFlag:'c'},
                        {name:'代码',prop:'fcode',type:'normal',isMainSearch:true,isMain:false,placeholder:'',width:'',sortable:true,_curdFlag:'c'},
                        {name:'名称',prop:'fname',type:'normal',isMainSearch:false,isMain:false,placeholder:'',width:'',sortable:true,_curdFlag:'c'},
                        {name:'状态',prop:'dataState',type:'select',isMainSearch:false,isMain:false,placeholder:'',width:'',sortable:false,_curdFlag:'c'},
                        {name:'备注',prop:'remark',type:'normal',isMainSearch:false,isMain:false,placeholder:'',width:'',sortable:false,_curdFlag:'c'}
                    ]
                }
            }
        },
        mounted() {
            this.copyList = this.$lodash.cloneDeep(this.codeForm.fieldList);
        },
        methods: {
            init(isRefresh = false) {
                this.vueContent = ``;
                let tempList = [];
                if(!isRefresh) {
                    this.codeForm.fieldList.forEach(item => {
                        let tempItem = {};
                        tempItem = `
                            {
                                'name':'${item.name}',
                                'prop':'${item.prop}',
                                'type':'${item.type}',
                                'isMainSearch':${item.isMainSearch},
                                'isMain':${item.isMain},
                                'selectList': this.getStaticList('whetherUse'),
                                'placeholder':'${item.placeholder}',
                                'width':'${item.width}',
                                'sortable':${item.sortable}
                            }`;
                        tempList.push(tempItem)
                    });
                    this.codeForm.fieldList = tempList;
                }else {
                    this.codeForm = {};
                    this.codeForm.fieldList = this.copyList;
                }
                let tempI =`<template>
    <CommonPage
        :otherVariable="otherVariable"
        :ajaxConfig="ajaxConfig"
        :propData="propData">
    </CommonPage>
</template>
`;
                let tempII = `
    const pageName = '${this.codeForm.moduleName}';
    import CommonPage from '$src/components/CommonPage'
    export default {
        components: {
            CommonPage
        },
        data() {
            return {
                otherVariable: {
                    contentWidth: ${this.codeForm.contentWidth},
                    detailTitle: \`查看\${pageName}\`,
                    addTitle: \`新建\${pageName}\`,
                    isMulSelect: ${this.codeForm.isMulSelect}
                },
                ajaxConfig: {
                    dataObj: {
                        url: '/basedata${this.codeForm.getUrl}',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata${this.codeForm.addUrl}',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata${this.codeForm.updateUrl}',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata${this.codeForm.deleteUrl}',
                        method: 'fetch'
                    }
                },
                propData: [${this.codeForm.fieldList}
                ]
            }
        }
    }
`;
                this.vueContent = ``;
                let tempIII = '<script>'+tempII+'</'+'script>';
                this.tempContent = tempI + tempIII;
            },
            generateCode() {
                this.init();
                this.vueContent = this.tempContent;
                this.codeForm.fieldList = this.$lodash.cloneDeep(this.copyList);
                this.$message({
                    type:'success',
                    message:'生成代码成功'
                })
            },
            copyCode() {
                window.getSelection().selectAllChildren(this.$refs.copyContent.$el);
                document.execCommand ("Copy");
                this.$message({
                    type:'success',
                    message:'复制成功'
                })
            },
            renderTable(h, {column}) {
                return(<i class="table-icon plus-icon el-icon-circle-plus" title="新增" on-click={ () => this.addRow() }/>)
            },
            addRow() {
                this.rowForm._curdFlag = 'c';
                this.codeForm.fieldList.unshift(this.$lodash.cloneDeep(this.rowForm));
            },
            deleteRow(index) {
                if(!this.codeForm.fieldList[index].id) {
                    this.codeForm.fieldList.splice(index, 1);
                }else {
                    if(this.codeForm.fieldList[index]._curdFlag === 'd') {
                        this.$set(this.codeForm.fieldList[index], "_curdFlag", "r");
                    }else {
                        this.$set(this.codeForm.fieldList[index], "_curdFlag", "d");
                    }
                }
            }
        }
    }
</script>
