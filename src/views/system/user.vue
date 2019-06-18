<template>
  <div class="app-container">
    <!--添加用户-->
    <el-dialog
      :title="dialogType==='add'?'管理员添加':'管理员修改'"
      append-to-body
      :width="'620px'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @click="dialogVisible = false">
      <el-form v-loading="loading" :model="form" ref="myform">
        <el-form-item label="账号类型" :label-width="formLabelWidth">
          <el-select
            v-model="form.userType"
            placeholder="请选择">
            <el-option
              v-for="item in accountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogType!=='edit'" label="登陆密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" :label-width="formLabelWidth">
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
        <el-form-item v-show="form.userType==='hall'" label="所属角色" :label-width="formLabelWidth">
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
    <el-row :gutter="20" class="table-head-btns">
      <el-col style="text-align: right">
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
        width="180"
      />
      <el-table-column
        prop="storeIds"
        :formatter="storeTransName"
        label="门店"
        width="400"
      />
      <el-table-column
        label="角色"
        prop="rolesIds"
        :formatter="roleTransName"
        width="300"
      />
      <el-table-column
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.userType==='device'?'':'success'">{{ scope.row.userType==='device'?'设备账号':'普通账号' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled?'':'danger'">{{ scope.row.enabled?'启用':'停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
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
      stopRefresh: true,
      formLabelWidth: '70px',
      loading: true,
      dialogVisible: false,
      menusData: [],
      menuList: [],
      rolesList: [],
      tableData: [],
      form: {
        username: '',
        password: '',
        email: '',
        storeIds: [],
        roleIds: [],
        enabled: true,
        userType: 'hall'
      },
      accountList: [{
        value: 'hall',
        label: '普通账号'
      }, {
        value: 'device',
        label: '设备账号'
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
		...mapGetters([
			'storeList'
		])
  },
  async created() {
    this.getMenus()
    await this.getRoles()
    this.getUsers()
  },
  methods: {
    getUsers() {
      userQuery().then(res => {
        this.tableData = res
        this.$nextTick(() => {
          this.stopRefresh = false
        })
      }).finally(() => {
        this.loading = false
      })
    },
    getRoles() {
      return new Promise(resolve => {
        getAllRoles().then(res => {
          this.rolesList = res
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
      for (let i = 0; i < idAry.storeIds.length; i++) {
        nameAry.push(this.storeList.find(s_item => {
          return s_item.id === idAry.storeIds[i]
        }).name || '')
      }
      return nameAry.join('；')
    },
    roleTransName(idAry) {
      const nameAry = []
      for (let i = 0; i < idAry.roleIds.length; i++) {
        nameAry.push(this.rolesList.find(s_item => {
          return s_item.id === idAry.roleIds[i]
        }).roleName || '')
      }
      return nameAry.join('；')
    },
    btnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.loading = true
          let _data=this.form
          let _function=addUser
          if(this.dialogType === 'edit'){
            _function=updateUser
            _data=this.form.id
          }
          _function(_data).then(() => {
            this.clearClose('reload')
            this.$message.success('操作成功')
          })
        }
      })
    },
    editRow(data) {
      this.dialogType = 'edit'
      this.form = Object.assign({}, data)
      this.dialogVisible = true
      // console.log(this.menusData,this.form.menuPerms)
      const setNodeObj = []
      const perms = this.form.menuPerms
      const meuns = this.menusData
      console.log(perms, meuns)
      perms.forEach(item => {
        for (const p in item.permission) {
          if (item.permission[p]) {
            setNodeObj.push(p + '-' + item.menuId)
          }
        }
      })
      console.log('setNodeObj', setNodeObj)
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
      this.form = {
        username: '',
        password: '',
        email: '',
        storeIds: [],
        roleIds: [],
        enabled: true,
        userType: 0
      }
      console.log(this.form)
    },
    openDialog(){
      this.dialogType = 'add'
      this.dialogVisible=true
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
