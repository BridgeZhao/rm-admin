<template>
    <div class="config">
        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="场景">
                    <el-input v-model="formInline.scene" placeholder="场景"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addSence">新增场景关联</el-button>
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="ID"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="发放场景"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="优惠券"
                    align="center"
										prop="coupons"
										show-overflow-tooltip>
							<template slot-scope="scope">
								<div v-if="Array.isArray(scope.row.coupons)">
									<ul style="list-style: none;display: flex;justify-content: left;padding: 0;overflow: hidden;height: 20px;">
										<li v-for="(item,index) in scope.row.coupons" :key="item.couponId">
											<span>{{index+1}}、{{item.name}};</span>
										</li>
									</ul>
								</div>
								<span v-else></span>
							</template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button type="text" style="margin-right: 10px;" @click="edit(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" size="mini" @click="deleteData(scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="page.size"
                class="pagination"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
        </el-pagination>
        <div class="footer">
            <el-button type="primary" size="mini" style="width: 100px;" @click="next">上一步</el-button>
        </div>
        <el-dialog title="新增场景" :visible.sync="dialogTableVisible">
            <new-recore ref="newRecord" v-if="dialogTableVisible" :rows="childRow"></new-recore>
            <div slot="footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
	import newRecore from "@/components/couponsComponents/newRecore";
	// import Sortable from 'sortablejs'
	import {searchConnection, getScenarioData,delSceneData} from '@/api/coupons'
  export default {
    name: 'sceneConnect',
    data() {
      return {
        dialogTableVisible:false,
				childRow:{},
        formInline: {
          scene: ''
        },
        page: {
          total: 20,
          size: 10,
          current: 1
        },
        ruleForm:{
					scenarioId:'',
					index: '',
					couponId: '',
        },
        rules: {
					index: [
            {required: true, message: '请输入排序', trigger: 'blur'},
          ],
					scenarioId: [
            {required: true, message: '请输入发放场景', trigger: 'blur'},
          ],
					couponId: [
            {required: true, message: '每日优惠券', trigger: 'blur'},
          ],

        },
        tableData: [],
				sceneList:[],
				col: [
					{
						label: '日期',
						prop: 'name'
					}
				],
				dropCol: [
					{
						label: '日期',
						prop: 'name'
					}

				]
      }
    },
		components:{
			newRecore
		},
		mounted() {
			this.loadData()
		},
    methods: {
			search(){
        this.loadData()
			},
      addSence() {
        this.dialogTableVisible = true;
				this.childRow = {}
      },
      cancle(){
        this.dialogTableVisible = false;
      },
      edit(row){
      	console.log('this row,',row)
        this.dialogTableVisible = true
				this.childRow = row
      },
			deleteData(row){
				delSceneData(row.id).then(res =>{
					this.$message({
						showClose: true,
						message: '恭喜你，删除成功！',
						type: 'success'})
					this.loadData()
				})
			},
      submit(){ // 保存
				this.$refs.newRecord.postData();
				this.dialogTableVisible = false;
				this.formInline.scene = ''
				this.childRow = {}
				this.loadData()
      },
      handleSizeChange(val) {
        this.page.size = val
      },
      handleCurrentChange(val) {
        this.page.current = val
      },
      next(){
        this.$emit('nextComponet',2);
      },
			loadData(){
				let _name = this.formInline.scene
				let obj = {
					name: _name,
					size: this.page.size,
					page: this.page.current
				}
				searchConnection(obj).then(res =>{
					console.log(res.data)
					this.page.size = res.size
					this.page.current = res.page
					this.page.total = res.total
					this.tableData = res.data
				})
				// this.getSceneList()

			},
			// 获取场景列表 先用size方法查，后期优化
			getSceneList() {
				const size = 10000
				getScenarioData(size).then(res =>{
					this.sceneList = res.data
				})
			}
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../styles/config.scss";
</style>
