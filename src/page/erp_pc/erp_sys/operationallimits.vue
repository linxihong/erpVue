<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content" :class="{'f-doubleblock':treeOptions}">
        <div class="left-block percent" v-if="treeOptions">
            <!--<div class="console-title console-title-border">-->
                <!--<h5>{{ifValue(this.$store.state.activenavItem.name,'参数管理')}}</h5>-->
            <!--</div>-->
            <div class="scroll-tree scrollBar tree-heightI">
            <el-tree
                class="render-tree"
                :data="treeOptions"
                node-key="typeid"
                :default-expanded-keys="treeExpandeds"
                :props="defaultProps"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                :render-content="handleTreerender__code"
                :highlight-current="true"></el-tree>
            </div>
        </div>
        <div class="right-block system-block">
            <div class="rightDivI">
                <div class="right-contentI" ref="contentHeight">
                    <transition name="fade" mode="out-in">
                        <router-view :contentHeight="contentHeight"></router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script type="es6">
    const treeOptions = [];

    export default {
        name: 'list',
        data () {
            return {
                treeOptions: null,
                treeList: null,
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                contentHeight: null,
            }
        },
        mounted () {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },200)
        },
        computed: {
            screenWid() {
                return this.$store.state.screenWid;
            },
            screenHei() {
                return this.$store.state.screenHei;
            }
        },
        watch: {
            'screenWid': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },20)
            },
            'screenHei': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },70)
            }
        },
        methods: {
            init(){
                this.getlist();
            },
            getDivHeight(){
                this.contentHeight = this.$refs.contentHeight.offsetHeight;
            },
            getlist(){
                var _apiUrl='/sys/dic/getListSystemParameter';
                if(this.$store.state.activenavItem.alias=='ggdm'){
                    _apiUrl='/sys/dic/getListPublicCode';
                }else if(this.$store.state.activenavItem.alias=='hljt_xtdmgl'){
                    _apiUrl='/sys/dic/getListSystemCode';
                }else if(this.$store.state.activenavItem.alias=='hljt_zzzydm'){
                    _apiUrl='/sys/dic/getListOrgCode';
                }

                this.getAjax(_apiUrl).then((result) => {
                    if (result.status == '200' && _.isEmpty(result.data)!=true) {
                        this.treeList = result.data;
                        this.treeOptions = this.handleListToSingleTree(result.data);
                        //this.treeExpandeds.length==0?this.treeExpandeds = [this.treeOptions[0].typeid]:''
                        if(this.treeExpandeds.length==0){
                            this.$router.push({name: "msm_operationallimits_list", query: {nodekey:this.treeOptions[0].nodekey,paramid:this.treeOptions[0].typeid}})
                        }
                        this.detail = result.details;
                    }
                })
            },
            handleNodeClick(data, node, el) {
                this.$router.push({name: "msm_operationallimits_list", query: {nodekey: node.data.nodekey,paramid: node.data.typeid}})
            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        //this.this.contextmenuDialog.data.typeid
                        this.$router.push({
                            name: 'msm_operationallimits_add', query: {
                                typemrkid: this.contextmenuDialog.data.typemrkid,
                                parentid: this.contextmenuDialog.data.typeid,
                                depth: this.contextmenuDialog.data.depth,
                                catkey: this.contextmenuDialog.data.catkey
                            }
                        });
                        break;
                    case 'edit':
                        this.$router.push({
                            name: 'msm_operationallimits_edit', params: {
                                id: this.contextmenuDialog.data.typeid,
                            }
                        });
                        break;
                    case 'del':
                        this.handleDelCommon('/sys/dic/delete/'+this.contextmenuDialog.data.dicid, () => {
                            this.getlist()
                        });
                        break;
                    case 'up':
                        let _treeOptions = this.treeOptions;

                    function sort(array, index, typeid) {
                        return array.sort(function (x, y) {
                            if (index == -1 && y.typeid == typeid) {
                                return 1
                            } else if (index == 1 && x.typeid == typeid) {
                                return -1;
                            } else {
                                return 0;
                            }
                        })
                    }

                    function _each(obj, target) {
                        let _b;
                        _.each(obj, function (val, key) {
                            if (val) {
                                if (val.children) {
                                    var _a = _each(val.children, target);
                                    if (_a) {
                                        val.children = _a;
                                    }
                                    return false;
                                } else if (val.typeid && val.typeid == target) {
                                    if (key != 0) {
                                        _b = sort(obj, -1, val.typeid);
                                    }
                                }
                            }
                        });
                        return _b;
                    }

                        _each(_treeOptions, this.contextmenuDialog.data.typeid);
                        this.$set(this, 'treeOptions', _treeOptions)
                        break;
                    case 'down':
                        break;
                }
            },
        }
    }


</script>
