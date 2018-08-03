<!-- 小程序限制，复杂的传值自定义组件功能有限，只能做静态的组件了，也罢，也能起到简化代码逻辑的作用 -->
<template>
    <scroll-view class="tab-bar-con" scroll-x :scroll-left="scrollLeft" scroll-with-animation v-if="options">
        <radio-group  @change="tabChange" class="tab-bar flex-center-between" :style="{'width':tabbarWidth}">
            <label class="tab-bar-item" v-for="(item,index) in options" :key="index" :class="active == index ? 'active' : ''">
                <radio :value="index" v-show="false"/>
                <div class="title">
                    {{item}}
                </div>
            </label>
        </radio-group>
    </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name:'tabs-bar',
    props:{
        // 组件外部可以控制一行显示多少个，但是如果tabs数量少于它，就是取tabs的长度
        defaultSize : {
            type : Number,
            default : 5
        },
        options : {
            type : Array,
            default(){
                return []
            }
        }
    },
    data () {
        return {    
            active : 0,
            scrollLeft:0
        }
    },
    computed:{
        // 从vuex中导出屏幕宽度(px)
        ...mapGetters([
            'windowWidth'
        ]),
        // 最终的size
        size(){
            if(this.options.length < this.defaultSize){
                return this.options.length
            }else{
                return this.defaultSize
            }
        },
        // rpx单位是固定的，任何设备宽度都是750rpx
        tabbarWidth(){
            return 750/this.size*this.options.length+'rpx'
        }
    },
    components: {
        
    },
    methods: {
        // 修改active的值，并且仿今日头条效果，调整tabbar位置
        tabChange(e){
            // 修改active的值
            this.active = e.mp.detail.value;
            this.$emit('on-change',this.active);

            // 调整tabbar位置
            var index = this.active*1 + 1;
            var centerIndex = this.size/2;
            // px单位不固定，需要根据设备宽度来计算，计算出一个tab-item所占宽度
            var perWidth = this.windowWidth/this.size;
            if(index > centerIndex){
                this.scrollLeft = Math.floor(index-centerIndex)*perWidth
            }else{
                this.scrollLeft = 0
            }
        }
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
    @import "../assets/styles/common/_base.less";
    // tab切换样式
    .tab-bar{
        height: 38px;
        font-size: 13px;
        font-weight: bold;
        color: #4a4a4a;
        display : flex;
        justify-content : space-between;
        border-bottom:1px solid @border-color;
        background-color: #fff;
        padding: 0 10px;
        box-sizing: border-box;
        &-item{
            height : 100%;
            line-height: 38px;
            position: relative;
        }
        .active{
            color: @primary-color;
            &::after{
                content : '';
                position: absolute;
                bottom: -1px;
                height : 3px;
                width: 100%;
                border-radius:9px;
                .bg-linear();
            } 
        }
    }
</style>
