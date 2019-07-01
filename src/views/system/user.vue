<template>
  <div class="app-container">
    <!--添加用户-->
    <el-dialog
			v-drag-dialog
      :title="dialogType==='add'?'管理员添加':'管理员修改'"
      append-to-body
      :width="'620px'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="clearClose">
      <el-form v-loading="loading" :model="form" :rules="rules" ref="myform">
        <el-form-item label="登录名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="登陆密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" prop="storeIds"  :label-width="formLabelWidth">
          <el-select
            v-model="form.storeIds"
            multiple
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
        <el-form-item label="所属角色" prop="roleIds" :label-width="formLabelWidth">
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="form.enabled">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnSubmit('myform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-row class="table-head-btns">
			<el-col :span="12" class="flex">
				<el-input
					style="width: 300px;margin-right: 10px"
					placeholder="请输入用户名"
					v-model="pagination.name">
					<i slot="prefix" class="el-input__icon el-icon-search"></i>
				</el-input>
				<el-button type="primary" icon="el-icon-search" @click="getUsers">搜索</el-button>
			</el-col>
			<el-col :span="12" style="text-align: right">
        <el-button v-permission="'add'" type="primary" @click="openDialog">+ 添加管理员</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
    >
      <el-table-column
        label="ID"
        width="80"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="登录名"
        width="150"
      />
      <el-table-column
        prop="storeIds"
        :formatter="storeTransName"
        label="门店"
      />
      <el-table-column
        label="角色"
        prop="rolesIds"
        :formatter="roleTransName"
      />
      <el-table-column
        label="状态"
				width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled?'':'danger'">{{ scope.row.enabled?'启用':'停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.username!=='admin'" v-permission="'edit'">
            <el-button
              size="small"
              @click.native.prevent="editRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="'delete'"
              type="danger"
              size="small"
              @click.native.prevent="deleteRow(scope.row.id)"
            >
              删除
            </el-button>
          </div>
          <div v-else>
            无法操作
          </div>
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
import { mapGetters } from 'vuex'
import {getMenus, getAllRoles} from '@/api/system'
import {userQuery, addUser, delUser,updateUser} from '@/api/user'
import {menuTransTree} from '@/utils'
export default {
  data() {
    return {
      dialogType: 'add',
      formLabelWidth: '85px',
      loading: true,
      dialogVisible: false,
      menusData: [],
      menuList: [],
      rolesList: [],
      tableData: [],
			pagination: {
				page: 1,
				size: 10,
				name: '',
				storeId:0,
				total: 0
			},
			rules: {
				username: [
					{required: true, message: '请输入登陆名称', trigger: 'blur'},
					{min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'}
				],
				storeIds:[{ required: true, message: '请选择所属门店', trigger: 'change'}],
				roleIds:[{ required: true, message: '请选择所属角色', trigger: 'change'}]
			},
      form: {
        username: '',
        password: '',
        email: '',
        storeIds: [],
        roleIds: [],
        enabled: true,
        userType: 'hall'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
		...mapGetters([
			'storeList',
			'storeId'
		])
  },
  async created() {
  	this.pagination.storeId=this.storeId
    this.getMenus()
    await this.getAllRoles()
    this.getUsers()
  },
  methods: {
    getUsers() {
      userQuery(this.pagination).then(res => {
				const {size, total, page, data} = res
				this.tableData = data
				this.pagination.total = total
				this.pagination.page = page
				this.pagination.size = size
      }).finally(() => {
        this.loading = false
      })
    },
		getAllRoles() {
      return new Promise(resolve => {
        getAllRoles().then(res => {
          this.rolesList = res.data
          resolve(res)
        })
      })
    },
    getMenus() {
      return new Promise(resolve => {
        getMenus().then(res => {
          const newMenusObj = menuTransTree(res)
          this.menusData = newMenusObj.menusTree
          this.menuList = newMenusObj.menuFristList
          resolve(res)
        })
      })
    },
    storeTransName(idAry) {
      const nameAry = []
			if(idAry&&idAry.storeIds) {
				for (let i = 0; i < idAry.storeIds.length; i++) {
					const t = this.storeList.find(s_item => {
						return s_item.id === idAry.storeIds[i]
					})
					if (t) {
						nameAry.push(t.name)
					}
				}
			}
			return nameAry.join('-')
    },
    roleTransName(idAry) {
      const nameAry = []
			if(idAry&&idAry.roleIds) {
				for (let i = 0; i < idAry.roleIds.length; i++) {
					const _r = this.rolesList.find(s_item => {
						return s_item.id === idAry.roleIds[i]
					})
					if (_r) {
						nameAry.push(_r.roleName)
					}
				}
			}

      return nameAry.join('；')
    },
    btnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const _data=this.form
          const _function=this.dialogType === 'edit'?updateUser:addUser
          _function(_data).then(() => {
            this.clearClose('reload')
            this.$message.success('操作成功')
          }).finally(()=>{
						this.loading = false
					})
        }
      })
    },
    editRow(data) {
      this.dialogType = 'edit'
      this.form = Object.assign({}, data)
      this.dialogVisible = true
    },
    deleteRow(id) {
      console.log(this)
      this.$confirm('确认删除此条数据吗？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(id).then(() => {
          this.clearClose('reload')
          this.$message.success('操作成功')
        })
      })
    },
    clearClose(reload) {
			this.dialogVisible = false
			if (reload === 'reload') {
				this.getUsers()
			}
			const f = this.$refs['myform']
			if (f) {
				f.resetFields()
			}
			this.form = {
				username: '',
				password: '',
				email: '',
				storeIds: [],
				roleIds: [],
				enabled: true,
				userType:'hall'
			}
		},
		pageChange(val){
			this.pagination.page = val
			this.getUsers()
		},
    openDialog(){
      this.dialogType = 'add'
      this.dialogVisible=true
    },
		clearGetUsersData() {
			this.pagination.page = 1
			this.pagination.size = 10
			this.getUsers()
		},
		// 全局门店下拉修改
		$storeIdChanged(storeId){
			if(storeId){
				this.pagination.storeId=storeId
				this.clearGetUsersData()
			}
		}
  }
}
</script>

<style lang="scss" scoped>
.app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
