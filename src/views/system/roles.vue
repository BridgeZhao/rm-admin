<template>
  <div class="app-container">
    <!--添加-->
    <el-dialog :title="dialogType==='add'?'角色添加':'角色修改'" append-to-body :width="'620px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="clearClose">
      <el-form ref="myform" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单分配" :label-width="formLabelWidth">
          <el-tree
            class="filter-tree"
            :data="menusData"
						@check="checkTree"
            ref="tree"
            node-key="id"
            :props="defaultProps"
            show-checkbox>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearClose">取 消</el-button>
        <el-button type="primary" @click="btnSubmit('myform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20" class="table-head-btns">
      <el-col style="text-align: right">
        <el-button v-permission="'add'" type="primary" @click="dialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
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
        prop="roleName"
        label="角色名称"
        width="180"
      />
      <el-table-column
        label="更新时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
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
          <el-button
            v-permission="'edit'"
            size="small"
            @click.native.prevent="editRow(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="'delete'"
            type="danger"
            size="small"
            @click.native.prevent="deleteRow(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenus,addRoles,getAllRoles,delRole,updateRole} from '@/api/system'
import { menuTransTree } from '@/utils'
export default {
  data() {
    return {
      dialogType:'add',
      formLabelWidth:'80px',
      dialogVisible:false,
      loading:false,
      form:{
        roleName: '',
        menuPerms:[]
      },
      rules: {
        roleName: [
          {required: true, message: '必填项', trigger: 'blur'}
        ]
      },
			authMenusFilter:[],
      menusData: [],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
  },
  created() {
    this.getMenus()
    this.getAllRoles()
  },
  methods: {
    getAllRoles(){
      this.loading = true
      getAllRoles().then(res => {
        this.tableData=res
      }).finally(() => {
        this.loading = false
      })
    },
    getMenus() {
      this.loading = true
      getMenus().then(res => {
        const newMenusObj = menuTransTree(res, 'buttons')
        this.menusData = newMenusObj.menusTree
        console.log(newMenusObj)
      }).finally(() => {
        this.loading = false
      })
    },
		checkTree(val,data) {
			console.log(val)
			console.log(data)
			const sendMenus = []
			const checkeKeys= data.checkedKeys
			const _permission={}
			for (let i = 0; i < checkeKeys.length; i++) {
				const key_id = checkeKeys[i]
				let _id = key_id
				let _keyname = ''
				if (typeof(key_id) === 'string') {
					const _ary = key_id.split('-')
					_id = ~~_ary[1]
					_keyname = _ary[0]
					if(_permission.hasOwnProperty(_id)){
						_permission[_id].push(_keyname)
					}else{
						_permission[_id]=[_keyname]
					}
				} else {
					sendMenus.push({menuId: _id, permission: {'add': true, 'edit': true, 'delete': true, 'view': true}})
				}
			}
			console.log(sendMenus)
			console.log(_permission)
			const halfCheckedKeys=data.halfCheckedKeys||[]
			halfCheckedKeys.forEach(item_id => {
				const buttons={}
				const itemAry=_permission[item_id]||[]
				itemAry.forEach(item_btn=>{
					buttons[item_btn]=true
				})
				sendMenus.push({menuId: item_id, permission:buttons})
			})
			this.form.menuPerms=sendMenus
			console.warn(this.form.menuPerms)
		},
    btnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let fnName=addRoles
          if(this.form.hasOwnProperty('id')){
            fnName=updateRole
          }
          fnName(this.form).then(()=>{
						this.clearClose('reload')
						this.$message.success('操作成功')
          })
        }
      })
    },
    editRow(data){
      this.dialogType='edit'
      this.form=Object.assign({},data)
      this.dialogVisible=true
      // console.log(this.menusData,this.form.menuPerms)
      const setNodeObj=[]
      const perms=this.form.menuPerms
      const meuns=this.menusData
      console.log(perms,meuns)
      perms.forEach(item=>{
        for(const p in item.permission){
          if(item.permission[p]){
            setNodeObj.push(p+'-'+item.menuId)
          }
        }
      })
      this.$nextTick(()=>{
        this.$refs.tree.setCheckedKeys(setNodeObj)
      })
    },
    deleteRow(id) {
      console.log(this)
      this.$confirm('确认删除此条数据吗？', '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(id).then(() => {
          this.clearClose('reload')
          this.$message.success('操作成功')
        })
      })
    },
    clearClose(reload){
      // this.$refs.tree.setCheckedKeys([])
      this.dialogVisible = false
      if(reload==='reload'){
        this.getAllRoles()
      }
      delete this.form.id
      this.form.roleName=''
      this.form=Object.assign({},this.form)
      console.log(this.form)
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
