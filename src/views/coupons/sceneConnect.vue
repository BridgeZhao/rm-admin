<template>
    <div class="config">
        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="场景">
                    <el-input v-model="formInline.scene" placeholder="场景"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
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
                    prop="coupons"
                    label="优惠券"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" style="margin-right: 10px;" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="mini">删除</el-button>
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
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
                <el-form-item label="发放场景" prop="scene">
                    <el-input v-model="ruleForm.scene" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="卡券" prop="max">
                    <el-input v-model="ruleForm.max" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
	import {searchConnection} from '@/api/coupons'
  export default {
    name: 'sceneConnect',
    data() {
      return {
        dialogTableVisible:false,
        formInline: {
          scene: ''
        },
        page: {
          total: 20,
          size: 10,
          current: 1
        },
        ruleForm:{
        	id:'',
          name: '',
					coupons: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入ID', trigger: 'blur'},
          ],
          scene: [
            {required: true, message: '请输入发放场景', trigger: 'blur'},
          ],
          max: [
            {required: true, message: '每日优惠券', trigger: 'blur'},
          ],

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
			for (let i = 0; i < 9; i++) {
				this.tableData.push(this.tableData[0])
			}

		},
    methods: {
      onSubmit() {

      },
      addSence() {
        this.dialogTableVisible = true;
      },
      cancle(){
        this.dialogTableVisible = false;
      },
      edit(row){
        this.dialogTableVisible = true;
        this.ruleForm = row;
      },
      submit(){
        this.dialogTableVisible = false;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {

          } else {
            return false;
          }
        });
      },
      handleSizeChange(val) {
        this.page.size = val
      },
      handleCurrentChange(val) {
        this.page.current = val
      },
      next(){
        this.$emit('nextComponet',2);
      }
    },
		loadData(){
			let name = this.formInline.scene
			searchConnection(name).then(res =>{

			})

		}

  }
</script>
<style lang="scss" scoped>
    @import "../../styles/config.scss";
</style>
