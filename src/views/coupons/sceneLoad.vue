<template>
	<div class="config">
		<div class="header">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="名称">
					<el-input v-model="formInline.name" placeholder="场景"></el-input>
				</el-form-item>
				<el-form-item label="关联场景">
					<el-select v-model="formInline.scene" clearable filterable placeholder="请选择">
						<el-option
							v-for="item in sceneList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="formInline.status" clearable placeholder="请选择">
						<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="formInline.type" clearable placeholder="请选择">
						<el-option label="优惠券" value="1"></el-option>
						<el-option label="积分券" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchCouponsList">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
<!--		<el-button type="primary" @click="addSence" style="float: right">导入优惠券</el-button>-->
		<el-dropdown  @command="handleCommand" style="float: right;margin-bottom: 10px">
			<el-button type="primary">
				{{importCoupons}}<i class="el-icon-arrow-down el-icon--right"></i>
			</el-button>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="1">导入优惠券</el-dropdown-item>
				<el-dropdown-item command="2">导入积分券</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-table
			:data="tableData"
			border
			style="width: 100%;margin-bottom:10px;">
			<el-table-column
				prop="name"
				label="名称"
				fixed="left"
				min-width="120"
				align="center">
			</el-table-column>
			<el-table-column
				prop="couponType"
				label="类型"
				min-width="120"
				align="center">
			</el-table-column>
			<el-table-column
				prop="scenarios"
				label="关联场景"
				min-width="120"
				align="center">
			</el-table-column>
			<el-table-column
				prop="limit"
				label="发放上限"
				min-width="160"
				align="center">
			</el-table-column>
			<el-table-column
				prop="level"
				label="权重"
				min-width="160"
				align="center">
			</el-table-column>
			<el-table-column
				prop="stores"
				label="门店"
				min-width="160"
				align="center">
			</el-table-column>
			<el-table-column
				prop="createTime"
				label="创建时间"
				min-width="160"
				align="center">
			</el-table-column>
			<el-table-column
				prop="status"
				label="状态"
				min-width="160"
				align="center">
			</el-table-column>
			<el-table-column
				label="操作"
				fixed="right"
				min-width="250"
				align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="lookRecord(scope.row)">发放记录</el-button>
					<el-button type="text" size="mini" style="margin-right: 10px;" @click="edit(scope.row)">详情</el-button>
					<el-button type="text" size="mini" @click="changeStatus(scope.row)">禁用</el-button>
					<el-button type="text" size="mini" @click="deleteCoupon(scope.row)">删除</el-button>
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
		<div class="footer">
			<el-button size="mini" style="width: 100px;margin-right: 10px;" @click="next(1)">上一步</el-button>
			<el-button type="primary" size="mini" style="width: 100px;" @click="next(3)">下一步</el-button>
		</div>
		<el-dialog :title="importCoupons" :visible.sync="dialogTableVisible">
			<el-form :model="couponsFlag" :rules="couponsFlagRules" ref="couponsFlag" label-width="80px">
				<el-row :gutter="20">
					<el-col :span="12"><div class="grid-content bg-purple">
						<el-form-item label="名称" prop="name">
							<el-input v-model="couponsFlag.name"></el-input>
						</el-form-item>
						<el-form-item label="发放上限" prop="limit">
							<el-input v-model="couponsFlag.limit"></el-input>
						</el-form-item>
						<el-form-item label="发放权重" prop="weight">
							<el-input v-model="couponsFlag.weight"></el-input>
						</el-form-item>
						<el-form-item label="有效期" prop="time">
							<el-date-picker
								style="width: 250px;"
								v-model="couponsFlag.time"
								type="datetimerange"
								range-separator="至"
								start-placeholder="开始"
								end-placeholder="结束">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="选择门店" prop="storeId">
							<el-select
								v-model="couponsFlag.storeId"
								multiple
								clearable
								placeholder="请选择">
								<el-option
									v-for="item in storeList"
									:key="item.id"
									:label="item.name"
									:value="~~item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</div></el-col>
					<el-col :span="12"><div class="grid-content bg-purple">
						<el-form-item label="优惠券说明" prop="description">
							<textarea class="input" v-model="couponsFlag.description" style="width: 13.5rem;height: 100px;overflow-y: auto;"/>
						</el-form-item>
						<el-form-item label="优惠券等级" prop="level">
							<el-input v-model="couponsFlag.level"></el-input>
						</el-form-item>
						<el-form-item label="奖券图标">
							<el-upload
								action=''
								:on-change="getFile"
								:limit="1"
								list-type="picture"
								:on-preview="handlePictureCardPreview"
								:on-remove="handleRemove"
								:auto-upload="false">
								<img v-if="couponsFlag.iconBase64" :src="couponsFlag.iconBase64" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
						<el-form-item v-if="!commandNumber" label="积分" prop="credit">
							<el-input v-model="couponsFlag.credit"></el-input>
						</el-form-item>
						<el-form-item v-if="!commandNumber" label="积分数量" prop="creditNum">
							<el-input-number v-model="couponsFlag.creditNum" :min="0" :max="100000000"></el-input-number>
						</el-form-item>
						<el-form-item v-if="commandNumber" label="导入优惠券">
							<el-upload
								class="upload-demo"
								action="https://jsonplaceholder.typicode.com/posts/"
								:on-change="handleChange"
								:file-list="fileList">
								<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</div></el-col>
				</el-row>

			</el-form>
			<div slot="footer" style="display: flex;justify-content: center">
				<el-button @click="cancle">取 消</el-button>
				<el-button type="primary" @click="saveOne">保存</el-button>
			</div>
			<el-dialog :visible.sync="dialogImg">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</el-dialog>

	</div>
</template>
<script>
	import axios from 'axios'
	import { mapGetters } from 'vuex'
	import {getScenarioData, getCouponsList, postCouponsData, changeCouponsStatus,deleteCouponsList } from '@/api/coupons'
	export default {
		name: 'sceneLoad',
		data() {
			return {
				actionUrl: `${process.env.VUE_APP_HTTP_MG}/mg/coupons`,
				importCoupons:'导入优惠券',
				dialogImageUrl:'',
				dialogTableVisible: false,
				formInline: {
					name:'',
					scene: [],
					status:null,
					type:null
				},
				commandNumber:true,
				dialogVisible: false,
				dialogImg:false,
				couponsFlag:{
					id:'',
					storeId:[],
					couponType:'1',
					name:'',
					limit:'',
					weight:'',
					time:'',
					description:'',
					level:'',
					iconBase64:'',
					credit:'',
					creditNum:''
				},
				couponsFlag2:{
					id:'',
					storeId:[],
					couponType:'1',
					name:'',
					limit:'',
					weight:'',
					time:'',
					description:'',
					level:'',
					iconBase64:'',
					credit:'',
					creditNum:''
				},
				fileList:[],
				sceneList:[],
				page: {
					total: 20,
					size: 10,
					current: 1
				},
				ruleForm: {
					name: '',
					scene: '',
					max: '',
					dayMax: ''
				},
				rules: {
					name: [
						{required: true, message: '请输入场景名称', trigger: 'blur'}
					],
					scene: [
						{required: true, message: '请输入场景', trigger: 'blur'}
					],
					max: [
						{required: true, message: '每日每人领取上线', trigger: 'blur'}
					],
					dayMax: [
						{required: true, message: '每日总领取上线', trigger: 'blur'}
					]
				},
				couponsFlagRules:{
					name: [
						{required: true, message: '请输入优惠券名称', trigger: 'blur'}
					],
					couponType:[
						{required: true, message: '请选择场景名称', trigger: 'change'}
					],
					limit:[
						{required: true, message: '请输入每日发放量限制', trigger: 'blur'}
					],
					weight:[
						{required: true, message: '请输入权重', trigger: 'blur'}
					],
					time:[
						{required: true, message: '请输入开始时间', trigger: 'blur'}
					]

				},
				tableData: [
					{
						"weight": 10,
						"begin": 1560239639000,
						"name": "优惠券1",
						"scenarios": [],
						"createTime": 1560239747000,
						"description": "",
						"icon": "",
						"credit": 0,
						"creditNum": 0,
						"stores": [],
						"id": 4,
						"status": 1,
						"couponType": 1,
						"end": 1560239639000,
						"limit": 2,
						"level": ""
					},
				]
			}
		},
		methods: {
			getBase64(file) {
				return new Promise(function (resolve, reject) {
					let reader = new FileReader()
					let imgResult = ''
					reader.readAsDataURL(file)
					reader.onload = function () {
						imgResult = reader.result
					}
					reader.onerror = function (error) {
						reject(error)
					}
					reader.onloadend = function () {
						resolve(imgResult)
					}
				})
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			getFile(file, fileList) {
				this.getBase64(file.raw).then(res => {
					this.couponsFlag.iconBase64 = res
					console.log(this.couponsFlag)
				})
			},
			handleRemove(file, fileList) {
				console.log(file, fileList)
			},
			handleAvatarSuccess(res, file) {
				this.couponsFlag.iconBase64 = URL.createObjectURL(file.raw)
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url
				this.dialogImg = true
			},
			handleCommand(command) {
				if(command === '1'){
					this.couponsFlag = this.couponsFlag2
					this.commandNumber = true
					this.importCoupons = '导入优惠券'
					this.dialogTableVisible = true
				}else{
					this.couponsFlag = this.couponsFlag2
					this.commandNumber = false
					this.importCoupons = '导入积分券'
					this.dialogTableVisible = true
				}
			},
			onSubmit() {

			},
			addSence() {
				this.dialogTableVisible = true
			},
			cancle() {
				this.dialogTableVisible = false
			},
			edit(row) {
				this.dialogTableVisible = true
				this.couponsFlag = row
			},
			// 查看记录
			lookRecord(row){
				const _id = row.id
				this.$router.push({
					path: "/record",
					query: {
						id: _id
					}
				})
			},
			// 修改状态
			changeStatus(row){
				const _status = row.status === 0 ? 1 : 0
				const _data = {
					id : row.id,
					status: _status
				}
				changeCouponsStatus(_data).then(res =>{
					this.$message({
						message: '已修改成功',
						type: 'success'
					})
					this.searchCouponsList()
				})
			},
			// 删除优惠券
      deleteCoupon(row){
				const data = {
					id :row.id
				}
				deleteCouponsList(data).then(res =>{
					this.$message({
						message: '已删除',
						type: 'success'
					})
					this.searchCouponsList()
				})
			},
			saveOne(){
				// this.dialogTableVisible = false
				this.$refs['couponsFlag'].validate((valid) => {
					if (valid) {
						const times = this.couponsFlag.time
						const startTime = times[0]
						const endTime = times[1]
						this.couponsFlag.begin = startTime
						this.couponsFlag.end = endTime
						delete this.couponsFlag.time
						console.log('保存的东西2',this.couponsFlag,this.fileList)
						// const data = {
						// 	json :this.couponsFlag,
						// 	cardNo: this.fileList
						// }
						// id:'',
						// 	storeId:[],
						// 	couponType:'1',
						// 	name:'',
						// 	limit:'',
						// 	weight:'',
						// 	time:'',
						// 	description:'',
						// 	level:'',
						// 	iconBase64:'',
						// 	credit:'',
						// 	creditNum:''
						const {id,storeId,couponType,name,limit,weight,begin,end,description,level,iconBase64,credit,creditNum} = this.couponsFlag
						let form = new FormData();
						form.append("cardNo", this.fileList);
						// form.append("id", this.couponsFlag.id);
						form.append("storeId", this.couponsFlag.storeId);
						form.append("couponType", this.couponsFlag.couponType);
						form.append("name", this.couponsFlag.name);
						form.append("limit", this.couponsFlag.limit);
						form.append("weight", this.couponsFlag.weight);
						form.append("begin", this.couponsFlag.begin);
						form.append("end", this.couponsFlag.end);
						form.append("description", this.couponsFlag.description);
						form.append("level", this.couponsFlag.level);
						form.append("iconBase64", this.couponsFlag.iconBase64);
						form.append("credit", this.couponsFlag.credit);
						form.append("creditNum", this.couponsFlag.creditNum);
						// this.importCouponByUser(data)

						postCouponsData(form).then(res =>{
							console.log(res)
						})
					} else {
						return false
					}
				})
			},
			// async importCouponByUser(data) {
			// 	const rsp = await this.$http.post(
			// 		'/mg/coupons',
			// 		data,
			// 		{
			// 			headers: {
			// 				'Content-Type': 'multipart/form-data'
			// 			}
			// 		}
			// 	)
			// 	console.log(rsp.data)
			// },
			submit() {
				this.dialogTableVisible = false
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {

					} else {
						return false
					}
				})
			},
			handleSizeChange(val) {
				this.page.size = val
				this.searchCouponsList()
			},
			handleCurrentChange(val) {
				this.page.current = val
				this.searchCouponsList()
			},
			next(val) {
				this.$emit('nextComponet', val)
			},
			init(storeId){
				const _storeId = storeId || this.$store.state.app.storeId
				// const _params = {
				// 	storeId: _storeId
				// }
				this.getSceneList()
				this.searchCouponsList(_storeId)
			},
			// 获取场景列表 先用size方法查，后期优化
			getSceneList() {
				const size = 10000
				getScenarioData(size).then(res =>{
					this.sceneList = res.data
				})
			},

			// 优惠券列表查询
			searchCouponsList(_storeId){
				const _data = {
					storeId:_storeId || this.$store.state.app.storeId,
					name: this.formInline.name,
					scenarioId: this.formInline.scene,
					couponType: this.formInline.type,
					status: this.formInline.status,
					page: this.page.page,
					size: this.page.size
				}
				console.log('调用方法')
				getCouponsList(_data).then(res =>{
					this.page.page = res.page
					this.page.size = res.size
					this.page.total = res.total
					// this.tableData = res.data
				})
			}
		},
		computed: {
			...mapGetters([
				'storeList'
			]),
			listenstage() {
				return this.$store.state.app.storeId
			}
		},
		watch: {
			listenstage(newVal) {
				this.searchCouponsList(newVal)
			}
		},
		mounted() {
			if (!window.FileReader) {
				console.error('Your browser does not support FileReader API!')
			}
			this.fileReader = new FileReader()
			this.init()
			// this.getSceneList()
			// for (let i = 0; i < 9; i++) {
			// 	this.tableData.push(this.tableData[0])
			// }
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../styles/config.scss";
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
