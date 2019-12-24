import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import moduleBase from './modules/erp_base'
import moduleProduct from './modules/erp_product'

Vue.use(Vuex);

const state = {
    systemid: sessionStorage.getItem('systemid') != undefined ? parseInt(sessionStorage.getItem('systemid')) : '',
    userInfo: {},
    navtaglist: [],
    ItemPermissions: "",
    dataSchedule: "",
    ChildrenItemPermissions: {},
    navSecondChildren: sessionStorage.getItem('_sn') ? JSON.parse(decodeURIComponent(sessionStorage.getItem('_sn'))) : {},
    username: sessionStorage.getItem('_um') ? JSON.parse(sessionStorage.getItem('_um')) : null,
    sidenavlist: sessionStorage.getItem('sidenavlist') ? JSON.parse(sessionStorage.getItem('sidenavlist')) : null,
    activenavItem: sessionStorage.getItem('activenavItem') ? JSON.parse(sessionStorage.getItem('activenavItem')) : {},
    resolution: sessionStorage.getItem('resolution'),
    noticnum: null,
    returnstatus: 'success',
    isShowPage: true,
    pageHeight: 62,
    masterHeight: null,
    screenWid: document.body.clientWidth,
    screenHei: document.body.clientHeight,
    isShowDetailBan: false,
    browser: window.innerHeight,
    weekData: [], //返回日期
    weekText: 1,  //点击本周
    weekDataI: [],
    weekTextI: 1,
    weekDataII: [],
    //订单库存
    order_Code:'',
    //订单仓库
    storageCode:'',
    //客户料框
    order_product:'',
    //订单库存
    order_inventory:'',
    //添加企业客户
    clientEnterprise: {},
    weekTextII: 1,
    weekTextIII: 1,
    weekTextIV: 1,
    weekTextV: 1,
    JTweekTextI: 1, //集团监控点击日
    // JTweekTextII:2, //集团监控点击月
    JTweekTextIII: 2, //集团监控点击月，应收账信息的变量
    JTweekTextIV: 2, //集团监控点击月，成本信息的变量
    JTweekTextIIV: 2, //集团监控点击月，利润信息的变量
    regionName: '狮山镇', //区域名字
    copyForm: {},
    copy: 0,
    activeName: 'normal',
    daycount: (new Date(new Date().getYear(), new Date().getMonth() + 1, 0)).getDate(),
    returnData: [],
    //权限列表
    deletesList: [],
    updatesList: [],
    updatesLastList: [],
    deletesLastList: [],
    //权限父级
    deleteParentsList: [],
    updateParentsList: [],
    //数据权限
    permissionTableData: [],
    deleteDataList: [],
    updateDataList: []
};

const getters = {
    //当前导航子导航
    ChildrenItemPermissions(state, data) {
        return state.ChildrenItemPermissions;
    },
    //导航数据
    getSideNavlist(state, data) {
        return state.sidenavlist ? state.sidenavlist : null;
    },
    //登陆信息
    getUserinfo(state, data) {
        if (sessionStorage.getItem('_u')) {
            state.userInfo = JSON.parse(sessionStorage.getItem('_u'));
        }
        //console.log(state.userInfo)
        return state.userInfo;
    },
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        base: moduleBase,
        product: moduleProduct
    }
})
