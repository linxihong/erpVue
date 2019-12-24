<template>
    <div ref="formHeight">
        <el-card class="box-card__form console-width-12">
            <!--查询条件-->
            <el-form class="filterform cf" :label-width="conditionWdith" @keyup.enter.native="onSearchButtonClick">
                <el-form-item v-for="(field,index) in fieldValues" :key="index" :label="field.name">
                    <el-date-picker
                        v-model="field.value"
                        align="right"
                        type="date"
                        format="yyyy-MM-dd"
                        v-if="field.type === 'date'">
                    </el-date-picker>
                    <el-date-picker
                        v-model="field.value"
                        type="daterange"
                        align="right"
                        :picker-options="pickerOptions"
                        v-if="field.type === 'daterange'">
                    </el-date-picker>
                    <!-- 时分秒 -->
                    <el-date-picker
                        class="framewidth"
                        v-model="field.value"
                        type="datetimerange"
                        align="right"
                        format="yyyy-MM-dd HH:mm"
                        :picker-options="pickerOptionsI"
                        v-if="field.type === 'datetimerange'">
                    </el-date-picker>
                    <!-- 禁止选择时间 -->
                    <el-date-picker
                        v-model="field.value"
                        type="forbidden_daterange"
                        align="right"
                        :readonly="true"
                        :picker-options="pickerOptions"
                        v-if="field.type === 'forbidden_daterange'">
                    </el-date-picker>
                    <el-select v-model="field.value" v-if="field.type === 'select'" class="framewidth" clearable>
                        <el-option
                            v-for="item in field.label"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="field.value" multiple collapse-tags placeholder="请选择" v-if="field.type === 'select-many'" class="framewidth" clearable>
                        <el-option
                            v-for="item in field.label"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="field.value" :placeholder="field.name" v-if="field.type === null || field.type === 'string'" class="framewidth"></el-input>
                    <el-checkbox v-model="field.value" :label="field.label" :true-label="1"  v-if="field.type === 'checkbox'" class="framewidth"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="multi==='A'" label="原单价">
                    <el-input v-model="a_val" class="inputwidth" v-if="multi==='A'">
                        <el-select v-model="a_type" slot="prepend" class="selectwidth">
                            <el-option label="等于" :value="1"></el-option>
                            <el-option label="不等于" :value="2"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSearchButtonClick" class="ui-color3">查询</el-button>
                    <el-button class="ui-color2" @click="onRestButtonClick">重置</el-button>
                    <!--<el-button class="ui-color2" @click="init" title="刷新"><i class="fa fa-refresh"></i></el-button>-->
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        props: {
            multi: {
                type: String
            },
            fields: Array,
            paramVersion: {
                type: String,
                default() {
                    return "v2"
                }
            },
            isWithExts: {
                type: Boolean,
                default() {
                    return true
                }
            }

        },
        mounted() {
            if(this.$store.state.resolution === 'low'){
                this.conditionWdith = '80px';
            }
            this.getDivHeight();
        },
        data() {
            const _this = this;
            return {
                conditionWdith:'85px',
                a_type: 1,
                a_val: null,
                fieldValues : !this.fields ? [] : _.map(this.fields, function (e){ return _.extend({value:null},e) }),
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '今日',
                            onClick(picker) {
                                const start = _this.recentDate(0);
                                const end = _this.recentDate(0);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '明日',
                            onClick(picker) {
                                const start = _this.recentDate(1);
                                const end = _this.recentDate(1);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '前后1天',
                            onClick(picker) {
                                const start = _this.recentDate(-1);
                                const end = _this.recentDate(1);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '前后2天',
                            onClick(picker) {
                                const start = _this.recentDate(-2);
                                const end = _this.recentDate(2);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本月',
                            onClick(picker) {
                                const start = _this.formatDate((new Date().getTime() - 3600 * 1000 * 24 * ((new Date().getDate()) - 1)), 'yy-mm-dd');
                                const end = _this.formatDate((new Date().getTime() - 3600 * 1000 * 24 * ((new Date().getDate()) - 1)) + 3600 * 1000 * 24 *(_this.$store.state.daycount-1), 'yy-mm-dd');
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                pickerOptionsI: {
                    shortcuts: [
                        {
                            text: '今日',
                            onClick(picker) {
                                const start = _this.recentDate(0)+' 00:00:00';
                                const end = _this.recentDate(0)+' 23:59:59';
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '明日',
                            onClick(picker) {
                                const start = _this.recentDate(1)+' 00:00:00';
                                const end = _this.recentDate(1)+' 23:59:59';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '前后1天',
                            onClick(picker) {
                                const start = _this.recentDate(-1)+' 00:00:00';
                                const end = _this.recentDate(1)+' 23:59:59';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '前后2天',
                            onClick(picker) {
                                const start = _this.recentDate(-2)+' 00:00:00';
                                const end = _this.recentDate(2)+' 23:59:59';
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '本月',
                            onClick(picker) {
                                const start = _this.formatDate((new Date().getTime() - 3600 * 1000 * 24 * ((new Date().getDate()) - 1)), 'yy-mm-dd')+' 00:00:00';
                                const end = _this.formatDate((new Date().getTime() - 3600 * 1000 * 24 * ((new Date().getDate()) - 1)) + 3600 * 1000 * 24 *(_this.$store.state.daycount-1), 'yy-mm-dd')+' 23:59:59';
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            //刷新
            init(){
               this.onSearchButtonClick();
            },
            getDivHeight(){
                return  this.$refs.formHeight.offsetHeight;
            },
            //查询
            onSearchButtonClick(){
                const _this = this;
                let tmpParmas = {};
                let tmpParmasII = "";
                let a='',b='',temp='',c='';
                //this.$emit('toggleSearch');
                //search 参数为Object
                _.each(_this.fieldValues, function (node, index) {
                    if(node.fieldName) {
                        tmpParmas[node.fieldName] = node.value instanceof Date ? _this.formatDate(node.value, 'hms') : node.value;
                    }
                    if(node.fieldName === 'dateRange' || 'forbidden_daterange') {
                        if(tmpParmas['dateRange']){
                            tmpParmas['builddate_ge_date'] = _this.formatDate(tmpParmas['dateRange'][0], 'yy-mm-dd');
                            tmpParmas['builddate_le_date'] = _this.formatDate(tmpParmas['dateRange'][1], 'yy-mm-dd');
                        }
                        if (node.fieldName=== 'forbidden_daterange'){
                            if(tmpParmas['forbidden_daterange']){
                                tmpParmas['builddate_ge_date'] = _this.formatDate(tmpParmas['forbidden_daterange'][0], 'yy-mm-dd');
                                tmpParmas['builddate_le_date'] = _this.formatDate(tmpParmas['forbidden_daterange'][1], 'yy-mm-dd');
                            }
                        }
                    }
                });
                this.$emit('search', this.isWithExts ? { exts : tmpParmas } : tmpParmas );

                //searchII 参数为String拼接
                if(this.fieldValues[0].type === 'daterange'){
                    if(this.a_val){
                        if(this.a_type === 2){
                            c += 'balanceprice_ne='+this.a_val
                        }else{
                            c += 'balanceprice='+this.a_val;
                        }
                    }
                    for(let index=1; index<this.fieldValues.length; index++){
                        if(tmpParmas['datehandle'] && this.fieldValues[0].value){
                            temp = this.fieldValues[index].value||'';
                            a += this.fieldValues[index].fieldName + '=' + temp + '&';
                            b = this.fieldValues[0].label+'_ge_date' + '=' + _this.formatDate(tmpParmas['datehandle'][0], 'yy-mm-dd') + '&'
                                + this.fieldValues[0].label+'_le_date' + '=' + _this.formatDate(tmpParmas['datehandle'][1], 'yy-mm-dd') + '&';
                            if(tmpParmas['datehandle'][0]===null) {
                                temp = this.fieldValues[index].value||'';
                                a += this.fieldValues[index].fieldName + '=' + temp + '&';
                                b = '';
                            }
                        }
                    }
                    b?tmpParmasII = a+b+c:tmpParmasII = a+c;
                }
                if(this.fieldValues[0].type === 'select'){
                    for(let index=2; index<this.fieldValues.length; index++) {
                        temp = this.fieldValues[index].value||'';
                        a += this.fieldValues[index].fieldName + '=' + temp + '&';
                        if(tmpParmas['datehandle'] && this.fieldValues[0].value){
                            b = this.fieldValues[0].value + '_ge_date'+'=' + _this.formatDate(tmpParmas['datehandle'][0], 'ymdhM') + '&'
                                + this.fieldValues[0].value + '_le_date'+'=' + _this.formatDate(tmpParmas['datehandle'][1], 'ymdhM') + '&';
                        }
                    }
                    tmpParmasII = a + b;
                }
                tmpParmasII = (tmpParmasII.substring(tmpParmasII.length-1) === '&')?tmpParmasII.substring(0,tmpParmasII.length-1):tmpParmasII;
                this.$emit('searchII',tmpParmasII );
            },

            //重置
            onRestButtonClick(){
                for(let i = 0 ; i < this.fieldValues.length; i ++) {
                    if(this.fieldValues[i].fieldName === 'forbidden_daterange'){

                    }else{
                         this.fieldValues[i].value = '';
                    }
                }
                this.a_val = '';
                this.$emit('reset');
                this.sdate = null;
                this.edate = null;
            }
        }
    }
</script>


<style lang="less" scoped>
    .inputwidth{
        width: 220px;
    }

    .selectwidth{
      width: 91px;
    }

    .framewidth{
        width: 220px;
    }
</style>
