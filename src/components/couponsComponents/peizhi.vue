<template>
  <div>
    <div class="couponsHead">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="场景">
          <el-select v-model="formInline.scene" placeholder="场景">
            <el-option label="场景1" value="shanghai" />
            <el-option label="场景2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-circle-plus">
        新增场景
      </el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="250"
      >
        <el-table-column
          fixed
          prop="date"
          label="日期"
          width="150"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="province"
          label="省份"
          width="120"
        />
        <el-table-column
          prop="city"
          label="市区"
          width="120"
        />
        <el-table-column
          prop="address"
          label="地址"
          width="300"
        />
        <el-table-column
          prop="zip"
          label="邮编"
          width="120"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
    name:'Peizhi',
    data(){
        return{

        }
    }

}
</script>
