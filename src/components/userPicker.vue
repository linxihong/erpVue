/**
* @date 2017/11/22
* @desc 组织管理 员工选择器
**/
<template>
    <div class="m-userPickerVisible">
        <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&handleOpen()">{{btnText}}</el-button>
        <el-dialog
            class="dialogDiv dialogDivII"
            :top = "dialog_top"
            :show-close="false"
            :visible.sync="userPickerVisible"
            :before-close="handleClose">
            <div class="slideContent leftOffsetIII">
                <div class="leftDiv leftOffsetIII">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="handleSubmit(setAdd)"></el-button>
                </div>
                <div class="slideTop" v-drag1>员工列表</div>

                <div class="slideMid">
                    <el-card class="box-card del-shadow">
                        <div class="console-m2">
                            <el-input v-model="empName" placeholder="请输入员工姓名" class="searchInput" @keyup.enter.native="getemployeelist"></el-input>
                            <el-button class="ui-color3" @click="getemployeelist">查询</el-button>
                        </div>
                        <el-table
                            row-key="empId"
                            ref="multipleTable"
                            :max-height="userHeight"
                            :data="employeelist"
                            @selection-change="handleUserpickerSelectionAdd"
                            class="console-width-12">
                            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                            <el-table-column prop="empName" label="员工姓名" width="100"></el-table-column>
                            <el-table-column prop="empCode" label="员工编号"></el-table-column>
                            <el-table-column prop="sex" label="性别" width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.sex==item.itemvalue" v-for="item in sexlist" :key="item.itemvalue">{{item.itemname}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="empNum" label="员工工号"></el-table-column>
                        </el-table>
                        <el-pagination
                            class="console-mt5"
                            @size-change="handleSizeChangeb"
                            @current-change="handleCurrentChangeb"
                            :current-page="cPage"
                            :page-sizes="cpageSizes"
                            :page-size="cSize"
                            layout="total, sizes, prev, pager, next"
                            :total="cTotal">
                        </el-pagination>
                    </el-card>
                    <p></p>
                    <el-card class="box-card mt10 del-shadow">
                        <div slot="header" class="clearfix">
                            <span>已选列表</span>
                        </div>
                        <div class="selectedDiv">
                            <div v-for="item in selectedList">
                                <el-tag type="primary" :v-if="item.empName">{{item.empName}}</el-tag>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <!--<el-button type="primary" @click="handleSubmit(setAdd)">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
    </div>
</template>
　
<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                dialog_top: '30px',
                sexlist: [],
                empTypelist: [],
                userPickerVisible: false,
                btntext: '添加员工',
                employeelist: [],
                userorglist: [],
                selectedList: [],
                tempList:[],
                empName: null,
                userHeight: 430,
            }
        },
        props: {
            'btnText':{
                type: String,
                default: '添加员工'
            },
            'orgid':{
                type: [String,Number],
                required:true
            },
            'userorgTableData': {
                type: Array
            }
        },
        mounted() {
            this.jungleHeight();
        },
        methods: {
            jungleHeight(){
               if(this.$store.state.resolution === 'low'){
                   this.userHeight = 300;
               }
            },
            handleSizeChangeb(val) {
                this.cSize = val;
            },
            handleCurrentChangeb(val) {
                this.cPage = val;
                this.getemployeelist();
            },
            handleOpen(done) {
                this.userPickerVisible = true;
                this.cPage = 1;
                this.cSize = 10;
                this.empName = null;
                this.getemployeelist();
                this.getdicdata();
            },
            handleSubmit(done) {
                this.userPickerVisible = false;
                done();
            },
            handleClose(done) {
                this.userPickerVisible = false;
                this.selectedList = [];
                this.$emit('cb');
                this.$refs.multipleTable.clearSelection();
            },
            handleUserpickerSelectionAdd(row) {
                this.selectedList = row;
                //this.selectedList = this.reduceObj(this.selectedList,'empId')
            },
            setAdd () {
                let _params=[];
                _.each(this.selectedList, (v,k) =>{
                    _params.push({orgid:this.orgid,empid:v.empId});
                });
                this.fetch('/sys/userorg/save',_params).then((result) => {
                    if(result.status === 200){
                        this.$handleRes(result);
                        this.selectedList = [];
                        this.$emit('cb');
                        this.$refs.multipleTable.clearSelection();
                    }
                })
            },
            getemployeelist () {
                this.fetch('/sys/employee/getAll?orgId='+this.orgid,this.objfilter({
                    pageNo:this.cPage,
                    pageSize:this.cSize,
                    empName:this.empName,
                })).then((result) => {
                    if(result.status === 200){
                        this.$set(this,'employeelist',result.data.list);
                        this.cTotal = result.data.total;
                        //this.initChooseList();
                    }else {
                        this.$message({
                            message:'系统正在升级中，请稍后再试',
                            type:'error'
                        });
                    }
                })
            },
            initChooseList() {
                let temp = {};
                if(this.userorgTableData.length) {
                    for(let i = 0;i<this.userorgTableData.length;i++) {
                        temp = _.filter(this.employeelist,{'empId':this.userorgTableData[i].empid})[0]||{};
                        if(temp.empName){
                            //this.$refs.multipleTable.toggleRowSelection(temp,true);
                            this.employeelist = _.without(this.employeelist,temp);
                        }
                    }
                }
            },
            getuserorglist () {
                this.getAjax('/sys/org/edit/'+ this.orgid).then((result) => {
                    if(result.status === 200){
                        this.$set(this, 'userorglist',result.data.list)
                    }
                })
            },
            getdicdata(formName) {
                this.postDicData([
                    {'nodekey':'sex'},
                    {'nodekey':'empType'}
                ]).then( (result)=>{
                    this.afteryAjax(result);
                    if(result.status === 200 &&result.data){
                        setTimeout(()=>{
                            result.data['sex']?this.sexlist = result.data['sex']:'';
                            result.data['empType'] ? this.empTypelist = result.data['empType'] : '';
                        },100)
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped type="text/less">
    .selectedDiv {
        display: flex;
        div {
            margin-right: 10px;
        }
    }

    .searchInput {
        width: 200px;
        margin-right: 20px;
    }
</style>
