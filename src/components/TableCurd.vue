<template>
  <div>
    <el-table stripe border size="mini" max-height="325" :data="tableConfig.tableList" style="width: 100%">
      <el-table-column v-if="!tableConfig.isRead" width="55" align="center" :render-header="(h, col) => renderTable(h, col)">
        <template slot-scope="scope">
          <i :class="scope.row._curdFlag==='d'?'icon-item revert-icon':'table-icon el-icon-remove' " @click="deleteRow(scope.$index)"></i>
        </template>
      </el-table-column>
      <template v-for="(item,index) in tableConfig.rowParams">
        <el-table-column align="center" :width="item.width" :label="item.name" v-if="item.type === 'Normal'">
          <template slot-scope="scope">
            <span v-if="tableConfig.isRead">{{ scope.row[item.code] }}</span>
            <el-input v-if="!tableConfig.isRead" :disabled="!item.isEdit" v-model="scope.row[item.code]"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" :width="item.width" :label="item.name" v-if="item.type === 'Whether'">
          <template slot-scope="scope">
            <span v-if="tableConfig.isRead">{{isMain[scope.row[item.code]]}}</span>
            <el-select v-if="!tableConfig.isRead" :disabled="!item.isEdit" v-model="scope.row[item.code]">
              <el-option :value="1" label="是"></el-option>
              <el-option :value="0" label="否"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" :width="item.width" :label="item.name" v-if="item.type === 'Select'">
          <template slot-scope="scope">
            <span v-if="tableConfig.isRead">{{ scope.row[item.code] }}</span>
            <el-select v-if="!tableConfig.isRead" :disabled="!item.isEdit" v-model="scope.row[item.code]">
              <el-option
                v-for="(o,i) in item.selectList"
                :key="i"
                :label="o.label"
                :value="o.value">
              </el-option>
            </el-select>
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
        isMain: {1:"是",0:"否"},
        rowForm: {}
      }
    },
    props: {
      'tableConfig': {
        default: function() {
          return {}
        }
      }
    },
    methods: {
      renderTable(h, {column}) {
        return(<i class="table-icon plus-icon el-icon-circle-plus" title="新增" on-click={ () => this.addRow() }/>)
      },
      addRow() {
        this.rowForm._curdFlag = 'c';
        this.tableConfig.tableList.unshift(this.$lodash.cloneDeep(this.rowForm));
      },
      deleteRow(index) {
        if(!this.tableConfig.tableList[index].id) {
          this.tableConfig.tableList.splice(index, 1);
        }else {
          if(this.tableConfig.tableList[index]._curdFlag === 'd') {
            this.$set(this.tableConfig.tableList[index], "_curdFlag", "r");
          }else {
            this.$set(this.tableConfig.tableList[index], "_curdFlag", "d");
          }
        }
      },
      cancelItem() {
        this.tableConfig.tableList = this.$lodash.cloneDeep(this.tableConfig.copyTableList);
      },
      saveItem() {
        let paramData = {};
        this.tableConfig.enableDS ? paramData[this.tableConfig.enableDS] = this.getLastList(this.tableConfig.copyTableList,this.tableConfig.tableList,this.tableConfig.primaryKey) : paramData = this.tableConfig.paramData;
        this.$http({method:'post',url:this.tableConfig.url,params:this.tableConfig.params,data:paramData})
          .then(result => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.tableConfig.isRead = true;
            this.$emit('refreshTable');
          })
          .catch((error) => {
            this.$message({
              message: error.response.data.message||'操作失败',
              type: 'error'
            })
          })
      }
    }
  }
</script>
