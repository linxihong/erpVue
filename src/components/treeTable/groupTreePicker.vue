/**
* @date 2017/11/22
* @desc 员工添加 所属组织
**/
<template>
    <div class="m-GroupPickerVisible">
        <div @click="$handlePageType('detail') != true&&handleOpen()">
            <el-select  disabled   v-model="selectids" size="small" multiple placeholder="请选择所属组织" style="width: 100%" @remove-tag="handleorgidsremove" popper-class="select-hide">
                <el-option
                        v-for="item in grouplist"
                        :key="item.orgid"
                        :label="item.orgname"
                        :value="handletoString(item.orgid)">
                </el-option>
            </el-select>
        </div>

		<el-dialog
                ref="dialogII"
                :top = "dialog_top"
                :visible.sync="GroupPickerVisible"
                :show-close='false'
		        :before-close="handleClose"
                :modal='modalStatus'
                :close-on-press-escape='modalStatus'
                class='dialogDiv dialogDivII'>
            <div class="slideContent leftOffsetIII" v-drag1>
                <div class="leftDiv ">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="handleSubmit()"></el-button>
                </div>
                <div class="slideTop">组织列表</div>
                <div class="slideMid">
                    <el-table :data="groupData"  class="console-width-12" :row-style="showTr" max-height="500">
                        <el-table-column label="组织">
                            <template slot-scope="scope">
                                <span v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
                                <el-button class="button is-outlined is-primary is-small"
                                        v-if="toggleIconShow(scope.$index,scope.row)"
                                        @click="toggleTr(scope.$index)">
                                    <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i>
                                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom"></i>
                                </el-button>
                                <span>{{scope.row.orgname}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="选择">
                            <template slot-scope="scope">
                                <el-checkbox @change="ifGroupSelect(scope.row)" v-model='groupChecked[scope.row.orgid]' :checked="groupChecked[scope.row.orgid]"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--<span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确 定</el-button>
                </span>-->
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import Utils from './utils/index.js'
    export default {
        name: 'GroupPicker',
        data () {
            return {
                dialog_top: '100px',
                //multipleSelection: [],
                selectnameslist:[],
                selectnames:[],
                selectids:"",
				modalStatus:false,
                groupChecked: {},
                groupCheckedlist: {},
                groupObj: {},
                grouplist: [],
                groupData: [],
                Inputreadonly: true,
                GroupPickerVisible: false,
            }
        },
        watch:{
            "groupChecked"(val){
                console.log('groupChecked' ,val)
            },
            "orgids"(val){
                if(this.grouplist.length ==0){
                    this.getgrouplist();
                }
                this.selectids = val;

            },
            "grouplist"(val){ },
            "orgnames"(val){},
            "orgNameIds"(val){},
        },
        computed:{

        },
        props: {
            'orgids':{
                type: [String,Array],
            },
            'orgnames':{
                type: [String,Array],
            },
            'orgNameIds':{
                type: [String,Array],
            },
        },
        moutend:()=>{
            this.getgrouplist();
            console.log('grouplist',this.grouplist)
        },
        methods: {
            //展示第二层dialog
            showDialogII() {
                document.body.appendChild(this.$refs.dialogII.$el);
            },
            handleElGroupChecked(status) {
                return status ==true?true:false
            },
            handleOpen(done) {
                this.showDialogII();
                if(this.grouplist.length ==0){
                    this.getgrouplist();
                }

                let _groupChecked={};
                this.GroupPickerVisible = true;
                _.each(this.groupObj,v=>{
                    _groupChecked[v.orgid] = false;
                });
                _.each(this.selectids,v=>{
                    _groupChecked[v] = true;
                });
                setTimeout(()=>{
                    this.$nextTick()
                    this.groupChecked = _groupChecked;
                },200)
            },
            handleSubmit(done) {
                this.$emit('input',this.selectids);
                this.GroupPickerVisible = false;
            },
            handleClose(done) {
                this.GroupPickerVisible = false;
                done;
            },

            columnStatus(status) {
                return true
            },
            columnDataFilter(scope, column) {
                return column
            },
            // 展开下级
            toggleTr: function (trIndex) {
                console.log(trIndex,this.groupData[trIndex])
                let me = this;
                let record = me.groupData[trIndex];
                record._expanded = !record._expanded
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow (index, record) {
                let me = this;
                //me.treeStructure && index === 0 && record.children &&
                if( record.children &&record.children.length > 0) {
                    return true
                }
                return false
            },
            // 显示行
            showTr: function (row, index) {
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show
                return show ? '' : 'display:none;'
            },
            //组织管理 获取组织树
            ifGroupSelect(vals) {
                let _selectorgids=[];
                _.each(this.groupChecked,(v,k)=>{
                    if (v==true&&this.groupObj[k]){
                        _selectorgids.push(this.groupObj[k].orgid.toString());
                    }
                });
                this.selectids = _selectorgids;
                  console.log(this.selectids)
            },
            handleorgidsremove(vals) {

                this.$emit('input',this.selectids);
            },
            handleorgidschange(vals) {
                let _selectnames = [],_selectorgids=[],_selectnameslist=[];
                _.each(vals,(v,k)=>{
                    if (v==true&&this.groupObj[k]){
                        _selectnames.push(this.groupObj[k].orgname)
                        _selectorgids.push(this.groupObj[k].orgid.toString());
                        _selectnameslist.push({itemvalue:this.groupObj[k].orgid,itemname:this.groupObj[k].orgname})
                    }
                });
                //this.selectids = _selectorgids//.join(',')
                //this.selectnames = _selectnames//_selectnames.join(',');
                this.selectnameslist = _selectnameslist//_selectnames.join(',');
            },
            getgrouplist() {
                this.getAjax('/sys/org/getList').then((result) => {
                    if (result.status == '200') {
                        if (result.data&&result.data[0]){
                            _.each(result.data[0].list,v=>{
                                this.groupObj[v.orgid] = v;
                            })
                        }
                        result.data.length != 0 ? this.groupData = this.handleListToTree(result.data, {cid: 'orgid', labelName: 'orgname',}) : '';
                        this.grouplist = result.data[0].list;
                        this.groupData = Utils.MSDataTransfer.treeToArray(this.groupData, null, null, true);
                    }else {
                        this.$message({
                            message:'系统正在升级中，请稍后再试',
                            type:'error'
                        });
                    }
                })
            },
        }
    }

</script>
<style scoped>
    .select-hide{
        display: none!important;
    }
	.custom-dialog{
		padding: 10px;
		z-index: 1000;
	}
</style>
