const system = {
    state: {
        model : {},
    },
    getters : {
    	windowWidth(state){
    		return state.model.windowWidth
    	}
    },
    mutations: {
        saveModel(state,model){
            state.model = model
        },
    }
}
export default system