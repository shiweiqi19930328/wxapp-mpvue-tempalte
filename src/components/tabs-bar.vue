<!-- 小程序限制，复杂的传值自定义组件功能有限，只能做静态的组件了，也罢，也能起到简化代码逻辑的作用 -->
<template>
    <scroll-view class="tab-bar-scroll-view" scroll-x :scroll-left="scrollLeft" scroll-with-animation v-if="options">
        <radio-group  @change="tabChange" class="tab-bar flex-center-between" :style="{'width':tabbarWidth}">
            <label class="tab-bar-item" v-for="(item,index) in options" :key="index" :class="value == index ? 'active' : ''">
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
        },
        value : {
            type : [Number,String],
            default : 0
        },
        width:{
            type: [Number,String],
            default : 750
        }
    },
    data () {
        return {    
            
        }
    },
    computed:{
        // 从vuex中导出屏幕宽度(px)
        ...mapGetters([
            'windowWidth',
            'pixelRatio'
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
            return this.width/this.size*this.options.length+'rpx'
        },
        // 调整tabbar位置
        scrollLeft(){
            var index = this.value*1 + 1;
            var centerIndex = this.size/2;
            // px单位不固定，需要根据设备宽度来计算，计算出一个tab-item所占宽度
            var perWidth = this.width/this.pixelRatio/this.size;
            if(index > centerIndex){
                return Math.floor(index-centerIndex)*perWidth
            }else{
                return 0
            }
        }
    },
    components: {
        
    },
    methods: {
        // 修改active的值，并且仿今日头条效果，调整tabbar位置
        tabChange(e){
            // 修改active的值
            var active = e.mp.detail.value;
            this.$emit('on-change',active);
            this.$emit('input',active);
        },
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
