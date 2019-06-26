<template>
  <div class="app-container">
    <!--头部按钮-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="注册时间">
				<el-date-picker
					style="width: 270px"
					v-model="dateTimes"
					type="daterange"
					format="yyyy-MM-dd"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="timestamp"
					:default-time="['00:00:00', '23:59:59']"
				/>
      </el-form-item>
      <el-form-item>
				<el-button-group>
        <el-button type="primary" @click="()=>{pageChange(1)}">查询</el-button>
        <el-button @click="clearSearch">清空</el-button>
				</el-button-group>
      </el-form-item>
    </el-form>
    <!--数据列表-->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      stripe
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"/>
      <el-table-column
        prop="storeName"
        label="门店名"
        width="150"
      />
      <el-table-column
        prop="deviceName"
        label="注册设备"
        width="150"
      />
      <el-table-column
        prop="memberNo"
        label="会员卡号"
        width="150"
      />
      <el-table-column
        label="注册场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.scenario | scenarioTransName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column
        label="注册时间"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
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
import moment from 'moment'
import { mapGetters } from 'vuex'
import {getRegisterMember} from '@/api/member'
export default {
  filters: {
    scenarioTransName: function (value) {
      let str = '未知'
      switch (value) {
        case 'ticket':
          str = '优惠券'
          break
      }
      return str
    }
  },
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
				this.form.begin =this.dateTimes[0]
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
      getRegisterMember(_pagination).then(res => {
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
				storeId:this.storeId,
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
  .gender {

  }

  .user-box {
    animation-duration: 0.5s;
    animation-name: fadeIn;
    background: #00172f !important;
    border: 1px solid #418aaa;
    box-shadow: 0 0 4px 0 #000000;
    margin: 10px;
    padding: 10px;
    font-size: 12px;
    font-weight: normal;
    p {
      margin-top: 10px
    }
    p:last-child {
      margin-bottom: 10px
    }
  }

  .avatar {
    width: 100%;
  }
</style>
