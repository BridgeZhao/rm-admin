<template>
    <div class="app-container reportInput" style="background:none">
        <div class="top">
            <div style="float: left;margin-left: 1%;">
                <label-view labelFather="进店客流统计"></label-view>
            </div>
           <div style="float: left;">
                <el-radio-group v-model="radio" class="chose">
                    <el-radio-button label="图形报表" class="radioBtn"></el-radio-button>
                    <el-radio-button label="数据报表" class="radioBtn"></el-radio-button>
                </el-radio-group>
           </div>
					<div  v-show="radio == '图形报表'" style="float: right">
						<el-form :inline="true" :model="formInline" class="demo-form-inline">
							<el-form-item label="日期">
								<el-date-picker
									class="input-shadow"
									v-model="formInline.date"
                                    style="width:150px;"
									type="date"
									placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="">
								<el-time-select
									placeholder="起始时间"
									v-model="formInline.startTime"
                                    style="width:100px;"
									:picker-options="{
                    start: '08:00',
                    step: '01:00',
                    end: '22:00'
                    }">
								</el-time-select>
								-
								<el-time-select
									placeholder="结束时间"
									v-model="formInline.endTime"
                                    style="width:100px;"
									:picker-options="{
                    start: '08:00',
                    step: '01:00',
                    end: '22:00',
                    minTime: formInline.startTime
                    }">
								</el-time-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="searchData">查询</el-button>
							</el-form-item>
						</el-form>
					</div>
        </div>
        <div class="middle" v-show="radio == '图形报表'">

            <div class="reportGraphics">
                <el-row :gutter="24" class="report-margin">
                    <el-col :span="12"><div class="grid-content bg-purple report-line">
                        <div class="report-gang">
                            <span>客流类型分布</span>
                            <el-button size="mini" @click="saveImage('客流类型分布')">保存图片</el-button>
                        </div>
                        <div style="width:100%;height:100%;">
                            <pie-chart :data="vipData" ref="客流类型分布" :height="chartHeight"/>
                        </div>

                    </div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple report-line">
                        <div class="report-gang">
                            <span>客流年龄分布</span>
                            <el-button size="mini" @click="saveImage('客流年龄分布')">保存图片</el-button>
                        </div>
                        <div style="width:100%;height:100%;">
                            <bar-chart-age :data="ageData" ref="客流年龄分布" :height="chartHeight"/>
                        </div>
                    </div></el-col>
                </el-row>
                 <el-row :gutter="24" class="report-margin">
                    <el-col :span="24"><div class="grid-content bg-purple report-line">
											<div class="report-gang">
												<span>小时客流趋势</span>
												<el-button size="mini" @click="saveImage('小时客流趋势')">保存图片</el-button>
											</div>
											<div style="width:100%;height:100%;">
												<people-chart :dataList="hourPeopleData" :height="chartHeight" :showNum="isShow" ref="小时客流趋势"/>
											</div>
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
                <el-button type="primary" plain style="background-color: #1881a0;color: #494c50;padding:0;" size="medium">
									<a :href="downloadPath" download="" style="text-decoration: none;color: #ffffff;display: block;width: 70px;height: 35px;line-height: 35px;">下载</a>
								</el-button>
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
					  loadPath:'/mg/dashboard/camera/',
					  downloadPath:'',
					  int:moment(new Date()).valueOf(),
            isShow:true,
            chartHeight:'222px',
            radio:'图形报表',
            showNum:true,
            formInline: {
                date: new Date(),
                startTime: '08:00',
                endTime: '22:00'
            },
					vipData:{},
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
		computed: {
			listenstage() {
				return this.$store.state.app.storeId
			}
		},
		watch: {
			listenstage(newVal) {
				this.formInline = {
					date: '',
					startTime: '',
					endTime: ''
				}
				this.init(newVal)
			}
		},
	  mounted(){
			  this.isAndroid()
        this.init()
    },
     methods:{
			 isAndroid(){
				 const isStoreid = this.showWindowHref("storeId")
				 if(isStoreid !== ''){
					 let id = isStoreid.storeId
					 this.$store.dispatch('app/setStoreId', id)
				 }else{
					 return false
				 }
			 },
			 showWindowHref(){
				 let sHref = window.location.href;
				 let args = sHref.split('?');
				 if(args[0] == sHref){
					 return ""
				 }
				 let arr = args[1].split('&');
				 let obj = {};
				 for(let i = 0;i< arr.length;i++){
					 let arg = arr[i].split('=');
					 obj[arg[0]] = arg[1];
				 }
				 return obj
			 },
        init(storeId){
            let start_time=moment(new Date()).format('YYYY-MM-DD')
            this.downTime = start_time
            this.downTimeLine = '08:00 - 22:00'
					  const _storeId = storeId || this.$store.state.app.storeId
            let _params = {store_id:_storeId,starttime:start_time,endtime:start_time,hh:'08,22'}
            this.loadData(_params)
        },
        searchData(){
					  const start_time= (this.formInline.date === '' || this.formInline.date === null) ? moment(new Date()).format('YYYY-MM-DD') : moment(this.formInline.date).format('YYYY-MM-DD')
            this.downTime = start_time
					  if(this.formInline.startTime === '' || this.formInline.startTime === null){
							this.formInline.startTime = '08:00'
						}
						if(this.formInline.endTime === '' || this.formInline.endTime === null){
							this.formInline.endTime = '22:00'
						}
            this.downTimeLine = this.formInline.startTime +' - '+ this.formInline.endTime
					  const _hh = this.formInline.startTime === '' ? '08,22' : this.formInline.startTime.substr(0,this.formInline.startTime.indexOf(':'))+','+this.formInline.endTime.substr(0,this.formInline.endTime.indexOf(':'))
					  const _storeId = this.$store.state.app.storeId
					  console.log("hhh",_hh)
					  const _params = {store_id:_storeId,starttime:start_time,endtime:start_time,hh:_hh}
            this.loadData(_params)
        },
        loadData(params){
            getRealTimeData(params).then(res =>{
            console.log("!!!!!---",res)
            const res_data=res.data
            this.optionPieData.vip = res_data.vip
            this.tableData=res_data.hour
            this.hourData = res_data.hourPlot
            const arr = []
            for (const i in res_data.age) {
              arr.push(res_data.age[i])
            }
            const ageData ={
							data: [],
							xAxisName:'',
							xAxisData:[]
						}
            const obj = Object.assign({}, ageData)
            const xData = ["0-18", "19-29", "30-39", "40-64", ">65"]
							obj.xAxisData =xData
							obj.xAxisName = '年龄'
							obj.data = arr
							this.ageData = obj
            this.loadVip()
            this.loadHourPeople()
         })
                    this.downloadPath = 'http://172.16.2.182:8000/api'+ this.loadPath + this.int +'/?store_id=' + params.store_id +'&starttime='+params.starttime + '&endtime=' + params.endtime + '&hh=' +params.hh
                
        },

        loadVip() {
            const vip = this.optionPieData.vip
            const arr = []
            for (const key in vip) {
                if (vip.hasOwnProperty(key)) {
                const element = vip[key]
                const name = key === 'vipFlow' ? '会员' : '非会员'
                arr.push({
                    value: element,
                    name: name
                })
                }
            }
            let vipTip = ["会员", "非会员"];
						const vipDatas ={
							data: [],
							name:'',
							legendData:[]
						}
						const obj = Object.assign({}, vipDatas)
					  obj.name = '是否会员'
					  obj.data = arr
					  obj.legendData = vipTip
					  this.vipData = obj
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
						const Data ={
							xData: [],
							s_male:[],
							s_female:[],
							s_all:[]
						}
					const obj = Object.assign({}, Data)
					obj.xData = xData
					obj.s_male = s_male
					obj.s_female = s_female
					obj.s_all = s_all
					this.hourPeopleData = obj
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
<style lang="scss" scoped>
@import "@/styles/report.scss";
.top{
	overflow: hidden;
     .radioBtn{
         background-color: #2b7a94 !important;
         color: #00172f;
         text-shadow: none;
     }
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
.chose .el-radio-button__orig-radio:checked + .el-radio-button__inner {
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

