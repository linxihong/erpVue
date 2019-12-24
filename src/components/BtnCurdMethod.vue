<template>
  <div>
    <div class="btn-wrap" v-if="curdObject.isRead">
      <!--<el-button :disabled="curdObject.isShowBtn" @click="addMethod">添加</el-button>-->
      <el-button :disabled="curdObject.isShowBtn" @click="editMethod">修改</el-button>
      <el-button :disabled="curdObject.isShowBtn" @click="deleteMethod">删除</el-button>
      <el-button :disabled="curdObject.isShowBtn" @click="init">刷新</el-button>
    </div>
    <div class="btn-wrap" v-if="!curdObject.isRead">
      <el-button :disabled="curdObject.isShowBtn" @click="cancelMethod">取消</el-button>
      <el-button :disabled="curdObject.isShowBtn" @click="saveMethod">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      'idObj': {
        default: function () {
          return {}
        }
      },
      'curdObject': {
        type: Object,
        default: function () {
          return {_entity:null}
        }
      },
      'primaryParams': {
        type: Object,
        default: function () {
          return {}
        }
      },
      'configObject': {
        type: Object,
        default: function () {
          return {}
        }
      },
      'masterDS': {
        type: Array,
        default: function () {
          return []
        }
      },
      'slaveDS': {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      init() {
        this.$emit('init');
      },
      addMethod() {
        this.masterDS.forEach(item => {
          this.configObject[item.name] = {};
          this.configObject['copy'+item.name] = {};
        });
        this.slaveDS.forEach(item => {
          this.configObject[item.name] = [];
          this.configObject['copy'+item.name] = [];
        });
        this.curdObject.operateType = 'add';
        this.curdObject.isRead = false;
        if(this.curdObject.showBtnIndex) {
          this.curdObject.showBtnIndex = 0;
        }
      },
      editMethod() {
        this.curdObject.operateType = 'edit';
        this.curdObject.isRead = false;
        if(this.curdObject.showBtnIndex) {
          this.curdObject.showBtnIndex = 0;
        }
      },
      cancelMethod() {
        this.curdObject.isRead = true;
        this.curdObject.operateType === 'add' && this.init();
        this.masterDS.forEach(item => {
          this.configObject[item.name] = this.$lodash.cloneDeep(this.configObject['copy'+item.name]);
        });
        this.slaveDS.forEach(item => {
          this.configObject[item.name] = this.$lodash.cloneDeep(this.configObject['copy'+item.name]);
        })
      },
      saveMethod() {
        let formData;
        let newObjI = {}, newObjII = {};
        let formDataI = [], formDataII = [];
        if(this.masterDS.length) {
          this.masterDS.forEach(item => {
            this.curdObject.operateType === 'add' ? this.configObject[item.name]['_curdFlag'] = 'c' : this.configObject[item.name]['_curdFlag'] = 'u';
            newObjI[item.name] = this.configObject[item.name];
            formDataI.push(newObjI);
          });
        }
        if(this.slaveDS.length) {
          this.slaveDS.forEach(item => {
            newObjII = {};
            newObjII[item.name] = this.getLastList(this.configObject['copy'+item.name],this.configObject[item.name],item.primaryKey);
            formDataII.push(newObjII);
          });
        }
        let lastFormData = [...formDataI,...formDataII];
        if(lastFormData.length) {
          lastFormData.forEach(item => {
            formData = {...formData,...item};
          });
        }
        this.$http({method:'post',url:this.curdObject.url,params:{...this.primaryParams},data:formData})
          .then(result => {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.curdObject.isRead = true;
            this.init();
          })
          .catch((error) => {
            this.$message({
              message: error.response.data.message||'操作失败',
              type: 'error'
            })
          })
      },
      deleteMethod() {
        this.$confirm('确认删除该记录吗？','提示',{
          type: 'warning'
        }).then(()=>{
          this.$http({method:'post',url:this.curdObject.url,params:{...this.primaryParams},data:this.idObj})
            .then(result => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.init();
            })
        })
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
  .btn-wrap {
    margin-bottom: 15px;
  }
</style>

