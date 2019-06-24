<template>
  <div id='store_content'>
    <div class="top-bar">
      <ul class="feature-tab-list">
        <li class="" :class="{ selected: gameTab }" @click='tabclick("first")'>店内导航</li>
        <li class="" :class="{ selected: !gameTab }" @click='tabclick("second")'>小游戏</li>
      </ul>
    </div>
    <div v-show='gameTab' class="first_item">
      <div class="filter-warp">
        <div class="drop-down area-drop-down">
          <template>
            <el-select v-model="value" placeholder="请选择"  v-on:change="indexSelect" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
              <!-- <div  class="cs-upload-warpper file-upload">
                <input  type="file" accept="*" class="file-input"> 
                <input  type="text" readonly="readonly" class="input">
                <svg-icon icon-class="upload" class="upload-icon svg-icon" />
              </div> -->
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
    <!-- 小游戏 -->
    <div v-show='!gameTab' class="second_item">
      <ul  class="data-list game-list">
        <li  class="game-list-li" draggable="false">
          <div  class="name-warp">
            <span  class="name">贴纸游戏</span>
            <svg-icon icon-class="edit" class="svg-icon"></svg-icon>
          </div>
          <div  class="img" style="background-image: url('http://172.16.2.118/media/5d0b47c4e7f8b535833263.jpg');"></div>
          <button class="btns handle-btn mr-top default">取消关联</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'storeContent',
    data() {
      return {
        gameTab: true,
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
        fileReader: new FileReader(),
        changeImgBase64 : false,
        listdataImg : undefined,
        listdataIn : undefined,
        nowId : ''
      }
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
         _listdata.name = this.nowId.label
         let thisListdata = this.listdata
         let lastListdata = thisListdata[thisListdata.length - 1]
          // if(lastListdata.id == '' || lastListdata.id == undefined){
          if(lastListdata.id === undefined  || lastListdata.name === this.nowId.label){
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
      indexSelect(){
        let thisVal = this.value
        this.nowId = this.options.find(function(item){
          return item.value === thisVal
        })
        console.log(this.nowId)
         
      }
    },
    watch: {
    }
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
