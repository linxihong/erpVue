webpackJsonp([164],{1179:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e(809);e(884),e(913),e(881),e(914),a.default={data:function(){return{empnameData:[],orderamountsData:[],sendamountsData:[],percentData:[],wrapHeight:189,wrapWidth:525}},mounted:function(){this.init(),this.getDivHeight()},watch:{"$store.state.weekDataI":"getlist"},methods:{init:function(){this.getlist()},getDivHeight:function(){this.wrapHeight=this.$refs.wrapHeight.offsetHeight+40,this.wrapWidth=this.$refs.wrapHeight.offsetWidth},getlist:function(){var t=this;this.fetch("/mktmfc/forms/getteamranking?datetype="+this.$store.state.weekTextI,{}).then(function(a){200===a.status&&(t.empnameData=a.data.empnamelist,t.orderamountsData=a.data.orderamountslist.map(function(t){return(t/1e4).toFixed(2)}),t.sendamountsData=a.data.sendamountslist.map(function(t){return(t/1e4).toFixed(2)}),t.percentData=a.data.percentlist)}).then(function(){t.initEchart(),t.setEchart(t.empnameData,t.orderamountsData,t.sendamountsData,t.percentData)})},initEchart:function(){this.bar_chart=i.init(this.$refs.bar_chart)},setEchart:function(t,a,e,i){this.bar_chart.setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{data:["计划额","销售额","完成率"]},grid:{left:"10%",bottom:"25%",containLabel:!0},xAxis:[{type:"category",data:t,axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",name:"万(元)"},{type:"value",name:"",max:200,min:0,interval:40,axisLabel:{formatter:"{value} %"}}],series:[{name:"计划额",type:"bar",itemStyle:{normal:{color:"#cfe8dc",shadowColor:"rgba(0, 0, 0, 0.5)",shadowBlur:10}},silent:!0,barWidth:"30%",barGap:"-150%",data:a},{name:"销售额",type:"bar",itemStyle:{normal:{color:"#008ae0",shadowColor:"rgba(0, 0, 0, 0.5)",shadowBlur:10}},barWidth:"30%",data:e},{name:"完成率",type:"line",yAxisIndex:1,lineStyle:{normal:{width:3,shadowColor:"rgba(0,0,0,0.4)",shadowBlur:10,shadowOffsetY:10}},data:i}]})}}}},1357:function(t,a,e){a=t.exports=e(656)(!0),a.push([t.i,".wrap-div[data-v-728f53c5]{display:flex;height:100%}","",{version:3,sources:["F:/pc_project/erp-aluminium/yunerp/src/page/erp_pc/erp_ph/ph_block/team_rank.vue"],names:[],mappings:"AACA,2BACE,aAAc,AACd,WAAa,CACd",file:"team_rank.vue",sourcesContent:["\n.wrap-div[data-v-728f53c5] {\n  display: flex;\n  height: 100%;\n}\n.bar-chart[data-v-728f53c5] {\n  /*width: 750px;*/\n  /*height: 300px;*/\n}\n"],sourceRoot:""}])},1488:function(t,a,e){var i=e(1357);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);e(657)("fdde3f6e",i,!0,{})},1549:function(t,a,e){function i(t){e(1488)}var n=e(1)(e(1179),e(1692),i,"data-v-728f53c5",null);t.exports=n.exports},1692:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{ref:"wrapHeight",staticClass:"wrap-div"},[e("div",{ref:"bar_chart",staticClass:"bar-chart",style:{width:t.wrapWidth+"px",height:t.wrapHeight+"px"}})])},staticRenderFns:[]}}});
//# sourceMappingURL=164.d0071fb58b25b22de788.js.map