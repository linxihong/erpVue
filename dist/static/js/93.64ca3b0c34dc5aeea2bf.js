webpackJsonp([93],{1027:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:["pageState","tableData","tabHeight","type"],data:function(){return{inboxcdData:[],disabled:!0}},mounted:function(){},methods:{showRoute:function(e,t){this.$emit("editRoute",e,t)},showHandle:function(e,t){this.$emit("show",e,t)},showDelete:function(e,t){this.$emit("delete",e,t)},showEdit:function(e,t,a){this.$emit("show",e,t,a)},ischeckbox:function(e){if(this.inboxcdData=[],e.length)for(var t=0;t<e.length;t++)this.inboxcdData.push(e[t].inboxcd);this.$emit("getcheckbox",this.inboxcdData)}}}},1063:function(e,t,a){var i=a(1)(a(1027),a(1071),null,null,null);e.exports=i.exports},1071:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"percent-table"},[a("el-table",{staticClass:"adjust-table ui-color4",attrs:{"highlight-current-row":"",data:e.tableData,height:e.tabHeight},on:{"select-all":e.ischeckbox,select:e.ischeckbox}},[e._e(),e._v(" "),"announceEdit"!==e.pageState?a("el-table-column",{attrs:{type:"selection",width:"55"}}):e._e(),e._v(" "),a("el-table-column",{attrs:{label:"状态",prop:"status",align:"center",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{label:"消息类型",prop:"type",align:"center",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{label:"标题",prop:"title",align:"center",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{label:"消息内容",prop:"content",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tooltip",{attrs:{disabled:e.disabled,trigger:"hover",placement:"top",effect:"dark"}},[a("el-tag",{staticClass:"custom-tag"},[e._v(e._s(t.row.content))])],1)]}}])}),e._v(" "),"remind"==e.pageState?a("el-table-column",{attrs:{label:"消息级别",prop:"level",align:"center",width:"80"}}):e._e(),e._v(" "),a("el-table-column",{attrs:{label:"发布人",prop:"publisher",align:"center",width:"120"}}),e._v(" "),"announce"==e.pageState||"announceEdit"==e.pageState?a("el-table-column",{attrs:{label:"发布时间",prop:"publishtime",align:"center",width:"150"}}):e._e(),e._v(" "),"remind"==e.pageState||"task"==e.pageState?a("el-table-column",{attrs:{label:"接收时间",prop:"receivetime",align:"center",width:"150"}}):e._e(),e._v(" "),"task"==e.pageState?a("el-table-column",{attrs:{label:" ",width:"140",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("查看")])]}}])}):e._e(),e._v(" "),"remind"==e.pageState||"announce"==e.pageState?a("el-table-column",{attrs:{label:" ",width:"100",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("查看")])]}}])}):e._e(),e._v(" "),"announceEdit"===e.pageState?a("el-table-column",{attrs:{label:" ",width:"150",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("发布")]),e._v(" "),a("span",{staticClass:"color-2"},[e._v("|")]),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showEdit("edit",t.$index,e.tableData)}}},[e._v("编辑")]),e._v(" "),a("span",{staticClass:"color-2"},[e._v("|")]),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showDelete(t.$index,e.tableData)}}},[e._v("删除")])]}}])}):e._e()],1)],1)},staticRenderFns:[]}},1146:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a(1063),s=a.n(i),l=a(965),n=a.n(l);t.default={components:{ZLMessageTable:s.a,ZLCommonSearch:n.a},data:function(){var e=this;return{pageState:"task",dialog_top:"100px",tabHeight:522,createtime:null,typename:"rw",apiUrl:"/message/inbox/allByPage",typeVisible:!1,condition:{},receiveData:[],ischeckboxData:[],someData:[],typeForm:{status:null,inboxcd:null,inboxid:null,handlingsuggestion:null,processeditem:null,processor:this.$store.getters.getUserinfo.fullname,processorid:this.$store.getters.getUserinfo.userid,receiverid:0,parentid:null},searchFields:[{name:"消息类型",type:"select",fieldName:"type",label:e.getSubordinate("rw")},{name:"状态",type:"select",fieldName:"status",label:[{label:"已处理",value:"1"},{label:"未处理",value:"0"}]},{name:"标题",type:"string",fieldName:"title"}],itemValues:[{type:"select"},{name:"status",label:"状态",width:"",type:"normal"},{name:"type",label:"消息类型",width:"",type:"normal"},{name:"title",label:"标题",width:"",type:"normal"},{name:"content",label:"消息内容",width:"",type:"normal"},{name:"receiver",label:"发送人",width:"",type:"normal"},{name:"receivetime",label:"接受时间",width:"",type:"normal"},{},{},{type:"button",width:150,buttons:[{name:"editRoute",label:"查看"},{name:"edit",label:"处理"}]}],arrowBot:!0,arrowTop:!1,searchVisible:!0,formHeight:null,height:null}},mounted:function(){var e=this;this.init(),setTimeout(function(){e.getDivHeight()},20)},methods:{init:function(){var e=this;setTimeout(function(){e.getlist()},20),this.getSomeData()},getDivHeight:function(){var e=this.$refs.pageHeight.offsetHeight,t=this.$refs.btnHeight.offsetHeight;this.formHeight=this.$refs.formHeight.offsetHeight,this.height=e-t-this.$store.state.pageHeight,this.tabHeight=this.height-this.formHeight},toggleSearch:function(){var e=this;this.arrowBot=!this.arrowBot,this.arrowTop=!this.arrowTop,this.searchVisible=!this.searchVisible,this.searchVisible?setTimeout(function(){e.tabHeight=e.height-e.formHeight},20):this.tabHeight=this.height},initial:function(){this.$refs.ZLCommonSearch.init()},search:function(e){this.condition=e.exts,this.getlist()},reset:function(){this.condition={title:null,status:null},this.getlist()},getlist:function(){var e=this,t=this,a=[];this.condition.type?this.typename=this.condition.type:this.typename="rw",this.fetch(this.apiUrl,{inbox:{type:this.typename,title:this.condition.title,status:this.condition.status,pageNo:this.cPage,pageSize:this.cSize}}).then(function(i){if(200===i.status){a=i.data.list;for(var s=0;s<a.length;s++)a[s].type=_.filter(t.someData,{itemkey:a[s].type})[0].itemname;for(var l in a)0===a[l].status?a[l].status="未处理":1===a[l].status&&(a[l].status="已处理");for(var n=0;n<a.length;n++)a[n].content=e.removeHTMLTag(a[n].content);t.cTotal=i.data.total,t.receiveData=a}})},getSomeData:function(){var e=this;this.postDicData([{nodekey:"messageType"}]).then(function(t){200===t.status&&(e.someData=t.data.messageType)})},dealwith:function(){var e=this,t=this;this.typeForm.status=1,this.fetch("/message/taskhandle/add",{taskhandle:this.typeForm}).then(function(a){200===a.status?(e.$message({message:a.message,type:"success"}),t.$store.state.noticnum=1,e.typeVisible=!1,e.getlist(),console.log(90)):500===a.status&&(e.$message({message:a.message,type:"error"}),e.typeVisible=!1,e.getlist())})},deletes:function(){var e=this;this.ischeckboxData.length?this.fetch("/message/inbox/del",this.ischeckboxData).then(function(t){200===t.status?(e.$message({message:t.message,type:"success"}),e.$store.state.noticnum=1,e.getlist()):500===t.status&&(e.$message({message:t.message,type:"error"}),e.getlist())}):this.$message({message:"请选择删除的数据",type:"warning"})},getcheckbox:function(e){this.ischeckboxData=e},show_dialog:function(e,t){this.typeVisible=!0,this.typeForm=t[e]},close:function(){this.typeVisible=!1},delrow:function(){},editRoute:function(e,t){this.$routeTo("mc_announcement_view",{id:t[e].inboxcd,typeid:"2",inboxcdData:t,index:e})}}}},1342:function(e,t,a){t=e.exports=a(656)(!0),t.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"task_message.vue",sourceRoot:""}])},1473:function(e,t,a){var i=a(1342);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(657)("1545b1cc",i,!0,{})},1670:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"pageHeight",staticClass:"page-secondnav page-commonnav"},[a("div",{staticClass:"f-content"},[a("div",{ref:"btnHeight",staticClass:"console-pt4 console-pb4"},[a("el-button",{staticClass:"ui-color3",on:{click:function(t){e.$routeTo("mc_announcement_edit",{type:"task"})}}},[e._v("新增")]),e._v(" "),a("el-button",{staticClass:"ui-color2",on:{click:e.deletes}},[e._v("删除")]),e._v(" "),a("div",{staticClass:"pull-right"},[a("el-button",{staticClass:"ui-color2 console-mr2",attrs:{title:"刷新"},on:{click:e.initial}},[a("i",{staticClass:"fa fa-refresh"})]),e._v(" "),e.arrowBot?a("span",{staticClass:"color-1 margin-2 fm-query",on:{click:e.toggleSearch}},[e._v("更多查询"),a("i",{staticClass:"el-icon-arrow-down margin-2"})]):e._e(),e._v(" "),e.arrowTop?a("span",{staticClass:"color-1 margin-2 fm-query",on:{click:e.toggleSearch}},[e._v("更多查询"),a("i",{staticClass:"el-icon-arrow-up margin-2"})]):e._e()],1)],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.searchVisible,expression:"searchVisible"}],ref:"formHeight",staticClass:"console-pb4"},[a("ZLCommonSearch",{ref:"ZLCommonSearch",attrs:{fields:e.searchFields},on:{search:e.search,reset:e.reset}})],1),e._v(" "),a("el-dialog",{staticClass:"dialogDiv dialogDivII",attrs:{"show-close":!1,visible:e.typeVisible,top:e.dialog_top,size:"tiny"},on:{"update:visible":function(t){e.typeVisible=t},close:e.close}},[a("div",{staticClass:"slideContent"},[a("div",{staticClass:"leftDiv"},[a("el-button",{staticClass:"icon-setting-2 icon-close",on:{click:function(t){e.typeVisible=!1}}}),e._v(" "),a("el-button",{staticClass:"icon-setting-1 icon-confirm",on:{click:e.dealwith}})],1),e._v(" "),a("div",{directives:[{name:"drag1",rawName:"v-drag1"}],staticClass:"slideTop"},[e._v("处理消息")]),e._v(" "),a("div",{staticClass:"slideMid"},[a("el-form",{ref:"typeForm",attrs:{"label-width":"80px",model:e.typeForm}},[a("el-form-item",{attrs:{label:"标题"}},[a("el-input",{attrs:{readonly:!0},model:{value:e.typeForm.title,callback:function(t){e.$set(e.typeForm,"title",t)},expression:"typeForm.title"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"处理项"}},[a("el-input",{model:{value:e.typeForm.processeditem,callback:function(t){e.$set(e.typeForm,"processeditem",t)},expression:"typeForm.processeditem"}})],1),e._v(" "),a("el-form-item",{staticClass:"item-bottomI",attrs:{label:"消息内容"}},[a("el-input",{attrs:{type:"textarea",resize:"none",rows:4,readonly:!0},model:{value:e.typeForm.content,callback:function(t){e.$set(e.typeForm,"content",t)},expression:"typeForm.content"}})],1),e._v(" "),a("el-form-item",{staticClass:"item-bottomI",attrs:{label:"处理意见"}},[a("el-input",{attrs:{type:"textarea",resize:"none",rows:3},model:{value:e.typeForm.handlingsuggestion,callback:function(t){e.$set(e.typeForm,"handlingsuggestion",t)},expression:"typeForm.handlingsuggestion"}})],1)],1)],1)])]),e._v(" "),a("ZLMessageTable",{attrs:{tableData:e.receiveData,pageState:e.pageState,tabHeight:e.tabHeight},on:{editRoute:e.editRoute,show:e.show_dialog,getcheckbox:e.getcheckbox}}),e._v(" "),a("el-pagination",{staticClass:"console-mt5",attrs:{"current-page":e.cPage,"page-sizes":e.cpageSizes,"page-size":e.cSize,layout:"total, sizes, prev, pager, next",total:e.cTotal},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])},staticRenderFns:[]}},723:function(e,t,a){function i(e){a(1473)}var s=a(1)(a(1146),a(1670),i,"data-v-5e72bfaf",null);e.exports=s.exports},922:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{multi:{type:String},fields:Array,paramVersion:{type:String,default:function(){return"v2"}},isWithExts:{type:Boolean,default:function(){return!0}}},mounted:function(){"low"===this.$store.state.resolution&&(this.conditionWdith="80px"),this.getDivHeight()},data:function(){var e=this;return{conditionWdith:"85px",a_type:1,a_val:null,fieldValues:this.fields?_.map(this.fields,function(e){return _.extend({value:null},e)}):[],pickerOptions:{shortcuts:[{text:"今日",onClick:function(t){var a=e.recentDate(0),i=e.recentDate(0);t.$emit("pick",[a,i])}},{text:"明日",onClick:function(t){var a=e.recentDate(1),i=e.recentDate(1);t.$emit("pick",[a,i])}},{text:"前后1天",onClick:function(t){var a=e.recentDate(-1),i=e.recentDate(1);t.$emit("pick",[a,i])}},{text:"前后2天",onClick:function(t){var a=e.recentDate(-2),i=e.recentDate(2);t.$emit("pick",[a,i])}},{text:"本月",onClick:function(t){var a=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1),"yy-mm-dd"),i=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1)+864e5*(e.$store.state.daycount-1),"yy-mm-dd");t.$emit("pick",[a,i])}}]},pickerOptionsI:{shortcuts:[{text:"今日",onClick:function(t){var a=e.recentDate(0)+" 00:00:00",i=e.recentDate(0)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"明日",onClick:function(t){var a=e.recentDate(1)+" 00:00:00",i=e.recentDate(1)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"前后1天",onClick:function(t){var a=e.recentDate(-1)+" 00:00:00",i=e.recentDate(1)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"前后2天",onClick:function(t){var a=e.recentDate(-2)+" 00:00:00",i=e.recentDate(2)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"本月",onClick:function(t){var a=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1),"yy-mm-dd")+" 00:00:00",i=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1)+864e5*(e.$store.state.daycount-1),"yy-mm-dd")+" 23:59:59";t.$emit("pick",[a,i])}}]}}},methods:{init:function(){this.onSearchButtonClick()},getDivHeight:function(){return this.$refs.formHeight.offsetHeight},onSearchButtonClick:function(){var e=this,t={},a="",i="",s="",l="",n="";if(_.each(e.fieldValues,function(a,i){a.fieldName&&(t[a.fieldName]=a.value instanceof Date?e.formatDate(a.value,"hms"):a.value),a.fieldName,t.dateRange&&(t.builddate_ge_date=e.formatDate(t.dateRange[0],"yy-mm-dd"),t.builddate_le_date=e.formatDate(t.dateRange[1],"yy-mm-dd")),"forbidden_daterange"===a.fieldName&&t.forbidden_daterange&&(t.builddate_ge_date=e.formatDate(t.forbidden_daterange[0],"yy-mm-dd"),t.builddate_le_date=e.formatDate(t.forbidden_daterange[1],"yy-mm-dd"))}),this.$emit("search",this.isWithExts?{exts:t}:t),"daterange"===this.fieldValues[0].type){this.a_val&&(2===this.a_type?n+="balanceprice_ne="+this.a_val:n+="balanceprice="+this.a_val);for(var o=1;o<this.fieldValues.length;o++)t.datehandle&&this.fieldValues[0].value&&(l=this.fieldValues[o].value||"",i+=this.fieldValues[o].fieldName+"="+l+"&",s=this.fieldValues[0].label+"_ge_date="+e.formatDate(t.datehandle[0],"yy-mm-dd")+"&"+this.fieldValues[0].label+"_le_date="+e.formatDate(t.datehandle[1],"yy-mm-dd")+"&",null===t.datehandle[0]&&(l=this.fieldValues[o].value||"",i+=this.fieldValues[o].fieldName+"="+l+"&",s=""));a=s?i+s+n:i+n}if("select"===this.fieldValues[0].type){for(var r=2;r<this.fieldValues.length;r++)l=this.fieldValues[r].value||"",i+=this.fieldValues[r].fieldName+"="+l+"&",t.datehandle&&this.fieldValues[0].value&&(s=this.fieldValues[0].value+"_ge_date="+e.formatDate(t.datehandle[0],"ymdhM")+"&"+this.fieldValues[0].value+"_le_date="+e.formatDate(t.datehandle[1],"ymdhM")+"&");a=i+s}a="&"===a.substring(a.length-1)?a.substring(0,a.length-1):a,this.$emit("searchII",a)},onRestButtonClick:function(){for(var e=0;e<this.fieldValues.length;e++)"forbidden_daterange"===this.fieldValues[e].fieldName||(this.fieldValues[e].value="");this.a_val="",this.$emit("reset"),this.sdate=null,this.edate=null}}}},924:function(e,t,a){t=e.exports=a(656)(!0),t.push([e.i,".inputwidth[data-v-39b0517a]{width:220px}.selectwidth[data-v-39b0517a]{width:91px}.framewidth[data-v-39b0517a]{width:220px}","",{version:3,sources:["F:/pc_project/erp-aluminium/yunerp/src/components/ZLCommonSearch.vue"],names:[],mappings:"AACA,6BACE,WAAa,CACd,AACD,8BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd",file:"ZLCommonSearch.vue",sourcesContent:["\n.inputwidth[data-v-39b0517a] {\n  width: 220px;\n}\n.selectwidth[data-v-39b0517a] {\n  width: 91px;\n}\n.framewidth[data-v-39b0517a] {\n  width: 220px;\n}\n"],sourceRoot:""}])},964:function(e,t,a){var i=a(924);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(657)("7f807ae8",i,!0,{})},965:function(e,t,a){function i(e){a(964)}var s=a(1)(a(922),a(967),i,"data-v-39b0517a",null);e.exports=s.exports},967:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"formHeight"},[a("el-card",{staticClass:"box-card__form console-width-12"},[a("el-form",{staticClass:"filterform cf",attrs:{"label-width":e.conditionWdith},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.onSearchButtonClick(t):null}}},[e._l(e.fieldValues,function(t,i){return a("el-form-item",{key:i,attrs:{label:t.name}},["date"===t.type?a("el-date-picker",{attrs:{align:"right",type:"date",format:"yyyy-MM-dd"},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"daterange"===t.type?a("el-date-picker",{attrs:{type:"daterange",align:"right","picker-options":e.pickerOptions},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"datetimerange"===t.type?a("el-date-picker",{staticClass:"framewidth",attrs:{type:"datetimerange",align:"right",format:"yyyy-MM-dd HH:mm","picker-options":e.pickerOptionsI},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"forbidden_daterange"===t.type?a("el-date-picker",{attrs:{type:"forbidden_daterange",align:"right",readonly:!0,"picker-options":e.pickerOptions},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"select"===t.type?a("el-select",{staticClass:"framewidth",attrs:{clearable:""},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}},e._l(t.label,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1):e._e(),e._v(" "),"select-many"===t.type?a("el-select",{staticClass:"framewidth",attrs:{multiple:"","collapse-tags":"",placeholder:"请选择",clearable:""},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}},e._l(t.label,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1):e._e(),e._v(" "),null===t.type||"string"===t.type?a("el-input",{staticClass:"framewidth",attrs:{placeholder:t.name},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"checkbox"===t.type?a("el-checkbox",{staticClass:"framewidth",attrs:{label:t.label,"true-label":1},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e()],1)}),e._v(" "),"A"===e.multi?a("el-form-item",{attrs:{label:"原单价"}},["A"===e.multi?a("el-input",{staticClass:"inputwidth",model:{value:e.a_val,callback:function(t){e.a_val=t},expression:"a_val"}},[a("el-select",{staticClass:"selectwidth",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.a_type,callback:function(t){e.a_type=t},expression:"a_type"}},[a("el-option",{attrs:{label:"等于",value:1}}),e._v(" "),a("el-option",{attrs:{label:"不等于",value:2}})],1)],1):e._e()],1):e._e(),e._v(" "),a("el-form-item",[a("el-button",{staticClass:"ui-color3",on:{click:e.onSearchButtonClick}},[e._v("查询")]),e._v(" "),a("el-button",{staticClass:"ui-color2",on:{click:e.onRestButtonClick}},[e._v("重置")])],1)],2)],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=93.64ca3b0c34dc5aeea2bf.js.map