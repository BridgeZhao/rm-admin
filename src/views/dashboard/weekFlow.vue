<template>
  <div class="app-container" style="background:none">
    <div class="top">
      <div style="width: 15%;float: left;margin-left: 1%;">
        <label-view label-father="周时段客流统计" />
      </div>
      <div style="float: left">
        <el-radio-group v-model="radio">
          <el-radio-button label="图形报表" class="radioBtn" />
          <el-radio-button label="数据报表" class="radioBtn" />
        </el-radio-group>
      </div>
      <div v-show="radio == '图形报表'" style="float: right">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="时间">
            <el-date-picker
              v-model="formInline.dateTimeDay"
              type="week"
              style="width: 200px"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now() - 8.64e7;
                },
                firstDayOfWeek: 1
              }"
              format="yyyy 第 WW 周"
              placeholder="选择周"
            />
          </el-form-item>
          <!-- <el-form-item label="时间">
                  <el-time-select
                  placeholder="起始时间"
                  v-model="formInline.startTime"
                  :picker-options="{
                  start: '01:00',
                  step: '01:00',
                  end: '23:59'
                  }">
              </el-time-select>
              -
              <el-time-select
                  placeholder="结束时间"
                  v-model="formInline.endTime"
                  :picker-options="{
                  start: '01:00',
                  step: '01:00',
                  end: '23:59',
                  minTime: formInline.startTime
                  }">
              </el-time-select>
              </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="searchData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-show="radio == '图形报表'" class="middle">
      <div class="reportGraphics">
        <el-row :gutter="24" class="report-margin">
          <el-col :span="24">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>图形报表</span>
                <el-button size="mini" @click="saveImage('客流性别对比')">
                  保存图片
                </el-button>
              </div>
              <div style="width:100%;height:100%;">
                <week-chat ref="客流性别对比" :data="weekData" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show="radio == '数据报表'" class="tableDataBox report-margin">
      <div class="tableTop report-margin">
        <div>
          <span>{{ startWeekTime + ' - ' + endWeekTime }}</span>
          <span>08:00 - 22:00</span>
        </div>
        <el-button type="primary" plain style="background-color: #1881a0;color: #494c50;padding:0;" size="medium">
          <a :href="downloadPath" download="" style="text-decoration: none;color: #ffffff;display: block;width: 70px;height: 35px;line-height: 35px;">下载</a>
        </el-button>
      </div>
      <div class="report-margin">
        <el-row :gutter="24" class="report-margin">
          <el-col :span="24">
            <div class="grid-content bg-purple report-line">
              <div class="report-gang">
                <span>客流报表</span>
              </div>
              <div style="width:90%;height:100%;margin: 2% auto">
                <el-table
                  :data="tableData"
                  :default-sort="{prop: 'hh', order: 'Ascending'}"
                  style="width: 100%"
                  stripe
                >
                  <el-table-column
                    prop="hh"
                    label="时间段"
                    sortable
                  />
                  <el-table-column
                    prop="weekday1"
                    label="周一"
                  />
                  <el-table-column
                    prop="weekday2"
                    label="周二"
                  />
                  <el-table-column
                    prop="weekday3"
                    label="周三"
                  />
                  <el-table-column
                    prop="weekday4"
                    label="周四"
                  />
                  <el-table-column
                    prop="weekday5"
                    label="周五"
                  />
                  <el-table-column
                    prop="weekday6"
                    label="周六"
                  />
                  <el-table-column
                    prop="weekday7"
                    label="周日"
                  />
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import labelView from  '@/components/Label/index'
import WeekChat from '@/components/Charts/WeekChat'
import { getWeekFlowData} from '@/api/report'
export default {
    name:'IntoShopFlow',
    components: {labelView, WeekChat},
    data(){
        return{
						loadPath:'/mg/dashboard/weekflow/',
						downloadPath:'',
						int:moment(new Date()).valueOf(),
            radio:'图形报表',
            showNum:true,
            formInline:{
                dateTimeDay:new Date()
            },
            weekData:{},
            startWeekTime:'',
            endWeekTime:'',
            tableData: [
                {
                    'weekday4': 14,
                    'weekday2': 37,
                    'weekday3': 33,
                    'hh': 13
                },
                {
                    'weekday4': 12,
                    'hh': 14
                },
                {
                    'weekday4': 12,
                    'hh': 15
                },
                {
                    'weekday4': 7,
                    'hh': 16
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
			  this.formInline ={
					dateTimeDay:new Date()
				}
				this.init(newVal)
			}
		},
    created(){
			  this.isAndroid()
        this.init()
    },
     methods:{
    	  isAndroid(){
				 const isStoreid = this.showWindowHref('storeId')
					if(isStoreid !== ''){
						const id = isStoreid.storeId
						this.$store.dispatch('app/setStoreId', id)
					}else{
						return false
					}
				},
			 showWindowHref(){
				 const sHref = window.location.href
				 const args = sHref.split('?')
				 if(args[0] === sHref){
					 return ''
				 }
				 const arr = args[1].split('&')
				 const obj = {}
				 for(let i = 0;i< arr.length;i++){
					 const arg = arr[i].split('=')
					 obj[arg[0]] = arg[1]
				 }
				 return obj
			 },
        onSubmit() {
            console.log('submit!')
        },
        init(storeId){
					const weekOfday = moment(new Date()).format('E') // 计算今天是这周第几天
					this.startWeekTime = moment(this.formInline.dateTimeDay).add(-1,'days').format('YYYY-MM-DD')
					this.endWeekTime = moment(this.formInline.dateTimeDay).add(7-weekOfday,'days').format('YYYY-MM-DD')
					const _storeId = storeId || this.$store.state.app.storeId
					const _params = {
                store_id: _storeId,
                starttime: this.startWeekTime,
                endtime: this.endWeekTime,
                hh:'8,22'
            }
            this.loadData(_params)
        },
        searchData(){
            const weekOfday = moment(this.formInline.dateTimeDay).format('E') // 计算今天是这周第几天
            this.startWeekTime = moment(this.formInline.dateTimeDay).add(-1,'days').format('YYYY-MM-DD')
            this.endWeekTime = moment(this.formInline.dateTimeDay).add(7-weekOfday,'days').format('YYYY-MM-DD')
            console.log(weekOfday,this.startWeekTime,this.endWeekTime)
					   const _storeId = this.$store.state.app.storeId
					   const _params = {
                store_id: _storeId,
                starttime: this.startWeekTime,
                endtime: this.endWeekTime,
                hh:'8,22'
            }
            this.loadData(_params)
        },
        changeStatus: function(callback){
				console.log(callback)
        },
         saveImage(name){
        	const _name = name
          this.$refs[name].saveImage(_name)
        },
        loadData(params){
            this.weekData = {}
           getWeekFlowData(params).then(res =>{
               console.log('返回的周时段客流数据-》',res)
						   const res_data = res.data.weekflow
               this.tableData = res.data.weekHeatTable
               let arr = []
                 for (let i = 0; i < res_data.length; i++) {
                   arr.push([res_data[i].weekday - 1,res_data[i].hh,res_data[i].count])
                }
                arr = arr.map(function (item) {
                    return [item[0], item[1], item[2] || '-']
                })
                this.$set(this.weekData,'data',arr)
           })
					this.downloadPath = 'http://172.16.2.182:8000/api' + this.loadPath + this.int +'/?store_id=' + params.store_id +'&starttime='+params.starttime + '&endtime=' + params.endtime
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/styles/report.scss';
.top{
	overflow: hidden;
}
.tableTop{
    display: flex;
    justify-content: space-between;
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
</style>

