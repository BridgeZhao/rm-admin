<template>
  <div class="app-container">
    <div>
      <label-view labelFather="实时客流统计"></label-view>
    </div>
    <div class="top report-margin">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-title">店前客流</div>
            <div class="report-num" style="color: #d8b104;">{{summary.frontFlow}}</div>
            <div class="report-small">
              <span>昨日同期</span>
              <i class="icon iconfont" :class="'icon-'+summaryClass(summary.frontFlowChange)" style="font-size:18px;"></i>
              <span>{{summary.frontFlowChange}}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-title">进店客流</div>
            <div class="report-num" style="color: #50e3c2;">{{summary.entryFlow}}</div>
            <div class="report-small">
              <span>昨日同期</span>
              <i
                class="icon iconfont" :class="'icon-'+summaryClass(summary.entryFlowChange)"
                style="font-size:18px;"
              ></i>
              <span>{{summary.entryFlowChange}}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-title">进店率</div>
            <div
              class="report-num"
              style="color: #d8b104;"
            >{{(summary.entryRate * 100).toFixed(2)}}%</div>
            <div class="report-small">
              <span>昨日同比</span>
              <i
                class="icon iconfont"
								:class="'icon-'+summaryClass(summary.entryRateChange)"
                style='font-size:18px;'></i>
              <span>{{summary.entryRateChange}}%</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="middle report-margin">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流性别对比</span>
              <el-button size="mini" @click="saveImage('pieChartGender')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <pie-chart :data="genderData" ref="pieChartGender"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流类型分布</span>
              <el-button size="mini" @click="saveImage('pieChart2')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <pie-chart :data="vipData" ref="pieChart2"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流年龄分布</span>
              <el-button size="mini" @click="saveImage('barChartAge')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <bar-chart-age :data="ageData" ref="barChartAge" height="250px"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="middle report-margin">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>小时客流趋势</span>
              <!-- <el-button size="mini" >保存图片</el-button> -->
            </div>
            <div style="width:100%;height:100%;">
              <people-chart :dataList="hourPeopleData" height="300px"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import labelView from "@/components/Label/index";
import PieChart from "@/components/Charts/PieChart";
import BarChartAge from "@/components/Charts/BarChartAge";
import PeopleChart from "@/components/Charts/PeopleChart";
import { getRealTimeData } from "@/api/report";
export default {
  name: "realTimeTraffic",
  components: { labelView, PieChart, BarChartAge, PeopleChart },
  data() {
    return {
      height2: "300px",
      summary: {
        frontFlow: 0,
        entryFlow: 0,
        entryRate: 0,
        frontFlowChange: 0,
				entryFlowChange: 0,
        entryRateChange: 0
      },
      optionPieData: {
        gender: {
          maleFlow: 25,
          femaleFlow: 25
        },
        vip: {
          vipFlow: 30,
          nonVipFlow: 70
        }
      },
      loadDataList: [],
      genderData: {
        data: [],
        legendData: [],
        name: '性别'
      },
      vipData:{},
      ageData: {},
      hourData: [],
      hourPeopleData: {}
    }
  },
	computed: {
		listenstage() {
			return this.$store.state.app.storeId
		}
	},
	watch: {
		listenstage(newVal) {
			this.loadData(newVal)
		}
	},
  mounted() {
    this.loadData()
  },
  methods: {
    loadData(storeId) {
			const start_time = moment(new Date()).format("YYYY-MM-DD")
      const _storeId = storeId || this.$store.state.app.storeId
			const _params = {
        store_id: _storeId,
        starttime: start_time,
        endtime: start_time,
        hh: "08,22"
      }
      getRealTimeData(_params).then(res => {
        console.log("!!!!!---", res)
        let res_data = res.data
        this.summary = res_data.summary
        this.optionPieData.gender = res_data.gender
        this.optionPieData.vip = res_data.vip
        this.hourData = res_data.hour
        const arr = []
        for (let i in res_data.age) {
          arr.push(res_data.age[i])
        }
        console.log("-----",arr)
        this.$set(this.ageData,'data',arr)
				const _age = ["0-18", "19-29", "30-39", "40-64", ">65"];
        this.$set(this.ageData,'xAxisData',_age)
        this.$set(this.ageData,'xAxisName','年龄')
        this.loadGender()
        this.loadVip()
        this.loadHourPeople()
      })
      console.log("!!!!!", _params)
    },
    saveImage(name) {
			const _name = name
      this.$refs[name].saveImage(_name)
    },
    loadGender() {
			const gender = this.optionPieData.gender;
      for (const key in gender) {
        if (gender.hasOwnProperty(key)) {
          const element = gender[key];
					const name = key == "maleFlow" ? "男" : "女";
          this.genderData.legendData = ["男", "女"];
          this.genderData.data.push({
            value: element,
            name: name
          })
        }
      }
    },
    loadVip() {
			const vip = this.optionPieData.vip
			const arr = []
      for (const key in vip) {
        if (vip.hasOwnProperty(key)) {
          const element = vip[key]
					const name = key == "vipFlow" ? "会员" : "非会员";
          arr.push({
            value: element,
            name: name
          })
        }
      }
			const vipTip = ["会员", "非会员"];
      this.$set(this.vipData, 'legendData', vipTip)
      this.$set(this.vipData, 'data', arr)
      this.$set(this.vipData, 'name', '是否会员')
    },
    loadHourPeople() {
			const xData = [],
        s_male = [],
        s_female = [],
        s_all = [];
      this.hourData.map(item => {
        xData.push(item.hh + ":00")
        s_male.push(item.maleFlow)
        s_female.push(item.femaleFlow)
        s_all.push(item.totalFlow)
      })
      this.$set(this.hourPeopleData, "xData", xData)
      this.$set(this.hourPeopleData, "s_male", s_male)
      this.$set(this.hourPeopleData, "s_female", s_female)
      this.$set(this.hourPeopleData, "s_all", s_all)
    },
    summaryClass(num) {
      return num === 0 ? "null" : /^[0-9]+.?[0-9]*$/.test(num) ? "up" : "down";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/report.scss";
.app-container {
  background: none;
  .icon-up {
    color: #f94905;
  }
  .icon-down {
    color: #0776ea;
  }
}
</style>
