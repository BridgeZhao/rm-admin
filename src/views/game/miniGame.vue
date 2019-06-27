<template>
  <div class="mini_game">
    <ul  class="data-list game-list">
      <li v-for='(item, key) in miniGame' :key='key'>
        <div  class="name-warp"><span  class="name">{{item.name}}</span>
         <svg-icon icon-class="trash" class="delete-icon" @click='delGame(item)' />
         </div>
        <div class="img">
          <img :src='item.img' />
        </div>
      </li>
      <li  class="add" @click="addGame">
        <svg-icon icon-class="plus" class="svg-plus"></svg-icon>
         <span class="font-red" >添加游戏</span>
      </li>
    </ul>
    <!--弹框-->
    <el-dialog title="添 加" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
      <!--基本信息-->
      <el-form  v-loading="dgLoading" :model="fromInfo" :rules="rules"  ref="myform">
        <el-form-item label="游戏名称" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="fromInfo.name" autocomplete="off" placeholder="请输入游戏名称"></el-input>
        </el-form-item>
        <el-form-item label="h5链接" :label-width="formLabelWidth" prop="link" >
          <el-input v-model="fromInfo.link" autocomplete="on"  placeholder="请输入h5链接"></el-input>
        </el-form-item>
        <el-form-item label="平面图" :label-width="formLabelWidth" prop="imgBase64" >
          <el-upload
            class="upload-img"
            action=""
            ref="upload"
            name="imgBase64"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePreview">
            <div v-if="!fromInfo.imgBase64" class="text-left">
              <el-button type="primary" size="small"><i class="el-icon-upload el-icon--right"/> 点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
            </div>
            <div v-else class="upload-imgshow">
              <img class="game_img" :src="fromInfo.imgBase64" alt="">
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary"  @click="btnSubmit">确定添加</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
  import { addGame, gamePage ,delGame } from '@/api/game'
  export default {
    name: 'miniGame',
    data () {
      return {
        miniGame: [],
        dialogVisible : false,
        dgLoading: false,
        formLabelWidth : '80px',
        fileReader: new FileReader(),
        fromInfo: {
          name:'',
          link:'',
          imgBase64:undefined,
        },
        rules: {
        	name: [
        		{required: true, message: '请输入游戏名称', trigger: 'blur'},
        		{min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        	],
        	link:[{ required: true, message: '请输入游戏h5链接', trigger: 'blur'},
            {type: 'url', message: '请输入正确的游戏h5链接', trigger: 'blur'},
          ],
          imgBase64:[{required: true, message: '请上传h5游戏图片', trigger: 'change'}]
        },
      }
    },
    created(){
      this.gamePage()
    },
    methods: {
      gamePage(){
        return new Promise(resolve => {
          gamePage().then(res => {
            console.log("bbbbbbb",res)
            this.miniGame = res.data
            resolve(this.miniGame)
          })
        })
      },
      addGame () {
        this.dialogVisible = true
      },
      handlePreview(file) {
        const fileName = file.name
        const isLimt = file.size / 500 / 500 < 1
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              this.fromInfo.imgBase64 = res.currentTarget.result
              this.fromInfo = Object.assign({}, this.fromInfo)
            }
          }else{
            this.$message.error('上传图片不能超过500KB')
          }
        }else{
          this.$message.error('只能上传jpg或png格式')
        }
      },
      btnSubmit () {
          this.$refs['myform'].validate((valid) => {
            if (valid) {
              this.dgLoading = true
              addGame(this.fromInfo).then(() => {
                this.gamePage()
                this.$message.success('操作成功')
              }).finally(() => {
                this.dgLoading = false
                this.dialogVisible = false
              })
            }
          })
      },
      clearClose(reload){
        this.dialogVisible = false
        if(reload){
          this.gamePage()
        }
      	this.$refs['myform'].resetFields()
        this.fromInfo.name=''
        this.fromInfo.link=''  
        this.fromInfo.imgBase64 = ''
      },
      delGame (key) {
        this.$confirm('确认要删除' + key.name + '吗？')
        .then(() => {
          delGame(key.id).then(()=>{
            this.$message.success('删除成功')
            this.gamePage()
          }).finally(() =>{})
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
