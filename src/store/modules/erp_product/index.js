import mutations from './mutations'
import actions from './actions'

export default {
    namespaced: true,
    state: {
        // 胶条类型数组
        pvcTypeCode: [],
        pvcType: []
    },
    getters: {},
    mutations,
    actions,
}
