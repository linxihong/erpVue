<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content">
            <el-button class="mt15 ui-color2" @click="$routeTo('msm_account')">返回</el-button>
            <el-card class="mt15">
                <div slot="header" class="cf">
                    <span>账户详情</span>
                </div>
                <el-form ref="form" label-width="160px">
                    <el-col :span="fieldItemsWidth" v-for="(val,key) in detail" key="item">
                        <el-form-item :label="handlekeytoname(key)">
                            <span>{{val}}</span>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'list',
        data () {
            return {
                detailId: '',
                fieldItemsWidth: 12,
                fieldItemnames: {
                    "identityid": "系统流水号ID",
                    "name": "名称",
                    "originalheader": "源抬头",
                    "newheader": "新抬头",
                    "alias": "别名",
                    "regulation": "规则",
                    "geneveryday": "每天生成",
                    "nolength": "流水号长度",
                    "curdate": "当前日期",
                    "initvalue": "初始值",
                    "curvalue": "当前值",
                    "step": "步长",
                    "modulid": "模块ID（数据字典）",
                    "billofdoc": "单据ID",
                    "systemid": "系统ID"
                },
                detail: {
                    "identityid": "系统流水号ID",
                    "name": "名称",
                    "originalheader": "源抬头",
                    "newheader": "新抬头",
                    "alias": "别名",
                    "regulation": "规则",
                    "geneveryday": "每天生成",
                    "nolength": "流水号长度",
                    "curdate": "当前日期",
                    "initvalue": "初始值",
                    "curvalue": "当前值",
                    "step": "步长",
                    "modulid": "模块ID（数据字典）",
                    "billofdoc": "单据ID",
                    "systemid": "系统ID"
                },
            }
        },
        created () {

        },
        methods: {
            getDetail(){
                this.getAjax('/sys/role/edit/' + this.detailId).then((result) => {
                    this.$handleRes(result);
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['allowdel', 'allowedit', 'enabled']);
                    }
                })
            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : key;
            }
        }
    }
</script>
