<template>
    <div class="common-wrap flex-column">
        <el-form :model="searchForm" :inline="true">
            <el-form-item label="制单日期:" >
                <el-date-picker
                    v-model="searchForm.docDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item >
                <el-date-picker
                    v-model="searchForm.docDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-button class="btn-cyan search-btn" @click="getData">查询</el-button>
            <el-button  @click="handleRefresh">重置</el-button>
        </el-form>
        <!--表格区域-->
        <CommonTable
            ref="refTable"
            :isCenter="true"
            :tableHeight="$store.state.screenHei*0.79"
            :isShowStatus="isShowStatus"
            :propData="tableProp"
            :otherVariable="otherVariable"
            :tableData="tableData"
        ></CommonTable>
        <!--分页区域-->
        <CommonPagination
            :pageObj="pageObj"
            @getData="getData"
        ></CommonPagination>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination
        },
        data() {
            return {
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isReadTable: true
                },
                //分页
                pageObj: {
                    className: 'custom-pagination',
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'客户',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入客户'
                    },
                    {
                        name:'经销商',
                        prop:'clientCode2',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'工程名称',
                        prop:'projectName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    }
                ],
                //表格映射列表
                tableProp: [
                    {prop:'', name:'单据编号',type:'normal',align:'left'},
                    {prop:'',name:'制单日期',type:'normal',align:'left'},
                    {prop:'',name:'单据类型',type:'normal',align:'left'},
                    {prop:'', name:'支数',type:'normal',align:'right'},
                    {prop:'', name:'重量',type:'normal',align:'right'},
                    {prop:'', name:'应付金额',type:'normal',align:'right'},
                    {prop:'', name:'已付金额',type:'normal',align:'right'},
                    {prop:'', name:'结余欠款',type:'normal',align:'right'},

                ],
                searchForm: {
                    clientPortal:true,
                },
                tableData: [],
            }
        },
        mounted() {
            //  this.getData();
        },
        //还没有接口
        methods: {
            getData() {
                this.fetch(`?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            handleRefresh() {
                this.searchForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
        }
    }
</script>
