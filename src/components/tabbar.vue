<template>
    <div class="tab-bar flex-center-between">
        <div class="tab-bar-item" 
            v-for="(item,index) in tabs" :key="index"
        >
            <div class="title">
                {{item}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        tabs:{
            type : Array,
            default(){
                return []
            }
        }
    },
    data () {
        return {    
            tabs : []
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
        
    },

    created () {
        console.log(this.tabs)      
    },
    mounted () {
        
    },
    onLoad(){
        
    },
}
</script>
<style scoped lang="less">
    // tab切换样式
    .tab-bar{
        height: 38px;
        font-size: 13px;
        font-weight: bold;
        color: #4a4a4a;
        display : flex;
        justify-content : space-between;
        border-bottom:1px solid #dbdade;
        background-color: #fff;
        &-item{
            height : 100%;
            line-height: 38px;
            position: relative;
        }
        &-item-active{
            color: #00ceb5;
        }
        &-item-active::after{
            content : '';
            position: absolute;
            bottom: -1px;
            height : 3px;
            width: 100%;
            border-radius:9px;
            background: linear-gradient(to  right,#00c5c5,#00ea84);
            border-radius: 9px;
        } 
    }
</style>
