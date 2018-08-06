<template>
    <div>
        <!-- 色彩 -->
        <div class="height-50 primary-bg"></div>
        <div class="divide"></div>
        <div class="height-50 primary-linear"></div>
        <div class="height-50 warn-bg"></div>
        <div class="height-50 warn-linear"></div>
        <div class="height-50 success-bg"></div>
        <div class="height-50 error-bg"></div>

        <!-- 按钮 -->
        <button class="btn default">常规</button>
        <button class="btn primary">主题色</button>
        <button class="btn warn">警告</button>
        <button class="btn success">成功</button>
        <button class="btn error">失败</button>

        <!-- loading -->
        <!-- <page-loading></page-loading> -->

        <!-- 列表底部loadmore -->
        <loadmore></loadmore>
        <loadmore :no-more-data="true"></loadmore>
        <loadmore :no-data="true"></loadmore>

        <!-- search-bar -->
        <!-- 内容需根据实际情况来 -->
         <!-- <searchbar></searchbar> -->
         
        <!-- tab切换 -->
        <tabs-bar :default-size="5" :options="options" @on-change="tabChange" v-model="tab1Active"></tabs-bar>
        <tabs-bar :default-size="5" :options="options2" @on-change="tabChange" v-model="tab2Active"></tabs-bar>

        <!-- 弹框样式 -->
        <button class="btn primary" @click="showModal">点击弹框</button>
        <div class="modal" :class="modalShow?'show':''">
            <div class="mask" @click="hideModal" @touchmove.stop></div>
            <div class="modal-container" @touchmove.stop>
                <div class="content">我是弹框内容</div>
                <div class="footer">
                    <div class="cancel" @click="hideModal">取消</div>
                    <div class="confirm" @click="hideModal">确认</div>
                </div>
            </div>
        </div>

        <div class="divide"></div>
        <!-- 箭头 -->
        <div class="flex-center-between cell">
            <div class="">右箭头</div>
            <div class="arrow right"></div>
        </div>
        <div class="flex-center-between cell">
            <div class="">左箭头</div>
            <div class="arrow left"></div>
        </div>
        <div class="flex-center-between cell">
            <div class="">上箭头</div>
            <div class="arrow up"></div>
        </div>
        <div class="flex-center-between cell">
            <div class="">下箭头</div>
            <div class="arrow down"></div>
        </div>
        <div class="ellipsis">单行超出省略单行超出省略单行超出省略单行超出省略单行超出省略单行超出省略单行超出省略</div>
        <div class="ellipsis-l2">两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略两行超出省略</div>
    </div>
</template>

<script>
import pageLoading from '@/components/page-loading'
import loadmore from '@/components/loadmore'
import tabsBar from '@/components/tabs-bar'
import searchbar from '@/components/searchbar'
export default {
    components: {
        pageLoading,
        loadmore,
        tabsBar,
        searchbar
    },
    data () {
        return {
            options : ['tab-1','tab-2','tab-3','tab-4','tab-5'],
            tab1Active : 1,
            options2 : ['tab-1','tab-2','tab-3','tab-4','tab-5','tab-1','tab-2','tab-3','tab-4','tab-5'],
            tab2Active : 5,
            modalShow : false
        }
    },
    computed:{
        
    },
    watch : {
        tab1Active(value){
            console.log(value)
        }
    },
    
    methods: {
        tabChange(active){
            console.log(active)
        },
        showModal(){
            this.modalShow = true
        },
        hideModal(){
            this.modalShow = false
        }
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
    @import "../../assets/styles/common/_base.less";
    .height-50{
        height: 50px;
    }
    .cell{
        padding: 20px 10px;
        border-bottom: 1rpx solid @border-color;
        position: relative;
    }
</style>
