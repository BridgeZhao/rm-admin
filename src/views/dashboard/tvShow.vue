<template>
  <div class="app-container">
    <div data-v-1f5afd21 class="top-bar">
      <h2 data-v-1f5afd21 class="sub-title">智能会员管理</h2>
      <h1 data-v-1f5afd21 class="main-title">KANKAN 智能客流分析</h1>
      <h2 data-v-1f5afd21 class="sub-title">人脸识别互动效果</h2>
    </div>
    <div class="main-content">
      <div class="member-list-warp">
        <div class="wrapper-item" v-for="item in list2" :key="item.id">
          <div class="box-card list-item">
            <img :src="item.href" alt>
            <div class="content">
              <div class="title">{{item.title}}</div>
              <div class="value" v-if="item.status">{{item.name}}</div>
              <div class="area-start" v-else>
                <div class="value-area-left">{{item.code1}}</div>
                <div class="value-area-right">{{item.code2}}</div>
              </div>
              <div class="area-between">
                <div>
                  <div class="title">{{item.code3}}</div>
                  <div class="sub-title">{{item.code4}}</div>
                </div>
                <div>
                  <div class="title">{{item.code5}}</div>
                  <div class="sub-title">{{item.code6}}</div>
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
              <span class="summary-value">{{summary.customerNew}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">老顾客数</h1>
              <span class="summary-value">{{summary.customerOld}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">总顾客数</h1>
              <span class="summary-value">{{summary.customerNum}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">日累计互动数</h1>
              <span class="summary-value">{{summary.realTimeDailyInteraction}}</span>
            </li>
            <li class="summary-list">
              <h1 class="summary-title">日累计发券数</h1>
              <span class="summary-value">{{summary.couponDailyCount}}</span>
            </li>
          </ul>
        </div>
        <!-- 热力图 -->
        <div class="box-card main-map">
          <div
            :style="{'background-image': heatmapBackImage && 'url(' + heatmapBackImage + ')'}"
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
            <bar-chart-new :data="heampChartdataList"/>
          </div>
        </div>
      </div>
      <div class="member-list-warp">
        <div class="box-card">
          <ul class="summary">
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时游戏互动人数</h1>
              <span class="summary-value">{{summary.realTimeScenarioInteraction}}</span>
            </li>
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时互动人数</h1>
              <span class="summary-value">{{summary.realTimeCount}}</span>
            </li>
            <li class="summary-list" style="width:33%;">
              <h1 class="summary-title">实时广告观看人数</h1>
              <span class="summary-value">{{summary.realTimeAdInteraction}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="box-card right-item">
            <div class="header">期间浏览人数</div>
            <div class="right-item-main">
              <bar-chart-new :data="viewDataList"/>
            </div>
          </div>
          <div class="box-card right-item">
            <div class="header">场景监测</div>
            <div class="right-item-main" ref="table">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%;background: #082849;"
                size="mini"
                tooltip-effect="dark"
                :height="maxHeight"
              >
                <el-table-column prop="scenarioName" label="场景监控" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceCount" label="播放设备数" width="80"></el-table-column>
                <el-table-column prop="view" label="观看观众数" width="80"></el-table-column>
                <el-table-column prop="interaction" label="互动顾客数" width="80"></el-table-column>
                <el-table-column prop="couponCount" label="领劵顾客数" width="80"></el-table-column>
                <el-table-column prop="avgInteractionDevice" label="平均顾客数"></el-table-column>
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
              >
                <el-table-column prop="areaName" label="区域" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="view" label="观看人数" width="80"></el-table-column>
                <el-table-column prop="interaction" label="互动人数" width="80"></el-table-column>
                <el-table-column prop="couponCount" label="领券人数" width="80"></el-table-column>
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
            :class="{'color1':item.similarity < 30,'color2':item.similarity >= 30 && item.similarity <= 60,'color3':item.similarity > 60}"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import h337 from "heatmap.js";
import BarChartNew from "@/components/Charts/BarChartNew";
const MAX_HEAT_VALUE = 10;
import { getAreaHotData, getImageData, getPinData} from "@/api/report";

export default {
  name: "aptitude-demonstration",
  components: { BarChartNew },
  data() {
    return {
      timeData:[moment(new Date()).add(-1,'days').format('YYYY-MM-DD'),moment(new Date()).format('YYYY-MM-DD')],
      maxHeight: 0,
      summary:{
        couponDailyCount: 10,
        customerNew: 100,
        customerNum: 300,
        customerOld: 200,
        realTimeAdInteraction: 25,
        realTimeCount: 125,
        realTimeDailyInteraction: 30,
        realTimeScenarioInteraction: 100
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
      heatmapBackImage: require("./map.png"),
      heatmap: null,
      heampChartdataList: {},
      viewDataList: {}
    };
  },
  methods: {
    tableHeight() {
      const { clientHeight } = this.$refs.table;
      this.maxHeight = clientHeight;
      window.onresize = () => {
        this.tableHeight();
      };
    },
    setBigDatas(){
      let _store_id = {
        store_id:'test0523'
      }
      getPinData(_store_id).then(res =>{
        console.log("shushushsu00000",res)
        //设置summary
        let _summary = res.data.summary[0];
        this.summary = _summary;
        //设置期间浏览人数
        let _viewData = res.data.viewData;
        let xData = [];
        let yData = [];
        for (let item of _viewData) {
          xData.push(item.hh+":00");
          yData.push(item.customerNum);
        }
         this.$set(this.viewDataList,'xAxisData',xData)
         this.$set(this.viewDataList,'barList',yData)
         this.$set(this.viewDataList,'xAxisName','小时')
         this.$set(this.viewDataList,'yAxisName','客流人数')
        //场景检测
        let _tableData = res.data.scenarioData;
        this.tableData = _tableData;
        //区域检测areaDataList
        let _areaDataList = res.data.areaData;
        this.areaDataList = _areaDataList;
      })
    },
    setImgData(){//获取下方抓去图片
      let _size = {
        size:40
      };
      getImageData(_size).then(res =>{
        console.log("tututu",res)
        this.$nextTick(()=>{
          this.list3 = res.splice(0,20)
        })
      })
    },
    setHeampChartData(data){
      let _viewData = data;
      let xData = [];
      let yData = [];
      for (let item of _viewData) {
        xData.push(item.hour+":00");
        yData.push(item.count);
      }
      this.$set(this.heampChartdataList,'xAxisData',xData)
      this.$set(this.heampChartdataList,'barList',yData)
      this.$set(this.heampChartdataList,'xAxisName','小时')
      this.$set(this.heampChartdataList,'yAxisName','客流人数')
    },
    setHeampData(data){//获取热力图数据
      getAreaHotData(data).then(res => {
        console.log("热点", res);
        console.log(res.data.heatmap);
        const chartData = res.data.hour;
        let _heatmap = res.data.heatmap;
        let heatmapData = [];
        const originalWidth = 900;
        const originalHeight = 300;
        let containerRect = this.$refs.heatmapContainer.getBoundingClientRect();
        let xScale = containerRect.width / originalWidth;
        let yScale = containerRect.height / originalHeight;
        //进行坐标轴数据解析
        for (let item of _heatmap) {
          heatmapData.push({
            x: Number((item.field_x * xScale).toFixed(0)),
            y: containerRect.height - Number((item.field_y * yScale).toFixed(0)),
            value: item.heat_map_value
          });
        }
        console.log("--------",heatmapData);
        this.$nextTick(() => {
          this.tableHeight()
          this.heatmap.setData({
            min: 0,
            max: MAX_HEAT_VALUE,
            data: heatmapData
          });
        });
        this.setHeampChartData(chartData);
      });
    },
    init() {
      let _storeId = 1;
      let _params = {
        filter: 2,
        store_id: "test",
        starttime: this.timeData[0],
        endtime: this.timeData[1],
        hh: "08:00,22:00"
      };
      this.setHeampData(_params);
      this.setImgData();
      this.setBigDatas()
    },
  },
  created(){
    // this.loadData();
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
    });
    for (let i = 0; i < 5; i++) {
      let obj = {
        id: 0,
        title: "优惠卷名称",
        name: "9.99全场满减",
        code1: "价格敏感",
        code2: "高价值",
        status: true,
        code3: "领取场景",
        code4: "红包雨",
        code5: "领取时间",
        code6: "2019-10-22 18:20",
        href: ""
      };
      let status = [true, false, true, false, true];
      let hrefs = [
        "http://img5.imgtn.bdimg.com/it/u=2181714473,2247286204&fm=26&gp=0.jpg",
        "http://img3.imgtn.bdimg.com/it/u=1828058422,2306320811&fm=26&gp=0.jpg",
        "http://img1.imgtn.bdimg.com/it/u=201117052,1461216129&fm=26&gp=0.jpg",
        "http://img4.imgtn.bdimg.com/it/u=2504015697,685651741&fm=26&gp=0.jpg",
        "http://img2.imgtn.bdimg.com/it/u=922677876,3751376574&fm=26&gp=0.jpg",
        "http://img2.imgtn.bdimg.com/it/u=1216645486,410358322&fm=11&gp=0.jpg"
      ];
      obj.id = i;
      obj.status = status[i];
      obj.href = hrefs[i];
      this.list2.push(obj);
    }
    // for (let i = 0; i < 30; i++) {
    //   let obj = {
    //     href: "",
    //     type: 1
    //   };
    //   let hrefs = [
    //     "http://i1.whymtj.com/uploads/tu/201610/587/slt4.png",
    //     "http://i1.whymtj.com/uploads/tu/201611/726/slt13.png",
    //     "http://i1.whymtj.com/uploads/tu/201901/10477/c80e395b81_4.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201905/9999/rn31b1fa4d2a.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201905/9999/rnfa098bd2aa.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201805/9999/rn7522785563.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201610/587/slt4.png",
    //     "http://i1.whymtj.com/uploads/tu/201611/726/slt13.png",
    //     "http://i1.whymtj.com/uploads/tu/201901/10477/c80e395b81_4.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201905/9999/rn31b1fa4d2a.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201905/9999/rnfa098bd2aa.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201805/9999/rn7522785563.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201710/9999/931dde146b.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201710/9999/7ae8dba93b.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201901/10456/zc1a9qwa.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201612/190/slt16.png",
    //     "http://i1.whymtj.com/uploads/tu/201612/486/slt4.png",
    //     "http://i1.whymtj.com/uploads/tu/201701/257/st11.png",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/rnfb3e6a6302.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/05daaa129c.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201901/9999/dd05cf85c5.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/513f86d2ec.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201612/190/slt16.png",
    //     "http://i1.whymtj.com/uploads/tu/201612/486/slt4.png",
    //     "http://i1.whymtj.com/uploads/tu/201701/257/st11.png",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/rnfb3e6a6302.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/05daaa129c.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201901/9999/dd05cf85c5.jpg",
    //     "http://i1.whymtj.com/uploads/tu/201906/9999/513f86d2ec.jpg"
    //   ];
    //   let types = [
    //     1,
    //     2,
    //     3,
    //     1,
    //     2,
    //     3,
    //     3,
    //     2,
    //     1,
    //     2,
    //     1,
    //     2,
    //     3,
    //     2,
    //     1,
    //     1,
    //     2,
    //     3,
    //     1,
    //     2,
    //     3,
    //     3,
    //     2,
    //     1,
    //     2,
    //     1,
    //     2,
    //     3,
    //     2,
    //     1
    //   ];
    //   obj.href = hrefs[i];
    //   obj.type = types[i];
    //   this.list3.push(obj);
    // }
    this.init()
    window.setInterval(() => {
      setTimeout(this.init(), 0)
    }, 15000)
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/apDemon.scss";
</style>
