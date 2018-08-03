<script>
import { mapMutations } from 'vuex'
export default {
	methods: {
	    ...mapMutations([
	      	'saveModel'
	    ])
	},
    async created(){
    	// 全局保存设备信息
    	var model = await this.$wx.getSystemInfo();
    	this.saveModel(model)
    }
}
</script>

<style lang="less">
    @import "./assets/styles/app.less";
</style>
