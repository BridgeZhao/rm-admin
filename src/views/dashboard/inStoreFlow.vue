<template>
    <div class="app-container" style="background:none">
        <div class="top">
            <div style="width:120px;">
                <label-view labelFather="进店客流统计"></label-view>
            </div>
           <div style="width:50%;margin-left:10px;">
                <el-radio-group v-model="radio" size="mini">
                    <el-radio-button label="图形报表" class="radioBtn"></el-radio-button>
                    <el-radio-button label="数据报表" class="radioBtn"></el-radio-button>
                </el-radio-group>
           </div>
        </div>
        <div class="middle" v-show="radio == '图形报表'">
            <div class="queryConditions report-margin">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
                <el-form-item label="日期">
                    <el-date-picker
                      class="input-shadow"
                    v-model="formInline.date"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-time-select
                    placeholder="起始时间"
                    v-model="formInline.startTime"
                    :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                    }">
                </el-time-select>
                -
                <el-time-select
                    placeholder="结束时间"
                    v-model="formInline.endTime"
                    :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                    minTime: formInline.startTime
                    }">
                </el-time-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchData" size="mini">查询</el-button>
                </el-form-item>
                </el-form>
            </div>
            <div class="reportGraphics">
                <el-row :gutter="24" class="report-margin">
                    <el-col :span="12"><div class="grid-content bg-purple report-line">
                        <div class="report-gang">
                            <span>客流类型分布</span>
                            <el-button size="mini" @click="saveImage('pieChart')">保存图片</el-button>
                        </div>
                        <div style="width:100%;height:100%;">
                            <pie-chart :data="vipData" ref="pieChart" :height="chartHeight"/>
                        </div>

                    </div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple report-line">
                        <div class="report-gang">
                            <span>客流年龄分布</span>
                            <el-button size="mini" @click="saveImage('barChartAge')">保存图片</el-button>
                        </div>
                        <div style="width:100%;height:100%;">
                            <bar-chart-age :data="ageData" ref="barChartAge" :height="chartHeight"/>
                        </div>
                    </div></el-col>
                </el-row>
                 <el-row :gutter="24" class="report-margin">
                    <el-col :span="24"><div class="grid-content bg-purple report-line">
                        <el-card class="chart-card" shadow="always">
                            <div slot="header" class="clearfix">
                                <span>小时客流趋势</span>
<!--                                <div style="float: right; padding: 3px 0">-->
<!--                                    <el-switch-->
<!--                                    v-model="showNum"-->
<!--                                    active-text="开"-->
<!--                                    inactive-text="数显"-->
<!--                                    active-color="#0df4ff"-->
<!--                                    inactive-color="#909399"-->
<!--                                    style="margin-right:10px;"-->
<!--                                    @change='changeStatus'-->
<!--                                    >-->
<!--                                    </el-switch>-->
<!--                                 <svg-icon icon-class="link" />-->
<!--                                </div>-->
                            </div>
                            <div class="chart-card-item">
                                 <people-chart :dataList="hourPeopleData" :height="chartHeight" :showNum="isShow"/>
                            </div>
                            </el-card>

                        </div></el-col>

                </el-row>
            </div>
        </div>
        <div class="tableDataBox report-margin" v-show="radio == '数据报表'">
            <div class="tableTop report-margin">
                <div>
                    <span>{{downTime}}</span>
                    <span style="margin-left:10px;">{{downTimeLine}}</span>
                </div>
                <el-button type="primary" plain style="background-color: #1881a0;color: #494c50;" size="small"><a href="#">下载数据</a></el-button>
            </div>
            <div class="report-margin">
                <el-row :gutter="24" class="report-margin">
                    <el-col :span="24"><div class="grid-content bg-purple report-line">
                        <div class="report-gang">
                            <span>客流报表</span>
                        </div>
                        <div style="width:90%;height:100%;margin: 2% auto">
                             <el-table
                            :data="tableData"
                            style="width: 100%">
                                <el-table-column
                                    prop="hh"
                                    label="时间段"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="totalFlow"
                                    label="客流量"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="maleFlow"
                                    label="男">
                                </el-table-column>
                                 <el-table-column
                                    prop="femaleFlow"
                                    label="女"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="mainAge"
                                    label="主力消费年龄段"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="mainAgeFlow"
                                    label="主力消费年龄段人数">
                                </el-table-column>
                                 <el-table-column
                                    prop="vipFlow"
                                    label="会员数"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="vipRate"
                                    label="会员占比(%)"
                                    >
                                </el-table-column>
                            </el-table>
                        </div>
                    </div></el-col>
                </el-row>
            </div>

        </div>

    </div>
</template>
<script>
import moment from "moment";
import labelView from  '@/components/Label/index'
import BarChart from '@/components/Charts/BarChart'
import PieChart from '@/components/Charts/PieChart'
import BarChartAge from "@/components/Charts/BarChartAge";
import PeopleChart from "@/components/Charts/PeopleChart";
import {getRealTimeData} from '@/api/report'
export default {
    name:'intoShopFlow',
    components: {labelView,BarChart,PieChart,BarChartAge,PeopleChart},
    data(){
        return{
            isShow:true,
            chartHeight:'222px',
            radio:'图形报表',
            showNum:true,
            formInline: {
                date: '',
                startTime: '',
                endTime: ''
            },
            downTime:'',
            downTimeLine:'',
            optionBarData: {
                xAxisData: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55'],
                seriesData: [
                { name: 'name1', data: [79, 52, 200, 334, 390, 330, 220] },
                { name: 'name2', data: [29, 32, 100, 234, 290, 230, 120] }]
            },
            optionPieData:{
                vip: {
                    vipFlow: 30,
                    nonVipFlow: 70
                }
            },
            vipData:{},
            ageData: {},
            hourData:[],
            hourPeopleData:{},
            tableData: [
                {
                    "date": "2019-07-07",
                    "hh": 88,
                    "mainAge": "19-29岁",
                    "totalFlow": 50,
                    "maleFlow": 25,
                    "femaleFlow": 25,
                    "vipFlow": 999,
                    "vipRate": 1,
                    "mainAgeFlow": 15
                },
                {
                    "date": "2019-07-07",
                    "hh": 99,
                    "mainAge": "29-39岁",
                    "totalFlow": 100,
                    "maleFlow": 25,
                    "femaleFlow": 50,
                    "vipFlow": 999,
                    "vipRate": 1,
                    "mainAgeFlow": 25
                }
            ]
        }
    },
    created(){
        this.init();
    },
     methods:{
        init(){
            let start_time=moment(new Date()).format('YYYY-MM-DD');
            this.downTime = start_time;
            this.downTimeLine = '00:00 - 23:59';
            let _storeId = 1;
            let _params = {store_id:_storeId,starttime:start_time,endtime:start_time,hh:'00,23'}
            this.loadData(_params)
        },
        searchData(){
            let start_time=moment(this.formInline.date).format('YYYY-MM-DD');
            this.downTime = start_time;
            this.downTimeLine = this.formInline.startTime +' - '+ this.formInline.endTime
            let _hh = this.formInline.startTime +','+ this.formInline.endTime
            let _storeId = 1;
            let _params = {store_id:_storeId,starttime:start_time,endtime:start_time,hh:_hh}
            this.loadData(_params)
        },
        loadData(params){
            getRealTimeData(params).then(res =>{
            console.log("!!!!!---",res)
            let res_data=res.data;
            this.optionPieData.vip = res_data.vip;
            this.tableData=res_data.hour;
            this.hourData = res_data.hour;
            let arr = []
            for (let i in res_data.age) {
              arr.push(res_data.age[i]);
            }
            let xData = ["0-18", "19-29", "30-39", "40-64", ">65"];
              this.$set(this.ageData,'xAxisData',xData)
              this.$set(this.ageData,'xAxisName','年龄')
              this.$set(this.ageData,'data',arr)
            this.loadVip()
            this.loadHourPeople();
         })
        },

        loadVip() {
            let vip = this.optionPieData.vip;
            let arr = [];
            for (const key in vip) {
                if (vip.hasOwnProperty(key)) {
                const element = vip[key];
                let name = key == "vipFlow" ? "会员" : "非会员";
                arr.push({
                    value: element,
                    name: name
                })
                }
            }
            let vipTip = ["会员", "非会员"];
            this.$set(this.vipData, 'legendData', vipTip)
            this.$set(this.vipData, 'data', arr)
            this.$set(this.vipData, 'name', '是否会员')
        },
        loadHourPeople() {
            let xData = [],
                s_male = [],
                s_female = [],
                s_all = [];
            this.hourData.map(item => {
                xData.push(item.hh);
                s_male.push(item.maleFlow);
                s_female.push(item.femaleFlow);
                s_all.push(item.totalFlow);
            })
            this.$set(this.hourPeopleData, "xData", xData);
            this.$set(this.hourPeopleData, "s_male", s_male);
            this.$set(this.hourPeopleData, "s_female", s_female);
            this.$set(this.hourPeopleData, "s_all", s_all);
            console.log("this.hourPeopleData",this.hourPeopleData)
        },
        changeStatus: function(callback){
          this.$nextTick(()=>{
            this.isShow = callback
          })
				   console.log(callback);
        },
         saveImage(name){
          let _name = name;
          this.$refs[name].saveImage(_name);
      },
    }
}
</script>
<style lang="scss" >
@import "@/styles/report.scss";
.top{
    display: flex;
    justify-content: flex-start;
    // .radioBtn{
    //     background-color: #2b7a94 !important;
    //     color: #00172f;
    //     text-shadow: none;
    // }
}
.queryConditions{
  position: absolute;
  right: 4%;
  top: 18px;
}
.tableTop{
    display: flex;
    justify-content: space-between;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #FFFFFF;
  background-color: #13375d;
  border-color: #409EFF;
}
.el-radio-button__inner {
  background: #0f384a;
  border: 1px solid #2480b3;
  color: #909399;
}
</style>

