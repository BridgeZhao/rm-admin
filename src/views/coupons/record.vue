<template>
	<div class="app-container">
		<div class="record-top">
			<el-row :gutter="20">
				<el-col :span="20"><div class="grid-content bg-purple">
					<el-form :model="ruleForm" :inline="true" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="券号" prop="num">
							<el-input v-model="ruleForm.num" autocomplete="off"></el-input>
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
						<el-form-item label="场景" prop="scene">
							<el-select v-model="ruleForm.scene" clearable placeholder="请选择">
								<el-option
									v-for="item in sceneLists"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="门店" prop="store">
							<el-select v-model="ruleForm.store" clearable placeholder="请选择">
								<el-option
									v-for="item in storeLists"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="类型" prop="type">
							<el-select v-model="ruleForm.type" clearable placeholder="请选择">
								<el-option
									v-for="item in typeLists"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="search('ruleForm')">筛选</el-button>
							<el-button @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-form>
				</div></el-col>
				<el-col :span="4"><div class="grid-content bg-purple">
					<el-button type="primary"  @click="goBack">返回</el-button>
				</div></el-col>
			</el-row>
		</div>
		<div class="record-bottom">
			<el-table
				:data="tableData"
				border
				style="width: 100%">
				<el-table-column
					fixed
					prop="num"
					label="券号"
					width="150">
				</el-table-column>
				<el-table-column
					prop="name"
					label="名称"
					>
				</el-table-column>
				<el-table-column
					prop="store"
					label="门店"
					>
				</el-table-column>
				<el-table-column
					prop="city"
					label="市区"
					width="120">
				</el-table-column>
				<el-table-column
					prop="type"
					label="类型"
					>
				</el-table-column>
				<el-table-column
					prop="scene"
					label="发放场景"
					>
				</el-table-column>
				<el-table-column
					fixed="time"
					label="发放时间"
					>
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button @click="lookDetail(scope.row)" type="text">详情</el-button>
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
				:total="page.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	export default{
		name:'record',
		data(){
			return{
				ruleForm:{
					num:'',
					name:'',
					time:'',
					scene:'',
					store:'',
					type:''
				},
				tableData: [{
					num: '1210383974974',
					name: '王小虎',
					store: '普陀区',
					type: '优惠券',
					scene:'贴纸相机',
					time: '2016-05-03 15:33:00'
				}],
				page:{
					total: 20,
					size: 10,
					current: 1
				}
			}
		},
		mounted(){

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
				// this.searchCouponsList()
			},
			handleSizeChange(val) {
				this.page.size = val
				// this.searchCouponsList()
			},
		},
	}
</script>
