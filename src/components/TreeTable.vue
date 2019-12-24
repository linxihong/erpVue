<template>
    <div>
        <el-table
            :data="tableListData"
            :row-style="toggleDisplayTr"
            border
            ref="treetable"
            highlight-current-row
            class="main-table"
            :height="mainHeight"
            @row-click="handleDetail"
            :max-height="$store.state.screenHei*0.76"
            v-show="!isShowStatus.isMore"
            :align="isCenter?'center':'left'"
        >
            <template v-for="(item,index) in propData">
                <el-table-column
                    v-if="item.type === 'first'"
                    :fixed="item.fixed"
                    :align="item.align"
                    :label="item.name"
                    :width="item.width"
                    :sortable="item.sortable"
                    :sort-method="(a, b) => sortAlpha(a, b, item.prop)"
                    :show-overflow-tooltip="!item.isShort"
                >
                    <template slot-scope="scope">
                        <p :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0`">
                            <i @click.stop="toggleFoldingStatus(scope.row)" :class="toggleFoldingClass(scope.row)"></i>
                            <span style="margin-left: 5px">{{scope.row.fcode}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="item.type === 'normal'&&!item.isMain&&!item.disabledInput"
                    :fixed="item.fixed"
                    :align="item.align"
                    :label="item.name"
                    :width="item.width"
                    :sortable="item.sortable"
                    :sort-method="(a, b) => sortAlpha(a, b, item.prop)"
                    :show-overflow-tooltip="!item.isShort"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableListData: [], // tableListData 展示数据的data
                foldList: [], // 该数组中的值 都会在列表中进行隐藏
            }
        },
        props: {
            //表格高度
            'mainHeight': {
                type: Number,
                default: 713
            },
            // isMore 点击'更多查询'时隐藏该表格
            'isShowStatus': {
                type: Object
            },
            // 单元格是否居中
            'isCenter': {
                type: Boolean,
                default: false
            },
            // 含有表单字段名称以及字段代码等相关信息的列表
            'propData': {
                type: Array
            },
            // 表格的数组数据
            'tableData': {
                type: Array
            },
        },
        computed: {
            /*********************************
             ** Fn: foldAllList
             ** Intro: 记录属性结构的首层节点
             *********************************/
            foldAllList () {
                return this.tableListData.map(x => x.__identity)
            },
        },
        methods: {
            // 初始化数据
            initStatusData() {
                this.tableListData = this.formatConversion([], this.tableData)
            },
            // 点击表格行获取详情
            handleDetail(row) {
                this.$emit('handleDetail',row)
            },
            //渲染
            renderRow(fid,idName = 'fid') {
                let tempRow;
                tempRow = this.tableData.find(item => item[idName] === fid);
                this.$nextTick(() => {
                    if(tempRow) {
                        this.$refs.treetable.setCurrentRow(tempRow);
                        this.$emit('handleDetail',tempRow);
                    }else {
                        //this.$emit('getInitPage');
                    }
                })
            },
            /*********************************
             ** Fn: toggleFoldingStatus
             ** Intro: 切换展开 还是折叠
             ** @params: params 当前点击行的数据
             *********************************/
            toggleFoldingStatus (params) {
                this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
            },
            /*********************************
             ** Fn: toggleDisplayTr
             ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
             ** @params:
             *********************************/
            toggleDisplayTr ({row, index}) {
                for (let i = 0; i < this.foldList.length; i++) {
                    let item = this.foldList[i];
                    // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
                    if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
                }
                return ''
            },
            /*********************************
             ** Fn: toggleFoldingClass
             ** Intro: 如果子集长度为0，则不返回字体图标。
             ** Intro: 如果子集长度为不为0，根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
             ** Intro: 关于class说明：permission_placeholder返回一个占位符，具体查看class
             ** @params: params 当前行的数据对象
             *********************************/
            toggleFoldingClass (params) {
                return params.children.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'el-icon-remove' : 'el-icon-circle-plus')
            },
            /*********************************
             ** Fn: formatConversion
             ** Intro: 将树形接口数据扁平化
             ** @params: parent 为当前累计的数组  也是最后返回的数组
             ** @params: children 为当前节点仍需继续扁平子节点的数据
             ** @params: index 默认等于0， 用于在递归中进行累计叠加 用于层级标识
             ** @params: family 装有当前包含元素自身的所有父级 身份标识
             ** @params: elderIdentity 父级的  唯一身份标识
             *********************************/
            formatConversion (parent, children, index = 0, family = [], elderIdentity = 'x') {
                // children如果长度等于0，则代表已经到了最低层
                // let page = (this.startPage - 1) * 10
                if (children.length > 0) {
                    children.map((x, i) => {
                        // 设置 __level 标志位 用于展示区分层级
                        this.$set(x, '__level', index);
                        // 设置 __family 为家族关系 为所有父级，包含本身在内
                        this.$set(x, '__family', [...family, elderIdentity + '_' + i])
                        // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
                        this.$set(x, '__identity', elderIdentity + '_' + i);
                        parent.push(x);
                        // 如果仍有子集，则进行递归
                        if (x.children.length > 0) this.formatConversion(parent, x.children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
                    })
                } return parent
            }
        }
    }
</script>

<style lang="less" type="text/less" scoped>

</style>
