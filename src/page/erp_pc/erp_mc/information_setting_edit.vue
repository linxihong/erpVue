<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content console-mt3">
        <div>
            <el-button class="ui-color3" @click="save">保存</el-button>
            <el-button class="ui-color2" @click="shutDown">关闭</el-button>
            <!-- <el-button class="ui-color2" @click="" title="刷新"><i class="fa fa-refresh"></i></el-button> -->
        </div>
        <el-form :model="settingForm" label-width="90px" :inline="true" class="console-mt4 inputWidthI inputWidthII">
            <el-form-item label="模板编号" v-if="iscode">
                <el-input v-model.trim="settingForm.infotemplatecd" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="模板名称">
                <el-input v-model.trim="settingForm.name"></el-input>
            </el-form-item>
            <el-form-item label="消息类型">
                <el-input v-model.trim="announcementType" :readonly="true">
                    <el-button @click="show_add" slot="append"><i class="el-icon-more"></i></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="消息级别">
                <el-select v-model="settingForm.level">
                    <el-option :value="1" label="提醒"></el-option>
                    <el-option :value="2" label="警告"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息状态">
                <el-select v-model="settingForm.status">
                    <el-option :value="1" label="启用"></el-option>
                    <el-option :value="2" label="停用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系统预置">
                <el-select v-model="settingForm.systempresets">
                    <el-option :value="1" label="是"></el-option>
                    <el-option :value="0" label="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model.trim="settingForm.title"></el-input>
            </el-form-item>
            <el-form-item label="提醒方式" >
                <el-checkbox-group v-model="checkList" class="form-item-width">
                    <el-checkbox label="1">页面弹窗</el-checkbox>
                    <el-checkbox label="2">APP</el-checkbox>
                    <el-checkbox label="3">微信</el-checkbox>
                    <!-- <el-checkbox label="短信" :true-label='1'></el-checkbox> -->
                    <el-checkbox label="4">邮件</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>

        <el-form :model="settingForm" label-width="90px" class="inputWidthIII">
            <el-form-item label="内容" class="margin-bot">
                <el-input type="textarea" resize="none" v-model.trim="settingForm.content" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="触发器">
                <el-input v-model.trim="schedulingstring" :readonly="true">
                    <el-button @click="show_dialog" slot="append"><i class="el-icon-more"></i></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="程序" class="margin-bot">
                <el-input type="textarea" resize="none" v-model.trim="settingForm.program" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="程序参数" class="margin-bot">
                <el-input type="textarea" resize="none" v-model.trim="settingForm.programparameter" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="接收人">
                <el-radio-group v-model="settingForm.receivemode" @change="changeAccpet">
                    <el-radio :label="2">全部用户</el-radio>
                    <el-radio :label="1">指定角色</el-radio>
                    <el-radio :label="3">指定用户</el-radio>
                    <el-radio :label="4">程序指定</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        
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
                    <el-button class="icon-setting-1 icon-confirm" @click="typeVisibleI=false"></el-button>
                </div>
                <div class="slideTop" v-drag1>选择类型</div>

                <div class="slideMid">
                    <el-card class="del-shadow">
                        <el-input placeholder="输入关键字进行过滤" v-model="filterType"></el-input>
                        <div class="scroll-tree saleHeight scrollBar console-mt3">
                            <el-tree
                                class="render-tree"
                                ref="salestree"
                                :data="typeList"
                                :accordion="true"
                                :default-expand-all="false"
                                :props="defaProps"
                                :highlight-current="true"
                                :check-strictly="true"
                                :filter-node-method="TypeNode"
                                @node-click="gettypeid">
                            </el-tree>
                        </div>
                    </el-card>
                </div>
            </div>
    	</el-dialog>

        <el-dialog
            class="dialogDiv dialogDivII"
            :visible.sync="dialogVisible"
            :show-close="false"
            :top = "dialog_top"
            size="tiny">
            <div class="slideContent">
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="dialogVisible = false"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="determine"></el-button>
                </div>
                <div class="slideTop" v-drag1>触发器</div>

                <div class="slideMid">
                    <el-form label-width="110px" :model="triggerForm" class="itembottom inputColor">
                        <div class="console-title">
                            <h5>摘要</h5>
                        </div>
                        <el-form-item label="监控周期说明" class="inputWidthIV console-mb10">
                            <el-input type="textarea" v-model.trim="triggerForm.summary" resize="none" :rows="2"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form label-width="110px" :model="triggerForm" :inline="true" class="itembottom inputWidthI inputWidthII">
                        <div class="console-title">
                            <h5>有效期</h5>
                        </div>
                        <el-form-item label="开始日期">
                            <el-date-picker
                                v-model="triggerForm.sdate"
                                align="right"
                                type="date"
                                format="yyyy-MM-dd"
                                :picker-options="todayLimit"
                                @change="change"
                                placeholder="开始日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="结束日期">
                            <el-date-picker
                                    v-model="triggerForm.edate"
                                    align="right"
                                    type="date"
                                    :picker-options="todayLimit"
                                    @change="changeI"
                                    format="yyyy-MM-dd"
                                    placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>

                        <div class="console-title">
                            <h5>执行频率</h5>
                        </div>
                        <el-form-item label="监控周期单位">
                            <el-select v-model="triggerForm.cycle" @change="gtecycle">
                                <el-option value="每天" label="每天"></el-option>
                                <el-option value="1次" label="1次"></el-option>
                                <el-option value="每周" label="每周"></el-option>
                                <el-option value="每月" label="每月"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="每周几" v-if="isweek">
                            <el-select v-model="triggerForm.week">
                                <el-option value="1" label="1"></el-option>
                                <el-option value="2" label="2"></el-option>
                                <el-option value="3" label="3"></el-option>
                                <el-option value="4" label="4"></el-option>
                                <el-option value="5" label="5"></el-option>
                                <el-option value="6" label="6"></el-option>
                                <el-option value="7" label="7"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="每月几号" v-if="ismonth">
                            <el-select v-model="triggerForm.month">
                                <el-option :value="item" :label="item" v-for="item in daysData" :key="item"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="执行时间" v-if="iscarrieddate">
                            <el-time-select
                                v-model="triggerForm.carrieddate"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:5',
                                    end: '24:00'
                                }"
                                placeholder="选择时间">
                            </el-time-select>
                            <!-- <el-date-picker
                                v-model="settingForm.carrieddate"
                                align="right"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="执行时间">
                            </el-date-picker> -->
                        </el-form-item>

                        <el-form-item label="执行时间" v-if="isoneddate">
                            <el-date-picker
                                v-model="triggerForm.oneddate"
                                align="right"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change="datestring"
                                placeholder="执行时间">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="重复任务间隔" v-if="isinterval">
                            <el-select v-model="triggerForm.interval">
                                <el-option value="10秒" label="10秒"></el-option>
                                <el-option value="5分钟" label="5分钟"></el-option>
                                <el-option value="10分钟" label="10分钟"></el-option>
                                <el-option value="15分钟" label="15分钟"></el-option>
                                <el-option value="30分钟" label="30分钟"></el-option>
                                <el-option value="1小时" label="1小时"></el-option>
                                <el-option value="3小时" label="3小时"></el-option>
                                <el-option value="5小时" label="5小时"></el-option>
                                <el-option value="1天" label="1天"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="determine">确 定</el-button>
            </span> -->
        </el-dialog>

        <div class="console-mt2 inputWidthIII" v-if="showRole">
            <el-card class="del-shadow">
                <div class="console-pb2">
                    <el-input v-model="search" placeholder="角色名称" icon="search" class="console-width-6"></el-input>
                </div>
                <el-table highlight-current-row :data="searchData" max-height='180' @select="receiveSelect" ref="roleData">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="alias" label="角色别名" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.alias.replace(/(\S*)_/,'')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rolename" label="角色名称" align="center"></el-table-column>
                </el-table>
            </el-card>
        </div>

        <div class="console-mt2 inputWidthIII" v-if="showUser">
            <el-card class="del-shadow">
                <div class="console-pb2">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="console-width-6"></el-input>
                </div>
                <div class="scroll-tree Height scrollBar newsNode">
                    <el-tree
                        ref="usertree"
                        class="render-treeI"
                        :highlight-current="true"
                        :data="moduleList"
                        :props="defaultProps"
                        :accordion="true"
                        show-checkbox
                        :filter-node-method="filterNode"
                        @check-change="getChange">
                    </el-tree>
                </div>
            </el-card>
            <!-- <div class="console-title"></div>
            <el-table border highlight-current-row :data="userData" max-height='200' @select="receiveSelectI" ref="userdata">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="usertype" label="账号类型" align="center"></el-table-column>
                <el-table-column prop="account" label="登陆账号" align="center"></el-table-column>
                <el-table-column prop="fullname" label="用户名称" align="center"></el-table-column>
                <el-table-column prop="" label="角色" align="center"></el-table-column>
            </el-table> -->
        </div>
    </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                defaultProps: {
                    label: (data, treeObject) => data.treeObject.orgname,
                    children: 'children'
                },
                defaProps: {
                    label: (data, treeObject) => data.treeObject.itemname,
                    children: 'children'
				},
                announcementType:null,
                clientTop:"50px",
                dialog_top: "100px",
                search:null,
                filterText:null,
                filterType:null,
                typeVisibleI:false,
                iscarrieddate:true,
                isinterval:true,
                isoneddate:false,
                iscode:false,
                isweek:false,
                ismonth:false,
                dialogVisible: false,
                showRole: false,
                showUser: false,
                triggerForm:{
                    summary:null,
                    sdate:null,
                    edate:null,
                    cycle:null,
                    carrieddate:null,
                    oneddate:"",
                    interval:null,
                    week:null,
                    month:null
                },
                settingForm: {
                    name: null,
                    receivemode:2,
                    type:null,
                    level:null,
                    status:1,
                    systempresets:1,
                    title:null,
                    content:null,
                    scheduling:null,
                    //schedulingstring:null,
                    program:null,
                    programparameter:null,
                    remindermode:''
                },
                todayLimit: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                schedulingstring:null,
                moduleList:[],
                detailsuserData:[],
                roleData: [],
                userData: [],
                checkList:[],
                usersData:[],
                ailsData:[],
                daysData:[],
                typeList:[],
                userList:[],
                someData:[]
               
            }
        },
        mounted() {
            this.init();
        },
        computed: {
            //全字段模糊查询
            searchData() {
                let search = this.search;
                if (search) {
                    return this.roleData.filter(roleData => {
                        return Object.keys(roleData).some(key => {
                            return String(roleData[key]).indexOf(search) > -1
                        })
                    })
                }
                return this.roleData;
            }
        },
        watch: {
            filterText(val) {
                this.$refs.usertree.filter(val);
            },

            filterType(val) {
                this.$refs.salestree.filter(val);
            },
            $route() {
                this.init();
            }
        },
        methods: {
            init() {
                this.getSomeData();
                this.getAilsUser();
                this.iscode = true
                const _this = this;
                let userDataI = [];
                let ailsDataI = [];
                if(this.$handlePageType('edit') === true){
                   this.getAjax('/message/infotemplate/get/'+this.$route.params.id)
                       .then(result => {
                            this.settingForm = result.data.infotemplate
                            this.schedulingstring = result.data.infotemplate.scheduling
                            this.settingForm.scheduling = result.data.infotemplate.scheduling
                            this.checkList = result.data.infotemplate.remindermode.split(",")
                            setTimeout(()=>{
                                for(let i=0; i<this.someData.length; i++){
                                    this.announcementType = _.filter(_this.someData,{itemkey:result.data.infotemplate.type})[0].itemname
                                };
                            },100)
                            //遍历对比Data，有的打勾
                            if(result.data.infotemplateDetails.length != 0){
                                setTimeout(()=>{
                                    for(let i=0; i<result.data.infotemplateDetails.length; i++){
                                            if(result.data.infotemplateDetails.length === 1){
                                                userDataI = _.filter(_this.userData,{'account':result.data.infotemplateDetails[i].account})
                                                ailsDataI = _.filter(_this.roleData,{'alias':result.data.infotemplateDetails[i].rolealias})
                                            }else {
                                                _this.usersData.push((_.filter(_this.userData,{'account':result.data.infotemplateDetails[i].account}))[0])
                                                _this.ailsData.push((_.filter(_this.roleData,{'alias':result.data.infotemplateDetails[i].rolealias}))[0])
                                            }
                                        }

                                    //用户打勾
                                    if(userDataI.length === 1 && userDataI[0] != undefined){
                                        _this.$refs.userdata.toggleRowSelection(userDataI[0]);
                                    }else if(_this.usersData[0] != undefined){
                                        for(let i=0; i<_this.usersData.length; i++){
                                            _this.$refs.userdata.toggleRowSelection(_this.usersData[i]);
                                        }
                                    }
                                    //角色打勾
                                    if(ailsDataI.length === 1 && ailsDataI[0] != undefined){
                                        _this.$refs.roleData.toggleRowSelection(ailsDataI[0]);
                                    }else if(_this.ailsData[0] != undefined){
                                        for(let i=0; i<_this.ailsData.length; i++){
                                            _this.$refs.roleData.toggleRowSelection(_this.ailsData[i]);
                                        }
                                    }
                                },200)
                            }
                       })
                }else if(this.$handlePageType('add') === true){
                    this.iscode = false;
                    this.settingForm = {
                        name: null,
                        receivemode:2,
                        type:null,
                        level:null,
                        status:1,
                        systempresets:1,
                        title:null,
                        content:null,
                        //schedulingstring:null,
                        program:null,
                        programparameter:null,
                        remindermode:''
                    };
               }
            },

            //遍历日期
            getday(){
                this.daysData = [];
                for(let i=1; i<32; i++){
                   this.daysData.push(i)
                }
            },

            //监控周期单位事件
            gtecycle(val){
                if(val === '每周' ){
                    this.isweek = true;
                    this.ismonth = false;
                    this.isoneddate = false;
                    this.iscarrieddate = true;
                    this.isinterval = false;
                }else if(val === '每月'){
                    this.ismonth = true;
                    this.isweek = false;
                    this.isoneddate = false;
                    this.iscarrieddate = true;
                    this.isinterval = false;
                }else if (val === '1次'){
                    this.isoneddate = true;
                    this.iscarrieddate = false;
                    this.ismonth = false;
                    this.isweek = false;
                    this.isinterval = false;
                }else if(val === '每天'){
                    this.iscarrieddate = true;
                    this.isoneddate = false;
                    this.ismonth = false;
                    this.isweek = false;
                    this.isinterval = true;
                }
            },

            //新增模板
            save(){
                if(this.$handlePageType('add') === true){
                    const _this = this;
                    if(this.triggerForm.oneddate != ""){
                        this.settingForm.scheduling = this.triggerForm.oneddate;
                    }else if(this.triggerForm.week){
                        this.settingForm.scheduling = '每周'+this.triggerForm.week+','+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }else if(this.triggerForm.month){
                        this.settingForm.scheduling = '每月'+this.triggerForm.month+'号,'+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }else if(this.triggerForm.interval){
                        this.settingForm.scheduling = '每'+this.triggerForm.interval+','+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }
                    if(this.checkList.length){
                        this.settingForm.remindermode = this.checkList.join(",");
                    }
                    // console.log(456456,this.settingForm.scheduling)
                    // console.log(4,this.settingForm)
                    setTimeout(()=>{
                        this.fetch('/message/infotemplate/add',{infotemplate:this.settingForm,infotemplateDetails:this.detailsuserData})
                        .then(result => {
                            if(result.status === 200){
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                            }else if(result.status === 500){
                                this.$message({
                                    message: this.returnIntercept(result),
                                    type: 'error'
                                });
                            }else{
								this.$message({
									message: '新增失败',
									type: 'error'
								});
							}
                        })
                    },100)
                }else if(this.$handlePageType('edit') === true){
                    const _this = this;
                    if(this.triggerForm.oneddate != ''){
                        this.settingForm.scheduling = this.triggerForm.oneddate;
                    }else if(this.triggerForm.week){
                        this.settingForm.scheduling = '每周'+this.triggerForm.week+','+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }else if(this.triggerForm.month){
                        this.settingForm.scheduling = '每月'+this.triggerForm.month+'号,'+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }else if(this.triggerForm.cycle === '每天'){
                        this.settingForm.scheduling = '每'+this.triggerForm.interval+','+this.triggerForm.sdate+' '+this.triggerForm.carrieddate+':00'+'到'+this.triggerForm.edate+' '+this.triggerForm.carrieddate+':00';
                    }
                    if(this.checkList.length){
                        this.settingForm.remindermode = this.checkList.join(",");
                    }
                    setTimeout(()=>{
                        this.fetch('/message/infotemplate/edit/'+this.$route.params.id,{infotemplate:this.settingForm,infotemplateDetails:this.detailsuserData})
                        .then(result => {
                            if(result.status === 200){
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                            }else if(result.status === 500){
                                this.$message({
                                    message: this.returnIntercept(result),
                                    type: 'error'
                                });
                            }else{
								this.$message({
									message: '新增失败',
									type: 'error'
								});
							}
                        })
                    },100)
                }
            },

            //触发器显示
            determine(){
                if(this.triggerForm.week){
                    this.schedulingstring = '从'+this.triggerForm.sdate+'开始'+','
                    +this.triggerForm.cycle+this.triggerForm.week+'的'+this.triggerForm.carrieddate+'开始执行,到'+this.triggerForm.edate+'结束';
                }else if(this.triggerForm.month){
                    this.schedulingstring = '从'+this.triggerForm.sdate+'开始'+','
                    +this.triggerForm.cycle+this.triggerForm.month+'号的'+this.triggerForm.carrieddate+'开始执行,到'+this.triggerForm.edate+'结束';
                }else if(this.triggerForm.oneddate != ''){
                    this.schedulingstring = this.triggerForm.cycle+','+this.triggerForm.oneddate;
                }else {
                    this.schedulingstring = '从'+this.triggerForm.sdate+'开始'+','
                    +this.triggerForm.cycle+'的'+this.triggerForm.carrieddate+'开始执行,每'+
                    this.triggerForm.interval+'一次,到'+this.triggerForm.edate+'结束';
                }
                this.dialogVisible = false;
            },
            
            //时间转换
            change(val){
                this.triggerForm.sdate=val
               
            },
            changeI(val){
                this.triggerForm.edate=val
            },
            datestring(val){
                this.triggerForm.oneddate = val
            },

            //选择接收人
            receiveSelect(row){
                this.detailsuserData = [];
                for(let i=0; i<row.length; i++){
                    this.detailsuserData.push({rolename:row[i].rolename,rolealias:row[i].alias,usertype:null,account:null,fullname:null})
                }
            },
            // receiveSelectI(row){
            //     this.detailsuserData = [];
            //     for(let i=0; i<row.length; i++){
            //         this.detailsuserData.push({rolename:null,rolealias:null,usertype:row[i].usertype,account:row[i].account,fullname:row[i].fullname})
            //     }
            // },
            getChange(data,boolean){
				const _this = this;
				this.userList = [];
				if(boolean){
					if(data.children){
						// detailsuserList = data.children.treeObject
						// for(let i=0; i<detailsuserList.length; i++){
						// 	_this.detailsuserData.push({rolename:null,rolealias:null,usertype:detailsuserList[i].usertype,account:detailsuserList[i].account,fullname:detailsuserList[i].orgname})
						// 	this.sendrangeAilsUser.push(this.detailsuserData[i].fullname)
						// }
						// console.log(45,_this.detailsuserData)
					}else{
						_this.userList.push(data.treeObject);
						for(let i=0; i<_this.userList.length; i++){
							if(_this.userList[i].account){
								_this.detailsuserData.push({rolename:null,rolealias:null,usertype:_this.userList[i].usertype,account:_this.userList[i].account,fullname:_this.userList[i].orgname})
							}
						}
						_this.detailsuserData =  _this.reduceObj(_this.detailsuserData,'account');
					}
				}else{
					_this.detailsuserData = _.reject(_this.detailsuserData,{'account':data.treeObject.account})
				}
			},

            //搜索人员
            filterNode(value, data) {
                if (!value) return true;
                return data.treeObject.orgname.indexOf(value) !== -1;
            },

            //搜索消息类型
			TypeNode(value, data){
				if (!value) return true;
                return data.treeObject.itemname.indexOf(value) !== -1;
			},

           //打开树
			show_add(){
                this.typeVisibleI = true;
                this.announcementType = null;
				this.settingForm.type = null;
				this.getListtype();
			},

            //获取数据字典
            getSomeData() {
                this.postDicData([{'nodekey':'messageType'}]).then( (result)=>{
                    if (result.status === 200) {
                       this.someData = result.data['messageType'];      
                    }
                })
            },

			//获取树
            getListtype(){
                this.fetch('message/dic/getList',{iscache:1})
                    .then(result => {
                        this.typeList = result.data
                    })
            },
			
			//获取树id
            gettypeid(val){
				this.announcementType = val.treeObject.itemname
				this.settingForm.type = val.treeObject.itemkey
			},
			
			//关闭树弹框
            closeDialog(){
                this.typeVisibleI = false;
                this.announcementType = null;
				this.settingForm.type = null;
			},

            //获取角色员工
            getAilsUser(){
                this.fetch('/sys/role/getAll',this.objfilter({
                        pageNo:this.cPage,
                        pageSize:10000,
                    })).then((result) => {
                        if(result.status=='200'){
                            this.roleData = result.data.list;
                        }
                    })
                this.fetch('/message/infotemplate/orgUser',{})
				.then(result => {
					if(result.status === 200){
						this.moduleList = result.data;
					}else {
						// this.$message({
						// 	message:'暂无数据',
						// 	type:'error'
						// });
					}
				})
                // this.fetch('/sys/user/getAll',this.objfilter({
                //         pageNo:this.cPage,
                //         pageSize:10000,
                //     })).then((result) => {
                //         if(result.status=='200'){
                //             this.userData = result.data.list;
                //         }
                //     })
            },

            //触发器
            show_dialog() {
                this.getday();
                setTimeout(()=>{
                    this.dialogVisible = true;
                    this.isweek = false;
                    this.ismonth = false;
                    this.isoneddate = false;
                    this.iscarrieddate = true;
                    this.isinterval = true;
                },200)
                this.triggerForm = {
                    summary:null,
                    sdate:null,
                    edate:null,
                    cycle:null,
                    carrieddate:null,
                    oneddate:"",
                    interval:null,
                    week:null,
                    month:null
                };
            },

            changeAccpet(val) {
                this.showRole = false;
                this.showUser = false;
                if(val === 1) {
                    this.showRole = true;
                    this.showUser = false;
                    this.getAilsUser();
                }else if(val === 3){
                    this.showUser = true;
                    this.showRole = false;
                    this.getAilsUser();
                }
            },

            //关闭
            shutDown(){
                this.$routeTo('mc_information_setting');
                this.clearForm();
            },

            //清空
            clearForm(){
                this.settingForm = {
                    name: null,
                    receivemode:2,
                    type:null,
                    level:null,
                    status:1,
                    systempresets:1,
                    title:null,
                    content:null,
                    scheduling:null,
                    //schedulingstring:null,
                    program:null,
                    programparameter:null,
                    remindermode:''
                };
                this.checkList = [];
                this.schedulingstring = null;
                this.announcementType = null;
            },

        }
    }
</script>
<style lang="less" scoped type="text/less">
    .margin-bot {
        margin-bottom: 88px;
        @media screen and (max-width: 1500px) {
            margin-bottom: 75px;
        }
    }
    .form-item-width {
        width: 320px!important;
    }
    .Height{
		height: 180px;
    }
    /*.width-checkbox{*/
        /*width: 400px;*/
    /*}*/
</style>