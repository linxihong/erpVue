<script>
    export default {
        data() {
            return {
                //指派跟单员
                followVisiable: false,
                isMulFollower: false,
                followForm: {},
                followerList: [],
                isSelf: false
            }
        },
        methods: {
            showChooseFollow(isMul = false) {
                this.isMulFollower = isMul;
                this.isSelf = false;
                this.$set(this.followForm,'followName',null);
                this.$set(this.followForm,'followId',null);
                if(isMul) {
                    if(this.selectOrderList.length) {
                        this.followVisiable = true;
                        this.getFollowerList();
                    }else {
                        this.$message({
                            message:'请勾选网单',
                            type:'warning'
                        })
                    }
                }else {
                    this.followVisiable = true;
                    this.getFollowerList();
                    this.$set(this.followForm,'followName',this.detailForm.destFollowName);
                }
            },
            getFollowerList(val = null) {
                this.followerList = [];
                this.fetch('/oms/sls/SalesOrderMaster/getDistributable',{clientId:this.clientId,fName:val})
                    .then(result => {
                        if(result.data && result.data.length) {
                            this.followerList = result.data;
                        }else {
                            this.followerList = [];
                        }
                    })
            },
            changeFollower(val) {
                let item;
                if(val) {
                    item = this.followerList.find(item => item.fName === val);
                    this.followForm.followName = item.fName;
                    this.followForm.followId = item.userId;
                }else {
                    this.followForm.followName = null;
                    this.followForm.followId = null;
                }
            },
            isGiveSelf(val) {
                val ? this.followForm.followName = this.$store.state.userInfo.empName : this.followForm.followName = null;
                val ? this.followForm.followId = this.$store.state.userInfo.userid : this.followForm.followId = null;
            },
            handleFollow() {
                let url = '';
                let msg = '';
                if(this.isOrderImport) {
                    url = '/oms/sls/SalesOrderMaster/batchAssignAndSignOrderFollow';
                    msg = '签批'
                }else {
                    url = '/oms/sls/SalesOrderMaster/batchAcceptClientOrderFollow';
                    msg = '受理'
                }
                let paramList = [];
                if(this.isMulFollower) {
                    this.selectOrderList.forEach(item => {
                        let tempObj = {};
                        tempObj.fid = item;
                        tempObj.followId = this.followForm.followId;
                        tempObj.followName = this.followForm.followName;
                        paramList.push(tempObj)
                    })
                }else {
                    paramList = [{
                        fId: this.detailId,
                        followId: this.followForm.followId,
                        followName: this.followForm.followName
                    }]
                }
                this.fetch(url,paramList)
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:`指派跟单员${msg}成功`,
                                type:'success'
                            });
                            this.followVisiable = false;
                            this.isMulFollower ? this.getInitPage() : this.getData(false);
                        }else{
                            this.$message({
                                message:this.returnErrorMsg(result.error,'second'),
                                type:'error'
                            })
                        }
                    })
            }
        }
    }
</script>
