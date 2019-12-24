<template>
  <div>
    <div class="right-header console-pt5 console-pb5">
      <div class="console-title console-ml10">
        <span class="color-12 ui-font">参数详情</span>
      </div>
    </div>
    <el-button class="ui-color2" @click="$routeTo('msm_operationallimits_list')">返回</el-button>
    <div class="right-body">
      <el-card class="mt15">
        <el-form ref="form" label-width="160px">
          <el-col :span="fieldItemsWidth" v-for="(val,key) in detail" v-if="handlekeytoname(key)" key="item">
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
      return {
        fieldItemsWidth:12,
        fieldItemnames: {"dicid":"数据字典表ID","typeid":"系统分类ID","itemkey":"项键值","itemname":"项名","itemvalue":"项值","iscache":"是否缓存  （0 - 失效， 1 - 生效）","nodekey":"所属分组编码","remark":"备注","sort":"排序号","nodepath":"节点路径","parentid":"父节点"},
        detail:{"dicid":"数据字典表ID","typeid":"系统分类ID","itemkey":"项键值","itemname":"项名","itemvalue":"项值","iscache":"是否缓存  （0 - 失效， 1 - 生效）","nodekey":"所属分组编码","remark":"备注","sort":"排序号","nodepath":"节点路径","parentid":"父节点"},
      }
    },
    created () {

    },
    methods:{
      onSubmit() {

      },
      handlekeytoname(key){
        return this.fieldItemnames[key]?this.fieldItemnames[key]:null;
      }
    }
  }
</script>
