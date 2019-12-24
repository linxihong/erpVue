<template>
    <div class="f-content f-doubleblock">
        <div class="left-block">
            <div class="console-title">
                <h5>分类管理</h5>
            </div>
            <el-tree :data="treeOptions" node-key="id" :default-expanded-keys="treeExpandeds" :props="defaultProps" :expand-on-click-node="false"
                     @node-click="handleNodeClick" :render-content="handleTreerender"></el-tree>
        </div>
        <div class="right-block system-block">
            <div class="rightDivI">
                <div class="right-contentI">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    const treeOptions = [];

    export default {
        name: 'list',
        data () {
            return {
                treeOptions: treeOptions,
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    account: '',
                    statusa: '',
                    statusb: '',
                    status: '',
                    createTime: '',
                },
                tableData: [],
            }
        },
        mounted () {
            this.init();

        },
        methods: {
            init(){
                this.getlist();
            },
            getlist(){
                this.getAjax('/sys/dic/getListSystemParameter').then((result) => {
                    if (result.status == '200') {
                        this.treeOptions = this.handleListToSingleTree(result.data);
                        this.treeExpandeds = [this.treeOptions[0].id]
                        this.detail = result.details;
                    }
                })
            },
            handleNodeClick(data, node, el) {
                if (!node.data.children && node.data.nodekey) {
                    this.$router.push({name: "msm_operationallimits_list", query: {nodekey: node.data.nodekey}})
                }
            },
            handleDetailClick () {
                this.$router.push({name: "detail"})
            },
            onSubmitFilterform() {
                //console.log('submit!');
            },
            handlerender(h, {node}) {
                if (node.data.icon) {
                    return h('span', [h('i', {
                        class: node.data.icon,
                    }),
                        h('span', {
                            style: {
                                paddingLeft: '10px'
                            },
                        }, node.data.label),
                    ])
                } else {
                    return h('span', {
                        style: {},
                    }, node.data.label)
                }

            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        //this.this.contextmenuDialog.data.typeid
                        this.$router.push({
                            name: 'msm_setting_demension_add', query: {
                                typemrkid: this.contextmenuDialog.data.typemrkid,
                                parentid: this.contextmenuDialog.data.typeid,
                                depth: this.contextmenuDialog.data.depth,
                                catkey: this.contextmenuDialog.data.catkey
                            }
                        });
                        break;
                    case 'edit':
                        this.$router.push({
                            name: 'msm_setting_demension_edit', params: {
                                id: this.contextmenuDialog.data.typeid,
                            }
                        })
                        break;
                    case 'del':
                        this.handleDemensionDel(this.contextmenuDialog.data.typeid, () => {
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
