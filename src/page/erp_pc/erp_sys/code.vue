<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content" :class="{'f-doubleblock':treeOptions}">
            <div class="left-block percent" v-if="treeOptions">
                <!--<div class="console-title console-title-border">-->
                    <!--<h5>{{ifValue(this.$store.state.activenavItem.name,'代码管理')}}</h5>-->
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
                        :highlight-current="true">
                    </el-tree>
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
    export default {
        name: 'list',
        data () {
            return {
                pageType: '1',
                treeList: [],
                treeOptions: null,
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                contentHeight: null,
            }
        },
        watch: {
            // '$route': function () {
            //     //this.init();
            // },
            // '$route.params.cid': function (a, b) {
            //     //this.init();
            //     ////console.log('$route.params.cid',a,b);
            //     if (a != b) {
            //         this.init();
            //     }
            // },
            '$route.params.cid' : function (a, b) {
                if (a != b) {
                    this.refreshTree();
                }
            },
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
        mounted () {
            //this.init();
            this.refreshTree();
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
        methods: {
            refreshTree() {
                this.treeExpandeds = [];
                this.treeOptions = [];
                if (this.$route.params.cid) {
                    this.pageType = this.$route.params.cid;
                }
                this.getAjax('/sys/dic/getList/' + this.pageType)
                    .then(result => {
                        if (result.status === 200 && _.isEmpty(result.data) != true) {
                            this.treeList = result.data;
                            this.treeOptions = this.handleListToSingleTree(result.data);
                        }
                     });
            },
            init(){
                if (this.$route.params.cid) {
                    this.pageType = this.$route.params.cid;
                }
                this.getlist();
                this.hidetreeContextmenu();
            },

            getDivHeight(){
                this.contentHeight = this.$refs.contentHeight.offsetHeight;
            },

            getlist(){
                this.treeExpandeds = [];
                this.treeOptions = [];
                this.getAjax('/sys/dic/getList/' + this.pageType).then((result) => {
                    if (result.status === 200 && _.isEmpty(result.data) != true) {
                        this.treeList = result.data;
                        this.treeOptions = this.handleListToSingleTree(result.data);
                        this.$router.push({
                            name: "msm_code_list",
                            query: {
                                nodekey: this.treeOptions[0].nodekey,
                                codeid: this.treeOptions[0].typeid
                            }
                        })
                    }
                })
            },
            handleNodeClick(data, node, el) {
                this.$router.push({
                    name: "msm_code_list",
                    query: {nodekey: node.data.nodekey, codeid: node.data.typeid}
                })
            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        this.$router.push({
                            name: 'msm_code_add', query: {
                                typemrkid: this.contextmenuDialog.data.typemrkid,
                                parentid: this.contextmenuDialog.data.typeid,
                                depth: this.contextmenuDialog.data.depth,
                                catkey: this.contextmenuDialog.data.catkey
                            }
                        });
                        break;
                    case 'edit':
                        this.$router.push({
                            name: 'msm_code_edit', params: {
                                id: this.contextmenuDialog.data.typeid,
                            }
                        });
                        break;
                    case 'del':
                        this.handleDelCommon('/sys/dic/delete/' + this.contextmenuDialog.data.dicid, () => {
                            this.treeOptions = [];
                            this.getlist()
                        });
                        break;
                    case 'up':
                        var _treeOptions = this.treeOptions;

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
                        this.$set(this, 'treeOptions', _treeOptions);
                        break;
                    case 'down':
                        break;
                }
            },
        }
    }


</script>
