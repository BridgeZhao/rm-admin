<template>
  <div class="app-container mini_game">
    <ul  class="data-list game-list">
      <li v-for='(item, key) in miniGame' :key='key'>
        <div  class="name-warp">
          <span  class="name">{{item.name}}</span>
          <div>
            <svg-icon icon-class="edit" class="svg-icon" @click="editChannelGame(item)"></svg-icon>
            <svg-icon icon-class="trash" class="delete-icon" @click='delGame(item)' />
          </div>
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
    <el-dialog :title="dialogType === 'add' ? '添加游戏' : '修改游戏'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
      <!--基本信息-->
      <el-form  v-loading="dgLoading" :model="fromInfo" :rules="rules"  ref="myform">
        <el-form-item label="游戏名称" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="fromInfo.name" autocomplete="off" placeholder="请输入游戏名称"></el-input>
        </el-form-item>
        <el-form-item label="h5链接" :label-width="formLabelWidth" prop="link" >
          <el-input v-model="fromInfo.link" autocomplete="on"  placeholder="请输入h5链接"></el-input>
        </el-form-item>
        <el-form-item label="效果图" :label-width="formLabelWidth" prop="imgBase64" >
          <el-upload
            class="upload-img"
            action=""
            ref="upload"
            name="imgBase64"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePreview">
            <div v-if="!fromInfoImg"  class="text-left">
              <el-button type="primary" size="small"><i class="el-icon-upload el-icon--right"/> 点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
            </div>
            <div v-else class="upload-imgshow">
              <img class="game_img" :src="fromInfoImg" alt="">
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary"  @click="btnSubmit">确定</el-button></div>
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
        dialogType:'add',
        formLabelWidth : '80px',
        fileReader: new FileReader(),
        fromInfo: {
          id:'',
          name:'',
          link:'',
          imgBase64:undefined,
        },
        fromInfoImg:undefined,
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
            this.miniGame = res.data
            resolve(this.miniGame)
          })
        })
      },
      addGame () {
        this.dialogType === 'add'
        this.dialogVisible = true
      },
      handlePreview(file) {
        console.log(file)
        const fileName = file.name
        const isLimt = file.size / 1024 < 500 
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              this.fromInfo.imgBase64 = res.currentTarget.result
              this.fromInfoImg = res.currentTarget.result
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
          if(this.dialogType === 'edit'){ 
            delete this.rules.imgBase64
            delete this.fromInfo.imgBase64
          }
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
        this.fromInfo.imgBase64 = undefined
        this.fromInfoImg = undefined
        this.fromInfo.id = ''
      },
      editChannelGame(val){
        this.dialogType = 'edit'
        console.log(val)
        this.fromInfo.id = val.id
        this.fromInfo.name = val.name
        this.fromInfo.link = val.link
        this.fromInfoImg = val.img
        this.dialogVisible = true
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
<style lang="scss" scoped>
  @import '@/styles/variables.scss';
  .app-container {
    background: none;
  }
  ul {
    list-style: none;
  }
  .svg-icon{
    cursor: pointer;
  }
  .svg-icon:hover{
    color: #fe0000;
  }
  .mini_game{
    .data-list {
        margin-top: 0;
        display: flex;
        flex-wrap: wrap;
        padding-inline-start: 0;
        >li {
          width: 13.2rem;
          height: 25rem;
          background: $menuBg;
          border:1px solid $borderColor;
          border-radius: 4px;
          margin-right: 1.2rem;
          margin-bottom: 1.2rem;
          padding: 0 1.2rem;
          box-sizing: border-box;
          .name-warp {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            margin-top: 1.2rem;
            align-items: center;
          }
          .img {
            width: 10.8rem;
            height: 19.2rem;
            position: relative;
            >img{
              width: 100%;
              height: 100%;
            }
            >.error{
              width: auto;
              height: auto;
              position: absolute;
              top:50%;
              left: 50%;
              margin-top:-45px; 
              margin-left:-58px;
            }
          }
        }
      }
      .game_img{
        width: 100%;
        max-height: 200px;
        vertical-align: middle;
      }
      .data-list{
        >li.add {
          border: 1px dashed red;
          box-sizing: border-box;
          cursor: pointer;
          background: transparent!important;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-size: .7rem;
          color: #fe0000;
          .svg-plus{
            width: 3.3rem;
            height: 3.3rem;
            color: red;
          }
        }
      }
    }
</style>
