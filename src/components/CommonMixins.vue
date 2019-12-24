<script>
    export default {
        data() {
            return {
                isEnter: false
            }
        },
        props: {

        },
        methods: {
            selectEnterEvent() {
                this.enterTimes++;
                if(this.enterTimes >= 2 && this.isBanNextFocus) {
                    this.$nextTick(() => {
                        this.nextFocus();
                    })
                }
            },
            remoteEnterEvent(val = null,dataType) {
                this.isEnter = true;
                this.enterTimes++;
                if(this.enterTimes >= 2) {
                    switch (dataType) {
                        // 订单明细-型材型号
                        case 'matCode':
                            this.setMatCode(val);
                            break;
                        // 订单明细-颜色代码
                        case 'cx1Name':
                            this.setColorCode(val);
                            break;
                        // 订单明细-材质
                        case 'cx2Name':
                            this.setMatAlloy(val);
                            break;
                        // 订单明细-膜厚
                        case 'cx3Name':
                            this.setMatThick(val);
                            break;
                        // 订单明细-喷码
                        case 'usrTxt1Name':
                            this.setUsrTxt1(val);
                            break;
                        // 订单明细-禁喷
                        case 'usrTxt2Name':
                            this._setUsrTxt2();
                            break;
                    }
                }
            },
            tabEvent(val,dataType) {
                switch (val,dataType) {
                    case 'matCode':
                        this.setMatCode(this.firstMatCode);
                        break;
                    case 'cx1Name':
                        this.setColorCode(this.firstColorName);
                        break;
                    case 'cx2Name':
                        this.setMatAlloy(this.firstMatAlloy);
                        break;
                    case 'cx3Name':
                        this.setMatThick(this.firstMatThick);
                        break;
                }
            },
            blurEvent(val,dataType) {
                /*if(!this.isEnter) {
                    switch (val,dataType) {
                        case 'matCode':
                            this.setMatCode(this.firstMatCode,false);
                            break;
                        case 'cx1Name':
                            this.setColorCode(this.firstColorName,false);
                            break;
                        case 'cx2Name':
                            this.setMatAlloy(this.firstMatAlloy,false);
                            break;
                        case 'cx3Name':
                            this.setMatThick(this.firstMatThick,false);
                            break;
                    }
                }*/
            },
            handleCtrlV(ev,prop) {
                this.$nextTick(() => {
                    let targetVal = ev.target.value;
                    switch (prop) {
                        // 订单明细-型材型号
                        case 'matCode':
                            this.getMatCodeList(targetVal,targetVal,null,1);
                            break;
                        // 订单明细-颜色代码
                        case 'cx1Name':
                            this.getColorCodeList(targetVal,targetVal,null,1);
                            break;
                        // 订单明细-材质
                        case 'cx2Name':
                            this.getMatAlloy(targetVal,targetVal,null,1);
                            break;
                        // 订单明细-膜厚
                        case 'cx3Name':
                            this.getMatThick(targetVal,targetVal,null,1);
                            break;
                    }
                })
            },
            banNextFocus(val) {
                this.isBanNextFocus = val;
            },
            setFocus(focusIndex) {
                this.isEnter = false;
                this.currentIndex = focusIndex;
            },
            nextFocus($event,isRequired=false,value='',label='该项') {
                let res = true;
                isRequired ? (value ? res = true : res = false) : res = true;
                if(res) {
                    const ds = this.$el.querySelectorAll('[data-index]');
                    if(ds.length > this.currentIndex) {
                        const el = ds.item(++this.currentIndex);
                        if(el !== null) {
                            this.$nextTick(() => {
                                this.autoFocus(el);
                            })
                        }
                    }else {
                        console.log("reset this.currentIndex");
                    }
                }else {
                    this.$message({message: `${label}不能为空`, type: 'warning'})
                }
            },
            autoFocus(focusEl) {
                let elInput = focusEl;
                if(['INPUT','TEXTAREA'].indexOf(focusEl.tagName.toUpperCase()) === -1) {
                    elInput = focusEl.querySelector('input,textarea')
                }
                elInput && elInput.focus()
            },
            //表格↑↓控制高亮
            goUp(index) {
                this.handleSaveChild(index,'up');
            },
            goDown(index) {
                if(this.tabDataI[this.editIndex].variantId) {
                    this.handleSaveChild(index,'down');
                }
            },
            goTemp(index,type) {
                if(type === 'down') {
                    this.editIndex += 1;
                    if(this.editIndex < this.tabDataI.length) {
                        this.tabDataI[this.editIndex - 1].isEditState = false;
                        this.tabDataI[this.editIndex].isEditState = true;
                        this.$refs.childTable.setCurrentRow(this.tabDataI[this.editIndex]);
                        this.clickDetail(this.tabDataI[this.editIndex]);
                        this.$nextTick(() => {
                            $('.el-table__body-wrapper .el-input__inner')[index].focus();
                        })
                    }else {
                        this.editIndex = this.tabDataI.length - 1;
                        this.otherVariable.isChildEdit = false;
                    }
                }else if(type === 'up'){
                    this.editIndex -= 1;
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                        if(this.isAddDetail) {
                            this.handleAddChild();
                        }else {
                            this.handleCancelChild();
                        }
                    }else {
                        this.tabDataI[this.editIndex + 1].isEditState = false;
                        this.tabDataI[this.editIndex].isEditState = true;
                        this.clickDetail(this.tabDataI[this.editIndex]);
                        this.$refs.childTable.setCurrentRow(this.tabDataI[this.editIndex]);
                        this.$nextTick(() => {
                            $('.el-table__body-wrapper .el-input__inner')[index].focus();
                        })
                    }
                }else if(type === 'first') {
                    this.editIndex = 0;
                    if(this.isAddDetail) {
                        this.handleAddChild();
                    }else {
                        this.handleCancelChild();
                    }
                }
            },
            //最后一个单元格回车提交
            handleLastCell(ev) {
                if(ev.keyCode === 13) {
                    this.handleSaveChild(0,'first');
                }
                if(ev.keyCode === 9 && (!ev.shiftKey)) {
                    ev.returnValue = false;
                    this.handleSaveChild(0,'first');
                }
            },
            //监听滚动条位置
            listenScroll() {
                let scrollDom = this.$refs.childTable.$el.querySelector('.el-table__body-wrapper');
                scrollDom.addEventListener('scroll',() => {
                    this.scrollHeight = scrollDom.scrollTop;
                })
            },
            //------------------- 自适应高度 START -------------------//
            // 通用
            changeSize() {
                this.isResize = false;
                this.tableHeight = window.innerHeight - this.$refs.headForm.offsetHeight - this.otherVariable.contentHead - 154;
                this.mainHeight = window.innerHeight - 214;
                this.$nextTick(() => {
                    this.isResize = true;
                })
            },
            listenResize() {
                window.onresize = () => {
                    this.changeSize();
                }
            },
            // 型材型号
            changeSizeII() {
                this.isResize = false;
                this.formHeight = window.innerHeight - this.$refs.headForm.offsetHeight - this.otherVariable.contentHead - 154;
                this.tableHeight = window.innerHeight - this.$refs.headForm.offsetHeight - this.otherVariable.contentHead - 154;
                this.mainHeight = window.innerHeight - 214;
                this.$nextTick(() => {
                    this.isResize = true;
                })
            },
            listenResizeII() {
                window.onresize = () => {
                    this.changeSizeII();
                }
            },
            // 价格相关页面
            changeSizeIII() {
                this.isResize = false;
                if(this.showTable) {
                    this.tableHeightI = window.innerHeight - this.$refs.headForm.offsetHeight - this.otherVariable.contentHead - 304;
                }else {
                    this.tableHeightI = window.innerHeight - this.$refs.headForm.offsetHeight - this.otherVariable.contentHead - 154;
                }
                this.mainHeight = window.innerHeight - 214;
                this.$nextTick(() => {
                    this.isResize = true;
                })
            },
            listenResizeIII() {
                window.onresize = () => {
                    this.changeSizeIII();
                }
            },
            //------------------- 自适应高度 END -------------------//

            //切换布局
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            //不再提示
            notShowTip(val) {
                if(!val) {
                    localStorage.setItem('isShowDetailBan', false);
                    this.$store.state.isShowDetailBan = false;
                }else {
                    localStorage.setItem('isShowDetailBan', true);
                    this.$store.state.isShowDetailBan = true;
                }
            }
        }
    }
</script>
