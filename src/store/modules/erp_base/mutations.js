export default {
    'setInactive' (state, payload) {
        // inactive是静态的 所以不做任何动作
        state.inactive = payload
    },
    'setIsBaseUom' (state, payload) {
        state.isBaseUom = payload
    },
    'setPlantOrg' (state, payload) {
        state.plantOrg = payload
    },
    'setSaleOrg' (state, payload) {
        state.saleOrg = payload
    }
}