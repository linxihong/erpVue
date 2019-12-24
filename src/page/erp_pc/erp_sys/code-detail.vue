<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
              <span class="color-12 ui-font">代码详情</span>
            </div>
        </div>
        <el-button class="ui-color2" @click="$routeTo('msm_code_list')">返回</el-button>
        <div class="right-body">
            <el-card class="mt15">
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
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                fieldItemsWidth:12,
                fieldItemnames:{name:"序号", address:"代码", account:"代码名称", status:"状态",commment:"备注"},
                detail:{name:"序号", address:"代码", account:"代码名称", status:"状态",commment:"备注"},
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
