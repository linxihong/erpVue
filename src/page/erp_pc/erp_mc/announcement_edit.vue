<template>
	<div class="page-secondnav page-commonnav">
		<div class="f-content">
		<div class="console-mt3">
			<el-button class="ui-color3" @click="save('announcementForm')">保存</el-button>
			<!-- <el-button @click="release">发布</el-button> -->
			<el-button class="ui-color3" @click="preview">发布</el-button>
			<el-button class="ui-color3" @click="unpublished">未发布:({{number}})条</el-button>
			<!-- <el-button @click="clearForm">清空</el-button> -->
			<el-button class="ui-color2" @click="cancel">关闭</el-button>
		</div>

		<el-form ref="announcementForm" :rules="rules" :inline="true" :model="announcementForm" label-width="80px" class="console-pt5 inputWidthI" enctype="mutipart/form-data" method='post'>
			<el-form-item label="消息类型" prop="announcementType">
				<el-input v-model.trim="announcementType" :readonly="true">
                    <el-button @click="show_add" slot="append"><i class="el-icon-more"></i></el-button>
                </el-input>
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="announcementForm.title"></el-input>
			</el-form-item>
			<el-form-item label="发布人">
				<el-input v-model="announcementForm.publisher" :readonly="true"></el-input>
			</el-form-item>
			<el-form-item label="发布时间">
				<el-date-picker
				:disabled="true"
				v-model="announcementForm.publishtime"
				align="right"
				type="datetime"
				format="yyyy-MM-dd HH:mm:ss"
				placeholder="发布时间">
			</el-date-picker>
			</el-form-item>
		</el-form>
		<el-form ref="announcementForm" :model="announcementForm" label-width="80px" class="inputWidthIII">
			<el-form-item label="内容" class="margin-botI">
				 <el-input v-model="announcementForm.content"  placeholder="请输入内容" :rows="10" type="textarea"></el-input>
			</el-form-item>

			<el-form-item label="附件">
				<!-- <el-button>添加附件</el-button>
				<ali-upload :sendurl="sendurl"></ali-upload>
				<input name="file" type="file" @change="update"/> -->
				<input type="file"  name="file" @change="doUpload" style="width: 20%"/>
			</el-form-item>
			<el-form-item label="发送范围" class="margin-bot">
				<el-input v-model="sendrange"  placeholder="请选择角色或者人员" resize="none" :rows="4" type="textarea" :readonly="true" @focus="empuser"></el-input>
			</el-form-item>
			<el-form-item label="推送时间">
				<el-radio-group v-model="announcementForm.pushmode"  @change="changeAccpet">
					<el-radio :label="1">立即推送</el-radio>
					<el-radio :label="2">定时推送</el-radio>
					<!-- <el-radio label="重复推送"></el-radio> -->
				</el-radio-group>
			</el-form-item>
			<el-form-item class="line">
				<el-col :span="6">
					<el-date-picker
						type="datetime"
						placeholder="选择日期"
						v-model="dateI"
						class="console-width-12"
						format="yyyy-MM-dd HH:mm:ss"
						@change="datestring"
						:disabled="isdate">
					</el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="提醒方式">
				<el-checkbox-group v-model="checkList">
					<el-checkbox label="1">页面弹窗</el-checkbox>
					<el-checkbox label="2">APP</el-checkbox>
					<el-checkbox label="3">微信</el-checkbox>
					<!-- <el-checkbox label="短信" :true-label='1'></el-checkbox> -->
					<el-checkbox label="4">邮件</el-checkbox>
				</el-checkbox-group>
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

		<!-- 发送范围 -->
		<el-dialog
			class="dialogDiv dialogDivII"
			:show-close="false"
			:visible.sync="dialogVisible"
			:top = "dialog_top"
			size="small">
			<div class="slideContent">
				<div class="leftDiv leftOffsetIII">
					<el-button class="icon-setting-2 icon-close" @click="dialogVisible = false"></el-button>
					<el-button class="icon-setting-1 icon-confirm" @click="reverted"></el-button>
				</div>
				<div class="slideTop" v-drag1>发送范围</div>
				<div class="slideMid">
					<template>
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane label="人员列表" name="first" :disabled="false">
								<!-- <el-table
									ref="userData"
									border
									highlight-current-row
									:data="userData"
									max-height='200'
									@select="receiveSelectI"
									@select-all="receiveSelectI">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column prop="usertype" label="账号类型" align="center"></el-table-column>
									<el-table-column prop="account" label="登陆账号" align="center"></el-table-column>
									<el-table-column prop="fullname" label="用户名称" align="center"></el-table-column>
									<el-table-column prop="" label="角色" align="center"></el-table-column>
								</el-table> -->
								<el-card class="del-shadow">
									<div class="console-m2">
										<el-input placeholder="输入关键字进行过滤" v-model="filterText" class="console-width-6"></el-input>
									</div>
									<div class="scroll-treeI Height scrollBar newsNode">
										<el-tree
											ref="usertree"
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
							</el-tab-pane>
							<el-tab-pane label="角色列表" name="second">
								<el-card class="del-shadow">
									<div class="console-m2">
										<el-input v-model="search" placeholder="角色名称" icon="search" class="console-width-6"></el-input>
									</div>
									<el-table
										ref="roleData"
										border
										highlight-current-row
										:data="searchData"
										max-height='200'
										@select="receiveSelect"
										@select-all="receiveSelect"
										class="th-center">
										<el-table-column type="selection" width="55" align="center"></el-table-column>
										<el-table-column prop="alias" label="角色别名" align="center">
											<template slot-scope="scope">
												<span>{{ scope.row.alias.replace(/(\S*)_/,'')}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="rolename" label="角色名称" align="center"></el-table-column>
									</el-table>
								</el-card>
								<!-- <el-table
									ref="userData"
									border
									highlight-current-row
									:data="userData"
									max-height='200'
									@select="receiveSelectI"
									@select-all="receiveSelectI">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column prop="usertype" label="账号类型" align="center"></el-table-column>
									<el-table-column prop="account" label="登陆账号" align="center"></el-table-column>
									<el-table-column prop="fullname" label="用户名称" align="center"></el-table-column>
									<el-table-column prop="" label="角色" align="center"></el-table-column>
								</el-table> -->
							</el-tab-pane>
						</el-tabs>
					</template>
				</div>
			</div>
		</el-dialog>

		<el-dialog class="dialogDiv dialogDivII"
				   :top="dialog_top"
				   :show-close="false"
				   :visible.sync="releaseVisible"
				   size="small"
				   :close-on-click-modal="false">
			<div class="slideContent">
				<div class="leftDiv aloneDivI topDiv">
					<el-button class="icon-setting-2 icon-close" @click="releaseVisible = false"></el-button>
				</div>
				<div class="slideTop" v-drag1>未发布列表</div>

				<div class="slideMid">
					<div>
						<el-form label-width="80px" :model="announcementForm" class="filterform inputColor">
							<!-- <el-form-item label="消息内容">
								<el-input type="textarea" :rows="4" v-model="announcementForm.content"></el-input>
							</el-form-item> -->
						</el-form>
						<!--<ZLCommonTable-->
							<!--ref="ZLCommonTable"-->
							<!--:tableData="receiveData"-->
							<!--:itemValues="itemValues"-->
							<!--@editRoute="editRoute"-->
							<!--@show="show_dialog"-->
							<!--@delete="delrow">-->
						<!--</ZLCommonTable>-->
						<ZLMessageTable
								ref="ZLMessageTable"
								:tableData="receiveData"
								:pageState="pageState"
								:tabHeight="tabHeight"
								@editRoute="editRoute"
								@show="show_dialog"
								@delete="delrow">
						</ZLMessageTable>
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
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
	</div>
</template>
<script>
	// import ali_upload from '../../../components/ali_upload'
	import ZLCommonTable from '../../../components/ZLCommonTable'
    import ZLMessageTable from '../../../components/ZLMessageTable'
	export default {
		components:{
			// 'ali-upload':ali_upload,
			ZLCommonTable,
            ZLMessageTable
		},
		data(){
			const _this = this;
			return{
                tabHeight: 500,
                pageState: 'announceEdit',
				defaultProps: {
                    label: (data, treeObject) => data.treeObject.orgname,
                    children: 'children'
				},

				defaProps: {
                    label: (data, treeObject) => data.treeObject.itemname,
                    children: 'children'
				},
				search:null,
				filterText:null,
				filterType:null,
				number:0,
				activeName:'first',
				clientTop:"50px",
                dialog_top: '50px',
				sendurl:'',
				apiUrl:'/message/dic/getAll',
				dateI:_this.recentDate('now'),
				typeVisibleI:false,
				isdate:true,
				dialogVisible:false,
				releaseVisible:false,
				sendrange:null,
				dialogType:'add',
				sendboxid:null,
				sendboxidiI:null,
				announcementType:null,
				announcementForm:{
					title:null,
					pushtime:null,
					pushmode:1,
					sendmode:0,
					content:null,
					type:null,
					publisher:this.$store.getters.getUserinfo.fullname,
					publishtime:_this.recentDate('now'),
					remindermode:'',
					status:null,
					attachment:null
				},
				rules: {
                    announcementType: [
                        {required: true, message: '请选择消息类型', trigger: 'blur'},
					],
                },
				addFormVisible: false,
				itemValues:[
				{
					name:'status',
					label:'状态',
					width:'60',
					type:'normal'
				},{
					name:'type',
					label:'消息类型',
					width:'',
					type:'normal'
				},{
					name:'title',
					label:'标题',
					width:'',
					type:'normal'
				},{
					name:'content',
					label:'消息内容',
					width:'',
					type:'normal'
				},{
					name:'publisher',
					label:'发布人',
					width:70,
					type:'normal'
				},{
					name:'publishtime',
					label:'发布时间',
					width:'',
					type:'normal'
				},{
					type:'isbutton',
					label:'操作',
					width: 180,
					buttons: [
						{name: 'editRoute',label:'发布'},
						{name: 'edit',label:'编辑'},
						{name: 'delete',label:'删除'},
					]
				}],
				moduleList:[],
				receiveData:[],
				checkList:[],
				detailsuserData:[],
				sendrangeAilsUser:[],
				sendboxUserAilu:[],
				roleData:[],
				userData:[],
				usersData:[],
				ailsData:[],
				toggailsData:[],
				typeList:[],
				userList:[],
				items:[]

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
				this.setStorage();
			}
		},
		methods:{
			init() {
				this.onContractChange();
				this.getailsuser();
				this.setStorage();
				this.getlist();
			},
            jungleHeight(){
			    if(this.$store.state.resolution === 'low'){
                    this.tabHeight = 470;
                }
            },

			//发布列表
			getlist(){
				const _this = this;
				let tempData = [];
				this.fetch('/message/sendbox/allByPage',{sendbox:{pageNo:this.cPage,pageSize:this.cSize,status:1}})
					.then(result => {
						tempData = result.data.list;
						for(let i in tempData) {
                            for(let j in this.items){
                                if (tempData[i].type === this.items[j].itemkey) {
                                    tempData[i].type = this.items[j].itemname
                                }
                            }
                        }

						for(let index in tempData) {
							if (tempData[index].status === 1) {
								tempData[index].status = '未发布'
							}else if(tempData[index].status === 2){
								tempData[index].status = '已发布'
							}else if(tempData[index].status === 3){
								tempData[index].status = '删除'
							}
						}

						for(let index=0; index<tempData.length; index++){
                            tempData[index].content = this.removeHTMLTag(tempData[index].content);
                        }
						_this.receiveData = tempData;
						this.number = result.data.total;
						this.cTotal = result.data.total;
					})
			},

			//保存公告
			save(announcementFormname){
				if(this.dialogType === 'add'){
					//this.announcementForm.content = this.$refs.ueditor.getUEContent();
					if(this.checkList.length){
						this.announcementForm.remindermode = this.checkList.join(",");
					}
					if(this.announcementForm.pushmode === 1){
						this.announcementForm.pushtime = null;
					}else if(this.announcementForm.pushmode === 2){
						this.announcementForm.pushtime = this.dateI;
					}
					this.announcementForm.status = 1;
					this.fetch('/message/sendbox/add',{sendbox:this.announcementForm,sendboxDetails:this.detailsuserData})
						.then(result => {
							if(result.status === 200){
								//console.log(4444,result.data)
								this.sendboxidiI = result.data;
								this.$message({
									message: result.message,
									type: 'success'
								});
							}else if(result.status === 500){
								this.$message({
									message: result.message,
									type: 'error'
								});
							}else if(result.status === 1002){
								this.$message({
									message: result.message,
									type: 'error'
								});
							}else{
								this.$message({
									message: '保存失败',
									type: 'error'
								});
							}
						})
					}else if(this.dialogType = 'edit'){
						//this.announcementForm.content = this.$refs.ueditor.getUEContent();
						if(this.checkList.length){
							this.announcementForm.remindermode = this.checkList.join(",");
						}
						if(this.announcementForm.pushmode === 1){
							this.announcementForm.pushtime = null;
						}else if(this.announcementForm.pushmode === 2){
							this.announcementForm.pushtime = this.dateI;
						}
						this.announcementForm.status = 1;
						this.fetch('/message/sendbox/edit/'+this.sendboxid,{sendbox:this.announcementForm,sendboxDetails:this.detailsuserData})
							.then(result => {
								if(result.status === 200){
									this.$message({
										message: result.message,
										type: 'success'
									});
								}else if(result.status === 500){
									this.$message({
										message: result.message,
										type: 'error'
									});
								}else if(result.status === 1002){
									this.$message({
										message: result.message,
										type: 'error'
									});
								}else{
									this.$message({
										message: '保存失败',
										type: 'error'
									});
								}
							})
					}
			},

			//编辑公告
			show_dialog(type,index,rows) {
				if(type === "add"){
					this.dialogType = 'add';
				}else if (type === "edit"){
					this.dialogType = 'edit';
					this.sendboxid = rows[index].sendboxcd;
					this.getsendboxid(rows[index].sendboxcd);
					this.announcementType = rows[index].type;
					//this.$refs.ueditor.setUEContent(rows[index].content);
				}
			},

			//删除
			delrow(index,rows){
				this.deleteAjax('/message/sendbox/del/'+rows[index].sendboxcd)
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
			},

			//获取单条数据
			getsendboxid(sendboxcd){
                const _this = this;
				this.getAjax('/message/sendbox/get/'+sendboxcd)
					.then(result => {
						this.announcementForm = result.data.sendbox;
						this.checkList = result.data.sendbox.remindermode.split(",");
						this.sendboxUserAilu = result.data.sendboxDetails;
						this.detailsuserData = result.data.sendboxDetails;
                        if(result.data.sendboxDetails.length === 1){
                            if(result.data.sendboxDetails[0].fullname === null){
                                _this.sendrange = result.data.sendboxDetails[0].rolename
                            }else {
                                _this.sendrange = result.data.sendboxDetails[0].fullname
                            }
                        }else {
                            _this.sendrangeAilsUser = [];
                            for(let i=0; i<result.data.sendboxDetails.length; i++){
                                if(result.data.sendboxDetails[i].fullname === null){
                                    _this.sendrangeAilsUser.push(result.data.sendboxDetails[i].rolename)
                                }else {
                                    _this.sendrangeAilsUser.push(result.data.sendboxDetails[i].fullname)
                                }
							}
                            _this.sendrange = _this.sendrangeAilsUser.join(',')
                        }
						setTimeout(()=>{
                            if(result.data.sendbox.pushtime){
                                this.dateI =result.data.sendbox.pushtime;
                            }else{
                                this.dateI =result.data.sendbox.publishtime;
                            }

						},200)
					});
				this.releaseVisible=false;
			},

			//打开树
			show_add(){
				this.typeVisibleI = true;
				this.announcementType = null;
				this.announcementForm.type = null;
				this.getListtype();
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
				this.announcementForm.type = val.treeObject.itemkey
			},

			//关闭树弹框
            closeDialog(){
				this.typeVisibleI = false;
				this.announcementType = null;
				this.announcementForm.type = null;
			},

			//遍历实现打勾
			getuserailu(){
				const _this = this;
				let userDataI = [];
				let ailsDataI = [];
				for(let i=0; i<this.sendboxUserAilu.length; i++){
					if(_this.sendboxUserAilu.length === 1){
						userDataI = _.filter(_this.userData,{'account':_this.sendboxUserAilu[i].account})
						ailsDataI = _.filter(_this.roleData,{'alias':_this.sendboxUserAilu[i].rolealias})
					}else {
						_this.usersData.push((_.filter(_this.userData,{'account':_this.sendboxUserAilu[i].account}))[0])
						_this.ailsData.push((_.filter(_this.roleData,{'alias':_this.sendboxUserAilu[i].rolealias}))[0])
					}
				}

				//用户打勾
				if(userDataI.length === 1 && userDataI[0] != undefined){
					_this.$refs.userData.toggleRowSelection(userDataI[0],true);
				}else if(_this.usersData[0] != undefined){
					for(let i=0; i<_this.usersData.length; i++){
						_this.$refs.userData.toggleRowSelection(_this.usersData[i]);
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
			},

			//发布公告
			editRoute(index,rows){
				let sendcd = null;
				if(this.sendboxidiI){
					sendcd = this.sendboxidiI;
				}else{
					sendcd = rows[index].sendboxcd;
				}
				this.fetch('/message/sendbox/send/'+sendcd,{})
				.then((result) => {
					if(result.status === 200){
						this.sendboxidiI = null;
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
			},

			//上传附件
			doUpload(e){
				let file = e.target.files[0];
				let param = new FormData(); //创建form对象
				param.append('file',file,file.name);//通过append向form对象添加数据
				param.append('chunk','0');//添加form表单中其他数据
				console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
				let config = {
				headers:{'Content-Type':'multipart/form-data'}
				};  //添加请求头
				//let fileDir =escape(param.get('file').name)
				let fileDir =param.get('file').name
				this.fetch('/message/file/upload?fileDir='+fileDir,param,config)
				.then(response=>{
					this.announcementForm.attachment = response.data.fileName
				})

				// this.fetch('/message/file/upload?fileDir=11',{},{
				// 	headers: {
				// 		systemid: this.$store.state.systemid,
				// 		'Content-Type': 'multipart/form-data'
				// 	}
				// }).then(result => {
				// 		console.log(666,result)
				// 	})


			},
			//清空
			clearForm(){
				this.dialogType = 'add';
				this.checkList = [];
				this.announcementForm = {
					title:null,
					pushtime:null,
					pushmode:1,
					sendmode:0,
					content:null,
					type:null,
					publisher:this.$store.getters.getUserinfo.fullname,
					publishtime:this.recentDate('now'),
					remindermode:'',
					status:null
				};
			},

			//选择部门或者员工
			empuser(){
				this.dialogVisible = true;
				setTimeout(()=>{
					this.getuserailu();
				},200)
			},

			//获取角色和员工
			getailsuser(){
				const _this = this;
				this.fetch('/sys/role/getAll',this.objfilter({pageNo:this.cPage,pageSize:10000,}))
				.then((result) => {
					if(result.status=='200'){
						this.roleData = result.data.list;
					}
				});

                this.fetch('/message/infotemplate/orgUser',{})
				.then(result => {
					if(result.status === 200){
						_this.moduleList = result.data;
					}else {
						// this.$message({
						// 	message:'系统正在升级中，请稍后再试',
						// 	type:'error'
						// });
					}
				})

				// this.fetch('/sys/user/getAll',this.objfilter({pageNo:this.cPage,pageSize:10000,}))
				// .then((result) => {
				// 	if(result.status=='200'){
				// 		this.userData = result.data.list;
				// 	}
				// })
			},

			//选择接收人
			receiveSelect(row){
				this.detailsuserData = [];
				this.sendrangeAilsUser =[]
				for(let i=0; i<row.length; i++){
					this.detailsuserData.push({rolename:row[i].rolename,rolealias:row[i].alias,usertype:null,account:null,fullname:null});
					this.sendrangeAilsUser.push(this.detailsuserData[i].rolename)
				}
			},
			// receiveSelectI(row){
			// 	this.detailsuserData = [];
			// 	this.sendrangeAilsUser =[]
			// 	for(let i=0; i<row.length; i++){
			// 		this.detailsuserData.push({rolename:null,rolealias:null,usertype:row[i].usertype,account:row[i].account,fullname:row[i].fullname})
			// 		this.sendrangeAilsUser.push(this.detailsuserData[i].fullname)
			// 	}
			// },

			getChange(data,boolean){
				const _this = this;
				this.userList = [];
				this.sendrangeAilsUser =[];
				if(boolean){
					if(data.children){
						// detailsuserList = data.children.treeObject
						// for(let i=0; i<detailsuserList.length; i++){
						// 	_this.detailsuserData.push({rolename:null,rolealias:null,usertype:detailsuserList[i].usertype,account:detailsuserList[i].account,fullname:detailsuserList[i].orgname})
						// 	this.sendrangeAilsUser.push(this.detailsuserData[i].fullname)
						// }
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

				for(let i=0; i<this.detailsuserData.length; i++){
					this.sendrangeAilsUser.push(this.detailsuserData[i].fullname)
				}

			},

			//时间转换为string类型
			datestring(val){
				this.dateI = val
			},

			//获取消息类型
			onContractChange(){
				const _this = this;
				this.fetch(this.apiUrl,{})
				.then(result => {
					this.items = result.data.list;
				})
			},

			//确定并返回
			reverted(){
				this.sendrange = this.sendrangeAilsUser.join(',');
				this.dialogVisible = false;
			},

			//标签滑动
			handleClick(tab, event){
				this.sendrangeAilsUser = [];
				this.detailsuserData = [];
				this.getailsuser();
			},

			//推送时间单选事件
			changeAccpet(val){
				if(val === 1 ){
					this.dateI = this.recentDate('now');
					this.isdate = true;
				}else if(val === 2){
					this.dateI = null;
					this.isdate = false;
				}
			},


			//未发布
			unpublished(){
			   this.releaseVisible = true;
			   this.getlist();
			},

			//发布
			preview(){
				this.editRoute();
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

			//设置缓存
            setStorage() {
				let AnnounmMission = this.$route.params.type;
				if(this.$route.params.type === undefined){
					AnnounmMission = sessionStorage.getItem('AnnounmMission')
				}
				setTimeout(()=>{
					sessionStorage.setItem('AnnounmMission',AnnounmMission);
				},200)
			},

			//清空
            clearForm(){
                this.announcementForm = {
                    title:null,
					pushtime:null,
					pushmode:1,
					sendmode:0,
					content:null,
					type:null,
					publisher:this.$store.getters.getUserinfo.fullname,
					publishtime:this.recentDate('now'),
					remindermode:'',
					status:null
                };
                this.checkList = [];
				this.announcementType = null;
				this.sendrange = null;
			},

			//关闭路由跳转
			cancel(){
				if(sessionStorage.getItem('AnnounmMission') === 'annou'){
					this.$routeTo('mc_announcement')
				}else if(sessionStorage.getItem('AnnounmMission') === 'task'){
					this.$routeTo('mc_task_message')
				}else {
					this.$routeTo('mc_announcement')
				}
				this.clearForm();
			}
		}
	}
</script>
<style lang="less" scoped type="text/less">
	.line {
		.el-col-1 {
			width: 4.16667%;
			text-align: center;
		}
	}
	.margin-bot {
		margin-bottom: 86px;
		@media screen and (max-width: 1500px) {
			margin-bottom: 73px;
		}
	}
	.margin-botI{
		margin-bottom: 250px;
	}
	.eliminate{
		position: relative;
		top: -35px;
		z-index: 9999;
	}
	.contract-project {
		display: flex;
		.c-div {
			flex: 1;
		}
		.p-div {
			flex: 1.5;
		}
	}
	.el-card + .el-card {
		margin-top: 0;
		margin-left: 20px;
	}

	.Height{
		height: 320px;
		@media screen and (max-width: 1400px){
			height: 220px;
		}
	}
</style>
