<template>
    <div class="config">
        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="场景">
                    <el-input v-model="formInline.scene" placeholder="场景" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="mini" @click="addSence">新增场景</el-button>
        </div>
        <el-table
                :data="tableData"
                border
                size="mini"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="场景名称"
                    min-width="120"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="scene"
                    label="场景"
                    min-width="120"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="max"
                    label="每日没人领取上限"
                    min-width="160"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="dayMax"
                    label="每日总领取上限"
                    min-width="160"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="150"
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
            <el-button size="mini" style="width: 100px;margin-right: 10px;" @click="next(1)">上一步</el-button>
            <el-button type="primary" size="mini" style="width: 100px;" @click="next(3)">下一步</el-button>
        </div>
        <el-dialog title="新增场景" :visible.sync="dialogTableVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
                <el-form-item label="场景名称" prop="name">
                    <el-input v-model="ruleForm.name" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="场景" prop="scene">
                    <el-input v-model="ruleForm.scene" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="每日每人领取上线" prop="max">
                    <el-input v-model="ruleForm.max" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="每日总领取上线" prop="dayMax">
                    <el-input v-model="ruleForm.dayMax" size="mini"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancle" size="mini">取 消</el-button>
                <el-button type="primary" @click="submit" size="mini">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    name: 'sceneLoad',
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
          name: '',
          scene: '',
          max: '',
          dayMax: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入场景名称', trigger: 'blur'},
          ],
          scene: [
            {required: true, message: '请输入场景', trigger: 'blur'},
          ],
          max: [
            {required: true, message: '每日每人领取上线', trigger: 'blur'},
          ],
          dayMax: [
            {required: true, message: '每日总领取上线', trigger: 'blur'},
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
      next(val){
        this.$emit('nextComponet',val);
      }
    },
    mounted() {
      for (let i = 0; i < 9; i++) {
        this.tableData.push(this.tableData[0])
      }

    }
  }
</script>
<style lang="scss" scoped>
    @import "../../styles/config.scss";
</style>
