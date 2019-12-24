<template>
    <div class="common-wrap">
        <div class="price-alu-list">
            <div class="list-head">胶条价目</div>
            <div v-for="(item,index) in allAluList" :key="index" @click="selectItem(index,item)" class="list-item" :class="selectIndex === index? 'active-item' : ''">
                <div>{{ item.fname }}</div>
                <div><i class="el-icon-caret-right"></i></div>
            </div>
        </div>
        <div class="price-alu-right">
            <div class="alu-search-wrap">
                <el-form :model="searchForm" :inline="true">
                    <el-form-item label="时间">
                        <el-date-picker
                            style="width: 100%"
                            v-model="searchForm.beginDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择生效日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                            style="width: 100%"
                            v-model="searchForm.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择失效日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button class="btn-cyan" @click="handleSearch">查询</el-button>
                        <el-button class="btn-cyan" @click="handleRefresh">重置</el-button>
                        <el-button class="btn-cyan" @click="openDialog">新增</el-button>
                    </el-form-item>
                </el-form>
                <div class="alu-head-select">
                    <span>货币：</span>
                    <select v-model="currentType" @change="changeCurrentType">
                        <option v-for="item in currentTypeList" :value="item.dicttext">{{item.dicttext}}</option>
                    </select>
                </div>
            </div>
            <div class="alu-table-wrap">
                <el-table :data="tableData" border :height="$store.state.screenHei*0.67">
                    <el-table-column align="center" prop="priceListCode" label="价目表代码"></el-table-column>
                    <el-table-column align="center" prop="matCode" label="物料分组代码"></el-table-column>
                    <el-table-column align="center" prop="matTypeName" label="物料类型"></el-table-column>
                    <el-table-column align="center" prop="matTypeCode" label="物料代码"></el-table-column>
                    <el-table-column align="center" prop="uom" label="计量单位"></el-table-column>
                    <el-table-column align="center" prop="beginDate" label="生效日期"></el-table-column>
                    <el-table-column align="center" prop="endDate" label="失效日期"></el-table-column>
                    <el-table-column align="center" prop="currencyName" label="货币"></el-table-column>
                    <el-table-column align="center" prop="price" label="价格"></el-table-column>
                    <el-table-column align="center" prop="taxPrice" label="含税价格"></el-table-column>
                    <el-table-column align="center" prop="memo" label="说明"></el-table-column>
                </el-table>
                <el-pagination
                    class="alu-price-pagination"
                    @size-change="handleSize"
                    @current-change="handleCurrent"
                    :pager-count="5"
                    :current-page="aluPage"
                    :page-size="aluSize"
                    layout="total, sizes, prev, pager, next"
                    :total="aluTotal">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            class="dialogDiv dialogDivII"
            :show-close="false"
            :top="dialog_top"
            size="large"
            @close="closeDialog"
            :visible.sync="addVisible"
        >
            <div class="slideContent">
                <div class="leftDiv leftOffsetIII">
                    <el-button class="icon-setting-2 icon-close" @click="closeDialog"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="confirmDialog"></el-button>
                </div>
                <div class="slideTop" v-drag1>新增胶条价目</div>
                <div class="slideMid inline-form-add">
                    <el-form :inline="true" :model="addForm" label-width="120px" style="text-align: left;">
                        <el-form-item porp="priceListCode" label="价目表代码">
                            <el-select
                                placeholder="请输入价目表代码进行搜索"
                                clearable
                                filterable
                                remote
                                :remote-method="getPricepvc"
                                v-model.trim="addForm.priceListCode"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="(item,index) in aluPriceList"
                                    :key="index"
                                    :label="item.fcode"
                                    :value="item.fcode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item porp="matCode" label="物料分组">
                            <el-input v-model="addForm.matCode"></el-input>
                        </el-form-item>
                        <el-form-item porp="matTypeName" label="物料类型" >
                            <el-select v-model="addForm.matTypeName" @change="matType">
                                <el-option
                                    v-for="(item,index) in matTypeNameList"
                                    :key="index"
                                    :label="item.fname"
                                    :value="item.fname">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item porp="matTypeCode" label="物料代码">
                            <el-input :readonly="true" v-model="addForm.matTypeCode"></el-input>
                        </el-form-item>
                        <el-form-item porp="uom" label="单位">
                            <el-select v-model="addForm.uom">
                                <el-option
                                    v-for="(item,index) in uomList"
                                    :key="index"
                                    :label="item.dictText"
                                    :value="item.dictText">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item porp="currency" label="货币">
                            <el-select v-model="addForm.currency" @change="changeType">
                                <el-option
                                    v-for="(item,index) in currentTypeList"
                                    :key="index"
                                    :label="item.dicttext"
                                    :value="item.dicttext">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item porp="beginDate" label="生效日期">
                            <el-date-picker
                                v-model="addForm.beginDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item porp="endDate" label="失效日期">
                            <el-date-picker
                                v-model="addForm.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item porp="price" label="价格">
                            <el-input v-model="addForm.price"></el-input>
                        </el-form-item>
                        <el-form-item porp="taxPrice" label="含税价">
                            <el-input v-model="addForm.taxPrice"></el-input>
                        </el-form-item>
                        <el-form-item porp="memo" label="备注">
                            <el-input type="textare" :row="2" v-model="addForm.memo"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                aluPage: 1,
                aluSize: 10,
                aluTotal: 0,
                tableId:'',
                searchForm: {
                    beginDate: null,
                    endDate: null
                },
                selectIndex: 0,
                aluList: [],
                allAluList: [],
                aloneData: [],
                tableData: [],
                seriesList: [],
                nameList: [],
                priceCode: null,
                priceName: null,
                lineStyle: {
                    normal: {
                        width: 3,
                        shadowColor: 'rgba(0,0,0,0.4)',
                        shadowBlur: 10,
                        shadowOffsetY: 10
                    }
                },
                selected: {},
                currentTypeList: [],
                matTypeNameList:[],
                uomList:[],
                currentType: '人民币',
                //弹框
                addVisible: false,
                dialog_top: "80px",
                addForm: {},
                aluPriceList: []
            }
        },
        mounted() {
            this.getPriceList();
            this.getCurrentType();
            this.getMatCode();
            this.getUomList();
        },
        methods: {
            //获取价目列表
            getPriceList() {
                this.aluList = [];
                let aluList = [];
                this.allAluList = [];
                this.fetch('oms/pqm/PqmPriceListController/selectPriceListNoPage',{listType:"胶条价目",inActive: 0})
                    .then(result => {
                        if(result.status === 200 && result.data)  {
                            this.aluList = result.data;
                            aluList = this.$lodash.cloneDeep(result.data);
                            aluList.unshift({fname:'全部胶条价目',fCode:''});
                            this.allAluList = aluList;
                            this.selectItem(0,this.allAluList[0]);
                        }
                    })
            },
            //获取胶条价目
            getTableData() {
                this.tableData = [];
                this.aloneData = [];
                this.seriesList = [];
                this.selected = {};
                this.fetch(`/oms/pqm/PqmMatPriceController/selectPriceList?pageNo=${this.aluPage}&pageSize=${this.aluSize}`,{
                    beginDate: this.searchForm.beginDate,
                    endDate: this.searchForm.endDate,
                    priceListCode: this.priceCode,
                    currency: this.currentType
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tableData = result.data.list;
                            this.aluTotal = result.data.total;
                        }
                    })
            },
            handleSize(val) {
                this.aluSize = val;
                this.getTableData();
            },
            handleCurrent(val) {
                this.aluPage = val;
                this.getTableData();
            },
            //获取货币类型
            getCurrentType() {
                this.currentTypeList = [];
                this.getAjax('/oms/sys/DataDictionary/getCurrencyType')
                    .then(result => {
                        if(result.status === 200) {
                            result.data.forEach(item => {
                                item.dictvalue = Number(item.dictvalue)
                            });
                            this.currentTypeList = result.data;
                        }
                    })
            },

            //获取物料类型
            getMatCode(){
                this.matTypeNameList = [];
                this.fetch('/oms/mat/MatTypeController/selectMatTypeList',{inactive: 0})
                    .then(result =>{
                        if(result.status ===200){
                            this.matTypeNameList = result.data;
                        }
                    })
            },
            //获取单位
            getUomList() {
                this.uomList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30126',{})
                    .then(result => {
                        if(result.data) {
                            this.uomList = result.data;
                        }else{
                            this.uomList = [];
                        }
                    })
            },
            //切换货币类型
            changeCurrentType(el) {
                this.currentType = el.target.value;
                this.aluPage = 1;
                this.aluSize = 10;
                this.getTableData();
            },
            changeType(val) {
                let item;
                if(val) {
                    item = this.currentTypeList.find(item => item.dicttext === val);
                    this.addForm.currencyName = item.dicttext;
                }else {
                    this.addForm.currencyName = '';
                }
            },
            matType(val){
                let item;
                if(val) {
                    item = this.matTypeNameList.find(item => item.fname === val);
                    this.addForm.matTypeCode = item.fcode;
                }else {
                    this.addForm.matTypeCode = '';
                }
            },
            //价目表代码
            getPricepvc(val) {
                this.aluPriceList = [];
                this.fetch('/oms/pqm/PqmPriceListController/selectPriceListNoPage?pageSize=100',{priceListCode:val,listType:'胶条价目',inActive: 0})
                    .then(result => {
                        if(result.status === 200) {
                            this.aluPriceList = result.data;
                        }
                    })
            },
            handleSearch() {
                this.aluPage = 1;
                this.aluSize = 10;
                this.getTableData();
            },
            handleRefresh() {
                this.currentType = '人民币';
                this.searchForm.beginDate = null;
                this.searchForm.endDate = null;
                this.getPriceList();
            },
            selectItem(index,item) {
                this.aluPage = 1;
                this.aluSize = 10;
                this.priceCode = item.fcode;
                this.priceName = item.fname;
                this.selectIndex = index;
                this.getTableData();
            },
            //弹框
            openDialog() {
                this.addVisible = true;
            },
            closeDialog() {
                this.addVisible = false;
                this.addForm = {};
            },
            confirmDialog() {
                this.fetch('/oms/pqm/PqmMatPriceController/addMatPrice',this.addForm)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.addVisible = false;
                            this.getTableData();
                        }else {
                            this.$message({
                                message:this.returnErrorMsg(result.error),
                                type:'error'
                            })
                        }
                    })

            }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    .price-alu-list {
        width: 180px;
        margin-right: 20px;
        background: #fff;
        .list-head {
            color: #fff;
            font-size: 16px;
            background: rgb(62,182,143);
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .list-item {
            display: flex;
            justify-content: space-between;
            height: 60px;
            padding-left: 10px;
            cursor: pointer;
            font-size: 16px;
            div:first-child {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            div:last-child {
                width: 20px;
                display: flex;
                align-items: center;
            }
        }
        .active-item {
            color: #fff;
            background: rgb(118,203,176);
        }
    }
    .alu-price-pagination {
        margin-top: 10px;
        padding: 10px;
        background: white;
        width: 100%;
    }
    .color-green {
        color: green;
    }
    .color-red {
        color: red;
    }
    .price-alu-right {
        width: 100%;
        display: flex;
        flex-direction: column;
        .alu-chart-wrap {
            width: 100%;
            .chart-div {
                width: 100%;
                height: 300px;
                background: #fff;
            }
        }
        .alu-table-wrap {
            width: 90%;
            margin-top: 10px;
            .alu-table-head {
                display: flex;
                justify-content: space-between;
            }
            .alu-head-select {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        h3 {
            border-bottom: 3px solid #04C371;
            margin-bottom: 10px;
            width: 100px;
        }
    }

</style>
