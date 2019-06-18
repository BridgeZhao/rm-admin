<template>
  <div class="app-container">
    <!--头部按钮-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dateTimes"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
				<el-button-group>
					<el-button type="primary" @click="()=>{pageChange(1)}">查询</el-button>
					<el-button @click="clearSearch">清空</el-button>
				</el-button-group>
      </el-form-item>
    </el-form>
   <!--数据列表-->
    <!--<el-table-->
      <!--v-loading="tableLoading"-->
      <!--:data="tableData"-->
      <!--element-loading-text="Loading"-->
      <!--border-->
      <!--stripe-->
    <!--&gt;-->
      <!--<el-table-column-->
        <!--label="ID"-->
        <!--width="80">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.id }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--label="头像"-->
        <!--width="80">-->
        <!--<template slot-scope="scope">-->
          <!--<img :src="scope.row.avatar" class="avatar">-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--label="门店名">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag :type="'info'">-->
            <!--{{ storeList.find(s_item => { return s_item.id === scope.row.storeId }).name }}-->
          <!--</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="gender"-->
        <!--label="性别"-->
        <!--width="150"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag :type="'info'">-->
            <!--{{(scope.row.gender==='m'?'男':scope.row.gender==='w'?'女':'未知') }}-->
          <!--</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="age"-->
        <!--label="年龄"-->
        <!--width="150"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="注册时间"-->
        <!--width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<i class="el-icon-time"></i>-->
          <!--<span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  <el-row v-loading="tableLoading">
    <el-col :xs="8" :sm="4" :md="5" :lg="4" :xl="3" v-for="(item, index) in tableData" :key="index">
      <div class="user-box">
        <img :src="item.avatar" class="avatar" />
        <p><span>{{ storeList.find(s_item => { return s_item.id === item.storeId }).name }}</span></p>
        <p class="inline"><label>性别：</label><span>{{ item.gender==='m'?'男':item.gender==='w'?'女':'未知' }}</span></p>
        <p class="inline"><label>年龄：</label><span>{{ item.age }}</span></p>
        <p><span>{{ item.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span></p>
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
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVirtualMember } from '@/api/member'
export default {
  data() {
    return {
      dateTimes: [],
      tableLoading: false,
      form: {
        name: '',
        storeId: '',
        begin: '',
        end: ''
      },
      pagination: {
        page: 1,
        size: 24,
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
      if (this.dateTimes.length) {
        this.form.begin = this.dateTimes[0]
        this.form.end = this.dateTimes[1]
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
    clearSearch() {
      this.dateTimes = []
      this.form = {
        name: '',
        storeId: '',
        begin: '',
        end: ''
      }
    },
    pageChange(val) {
      this.pagination.page = ~~val
      this.getTableData()
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
.gender{

}
.user-box{
	transition: all .5s;
	transform: scale3d(1, 1, 1);
  background: #00172f !important;
  border: 1px solid #418aaa;
  box-shadow: 1px 1px 4px 1px #000000;
  padding: 10px;
	margin: 10px;
  font-size: 12px;
  font-weight: normal;
  p{ margin-top:10px}
  p:last-child{ margin-bottom:10px}
	&:hover{
		box-shadow: 3px 8px 15px 3px #000000;
		transition: all .2s linear;
		transform: scale3d(1.05, 1.05, 1.05);
	}
}
.avatar{
  width: 100%;
}
</style>
