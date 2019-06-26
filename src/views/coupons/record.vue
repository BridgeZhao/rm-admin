<template>
	<div class="app-container">
		<div class="record-top">
			<el-row :gutter="20">
				<el-col :span="22"><div class="grid-content bg-purple">
					<el-form :model="ruleForm" :inline="true" status-icon ref="ruleForm"  class="demo-ruleForm">
						<el-form-item label="券号" prop="couponNo">
							<el-input v-model="ruleForm.couponNo" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="名称" prop="name">
							<el-input  v-model="ruleForm.name" autocomplete="off" placeholder="输入名称"></el-input>
						</el-form-item>
						<el-form-item label="发放时间" prop="time">
							<el-date-picker
								v-model="ruleForm.time"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="场景" prop="scenarioId">
							<el-select v-model="ruleForm.scenarioId" clearable filterable placeholder="请选择">
								<el-option
									v-for="item in sceneList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="类型" prop="couponType">
							<el-select v-model="ruleForm.couponType" clearable placeholder="请选择">
								<el-option label="优惠券" value="1"></el-option>
								<el-option label="积分券" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="searchData('ruleForm')">筛选</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</div></el-col>
				<el-col :span="2"><div class="grid-content bg-purple">
					<el-button type="primary"  @click="goBack">返回</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="record-bottom">
			<el-table
				:data="tableData"
				border
				style="width: 100%;margin-bottom: 20px;">
				<el-table-column
					prop="cardNo"
					label="券号"
					width="150">
				</el-table-column>
				<el-table-column
					prop="couponName"
					label="名称"
					>
				</el-table-column>
				<el-table-column
					prop="storeName"
					label="门店"
					>
				</el-table-column>
				<el-table-column
					prop="couponType"
					label="类型"
					>
					<template slot-scope="scope">
						<span>{{typeChange(scope.row.couponType)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="scenarioName"
					label="发放场景"
					>
				</el-table-column>
				<el-table-column
					prop="time"
					label="发放时间"
					>
					<template slot-scope="scope">
						 <span>{{timeChange(scope.row.time)}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="lookDetail(scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page.current"
				:page-sizes="[20, 30, 40, 50]"
				:page-size="page.size"
				class="pagination"
				layout="total, sizes, prev, pager, next, jumper"
				:total="page.total"
			   style="float: right">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import moment from "moment"
	import {searchRecord, getScenarioData} from '@/api/coupons'
	export default{
		name:'record',
		data(){
			return{
				ID:null,
				ruleForm:{
					couponNo:null,
					name:'',
					time:[],
					scenarioId:null,
					couponType:null
				},
				tableData: [{
					cardNo: '1210383974974',
					couponName: '王小虎',
					storeName: '普陀区',
					couponType: '优惠券',
					scenarioName:'贴纸相机',
					time: '2016-05-03 15:33:00'
				}],
				page:{
					total: 20,
					size: 10,
					current: 1
				},
				sceneList:[],
			}
		},
		computed: {
			listenstage() {
				return this.$store.state.app.storeId
			}
		},
		watch: {
			listenstage(newVal) {
				this.searchData(newVal)
			}
		},
		mounted(){
			this.init()
		},

		methods:{
			search(){
					console.log('查询')
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			goBack(){
				this.$router.go(-1)
			},
			lookDetail(row){
				console.log(row)
			},
			handleCurrentChange(val) {
				this.page.current = val
				this.searchData()
			},
			handleSizeChange(val) {
				this.page.size = val
				this.searchData()
			},
			init(){
				const id = this.$route.query.id
				this.ID = id
				const _parmas = {
					couponId: id,
					page: this.page.current,
					size: this.page.size
				}
				this.loadData(_parmas)
			},
			searchData(data){
				const _id = data || this.$store.state.app.storeId
				let pages = {
					page: this.page.current,
					size: this.page.size
				}
				const obj = Object.assign({}, pages, this.ruleForm)
				let _startTime = moment(obj.time[0]).valueOf()
				let _endTime = moment(obj.time[1]).valueOf()
				delete obj.time
				obj.begin = _startTime
				obj.end = _endTime
				obj.storeId = _id
				console.log("查询条件",obj)
				this.loadData(obj)
			},
			loadData(data){
				searchRecord(data).then(res =>{
					console.log('laodData')
					this.page.current = res.page
					this.page.size = res.size
					this.page.total = res.total
					this.tableData = res.data
				})
			},
			timeChange(data){
				return  moment(data).format('YYYY-MM-DD HH:mm:ss')
			},
			typeChange(data){
				return data === 1 ? '优惠券' : '积分券'
			},
			// 获取场景列表 先用size方法查，后期优化
			getSceneList() {
				const size = 10000
				getScenarioData(size).then(res =>{
					this.sceneList = res.data
				})
			},

		},
	}
</script>
<style lang="scss" scoped>
	.app-container{
		overflow: auto;
		.record-bottom .el-button--text{
			border-color: transparent !important;
		}
	}
</style>
