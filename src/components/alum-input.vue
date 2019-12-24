<template>
    <div class="input-plug">
        <el-select
                v-model="val"
                filterable
                clearable
                remote
                reserve-keyword
                :placeholder="placeholder"
                :remote-method="remoteMethod"
                @change = 'change'
                @clear = 'clear'
                :loading="loading">
            <div class="panel-header">
                <span v-for="(item) in headerList" class="header-span">
                    {{item.label}}
                </span>
            </div>
            <el-option
                    v-for="item in options"
                    :key="item.prop"
                    :label="item.label"
                    :value="item.label?item.label:item.prop">
                <div v-if="!item.label" class="f-tac">{{ item.prop }}</div>
                <div v-if="item.label">
                    <span class="item-left">{{ item.prop }}</span>
                    <span class="item-right" >{{ item.label }}</span>
                </div>
            </el-option>
        </el-select>
      <!--<el-input v-model="val" :placeholder="placeholder"  @keyup.enter.native = 'btn'>-->
        <!--<el-button  icon="el-icon-more" @click.native = 'btn' slot="append">-->
        <!--</el-button>-->
      <!--</el-input>-->
      <!--<transition name="el-fade-in-linear">-->
        <!--<div v-if="showTable" class="alum-table" >-->
          <!--<el-table-->
            <!--:data="tableData" @row-click = 'tableClick'-->
            <!--class="child-table"-->
            <!--height="240"-->
          <!--&gt;-->
            <!--<el-table-column v-for="(item,index) in headerList" :key = 'index'-->
              <!--:prop="item.prop"-->
              <!--:label="item.label"-->
              <!--:width="item.width?item.width:''" align="center">-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
      <!--</transition>-->
    </div>
</template>

<script>
    export default {
        name: "alum-input",
        props:{
          names:[String],//获取后台name传递给父元素
          url:[String],//根据url获取不同的数据
          sendparm:[String],//父组件传参给子组件作为搜索的值
          placeholder:[String],//父组件传入给子组件输入框提示字段
          headerList:{
              //选择表头展示
            type:Array,
            default:function(){
                return []
            }
          },
          configObj:[Object],//配置需要查询的字段一般为code,name
            //调用组件标识符用于判断调用父组件那个方法
          changeState:{
              type:String,
              default:function () {
                  return ''
              }
          }
        },
        watch:{
          //父元素改变将改变子元素
          'names'(){
              if(this.names){
                  this.val = this.names;
              }
          },
          //监控绑定的子元素数据val，通过输入变化传值给父组件绑定的names
          val:{
            handler(val){
             this.setCurrentValue(val)
            },
            deep:true
          },
        },
        data(){
          return{
            showTable:false,
            val:'',
            tableData:[],
            options:[],
            loading:false,
            list:[]
          }
        },
        mounted(){
            this.val = this.names;
        },
        methods:{
          remoteMethod(query){
              if (query !== '') {
                  this.getAjax(this.url + '?' + this.sendparm + '=' + query)
                      .then(res =>{
                          if(res.status === 200 && res.data.list.length > 0){
                              res.data.list.forEach(item => {
                                  this.tableData.push({label:item[this.configObj.name],
                                      prop:item[this.configObj.code],clientName2:item[this.configObj.name2]})
                              });
                              this.list = this.$lodash.cloneDeep(this.tableData);
                              this.tableData = [];
                          }
                      })
                  this.loading = true;
                  setTimeout(() => {
                      this.loading = false;
                      this.options = this.list.filter(item => {
                          return item.prop.toLowerCase().indexOf(query.toLowerCase()) > -1;
                      });
                  }, 200);
              } else {
                  this.options = [];
              }
          },
          clear(){
              this.$emit('invoking','')
          },
          change(value){
              if(this.changeState !=''){
                  console.log(this.list)
                  var order = this.list.filter(item =>{
                      return item.label.indexOf(value) > -1
                  })
                  this.$emit('invoking',order[0],this.changeState)
              }
          },
          setCurrentValue(value){
              this.$emit('update:names',value)//数据绑定父元素传入的names
          },
      }
    }
</script>

<style lang="less" rel="stylesheet/less" >
  @width:214px;
  .common(){
      display: inline-block;
      text-align: center;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
  }
  .panel-header{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap
  }
  .header-span{
      padding: 3px 5px 3px 0;
      flex: 1;
      text-align: center;
  }
  .item-left{
      width: 44%;
      .common()
  }
  .item-right{
      width: 55%;
      .common()
  }
  .input-plug{
    display: inline-block;
    width: @width;
    position: relative;
    .el-input-group__append{
        border: transparent;
        padding: 0 15px;
    }

    .alum-table{
      position: absolute;
      top: 32px;
      left: 0;
      z-index: 99;
        .child-table{
            width: @width;
            thead {
                tr{
                    background: #eee !important;
                }
            }
            td,th{
                border: 1px solid #eee ;
                border-collapse: collapse;
            }

        }
      .el-table__body,.el-table__header{
        max-width: @width!important;
      }
      .cell{
        padding: 0 5px !important;
      }
    }

  }
</style>
