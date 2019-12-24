<template>
    <div class="common-wrap">
        <div class="price-alu-list">
            <div class="list-head">铝锭价目</div>
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
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                            style="width: 100%"
                            v-model="searchForm.overDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button class="btn-cyan" @click="handleSearch">查询</el-button>
                        <el-button class="btn-cyan" @click="handleRefresh">重置</el-button>
                        <el-button class="btn-cyan" @click="openDialog">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="alu-chart-wrap">
                <h3>铝锭价目对比</h3>
                <div ref="price_chart" class="chart-div"></div>
            </div>
            <div class="alu-table-wrap">
                <div class="alu-table-head">
                    <h3>铝锭行情对比</h3>
                    <div class="alu-head-select">
                        <span>货币：</span>
                        <select v-model="currentType" @change="changeCurrentType">
                            <option v-for="item in currentTypeList" :value="item.dicttext">{{item.dicttext}}</option>
                        </select>
                    </div>
                </div>
                <el-table :data="tableData" :height="$store.state.screenHei*0.374">
                    <el-table-column align="center" prop="priceListCode" label="价目表代码"></el-table-column>
                    <el-table-column align="center" prop="priceDate" label="日期"></el-table-column>
                    <el-table-column align="center" prop="matCode" label="铝锭代码"></el-table-column>
                    <el-table-column align="center" prop="minPrice" label="最低价"></el-table-column>
                    <el-table-column align="center" prop="maxPrice" label="最高价"></el-table-column>
                    <el-table-column align="center" prop="avgPrice" label="平均价"></el-table-column>
                    <el-table-column align="center" prop="price" label="价格"></el-table-column>
                    <el-table-column align="center" prop="taxPrice" label="含税价"></el-table-column>
                    <el-table-column align="center" label="涨跌">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.upDown"></span>
                            <span v-if="scope.row.upDown" :class="scope.row.upDown == 1 ? 'color-red': 'color-green'">{{scope.row.upDown * scope.row.upDownMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="uom" label="单位"></el-table-column>
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
                <div class="slideTop" v-drag1>新增铝锭价目</div>
                <div class="slideMid inline-form-add">
                    <el-form :inline="true" :model="addForm" label-width="120px" style="text-align: center;">
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
                        <el-form-item porp="priceDate" label="日期">
                            <el-date-picker
                                v-model="addForm.priceDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item porp="matCode" label="铝锭代码">
                            <el-input v-model="addForm.matCode"></el-input>
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
                        <el-form-item porp="minPrice" label="最低价">
                            <el-input v-model="addForm.minPrice"></el-input>
                        </el-form-item>
                        <el-form-item porp="maxPrice" label="最高价">
                            <el-input v-model="addForm.maxPrice"></el-input>
                        </el-form-item>
                        <el-form-item porp="avgPrice" label="平均价">
                            <el-input v-model="addForm.avgPrice"></el-input>
                        </el-form-item>
                        <el-form-item porp="price" label="价格">
                            <el-input v-model="addForm.price"></el-input>
                        </el-form-item>
                        <el-form-item porp="taxPrice" label="含税价">
                            <el-input v-model="addForm.taxPrice"></el-input>
                        </el-form-item>
                        <el-form-item porp="upDown" label="涨跌">
                            <el-select v-model="addForm.upDown">
                                <el-option :value="1" label="涨"></el-option>
                                <el-option :value="0" label="平"></el-option>
                                <el-option :value="-1" label="跌"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item porp="upDownMoney" label="涨跌金额">
                            <el-input v-model="addForm.upDownMoney"></el-input>
                        </el-form-item>
                        <el-form-item porp="uom" label="单位">
                            <el-select v-model="addForm.uom">
                                <el-option value="吨" label="吨"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="full-remark" porp="memo" label="说明">
                            <el-input type="textarea" :row="2" v-model="addForm.memo"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    export default {
        data() {
            return {
                aluPage: 1,
                aluSize: 10,
                aluTotal: 0,
                searchForm: {
                    beginDate: this.recentDate(-6),
                    overDate: this.recentDate(0)
                },
                selectIndex: 0,
                aluList: [],
                allAluList: [],
                aloneData: [],
                tableData: [],
                seriesList: [],
                nameList: [],
                dateList: this.returnNeddDate('lastSeven'),
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
                currentType: '人民币',
                //弹框
                addVisible: false,
                dialog_top: "80px",
                addForm: {},
                aluPriceList: [],
            }
        },
        mounted() {
            this.initEchart();
            this.getPriceList();
            this.getCurrentType();
        },
        methods: {
            //获取价目列表
            getPriceList() {
                this.aluList = [];
                let aluList = [];
                this.allAluList = [];
                this.fetch('/oms/pqm/PqmPriceListController/selectPriceListNoPage',{listType:'铝锭价目',inActive: 0})
                    .then(result => {
                        if(result.status === 200 && result.data)  {
                            this.aluList = result.data;
                            aluList = this.$lodash.cloneDeep(result.data);
                            aluList.unshift({fname:'全部铝价目',fcode:''});
                            this.allAluList = aluList;
                            this.selectItem(0,this.allAluList[0]);
                        }
                    })
            },
            //获取铝锭价目
            getTableData() {
                this.tableData = [];
                this.aloneData = [];
                this.seriesList = [];
                this.selected = {};
                this.fetch(`/oms/MetalPriceController/selectByQueryModel?pageNo=${this.aluPage}&pageSize=${this.aluSize}`,{
                    beginDate: this.searchForm.beginDate,
                    overDate: this.searchForm.overDate,
                    priceListCode: this.priceCode,
                    currency: this.currentType
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tableData = result.data.list;
                            this.aluTotal = result.data.total;
                            if(this.selectIndex) {
                                this.dateList.forEach(item => {
                                    let tempObj = {};
                                    tempObj.name = item;
                                    if(this.tableData.find(v => v.priceDate === item)) {
                                        tempObj.value = (this.tableData.find(v => v.priceDate === item)).price;
                                    }else {
                                        tempObj.value = '-';
                                    }
                                    this.aloneData.push(tempObj)
                                });
                                this.seriesList = [
                                    {
                                        name: this.priceName,
                                        type: 'line',
                                        data: this.aloneData,
                                        symbolSize: 10,
                                        lineStyle: this.lineStyle
                                    }
                                ];
                                this.nameList.forEach(item => {
                                    this.selected[item] = false;
                                });
                                this.selected[this.priceName] = true;
                                this.setEchart([this.priceName]);
                            }else {
                                this.getAllLine();
                            }
                        }
                    })
            },
            //获取全部
            getAllLine() {
                let tempList = [];
                let nameList = [];
                this.aluList.forEach(item => {
                    let tempObj = {};
                    tempObj.name = item.fname;
                    tempObj.list = this.$lodash.filter(this.tableData,{'priceListCode': item.fcode});
                    tempObj.dataList = [];
                    tempList.push(tempObj);
                    nameList.push(item.fname)
                });
                tempList.forEach(item => {
                    if(item.list.length) {
                        this.dateList.forEach(k => {
                            let tempObj = {name:k,value:'-'};
                            item.list.forEach(v => {
                                if(k === v.priceDate) {
                                    tempObj.value = v.price||'-';
                                }
                                item.dataList.push(tempObj)
                            })
                        });
                    }else {
                        this.dateList.forEach(k => {
                            item.dataList.push({name:k,value:'-'})
                        })
                    }
                });
                const that =this;
                tempList.forEach(item => {
                    let seriesObj = {
                        name: item.name,
                        type: 'line',
                        data: that.deletePardon(item.dataList,'name',false),
                        symbolSize: 10,
                        lineStyle: this.lineStyle
                    };
                    this.selected[item.name] = true;
                    this.seriesList.push(seriesObj)
                });
                this.nameList = nameList;
                this.setEchart(nameList);
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
            //价目表代码
            getPricepvc(val) {
                this.aluPriceList = [];
                this.fetch('/oms/pqm/PqmPriceListController/selectPriceListNoPage?pageSize=100',{priceListCode:val,listType:'铝锭价目',inActive: 0})
                    .then(result => {
                        if(result.status === 200) {
                            this.aluPriceList = result.data;
                        }
                    })
            },
            initEchart(){
                this.price_chart = echarts.init(this.$refs.price_chart);
            },
            handleSearch() {
                this.aluPage = 1;
                this.aluSize = 10;
                this.dateList = this.getdiffdate(this.searchForm.beginDate,this.searchForm.overDate);
                this.getTableData();
            },
            handleRefresh() {
                this.currentType = '人民币';
                this.searchForm.beginDate = this.recentDate(-6);
                this.searchForm.overDate = this.recentDate(0);
                this.getPriceList();
            },
            selectItem(index,item) {
                //itemStyle:{normal:{color: 'rgb(255,102,0)'}},
                //itemStyle:{normal:{color: 'rgb(252,210,2)'}},
                //itemStyle:{normal:{color: 'rgb(176,222,9)'}},
                //itemStyle:{normal:{color: 'rgb(13,142,207)'}},
                //itemStyle:{normal:{color: 'rgb(42,12,208)'}},
                this.aluPage = 1;
                this.aluSize = 10;
                this.priceCode = item.fcode;
                this.priceName = item.fname;
                this.selectIndex = index;
                this.getTableData();
            },
            //传参
            setEchart(nameList) {
                this.price_chart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        icon: 'rect',
                        right: '10%',
                        data: nameList,
                        selected: this.selected
                    },
                    grid: {
                        left: '2%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:{
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        data: this.dateList
                    },
                    yAxis: {
                        name: '单位(元/吨)',
                        type: 'value',
                        show: true,
                        splitLine:{
                            show: false
                        },
                        nameTextStyle: {
                            color: '#000'
                        },
                        axisLabel: {
                            color: '#000',
                            margin: 12
                        },
                        axisTick: {
                            length: 8
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'orange',
                                width: 3
                            }
                        }
                    },
                    series: this.seriesList
                })
            },
            //弹框
            openDialog() {
                this.addVisible = true;
                this.addForm.uom = '吨';
            },
            closeDialog() {
                this.addVisible = false;
                this.addForm = {};
            },
            confirmDialog() {
                this.fetch('/oms/MetalPriceController/insert',this.addForm)
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
