webpackJsonp([95],{1027:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:["pageState","tableData","tabHeight","type"],data:function(){return{inboxcdData:[],disabled:!0}},mounted:function(){},methods:{showRoute:function(e,t){this.$emit("editRoute",e,t)},showHandle:function(e,t){this.$emit("show",e,t)},showDelete:function(e,t){this.$emit("delete",e,t)},showEdit:function(e,t,a){this.$emit("show",e,t,a)},ischeckbox:function(e){if(this.inboxcdData=[],e.length)for(var t=0;t<e.length;t++)this.inboxcdData.push(e[t].inboxcd);this.$emit("getcheckbox",this.inboxcdData)}}}},1063:function(e,t,a){var i=a(1)(a(1027),a(1071),null,null,null);e.exports=i.exports},1071:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"percent-table"},[a("el-table",{staticClass:"adjust-table ui-color4",attrs:{"highlight-current-row":"",data:e.tableData,height:e.tabHeight},on:{"select-all":e.ischeckbox,select:e.ischeckbox}},[e._e(),e._v(" "),"announceEdit"!==e.pageState?a("el-table-column",{attrs:{type:"selection",width:"55"}}):e._e(),e._v(" "),a("el-table-column",{attrs:{label:"状态",prop:"status",align:"center",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{label:"消息类型",prop:"type",align:"center",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{label:"标题",prop:"title",align:"center",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{label:"消息内容",prop:"content",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tooltip",{attrs:{disabled:e.disabled,trigger:"hover",placement:"top",effect:"dark"}},[a("el-tag",{staticClass:"custom-tag"},[e._v(e._s(t.row.content))])],1)]}}])}),e._v(" "),"remind"==e.pageState?a("el-table-column",{attrs:{label:"消息级别",prop:"level",align:"center",width:"80"}}):e._e(),e._v(" "),a("el-table-column",{attrs:{label:"发布人",prop:"publisher",align:"center",width:"120"}}),e._v(" "),"announce"==e.pageState||"announceEdit"==e.pageState?a("el-table-column",{attrs:{label:"发布时间",prop:"publishtime",align:"center",width:"150"}}):e._e(),e._v(" "),"remind"==e.pageState||"task"==e.pageState?a("el-table-column",{attrs:{label:"接收时间",prop:"receivetime",align:"center",width:"150"}}):e._e(),e._v(" "),"task"==e.pageState?a("el-table-column",{attrs:{label:" ",width:"140",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("查看")])]}}])}):e._e(),e._v(" "),"remind"==e.pageState||"announce"==e.pageState?a("el-table-column",{attrs:{label:" ",width:"100",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("查看")])]}}])}):e._e(),e._v(" "),"announceEdit"===e.pageState?a("el-table-column",{attrs:{label:" ",width:"150",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showRoute(t.$index,e.tableData)}}},[e._v("发布")]),e._v(" "),a("span",{staticClass:"color-2"},[e._v("|")]),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showEdit("edit",t.$index,e.tableData)}}},[e._v("编辑")]),e._v(" "),a("span",{staticClass:"color-2"},[e._v("|")]),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){e.showDelete(t.$index,e.tableData)}}},[e._v("删除")])]}}])}):e._e()],1)],1)},staticRenderFns:[]}},1138:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a(1063),n=a.n(i),l=a(965),s=a.n(l);t.default={components:{ZLMessageTable:n.a,ZLCommonSearch:s.a},data:function(){return{pageState:"announce",tabHeight:522,apiUrl:"/message/inbox/allByPage",receiveData:[],searchFields:[{name:"消息类型",type:"select",fieldName:"type",label:this.getSubordinate("xt")},{name:"状态",type:"select",fieldName:"status",label:[{label:"已读",value:"1"},{label:"未读",value:"0"}]},{name:"标题",type:"string",fieldName:"title"}],itemValues:[{type:"select"},{name:"status",label:"状态",width:"",type:"normal"},{name:"type",label:"消息类型",width:"",type:"normal"},{name:"title",label:"标题",width:"",type:"normal"},{name:"content",label:"消息内容",width:"",type:"normal"},{name:"publisher",label:"发布人",width:"",type:"normal"},{name:"publishtime",label:"发布时间",width:"",type:"normal"},{type:"button",width:150,buttons:[{name:"editRoute",label:"查看"}]}],condition:{},ischeckboxData:[],someData:[],typename:"xt",arrowBot:!0,arrowTop:!1,searchVisible:!0,formHeight:null,height:null}},mounted:function(){var e=this;this.init(),setTimeout(function(){e.getDivHeight()},20)},methods:{init:function(){var e=this;setTimeout(function(){e.getlist()},20),this.getSomeData()},getDivHeight:function(){var e=this.$refs.pageHeight.offsetHeight,t=this.$refs.btnHeight.offsetHeight;this.formHeight=this.$refs.formHeight.offsetHeight,this.height=e-t-this.$store.state.pageHeight,this.tabHeight=this.height-this.formHeight},toggleSearch:function(){var e=this;this.arrowBot=!this.arrowBot,this.arrowTop=!this.arrowTop,this.searchVisible=!this.searchVisible,this.searchVisible?setTimeout(function(){e.tabHeight=e.height-e.formHeight},10):this.tabHeight=this.height},initial:function(){this.$refs.ZLCommonSearch.init()},search:function(e){this.condition=e.exts,this.getlist()},reset:function(){this.condition={title:null,status:null},this.getlist()},getlist:function(){var e=this,t=this,a=[];this.condition.type?this.typename=this.condition.type:this.typename="xt",this.fetch(this.apiUrl,{inbox:{type:this.typename,title:this.condition.title,status:this.condition.status,pageNo:this.cPage,pageSize:this.cSize}}).then(function(i){a=i.data.list;for(var n=0;n<a.length;n++)a[n].type=_.filter(t.someData,{itemkey:a[n].type})[0].itemname;for(var l in a)0===a[l].status?a[l].status="未读":1===a[l].status&&(a[l].status="已读");for(var s=0;s<a.length;s++)a[s].content=e.removeHTMLTag(a[s].content);e.cTotal=i.data.total,t.receiveData=a})},getSomeData:function(){var e=this;this.postDicData([{nodekey:"messageType"}]).then(function(t){200===t.status&&(e.someData=t.data.messageType)})},markread:function(){var e=this,t=this;this.ischeckboxData.length?this.fetch("/message/inbox/read",this.ischeckboxData).then(function(a){200===a.status?(e.$message({message:a.message,type:"success"}),t.$store.state.noticnum=1,e.getlist()):500===a.status&&(e.$message({message:a.message,type:"error"}),e.getlist())}):this.$message({message:"请选择要标为已读的数据",type:"warning"})},deletes:function(){var e=this;this.ischeckboxData.length?this.fetch("/message/inbox/del",this.ischeckboxData).then(function(t){200===t.status?(e.$message({message:t.message,type:"success"}),e.$store.state.noticnum=1,e.getlist()):500===t.status&&(e.$message({message:t.message,type:"error"}),e.getlist())}):this.$message({message:"请选择删除的数据",type:"warning"})},getcheckbox:function(e){this.ischeckboxData=e},show_dialog:function(){},delrow:function(){},editRoute:function(e,t){this.$routeTo("mc_announcement_view",{id:t[e].inboxcd,typeid:"1",inboxcdData:t,index:e})}}}},1289:function(e,t,a){t=e.exports=a(656)(!0),t.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"announcement.vue",sourceRoot:""}])},1420:function(e,t,a){var i=a(1289);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(657)("f6d22810",i,!0,{})},1604:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"pageHeight",staticClass:"page-secondnav page-commonnav"},[a("div",{staticClass:"f-content"},[a("div",{ref:"btnHeight",staticClass:"console-pt4 console-pb4"},[a("el-button",{staticClass:"ui-color3",on:{click:function(t){e.$routeTo("mc_announcement_edit",{type:"annou"})}}},[e._v("新建公告")]),e._v(" "),a("el-button",{staticClass:"ui-color2",on:{click:e.markread}},[e._v("标为已读")]),e._v(" "),a("el-button",{staticClass:"ui-color2",on:{click:e.deletes}},[e._v("删除")]),e._v(" "),a("div",{staticClass:"pull-right"},[a("el-button",{staticClass:"ui-color2 console-mr2",attrs:{title:"刷新"},on:{click:e.initial}},[a("i",{staticClass:"fa fa-refresh"})]),e._v(" "),e.arrowBot?a("span",{staticClass:"color-1 margin-2 fm-query",on:{click:e.toggleSearch}},[e._v("更多查询"),a("i",{staticClass:"el-icon-arrow-down margin-2"})]):e._e(),e._v(" "),e.arrowTop?a("span",{staticClass:"color-1 margin-2 fm-query",on:{click:e.toggleSearch}},[e._v("更多查询"),a("i",{staticClass:"el-icon-arrow-up margin-2"})]):e._e()],1)],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.searchVisible,expression:"searchVisible"}],ref:"formHeight",staticClass:"console-pb4"},[a("ZLCommonSearch",{ref:"ZLCommonSearch",attrs:{fields:e.searchFields},on:{search:e.search,reset:e.reset}})],1),e._v(" "),a("ZLMessageTable",{attrs:{tableData:e.receiveData,pageState:e.pageState,tabHeight:e.tabHeight},on:{show:e.show_dialog,editRoute:e.editRoute,getcheckbox:e.getcheckbox}}),e._v(" "),a("el-pagination",{staticClass:"console-mt5",attrs:{"current-page":e.cPage,"page-sizes":e.cpageSizes,"page-size":e.cSize,layout:"total, sizes, prev, pager, next",total:e.cTotal},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)])},staticRenderFns:[]}},716:function(e,t,a){function i(e){a(1420)}var n=a(1)(a(1138),a(1604),i,"data-v-2c69f8a9",null);e.exports=n.exports},922:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{multi:{type:String},fields:Array,paramVersion:{type:String,default:function(){return"v2"}},isWithExts:{type:Boolean,default:function(){return!0}}},mounted:function(){"low"===this.$store.state.resolution&&(this.conditionWdith="80px"),this.getDivHeight()},data:function(){var e=this;return{conditionWdith:"85px",a_type:1,a_val:null,fieldValues:this.fields?_.map(this.fields,function(e){return _.extend({value:null},e)}):[],pickerOptions:{shortcuts:[{text:"今日",onClick:function(t){var a=e.recentDate(0),i=e.recentDate(0);t.$emit("pick",[a,i])}},{text:"明日",onClick:function(t){var a=e.recentDate(1),i=e.recentDate(1);t.$emit("pick",[a,i])}},{text:"前后1天",onClick:function(t){var a=e.recentDate(-1),i=e.recentDate(1);t.$emit("pick",[a,i])}},{text:"前后2天",onClick:function(t){var a=e.recentDate(-2),i=e.recentDate(2);t.$emit("pick",[a,i])}},{text:"本月",onClick:function(t){var a=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1),"yy-mm-dd"),i=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1)+864e5*(e.$store.state.daycount-1),"yy-mm-dd");t.$emit("pick",[a,i])}}]},pickerOptionsI:{shortcuts:[{text:"今日",onClick:function(t){var a=e.recentDate(0)+" 00:00:00",i=e.recentDate(0)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"明日",onClick:function(t){var a=e.recentDate(1)+" 00:00:00",i=e.recentDate(1)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"前后1天",onClick:function(t){var a=e.recentDate(-1)+" 00:00:00",i=e.recentDate(1)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"前后2天",onClick:function(t){var a=e.recentDate(-2)+" 00:00:00",i=e.recentDate(2)+" 23:59:59";t.$emit("pick",[a,i])}},{text:"本月",onClick:function(t){var a=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1),"yy-mm-dd")+" 00:00:00",i=e.formatDate((new Date).getTime()-864e5*((new Date).getDate()-1)+864e5*(e.$store.state.daycount-1),"yy-mm-dd")+" 23:59:59";t.$emit("pick",[a,i])}}]}}},methods:{init:function(){this.onSearchButtonClick()},getDivHeight:function(){return this.$refs.formHeight.offsetHeight},onSearchButtonClick:function(){var e=this,t={},a="",i="",n="",l="",s="";if(_.each(e.fieldValues,function(a,i){a.fieldName&&(t[a.fieldName]=a.value instanceof Date?e.formatDate(a.value,"hms"):a.value),a.fieldName,t.dateRange&&(t.builddate_ge_date=e.formatDate(t.dateRange[0],"yy-mm-dd"),t.builddate_le_date=e.formatDate(t.dateRange[1],"yy-mm-dd")),"forbidden_daterange"===a.fieldName&&t.forbidden_daterange&&(t.builddate_ge_date=e.formatDate(t.forbidden_daterange[0],"yy-mm-dd"),t.builddate_le_date=e.formatDate(t.forbidden_daterange[1],"yy-mm-dd"))}),this.$emit("search",this.isWithExts?{exts:t}:t),"daterange"===this.fieldValues[0].type){this.a_val&&(2===this.a_type?s+="balanceprice_ne="+this.a_val:s+="balanceprice="+this.a_val);for(var o=1;o<this.fieldValues.length;o++)t.datehandle&&this.fieldValues[0].value&&(l=this.fieldValues[o].value||"",i+=this.fieldValues[o].fieldName+"="+l+"&",n=this.fieldValues[0].label+"_ge_date="+e.formatDate(t.datehandle[0],"yy-mm-dd")+"&"+this.fieldValues[0].label+"_le_date="+e.formatDate(t.datehandle[1],"yy-mm-dd")+"&",null===t.datehandle[0]&&(l=this.fieldValues[o].value||"",i+=this.fieldValues[o].fieldName+"="+l+"&",n=""));a=n?i+n+s:i+s}if("select"===this.fieldValues[0].type){for(var c=2;c<this.fieldValues.length;c++)l=this.fieldValues[c].value||"",i+=this.fieldValues[c].fieldName+"="+l+"&",t.datehandle&&this.fieldValues[0].value&&(n=this.fieldValues[0].value+"_ge_date="+e.formatDate(t.datehandle[0],"ymdhM")+"&"+this.fieldValues[0].value+"_le_date="+e.formatDate(t.datehandle[1],"ymdhM")+"&");a=i+n}a="&"===a.substring(a.length-1)?a.substring(0,a.length-1):a,this.$emit("searchII",a)},onRestButtonClick:function(){for(var e=0;e<this.fieldValues.length;e++)"forbidden_daterange"===this.fieldValues[e].fieldName||(this.fieldValues[e].value="");this.a_val="",this.$emit("reset"),this.sdate=null,this.edate=null}}}},924:function(e,t,a){t=e.exports=a(656)(!0),t.push([e.i,".inputwidth[data-v-39b0517a]{width:220px}.selectwidth[data-v-39b0517a]{width:91px}.framewidth[data-v-39b0517a]{width:220px}","",{version:3,sources:["F:/pc_project/erp-aluminium/yunerp/src/components/ZLCommonSearch.vue"],names:[],mappings:"AACA,6BACE,WAAa,CACd,AACD,8BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd",file:"ZLCommonSearch.vue",sourcesContent:["\n.inputwidth[data-v-39b0517a] {\n  width: 220px;\n}\n.selectwidth[data-v-39b0517a] {\n  width: 91px;\n}\n.framewidth[data-v-39b0517a] {\n  width: 220px;\n}\n"],sourceRoot:""}])},964:function(e,t,a){var i=a(924);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(657)("7f807ae8",i,!0,{})},965:function(e,t,a){function i(e){a(964)}var n=a(1)(a(922),a(967),i,"data-v-39b0517a",null);e.exports=n.exports},967:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"formHeight"},[a("el-card",{staticClass:"box-card__form console-width-12"},[a("el-form",{staticClass:"filterform cf",attrs:{"label-width":e.conditionWdith},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.onSearchButtonClick(t):null}}},[e._l(e.fieldValues,function(t,i){return a("el-form-item",{key:i,attrs:{label:t.name}},["date"===t.type?a("el-date-picker",{attrs:{align:"right",type:"date",format:"yyyy-MM-dd"},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"daterange"===t.type?a("el-date-picker",{attrs:{type:"daterange",align:"right","picker-options":e.pickerOptions},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"datetimerange"===t.type?a("el-date-picker",{staticClass:"framewidth",attrs:{type:"datetimerange",align:"right",format:"yyyy-MM-dd HH:mm","picker-options":e.pickerOptionsI},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"forbidden_daterange"===t.type?a("el-date-picker",{attrs:{type:"forbidden_daterange",align:"right",readonly:!0,"picker-options":e.pickerOptions},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"select"===t.type?a("el-select",{staticClass:"framewidth",attrs:{clearable:""},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}},e._l(t.label,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1):e._e(),e._v(" "),"select-many"===t.type?a("el-select",{staticClass:"framewidth",attrs:{multiple:"","collapse-tags":"",placeholder:"请选择",clearable:""},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}},e._l(t.label,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1):e._e(),e._v(" "),null===t.type||"string"===t.type?a("el-input",{staticClass:"framewidth",attrs:{placeholder:t.name},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e(),e._v(" "),"checkbox"===t.type?a("el-checkbox",{staticClass:"framewidth",attrs:{label:t.label,"true-label":1},model:{value:t.value,callback:function(a){e.$set(t,"value",a)},expression:"field.value"}}):e._e()],1)}),e._v(" "),"A"===e.multi?a("el-form-item",{attrs:{label:"原单价"}},["A"===e.multi?a("el-input",{staticClass:"inputwidth",model:{value:e.a_val,callback:function(t){e.a_val=t},expression:"a_val"}},[a("el-select",{staticClass:"selectwidth",attrs:{slot:"prepend"},slot:"prepend",model:{value:e.a_type,callback:function(t){e.a_type=t},expression:"a_type"}},[a("el-option",{attrs:{label:"等于",value:1}}),e._v(" "),a("el-option",{attrs:{label:"不等于",value:2}})],1)],1):e._e()],1):e._e(),e._v(" "),a("el-form-item",[a("el-button",{staticClass:"ui-color3",on:{click:e.onSearchButtonClick}},[e._v("查询")]),e._v(" "),a("el-button",{staticClass:"ui-color2",on:{click:e.onRestButtonClick}},[e._v("重置")])],1)],2)],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=95.5607bb49244a8c2c7d07.js.map