webpackJsonp([137],{1082:function(t,n,i){function s(t){i(1467)}var a=i(1)(i(1168),i(1662),s,"data-v-57293616",null);t.exports=a.exports},1168:function(t,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={props:["wrapHeight"],data:function(){return{items:[]}},watch:{"$store.state.noticnum":"getlist"},mounted:function(){},methods:{init:function(){},getlist:function(){var t=this;this.fetch("/message/inbox/allByPage",{inbox:{status:0,type:"xx"}}).then(function(n){t.items=n.data.list})}}}},1336:function(t,n,i){n=t.exports=i(656)(!0),n.push([t.i,".point-div[data-v-57293616]{margin-top:10px;margin-left:10px;display:flex;justify-content:space-between}.point-div .spanII[data-v-57293616]{margin-right:10px}.heigth-div[data-v-57293616]{height:95%;overflow-y:auto}","",{version:3,sources:["F:/pc_project/erp-aluminium/yunerp/src/page/erp_pc/erp_ph/ph_block/my_point.vue"],names:[],mappings:"AACA,4BACE,gBAAiB,AACjB,iBAAkB,AAClB,aAAc,AACd,6BAA+B,CAChC,AACD,oCACE,iBAAmB,CACpB,AACD,6BACE,WAAY,AACZ,eAAiB,CAClB",file:"my_point.vue",sourcesContent:["\n.point-div[data-v-57293616] {\n  margin-top: 10px;\n  margin-left: 10px;\n  display: flex;\n  justify-content: space-between;\n}\n.point-div .spanII[data-v-57293616] {\n  margin-right: 10px;\n}\n.heigth-div[data-v-57293616] {\n  height: 95%;\n  overflow-y: auto;\n}\n"],sourceRoot:""}])},1467:function(t,n,i){var s=i(1336);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i(657)("1c340395",s,!0,{})},1662:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement;t._self._c;return t._m(0)},staticRenderFns:[function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("div",{staticClass:"heigth-div scrollBar",staticStyle:{"{height":"wrapHeight+'px'}"}},[i("div",{staticClass:"point-div"},[i("span",{staticClass:"spanI"},[t._v("185号车卸料超时两小时")]),t._v(" "),i("span",{staticClass:"spanII"},[t._v("2018-3-27 9:30")])]),t._v(" "),i("div",{staticClass:"point-div"},[i("span",{staticClass:"spanI"},[t._v("175号车回站超时两小时")]),t._v(" "),i("span",{staticClass:"spanII"},[t._v("2018-3-27 14:30")])]),t._v(" "),i("div",{staticClass:"point-div"},[i("span",{staticClass:"spanI"},[t._v("162号运输超时两小时")]),t._v(" "),i("span",{staticClass:"spanII"},[t._v("2018-3-27 16:30")])])])}]}}});
//# sourceMappingURL=137.9402553475eecab19ef3.js.map