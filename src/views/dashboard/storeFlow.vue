<template>
  <div class="app-container">
    <div class="layoutTitle">
      <label-view labelFather="门店客流分析"></label-view>
			<div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline">
					<!--        <el-form-item>-->
					<!--          <el-select v-model="formInline.value" placeholder="请选择">-->
					<!--            <el-option-->
					<!--              v-for="item in formInline.options"-->
					<!--              :key="item.value"-->
					<!--              :label="item.label"-->
					<!--              :value="item.value"-->
					<!--            ></el-option>-->
					<!--          </el-select>-->
					<!--        </el-form-item>-->
					<el-form-item>
						<el-date-picker
							v-model="formInline.date"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchData">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
    </div>

    <div class="top report-margin">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="grid-content bg-purple report-line">
            <el-tooltip class="item" effect="dark" content="筛选条件内汇总每日客流" placement="top-start">
              <i class="el-icon-info report-tip"></i>
            </el-tooltip>
            <div class="report-title">总客流</div>
            <div class="report-num" style="color: #d8b104;">{{SummaryData.totalNum}}</div>
            <div class="report-small"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple report-line">
            <el-tooltip
              class="item"
              effect="dark"
              content="期间内，汇总每日新顾客的人数（初次到访门店，列为新顾客）"
              placement="top-start"
            >
              <i class="el-icon-info report-tip"></i>
            </el-tooltip>
            <div class="report-title">总新顾客数</div>
            <div class="report-num" style="color: #50e3c2;">{{SummaryData.totalNew}}</div>
            <div class="report-small"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple report-line">
            <el-tooltip
              class="item"
              effect="dark"
              content="期间内，汇总每日老顾客的人数（曾经到访过门店，即列为老顾客）"
              placement="top-start"
            >
              <i class="el-icon-info report-tip"></i>
            </el-tooltip>
            <div class="report-title">老顾客数</div>
            <div class="report-num" style="color: #d8b104;">{{SummaryData.totalOld}}</div>
            <div class="report-small"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple report-line">
            <el-tooltip class="item" effect="dark" content="平均每人累积到访次数" placement="top-start">
              <i class="el-icon-info report-tip"></i>
            </el-tooltip>
            <div class="report-title">平均到店频次</div>
            <div class="report-num" style="color: #50e3c2;">{{SummaryData.totalAvgFrequency}}</div>
            <div class="report-small"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="hourFLow report-margin">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流类型分布</span>
              <i class="el-icon-picture" @click="openFull('lineTimeChart',options1,'客流类型分布')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <!-- <v-chart
                theme="dark"
                class="chart"
                style="height:200px;width:100%"
                :options="options1"
              />-->
              <line-time-chart :data="options1" ref="lineTimeChart"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="report-margin">
        <el-col :span="24">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>小时客流汇总</span>
              <i class="el-icon-picture" @click="openFull('lineChart',options3,'小时客流汇总')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <line-chart :data="options3" ref="lineChart"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="report-margin">
        <el-col :span="24">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>小时客流</span>
              <i class="el-icon-picture" @click="openFull('lineTimeChart',options2,'小时客流')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <line-time-chart :data="options2" ref="lineTimeChart"/>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="report-margin">
        <el-col :span="12">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>到店频率</span>
              <i class="el-icon-picture" @click="openFull('barChartAge',frequencyDatas,'到店频率')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <bar-chart-age :data="frequencyDatas" :height="chartHeight" ref="barChartAge"/>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>区域客流Top10</span>
              <i class="el-icon-picture" @click="openFull('barChartAge',areaTopData,'区域客流Top10')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <bar-chart-age :data="areaTopData" :height="chartHeight" ref="barChartAge"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="report-margin">
        <el-col :span="12">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>区域客流性别</span>
              <i class="el-icon-picture" @click="openFull('pieChart',genderData,'区域客流性别')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <pie-chart :data="genderData" :height="chartHeight" ref="pieChart"/>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>区域客流年龄</span>
              <i class="el-icon-picture" @click="openFull('barChartAge',ageData,'区域客流年龄')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <bar-chart-age :data="ageData" :height="chartHeight" ref="barChartAge"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-dialog :title="title" :visible.sync="fullVisible" fullscreen>
        <component :is="componentName" :data="componentData" height="100%" v-if="fullVisible"></component>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import LineChart from '@/components/Charts/LineChart'
  import labelView from '@/components/Label/index'
  import LineTimeChart from '@/components/Charts/LineTimeChart'
  import BarChartAge from '@/components/Charts/BarChartAge'
  import PieChart from '@/components/Charts/PieChart'
  import {getStoreFlowData} from '@/api/report'

  export default {
    name: 'storesFlow',
    components: {labelView, LineTimeChart, BarChartAge, PieChart, LineChart},
    data() {
      return {
        chartHeight:'222px',
        height: '300px',
        mockdata: {
          legendData: [],
          xAxisData: [],
          seriesData: []
        },
        fullVisible: false,
        componentName: '',
        title: '',
        componentData: null,
        formInline: {
          date: '',
          options: [
            {
              value: '1',
              label: '门店1'
            },
            {
              value: '2',
              label: '门店2'
            },
            {
              value: '3',
              label: '门店3'
            }
          ],
          value: ''
        },
        SummaryData: {
          totalNum: 0,
          totalNew: 0,
          totalOld: 0,
          totalAvgFrequency: 0
        },
        hourData: {},
        options1: {},
        options2: {},
        options3: {},
        data3: {
          legendData: [],
          xAxisData: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00'
          ],
          seriesData: [
            {
              name: '碳酸饮料区',
							data:[]
            },
            {
              name: '矿泉水区',
							data:[]
            },
            {
              name: '碳酸饮料区',
							data:[]
            },
            {
              name: '果橙区',
							data:[]
            },
            {
              name: '收银区',
              data:[]
            },
            {
              name: '生活区',
							data:[]
            },
            {
              name: '凉茶区',
							data:[]
            },
            {
              name: '家电区',
							data:[]
            },
            {
              name: '一楼入口',
							data:[]
            }
          ]
        },
				frequencyDatas:{},
        areaTopData: {},
        ageData: {},
        genderData: {}
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
					date: ''
				}
				this.init(newVal)
			}
		},
    created() {
      this.init()
    },
    methods: {
      openFull(componentName, data, title) {
        this.title = title
        this.componentName = componentName
        this.componentData = data
        this.fullVisible = true
      },
      init(storeId) {
				const start_time = moment(new Date()).format('YYYY-MM-DD')
				const _storeId = storeId || this.$store.state.app.storeId
				const _params = {
          store_id: _storeId,
          starttime: start_time,
          endtime: start_time,
          hh: '00,23'
        }
        this.loadData(_params)
      },
			searchData(){
        console.log(this.formInline.date)
				const startTime = moment(this.formInline.date[0]).format('YYYY-MM-DD')
				const endTime = moment(this.formInline.date[1]).format('YYYY-MM-DD')
				const _storeId = this.$store.state.app.storeId
				const _params = {store_id:_storeId,starttime:startTime,endtime:endTime,hh: '08,22'}
				this.loadData(_params)
			},
      loadData(params) {
        getStoreFlowData(params).then(res => {
          console.log('loadData->', res)
					const _data = res.data
          this.SummaryData = _data.summaryData[0]
          // this.$nextTick(() => {
            this.loadData1(_data.flowData)
            this.loadData2(_data.totalHourData)
            this.loadData2Sum(_data.totalHourData)
            this.laodFrequencyData(_data.frequencyData)
            this.laodAreaTopData(_data.areaData)
            this.laodAreaAge(_data.ageData)
            this.loadGender(_data.genderData)
          // })
        })
      },
      // 客流类型分布
      loadData1(data) {
      	const mockdata ={
					legendData: [],
					xAxisData: [],
					seriesData: []
				}
				const obj = Object.assign({}, mockdata)
        obj.legendData = ['新顾客', '老顾客']
        obj.seriesData = [
          {
            name: '新顾客',
            data: []
          },
          {
            name: '老顾客',
            data: []
          }
        ]
        data.forEach(element => {
          obj.xAxisData.push(moment(element.date).format('YYYY-MM-DD'))
          obj.seriesData[0].data.push(element.customerNewTotal)
          obj.seriesData[1].data.push(element.customerOldTotal)
        })

        this.options1 = obj
				console.log('数据--->',this.options1)
      },
      // 小时客流汇总
      loadData2Sum(data) {
				const sumData ={
					seriesData: [],
					xAxisData:[],
					legendData:''
				}
				const obj = Object.assign({}, sumData)
				const arry = []
        const _seriesData = []
        const hh = []
        for (const i in data) {
          arry.push(data[i].customerNum)
        }
        _seriesData.push(arry)
				const _hh = []
        for (const i in data) {
          _hh.push(data[i].hh)
        }
        hh.push(_hh)
				obj.xAxisData = hh
				obj.legendData = ['小时客流总数']
				obj.seriesData = _seriesData
				this.options3 = obj
        // console.log('this.options3', this.options3)
      },
      // 小时客流
      loadData2(data) {
				const mockdata ={
					legendData: [],
					xAxisData: [],
					seriesData: []
				}
				const obj = Object.assign({}, mockdata)
				const xAxisData = new Set()
				const legendData = new Set()
				const mock = {}
        data.forEach(element => {
					const has = xAxisData.has(element.hh)
          legendData.add(element.blockName)
          if (!has) {
            mock[element.hh] = {}
          }
          mock[element.hh][element.blockName] = element.customerNum

          mock[element.hh]
          xAxisData.add(element.hh)
        })
				const seriesData = [];
        [...legendData].forEach(it => {
					const dataList = [];
          [...xAxisData].forEach(item => {
            if (mock[item].hasOwnProperty(it)) {
              dataList.push(mock[item][it])
            } else {
              dataList.push(0)
            }
          })
          seriesData.push({
            name: it,
            data: dataList
          })
        })
				const op = {
          xAxisData: [...xAxisData],
          legendData: [...legendData],
          seriesData: [...seriesData]
        }

        this.options2 = op
      },
      // 到店频次
      laodFrequencyData(data) {
				console.log("laodFrequencyData----",data)
				const frequencyData ={
					data: [],
					xAxisData:[],
					xAxisName:''
				}
				const obj = Object.assign({}, frequencyData)
				obj.xAxisName = '频次'
				data.forEach(element =>{
					obj.data.push(element.customerNum)
					obj.xAxisData.push(element.frequencyName)
				})
				this.frequencyDatas = obj
				console.log("laodFrequencyData",this.frequencyDatas)
      },
      // 区域客流Top10
      laodAreaTopData(data) {
				const areaData ={
					data: [],
					xAxisData:[],
					xAxisName:''
				}
				const obj = Object.assign({}, areaData)
				obj.xAxisName = '区域'
				data.forEach(element =>{
					obj.data.push(element.customerTotal)
					obj.xAxisData.push(element.areaName)
				})
				this.areaTopData = obj
				console.log("laodAreaTopData",this.areaTopData)
      },
      // 区域客流年龄
      laodAreaAge(data) {
				const ageData ={
					data: [],
					xAxisData:[],
					xAxisName:''
				}
				const obj = Object.assign({}, ageData)
				obj.xAxisName = '年龄'
				data.forEach(element =>{
					obj.data.push(element.customerNum)
					obj.xAxisData.push(element.age)
				})
				this.ageData = obj
      },
      // 区域客流性别
      loadGender(data) {
				const gender = data[0]
				const arr = []
        for (const key in gender) {
          if (gender.hasOwnProperty(key)) {
            const element = gender[key]
						const name = key === '男性' ? '男' : '女'
            arr.push({
              value: element,
              name: name
            })
          }
        }
				const genderData ={
					data: [],
					name:'',
					legendData:[]
				}
				const obj = Object.assign({}, genderData)
				obj.name = '性别'
				arr.forEach(element =>{
					obj.data.push({
						name:element.name,
						value:element.value
					})
					obj.legendData.push(element.name)
				})
				this.genderData = obj
        console.log("男女性别数据",this.genderData)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "@/styles/report.scss";
  .app-container {
    background: none;
    .el-tooltip__popper.is-dark {
      background: #1a2e49;
      border: 1px solid rgba(113, 220, 255, 0.3);
      color: #71dcff;
    }

    .el-tooltip__popper {
      padding: 5px;
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
    .queryConditions{
      position: absolute;
      right: 4%;
      top: 18px;
    }
  }
</style>
