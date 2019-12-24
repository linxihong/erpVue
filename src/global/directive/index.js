//为true则不控制权限，页面资源完全展示
import Vue from 'vue'
const ifCloseAuth = false;
/**
 * @date 2017/11/22
 * @desc 权限控制 目前用于样式控制
 **/
export const auth = {
    twoWay: true,
    bind: function (el, binding, vnode, oldVnode) {
        /*var _result = true,
            whitelist = {
                'zh_add':true,
            },
            blacklist = {
                'zh_add':true,
            },
            _authlist = {},
            value=(binding.value).toLowerCase();

        //console.log('_als',sessionStorage.getItem('_als'));

        if ( (_authlist[value] != undefined && _authlist[value] == true) || whitelist[value] == true) {
            _result = true;
        }

        if(blacklist[value] != undefined &&blacklist[value] == true){
            _result = false;
        }
        console.log('auth',el,_result,binding.value);
        if (_result == false&&ifCloseAuth==false) {
            el.outerHTML = '';
        }*/
        if (binding.value==false&&el.className.indexOf('btnReadonly')<0){
            el.className += ' btnReadonly'
        }else if (binding.value!=false){
            el.className = el.className.replace( 'btnReadonly','')
        }
    },
    inserted: function (el, binding, vnode, oldVnode) {
        //console.log("tab inserted")
    },
    update: function (el, binding, vnode, oldVnode) {
        //console.log("tab update",el.dataset,binding.value)
    },
    componentUpdated: function (el, binding, vnode, oldVnode) {
        //console.log("tab componentUpdated",el,binding.value,el.className.indexOf('btnReadonly'))
        if (binding.value==false&&el.className.indexOf('btnReadonly')<0){
            el.className += ' btnReadonly'
        }else if (binding.value!=false){
            el.className = el.className.replace( 'btnReadonly','')
        }
    },
    unbind: function (el, binding, vnode, oldVnode) {
        //console.log("tab inserted")
    },
}

const Isempty = {};
