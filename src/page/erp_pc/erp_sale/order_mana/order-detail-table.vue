<template>
    <div style="position:relative;">
        <div class="pos-btn">
            <el-button size="mini" type="success"  @click="addRow">新增</el-button>
            <el-button size="mini" type="primary" @click="submit">提交</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleTab" class="order-tab">
            <el-tab-pane label="用户管理" name="first">
                <el-table :data="tableDetail" height="600" style="max-width: 100%" class="edit-table" >
                    <el-table-column label="序号" align="center" width="40">
                        <template slot-scope="scope">
                            <span v-show="hidden">{{scope.row.docItem = scope.$index}}</span>
                            <span>{{scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="item.label" align="center" v-if="item.isChildren" v-for="(item, index) in table1" :key="index">
                        <el-table-column :label="i.label" align="center" :width= 'i.width' v-for="(i, index1) in item.children" :key="index1">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row[i.prop]" :disabled="i.disabled">
                                </el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="item.label" align="center" v-if="!item.isChildren"
                                     :width="item.width" v-for="(item, index) in table1" :key="index">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row[item.prop]" class="single-input" :disabled="item.disabled"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产要求" align="center">
                        <el-table-column label="喷码" align="center" width="58">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.usrTxt1Name"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="禁喷类型" align="center" width="58">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.usrTxt2Name"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="撕筋" align="center" width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.usrTxt3Name"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="备注" align="center" width="60">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memo" @keyup.enter.native="sendData(scope.row)" >
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="40">
                        <template slot-scope="scope">
                            <i class="el-icon-delete" title="删除" @click="removeRow(scope.row,scope.$index)"></i>
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="地址" align="center" column-key="address">
                        <template slot-scope="scope">
                            <alum-input :names.sync="scope.row.address"></alum-input>
                        </template>
                    </el-table-column>-->
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="second">
                <el-table :data="tableDetail" height="600" style="max-width: 100%" class="edit-table" >
                    <el-table-column  label="序号" align="center" width="40">
                        <template slot-scope="scope">
                            <span v-show="hidden">{{scope.row.docItem = scope.$index}}</span>
                            <span>{{scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="item.label" align="center" v-if="item.isChildren" v-for="(item, index) in table1" :key="index">
                        <el-table-column :label="i.label" align="center" :width="i.width" v-for="(i, index1) in item.children" :key="index1">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row[i.prop]" :disabled="i.disabled"></el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :label="item.label" align="center" v-if="!item.isChildren"
                                     :width= 'item.width' v-for="(item, index) in table1" :key="index">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row[item.prop]" class="single-input" :disabled="item.disabled"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产要求" align="center">
                        <el-table-column label="喷码" align="center" width="53">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.usrTxt1"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="禁喷类型" align="center" width="53">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.usrTxt2">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="撕筋" align="center" width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.usrTxt3"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="胶条规格" align="center" width="40">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.usrTxt6">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center" width="60">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memo" @keyup.enter.native="sendData(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="40">
                        <template slot-scope="scope">
                            <i class="el-icon-delete" title="删除" @click="removeRow(scope.row,scope.$index)"></i>
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="地址" align="center" column-key="address">
                        <template slot-scope="scope">
                            <alum-input :names.sync="scope.row.address"></alum-input>
                        </template>
                    </el-table-column>-->
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    import AlumInput from '$src/components/alum-input'
    export default {
        name: "order-detail-table",
        components:{
            AlumInput,
        },
        props:{
            docCode:{
                type:String
            }
        },
        watch:{
            docCode() {
                if(this.docCode) {
                    this.getAjax('oms/sls/SalesOrderDetail/selectOrderDetail',{params:{orderCode:this.docCode}})
                        .then(res => {
                            if(res.status === 200) {
                                this.tableDetail = res.data.list;
                            }else {
                                this.tableDetail = []
                            }
                        })
                }
            }
        },
        data(){
            return{
                activeName: 'first',
                tableDetail: [],
                hidden: false,
                table1: [
                    {label:'型材',isChildren:true,
                        children:[
                            {label:'型号',prop:'matCode'},
                            {label:'名称',prop:'matName',disabled:true},
                            ]
                    },
                    {label:'颜色',isChildren:true,
                        children:[
                            {label:'代码',prop:'cx1'},
                            {label:'名称',prop:'cx1Name',disabled:true},
                        ]
                    },
                    {label:'材质',width:58,prop:'cx2Name',isChildren:false,},
                    {label:'长度',width:58,prop:'cx4',isChildren:false},
                    {label:'膜厚',width:58,prop:'cx3Name',isChildren:false},
                    {label:'支数',width:58,prop:'digit',isChildren:false},
                    {label:'米重',width:58,prop:'meterWght',isChildren:false},
                    {label:'支重',width:58,prop:'unitWght',isChildren:false},
                    {label:'理重',width:58,prop:'theoryWght',isChildren:false},
                ],
                addData: {
                    docItem:'',
                    matCode:'',
                    matName:'',
                    cx1:'',
                    cx1Name:'',
                    cx2Name:'',
                    cx4:'',
                    cx3Name:'',
                    digit:'',
                    meterWght:'',
                    unitWght:'',
                    theoryWght:'',
                    usrTxt1:'',
                    usrTxt2:'',
                    usrTxt3:'',
                    memo:''
                }
            }
        },
        mounted(){

        },
        methods:{
            sendData(row) {
               console.log(row)
            },
            handleFocus() {
                $('.el-input__inner').keyup(function(e){
                    let keycode = e.which;
                    let value = $.trim($(this).val());
                    if(keycode === 13){
                       if(!value){
                           return false
                       }else{
                           //获取下一个兄弟元素寻找input输入框，并聚焦
                           let cell = $(this).parents('.is-center');
                           let nextEl = cell.next().find('.el-input__inner');
                           if(nextEl.prop("disabled")){
                               nextEl = cell.next().next().find('.el-input__inner');
                               nextEl.focus();
                           }else{
                               nextEl.focus();
                           }

                       }
                    }
                })
            },
            handleTab(tab,event) {

            },
            addRow() {
                if(this.activeName=== 'first'){
                    var cloneData = this.$lodash.cloneDeep(this.addData);
                    this.tableDetail.unshift(cloneData);
                    this.$nextTick(()=>{
                        this.handleFocus()
                    })
                }
            },
            removeRow(row,index) {
                this.tableDetail.splice(index,1)
            },
            submit() {
                console.log(this.tableDetail)
            }
        }
    }
</script>

<style lang="less">
    .padd-2x() {
        padding-left: 2px !important;
        padding-right: 2px !important;
    }
    .edit-table {
        th div{
            .padd-2x()
        }
        .cell{
            overflow: inherit;
            padding: 0 3px;
        }
        .el-table--small td, .el-table--small th{
            padding: 3px 0;
        }
        .el-input--small .el-input__inner{
            height: 27px;
            line-height: 27px;
        }
        .el-input__inner {
            border: transparent;
            text-align: center;
            padding: 0 5px;
        }
    }
    .pos-btn {
        position: absolute;
        left: 180px;
        top: 7px;
        z-index: 999;
    }
    .order-tab {
        background: #fff;
        .el-tabs__header{
            margin: 0;
            padding: 0 2px;
        }

    }
</style>
