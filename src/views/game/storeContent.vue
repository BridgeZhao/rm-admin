<template>
  <div id='store_content'>
    <div class="top-bar">
      <ul class="feature-tab-list">
        <li class="" :class="{ selected: gameTab }" @click='tabclick("first")'>店内导航</li>
        <li class="" :class="{ selected: !gameTab }" @click='tabclick("second")'>关联游戏</li>
      </ul>
    </div>
    <div v-show='gameTab' class="first_item">
      <div class="filter-warp">
        <div class="drop-down area-drop-down">
          <template>
            <el-select v-model="defaultStoreId" placeholder="请选择" >
              <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </div> 
        <button class=" gradient" @click='addRegion'>添加区域</button> 
        <button class="gradient">发布</button>
      </div>
      <ul class="data-list">
        <li v-for='(item, key) in listdata' :key='key'>
          <div class="name-warp"><span class="name">{{item.name}}</span> <svg-icon icon-class="trash" class="delete-icon" @click="deleteRegion(key)" /></div>
          <div class="desc-warp"><span>上次更新时间</span> <span>{{item.time}}</span></div>
          <ul class="preview-warp">
            <li>
              <h1 class="title">区域缩略图</h1>
              <div class="img">
                <img :src="item.imgThumbnail" alt="">
              </div>
              <el-upload
                class="upload-img"
                action=""
                ref="upload"
                name="imgThumbnail"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePreview">
                <div class="text-left">
                  <el-button type="primary" class="file-upload" size="small" @click="handleClickFile('imgThumbnail' ,key)">
                    <svg-icon icon-class="upload" class="upload-icon svg-icon" />
                  </el-button>
                </div>
              </el-upload>
              <button  class="btns handle-btn default">更新</button>
            </li>
            <li>
              <h1 class="title">区域导航图</h1>
              <div class="img">
                  <img :src="item.imgNavigation" alt="">
              </div>
              <el-upload
                class="upload-img"
                action=""
                ref="upload"
                name="imgNavigation"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePreview">
                <div class="text-left">
                  <el-button type="primary" class="file-upload" size="small" @click="handleClickFile('imgNavigation' ,key)">
                    <svg-icon icon-class="upload" class="upload-icon svg-icon" />
                  </el-button>
                </div>
              </el-upload>
              <button  class="btns handle-btn default">更新</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 关联小游戏 -->
    <div v-show='!gameTab' class="second_item">
      <ul  class="data-list game-list">
        <li class="game-list-li" draggable="false" v-for='(item, key) in gameData' :key='key'>
          <div  class="name-warp">
            <span  class="name">{{item.name}}</span>
            <svg-icon icon-class="edit" class="svg-icon"></svg-icon>
          </div>
          <div class="img">
            <img :src="item.imgSrc" />
          </div>
          <button class="btns handle-btn mr-top default">取消关联</button>
        </li>
        <li  class="add" @click="addChannelGame">
          <svg-icon icon-class="plus" class="svg-plus"></svg-icon>
           <span class="font-red" >添加关联游戏</span>
        </li>
      </ul>
      <el-dialog title="添 加" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
        <el-form  v-loading="dgLoading" :model="fromInfo" :rules="rules"  ref="myform">
          <el-form-item label="选择游戏" :label-width="formLabelWidth"  >
             <el-select v-model="fromInfo.areaId" placeholder="请选择" style='width: 40%;'>
              <el-option
                v-for="item in gameList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交互屏设置" :label-width="formLabelWidth"  >
            <el-checkbox-group v-model="fromInfo.checked">
              <el-checkbox label="全选按钮" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="应用设备" style="padding-left:90px;">
            <el-checkbox-group v-model="fromInfo.type">
              <el-checkbox label="交互设备1" name="type"></el-checkbox>
              <el-checkbox label="交互设备2" name="type"></el-checkbox>
              <el-checkbox label="交互设备3" name="type"></el-checkbox>
              <el-checkbox label="交互设备4" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary"  @click="btnSubmit">确定添加</el-button></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addGame, gamePage, channelGame} from '@/api/game'
  export default {
    name: 'storeContent',
    data() {
      return {
        gameTab: false,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        value: '',
        listdata: [{
          id:'1',
          name: '展示厅',
          time: '2019-06-06',
          imgThumbnail:'http://172.16.2.118/media/5cf8bd48e042e128180005.png',
          imgNavigation:'http://172.16.2.118/media/5cf8bd4f920e8885753787.png'
        }],
        gameData: [{
          id:'',
          name: '贴纸游戏',
          imgSrc :'http://172.16.2.118/media/5d0b47c4e7f8b535833263.jpg'
        }],
        fileReader: new FileReader(),
        changeImgBase64 : false,
        listdataImg : undefined,
        listdataIn : undefined,
        nowId : '',
        defaultStoreId : undefined,
        dgLoading: false,
         fromInfo: {
          name:'',
          url:'',
          areaId:'',
          type: [{
                'id': '1',
                'product_inf': '女士银手链'
            }, {
                'id': '2',
                'product_inf': '女士银手镯'
            }, {
                'id': '3',
                'product_inf': '女士银耳环'
            }],
          checked: false, //全选框
          checkList: []
        },
        formLabelWidth: '90px',
        rules: {},
        dialogVisible : false,
        gameList:[],
      }
    },
    computed: {
      ...mapGetters([
        'storeList',
        'storeId'
      ])
    },
    created(){
    	this.defaultStoreId=this.storeId
      this.gamePage()
    },
    methods: {
      tabclick(tabClickVal) {
        this.gameTab = tabClickVal == 'second' ? false : true;
      },
      addRegion () {
         const _listdata = {
           id:'',
           name: '',
           time: '',
           imgThumbnail:'',
           imgNavigation:''
         };
         _listdata.id = this.defaultStoreId 
         _listdata.name = this.storeList.find(item => {return item.id === this.defaultStoreId}).name
         let thisListdata = this.listdata
         let lastListdata = thisListdata[thisListdata.length - 1]
          if(this.defaultStoreId === lastListdata.id){
            this.$message({
              message: '该区域已存在，请勿重复添加',
              type: 'warning'
            });
            return false
          }
          this.listdata.push(_listdata)
      },
      deleteRegion (key) {
        this.listdata.splice(key,1)
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      },
      handlePreview(file) {
        this.changeImgBase64=true
        let mun = this.listdataIn
        let listdataImg = this.listdataImg
        const fileName = file.name
        const isLimt = file.size / 1024 / 1024 < 1
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              listdataImg === 'imgThumbnail' ? this.listdata[mun].imgThumbnail= res.currentTarget.result : this.listdata[mun].imgNavigation = res.currentTarget.result
            }
          }else{
            this.$message.error('上传图片不能超过1MB')
          }
        }else{
          this.$message.error('只能上传jpg或png格式')
        }
      },
      handleClickFile(type, key) {
        this.listdataIn = key
        this.listdataImg = type
      },
      // 关联游戏模块
      gamePage(){
        console.log('门店列表',this.storeList,this.storeId)
        return new Promise(resolve => {
          gamePage().then(res => {
            console.log("总游戏",res)
            this.gameList = res
            resolve(res)
          })
        })
      },
      addChannelGame(){
        this.dialogVisible = true
      },
      btnSubmit () {
        
      }
    },
    watch: {
      defaultStoreId(val) {
        this.$store.dispatch('app/setStoreId', val)
        this.$emit('storeIdChange',val)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
