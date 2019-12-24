<template>
    <div class="common-wrap flex-column">
        <!--搜索区域-->
        <CommonSearch
            :isInLine="true"
            :isShowStatus="isShowStatus"
            :propData="searchProp"
            :searchForm="searchForm"
            @getData="getInitPage"
            inputWidth="300px"
        >
            <template slot="search-other-btn">
                <el-button @click="getData">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
            </template>
        </CommonSearch>
        <!--表格区域-->
        <CommonTable
            ref="refTable"
            :isCenter="true"
            :tableHeight="$store.state.screenHei*0.76"
            :isShowStatus="isShowStatus"
            :propData="tableProp"
            :otherVariable="otherVariable"
            :tableData="tableData"
        >
            <template slot="operate-btn">
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template slot-scope="scope">
                        <!--禁止-->
                        <el-button
                            size="mini"
                            :type="scope.row.sysAccountStatus > 0 ? 'danger' : ''"
                            @click="isEnable(scope.row,scope.$index)"
                        >{{scope.row.sysAccountStatus > 0 ? '禁用' : '启用'}}</el-button>
                        <!--<el-button @click="initPassword">初始密码</el-button>-->
                    </template>
                </el-table-column>
            </template>
        </CommonTable>
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
                        prop:'fcode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入客户代码'
                    },
                    {
                        name:'客户名称',
                        prop:'fname',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'业务员',
                        prop:'saleName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'跟单员',
                        prop:'followName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //表格映射列表
                tableProp: [
                    {prop:'fcode', name:'客户代码',type:'normal',align:'left'},
                    {prop:'fname',name:'客户名称',type:'normal',align:'left',width:300},
                    {prop:'clientTypeName',name:'客户类型',type:'normal',align:'left'},
                    {prop:'clientStatusName',name:'客户状态',type:'normal',align:'left'},
                    {prop:'saleName',name:'业务员',type:'normal',align:'left'},
                    {prop:'followName',name:'跟单员',type:'normal',align:'left'},
                    {prop:'sysAccountEnterName',name:'开通人',type:'normal',align:'left'},
                    {prop:'sysAccountEnterTime',name:'开通时间',type:'normal',align:'left'},
                    {prop:'sysAccountStatus',name:'账号状态',type:'select',width:100,align:'center',
                        selectList:[
                            {value:-1,label:'已禁用'},
                            {value:0,label:'未开通'},
                            {value:1,label:'已启用'}
                        ]
                    },
                ],
                searchForm: {},
                tableData: [],
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.tableData = [];
                this.fetch(`/oms/ClientAccount/selectClientAccouont?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            handleReset() {
                this.searchForm = {};
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            isEnable(row) {
                if(row.sysAccountStatus < 1) {
                    let resultStatus;
                    let datalist;
                    let resultError;
                    this.getAjax('/oms/mdm/branControl/getClientBran?cltId='+row.fid)
                        .then(result => {
                            resultStatus = result.status;
                            if(result.status === 200) {
                                datalist = result.data;
                            }else {
                                resultError = result.error;
                            }
                        })
                        .then(() => {
                            if(resultStatus === 200 && datalist && datalist.length) {
                                //启用
                                this.getAjax('/oms/ClientAccount/openAccount?fId='+row.fid)
                                    .then(result => {
                                        if(result.status === 200) {
                                            this.$message({
                                                message: '启用成功',
                                                type: 'success'
                                            });
                                            this.getData();
                                        }else {
                                            this.$message({
                                                message: '启用失败',
                                                type: 'error'
                                            })
                                        }
                                    })
                            }else {
                                this.$message({
                                    message: resultError,
                                    type: 'error'
                                })
                            }
                        })
                }else {
                    //禁用
                    this.getAjax('/oms/ClientAccount/forbidAccount?fId='+row.fid)
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    message: '禁用成功',
                                    type: 'success'
                                });
                                this.getData();
                            }else {
                                this.$message({
                                    message: '禁用失败',
                                    type: 'error'
                                })
                            }
                        })
                }
            },
            initPassword() {

            }
        }
    }
</script>
