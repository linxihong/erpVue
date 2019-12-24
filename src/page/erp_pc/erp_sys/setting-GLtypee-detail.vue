<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font">分类详情</span>
            </div>
        </div>
        <div class="right-body">
            <div class="console-mt6">
                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&routeToAdd()">添加</el-button>
                <el-button class="ui-color3" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$routeTo('msm_setting_gltype_edit',{id:detail.typeid,catkey:detail.catkey})">修改</el-button>
                <el-button class="ui-color2" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handledelete()">删除</el-button>
            </div>
            <el-card class="mt10 del-shadow">
                <el-form ref="form" label-width="160px">
                    <el-col :span="fieldItemsWidth" v-for="(val,key) in detail" v-if="handlekeytoname(key)" :key="key">
                        <el-form-item :label="handlekeytoname(key)">
                            <span v-html="htmlval(val,key)"></span>
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
                fieldItemsWidth: 12,
                fieldItemnames: {
                    typename: "分类名称",
                    nodekey: "分类编码",
                    sort: "排序",
                    roleidname:"角色",
                    ordinate:"行",
                    abscissa:"列",
                    field1: '附加字段1',
                    field2: '附加字段2',
                    field3: '附加字段3',
                    field4: '附加字段4',
                    field5: '附加字段5',
                    field6: '附加字段6',
                },
                fieldItemnamesI: {
                    typename: "分类名称",
                    nodekey: "分类编码",
                    sort: "排序",
                    field1: '附加字段1',
                    field2: '附加字段2',
                    field3: '附加字段3',
                    field4: '附加字段4',
                    field5: '附加字段5',
                    field6: '附加字段6',
                },
                detail: {
                    typename: "分类名称",
                    nodekey: "分类编码",
                    sort: "排序",
                    roleidname:"角色",
                    ordinate:"行",
                    abscissa:"列",
                    field1: '附加字段1',
                    field2: '附加字段2',
                    field3: '附加字段3',
                    field4: '附加字段4',
                    field5: '附加字段5',
                    field6: '附加字段6',
                },
                catkey: null
            }
        },
        watch: {
            '$route': function () {
                this.init();
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            htmlval(_val, key){
                let val;
                this.detail[key] != undefined ? val = this.detail[key] : '';
                switch (key) {
                    case 'isfolder':
                        return val == '1' ? "是" : val == '0' ? "否" : val;
                        break;
                    default:
                        return val;
                        break
                }
            },
            init(){
                this.getAuthlist();
                if (this.$route.name == 'msm_setting_gltype_detail') {
                    this.detailId = this.$route.params.id
                    this.getdetail()
                }
            },
            routeToAdd(){
                this.$router.push({
                    name: 'msm_setting_gltype_add', query: {
                        typemrkid: this.detail.typemrkid,
                        parentid: this.detail.typeid,
                        depth: this.detail.depth,
                        catkey: this.detail.catkey
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/gltype/edit/' + this.detailId, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.detail = this.handleItemstoString(result.data, []);
                        this.catkey = result.data.catkey;
                    }
                })
            },
            handlekeytoname(key){
                if(this.catkey === 'TemplateManagement') {
                    return this.fieldItemnames[key] ? this.fieldItemnames[key] : null;
                }else {
                    return this.fieldItemnamesI[key] ? this.fieldItemnamesI[key] : null;
                }
            },
            handledelete(key){
                this.handleDemensionDel(this.detail.typeid, (result) => {
                    this.$handleRes(result);
                    if (result.status == '200') {
                        this.$parent.treeOptions = [];
                        //this.$routeTo('msm_setting_gltype');
                        this.$routeTo('msm_setting_gltype_detail',{id:this.detail.parentid});
                    }
                });
            }
        }
    }

</script>
