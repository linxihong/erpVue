<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content">
        <el-button class="mt15 ui-color2" @click="$routeTo('msm_account')">返回</el-button>
        <el-card class="mt15 del-shadow">
            <div slot="header" class="cf">
                <span>账户详情</span>
            </div>
            <el-form ref="form" label-width="140px">

                <el-col :span="fieldItemsWidth" v-for="(val,key) in fieldItemnames" :key="key">
                    <el-form-item :label="val+'：'">
                        <el-input :value="htmlval(val,key)" :readonly="true"></el-input>
                        <!--<span v-html="htmlval(val,key)"></span>-->
                    </el-form-item>
                </el-col>

            </el-form>
        </el-card>
    </div>
    </div>
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                fieldItemsWidth: 11,
                detailId: '',
                fieldItemnames: {
                    account: "账号",
                    fullname: "账号名称",
                    ifadmin: "是否管理员",
                    //isexpired: "是否过期",
                    islock: "是否锁定",
                    status: "状态",
                    remark: "备注",
                },
                detail: {
                    name: "",
                    address: "",
                    account: "",
                    status: "",
                    statusa: "",
                    //statusb: "",
                    statusc: "",
                    commment: "",
                },
            }
        },
        activated () {
            this.init();
        },
        methods: {
            init() {
                this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_account');
                this.getdetail()
            },
            htmlval(_val,key){
                let val;
                this.detail[key]!=undefined?val=this.detail[key]:'';
                switch (key){
                    case 'status':
                        return val=='1'?"未激活":val=='0'?"激活":val;
                        break;
                    case 'isfolder':
                    case 'ifadmin':
                    case 'islock':
                        return val=='1'?"是":val=='0'?"否":val;
                        break;
                    case 'usertype':
                        let _obj={'1':'管理员','2':'员工主账号','3':'员工子账号','4':'客户主账号','5':'客户子帐号'};
                        return _obj[val]?_obj[val]:val;
                        break;
                    default:
                        return val;
                        break
                }
            },
            onSubmit() {

            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : key;
            },
            getdetail(obj){
                this.getAjax('/sys/user/edit/'+this.detailId,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if(result.status=='200'){
                        this.detail = this.handleItemstoString(result.data, ['usertype', 'ifadmin', 'isexpired', 'islock', 'systemid']);
                    }
                })
            },
        }
    }
</script>
