<template>
  <div class="app-container" style="margin-top: 0px;">
    <div data-v-1f5afd21 class="top-bar">
      <h2 data-v-1f5afd21 class="sub-title">智能会员管理</h2>
      <h1 data-v-1f5afd21 class="main-title"> 智慧客流监控大屏</h1>
      <h2 data-v-1f5afd21 class="sub-title">人脸识别互动效果</h2>
    </div>
    <div class="main-content">
      <div class="member-list-warp">
        <div class="wrapper-item" v-for="item in list2" :key="item.id">
          <div class="box-card list-item">
            <img :src="item.img" alt>
            <div class="content">
              <div class="sub-title" style="margin-top:5%;">客群标签</div>
              <!-- <div class="value-area-left">{{item.category > 0 ? 'VIP' : '新客户'}}</div> -->
               <!-- <div class="value-area-left">新客户</div> -->
              <div class="area-start">
                <div class="value-area-left" :style="{color:item.category > 0 ? '#f8e71c' : '#00e7c0'}">{{item.category > 0 ? 'VIP' : '新客户'}}</div>
                <!-- <div class="value-area-left" v-for="y in item.tags" :key="y.id">{{y}}</div> -->
                <!-- <div class="value-area-right">{{item.tags[1]}}</div> -->
                  <div class="value-area-left" v-show="Array.isArray(item.tags) && item.tags.length !== 0">{{item.tags[0]}}</div>
                  <div class="value-area-left" v-show="Array.isArray(item.tags) && item.tags.length !== 0">{{item.tags[1]}}</div>
              </div>
              <div class="area-between">
                <div>
                  <div class="sub-title">到店次数:{{item.entryTimes}}次</div>
                </div>
                <div>
                  <div class="sub-title">到店时间:{{setMoment(item.lastTime)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-list">
        <div class="box-card">
          <ul class="summary">
            <li class="summary-list">
              <h1 class="summary-title">新顾客数</h1>
              <span class="summary-value">{{summary.customerNew || 0}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">老顾客数</h1>
              <span class="summary-value">{{summary.customerOld || 0}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">总顾客数</h1>
              <span class="summary-value">{{summary.customerNum || 0}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">日累计互动数</h1>
              <span class="summary-value">{{summary.realTimeDailyInteraction || 0}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">日累计发券数</h1>
              <span class="summary-value">{{summary.couponDailyCount || 0}}</span>
            </li>
          </ul>
        </div>
        <!-- 热力图 -->
        <div class="box-card main-map">
          <div
            :style="'background-image: url('+heatmapBackImage+')'"
            class="heat-map-container"
            ref="heatmapContainer"
          ></div>
          <div class="gradient-bar-warp">
            <span>High</span>
            <div class="bar"></div>
            <span>Low</span>
          </div>
        </div>
        <!-- 小时客流数 （联动热力图）-->
        <div class="box-card main-bar">
          <div class="header">每小时客流数</div>
          <div class="cum-number">
            <!-- <bar-chart-new :data="heampChartdataList" ref="hoursChart"/> -->
            <v-chart ref="hoursChart" class="charts" :options="hoursCustomerFlowChartOptions" style="width:100%;height:100%;"></v-chart>
          </div>
        </div>
      </div>
      <div class="member-list-warp">
        <div class="box-card">
          <ul class="summary">
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时游戏互动人数</h1>
              <span class="summary-value">{{summary.realTimeScenarioInteraction || 0}}</span>
            </li>
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时区域互动人数</h1>
              <span class="summary-value">{{summary.realTimeCount || 0}}</span>
            </li>
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时广告观看人数</h1>
              <span class="summary-value">{{summary.realTimeAdInteraction ||0}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="box-card right-item">
            <div class="header">期间浏览人数</div>
            <div class="right-item-main" style="height:100%;">
              <bar-chart-new :data="viewDataList"/>
            </div>
          </div>
          <div class="box-card right-item">
            <div class="header">场景监测</div>
            <div class="right-item-main" ref="table">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%;background: #082849;height:100%;"
                size="mini"
                tooltip-effect="dark"
                :height="maxHeight"
                class="tableBox"
                :header-cell-style="{height:'30px'}"
              >
                <el-table-column prop="scenarioName" label="场景监控" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceCount" label="播放设备数"></el-table-column>
                <el-table-column prop="view" label="观看观众数"></el-table-column>
                <el-table-column prop="interaction" label="互动顾客数"></el-table-column>
                <!-- <el-table-column prop="couponCount" label="领劵顾客数" width="70"></el-table-column>
                <el-table-column prop="avgInteractionDevice" label="平均顾客数" width="70"></el-table-column> -->
              </el-table>
            </div>
          </div>
          <div class="box-card right-item">
            <div class="header">区域监测</div>
            <div class="right-item-main">
              <el-table
                :data="areaDataList"
                stripe
                style="width: 100%;background: #082849;"
                size="mini"
                tooltip-effect="dark"
                :height="maxHeight"
                class="tableBox"
              >
                <el-table-column prop="areaName" label="区域" show-overflow-tooltip></el-table-column>
                <el-table-column prop="view" label="观看人数"></el-table-column>
                <el-table-column prop="interaction" label="互动人数"></el-table-column>
                <el-table-column prop="couponCount" label="领券人数"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-card bot-bar">
      <div class="title">进店抓取</div>
      <div class="content">
        <div class="legend">
          <div class="legend-color" style="background-color:#71dcff;"></div>
          <span>vip</span>
          <div class="legend-color" style="background-color:#ca1d1d;"></div>
          <span>黑名单</span>
        </div>
        <div class="grab">
          <img
            class="grab-list"
            v-for="(item,index) in list3"
            :src="item.imgBase64"
            :key="'img'+index"
            :class="{'color3':item.similarity < 30,'color2':item.similarity >= 30 && item.similarity <= 60,'color1':item.similarity > 60}"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	import moment from 'moment'
	import h337 from 'heatmap.js'
	import BarChartNew from '@/components/Charts/BarChartNew'
  import {getImageData, getLeftImg,getLeftImg2, getPinData,getAreaHotData,superDemo,heatDemo} from '@/api/report'
  import {getStoresImg} from "@/api/store"
  const MAX_HEAT_VALUE = 10;
  let loop_play_heatmap_timer_id;
	export default {
  name: "aptitude-demonstration",
  components: { BarChartNew },
  data() {
    return {
      hoursCustomerFlowChartOptions: null,
      playedHours:[],
			timer: null,
      timeData:[moment(new Date()).add(-1,'days').format('YYYY-MM-DD'),moment(new Date()).format('YYYY-MM-DD')],
      maxHeight: 0,
      summary:{
        couponDailyCount: 0,
        customerNew: 0,
        customerNum: 0,
        customerOld: 0,
        realTimeAdInteraction: 0,
        realTimeCount: 0,
        realTimeDailyInteraction: 0,
        realTimeScenarioInteraction: 0
      },
      list2: [],
      tableData: [],
      areaDataList:[],
      list: [
        {
          name: "进店新顾客",
          number: 709
        },
        {
          name: "进店老顾客",
          number: 6
        },
        {
          name: "今日累计客流",
          number: 1417
        },
        {
          name: "今日累计互动数",
          number: 0
        },
        {
          name: "今日累计发券数",
          number: 0
        }
      ],
      list3: [],
      list1: [
        {
          name: "最新游戏互动人数",
          number: 709
        },
        {
          name: "最新互动人数",
          number: 6
        },
        {
          name: "最新广告人数",
          number: 1417
        }
      ],
      heatmapBackImage: '',
      heatmap: null,
      heampChartdataList: {},
      viewDataList: {}
    }
  },
  methods: {
    playHeatMap(playIndex, lastPlayedIndex) {
      let hoursChart = this.$refs.hoursChart;
      let loop_func = () => {
        hoursChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: lastPlayedIndex
        });
        hoursChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: playIndex
        });
        hoursChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: playIndex
        });
        let hours = this.playedHours;
        let queryHours = [hours[playIndex], hours[playIndex]];
        console.log('hours',hours,'queryHours',queryHours)
        this.setHeampData(queryHours);
      };
      if (hoursChart) {
        loop_func();
      }
    },
    loopPlayHeatMap() {
      let playIndex = 0,
        lastPlayedIndex = 0;
      clearInterval(loop_play_heatmap_timer_id);
      loop_play_heatmap_timer_id = setInterval(() => {
        let hours = this.playedHours;
        let len = hours.length;
        if (len === 0) {
          return;
        }
        this.playHeatMap(playIndex, lastPlayedIndex);
        lastPlayedIndex = playIndex;
        playIndex = ++playIndex % len;
      }, 6 * 1000);
      loop_play_heatmap_timer_id = setInterval(this.intervalGetData, 60 * 1000);
    },
  	setMoment(data){
  		return  moment(data).format('HH:mm:ss')
		},
    tableHeight() {
      const { clientHeight } = this.$refs.table
      this.maxHeight = clientHeight
      // window.onresize = () => {
      //   this.tableHeight()
      // }
    },
    setBigDatas(storeId){
    	const _storeId = storeId
      const _store_id = {
        store_id:_storeId
      }
      // getPinData(_store_id).then(res =>{
         superDemo(_store_id).then(res =>{
        // 设置summary
				this.summary = res.data.summary === [] ? this.summary : res.data.summary[0]
        // 设置期间浏览人数
				const _viewData = res.data.viewHourData
				const xData = []
				const yData = []
        for (const item of _viewData) {
          xData.push(item.hour+":00")
          yData.push(item.customerNum)
        }
         this.$set(this.viewDataList,'xAxisData',xData)
         this.$set(this.viewDataList,'barList',yData)
         this.$set(this.viewDataList,'xAxisName','小时')
         this.$set(this.viewDataList,'yAxisName','人数')
        // 场景检测
        let _tableData = res.data.scenarioData
        this.tableData = _tableData
        // 区域检测areaDataList
        let _areaDataList = res.data.areaData
        this.areaDataList = _areaDataList
				// 热力图
				// const _heatmap = res.data.heatmap
				// this.setHeampData(_heatmap)
				// 设置小时客流
				const _flowHourData = res.data.flowHourData
        // this.setHeampChartData(_flowHourData)
        this.generateHoursChartOptions(_flowHourData)
      })
    },
    // -----------------------------------
    generateHoursChartOptions(data) {
      const that = this
      let composeSourceData = function(data) {
        let indexMap = {}
        let cursor = 0
        let composedData = []
        let hours = []
        for (let item of data) {
          if (indexMap[item.hh] === undefined) {
            composedData.push(item.customerNum);
            hours.push(item.hh);
            indexMap[item.hh] = cursor;
            cursor++;
          } else {
            composedData[indexMap[item.hh]] += item.customerNum;
          }
        }
        return {
          composedData: composedData,
          hours
        };
      };
      let { composedData, hours } = composeSourceData(data)
      this.playedHours = hours
        let charOption = {
          name: "客流人数",
          tooltip: {
          trigger: 'axis',
           tooltip: {
            formatter(params) {
              return `区域： ${params.name}<br>区域人数：${params.value}人`;
            }
          }
        },
           xAxis: {
            type:"category",
            name:"小时",
            axisLine: {
              lineStyle: {
                  width: 1,
                  color:'#00B4D9',
                  opacity: 0.8
              },
              show: true,
            },
            axisLabel: {
              margin:8
            },
            axisTick: {
              show: false
            },
            data: hours,
            nameGap: 8
          },
          yAxis: [{
             type: "value",
             name:"人数",
             minInterval: 1,
             splitLine: {
               lineStyle: {
                  width: 1,
                  color: "rgba(113,220,255,0.30)",
              }
             },
             axisLine: {
              lineStyle: {
                  width: 1,
                  color:'#00B4D9',
                  opacity: 0.8
              },
              show: true,
            },
            axisLabel: {
              margin:8,
              formatter: val => {
                return val >= 1000 ? (val / 1000).toFixed(0) + "k" : val;
              }
            },
             z: 0,
          }],
        series: [
          {
            type: "bar",
            data: composedData,
            barMaxWidth:8,
            emphasis: {
              itemStyle: {
                color: "#f8e71c"
              }
            },
            itemStyle: {
                normal: {
                  barBorderRadius: [10, 10, 0, 0],
                  color:'#71DCFF',
                  opacity: 0.85
                }
            },
          }
        ],
        grid: {
          top: "22%",
          left: "5%",
          right: "5%",
          bottom: "18%"
        }
       }
       console.log('charOption',charOption)
      this.$nextTick(function(){
        this.hoursCustomerFlowChartOptions = charOption
      })
    },
    setHeampData(data){// 获取热力图数据
      	const _storeId = this.$store.state.app.storeId
        const startTime = moment(new Date()).format('YYYY-MM-DD')
        const endTime = moment(new Date()).format('YYYY-MM-DD')
        const _params = {
          filter: this.radio2,
          store_id: _storeId,
          starttime: startTime,
          endtime: endTime,
          hh: data[0] + ',' + (Number(data[0])+1)
        }
      //  getAreaHotData(_params).then(res => {
        heatDemo(_params).then(res => {
        let _heatmap = res.data.heatmap
        let heatmapData = []
        const originalWidth = 900
        const originalHeight = 300
        let containerRect = this.$refs.heatmapContainer.getBoundingClientRect()
        let xScale = containerRect.width / originalWidth
        let yScale = containerRect.height / originalHeight
        console.log('xScale',xScale,'yScale',yScale,'containerRect',containerRect)
        // 进行坐标轴数据解析
        for (let item of _heatmap) {
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
        console.log(console.log("热点arr", heatmapData));
      })
    },
		setLeftImg(){
    	const size = {
    		size: 40
			}
			// getLeftImg(size).then(res =>{
			// 	this.list2 = res.data
      // })
      getLeftImg2(size).then(res =>{
        // this.list2.push(res.data)
        this.list2 = res.data
			})
		},
    setImgData(){//获取下方抓去图片
			const _size = {
        size:40
      }
      getImageData(_size).then(res =>{
        console.log("tututu",res)
        this.$nextTick(()=>{
          this.list3 = res.splice(0,20)
          // this.list3.push(res.splice(0,20))
        })
      })
    },
		// 设置每小时客流数
    // setHeampChartData(data){
    //   const _viewData = data
		// 	const xData = []
		// 	const yData = []
    //   for (let item of _viewData) {
    //     xData.push(item.hh+":00")
    //     yData.push(item.customerNum)
    //   }
    //   this.playedHours = xData
    //   this.$set(this.heampChartdataList,'xAxisData',xData)
    //   this.$set(this.heampChartdataList,'barList',yData)
    //   this.$set(this.heampChartdataList,'xAxisName','小时')
    //   this.$set(this.heampChartdataList,'yAxisName','人数')
    // },
    setHeampData1(data){// 获取热力图数据
				const _heatmap = data
        let heatmapData = []
        const originalWidth = 900
        const originalHeight = 300
        let containerRect = this.$refs.heatmapContainer.getBoundingClientRect()
        let xScale = containerRect.width / originalWidth
        let yScale = containerRect.height / originalHeight
        console.log('xScale',xScale,'yScale',yScale,'containerRect',containerRect)
        // 进行坐标轴数据解析
        for (let item of _heatmap) {
          heatmapData.push({
            x: Number((item.field_x * xScale).toFixed(0)),
            y: containerRect.height - Number((item.field_y * yScale).toFixed(0)),
            value: item.heat_map_value
          })
        }
        console.log("--------",heatmapData)
        this.$nextTick(() => {
          this.heatmap.setData({
            min: 0,
            max: MAX_HEAT_VALUE,
            data: heatmapData
          })
        })
    },
    // 获取平面图
    setStoreImg(storeId){
    	const _storeId = storeId || this.$store.state.app.storeId
			getStoresImg(_storeId).then(res =>{
				const img = res.floorGraph
				this.heatmapBackImage = img;
				 console.log('热力图片～～',img)
			})
		},
    init(storeId) {
			const _storeId = storeId || this.$store.state.app.storeId
			const _params = {
        filter: 2,
        store_id: _storeId,
        starttime: this.timeData[0],
        endtime: this.timeData[1],
        hh: '08,22'
      }
      this.setStoreImg(storeId)
      // this.setHeampData(_params)
      this.setImgData()
      this.setBigDatas(_storeId)
      this.setLeftImg()
      this.tableHeight()
    },
		lunbo(){
  		this.setLeftImg()
			this.setImgData()
		}
  },
  created(){
    // this.loadData();
  },
	computed: {
		listenstage() {
			return this.$store.state.app.storeId
		}
	},
	watch: {
		listenstage(newVal) {
			this.init(newVal)
		}
	},
  mounted() {
    this.heatmap = h337.create({
      container: this.$refs.heatmapContainer,
      gradient: {
        "0.05": "#003067",
        "0.38": "#7ed321",
        "0.63": "#fbe800",
        "1": "#FFA100"
      },
      radius: 60,
      opacity: 0.6,
      blur: 1
    })
    // for (let i = 0; i < 5; i++) {
    //   let obj = {
    //     id: 0,
    //     title: "优惠卷名称",
    //     name: "9.99全场满减",
    //     code1: "价格敏感",
    //     code2: "高价值",
    //     status: true,
    //     code3: "领取场景",
    //     code4: "红包雨",
    //     code5: "领取时间",
    //     code6: "2019-10-22 18:20",
    //     href: ""
    //   }
    //   let status = [true, false, true, false, true]
    //   let hrefs = [
    //     "http://img5.imgtn.bdimg.com/it/u=2181714473,2247286204&fm=26&gp=0.jpg",
    //     "http://img3.imgtn.bdimg.com/it/u=1828058422,2306320811&fm=26&gp=0.jpg",
    //     "http://img1.imgtn.bdimg.com/it/u=201117052,1461216129&fm=26&gp=0.jpg",
    //     "http://img4.imgtn.bdimg.com/it/u=2504015697,685651741&fm=26&gp=0.jpg",
    //     "http://img2.imgtn.bdimg.com/it/u=922677876,3751376574&fm=26&gp=0.jpg",
    //     "http://img2.imgtn.bdimg.com/it/u=1216645486,410358322&fm=11&gp=0.jpg"
    //   ]
    //   obj.id = i
    //   obj.status = status[i]
    //   obj.href = hrefs[i]
    //   this.list2.push(obj)
    // }
    this.init()
    this.loopPlayHeatMap();
    this.timer = setInterval(() => {
      setTimeout(this.lunbo(), 0)
    }, 15000)
  },
	beforeDestroy() {
  	console.log("取消取消取消")
		if(this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
			clearInterval(this.timer) //关闭
			this.timer = null
    }
    clearInterval(loop_play_heatmap_timer_id);
	}
}
</script>
<style lang="scss" scoped>
	body{
    overflow: hidden !important;
    .tip-str{ max-width: 20px;}
  .tip-str h1{ display: block; width: 100%;color: #9fe7ff;background: #000000; padding:2px 0 0 5px}
  .tip-str span{ display:inline-block; min-width: 20px; padding: 2px 5px; float: left;background: #333333; margin:5px 0 0 5px;color: #cccccc; font-size: 13px;}
  .tip-str span b{ color: yellow;}
	}
@import "@/styles/apDemon.scss";
</style>
