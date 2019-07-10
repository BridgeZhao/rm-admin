<template>
	<div class="app-container">
		<el-row class="table-head-btns">
			<el-col :span="14">
				<!--头部按钮-->
				<el-form :inline="true">
					<el-form-item label="FaceId">
						<el-input
							style="width: 200px;margin-right: 10px"
							placeholder="请输入FaceID"
							v-model="pagination.faceId"/>
					</el-form-item>
					<el-form-item label="注册时间">
						<el-date-picker
							style="width: 270px"
							v-model="dateTimes"
							type="daterange"
							format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="timestamp"
							:default-time="['00:00:00', '23:59:59']"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button-group>
							<el-button type="primary" @click="()=>{pageChange(1)}">查询</el-button>
						</el-button-group>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="10" style="text-align: right">
				<el-button class="active" @click="showType=!showType">
					<svg-icon :icon-class="showType?'table':'menus'"/>
					{{showType?'网格':'列表'}}显示
				</el-button>
			</el-col>
		</el-row>
		<!--数据列表-->
		<el-table
			v-if="showType"
			v-loading="tableLoading"
			:data="tableData"
			element-loading-text="Loading"
			border
			stripe
		>
			<el-table-column
				label="faceId"
				prop="faceId"/>
			<el-table-column
				label="头像"
				width="150">
				<template slot-scope="scope">
					<img :src="scope.row.avatar" class="avatar">
				</template>
			</el-table-column>
			<el-table-column
				label="门店名">
				<template slot-scope="scope">
					<el-tag :type="'info'">
						{{ storeList.find(s_item => { return s_item.id === scope.row.storeId }).name }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
				prop="gender"
				width="80"
				label="性别"
			>
				<template slot-scope="scope">
					<el-tag :type="'info'">
						{{(scope.row.gender==='m'?'男':scope.row.gender==='w'?'女':'未知') }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
				prop="age"
				width="80"
				label="年龄"
			/>
			<el-table-column
				label="注册时间">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作">
				<template slot-scope="scope">
					<el-button @click="getInStoreData(scope.row)">进店记录</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-row v-if="!showType" v-loading="tableLoading">
			<el-col :xs="8" :sm="4" :md="5" :lg="4" :xl="3" v-for="(item, index) in tableData" :key="index">
				<div class="user-box">
					<p class="avatar"><img :src="item.avatar"/></p>
					<p style="text-align: center"><el-tag type="info">{{ storeList.find(s_item => { return s_item.id === item.storeId }).name }}</el-tag></p>
					<!--<p class="inline"><el-tag>FaceID：{{ item.faceId }}</el-tag></p>-->
					<div class="flex space-between mg-top10">
						<div class="col-1"><label>年龄：</label><span>{{ item.age }}</span></div>
						<div class="col-1 text-right"><label>性别：</label><span>{{ item.gender==='m'?'男':item.gender==='w'?'女':'未知' }}</span></div>
					</div>
					<p><span>{{ item.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span></p>
					<p class="button"><el-button @click="getInStoreData(item)">进店记录</el-button></p>
				</div>
			</el-col>
		</el-row>
		<nav class="nav-page">
			<el-pagination
				:page-size="pagination.size"
				layout="prev, pager, next, jumper"
				:total="pagination.total"
				@size-change="pageChange"
				@current-change="pageChange"
			/>
		</nav>
		<el-dialog v-if="dialogVisible" v-drag-dialog  title="进店记录" :width="'720px'" :visible.sync="dialogVisible">
			<el-row :gutter="20" class="dg-head">
				<el-col :span="8">
					<div style="text-align: right"><img :src="editData.avatar" height="130"/></div>
				</el-col>
				<el-col :span="16">
					<p style="margin:0">
						<span>{{ storeList.find(s_item => { return s_item.id === editData.storeId }).name }}</span>
						FaceID：<el-tag type="success">{{editData.faceId}}</el-tag>
					</p>
					<p class="inline">
						<label>性别：</label><span>{{ editData.gender==='m'?'男':editData.gender==='w'?'女':'未知' }}</span>
						<label>年龄：</label><span>{{ editData.age }}</span>
					</p>
					<p class="inline"><span>进店时间：{{ editData.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span></p>
					<ul class="dg-info">
						<li><span>累计进店</span>
							<label class="txt-blue">{{editData.accuCount}}次</label>
						</li>
						<li><span>到店频次（周）</span>
							<label class="txt-org">{{editData.avgWeekCount}}次</label>
						</li>
						<li><span>最近一次到店</span>
							<label class="txt-gyl">{{editData.lastDay}}天前</label>
						</li>
					</ul>
				</el-col>
			</el-row>
			<div class="dg-chart">
				<el-radio-group v-model.number="chartType">
					<el-radio-button :label="0">进店时间</el-radio-button>
					<el-radio-button :label="1">进店时段</el-radio-button>
				</el-radio-group>
				<section class="chart-card-item">
					<line-chart v-if="!chartType" :data="TimeOptionData" :grid="grid" height="250px" />
					<bar-chart v-else :data="intervalData" :grid="grid" height="250px"  />
				</section>
			</div>
			<div slot="footer" class="dialog-footer text-center">
				<el-button type="primary" @click="dialogVisible=false">关 闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVirtualMember } from '@/api/member'
import { inStoreTimeData } from '@/api/report'
import LineChart from '@/components/Charts/LineChart'
import barChart from "@/components/Charts/BarChart";
export default {
	components: { LineChart,barChart},
  data() {
    return {
			TimeOptionData: {
				seriesData: [],
				yAxisName: '',
				xAxisData: []
			},
			intervalData: {
				seriesData: [],
				yAxisName: '',
				xAxisData: []
			},
			grid:{
				top: '20%',
				left: '2%',
				right: '5%',
				bottom: '5%',
				containLabel: true
			},
      dateTimes: [],
			chartType:0,
			dialogVisible: false,
			showType: false,
      tableLoading: false,
			editData:{},
      form: {
        name: '',
        storeId: '',
        begin: '',
        end: ''
      },
      pagination: {
        page: 1,
        size: 24,
				faceId:'',
        name: '',
        total: 0
      },
      tableData: []
    }
  },
  computed: {
		...mapGetters([
			'storeId',
			'storeList'
		])
  },
  created() {
		this.form.storeId=this.storeId
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.tableLoading = true
      if (this.dateTimes&&this.dateTimes.length) {
        this.form.begin=this.dateTimes[0]
				this.form.end = this.dateTimes[1]
      }else{
				this.form.begin=this.form.end =''
			}
      const _pagination = Object.assign(this.form, this.pagination)
      for (const k in _pagination) {
        if (!_pagination[k]) {
          delete _pagination[k]
        }
      }
      delete _pagination.total
      delete _pagination.name
      getVirtualMember(_pagination).then(res => {
        const {size, total, page, data} = res
        this.tableData = data
        this.pagination.total = total
        this.pagination.page = page
        this.pagination.size = size
      }).finally(() => {
        this.tableLoading = false
      })
    },
    pageChange(val) {
      this.pagination.page = ~~val
      this.getTableData()
    },
		getInStoreData(item) {
			this.tableLoading = true
			this.editData = item
			this.TimeOptionData.seriesData = []
			this.TimeOptionData.xAxisData = []
			this.intervalData.xAxisData = []
			this.intervalData.seriesData = []
			inStoreTimeData(item.faceId).then(res => {
				const _data = res.data
				this.editData = Object.assign(this.editData, _data)
				console.log('this.editData', this.editData)
				const _seriesData = []
				const _xAxisData = []
				_data.date.forEach(item => {
					_seriesData.push(item.count)
					_xAxisData.push(item.date.replace(item.date.split('-')[0] + '-', ''))
				})

				const _intvlSeriesData = []
				const _intvAxisData = []
				_data.hour.forEach(item => {
					_intvlSeriesData.push(item.count)
					_intvAxisData.push(item.hh + ':00')
				})

				this.intervalData.xAxisData = _intvAxisData
				this.intervalData.yAxisName = '次数'
				this.intervalData.seriesData = _intvlSeriesData


				this.TimeOptionData.seriesData = [_seriesData]
				this.TimeOptionData.xAxisData = [_xAxisData]
				this.TimeOptionData.yAxisName = '次数'

				this.dialogVisible = true
			}).finally(() => {
				this.tableLoading = false
			})
		},
		// 全局门店下拉修改
		$storeIdChanged(storeId){
			if(storeId){
				this.form.storeId=storeId
			}
			this.getTableData()
		}
  }
}
</script>
<style lang="scss" scoped>
.dg-chart{
 text-align: center;
	.chart-box{

	}
}
.dg-head{
	color:#9fe7ff;
	margin-bottom: 20px;
	p{margin: 12px 0 0 0;
	 img{
		 vertical-align: top;
	 }
	}
	.inline{
		span{
			margin-right: 20px;
		}
	}
}
.dg-info{
	li{
		display: inline-block;
		margin:12px 30px 0 0;
	}
}
.user-box{
	transition: all .5s;
	transform: scale3d(1, 1, 1);
  background: #002A46 !important;
  border: 1px solid #418aaa;
	color: #2AB7DA;
  box-shadow: 1px 1px 4px 1px #000000;
  padding:0 10px 10px 10px;
	margin: 10px;
  font-size: 14px;
  font-weight: normal;
  p{ margin:5px 0 0 0;}
	&:hover{
		box-shadow: 3px 8px 15px 3px #000000;
		transition: all .2s linear;
		transform: scale3d(1.05, 1.05, 1.05);
	}
}
.button{
	text-align: center;
	button{
		width: 100%;
	}
}
.table-head-btns{
	margin: 0;
	padding: 0 10px;
}
.avatar {
	height: 120px;
	margin: 0;
	text-align: center;
	vertical-align: top;
	overflow: hidden;
	img {
		width: 70%;
		vertical-align: top;
	}
}
	table{
		.avatar{
			height: 60px;
		}
	}
</style>
