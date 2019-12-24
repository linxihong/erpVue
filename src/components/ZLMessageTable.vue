<template>
    <div class="percent-table">
        <el-table highlight-current-row :data="tableData" :height="tabHeight" @select-all="ischeckbox" @select="ischeckbox" class="adjust-table ui-color4">
            <el-table-column v-if="false" label="订单id" prop="orderid" align="center"></el-table-column>
            <el-table-column v-if="pageState!=='announceEdit'" type="selection" width="55"></el-table-column>
            <el-table-column label="状态" prop="status" align="center" width="80"></el-table-column>
            <el-table-column label="消息类型" prop="type" align="center" width="80"></el-table-column>
            <el-table-column label="标题" prop="title" align="center" width="200"></el-table-column>
            <el-table-column label="消息内容" prop="content" align="center">
                <template slot-scope="scope">
                        <el-tooltip :disabled="disabled" trigger="hover" placement="top" effect="dark">
                            <!--<div slot="content" class="name-wrapper">-->
                                <!--{{ scope.row.content }}-->
                            <!--</div>-->
                            <el-tag class='custom-tag'>{{ scope.row.content }}</el-tag>
                        </el-tooltip>
                    </template>
            </el-table-column>
            <el-table-column label="消息级别" prop="level" v-if="pageState=='remind'" align="center" width="80"></el-table-column>
            <el-table-column label="发布人" prop="publisher" align="center" width="120"></el-table-column>
            <el-table-column label="发布时间" prop="publishtime" v-if="pageState=='announce' || pageState=='announceEdit'" align="center" width="150"></el-table-column>
            <el-table-column label="接收时间" prop="receivetime" v-if="pageState=='remind' || pageState=='task'" align="center" width="150"></el-table-column>
            <el-table-column label=" " width="140" v-if="pageState=='task'" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="showRoute(scope.$index, tableData)">查看</el-button>
                    <!-- <span class="color-2">|</span>
                    <el-button type="text" @click="showHandle(scope.$index, tableData)">处理</el-button> -->
                </template>
            </el-table-column>
            <el-table-column label=" " width="100" v-if="pageState=='remind' || pageState=='announce'" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="showRoute(scope.$index, tableData)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label=" " width="150" v-if="pageState==='announceEdit'" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="showRoute(scope.$index, tableData)">发布</el-button>
                    <span class="color-2">|</span>
                    <el-button type="text" @click="showEdit('edit',scope.$index, tableData)">编辑</el-button>
                    <span class="color-2">|</span>
                    <el-button type="text" @click="showDelete(scope.$index, tableData)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: ['pageState','tableData','tabHeight','type'],
        data(){
            return {
                inboxcdData: [],
                disabled: true,
            }
        },
        mounted() {

        },
        methods: {
            showRoute(index,data){
                this.$emit('editRoute',index,data);
            },
            showHandle(index,data){
                this.$emit('show',index,data);
            },
            showDelete(index,data){
                this.$emit('delete',index,data);
            },
            showEdit(type,index,data){
                this.$emit('show',type,index,data);
            },
            //多选
            ischeckbox(row){
                this.inboxcdData = [];
                if(row.length){
                    for(let i=0; i<row.length; i++){
                        this.inboxcdData.push(row[i].inboxcd);
                    }
                }
                this.$emit('getcheckbox',this.inboxcdData);
            },
        },
    }
</script>
