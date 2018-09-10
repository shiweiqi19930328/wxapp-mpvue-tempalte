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
            if(state.model.model){
                return state.model.model.indexOf('iPhone X') > -1
            }else{
                return false
            }
        }
    },
    mutations: {
        saveModel(state,model){
            state.model = model
        }
    }
}
export default system