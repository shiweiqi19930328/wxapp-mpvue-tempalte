<template>
    <block>
        <div class="search-bar flex-center-between">
            <div class="search-bar-item">
                <div class="search-bar-item-title flex-center" @click="toggle(1)">
                    <div class="font-bold">{{sort[form.sort]}}</div>
                    <div :class="active == 1 ? 'down' : 'up'" class="arrow"></div>
                </div>
                <div class="dropdown" v-show="active == 1" @touchmove.stop>
                    <radio-group  @change="radioChange1">
                        <label class="dropdown-item" :class="form.sort == index ? 'active' : ''" v-for="(item,index) in sort" :key="index">
                            <radio :value="index" v-show="false"/>{{item}}
                        </label>
                    </radio-group>
                </div>
            </div>
            <div class="search-bar-item">
                <div class="search-bar-item-title flex-center" @click="toggle(2)">
                    <div class="font-bold">{{form.age == '全部' ? '年龄筛选' : age[form.age]}}</div>
                    <div :class="active == 2 ? 'down' : 'up'" class="arrow"></div>
                </div>
                <div class="dropdown" v-show="active == 2" @touchmove.stop>
                    <radio-group  @change="radioChange2">
                        <label class="dropdown-item" :class="form.age == '全部' ? 'active' : ''">
                            <radio value="全部" v-show="false"/>全部
                        </label>
                        <label class="dropdown-item" :class="form.age == index ? 'active' : ''" v-for="(item,index) in age" :key="index">
                            <radio :value="index" v-show="false"/>{{item}}
                        </label>
                    </radio-group>
                </div>
            </div>
            <div class="search-bar-item">
                <div class="search-bar-item-title flex-center" @click="toggle(3)">
                    <div class="font-bold">{{form.time == '' ? '全部日期' : form.time}}</div>
                    <div :class="active == 3 ? 'down' : 'up'" class="arrow"></div>
                </div>
                <div class="dropdown font-13" v-show="active == 3">
                    <calendar 
                        calendar-style="calendar-self" 
                        header-style="calendar-header-self" 
                        board-style="calendar-board-self" 
                        weeks-type="cn"
                        cell-size="30" 
                        :days-color="days_style" 
                        @dayClick="dayClick"
                        @prevMonth="monthChange" @dateChange="monthChange"  @nextMonth="monthChange"
                     />
                    <div class="allTime" @click="allTime">全部日期</div>
                    <div class="week-day-con flex-center-between">
                        <div class="color-pink">周日</div>
                        <div>周一</div>
                        <div>周二</div>
                        <div>周三</div>
                        <div>周四</div>
                        <div>周五</div>
                        <div class="color-pink">周六</div>
                    </div>
                </div>
            </div>
        </div>  
        <div class="zan-dialog--mask mask" v-show="active" @click="hide" @touchmove.stop></div>
    </block>
</template>
<script>
export default{
    props:{
    
    },
    data(){
        return {
            active : '',
            sort : [],
            age : [],
            form : {},
            currentDay : {
                day : new Date().getDate()
            },
            currentMonth : {
                currentYear : new Date().getFullYear(),
                currentMonth : new Date().getMonth()+1
            },
        }
    },
    computed:{
        days_style(){
            var days_style = [];
            var year = new Date().getFullYear();
            var month = new Date().getMonth()+1;
            var day = new Date().getDate();
            var currentMonth = this.currentMonth;
            var currentDay = this.currentDay;
            for(var i = 0;i<=31;i++){
                days_style.push({
                     month: 'current', day: i, color: '#2e2e2e'
                })
                // 今日
                if(currentMonth.currentYear == year && currentMonth.currentMonth == month && i == day){
                    days_style[i] = {
                         month: 'current', day: i, color: '#50e3c2'
                    }
                }

                //当前选中的日期 
                if(currentDay.year == currentMonth.currentYear && currentDay.month == currentMonth.currentMonth && currentDay.day == i){
                    days_style[i] = {
                         month: 'current', day: i, color: '#fff',background: 'linear-gradient(to bottom right, #00c5c5 , #00ea84)'
                    }
                }
            }
            return days_style
        }
    },
    methods: {
        toggle(index){
            if(this.active == index){
                this.active = '';
            }else{
                this.active = index;
            } 
        },
        hide(){
            this.active = '';
        },
        radioChange1(e){
            this.form = {
                ...this.form,
                sort:e.mp.detail.value
            };
            this.active = '';
        },
        radioChange2(e){
            this.form = {
                ...this.form,
                age:e.mp.detail.value
            };
            this.active = '';
        },
        async getSelect(){
            var {sort,age} = await this.$http.get('/api/product/search-bar');
            this.sort = sort;
            this.age = age; 
        },
        dayClick(e){
            var currentDay = e.mp.detail;
            this.currentDay = currentDay;
            var time = `${currentDay.year}-${currentDay.month}-${currentDay.day}`;
            this.form = {
                ...this.form,
                time
            };
            this.active = '';
        },
        monthChange(e){
            this.currentMonth = e.mp.detail
        },
        allTime(){
            this.currentDay = {
                day : new Date().getDate()
            };
            this.form.time = '';
            this.active = '';
        }
    },
    created(){
        this.getSelect()
    },
    onLoad(){
        // 初始就会触发外部搜索
        this.form = {
            sort : 0,
            age : '全部',
            time : ''
        };
        this.active = '';
        this.currentDay = {
            day : new Date().getDate()
        };
        this.currentMonth = {
            currentYear : new Date().getFullYear(),
            currentMonth : new Date().getMonth()+1
        }
    },
    onUnload(){

    },
    watch :{
        form:{
            deep : true,
            handler(){
                this.$emit('on-change',this.form)
            }
        }
    }
}
</script>
<style lang="less">
    .search-bar{
        position: fixed;
        z-index: 9;
        top: 0;
        width: 100%;
        height: 38px;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        font-size: 13px;
        color: #2e2e2e;
        background-color: #fff;
        &-item{
            padding-right: 15px;
            position: relative;
            height: 100%;
            &-title{
                line-height: 38px;
                .arrow{
                    margin-left: 4px;
                }
            }
            .dropdown{
                position: fixed;
                top: 38px;
                width: 100%;
                left: 0;
                right: 0;
                background-color: #fff;
                &-item{
                    padding: 15px 20px;
                    border-bottom: 1rpx solid #dbdade;
                    display: block;
                    &.active{
                        color: #00ceb5;
                    }
                }
            }
            .allTime{
                position: fixed;
                top: 39px;
                width: 160px;
                height : 34px;
                line-height: 34px;
                padding-left : 20px;
                box-sizing : border-box;
                left: 0;
                right: auto;
                background-color: transparent;
                color : #fff;
                font-size : 13px;
                font-weight: bold;
            }
            .week-day-con{
                position: fixed;
                top: 73px;
                height : 30px;
                line-height: 30px;
                padding-left : 20px;
                padding-right: 20px;
                box-sizing : border-box;
                left: 0;
                right: 0;
                background-color: #fff;
                color : #aeacad;;
                font-size : 12px;
                font-weight: bold;
                border-bottom: 1rpx solid #dbdade;
                .color-pink{
                    color: #ff708f;
                }
            }
        }  
    }
    .calendar-self{
        
    }
    .calendar-header-self{
        color: #fff;
        background: linear-gradient(to  right, #00c5c5 , #00ea84);
        height: 34px;
        margin: 0px!important;
        padding-left:160px;
        .cwj-icon{
            background:#ffffff;
            width:19px;
            height:19px;
            border-radius:100%;
        }
    }
    .calendar-board-self{
        font-size:14px;   
        color:#2e2e2e;
        padding-left: 5px;
        padding-right: 5px;
    }
    .mask{
        z-index: 8;
        display:block;
    }
</style>