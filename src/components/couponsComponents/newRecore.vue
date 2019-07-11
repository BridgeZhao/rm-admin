<template>
  <div class="newRecore">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="发放场景" prop="scenarioId">
        <el-select v-model="ruleForm.scenarioId" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in sceneList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="卡券" prop="couponId">
        <el-select v-model="ruleForm.couponId" clearable filterable multiple placeholder="请选择" @change="changeEvent">
          <el-option
            v-for="item in couponsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div id="box">
      <el-table
        :data="newTableData"
        border
        max-height="250"
        row-key="id"
        align="left"
        class="box"
      >
        <el-table-column
          type="index"
        />
        <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          :prop="dropCol[index].prop"
          :label="item.label"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click.native.prevent="deleteRow(scope.$index, newTableData)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
	import Sortable from 'sortablejs'
	import {getScenarioData, getCouponsList,sceneBind} from '@/api/coupons'
	export default{
		name:'NewRecord',
		props:{
			'rows':Object
		},
		data(){
			return{
				ruleForm:{
					scenarioId:'',
					index: '',
					couponId: []
				},
				newTableData:[],
				col: [
					{
						label: '卡券',
						prop: 'name'
					}
				],
				dropCol: [
					{
						label: '卡券',
						prop: 'name'
					}
				],
				rules: {
					scenarioId: [
						{required: true, message: '请输入发放场景', trigger: 'blur'}
					],
					couponId: [
						{required: true, message: '每日优惠券', trigger: 'blur'}
					]
				},
				sceneList:[],
				couponsList:[]

			}
		},
		created(){
			this.makeRows()
		},
		mounted(){
			this.rowDrop()
			this.getSceneList()
			this.getCouponsList()
		},
		methods:{
			// 处理rows
			makeRows(){
				this.$nextTick(() =>{
					this.ruleForm.scenarioId = this.rows.id
					this.newTableData = this.rows.coupons
					if(Array.isArray(this.rows.coupons)){
						let arr = this.rows.coupons.map((item,index) =>{
							return item.couponId
						})
						arr = JSON.parse(JSON.stringify(arr))
						this.ruleForm.couponId = arr
					}else{
						this.ruleForm.couponId = []
					}

					console.log('this.rows',this.rows,this.ruleForm.couponId,this.ruleForm.scenarioId)
				})
			},
			// 获取场景列表 先用size方法查，后期优化
			getSceneList() {
				const size ={
					size:10000
				}
				getScenarioData(size).then(res =>{
					this.sceneList = res.data
				})
			},
			// 获取优惠券列表 先用size方法查 后期优化
			getCouponsList(){
				const size ={
					size:10000
				}
				getCouponsList(size).then(res =>{
					console.log('res',res)
					this.couponsList = res.data
				})
			},
			changeEvent(vel){
				const arr = []
				console.log(this.couponsList)
				vel.forEach(item =>{
					arr.push(this.couponsList.find((y)=>{
						return y.id === item
					}))
				})
				this.$nextTick(function(){
						this.newTableData = arr
				})
				console.log(arr)
			},
			deleteRow(index, rows) {
				const num =  this.ruleForm.couponId.findIndex(item => item === rows[index].couponId)
				console.log('index',index,'表格',rows,'num',num,'this.ruleForm.couponId:',this.ruleForm.couponId)
				this.$nextTick(function () {
					this.ruleForm.couponId.splice(num, 1)
				})
				rows.splice(index, 1)
				console.log('this.ruleForm.rows---',this.newTableData)
			},
			// 保存像后台传新增的场景关联的值
			postData(){
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						const _scenarioId = this.ruleForm.scenarioId
						let arr = []
						arr = this.newTableData.map((item,index) =>{
							return 	{'couponId':item.id ? item.id : item.couponId,'index':index + 1}
						})
						let obj = {
							scenarioId:_scenarioId,
							coupons:arr
						}
						obj = JSON.parse(JSON.stringify(obj))
						sceneBind(obj).then(res =>{
							if(res === 'OK'){
								this.$message({
									showClose: true,
									message: '操作成功！',
									type: 'success'})
									this.$emit('listenClose')
							}else{
								this.$message({
								showClose: true,
								message: res.msg,
								type: 'warning'})
								this.$emit('listenClose')
							}
						})
					} else {
						return false
					}
				})
			},
			rowDrop() {
				const tbody = document.querySelector('.box .el-table__body-wrapper tbody')
				const _this = this
				Sortable.create(tbody, {
					onEnd({ newIndex, oldIndex }) {
						const currRow = _this.newTableData.splice(oldIndex, 1)[0]
						console.log('currRow',currRow)
						_this.newTableData.splice(newIndex, 0, currRow)
						const currRow1 = _this.newTableData
						console.log('currRow1',currRow1)
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.newRecore .el-button--text[data-v-3a30a0cc] {
		border-color: transparent !important;
	}
</style>
