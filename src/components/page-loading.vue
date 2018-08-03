<!-- logo扫光效果loading -->
<template>
    <div class="loading flex-center-center">
        <div class="logo-con">
            <img src="/static/images/color-logo.png"  class="logo" mode="aspectFit"/>
        </div>
    </div>
</template>

<script>
export default {
    name:'page-loading',
    data () {
        return {    
            
        }
    },
    computed:{
        
    },
    components: {
        
    },

    methods: {
        
    },

    created () {
               
    },
    mounted () {
        
    },
    onLoad(){
        
    },
}
</script>
<style scoped lang="less">
    @keyframes loading{
        from{
            left: -100px; top: 0;
        }
        to{
            left: 100px; top: 100px;
        }
    }
    .loading{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .logo-con{
            position:relative;
            &:before{
                content:"";
                position: absolute;
                width: 145px;
                height: 12px; /**光标的宽度，可根据实际调整**/
                background-color: rgba(255,255,255,.5);
                transform: rotate(-45deg);
                animation: loading 1.5s ease-in  infinite
            }
            .logo{
                width: 100px;
                height: 100px;
            }
        }
    }
</style>
