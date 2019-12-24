<!--
    存放获取公共数据的方法
-->
<template>
    <div></div>
</template>

<script>
    export default {
        props: {
            'valueObj': {
                type: Object
            }
        },
        data() {
            return {

            }
        },
        methods: {
            //喷码
            getMarkMethod(val) {
                this.valueObj.markMethodList = [];
                this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.markMethodList = result.data.list;
                        }
                    })
            },
            //获取包装方式
            getMdmPackMethod(val) {
                this.valueObj.mdmPackList = [];
                this.fetch('/oms/BasedataController/getMdmPackMethod?pageSize=100',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.mdmPackList = result.data.list;
                        }
                    })
            },
            //获取工程列表
            getProject(val) {
                if(!val) {val = ''}
                this.valueObj.projectList = [];
                this.getAjax('/oms/sls/SalesOrderMaster/getProject?pageSize=100&projectName='+val)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.projectList = result.data.list;
                        }
                    })
            },
            //获取客户的工程
            getClientProject(val) {
                this.valueObj.projectList = [];
                this.getAjax('/oms/sls/SalesClientOrder/getProject?pageSize=100&projectName='+val)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.projectList = result.data.list;
                        }
                    })
            },
            //获取合同
            getContract(val) {
                this.valueObj.contractList = [];
                this.getAjax('/oms/sls/SalesOrderMaster/getConcat?pageSize=100&contractCode='+val)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.contractList = result.data.list;
                        }
                    })
            },
            //获取客户的合同
            getClientContract(val) {
                this.valueObj.contractList = [];
                this.getAjax('/oms/sls/SalesClientOrder/getConcat?pageSize=100&contractCode='+val)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.contractList = result.data.list;
                        }
                    })
            },
            //获取客户
            getClient(val,searchParam = 'fcode') {
                this.valueObj.clientList = [];
                let tempObj = {
                    parentId:this.valueObj.clientParentId,
                    inactive:0
                };
                tempObj[searchParam] = val;
                this.fetch('/oms/BasedataController/getOrgClientCompany?pageSize=100',tempObj)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.clientList = result.data.list;
                        }
                    })
            },
            //新增国内订单-获取客户
            getOrderClient(val) {
                this.valueObj.clientList = [];
                    this.fetch('/oms/BasedataController/getOrgClientCompanyWithRouter?pageSize=10',{fcode:val,parentId:this.valueObj.clientParentId,filter:true})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.valueObj.clientList = result.data.list;
                            }
                        })
            },
            //收款凭证
            getproceeds(val) {
                this.valueObj.clientList = [];
                this.fetch('/oms/BasedataController/getOrgClientCompany?pageSize=100',{fcode:val,parentId:this.valueObj.clientParentId,filter:true})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.clientList = result.data.list;
                        }
                    })
            },
            //获取门户客户
            getOrgClient(val) {
                this.valueObj.orgClientList = [];
                this.fetch('/oms/BasedataController/getOrgClientCompany?pageSize=100',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.orgClientList = result.data.list;
                        }
                    })
            },
            //获取拜访客户
            getClientVist(val) {
                this.valueObj.vistList = [];
                this.fetch('/crm/Crm/VisitTaskInfo/getClientCompanyList?pageSize=100',{cltcompanyname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.vistList = result.data.list;
                        }
                    })
            },
            //获取服务报价客户
            getPriceClient(val) {
                this.valueObj.priceClientList = [];
                this.fetch('/oms/sls/OfferPrice/getClientCompany?pageSize=10',{cltcompanyname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.priceClientList = result.data.list;
                        }
                    })
            },
            //获取经销商
            getDistributor(val) {
                this.valueObj.distributors = [];
                this.fetch('/oms/BasedataController/getDistributor?pageSize=10',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.distributors = result.data.list;
                        }
                    })
            },
            //客户parentid带出经销商
            getDistributorByFid(fid) {
                this.valueObj.distributors = [];
                this.fetch('/oms/BasedataController/getDistributor?pageSize=100',{fid:fid})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.distributors = result.data.list;
                            this.$emit('setDistributorByClient',result.data.list[0])
                        }
                    })
            },
            //获取材质资料
            getMatAlloy() {
                this.valueObj.matAlloyList = [];
                this.fetch('/oms/BasedataController/getMatAlloy?pageSize=100',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.matAlloyList = result.data.list;
                        }
                    })
            },
            //获取型号分组
            getMatGroupCode(val){
                this.fetch('/oms/BasedataController/getAlGroupList?pageSize=100',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fcode');
                            this.valueObj.matGroupCodeList = tempList;
                        }
                    })
            },

            //获取注胶标记
            getInjectionFlag(val){
                this.valueObj.injectionFlagList=[];
                this.fetch('/oms/BasedataController/getPvcBrandListByValue?injectionFlag=1&value='+val)
                    .then(result=>{
                        if(result.data && result.data.list){
                            this.valueObj.injectionFlagList = result.data.list;
                        }
                    })
            },
            //获取胶条标记
            getStripFlag(val){
                this.valueObj.stripFlagList=[];
                this.fetch('/oms/BasedataController/getPvcBrandListByValue?stripFlag=1&value='+val)
                    .then(result=>{
                        if(result.data && result.data.list){
                            this.valueObj.stripFlagList = result.data.list;
                        }
                    })

            }


        }
    }
</script>
