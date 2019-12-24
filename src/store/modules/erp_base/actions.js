export default {
    fetchInactive({state, commit}, that) {
        // inactive是静态的 所以不做ajax异步操作
        if (state.inactive.length <= 0) {
            commit('setInactive', [
                {
                    label: '启用',
                    value: 0
                },
                {
                    label: '失效',
                    value: 1
                },
            ])
        }
    },
    fetchIsBaseUom({state, commit}, that) {
        if (state.isBaseUom.length <= 0) {
            commit('setIsBaseUom', [
                {
                    label: '是',
                    value: 1
                },
                {
                    label: '否',
                    value: 0
                }
            ])
        }
    },
    fetchSaleOrg({state, commit}, that) {
        // if (state.saleOrg.length <= 0) {
            that.getAjax('basedata/Org/Company/selectByQueryModel?isSaleOrg=1')
                .then(res => {
                    that.mixinEleMessage(res, (res) => {
                        commit('setSaleOrg', res.data.list)
                    }, () => {}, {noSuccMsg: true, noFailMsg: true})
                })
        // }
    },
    fetchPlantOrg({state, commit}, that) {
        // if (state.plantOrg.length <= 0) {
            that.getAjax('basedata/Org/Company/selectByQueryModel?isPlantOrg=1')
                .then(res => {
                    that.mixinEleMessage(res, (res) => {
                        commit('setPlantOrg', res.data.list)
                    }, () => {}, {noSuccMsg: true, noFailMsg: true})
                })
        // }
    },
}