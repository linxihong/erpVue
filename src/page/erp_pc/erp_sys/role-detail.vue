<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content">
            <el-button class="mt15 ui-color2" @click="$routeTo('msm_role')">返回</el-button>
            <el-card class="mt15">
                <div slot="header" class="cf">
                    <span>角色详情</span>
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
            return {//角色名、角色别名、备注、允许删除、允许修改、是否启用
                fieldItemsWidth:11,
                fieldItemnames:{"roleid":"角色ID","alias":"角色别名","rolename":"角色名称","remark":"备注","allowdel":"允许删除","allowedit":"允许修改","enabled":"是否启用","systemid":"系统ID","creator":"创建人","createtime":"创建时间","editor":"最近修改人","editdate":"最近修改时间"},
                detail:{"roleid":"角色ID","alias":"角色别名","rolename":"角色名称","remark":"备注","allowdel":"允许删除","allowedit":"允许修改","enabled":"是否启用","systemid":"系统ID","creator":"创建人","createtime":"创建时间","editor":"最近修改人","editdate":"最近修改时间"},
            }
        },
        created () {

        },
        methods:{
            onSubmit() {

            },
            handlekeytoname(key){
                return this.fieldItemnames[key]?this.fieldItemnames[key]:key;
            }
        }
    }
</script>
