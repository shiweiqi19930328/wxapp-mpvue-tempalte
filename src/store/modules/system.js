const system = {
    state: {
        model : {},
    },
    getters : {
    	windowWidth(state){
    		return state.model.windowWidth
    	},
        pixelRatio(state){
            return state.model.pixelRatio
        },
        isIphoneX(state){
            return state.model.model.indexOf('iPhone X') > -1
        }
    },
    mutations: {
        saveModel(state,model){
            state.model = model
        },
    }
}
export default system