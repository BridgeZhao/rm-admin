<template>
  <div class="app-container">
    <div>
      <label-view labelFather="门店客流分析"></label-view>
    </div>
    <div class="queryConditions report-margin">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-select v-model="formInline.value" placeholder="请选择">
            <el-option
              v-for="item in formInline.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
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
          <el-button type="primary" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
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
              <line-time-chart :data="options1" />
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
              <line-chart :data="options3" />
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
              <line-time-chart :data="options2"/>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" class="report-margin">
        <el-col :span="12">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>到店频率</span>
              <i class="el-icon-picture" @click="openFull('barChartAge',frequencyData,'到店频率')"></i>
            </div>
            <div style="width:100%;height:100%;">
              <bar-chart-age :data="frequencyData" :height="chartHeight" ref="barChartAge"/>
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
          startTime: '',
          endTime: '',
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
          totalNum: 100,
          totalNew: 20,
          totalOld: 80,
          totalAvgFrequency: 2.1
        },
        hourData: {},
        options1: {},
        options2: {},
        options3: {},
        data3: {
          legendData: [
            '碳酸饮料区',
            '矿泉水区',
            '果橙区',
            '收银区',
            '生活区',
            '凉茶区',
            '家电区',
            '一楼入口'
          ],
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
              data: [
                120,
                132,
                101,
                134,
                90,
                230,
                210,
                220,
                182,
                191,
                234,
                234,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '矿泉水区',
              data: [
                150,
                232,
                201,
                154,
                190,
                330,
                410,
                320,
                332,
                301,
                334,
                234,
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '碳酸饮料区',
              data: [
                156,
                132,
                101,
                134,
                90,
                78,
                210,
                220,
                500,
                191,
                234,
                234,
                820,
                932,
                901,
                934,
                78,
                1330,
                16,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '果橙区',
              data: [
                150,
                232,
                201,
                154,
                190,
                330,
                410,
                320,
                332,
                301,
                334,
                234,
                820,
                932,
                901,
                934,
                89,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '收银区',
              data: [
                120,
                132,
                101,
                134,
                90,
                3,
                210,
                21,
                182,
                191,
                234,
                234,
                820,
                932,
                901,
                934,
                29,
                1330,
                1320,
                278,
                334,
                390,
                99,
                320,
                460
              ]
            },
            {
              name: '生活区',
              data: [
                150,
                232,
                201,
                89,
                190,
                330,
                600,
                320,
                332,
                301,
                334,
                234,
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '凉茶区',
              data: [
                120,
                132,
                101,
                134,
                90,
                230,
                210,
                220,
                182,
                191,
                234,
                234,
                820,
                932,
                901,
                934,
                1290,
                20,
                1320,
                301,
                300,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '家电区',
              data: [
                150,
                232,
                201,
                154,
                24,
                330,
                410,
                320,
                20,
                301,
                334,
                234,
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            },
            {
              name: '一楼入口',
              data: [
                150,
                67,
                201,
                89,
                190,
                330,
                410,
                320,
                300,
                301,
                334,
                234,
                820,
                932,
                901,
                934,
                1290,
                1330,
                1320,
                301,
                334,
                390,
                330,
                320,
                460
              ]
            }
          ]
        },
        frequencyData: {},
        areaTopData: {},
        ageData: {},
        genderData: {}
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
      init() {
        let start_time = moment(new Date()).format('YYYY-MM-DD')
        let _storeId = 1
        let _params = {
          store_id: _storeId,
          starttime: start_time,
          endtime: start_time,
          hh: '00,23'
        }
        this.loadData(_params)
      },
      loadData(params) {
        getStoreFlowData(params).then(res => {
          console.log('loadData->', res)
          let _data = res.data
          this.SummaryData = _data.SummaryData[0]

          this.$nextTick(() => {
            this.loadData1(_data.FlowData)
            this.loadData2(_data.TotalHourData)
            this.loadData2Sum(_data.TotalHourData)
            this.laodFrequencyData(_data.FrequencyData)
            this.laodAreaTopData(_data.BlockData)
            this.laodAreaAge(_data.AgeData)
            this.loadGender(_data.GenderData)
          })
        })
      },
      //客流类型分布
      loadData1(data) {
        let obj = Object.assign({}, this.mockdata)
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
          obj.xAxisData.push(element.date)
          obj.seriesData[0].data.push(element.customerNewTotal)
          obj.seriesData[1].data.push(element.customerOldTotal)
        })
        this.options1 = obj
      },
      //小时客流汇总
      loadData2Sum(data) {
        console.log('))))))---', data)
        let arry = []
        const _seriesData = []
        const hh = []
        for (let i in data) {
          arry.push(data[i].customerNum)
        }
        _seriesData.push(arry)
        let _hh = []
        for (let i in data) {
          _hh.push(data[i].hh)
        }
        hh.push(_hh)
        this.$set(this.options3, 'seriesData', _seriesData)
        this.$set(this.options3, 'legendData', ['小时客流总数'])
        this.$set(this.options3, 'xAxisData', hh)
        console.log('this.options3', this.options3)
      },
      //小时客流
      loadData2(data) {
        let obj = Object.assign({}, this.mockdata)
        let xAxisData = new Set()
        let legendData = new Set()
        let mock = {}
        data.forEach(element => {
          let has = xAxisData.has(element.hh)
          legendData.add(element.blockName)
          if (!has) {
            mock[element.hh] = {}
          }
          mock[element.hh][element.blockName] = element.customerNum

          mock[element.hh]
          xAxisData.add(element.hh)
        })
        let seriesData = [];
        [...legendData].forEach(it => {
          let dataList = [];
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
        let op = {
          xAxisData: [...xAxisData],
          legendData: [...legendData],
          seriesData: [...seriesData]
        }

        this.options2 = op
      },
      // 到店频次
      laodFrequencyData(data) {
        let arry = []
        for (let i in data) {
          arry.push(data[i].customerNum)
        }
        this.$set(this.frequencyData, 'data', arry)
        let _ci = ['1-2次', '3-5次', '6-7次', '8-10次', '11-15次', '16次以上']
        this.$set(this.frequencyData, 'xAxisData', _ci)
        this.$set(this.frequencyData, 'xAxisName', '频次')
      },
      //区域客流Top10
      laodAreaTopData(data) {
        let _blockName = []
        for (let i in data) {
          _blockName.push(data[i].blockName)
        }
        let arry = []
        for (let i in data) {
          arry.push(data[i].count)
        }
        this.$set(this.areaTopData, 'data', arry)
        this.$set(this.areaTopData, 'xAxisData', _blockName)
        this.$set(this.areaTopData, 'xAxisName', '区域')
      },
      //区域客流年龄
      laodAreaAge(data) {
        let _data = data[0]
        let arr = []
        for (let i in _data) {
          arr.push(_data[i])
        }
        this.$set(this.ageData, 'data', arr)
        let _age = ['0-18', '18-24', '25-34', '35-44', '45-54', '54-64', '>65']
        this.$set(this.ageData, 'xAxisData', _age)
        this.$set(this.ageData, 'xAxisName', '年龄')
      },
      //区域客流性别
      loadGender(data) {
        console.log('$$$$', data)
        let gender = data[0]

        let arr = []
        for (const key in gender) {
          if (gender.hasOwnProperty(key)) {
            const element = gender[key]
            let name = key == '男性' ? '男' : '女'
            arr.push({
              value: element,
              name: name
            })
          }
        }
        this.$set(this.genderData, 'legendData', ['男', '女'])
        this.$set(this.genderData, 'data', arr)
        this.$set(this.genderData, 'name', '性别')

      }
    }
  }
</script>
<style lang="scss">
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
