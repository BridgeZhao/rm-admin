<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="8">
        <el-form ref="myform" :model="form" :rules="rules">
          <el-form-item label="父级菜单" p :label-width="formLabelWidth">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option label="无" :value="0" />
              <el-option
                v-for="item in menuList"
                :key="item.id"
                :label="item.title"
                :value="~~item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="菜单标题" prop="title" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="路由名称" prop="menuName" :label-width="formLabelWidth">
            <el-input v-model="form.menuName" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="isOrderNo" label="排序" prop="orderNo" :label-width="formLabelWidth">
            <el-input v-model.number="form.orderNo" type="number" autocomplete="off" />
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="btnSubmit('myform')">
              {{ !form.id?'确定添加':'确定修改' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1" />
      <el-col v-loading="loading" :span="8">
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="menusData"
          node-key="id"
          :props="defaultProps"
          default-expand-all
        >
          <span slot-scope="{ node, item }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="editMenu(item)"
              >
                <svg-icon icon-class="edit" />
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="deleteMenu(item)"
              >
                <svg-icon icon-class="del" />
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getMenus,addUpdateMenu,deleteMenu } from '@/api/system'
import { menuTransTree } from '@/utils'
export default {
  data() {
    return {
      loading:false,
			isOrderNo:true,
      menusData:[],
      menuList:[],
      formLabelWidth:'100px',
      form:{
        menuName:'',
        parentId:0,
				orderNo:1,
        title:'',
        level:1
      },
      btnList:[{name:'编辑',id:1},{name:'添加',id:2},{name:'删除',id:3}],
      rules: {
        title: [
          {required: true, message: '必填项', trigger: 'blur'}
        ],
				orderNo:[
					{required: true, message: '必填项', trigger: 'blur'}
				],
        menuName: [
          {required: true, message: '必填项', trigger: 'blur'}
        ]
      },
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created(){
    this.getMenus()
  },
  methods: {
    getMenus() {
      this.loading = true
      getMenus().then(res => {
        const newMenusObj = menuTransTree(res)
        this.menusData = newMenusObj.menusTree
        this.menuList = newMenusObj.menuFristList
      }).finally(() => {
        this.loading = false
      })
    },
    deleteMenu(obj) {
      this.$confirm('确定要删除菜单吗？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = [obj.id]
        this.loading = true
        deleteMenu(ids).then(() => {
          this.getMenus()
          this.$message.success('删除成功')
        })
      })
    },
    editMenu(obj){
      this.form=obj.data
      this.form.menuName=obj.data.name
			this.isOrderNo=typeof(obj.data.orderNo)==='number'
      this.form=Object.assign({},this.form)
      console.log(this.form,obj)
    },
    btnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.level = this.form.parentId === 0 ? 1 : 2
          console.log(this.form)
          this.loading = true
          addUpdateMenu([this.form]).then(() => {
						this.isOrderNo=true
            this.form.menuName = ''
            this.form.orderNo = 1
            this.form.parentId = 0
            this.form.title = ''
            delete this.form.id
            this.getMenus()
            this.$message.success('操作成功')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-center {
    top:3.4rem;
    bottom:auto;
    width: 70px;
    height: 80px;
    .btn-submit {
      padding: 0;
      margin: 10px 0 0 0;
      width: 50px;
      height: 40px;
    }
  }
  .custom-tree-node{
    font-size: .9rem;
    .custom-tree-node{
      span:first-child{
       margin-right: 20px;
      }
    }
    button{
      border: none;
    }
  }
</style>
