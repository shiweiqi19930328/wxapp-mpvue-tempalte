<!-- logo扫光效果loading -->
<template>
    <div class="loadmore flex-center-center">
        <div v-if="noData">{{noDataText}}</div>
        <div v-else-if="noMoreData">{{noMoreDataText}}</div>
        <block v-else>
            <div class="load-more-loading"></div>
            <div class="load-more-text">{{loadingText}}</div>
        </block>
    </div>
</template>

<script>
export default {
    props:{
        'loading':{
            type : Boolean,
            default : true
        },
        'loading-text':{
            type : String,
            default : '数据加载中...'
        },
        'no-more-data':{
            type : Boolean,
            default : false
        },
        'no-more-data-text':{
            type : String,
            default : '暂无更多数据'
        },
        'no-data':{
            type : Boolean,
            default : false
        },
        'no-data-text':{
            type : String,
            default : '暂无数据'
        },
    },
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
    @keyframes spin {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .loadmore{
        padding: 20px 0;
        margin: 0 auto;
        color: #454545;
        font-size: 14px;
        .load-more-loading{
            margin-right:12px;
            width:14px;
            height:14px;
            background:0 0;
            border-radius:50%;
            border:2px solid #e9eaec; /**圈圈颜色的宽度，可根据实际调整**/
            border-color:#e9eaec #e9eaec #e9eaec #2d8cf0;/**圈圈颜色，可根据实际调整**/
            animation:spin .6s linear infinite;/**一圈的速度，可根据实际调整**/
        }
    }
</style>
