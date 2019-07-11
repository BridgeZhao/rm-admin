<template>
  <div v-loading="bigLaoding" class="app-container">
    <div class="box-header">
      <span style="font-size: 18px">客流热力图</span>
      <div class="search">
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
    <div class="block">
      <el-slider
        v-model="dataTime"
        range
        show-stops
        :max="22"
        :min="8"
        class="slider"
        :show-tooltip="false"
        @change="sliderChange"
      />
      <div class="slider-label">
        <span v-for="item in list" :key="item">{{ item }}</span>
      </div>
    </div>
    <div class="container">
      <!-- <div class="left"></div> -->
      <div class="center">
        <div class="box-card mapBox">
          <div
            ref="heatmapContainer"
            :style="'background-image: url('+heatmapBackImage+')'"
            class="heat-map-container"
          />
        </div>
        <!-- <div class="box-card" style="margin-top:10px;">
          <div class="box-header">
            <span>客流7:00至17：00 Top10</span>
            <el-button size="mini">全屏</el-button>
          </div>
          <div class="bar-wrapper">
            <bar-chart-new :data="dataList"/>
          </div>
        </div>-->
      </div>

      <div class="right">
        <div class="gradient-bar-warp">
          <span>Low</span>
          <div class="bar" />
          <span>High</span>
        </div>
      </div>
    </div>
    <div v-loading="bottomBoxLoading" class="bottomBox" style="margin-left: 2%;">
      <div class="radioSS" style="margin-top:30px;">
        <span>停留时间:</span>
        <el-radio-group v-model="radio2" @change="radioChage">
          <el-radio :label="5">
            ≥5S
          </el-radio>
          <el-radio :label="15">
            ≥15S
          </el-radio>
          <el-radio :label="30">
            ≥30S
          </el-radio>
          <el-radio :label="60">
            ≥60S
          </el-radio>
        </el-radio-group>
      </div>
      <div class="report-margin" style="line-height: 2.5;">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="grid-content bg-purple report-line">
              <el-tooltip class="item" effect="dark" content="筛选条件内汇总每日进店客流量" placement="top-start">
                <i class="el-icon-info report-tip" />
              </el-tooltip>
              <div class="report-title">
                进店客流量
              </div>
              <div class="report-num" style="color: #d8b104;">
                {{ SummaryData.totalFlow||0 }}
              </div>
              <div class="report-small" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple report-line">
              <el-tooltip
                class="item"
                effect="dark"
                content="筛选条件内汇总每日驻足客流量"
                placement="top-start"
              >
                <i class="el-icon-info report-tip" />
              </el-tooltip>
              <div class="report-title">
                驻足客流量
              </div>
              <div class="report-num" style="color: #50e3c2;">
                {{ SummaryData.stayFlow||0 }}
              </div>
              <div class="report-small" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple report-line">
              <el-tooltip
                class="item"
                effect="dark"
                content="筛选条件内汇总每日驻足率"
                placement="top-start"
              >
                <i class="el-icon-info report-tip" />
              </el-tooltip>
              <div class="report-title">
                驻足率
              </div>
              <div
                class="report-num"
                style="color: #d8b104;"
              >
                {{ Number(SummaryData.stayRate||0).toFixed(2) }}
              </div>
              <div class="report-small" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple report-line">
              <el-tooltip class="item" effect="dark" content="筛选条件内汇总每位顾客的平均停留时长" placement="top-start">
                <i class="el-icon-info report-tip" />
              </el-tooltip>
              <div class="report-title">
                平均停留时长
              </div>
              <div
                class="report-num"
                style="color: #50e3c2;"
              >
                {{ Number(SummaryData.duration||0).toFixed(1) }}
              </div>
              <div class="report-small" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="report-margin">
        <el-row :gutter="24" class="report-margin">
          <el-col :span="8">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>区域客流分布</span>
                <!--                  <i class="el-icon-picture" @click="openFull('v-chart',areaFlowOptions,'区域客流分布')"></i>-->
              </div>
              <div style="width:100%;height:100%;">
                <v-chart ref="v-chart" class="source-chart" :options="areaFlowOptions" style="width:100%;height:180px;" />
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>区域驻足客流分布</span>
                <!--                  <i class="el-icon-picture" @click="openFull('v-chart',areaStayOptions,'区域驻足客流分布')"></i>-->
              </div>
              <div style="width:100%;height:100%;">
                <v-chart ref="v-chart" class="source-chart" :options="areaStayOptions" style="width:100%;height:180px;" />
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>区域平均停留时间</span>
                <!--                  <i class="el-icon-picture" @click="openFull('v-chart',areaStayAverageOptions,'区域平均停留时间')"></i>-->
              </div>
              <div style="width:100%;height:100%;">
                <v-chart
                  ref="v-chart"
                  class="source-chart"
                  :options="areaStayAverageOptions"
                  style="width:100%;height:180px;"
                />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-dialog :title="title" :visible.sync="fullVisible" fullscreen>
          <component :is="componentName" v-if="fullVisible" :data="componentData" height="100%" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { getAreaHotData, getDurationData } from '@/api/report'
import {getStoresImg} from '@/api/store'
import h337 from 'heatmap.js'
const MAX_HEAT_VALUE = 10
import BarChartNew from '@/components/Charts/BarChartNew'
import optionConfig from '@/utils/echartConfig'
export default {
  components: { BarChartNew },
  data() {
    return {
      fullVisible: false,
      componentData: null,
      chartHeight:'222px',
      componentName: '',
      title: '',
      bigLaoding:true,
      bottomBoxLoading:false,
      radio2: 5,
      formInline: {
        time: [new Date(),new Date()]
      },
      SummaryData: {
        duration: 0,
        stayRate: 0,
        stayFlow: 0,
        totalFlow: 0
      },
      areaFlowOptions: null,
      areaStayAverageOptions: null,
      areaStayOptions: null,
      dataTime: [8, 22],
      list: [],
      heatmapBackImage:'',
      heatmap: null,
      dataList: {
        xAxisData: ['休闲食品', '饮料', '蔬果', '生鲜1', '生鲜2'],
        xAxisName: '区域',
        yAxisName: '区域人数',
        barList: [330, 22, 456, 123, 57]
      }
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
			this.radio2 = 5
			this.init(newVal)
		}
	},
  created() {
    for (let i = 8; i < 23; i++) {
      let item = ``
      if (i < 10) {
        item = `0${i}:00`
      } else {
        item = `${i}:00`
      }
      this.list.push(item)
    }
  },
  mounted() {
    this.heatmap = h337.create({
      container: this.$refs.heatmapContainer,
      gradient: {
        '0.05': '#003067',
        '0.38': '#7ed321',
        '0.63': '#fbe800',
        '1': '#FFA100'
      },
      radius: 60,
      opacity: 0.6,
      blur: 1
    })
    // 当页面首次加载完毕渲染两大模块数据
    this.init()
  },
  methods: {
    openFull(componentName, data, title) {
      this.title = title
      this.componentName = componentName
      this.componentData = data
      this.fullVisible = true
    },
    searchData() {
			this.radio2 = 5
      const time = this.formInline.time
			const start_time = moment(new Date()).format('YYYY-MM-DD')
			const _store_id = this.$store.state.app.storeId
			const _params = {
        filter: this.radio2,
        store_id: _store_id,
        starttime: time == null ? start_time : moment(time[0]).format('YYYY-MM-DD'),
        endtime: time == null ? start_time : moment(time[1]).format('YYYY-MM-DD'),
        hh: '08,22'
      }
      this.laodData(_params)
    },
    sliderChange(key) {// 滑块change事件
      console.log(key)
			const _hh1 = key[0]; const _hh2 = key[1]
      const time = this.formInline.time
      const start_time = moment(new Date()).format('YYYY-MM-DD')
			const _store_id = this.$store.state.app.storeId
      const _params = {
        filter: this.radio2,
        store_id: _store_id,
				starttime: time == null ? start_time : moment(this.formInline.time[0]).format('YYYY-MM-DD'),
				endtime: time == null ? start_time : moment(this.formInline.time[1]).format('YYYY-MM-DD'),
        hh: _hh1 +',' + _hh2
      }
      this.setHeampData(_params)
    },
    radioChage(value){
      const time = this.formInline.time
      const start_time = moment(new Date()).format('YYYY-MM-DD')
      const _filter = value
      const _params = {
        filter: _filter,
        store_id: this.$store.state.app.storeId,
				starttime: time == null ? start_time : moment(time[0]).format('YYYY-MM-DD'),
				endtime: time == null ? start_time : moment(time[1]).format('YYYY-MM-DD'),
        hh: this.dataTime[0] +',' + this.dataTime[1]
      }
       this.setDurationData(_params)
    },
    setData(heatmapData) {
      this.heatmap.setData({
        min: 0,
        max: MAX_HEAT_VALUE,
        data: heatmapData
      })
    },
    transformData(xdata, s_data, name) {
      return optionConfig({
        grid: {
          top: '20%',
          left: '15%',
          right: '15%',
          bottom: '15%'
        },
        xAxis: {
          name:'区域',
          type: 'category',
          splitLine: { show: true },
          data: xdata,
          nameTextStyle:{
            color:'#ffffff',
            fontSize: 12
          },
          axisLine:{
            show:true,
            lineStyle:{
              color:'#00B4D9',
              opacity: 0.8
            }
          }
        },
        yAxis: {
          name: name || '人数',
          type: 'value',
          nameTextStyle: {
             color:'#ffffff',
             fontSize: 12,
            lineHeight: 10
          },
           axisLine:{
            show:true,
            lineStyle:{
              color:'#00B4D9',
              opacity: 0.8
            }
          },
          splitLine:{
            show:false,
            lineStyle:{
              color:'#00B4D9',
              type: 'dashed',
              opacity: 0.5
            }
          }
        },
        series: [
          {
            barWidth: 12, // 柱图宽度
            label: {
                normal: {
                  show: true,
                  color:'#fff',
                  position: 'top'
                }
              },
              itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 0, 0],
                        color:'#71DCFF',
                        opacity: 0.85
                    }
                },
            data: s_data,
            type: 'bar'
          }
        ]
      })
    },
    init(storeId) {
			const _storeId = storeId || this.$store.state.app.storeId
			const startTime = moment(new Date()).format('YYYY-MM-DD')
			const endTime = moment(new Date()).format('YYYY-MM-DD')
			const _params = {
        filter: this.radio2,
        store_id: _storeId,
        starttime: startTime,
        endtime: endTime,
        hh: '08,22'
      }
			this.setStoreImg(storeId)
      this.laodData(_params)
    },
    laodData(data) { // 首次加载数据
      this.setHeampData(data)
      this.setDurationData(data)
    },
		setStoreImg(storeId){
    	const _storeId = storeId || this.$store.state.app.storeId
			getStoresImg(_storeId).then(res =>{
				const img = res.floorGraph
				this.heatmapBackImage = img
				 console.log('热力图片～～',img)
			})
		},
    setHeampData(data){// 获取热力图数据
       getAreaHotData(data).then(res => {
        console.log('热点', res)
        console.log(res.data.heatmap)
        const _heatmap = res.data.heatmap
        const heatmapData = []
        const originalWidth = 900
        const originalHeight = 300
        const containerRect = this.$refs.heatmapContainer.getBoundingClientRect()
        const xScale = containerRect.width / originalWidth
        const yScale = containerRect.height / originalHeight
        console.log('xScale',xScale,'yScale',yScale,'containerRect',containerRect)
        // 进行坐标轴数据解析
        for (const item of _heatmap) {
            heatmapData.push({
              x: Number((item.field_x * xScale).toFixed(0)),
              y: containerRect.height - Number((item.field_y * yScale).toFixed(0)),
              value: item.heat_map_value
            })
        }
        this.$nextTick(() => {
          this.heatmap.setData({
            min: 0,
            max: MAX_HEAT_VALUE,
            data: heatmapData
          })
        })
        this.bigLaoding = false
        console.log(console.log('热点arr', heatmapData))
      })
    },
    setDurationData(data){// 获取客流量等数据
      getDurationData(data).then(res => {
        const durData = res.data
        this.SummaryData = durData
        // 平均停留时长
				const stay_xdata = []
          const stay_sdata = []
        for (const key in durData.durationMap) {
          stay_xdata.push(key)
          stay_sdata.push(durData.durationMap[key])
        }
        this.areaStayAverageOptions = this.transformData(
          stay_xdata,
          stay_sdata,
          '时长'
        )
        // stayMap区域驻足客流
				const stay_area_xdata = []
            const stay_area_sdata = []
        for (const key in durData.stayMap) {
          stay_area_xdata.push(key)
          stay_area_sdata.push(durData.stayMap[key])
        }
        this.areaStayOptions = this.transformData(
          stay_area_xdata,
          stay_area_sdata
        )
        // totalMap 区域客流分布
        const stay_flow_xdata = []; const stay_flow_sdata = []

        for (const key in durData.totalMap) {
          stay_flow_xdata.push(key)
          stay_flow_sdata.push(durData.totalMap[key])
        }
        this.areaFlowOptions = this.transformData(
          stay_flow_xdata,
          stay_flow_sdata
        )
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/areaHeat.scss";
@import "@/styles/report.scss";
.report-small{
    margin-bottom: 10px;
}
</style>
