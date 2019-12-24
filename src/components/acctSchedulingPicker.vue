/**
* @date 2017/11/22
* @desc 运营系统 备份 时间表达式选择器
**/
<template>
    <div class="m-acctSchedulingPickerVisible">
        <el-input v-model="custname" :readonly="ifReadonly">
            <el-button class="ui-color2" slot="append" type="text" icon="plus" @click="handleOpen"></el-button>
        </el-input>

        <el-dialog
                class="dialogDiv dialogDivII"
                :show-close="false"
                :visible.sync="userPickerVisible"
                size="large"
                :top = "dialog_top"
                :before-close="handleClose">
            <div class="slideContent">
                <div class="leftDiv aloneDivI">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="handleSubmit(setAdd)"></el-button>
                </div>
                <div class="slideTop" v-drag1>计划时间表</div>

                <div class="slideMid">
                    <el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
                        <el-tab-pane label="秒" name="resultSecond">
                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 每秒 允许的通配符[, - * /]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    秒
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondc"> 从</el-radio>

                                    <el-input-number v-model="dateSPList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    秒开始,每
                                    <el-input-number v-model="dateSPList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    秒执行一次
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <el-checkbox-group v-model="dateTS">
                                                <li v-for="n in dataShowSecond">
                                                    <el-checkbox class="ts" @change="handleDateCheckItemChange"
                                                                 :label="n.toString()">{{ n }}
                                                    </el-checkbox>
                                                </li>
                                            </el-checkbox-group>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="分钟" name="resultMinute">
                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 分钟 允许的通配符[, - * /]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    分钟
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondc"> 从</el-radio>

                                    <el-input-number v-model="dateSPList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    分钟开始,每
                                    <el-input-number v-model="dateSPList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    分钟执行一次
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <li v-for="n in dataShowMinute">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="小时" name="resultHour">
                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 小时 允许的通配符[, - * /]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    小时
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondc"> 从</el-radio>

                                    <el-input-number v-model="dateSPList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    小时开始,每
                                    <el-input-number v-model="dateSPList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    小时执行一次
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <li>AM:</li>
                                            <li v-for="n in dataShowHour[0]">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                        <ul class="m-hourslist">
                                            <li>PM:</li>
                                            <li v-for="n in dataShowHour[1]">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="日" name="resultDay">

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 日 允许的通配符[, - * / L W]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconde"> 不指定</el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondf"> 本月最后一天</el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondg"> 每月</el-radio>

                                    <el-input-number v-model="dateSD[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    号最近的那个工作日
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    日
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondc"> 从</el-radio>

                                    <el-input-number v-model="dateSPList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    日开始,每
                                    <el-input-number v-model="dateSPList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    日执行一次
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <li v-for="n in 31">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="月" name="resultMonth">

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 月 允许的通配符[, - * /]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconde"> 不指定</el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    月
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondc"> 从</el-radio>

                                    <el-input-number v-model="dateSPList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    月开始,每
                                    <el-input-number v-model="dateSPList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    月执行一次
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <li v-for="n in dataShowMonth">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="周" name="resultWeek">

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 周 允许的通配符[, - * / L #]
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconde"> 不指定</el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondf"> 本月最后一个星期{{dateLD[0]}}
                                    </el-radio>
                                    <el-input-number v-model="dateLD[0]" @change="handleDateCheckItemChange_dateLD" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondb"> 周期从星期</el-radio>

                                    <el-input-number v-model="dateSEList[0]" @change="handleDateCheckItemChange_dateSELista"
                                                     size="small" :min="0" :max="59"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSEList[1]" @change="handleDateCheckItemChange_dateSEListb"
                                                     size="small" :min="0" :max="59"></el-input-number>

                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondh"> 第</el-radio>

                                    <el-input-number v-model="dateSW[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>
                                    周 的星期
                                    <el-input-number v-model="dateSW[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="0" :max="59"></el-input-number>

                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondd"> 指定</el-radio>
                                    <div>
                                        <ul class="m-hourslist">
                                            <li v-for="n in 7">
                                                <el-checkbox class="ts" v-model="dateTS" @change="handleDateCheckItemChange"
                                                             :label="n.toString()">{{ n }}
                                                </el-checkbox>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane label="年" name="resultYear">

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondi"> 不指定 允许的通配符[, - * /] 非必填
                                    </el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="seconda"> 每年</el-radio>
                                </div>
                            </div>

                            <div class="item">
                                <div class="item-radio">
                                    <el-radio v-model="dateCheckItem" class="radio" label="secondj"> 周期从</el-radio>

                                    <el-input-number v-model="dateSyEList[0]" @change="handleDateCheckItemChange" size="small"
                                                     :min="2017" :max="3000"></el-input-number>
                                    -
                                    <el-input-number v-model="dateSyEList[1]" @change="handleDateCheckItemChange" size="small"
                                                     :min="2017" :max="3000"></el-input-number>

                                </div>
                            </div>

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <!--<el-button type="primary" @click="handleSubmit(setAdd)">确定</el-button>-->
            <!--</span>-->
        </el-dialog>
    </div>
</template>
<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                dialog_top: '50px',
                tempData: {},
                num1: 1,

                tabName: 'resultSecond',

                dataShowSecond: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                dataShowMinute: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                dataShowHour: [
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                ],
                dataShowDay: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                dataShowMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                dataShowWeek: [1, 2, 3, 4, 5, 6, 7],

                dateCheckItem: 'seconda',
                resultSecond: '*',
                resultMinute: '*',
                resultHour: '*',
                resultDay: '*',
                resultMonth: '*',
                resultWeek: '?',
                resultYear: '',

                dateSEList: [1, 2],
                dateSPList: [0, 1],
                dateTS: ['0'],//'1'
                dateNOT: '?',
                dateLD: ['', 'L'],
                dateSD: [1, 'w'],
                dateSW: [1, 1],
                dateSYN: '',
                dateSyEList: [2016, 2017],

                dateCheckList: [],
                checkList: [],
                userPickerVisible: false,
                ifReadonly: true,
                btntext: '添加',
                custname: this.modelvalue,//this.modelvalue,
                tableData: [],
                grouplist: [],
            }
        },
        computed: {},
        props: {
            'btnText': {
                type: String,
                default: '添加'
            },
            'mSelection': {
                type: Array
            },
            'modelvalue': {
                type: [String],
                default: ''
            },
            'custaccid': {
                type: [Number, String]
            },
        },

        watch: {
            'dateCheckItem': 'handleDateCheckItemChange',
            //'dateSEList':'handleDateCheckItemChange',
            //'dateSPList':'handleDateCheckItemChange',
            //'dateTS':'handleDateCheckItemChange',
            /*'$store.state.dataSchedule': {
                handler: (val, oldVal)=> {
                    console.log(val);
                    this.handlemodelvalue?this.handlemodelvalue(val):''
                },
                // 深度观察
                deep: true
            },*/
            'modelvalue': 'handlemodelvalue'
        },
        mounted () {

        },
        methods: {
            handlemodelvalue(val) {
                this.custname = val;
            },
            handleTabClick() {
                var _dateSEList = [1, 2], _dateSPList = [0, 1], _dateTS = [];

                if (this.tabName == 'resultDay' || this.tabName == 'resultMonth' || this.tabName == 'resultWeek') {
                    _dateSPList = [1, 1]
                } else if (this.tabName == 'resultYear') {
                    _dateSPList = [2013, 2014]
                }
                if (this.tempData[this.tabName] != undefined) {
                    var _tabData = this.tempData[this.tabName];

                    if (_tabData.indexOf("-") >= 0) {
                        _dateSEList = _tabData.split('-');
                    } else if (_tabData.indexOf("/") >= 0) {
                        _dateSPList = _tabData.split('/');
                    } else if (_tabData.indexOf(",") >= 0) {
                        this.dateCheckItem = 'secondd';
                        var temp = [];
                        _tabData.split(',').forEach((val) => {
                            temp.push((parseInt(val)).toString())
                        });
                        _dateTS = temp;
                    } else {
                        if (!isNaN(_tabData)) {
                            _dateTS = [_tabData];
                        }
                    }
                }
                this.dateSEList = _dateSEList;
                this.dateSPList = _dateSPList;

                //console.log(_dateTS,this.dateTS,this[this.tabName],this.tabName,this.dateCheckItem)

                if (_dateTS.length == 0) {
                    if ((this[this.tabName] == "*" || this[this.tabName] == "?") && this.dateCheckItem == 'secondd') {
                        //this.tabName=='resultSecond'||this.tabName=='resultHour'||this.tabName=='resultMinute'?this[this.tabName] = '0':this[this.tabName] = '1';
                        //this.tabName=='resultSecond'||this.tabName=='resultHour'||this.tabName=='resultMinute'?this.dateTS = ['0']:this.dateTS = ['1'];
                        this.dateTS = [];
                    } else if (this[this.tabName] != "*" && this.dateCheckItem == 'secondd') {
                        this[this.tabName].toString().indexOf(',') > 0 ? this.dateTS = this[this.tabName].split(',') : this.dateTS = [this[this.tabName]];
                    }
                } else {
                    this.dateTS = _dateTS;
                }
                //console.log(this.dateTS)
                //this.dateTS = _dateTS;
            },
            //secondb 0
            handleDateCheckItemChange_dateSELista(val) {
                this.dateSEList[0] = val;
                this.handleDateCheckItemChange();
            },
            //secondb 1
            handleDateCheckItemChange_dateSEListb(val) {
                this.dateSEList[1] = val;
                this.handleDateCheckItemChange();
            },
            //secondf
            handleDateCheckItemChange_dateLD(val) {
                this.dateLD[0] = val;
                this.handleDateCheckItemChange();
            },
            handleDateCheckItemChange(type, val) {
                var _result, _key = this.tabName;
                switch (this.dateCheckItem) {
                    case 'seconda':
                        this[_key] = "*";
                        if (_key == 'resultWeek') {
                            this.resultYear = '*'
                        }
                        break;
                    case 'secondb':
                        this[_key] = this.dateSEList[0] + '-' + this.dateSEList[1];
                        break;
                    case 'secondc':
                        this[_key] = this.dateSPList[0] + '/' + this.dateSPList[1];
                        break;
                    case 'secondd':
                        var _resultArray = [];
                        ////console.log(this.dateTS)
                        _.each(this.dateTS, v=> {
                            _resultArray.push(v)
                        });
                        _resultArray = _resultArray.sort();
                        if (_resultArray.length != 0) {
                            var _thisresultArray = _resultArray.join(',');
                            _thisresultArray = _thisresultArray.replace("?,", "")
                            if (this.tabName == 'resultDay' || this.tabName == 'resultMonth' || this.tabName == 'resultWeek') {
                                _thisresultArray = _thisresultArray.replace("0,", "")
                            }
                            this[_key] = _thisresultArray;
                        } else {
                            if (this.tabName == 'resultSecond') {
                                this[_key] = '';
                            } else {
                                this[_key] = '?';
                            }
                        }
                        //this[_key] = _resultArray.length!=0?_resultArray.join(','):this.tabName=='resultSecond'?'':'?';
                        break;
                    case 'seconde':
                        this[_key] = this.dateNOT;
                        break;
                    case 'secondf':
                        this[_key] = this.dateLD.join('');
                        break;
                    case 'secondg':
                        this[_key] = this.dateSD.join('');
                        break;
                    case 'secondh':
                        this[_key] = this.dateSW.join('#');
                        break;
                    case 'secondi':
                        this[_key] = '';
                        break;
                    case 'secondj':
                        this[_key] = this.dateSyEList[0] + '-' + this.dateSyEList[1];
                        break;
                }

                this.tempData[_key] = this[_key];

                // console.log(
                //     //this.dateTS,
                //     this.resultSecond,
                //     this.resultMinute,
                //     this.resultHour,
                //     this.resultDay,
                //     this.resultMonth,
                //     this.resultWeek,
                //     this.resultYear,
                // )

                if (this.resultMinute != "*" || this.resultHour != "*" || this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultSecond != "*" ? '' : this.resultSecond = '0';
                }
                if (this.resultHour != "*" || this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultMinute != "*" ? '' : this.resultMinute = '0';
                }
                if (this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultHour != "*" ? '' : this.resultHour = '0';
                }
                if (this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultDay != "*" ? '' : this.resultDay = '0';
                }
                if (this.resultWeek != "?") {
                    this.resultMonth != "*" ? '' : this.resultMonth = '0';
                }

                // console.log(
                //     this.resultSecond,
                //     this.resultMinute,
                //     this.resultHour,
                //     this.resultDay,
                //     this.resultMonth,
                //     this.resultWeek,
                //     this.resultYear,
                // )
            },
            handleChange(value) {
                //console.log(value);
            },
            handleOpen(done) {
                this.userPickerVisible = true;
                //this.custname = "0,1 * * * *";
                //console.log(this.custname)
                if (this.custname != '') {
                    var _custname = [], _tempDataKeys = [
                        'resultSecond',
                        'resultMinute',
                        'resultHour',
                        'resultDay',
                        'resultMonth',
                        'resultWeek',
                        'resultYear',
                    ], _tempData = {};
                    this.custname.split(' ').forEach((item, index)=> {
                        _custname.push(item);
                        _tempData[_tempDataKeys[index]] = item;
                        this[_tempDataKeys[index]] = item;
                        //console.log(this[_tempDataKeys[index]],_tempDataKeys[index])
                    })
                    //console.log(_tempData)
                    this.tabName = "resultSecond";
                    this.tempData = _tempData;
                    this.handleTabClick();
                }
            },
            handleSubmit(done) {
                this.userPickerVisible = false;
                done();
            },
            handleClose(done) {
                this.userPickerVisible = false;
            },
            handleUserpickerSelectionAdd(val) {
                if (val && val.length > 1) {
                    val.splice(0, 1);
                }
                this.multipleSelection = val;
            },
            setAdd () {

                if (this.resultMinute != "*" || this.resultHour != "*" || this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultSecond != "*" ? '' : this.resultSecond = '0';
                }
                if (this.resultHour != "*" || this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultMinute != "*" ? '' : this.resultMinute = '0';
                }
                if (this.resultDay != "*" || this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultHour != "*" ? '' : this.resultHour = '0';
                }
                if (this.resultMonth != "*" || this.resultWeek != "?") {
                    this.resultDay != "*" ? '' : this.resultDay = '0';
                }
                if (this.resultWeek != "?") {
                    this.resultMonth != "*" ? '' : this.resultMonth = '0';
                }

                var _result = this.resultSecond + " " +
                        this.resultMinute + " " +
                        this.resultHour + " " +
                        this.resultDay + " " +
                        this.resultMonth + " " +
                        this.resultWeek + " " +
                        this.resultYear;
                //console.log(_result)
                this.custname = _result;
                this.$emit('input', _result);
                this.$emit('cb', _result);
            },
        }
    }
</script>

<style lang="less">
    .f-readonly {

    .el-input-group__append {
        display: none;
    }

    }
</style>
