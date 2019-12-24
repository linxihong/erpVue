<template>
    <div class="percent-table">
        <el-table  border v-loading="isLoading" v-if="$store.state.resolution === 'high'" highlight-current-row @select="ischeckbox" @select-all="ischeckbox" :data="tableData" class="adjust-table ui-color4" :height="tabHeight">
            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                type="selection"
                width="35"
                v-if="item.type === 'select'"
                align="center">
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                width="55"
                v-if="item.type === 'checkbox'"
                align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="item.value" @change="checkChange(item.value)" :disabled="scope.$index===0?false:true"></el-checkbox>
                </template>
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                :width="item.width"
                :prop="item.name"
                :label="item.label"
                v-if="item.type === 'normal'"
                :formatter="item.formatter?format:null"
                align="center"
                sortable
                :filters="item.tagFilter?tagSearch:null"
                :filter-method="item.tagFilter?filterTag:null">
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                :width="item.width"
                :prop="item.name"
                :label="item.label"
                v-if="item.type === 'hovernormal'"
                :formatter="item.formatter?format:null"
                align="center"
                :filters="item.tagFilter?tagSearch:null"
                :filter-method="item.tagFilter?filterTag:null">
                <template slot-scope="scope">
                    <el-tooltip trigger="hover" placement="top" effect="dark">
                        <div slot="content" class="name-wrapper">
                            {{ scope.row.item }}
                        </div>
                        <el-tag class='custom-tag'>{{ scope.row.item }}</el-tag>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                :width="item.width"
                 :label="item.label"
                v-if="item.type === 'button'"
                align="center">
                <template slot-scope="scope">
                    <slot v-for="b in item.buttons">
                        <el-button type="text" @click="buttonClick(b.name,scope.$index, tableData)">{{b.label}}</el-button>
                        <!--  <span class="color-2">|&nbsp;</span>-->
                    </slot>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="(item,index) in arrValues"
                    :key="index"
                    :width="item.width"
                    :label="item.label"
                    v-if="item.type === 'isbutton'"
                    align="center">
                <template slot-scope="scope">
                    <slot v-for="b in item.buttons">
                        <el-button type="text" @click="buttonClickI(b.name,scope.$index, tableData)" :disabled="isbutton">{{b.label}}</el-button>
                    </slot>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="(item,index) in arrValues"
                    :key="index"
                    :width="item.width"
                    :label="item.label"
                    v-if="item.type === 'choose'"
                    align="center">
                <template slot-scope="scope">
                    <slot>
                        <el-checkbox-group v-model="scope.row.checkList">
                            <el-checkbox v-for="c in item.chooses" :key="c.name" :label="c.code">{{c.label}}</el-checkbox>
                        </el-checkbox-group>
                    </slot>
                </template>
            </el-table-column>
        </el-table>

        <el-table  border v-loading="isLoading"  v-else highlight-current-row @select-all="ischeckbox" @select="ischeckbox" :data="tableData" class="ui-color4 adjust-table" :height="tabHeight">
            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                type="selection"
                width="35"
                v-if="item.type === 'select'"
                align="center">
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                width="55"
                v-if="item.type === 'checkbox'"
                align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="item.value" @change="checkChange(item.value)" :disabled="scope.$index===0?false:true"></el-checkbox>
                </template>
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                :width="item.widthI"
                :prop="item.name"
                :label="item.label"
                v-if="item.type === 'normal'"
                :formatter="item.formatter?format:null"
                align="center"
                sortable
                :filters="item.tagFilter?tagSearch:null"
                :filter-method="item.tagFilter?filterTag:null">
            </el-table-column>

            <el-table-column
                v-for="(item,index) in arrValues"
                :key="index"
                :width="item.widthI"
                :label="item.label"
                v-if="item.type === 'button'"
                align="center">
                <template slot-scope="scope">
                    <slot v-for="b in item.buttons">
                        <el-button type="text" @click="buttonClick(b.name,scope.$index, tableData)">{{b.label}}</el-button>
                    </slot>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="(item,index) in arrValues"
                    :key="index"
                    :width="item.widthI"
                    :label="item.label"
                    v-if="item.type === 'isbutton'"
                    align="center">
                <template slot-scope="scope">
                    <slot v-for="b in item.buttons">
                        <el-button type="text" @click="buttonClick(b.name,scope.$index, tableData)">{{b.label}}</el-button>
                    </slot>
                </template>
            </el-table-column>

            <el-table-column
                    v-for="(item,index) in arrValues"
                    :key="index"
                    :width="item.widthI"
                    :label="item.label"
                    v-if="item.type === 'choose'"
                    align="center">
                <template slot-scope="scope">
                    <slot v-for="c in item.chooses">
                        <el-checkbox>{{c.label}}</el-checkbox>
                    </slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: {
            tableData: Array,
            itemValues: Array,
            tabHeight: Number,
            isLoading:Boolean
        },
        data() {
            return {
                isbutton:false,
                buttontype:null,
                arrValues: this.itemValues||[],
                //tabHeight:610,
                inboxcdData: [],
                tagSearch:[],
                checkList:['0','1']
            }
        },
        watch:{
            'tableData':'getTableData'
        },

        mounted() {
            this.jungleHeight();
            this.getHeight();
        },
        methods: {
            //按钮
            buttonClick(type,index,data) {
                if(type === 'edit') {
                    this.$emit('show',type,index,data);
                }else if(type === 'delete') {
                    this.$emit('delete',index,data)
                }else if(type === 'editRoute'){
                    this.$emit('editRoute',index,data);
                }else if(type === 'detail') {
                    this.$emit('detail',index,data)
                }else {
                    console.log(type)
                }
            },

            buttonClickI(type,index,data){
                if(type === 'edit') {
                    this.$emit('show',type,index,data);
                }else if(type === 'delete') {
                    this.$emit('delete',index,data)
                }else if(type === 'editRoute'){
                    this.$emit('editRoute',index,data);
                } else {
                    console.log(type)
                }
            },
            checkChange(row) {
                //this.$emit('ischeckbox',row)
            },

            //获取表格高度
            getHeight(val){
                //this.tabHeight = val;
            },

            //标签搜索
            filterTag(value, row){
                return row.clientname === value;
            },

            //组成tagSearch数组
            getTableData(){
                const _this = this;
                this.tagSearch = [];
                for(let i=0; i<this.tableData.length; i++){
                    this.tagSearch.push({text:this.tableData[i].clientname,value:this.tableData[i].clientname});
                }
                this.tagSearch = _this.reduceObj(this.tagSearch,'text');
            },

            //多选
            ischeckbox(row){
                this.inboxcdData = [];
                if(row.length){
                    for(let i=0; i<row.length; i++){
                        this.inboxcdData.push(row[i].inboxcd)
                    }
                }
                this.$emit('getcheckbox',this.inboxcdData)
            },

            //禁用启用按钮
            getIsbutton(){
                let tempData = this.tableData;
                // this.isbutton =true;
                // if(this.arrValues[6].buttons.label === '发布'){
                //     this.isbutton = true;
                // }
                // for(let index in tempData) {
                //     if (tempData[index].status === '未发布') {
                //         this.isbutton =true;
                //         console.log(222)
                //     }else if(tempData[index].status === '已发布'){
                //         //this.tableData[index].status = '已发布'
                //     }else if(tempData[index].status === '删除'){
                //         //this.tableData[index].status = '删除'
                //     }
                // }
            },

            handleSelectionChange(val) {
                console.log(val)
            },

            jungleHeight(){
                if(this.$store.state.resolution === 'high'){
                    //this.tabHeight = 610;
                }else if(this.$store.state.resolution === 'low'){
                   // this.tabHeight = 460;
                }
            },

            //日期-时-分 显示格式化
            format(row,column,cellValue) {
                return this.formatDate(cellValue,'ymdhM');
            }
        }
    }
</script>