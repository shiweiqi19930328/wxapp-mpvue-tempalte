<template>
    <div>
        <!-- 色彩 -->
        <!-- <div class="height-50 primary-bg"></div>
        <div class="height-50 primary-linear"></div>
        <div class="height-50 warn-bg"></div>
        <div class="height-50 success-bg"></div> -->

        <!-- loading -->
        <!-- <page-loading></page-loading> -->

        <!-- 列表底部loadmore -->
        <loadmore></loadmore>
        <loadmore :no-data="true"></loadmore>

        <!-- tab切换 -->
        <tabbar :tabs="tabsArr"></tabbar>
    </div>
</template>

<script>
import pageLoading from '@/components/page-loading'
import loadmore from '@/components/loadmore'
import tabbar from '@/components/tabbar'
export default {
    components: {
        pageLoading,
        loadmore,
        tabbar
    },
    data () {
        return {
            tabsArr :['tab-1','tab-2','tab-3','tab-4','tab-5']
        }
    },
    computed:{
        
    },
    watch : {
        
    },
    
    methods: {
        
    },
    onPullDownRefresh(){
        
    },
    created(){
        
    },
    onLoad(){
        
    },
    onShow(){
        
    },
    mounted () {
        
    },
}
</script>

<style lang="less">
    .height-50{
        height: 50px;
    }
</style>
