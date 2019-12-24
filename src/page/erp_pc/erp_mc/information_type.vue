<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
        <div class="console-pt4 console-pb4" ref="btnHeight">
            <el-button class="ui-color3" @click="show_dialog('add')">新增</el-button>
            <!-- <el-button>删除</el-button> -->
            <i>
                <!-- <el-input style="width:200px;" placeholder="请输入类型名称/状态"></el-input>
                <el-button>
                    更多筛选条件<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button> -->
            </i>
        </div>

        <ZLCommonTable
            :tableData="tableData"
            :itemValues="itemValues"
            :tabHeight="tabHeight"
            @show="show_dialog"
            @save="save"
            @close="close"
            @delete="delrow">
        </ZLCommonTable>

        <!--新增、查看消息模板类型-->
        <el-dialog
            class="dialogDiv dialogDivII"
            :show-close="false"
            :top = "dialog_top"
            :visible.sync="typeVisible"
            @close="close('typeForm')">
            <div class="slideContent">
                <div class="leftDiv leftOffsetIII">
                    <el-button class="icon-setting-2 icon-close" @click="close('typeForm')"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="save('typeForm')"></el-button>
                </div>
                <div class="slideTop" v-drag1>{{topVisible}}</div>
                <div class="slideMid f-tac">
                    <el-form label-width="100px" :inline="true" :rules="rules" :model="typeForm" ref="typeForm" class="inputWidthI console-mb5">
                        <el-form-item label="类型编号" prop="itemkey">
                            <el-input v-model="typeForm.itemkey"></el-input>
                        </el-form-item>

                        <el-form-item label="类型名称" prop="itemname">
                            <el-input v-model="typeForm.itemname"></el-input>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="typeForm.iscache" class="input-width">
                                <el-option :value="1" label="启用"></el-option>
                                <el-option :value="0" label="禁用"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="上级类型">
                            <el-input v-model="parentname">
                                <el-button @click="show_type" slot="append"><i class="el-icon-more"></i></el-button>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="创建时间">
                            <el-date-picker
                                v-model="createtime"
                                align="right"
                                type="date"
                                @change="change"
                                format="yyyy-MM-dd"
                                placeholder="创建时间" 
                                class="appendWidth"
                                :readonly="true">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="typeForm.remark" :rows="2"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="close('typeForm')">取 消</el-button>
                <el-button @click="save('typeForm')">确 定</el-button>
            </span> -->
        </el-dialog>  

        <!--分页-->
        <el-pagination
            class="console-mt5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="cPage"
            :page-sizes="cpageSizes"
            :page-size="cSize"
            layout="total, sizes, prev, pager, next"
            :total="cTotal">
        </el-pagination>

        <!-- 树 -->
        <el-dialog
            class="dialogDiv dialogDivII"
            :top="clientTop"
            :visible="typeVisibleI"
            :show-close="false"
            size="tiny"
            :modal="true">
            <div class="slideContent">
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="closeDialog"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="makeSure"></el-button>
                </div>
                <div class="slideTop" v-drag1>选择类型</div>

                <div class="slideMid">
                    <el-card class="del-shadow">
                        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                        <div class="scroll-tree saleHeight scrollBar console-mt3">
                            <el-tree
                                class="render-tree"
                                ref="salestree"
                                :data="typeList"
                                :accordion="true"
                                :default-expand-all="false"
                                :props="defaultProps"
                                :highlight-current="true"
                                :check-strictly="true"
                                :filter-node-method="filterNode"
                                @node-click="gettypeid">
                            </el-tree>
                        </div>
                    </el-card>
                </div>
            </div>
    </el-dialog>
    </div>
    </div>
</template>

<script>
    import ZLCommonTable from '../../../components/ZLCommonTable'
    export default {
        components:{
                ZLCommonTable
            },
        data() {
            const _this = this;
            return {
                dialog_top: "100px",
                clientTop:"50px",
                typeVisibleI:false,
                tabHeight: 583,
                filterText:null,
                apiUrl:'/message/dic/getAll',
                alias: null,
                topVisible: '新增消息类型',
                typeVisible: false,
                parentname:null,
                tableData:[],
                typeList:[],
                defaultProps: {
                    label: (data, treeObject) => data.treeObject.itemname,
                    children: 'children'
                },
                itemValues:[
                    {
                        type:'select'
                    }, {
                        name:'itemkey',
                        label:'消息类型编号',
                        width:'',
                        type:'normal'
                    }, {
                        name:'itemname',
                        label:'消息类型名称',
                        width:'',
                        type:'normal',
                        formatter:true
                    }, {
                        name:'parentname',
                        label:'上级类型',
                        width:'',
                        type:'normal'
                    },{
                        name:'iscache',
                        label:'状态',
                        width:'',
                        type:'normal'
                    },{
                        name:'remark',
                        label:'备注',
                        width:'',
                        type:'normal'
                    },{
                        name:'account',
                        label:'创建人',
                        width:'',
                        type:'normal'
                    },{
                        name:'createtime',
                        label:'创建时间',
                        width:'',
                        type: 'normal',
                        formatter:true
                    },{
                        type:'button',
                        width: 120,
                        buttons: [
                            {name: 'edit',label:'编辑'},
                            {name: 'delete',label:'删除'}
                        ]
                    }
                ],
                rules: {
                    itemkey: [
                        { required: true, message: '请输入编码' },
                    ],
                    itemname: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ]
                },
                typeForm: {
                    itemkey: null,
                    itemname: null,
                    iscache:1,
                    parentid:null,
                    remark:null,
                    itemvalue:null,
                },
                createtime:_this.recentDate(0),
                items:[],
                itemsI:[],
            }
        },
        mounted() {
            // this.cpageSizes = [100,200,500,1000];
            // this.cSize = 200;
            this.init();
            this.getDivHeight();
        },
        watch:{
            filterText(val) {
                this.$refs.salestree.filter(val);
            }
        },
        methods: {
            init() {
                this.getlist();
                //this.getSomeData();
                this.getListtype()
            },
            getDivHeight(){
                const pageHeight = this.$refs.pageHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.tabHeight = pageHeight-btnHeight-this.$store.state.pageHeight;
            },

            //获取列表
            getlist() {
                const _this = this;
                let tempData = [];
                this.fetch(this.apiUrl,{pageNo:this.cPage,pageSize:this.cSize})
                    .then(result => {
                        tempData = result.data.list;
                        for(let index in tempData) {
                            if (tempData[index].iscache === 0) {
                                tempData[index].iscache = '禁用'
                            }else if(tempData[index].iscache === 1){
                                tempData[index].iscache = '启用'
                            }
                        }
                        this.cTotal = result.data.total;
                        _this.tableData = tempData;
                    })
            },

            //获取数据字典
            // getSomeData() {
            //     this.postDicData([{'nodekey':'messageType'}]).then( (result)=>{
            //         if (result.status === 200) {
            //            console.log(233,result.data['messageType']);
            //           this.items = result.data['yhxxlxbmsz'];
                               
            //         }
            //     })
            // },

            //获取树
            getListtype(){
                this.fetch('message/dic/getList',{})
                    .then(result => {
                        this.typeList = result.data
                    })
            },

            //新增、编辑
            show_dialog(type,index,rows) {
                this.typeVisible = true;
                if(type === "add"){
                    this.dialogType = 'add';
                    this.topVisible = '新增消息类型';
                    this.clearForm();
                }else if (type === "edit"){
                    this.dialogType = 'edit';
                    this.topVisible = '编辑消息类型';
                    this.typeForm = rows[index]
                }
            },

            //保存 /编辑
            save(typeFormname) {
                if(this.dialogType === 'add'){
                    this.$refs[typeFormname].validate((valid) => {
                        if(valid){
                            this.fetch('/message/dic/messageTypeSave',this.typeForm)
                            .then(result => {
                                if(result.status === 200){
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getlist();
                                }else if(result.status === 500){
                                    this.$message({
                                        message: result.message,
                                        type: 'error'
                                    });
                                    this.getlist();
                                }
                            })
                            this.typeVisible = false
                        }
                    })
                }else if(this.dialogType === 'edit'){
                    this.$refs[typeFormname].validate((valid) => {
                        if(valid){
                            if(this.typeForm.iscache === '启用'){
                            this.typeForm.iscache = 1
                            }else if(this.typeForm.iscache === '禁用'){
                                this.typeForm.iscache = 0
                            }
                            this.fetch('/message/dic/messageTypeUpdate',this.typeForm)
                            .then(result => {
                                if(result.status === 200){
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getlist();
                                }else if(result.status === -200){
                                    this.$message({
                                        message: result.message,
                                        type: 'error'
                                    });
                                    this.getlist();
                                }
                            })
                            this.typeVisible = false
                        }
                    })
                }
            },

            //搜索消息类型
            filterNode(value, data) {
                if (!value) return true;
                return data.treeObject.itemname.indexOf(value) !== -1;
            },

            //树弹框
            show_type(){
                this.typeVisibleI = true;
            },

            //获取树id
            gettypeid(val){
                this.typeForm.parentid = val.treeObject.dicid
                this.parentname = val.treeObject.itemname
            },

            //取消
            closeDialog(){
                this.typeVisibleI = false;
            },

            //确定
            makeSure(){
                this.typeVisibleI = false;
            },
            
            //删除
            delrow(index,rows){
                this.deleteAjax('/message/dic/delete/'+rows[index].dicid)
                    .then(result => {
                        if(result.status === 200) {
                            rows.splice(index, 1);
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.getlist();
                        }else {
                            this.$message({
                                message:result.message||'操作失败',
                                type:'error'
                            })
                        }
                    })
            },

            //清空
            clearForm(){
                this.typeForm = {
                    itemkey: null,
                    itemname: null,
                    iscache:1,
                    parentid:null,
                    remark:null
                }
                this.parentname = null;
            },

            //时间转string
            change(val){
                this.typeForm.createtime = val;
            },

            //关闭弹框
            close(typeFormname) {
                this.$refs[typeFormname].resetFields();
                this.typeVisible = false;
            },
        }
    }
</script>
<style lang="less" scoped type="text/less">

</style>
