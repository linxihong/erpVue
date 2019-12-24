<script>
    export default {
        data() {
            return {
                moduleData: [],
                dialog_top: "80px",
                moduleVisiable: false,
                fileList: [],
                fileName: '',
                files: null,
                errorMessage: null,
                moduleDatail: {},
                downloadUrl: '../../../static/orderDetailModule.xls'
            }
        },
        methods: {
            //获取子型号列表
            getMatCodeList(val,pasteValue = null,vague = 1,even = null,leftVague = null,rightVague = null) {
                this.matCodeList = [];
                this.firstMatCode = null;
                this.fetch('/oms/BasedataController/getAluModelByValue?pageSize=10',{fcode:val,vague,even,leftVague,rightVague})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.matCodeList = result.data.list;
                            this.firstMatCode = result.data.list[0].fcode;
                            if(pasteValue && (pasteValue.toLowerCase() === this.firstMatCode.toLowerCase())) {
                                this.$message({
                                    message: '匹配成功',
                                    type: 'success'
                                });
                                this.setMatCode(pasteValue);
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.matCodeSelect && this.$refs.matCodeSelect.navigateOptions('next');
                                })
                            }
                        }
                    })
            },
            //获取颜色列表
            getColorCodeList(val,pasteValue = null,vague = 1,even = null,leftVague = null,rightVague = null) {
                this.colorCodeList = [];
                this.firstColorName = null;
                this.fetch('/oms/BasedataController/getMatColor?pageSize=10',{fname:val,vague,even,leftVague,rightVague})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.colorCodeList = result.data.list;
                            this.firstColorName = result.data.list[0].fname;
                            if(pasteValue && (pasteValue.toLowerCase() === this.firstColorName.toLowerCase())) {
                                this.$message({
                                    message: '匹配成功',
                                    type: 'success'
                                });
                                this.setColorCode(pasteValue);
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.colorSelect && this.$refs.colorSelect.navigateOptions('next');
                                })
                            }
                        }
                    })
            },
            //获取材质资料列表
            getMatAlloy(val,pasteValue = null,vague = 1,even = null,leftVague = null,rightVague = null) {
                this.matAlloyList = [];
                this.firstMatAlloy = null;
                this.fetch('/oms/BasedataController/getMatAlloy',{fcode:val,vague,even,leftVague,rightVague})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.matAlloyList = result.data.list;
                            this.firstMatAlloy = result.data.list[0].fcode;
                            if(pasteValue && (pasteValue.toLowerCase() === this.firstMatAlloy.toLowerCase())) {
                                this.$message({
                                    message: '匹配成功',
                                    type: 'success'
                                });
                                this.setMatAlloy(pasteValue);
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.matAlloySelect && this.$refs.matAlloySelect.navigateOptions('next');
                                })
                            }
                        }
                    })
            },
            setMatAlloy(val,isNext = true) {
                if(val) {
                    let item = this.matAlloyList.find(item => item.fcode === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'alloyId',item.fid);
                        this.$set(this.tabDataI[this.editIndex],'cx2',item.fcode);
                        this.$set(this.tabDataI[this.editIndex],'cx2Name',item.fname);
                    }
                }else {
                    this.$set(this.tabDataI[this.editIndex],'alloyId',null);
                    this.$set(this.tabDataI[this.editIndex],'cx2',null);
                    this.$set(this.tabDataI[this.editIndex],'cx2Name',null);
                }
                if(isNext) {
                    this.nextFocus();
                    this.$nextTick(() => {
                        this.$refs.matAlloySelect.handleClose();
                    })
                }
            },

            //获取膜厚列表
            getMatThick(val,pasteValue = null,vague = 1,even = null,leftVague = null,rightVague = null) {
                this.matThickList = [];
                this.firstMatThick = null;
                this.fetch('/oms/BasedataController/getMatThick',{fname:val,vague,even,leftVague,rightVague})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.matThickList = result.data.list;
                            this.firstMatThick = result.data.list[0].fname;
                            if(pasteValue && (pasteValue.toLowerCase() === this.firstMatThick.toLowerCase())) {
                                this.$message({
                                    message: '匹配成功',
                                    type: 'success'
                                });
                                this.setMatThick(pasteValue);
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.matThickSelect && this.$refs.matThickSelect.navigateOptions('next');
                                })
                            }
                        }
                    })
            },
            setMatThick(val,isNext = true) {
                if(val) {
                    let item = this.matThickList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'cx3',item.fcode);
                        this.$set(this.tabDataI[this.editIndex],'cx3Name',item.fname);
                    }
                }else {
                    this.$set(this.tabDataI[this.editIndex],'cx3',null);
                    this.$set(this.tabDataI[this.editIndex],'cx3Name',null);
                }
                if(isNext) {
                    this.nextFocus();
                    this.$nextTick(() => {
                        this.$refs.matThickSelect.handleClose();
                    })
                }
            },

            //获取撕筋
            setUsrTxt3Name(val) {
                if(val === '1') {
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3Name','✔');
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3','1');
                }else {
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3Name','');
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3','0');
                }
            },
            //喷码
            getMarkMethod(val) {
                this.$refs.commondata.getMarkMethod(val);
            },
            setMarkMethod(item) {
                this.$set(this.valueObj,'markMethod',item.fname);
                this.$set(this.addOrEditForm,'usrTxt1Name',item.fname);
                this.$set(this.addOrEditForm,'usrTxt1',item.fcode);
            },

            //注胶
            getInjectionFlag(val){
                this.$refs.commondata.getInjectionFlag(val);
            },
            setInjectionFlag(item) {
                this.$set(this.addOrEditForm,'injectionPvcBrandName',item.fname);
                this.$set(this.addOrEditForm,'injectionPvcBrandCode',item.fcode);
                this.$set(this.addOrEditForm,'injectionBrandPvcId',item.fid);
            },

            //胶条标记
            getStripFlag(val){
                this.$refs.commondata.getStripFlag(val);
            },
            setStripFlag(item) {
                this.$set(this.addOrEditForm,'stripPvcBrandName',item.fname);
                this.$set(this.addOrEditForm,'stripPvcBrandCode',item.fcode);
                this.$set(this.addOrEditForm,'stripPvcBrandId',item.fid);
            },
            //包装方式
            getMdmPackMethod(val) {
                this.$refs.commondata.getMdmPackMethod(val);
            },
            setPackMethod(item) {
                this.$set(this.valueObj,'packMethodName',item.fname);
                this.$set(this.addOrEditForm,'packMethodName',item.fname);
                this.$set(this.addOrEditForm,'packMethodCode',item.fcode);
            },

            //提货方式
            getDeliveryMethod() {
                this.deliveryMethodList = [];
                this.fetch('/oms/BasedataController/getDeliveryMethod?pageSize=10',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.deliveryMethodList = result.data.list;
                        }
                    })
            },
            setDeliveryMethod(val) {
                let item;
                item = this.deliveryMethodList.find(item => item.fname === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.loaderMethodCode = item.fcode
                }
            },

            //获取单据类型
            getOrderType() {
                this.orderTypeList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30114')
                    .then(result => {
                        if(result.data) {
                            this.orderTypeList = result.data;
                        }else {
                            this.orderTypeList = [];
                        }
                    })
            },

            //货期等级
            getDeliveryLevel() {
                this.deliveryLevelList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30116')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            this.deliveryLevelList = result.data;
                        }else {
                            this.deliveryLevelList = [];
                        }
                    })
            },
            setDelivery(val) {
                let item;
                item = this.deliveryLevelList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.deliveryLevelName = item.dictText
                }
            },

            //开票类型
            getVatTypeNameList() {
                this.vatTypeNameList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30118')
                    .then(result => {
                        if(result.data) {
                            this.vatTypeNameList = result.data;
                        }else {
                            this.vatTypeNameList = [];
                        }
                    })
            },
            setVatTypeName(val) {
                let item;
                item = this.vatTypeNameList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.vatTypeName = item.dictText
                }
            },

            //喷码
            getUsrTxt1List(val) {
                this.usrTxt1List = [];
                this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.usrTxt1List = result.data.list;
                            if(!val) {
                                this.$nextTick(() => {
                                    this.$refs.usrTxt1 && this.$refs.usrTxt1.navigateOptions('next');
                                })
                            }
                        }
                    })
            },
            _getUsrTxt1List(val) {
                this.usrTxt1List = [];
                this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.usrTxt1List = result.data.list;
                        }
                    })
            },
            _setUsrTxt1() {
                this.$nextTick(() => {
                    this.nextFocus();
                })
            },
            setUsrTxt1(val,isNext = true) {
                if(val) {
                    let item;
                    item = this.usrTxt1List.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'usrTxt1Name',item.fname);
                        this.$set(this.tabDataI[this.editIndex],'usrTxt1',item.fcode);
                    }
                }
                if(isNext) {
                    this.nextFocus();
                    this.$nextTick(() => {
                        this.$refs.usrTxt1.handleClose();
                    })
                }
            },

            //禁喷类型
            getUsrTxt2List() {
                this.usrTxt2List = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30119')
                    .then(result => {
                        if(result.data) {
                            this.usrTxt2List = result.data;
                            this.usrTxt2List.unshift({dictText:null,dictCode:null,fId:null});
                            this.$nextTick(() => {
                                this.$refs.usrTxt2 && this.$refs.usrTxt2.navigateOptions('next');
                            })
                        }else {
                            this.usrTxt2List = [];
                        }
                    })
            },
            _setUsrTxt2() {
                this.$nextTick(() => {
                    this.nextFocus();
                })
            },
            setUsrTxt2(val) {
                if(val) {
                    let item;
                    item = this.usrTxt2List.find(item => item.dictText === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'usrTxt2Name',item.dictText);
                        this.$set(this.tabDataI[this.editIndex],'banSprayType',item.dictText);
                    }
                }
            },

            //贴膜要求
            getPadPastingMethodList() {
                this.padPastingMethodList = [];
                this.fetch('/oms/BasedataController/getMdmPadpastingMethod',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            this.padPastingMethodList = result.data.list;
                        }else {
                            this.padPastingMethodList = [];
                        }
                    })
            },
            setPadPastingMethod(val) {
                let item;
                item = this.padPastingMethodList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.padPastingMethodName = item.fname
                }
            },

            //生产方式
            getPrdMethodList() {
                this.prdMethodList = [];
                this.fetch('/oms/BasedataController/getProductionMethodList',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            this.prdMethodList = result.data.list;
                        }else {
                            this.prdMethodList = [];
                        }
                    })
            },
            setPrdMethod(val) {
                let item;
                item = this.prdMethodList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.prdMethodName = item.fname;
                    this.addOrEditForm.prdMethodCode = item.fcode;
                }
            },

            //生产基地
            getSupplyCompanyList() {
                this.supplyCompanyList = [];
                this.fetch('/oms/org/PlantCompanyController/getPlantCompany',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.supplyCompanyList = result.data.list;
                        }else {
                            this.supplyCompanyList = [];
                        }
                    })
            },
            setSupplyCompany(val) {
                let item;
                item = this.supplyCompanyList.find(item => item.fCode === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.supplyCompanyName = item.fName;
                    this.addOrEditForm.supplyCompanyId = item.fId
                }
            },

            //------------------- 批量导入 START -------------------//

            //快捷生成
            beforeToUpload(file) {
                this.errorMessage = null;
                this.files = file;
                const extension = file.name.split('.')[1] === 'xls';
                const extension2 = file.name.split('.')[1] === 'xlsx';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if(!extension && !extension2) {
                    this.$message.warning('上传模板只能是 xls、xlsx格式!');
                    return false;
                }
                if(!isLt2M) {
                    this.$message.warning('上传模板大小不能超过 2MB!');
                    return false;
                }
                this.fileName = file.name;
                setTimeout(() => {
                    if(this.fileName === ""){
                        this.$message.warning('请选择要上传的文件！');
                        return false
                    }
                    let fileFormData = new FormData();
                    fileFormData.append('file', this.files, this.fileName);
                    let requestConfig = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    };
                    this.fetch(`/oms/sls/SalesOrderDetail/importOrderDetail?masterId=${this.orderId}`, fileFormData, requestConfig)
                        .then(result => {
                            if(result.status === 200) {
                                this.moduleVisiable = true;
                                if(result.data.length) {
                                    result.data.forEach(item => {
                                        if(JSON.stringify(item.errorMessage[0])!=='{}') {
                                            item.rowErrorMessage = Object.values(item.errorMessage[0]).join('');
                                        }else {
                                            item.rowErrorMessage = '';
                                        }
                                    });
                                    this.moduleData = result.data;
                                    this.clickModule(result.data[0]);
                                    this.$nextTick(() => {
                                        this.$refs.moduleTable.setCurrentRow(result.data[0]);
                                    });
                                }else {
                                    this.moduleData = [];
                                    this.moduleDatail = {}
                                }
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                },500)
            },
            handleUpload() {
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                this.files = inputDOM.files[0];
                this.fileName = this.files.name;
                this.submitUpload();
            },
            submitUpload() {
                setTimeout(() => {
                    if(this.fileName === ""){
                        this.$message.warning('请选择要上传的文件！');
                        return false
                    }
                    let fileFormData = new FormData();
                    fileFormData.append('file', this.files, this.fileName);
                    let requestConfig = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    };
                    this.fetch(`/oms/sls/SalesOrderDetail/importOrderDetail?masterId=${this.orderId}`, fileFormData, requestConfig)
                        .then(result => {
                            if(result.status === 200) {
                                this.moduleData = result.data;
                                if(result.data.length) {
                                    this.clickModule(result.data[0]);
                                    this.$nextTick(() => {
                                        this.$refs.moduleTable.setCurrentRow(result.data[0]);
                                    })
                                }else {
                                    this.moduleDatail = {}
                                }
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                },500)
            },
            //批量保存订单明细
            multiSaveDetail() {
                if(this.moduleData.length) {
                    this.moduleData.forEach(item => {
                        item.masterId = this.detailId;
                        item.docCode = this.docCode;
                        delete item.errorMessage
                    })
                }
                this.fetch(`/oms/sls/SalesOrderDetail/insertBatch?masterId=${this.detailId}&docCode=${this.docCode}`,this.moduleData)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '批量保存订单明细成功',
                                type: 'success'
                            });
                            this.moduleVisiable = false;
                            this.getChildTable(this.detailId)
                        }else {
                            if(result.data.errorMessageList) {
                                result.data.errorMessageList.forEach((v,i) => {
                                    this.$set(this.moduleData[i],'rowErrorMessage',Object.values(v).join(''));
                                });
                                this.errorMessage = null;
                                this.clickModule(this.moduleDatail);
                            }
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //单击
            clickModule(row) {
                this.moduleDatail = row;
                this.errorMessage = row.rowErrorMessage;
            },
            //设置型号
            setMatCodeImport(val,editIndex) {
                if(val) {
                    this.fetch('/oms/BasedataController/getAluModel',{fcode:val})
                        .then(result => {
                            if(result.data && result.data.list && result.data.list.length) {
                                let item = result.data.list[0];
                                this.$set(this.moduleData[editIndex],'matCode',item.fcode);
                                this.$set(this.moduleData[editIndex],'matName',item.fname);
                                //机台级别
                                this.$set(this.moduleData[editIndex],'machineLevelName',item.machineLevel);
                                //支/扎
                                this.$set(this.moduleData[editIndex],'perLotQty',item.perLotDigit);
                                //禁喷类型
                                if(!item.banSprayType) {
                                    this.$set(this.moduleData[editIndex],'isNotUrsTxt2',true);
                                }else {
                                    this.$set(this.moduleData[editIndex],'isNotUrsTxt2',false);
                                }
                                this.setUsrTxt2Import(item.banSprayType);
                                //胶条规格
                                this.$set(this.moduleData[editIndex],'usrTxt6Name',item.usrTxt6Name);
                                //壁厚
                                this.$set(this.moduleData[editIndex],'thick',item.thick);
                                //型材类别
                                this.$set(this.moduleData[editIndex],'matGroupAlType1',item.matGroupAlType1);
                                //型材系列
                                this.$set(this.moduleData[editIndex],'matSeriesId',item.matSeriesId);
                                this.$set(this.moduleData[editIndex],'matSeriesCode',item.matSeriesCode);
                                this.$set(this.moduleData[editIndex],'matSeriesName',item.matSeriesName);
                                //撕筋
                                if(!item.isTear) {
                                    this.$set(this.moduleData[editIndex],'isNotTear',true);
                                }else {
                                    this.$set(this.moduleData[editIndex],'isNotTear',false);
                                }
                                let isTear;
                                item.isTear ? isTear = '✔' : isTear = 'x';
                                this.$set(this.moduleData[editIndex],'usrTxt3Name',isTear);
                                this.$set(this.moduleData[editIndex],'usrTxt3',item.isTear.toString());
                                this.$set(this.moduleData[editIndex],'isTear',item.isTear);
                            }
                        })
                }else {
                    this.$set(this.moduleData[editIndex],'matCode',null);
                    this.$set(this.moduleData[editIndex],'matName',null);
                    //机台级别
                    this.$set(this.moduleData[editIndex],'machineLevelName',null);
                    //支/扎
                    this.$set(this.moduleData[editIndex],'perLotQty',null);
                    //禁喷类型
                    this.setUsrTxt2Import(null);
                    //胶条规格
                    this.$set(this.moduleData[editIndex],'usrTxt6Name',null);
                    //壁厚
                    this.$set(this.moduleData[editIndex],'thick',null);
                    //型材类别
                    this.$set(this.moduleData[editIndex],'matGroupAlType1',null);
                    //型材系列
                    this.$set(this.moduleData[editIndex],'matSeriesId',null);
                    this.$set(this.moduleData[editIndex],'matSeriesCode',null);
                    this.$set(this.moduleData[editIndex],'matSeriesName',null);
                    //撕筋
                    this.$set(this.moduleData[editIndex],'usrTxt3Name',null);
                    this.$set(this.moduleData[editIndex],'usrTxt3',null);
                    this.$set(this.moduleData[editIndex],'isTear',null);
                }
            },
            //设置颜色
            setColorCodeImport(val,editIndex) {
                if(val) {
                    let item = this.colorCodeList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.moduleData[editIndex],'colorId',item.fid);
                        this.$set(this.moduleData[editIndex],'cx1',item.fcode);
                        this.$set(this.moduleData[editIndex],'cx1Name',item.fname);
                        //颜色类别
                        this.$set(this.moduleData[editIndex],'colorGroupName',item.colorGroupName);
                        this.$set(this.moduleData[editIndex],'colorGroupCode',item.colorGroupCode);
                        //喷码
                        this.setUsrTxt1Import(item.usrTxt1Name||this.usrTxt1Name,editIndex);
                    }
                }else {
                    this.$set(this.moduleData[editIndex],'colorId',null);
                    this.$set(this.moduleData[editIndex],'cx1',null);
                    this.$set(this.moduleData[editIndex],'cx1Name',null);
                    //颜色类别
                    this.$set(this.moduleData[editIndex],'colorGroupName',null);
                    this.$set(this.moduleData[editIndex],'colorGroupCode',null);
                    //喷码
                    this.setUsrTxt1Import(this.usrTxt1Name,editIndex);
                }
            },
            //设置材质
            setMatAlloyImport(val,editIndex) {
                if(val) {
                    let item = this.matAlloyList.find(item => item.fcode === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.moduleData[editIndex],'alloyId',item.fid);
                        this.$set(this.moduleData[editIndex],'cx2',item.fcode);
                        this.$set(this.moduleData[editIndex],'cx2Name',item.fname);
                    }
                }else {
                    this.$set(this.moduleData[editIndex],'alloyId',null);
                    this.$set(this.moduleData[editIndex],'cx2',null);
                    this.$set(this.moduleData[editIndex],'cx2Name',null);
                }
            },
            //设置膜厚
            setMatThickImport(val,editIndex) {
                if(val) {
                    let item = this.matThickList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.moduleData[editIndex],'cx3',item.fcode);
                        this.$set(this.moduleData[editIndex],'cx3Name',item.fname);
                    }
                }else {
                    this.$set(this.moduleData[editIndex],'cx3',null);
                    this.$set(this.moduleData[editIndex],'cx3Name',null);
                }
            },
            //设置喷码
            setUsrTxt1Import(val,editIndex) {
                if(val) {
                    this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.usrTxt1List = result.data.list;
                                let item;
                                item = this.usrTxt1List.find(item => item.fname === val);
                                if(JSON.stringify(item) !== {}) {
                                    this.$set(this.moduleData[editIndex],'usrTxt1Name',item.fname);
                                    this.$set(this.moduleData[editIndex],'usrTxt1',item.fcode);
                                }
                            }
                        })
                }
            },
            //设置禁喷类型
            setUsrTxt2Import(val,editIndex) {
                if(val) {
                    let item;
                    item = this.usrTxt2List.find(item => item.dictText === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.moduleData[editIndex],'usrTxt2Name',item.dictText);
                        this.$set(this.moduleData[editIndex],'banSprayType',item.dictText);
                    }
                }
            },
            //设置撕筋
            setUsrTxt3NameImport(val,editIndex) {
                if(val === '1') {
                    this.$set(this.moduleData[editIndex],'usrTxt3Name','✔');
                    this.$set(this.moduleData[editIndex],'usrTxt3','1');
                }else {
                    this.$set(this.moduleData[editIndex],'usrTxt3Name','');
                    this.$set(this.moduleData[editIndex],'usrTxt3','0');
                }
            },

            //------------------- 批量导入 END -------------------//
        }
    }
</script>
