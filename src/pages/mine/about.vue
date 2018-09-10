<template>
    <div v-if="loaded">
        <wxParse :content="content"></wxParse>
    </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
export default {
    data () {
        return {    
            content : '',
            loaded : false
        }
    },

    components: {
        wxParse
    },

    methods: {
        async getData(){
            this.showLoading();
            var {describe} =  await this.$http.post('/api/product/aboutus');
            this.loaded = true;
            this.content = describe;
            this.hideLoading();
        }
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        if(!this.content){
            this.getData()
        }
        
    },
}
</script>

<style scoped lang="less">
    @import url("~mpvue-wxparse/src/wxParse.css");
</style>
