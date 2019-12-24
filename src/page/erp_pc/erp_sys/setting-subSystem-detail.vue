<template>
    <div class="f-content">
        <div class="console-title">
            <h5>子系统详情</h5>
        </div>
        <!--<el-button @click="$routeTo('msm_setting_subsystem')">返回</el-button>-->
        <el-card class="del-shadow mt15">
            <el-form ref="form" label-width="160px">

                <el-col span="24" v-for="(val,key) in fieldItemnames" v-if="handlekeytoname(key)"
                        key="item">
                    <el-form-item :label="handlekeytoname(key)">
                        <span v-html="htmlval(val,key)"> </span>
                    </el-form-item>
                </el-col>

            </el-form>
        </el-card>
    </div>
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                fieldItemsWidth: 24,//"systemid":"系统ID","orgid":"组织ID","needorg":"选择组织架构",
                fieldItemnames: {
                    "sysname": "子系统名称",
                    "alias": "别名",
                    "logo": "子系统图标",
                    "defaulturl": "默认地址",
                    "homepage": "首页地址",
                    "allowdel": "允许删除",
                    "isactive": "是否激活",
                    "islocal": "是否本地系统",
                    "sort": "排序",
                    "remark": "备注",
                },//,"homepage":"首页地址"
                detail: {
                    name: "名称",
                    address: "地址",
                    account: "账号",
                    status: "状态",
                    statusa: "集团管理员标志",
                    statusb: "是否过期",
                    statusc: "是否锁定",
                    commment: "备注",
                },
            }
        },
        created () {
            this.init();
        },
        computed: {
//      htmlval:function () {
//        //console.log(this);
//        //return result
//      }
        },
        methods: {
            htmlval(_val, key){
                var val;
                this.detail[key] != undefined ? val = this.detail[key] : ''
                switch (key) {
                    case 'logo':
                        return '<i class="fa ' + val + '"></i>';
                        break;
                    case 'allowdel':
//            return val=='1'?"是":val=='0'?"否":val;
//              break;
                    case 'isactive':
//            return val=='1'?"是":val=='0'?"否":val;
//              break;
                    case 'islocal':
                        return val == '1' ? "是" : val == '0' ? "否" : val;
                        break;
                    default:
                        return val;
                        break
                }
            },
            init(){
                this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_setting_subsystem_list');
                this.getdetail()
            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : null;
            },
            getdetail(obj){
                this.getAjax('/sys/subsystem/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.detail = this.handleItemstoString(result.data, []);
                    }
                })
            },
        }
    }

</script>
