<template>
  <div class="app-container">
    <div class="box-header">
      <span style="font-size: 1.2rem">互动屏实时监控分析</span>
      <div class="search" style="margin-top: 25px;">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="10px"
        >
          <el-form-item label>
            <el-date-picker
              v-model="formInline.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData()">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="report-margin">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="grid-content bg-purple report-line">
                  <el-tooltip class="item" effect="dark" content="用于查看即时顾客人数" placement="top-start">
                    <i class="el-icon-info report-tip" />
                  </el-tooltip>
                  <div class="report-title">
                    最新互动数
                  </div>
                  <div class="report-num" style="color: #d8b104;">
                    {{ nearlyInteraction || 0 }}
                  </div>
                  <div class="report-small" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple report-line">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="用于查看查询日期内互动顾客数"
                    placement="top-start"
                  >
                    <i class="el-icon-info report-tip" />
                  </el-tooltip>
                  <div class="report-title">
                    总互动数
                  </div>
                  <div class="report-num" style="color: #50e3c2;">
                    {{ totalInteraction || 0 }}
                  </div>
                  <div class="report-small" />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple report-line">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="用于查看顾客在大屏前平均停留时间"
                    placement="top-start"
                  >
                    <i class="el-icon-info report-tip" />
                  </el-tooltip>
                  <div class="report-title">
                    顾客平均停留时间（秒）
                  </div>
                  <div class="report-num" style="color: #d8b104;">
                    {{ avgDuration || 0 }}
                  </div>
                  <div class="report-small" />
                </div>
              </el-col>
            </el-row>
            <div class="grid-content bg-purple report-line report-margin">
              <div class="report-gang">
                <span>期间浏览人数</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;">
                <bar-chart-age ref="barChartAge" :data="peopleChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
            <div class="grid-content bg-purple report-line report-margin">
              <div class="report-gang">
                <span>停留时间分布</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;">
                <bar-chart-age ref="barChartAge" :data="stayChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
            <div class="grid-content bg-purple report-line report-margin">
              <div class="report-gang">
                <span>区域监测</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;">
                <bar-chart-age ref="barChartAge" :data="areaChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>场景监测</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;padding:2%;">
                <el-table
                  :data="scenarioData"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="scenarioName"
                    label="场景名称"
                  />
                  <el-table-column
                    prop="deviceCount"
                    label="播放设备数"
                  />
                  <el-table-column
                    prop="view"
                    label="观看人数"
                  />
                  <el-table-column
                    prop="interaction"
                    label="互动人数"
                  />
                  <el-table-column
                    prop="couponCount"
                    label="领券人数"
                  />
                  <el-table-column
                    prop="avgInteractionDevice"
                    label="平均设备互动数"
                  />
                </el-table>
              </div>
            </div>
            <div class="grid-content bg-purple report-line report-margin">
              <div class="report-gang">
                <span>内容监测</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;padding:2%;">
                <el-table
                  :data="contentData"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="contentName"
                    label="广告名称"
                  />
                  <el-table-column
                    prop="device"
                    label="播放设备数"
                  />
                  <el-table-column
                    prop="view"
                    label="观看人数"
                  />
                  <el-table-column
                    prop="avgViewDevice"
                    label="平均设备观看人数"
                  />
                </el-table>
              </div>
            </div>
            <div class="grid-content bg-purple report-line report-margin">
              <div class="report-gang">
                <span>优惠券监测</span>
                <!-- <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i> -->
              </div>
              <div style="width:100%;height:100%;padding:2%;">
                <el-table
                  :data="couponData"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    prop="couponName"
                    label="优惠券名称"
                  />
                  <el-table-column
                    prop="takeCount"
                    label="区间发放量"
                  />
                  <el-table-column
                    prop="usageCount"
                    label="区间发放使用量"
                  />
                  <el-table-column
                    prop="conserveRate"
                    label="转化率"
                  />
                  <el-table-column
                    prop="salesAmount"
                    label="销售额"
                  />
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import BarChartAge from '@/components/Charts/BarChartAge'
import {getScreenData} from '@/api/report'
export default {
	name:'ScreenAnalysis',
	components: {BarChartAge},
	data(){
		return{
			formInline: {
				time: ''
			},
			nearlyInteraction:null,
			avgDuration:null,
			totalInteraction:null,
			chartHeight:'200px',
			chartWidth:'100%',
			peopleChartDatas:{},
			stayChartDatas:{},
			areaChartDatas:{},
			scenarioData:[
				{
					'scenarioName': 'scenario1',
					'deviceCount': 2,
					'view': 10,
					'interaction': 20,
					'couponCount': 5,
					'avgInteractionDevice': 0.1
				}
			],
			contentData:[],
			couponData:[]

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
				time: ''
			}
			this.init(newVal)
		}
	},
	mounted(){
		this.init()
	},
	methods:{
		searchData(){
			const startTime = moment(this.formInline.time[0]).format('YYYY-MM-DD')
			const endTime = moment(this.formInline.time[1]).format('YYYY-MM-DD')
			const _storeId = this.$store.state.app.storeId
			const _params = {store_id:_storeId,starttime:startTime,endtime:endTime}
            this.loadData(_params)
		},
		init(storeId){
			const start_time = moment(new Date()).format('YYYY-MM-DD')
			const _storeId = storeId || this.$store.state.app.storeId
			const _params = {
				store_id: _storeId,
				starttime: start_time,
				endtime: start_time
            }
            this.loadData(_params)
		},
		loadData(params){
			getScreenData(params).then(res =>{
				this.nearlyInteraction = res.data.nearlyInteraction
				this.avgDuration = res.data.avgDuration
				this.totalInteraction = res.data.totalInteraction
				this.laodPeopleData(res.data.periodInteraction)
				this.laodStayData(res.data.distribution)
				this.laodAreaData(res.data.area)
				this.loadScenarioData(res.data.scenario)
				this.loadContentData(res.data.content)
				this.loadCouponData(res.data.coupon)
				console.log(res)
			})
		},
		// 期间浏览人数
        laodPeopleData(data) {
				const peopleData ={
					data: [],
					xAxisData:[],
					xAxisName:''
				}
				const obj = Object.assign({}, peopleData)
				obj.xAxisName = '互动人数'
				data.forEach(element =>{
					obj.data.push(element.interactionCount)
					obj.xAxisData.push(element.hh)
				})
				this.peopleChartDatas = obj
	   },
	   // 停留时间分布
        laodStayData(data) {
			const that = this
			const peopleData ={
				data: [],
				xAxisData:[],
				xAxisName:''
			}
			const obj = Object.assign({}, peopleData)
			obj.xAxisName = '人数'
			for(const i in data){
				obj.data.push(data[i])
				obj.xAxisData.push(that.filterTime(i))
			}
			this.stayChartDatas = obj
	   },
	   // 区域监测
	   laodAreaData(data) {
			const that = this
			const peopleData ={
				data: [],
				xAxisData:[],
				xAxisName:''
			}
			const obj = Object.assign({}, peopleData)
			obj.xAxisName = '人数'
			obj.legendData =['legendData', '互动人数', '观看人数']
			for(const i in data){
				obj.data.push([data[i].couponCount,data[i].interaction,data[i].view])
				obj.xAxisData.push(data[i].areaName)
			}
			console.log('-----&&&,',obj)
			this.areaChartDatas = obj
	   },
	   // 场景监测table
	   loadScenarioData(data){
		 this.scenarioData = data
	   },
	   // 内容监测table
	   loadContentData(data){
		 this.contentData = data
	   },
	   // 优惠券监测table
	   loadCouponData(data){
		 this.couponData = data
	   },
	   filterTime(data){
		   let time = ''
		   switch(data){
			case 'tenBelow':
				time = '<10秒'
				break
			case 'tenToThirty':
				time = '10-30秒'
				break
			case 'thirtyToSixty':
				time = '31-60秒'
				break
			case 'sixtyToNinety':
				time = '60-90秒'
				break
			case 'ninetyToTwomins':
				time = '90-120秒'
				break
			case 'twominsAbove':
				time = '120秒以上'
				break		
		   }
		   return time
		}
	   }

}
</script>
<style lang="scss" scoped>
@import "@/styles/report.scss";
.app-container{
		background: none;
		.box-header {
			width: 100%;
			height: 30px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
			padding-left: 10px;
			color: #71dcff;
			position: relative;
			&::after {
				position: absolute;
				content: "";
				display: block;
				top: 14px;
				background: #71dcff;
				width: 0.2rem;
				height: 1.5rem;
				margin-top: -0.7rem;
				left: 0px;
				border-radius: 0.1rem;
			}
		}
		.report-title{
			font-size: 14px;
		}
		.grid-content{
			padding: 3%;
		}
	}
</style>
