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
      <el-row :gutter="15">
        <el-col :span="12">
          <div class="bg-purple">
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
            <div class="bg-purple report-line report-margin">
              <div class="report-gang tip">
                <span>期间浏览人数</span>
                <el-tooltip class="item" effect="dark" content="查询时间内，每小时的顾客总人数" placement="top-start">
                  <i class="el-icon-info report-tip" />
                </el-tooltip>
              </div>
              <div style="width:100%;height:100%;">
                <bar-chart-age ref="barChartAge" :data="peopleChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
            <div class="bg-purple report-line report-margin">
              <div class="report-gang tip">
                <span>停留时间分布</span>
                <el-tooltip class="item" effect="dark" content="用于查看顾客在大屏前平均停留时间" placement="top-start">
                  <i class="el-icon-info report-tip" />
                </el-tooltip>
              </div>
              <div style="width:100%;height:100%;">
                <bar-chart-age ref="barChartAge" :data="stayChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
            <div class="bg-purple report-line report-margin">
              <div class="report-gang tip">
                <span>区域监测</span>
                <el-tooltip
                  class="item"
                  effect="dark" 
                  content="观看人数：除了当前互动以外之围观人数;
													互动人数：主要互动顾客的人数;
													领劵人数：领用优惠劵的人数"
                  placement="top-start"
                >
                  <i class="el-icon-info report-tip" />
                </el-tooltip>
              </div>
              <div style="width:100%;height:100%;">
                <more-chart ref="moreChart" :data="areaChartDatas" :height="chartHeight" :width="chartWidth" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="bg-purple-light">
            <div class="bg-purple report-line">
              <div class="report-gang tip">
                <span>场景监测</span>
                <el-tooltip
                  class="item"
                  effect="dark" 
                  content="根据大屏配置的不同场景显示数据;播放设备数：有使用的设备数（如：大屏、Pad等;观看人数：除了当前互动以外之围观人数;互动人数：主要互动顾客的人数;领劵人数：领用优惠劵的" 
				  placement="top-start">				
					<i class="el-icon-info report-tip"></i>
				</el-tooltip>
							</div>
							<div style="width:100%;height:100%;padding:2%;">
							    <el-table
									:data="scenarioData"
									stripe
									highlight-current-row
									show-overflow-tooltip
									:height="tableHeight"
									style="width: 100%">
									<el-table-column
									prop="scenarioName"
									label="场景名称">
									</el-table-column>
									<el-table-column
									prop="deviceCount"
									sortable
									label="播放设备数">
									</el-table-column>
									<el-table-column
									prop="view"
									sortable
									label="观看人数">
									</el-table-column>
									<el-table-column
									prop="interaction"
									sortable
									label="互动人数">
									</el-table-column>
									<el-table-column
									prop="couponCount"
									sortable
									label="领券人数">
									</el-table-column>
									<el-table-column
									prop="avgInteractionDevice"
									sortable
									label="平均设备互动数">
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="bg-purple report-line report-margin">
							<div class="report-gang tip">
								<span>内容监测</span>
								<el-tooltip 
								class="item" 
								effect="dark" 
								content="根据大屏展示的广告内容进行监测;
										播放设备数：有使用的设备数（如：大屏、Pad等）;
										观看人数：所有观看广告的人数（含点击与围观）;
										平均设备观看数：观看人数/播放设备数" 
										placement="top-start">
									<i class="el-icon-info report-tip"></i>
								</el-tooltip>
							</div>
							<div style="width:100%;height:100%;padding:2%;">
							    <el-table
									:data="contentData"
									stripe
									highlight-current-row
									:height="tableHeight"
									style="width: 100%">
									<el-table-column
									prop="contentName"
									label="广告名称">
									</el-table-column>
									<el-table-column
									prop="device"
									sortable
									label="播放设备数">
									</el-table-column>
									<el-table-column
									prop="view"
									sortable
									label="观看人数">
									</el-table-column>
									<el-table-column
									prop="avgViewDevice"
									sortable
									label="平均设备观看人数">
									</el-table-column>
								</el-table>
							</div>
						</div>
						<div class="bg-purple report-line report-margin">
							<div class="report-gang tip">
								<span>优惠券监测</span>
								<el-tooltip 
									class="item" 
									effect="dark" 
									content="时间区间内，发放、使用优惠劵的数量及销售额;发放数量，每小时更新数据;使用数量，每日更新数据"
									placement="top-start">
									<i class="el-icon-info report-tip"></i>
								</el-tooltip>
							</div>
							<div style="width:100%;height:100%;padding:2%;" >
							    <el-table
									:data="couponData"
									stripe
									highlight-current-row
									:height="tableHeight"
									style="width: 100%">
									<el-table-column
									prop="couponName"
									sortable
									label="优惠券名称">
									</el-table-column>
									<el-table-column
									prop="takeCount"
									sortable
									label="区间发放量">
									</el-table-column>
									<el-table-column
									prop="usageCount"
									sortable
									label="区间发放使用量">
									</el-table-column>
									<el-table-column
									prop="conserveRate"
									sortable
									label="转化率">
									</el-table-column>
									<el-table-column
									prop="salesAmount"
									sortable
									label="销售额">
									</el-table-column>
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
import MoreChart from '@/components/Charts/MoreChart'
import {getScreenData} from '@/api/report'
export default {
	name:'ScreenAnalysis',
	components: {BarChartAge, MoreChart},
	data(){
		return{
			formInline: {
				time: ''
			},
			tableHeight:202,
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
			const peopleData ={
				data: {},
				xAxisData:[],
				xAxisName:'',
				legendData:[]
			}
			const obj = Object.assign({}, peopleData)
			obj.xAxisName = '区域'
			obj.legendData =['领券人数', '互动人数', '观看人数']
			const _couponCount = []; const _interaction = []; const _view = []
			for(const i in data){
				_couponCount.push(data[i].couponCount)
				_interaction.push(data[i].interaction)
				_view.push(data[i].view)
				obj.xAxisData.push(data[i].areaName)
			}
			obj.data={
				'领券人数':_couponCount,
				'互动人数':_interaction,
				'观看人数':_view
			} 
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
	//    filterSeriesName(data){
	// 	   let name = ''
	// 	   switch(data){
	// 		case 'couponCount':
	// 			name = "领券人数";
	// 			break;
	// 		case 'interaction':
	// 			name = "互动人数";
	// 			break;
	// 		case 'view':
	// 			name = "观看人数";
	// 			break;	
	// 	   }
	// 	   return name
	// 	},
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
		.tip .report-tip{
			top:5%;
		}
	}
</style>
