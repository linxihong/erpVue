<template>
    <el-tree
            :data="xsTreeDataBeauty"
            :props="xsTreeProps"
            node-key="fcode"
            :default-expanded-keys="xsTreeExpands"
            @node-click="handleTreeNodeClick"
            class="comp-alu-tree-xs">

    </el-tree>
</template>

<script>

    export default {
        props: {
            'xsTreeData': {
                type: Array
            }
        },
        components: {},
        data() {
            return {
                xsTreeExpands: [],
                xsTreeProps: {
                    children: 'children',
                    label: 'fname'
                },
                xsTreeDataBeauty: [],
                currentIndex: -1
            }
        },
        methods: {
            handleTreeNodeClick(data) {
                this.$emit('handle-tree-change', data)
                this.xsTreeExpands[0] = data.fcode
            },
            // 抓取表格数据
            handleFetchData(queryModel = {}, isValue = false) {
                this.$emit('handle-fetch-data', queryModel, isValue, {
                    pageNo: 1,
                    pageSize: 200,
                })
            },
            // 创建树形结构
            handleCreateTreeStructure(arr) {
                var tree = []
                for (var k = 0; k < arr.length; k++) {
                    arr[k].children = []
                }

                // 初始化父亲节点
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].parentCode == '') {
                        tree.push(arr[i])
                        arr.splice(i, 1)
                        i--
                    }
                }

                var handleTreeForLoop = (arrx, treex) => {
                    if (arrx.length <= 0) return
                    for (var i = 0; i < arrx.length; i++) {
                        for (var j = 0; j < treex.length; j++) {
//                            console.log(arrx[i].parentCode, treex[j].fcode, 'p f')
                            if (arrx[i].parentCode == treex[j].fcode) {
                                treex[j].children.push(arrx[i])
                                arrx.splice(i, 1)
                                i--
                                break
                            }
                        }
                    }
                    if (arrx.length > 0) {
                        for (var l = 0; l < treex.length; l++) {
                            handleTreeForLoop(arrx, treex[l].children)
                        }
                    }
                }

                handleTreeForLoop(arr, tree)
                this.xsTreeDataBeauty = tree
            }
        },
        mounted() {
            this.handleFetchData()
            this.handleCreateTreeStructure(this.xsTreeData);
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    .comp-alu-tree-xs {
        padding-bottom: 100px;
        border: 1px solid #ccc;
    }
</style>
