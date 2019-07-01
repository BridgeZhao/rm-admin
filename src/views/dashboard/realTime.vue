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
              <span style="color: #71dcff;">昨日同期</span>
              <i class="icon iconfont" :class="'icon-'+summaryClass(summary.frontFlowChange)" style="font-size:18px;"></i>
              <span :class="'i-'+summaryClass(summary.frontFlowChange)">{{summary.frontFlowChange}}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-title">进店客流</div>
            <div class="report-num" style="color: #d8b104;">{{summary.entryFlow}}</div>
            <div class="report-small">
              <span style="color: #71dcff;">昨日同期</span>
              <i
                class="icon iconfont" :class="'icon-'+summaryClass(summary.entryFlowChange)"
                style="font-size:18px;"
              ></i>
              <span :class="'i-'+summaryClass(summary.entryFlowChange)">{{summary.entryFlowChange}}%</span>
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
              <span style="color: #71dcff;">昨日同比</span>
              <i
                class="icon iconfont"
								:class="'icon-'+summaryClass(summary.entryRateChange)"
                style='font-size:18px;'></i>
              <span :class="'i-'+summaryClass(summary.entryRateChange)">{{summary.entryRateChange}}%</span>
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
              <el-button size="mini" @click="saveImage('客流性别对比')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <pie-chart :data="genderData" ref="客流性别对比"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流类型分布</span>
              <el-button size="mini" @click="saveImage('客流类型分布')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <pie-chart :data="vipData" ref="客流类型分布"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple report-line">
            <div class="report-gang">
              <span>客流年龄分布</span>
							<el-button size="mini" @click="saveImage('客流年龄分布')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
							<bar-chart-age :data="ageData" ref="客流年龄分布" height="250px"/>
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
							<el-button size="mini" @click="saveImage('小时客流趋势')">保存图片</el-button>
            </div>
            <div style="width:100%;height:100%;">
              <people-chart :dataList="hourPeopleData" height="300px" ref="小时客流趋势"/>
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
      genderData: {},
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
		this.isAndroid()
    this.loadData()
  },
  methods: {
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
        this.hourData = res_data.hourPlot
        const arr = []
        for (let i in res_data.age) {
          arr.push(res_data.age[i])
        }
        console.log("-----",arr)
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
        this.loadGender(res_data.gender)
        this.loadVip()
        this.loadHourPeople()
      })
      console.log("!!!!!", _params)
    },
    saveImage(name) {
			const _name = name
      this.$refs[name].saveImage(_name)
    },
		loadGender(data) {
			const gender = data
			const arr = []
			for (const key in gender) {
				if (gender.hasOwnProperty(key)) {
					const element = gender[key]
					const name = key === 'maleFlow' ? '男' : '女'
					arr.push({
						value: element,
						name: name
					})
				}
			}
			const _genderData ={
				data: [],
				name:'',
				legendData:[]
			}
			const obj = Object.assign({}, _genderData)
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
		},
    loadVip() {
			const vip = this.optionPieData.vip
			const arr = []
      for (const key in vip) {
        if (vip.hasOwnProperty(key)) {
          const element = vip[key]
					const name = key === "vipFlow" ? "会员" : "非会员";
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
    color: #f93205;
  }
  .icon-down {
    color: #48ec04;
  }
  .i-up {
    color: #f93205;
  }
  .i-down {
    color: #48ec04;
  }
}
</style>
