import mutations from './mutations'
import actions from './actions'

export default {
    namespaced: true,
    state: {
        saleOrg: [],
        plantOrg: [],
        inactive: [
            {
                label: '启用',
                value: 0
            },
            {
                label: '失效',
                value: 1
            },
        ],
        isBaseUom: [
            {
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 0
            }
        ]
    },
    getters: {},
    mutations,
    actions,
}
