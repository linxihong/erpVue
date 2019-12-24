export default {
    //子导航权限处理
    handleChildrenItemPermissions (state,fields) {
        if(fields.type=='clean'){
            state.ChildrenItemPermissions = {};
        }else{
            fields.data?state.ChildrenItemPermissions[fields.type] = fields.data:'';
        }

    },
    setUsername (state,data) {
        sessionStorage.setItem('_um',JSON.stringify(data));
        state.username=data;
    },
    setSidenavlist (state,data) {
        state.sidenavlist=data;
    },
    setSystemid (state,data) {
        state.systemid=data;
    },
    setUserinfo (state,data) {
        //console.log(data)
        state.userInfo=data;
    },
}
