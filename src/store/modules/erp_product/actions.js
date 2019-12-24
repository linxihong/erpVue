export default {
    fetchPvcType({state, commit}, that) {
        // TODO：很危险 如果已经获取了数组但是在新增页面新增了1个项目 那么就不会再次拿数据 但是后台数据已经+1
        // if (state.pvcType.length <= 0) {
            that.getAjax('basedata/Mat/PvcType/selectByQueryModel')
                .then(res => {
                    that.mixinEleMessage(res, (res) => {
                        commit('setPvcType', res.data.list)
                    }, () => {}, {noSuccMsg: true})
                })
        // }
    }
}