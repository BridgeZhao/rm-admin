<template>
  <div class="config">
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="场景">
          <el-input v-model="formInline.scene" placeholder="场景" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addSence">
        新增场景
      </el-button>
    </div>
    <el-table
      :data="tableData"
      border
      size="mini"
      style="width: 100%;margin-bottom: 10px;"
    >
      <el-table-column
        prop="name"
        label="场景名称"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="dayLimit"
        label="每人每日领取上限"
        min-width="160"
        align="center"
      />
      <el-table-column
        prop="totalLimit"
        label="每人总领取上限"
        min-width="160"
        align="center"
      />
      <el-table-column
        label="操作"
        min-width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" style="margin-right: 10px;" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteData(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.size"
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="footer">
      <el-button type="primary" style="width: 100px;" @click="next">
        下一步
      </el-button>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="140px" 
        style="width: 60%;
		margin-left: 20%;
		margin-top: 2%;"
      > 
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="每人每日领取上限" prop="dayLimit">
          <el-input-number v-model="ruleForm.dayLimit" :controls="false" :min="1" :max="10000" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="每人总领取上限" prop="totalLimit">
          <el-input-number v-model="ruleForm.totalLimit" :controls="false" :min="1" :max="10000" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="width: 80%;">
        <el-button @click="cancle">
          取 消
        </el-button>
        <el-button type="primary" @click="submit">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
	import moment from 'moment'
	import {setScenarioData, getScenarioData, delScenarioData } from '@/api/coupons'
	export default {
		name: 'SceneSetting',
		data() {
			return {
				dialogTitle:'新增场景',
				dialogTableVisible: false,
				formInline: {
					scene: ''
				},
				page: {
					name:'',
					page:1,
					size: 10
				},
				total: 0,
				current: 1,
				ruleForm: {
					name: '',
					dayLimit: null,
					totalLimit: null
				},
				rules: {
					name: [
						{required: true, message: '请输入场景名称', trigger: 'blur'}
					],
					dayLimit: [
						{required: true, message: '每人每日领取上限', trigger: 'blur'}
					],
					totalLimit: [
						{required: true, message: '每人总领取上限', trigger: 'blur'}
					]
				},
				tableData: [
					{
						name: '场景名称1',
						scene: '场景场景场景场景',
						max: '12',
						dayMax: '11'
					}
				]
			}
		},
		mounted() {
			this.getTableList()
		},
		methods: {
			dispose(row, column, cellValue, index){
				return moment(cellValue).format('YYYY-MM-DD')
			},
			addSence() {
				this.dialogTableVisible = true
				this.dialogTitle = '新增场景'
				this.ruleForm = {
					name: '',
					dayLimit: null,
					totalLimit: null
				}
			},
			cancle() {
				this.dialogTableVisible = false
				this.$refs['ruleForm'].resetFields()
				// this.getTableList()
			},
			edit(row) {
				this.dialogTableVisible = true
				this.ruleForm = row
				this.dialogTitle = '修改场景'
			},
			deleteData(row){
				const _id = row.id
				console.log('删除',_id)
				delScenarioData(_id).then(res =>{
					if(res === 'OK'){
						this.$message({
							message: '删除成功！',
							type: 'success'
						})
						this.getTableList()
					} else{
						this.$message({
							message: '删除失败！',
							type: 'warning'
						})
					}
				})
			},
			submit() {
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						const data = this.ruleForm
						setScenarioData(data).then(res =>{
							if(res === 'OK'){
								this.$message({
									message: this.dialogTitle === '新增场景' ? '添加成功！' : '修改成功！',
									type: 'success'
								})
								this.formInline.scene = ''
								this.getTableList()
								this.dialogTableVisible = false
							} else{
								this.$message({
									message: this.dialogTitle === '新增场景' ? '添加失败' :'修改失败',
									type: 'warning'
								})
								this.dialogTableVisible = false
							}
						})
					}else {
						return false
					}
				})
			},
			handleSizeChange(val) {
				this.page.size = val
				this.getTableList()
			},
			handleCurrentChange(val) {
				this.current = val
				this.page.page = val
				this.getTableList()
			},
			next() {
				this.$emit('nextComponet', 2)
			},
			search(){
				this.page.page = 1
				this.getTableList()
			},
			getTableList() {
				this.page.name = this.formInline.scene
				const _data = this.page
				getScenarioData(_data).then(res =>{
					console.log('res',res)
					this.page.page = res.page
					this.page.size = res.size
					this.total = res.total
					this.tableData = res.data
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../styles/config.scss";
</style>
