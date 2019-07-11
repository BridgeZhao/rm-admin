<template>
  <!-- <div class="first_item">
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
   </div> -->
</template>

<script>
  import { mapGetters } from 'vuex'
  import {  channelGame ,channelGamePage ,delChannelGame} from '@/api/game'
  import { getScenarioData } from '@/api/coupons'
  import { getDevices } from '@/api/device'
  export default {
    name: 'DisposeNav',
    data() {
      return {
        gameTab: '关联游戏',
        value: '',
        listdata: [{
          id:'1',
          name: '展示厅',
          time: '2019-06-06',
          imgThumbnail:'http://172.16.2.118/media/5cf8bd48e042e128180005.png',
          imgNavigation:'http://172.16.2.118/media/5cf8bd4f920e8885753787.png'
        }],
        gameData: [],
        fileReader: new FileReader(),
        changeImgBase64 : false,
        listdataImg : undefined,
        listdataIn : undefined,
        nowId : '',
        defaultStoreId : undefined,
        dgLoading: false
      
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
    },
    methods: {
      // tabclick(tabClickVal) {
      //   this.gameTab = tabClickVal == 'second' ? false : true;
      // },
      addRegion () {
         const _listdata = {
           id:'',
           name: '',
           time: '',
           imgThumbnail:'',
           imgNavigation:''
         }
         _listdata.id = this.defaultStoreId 
         _listdata.name = this.storeList.find(item => {return item.id === this.defaultStoreId}).name
         const thisListdata = this.listdata
         const lastListdata = thisListdata[thisListdata.length - 1]
          if(this.defaultStoreId === lastListdata.id){
            this.$message({
              message: '该区域已存在，请勿重复添加',
              type: 'warning'
            })
            return false
          }
          this.listdata.push(_listdata)
      },
      deleteRegion (key) {
        this.listdata.splice(key,1)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      },
      handlePreview(file) {
        this.changeImgBase64=true
        const mun = this.listdataIn
        const listdataImg = this.listdataImg
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
      }
    }

  }
</script>

<style>
</style>
