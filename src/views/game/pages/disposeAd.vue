<template>
  <div class="dispose-ad">
    <!--添加用户-->
    <el-dialog
      v-drag-dialog
      :title="dialogType==='add'?'创建广告':dialogType === 'detail'?'广告详情':'广告编辑'"
      append-to-body
      :width="'860px'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="clearClose"
    >
      <el-form ref="myform" v-loading="loading" :model="form" :rules="rules">
        <el-row v-if="dialogType===&quot;detail&quot;" :gutter="24" class="detail-item">
          <el-col :span="10" :push="2" class="">
            <div v-if="form.deviceType !== &quot;pad&quot;" class="detail-img-banner">
              <img class="game_img" :src="bannerImgBase64Show">
            </div>
            <div class="detail-img">
              <img class="game_img" :src="imgBase64Show">
            </div>
          </el-col>
          <el-col :span="10" class="">
            <el-form-item label="广告名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item v-if="form.deviceType !== &quot;pad&quot;" label="广告区域" :label-width="formLabelWidth">
              <el-select v-model="form.area" multiple placeholder="请选择" disabled="disabled">
                <el-option v-for="item in areasList" :key="item.id" :label="item.name" :value="~~item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" :label-width="formLabelWidth">
              <el-select v-model="form.deviceType" placeholder="请选择" disabled="disabled">
                <el-option v-for="item in devicesList" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="二维码链接" :label-width="formLabelWidth">
              <el-input v-model="form.codeUrl" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="创建时间" :label-width="formLabelWidth">
              <el-input v-model="form.createTime" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="开始时间" :label-width="formLabelWidth">
              <el-input v-model="form.begin" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="结束时间" :label-width="formLabelWidth">
              <el-input v-model="form.end" :disabled="true" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else id="imgs-dev" :gutter="24">
          <el-col :span="11" class="">
            <el-form-item label="广告名称" prop="name" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType" :label-width="formLabelWidth">
              <el-select v-model="form.deviceType" placeholder="请选择" :disabled="dialogType!=='add'">
                <el-option v-for="item in devicesList" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="投放时间" prop="formTime" :label-width="formLabelWidth">
              <el-date-picker
                v-model="form.formTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                size="mini"
                style="width:100%;"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item v-if="form.deviceType !== &quot;pad&quot;" label="区域" prop="area" :label-width="formLabelWidth">
              <el-select v-model="form.area" multiple placeholder="请选择">
                <el-option v-for="item in areasList" :key="item.id" :label="item.name" :value="~~item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二维码链接" prop="codeUrl" :label-width="formLabelWidth">
              <el-input v-model="form.codeUrl" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="13" class="">
            <el-form-item v-if="form.deviceType !== &quot;pad&quot;" label="" prop="bannerImgBase64">
              <el-upload
                ref="upload"
                class="upload-img"
                action=""
                name="bannerImgBase64"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleBannnerImg"
              >
                <el-row :gutter="24" class="">
                  <el-col :span="12">
                    <div class="imgshow-banner">
                      <img class="game_img" :src="bannerImgBase64Show">
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="text-left">
                      <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right" /> 点击上传
                      </el-button>
                      <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过12MB
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-upload>
            </el-form-item>
            <el-form-item label="" :class="form.deviceType === 'pad'?'padImgHeight':''" prop="imgBase64s">
              <el-upload
                ref="upload1"
                class="upload-img"
                action=""
                name="imgBase64s"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImg"
              >
                <el-row :gutter="24" class="">
                  <el-col :span="12">
                    <div class="imgshow">
                      <img class="game_img" :src="imgBase64Show">
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="text-left">
                      <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right" /> 点击上传
                      </el-button>
                      <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过12MB
                      </div>
                    </div> 
                  </el-col>
                </el-row>
              </el-upload>
              <!-- 多张图片 -->
              <el-table :data="imgsTableData" stripe size="mini" class="imgsTable" height="160px" :header-cell-style="{lineHeight:'1.5em'}">
                <el-table-column label="序号" type="index" width="50px" />
                <el-table-column label="图片名称" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span class="hover-cursor" @click="handleImgListShow(scope.row)">{{ scope.row.imgsName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50px">
                  <template slot-scope="scope">
                    <svg-icon icon-class="drag" class="svg-icon" />
                    <svg-icon icon-class="trash" class="delete-icon hover-cursor" @click="delImgRow(scope.$index)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearClose">
          取 消
        </el-button>
        <el-button v-if="dialogType!==&quot;detail&quot;" type="primary" @click="btnSubmit('myform')">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- top -->
    <el-row :gutter="20" class="table-head-btns">
      <el-col :span="4" class="flex">
        <el-select v-model="adStatus" placeholder="请选择" @change="handleSelectStatus">
          <el-option v-for="item in adStatusList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="8" class="flex">
        <el-input v-model="pagination.name" style="width: 300px;margin-right: 10px" placeholder="请输入名称">
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="adPage">
          搜索
        </el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button v-permission="'add'" type="primary" @click="addAd">
          + 创建
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
      <el-table-column label="广告ID" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="area" label="区域" :formatter="areaFormatter" />
      <el-table-column label="设备类型" prop="deviceType" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deviceType==='camera'?'success':scope.row.deviceType==='pad'?'':'warning'">
            {{ scope.row.deviceType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.begin | dateformat('YYYY-MM-DD') }} - {{ scope.row.end | dateformat('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ?'success':scope.row.status === 1 ?'warning' : scope.row.status === 2 ? 'danger':'info'">
            {{ scope.row.status === 0 ? '待生效': scope.row.status === 1 ?'投放中': scope.row.status === 2 ? '已撤销':'已结束' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="(scope.row.status === 0 || scope.row.status === 1)"
              v-permission="'delete'"
              type="danger"
              size="small"
              @click.native.prevent="cancelRow(scope.row.id)"
            >
              撤销
            </el-button>
            <el-button v-if="(scope.row.status === 0 || scope.row.status === 1)" size="small" @click.native.prevent="editRow(scope.row)">
              编辑
            </el-button>
            <el-button type="primary" size="small" @click.native.prevent="detailRow(scope.row)">
              详情
            </el-button>
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
  import { mapGetters} from 'vuex'

  import { addAd, statusAd, adPage} from '@/api/ads'
  import {  getAreas } from '@/api/area'
  import Sortable from 'sortablejs'
  export default {
    name: 'DisposeAd',
    props:[
      "StoreId"
    ],
    data() {
      return {
        dialogType: 'add',
        formLabelWidth: '90px',
        loading: true,
        dialogVisible: false,
        tableData: [],
        imgsTableData:[],
        pagination: {
          page: 1,
          size: 10,
          name: '',
          storeId: 0,
          total: 0,
          status: -1
        },
        rules: {
          name: [{
              required: true,
              message: '请输入广告名称',
              trigger: 'blur'
            },
            {
              min: 4,
              max: 10,
              message: '长度在 4 到 10 个字符',
              trigger: 'blur'
            }
          ],
          deviceType: [{
            required: true,
            message: '请选择所设备类型',
            trigger: 'change'
          }],
          formTime: [{
            required: true,
            message: '请选择投放时间',
            trigger: 'change'
          }],
          area: [{
            required: true,
            message: '请选择区域',
            trigger: 'change'
          }]
        },
        form: {
          id: '',
          name: '',
          deviceType: '',
          begin: '',
          end: '',
          area: [],
          codeUrl: '',
          bannerImgBase64: '',
          imgBase64s: [],
          bannerImg: '',
          imgs: [],
          status: 0,
          createTime: '',
          areaIds: [],
          storeId: 0,
          formTime: []
        },
        bannerImgBase64Show: '',
        imgBase64Show: '',
        adStatusList: [{
          id: -1,
          name: '全部'
        }, {
          id: 0,
          name: '待生效'
        }, {
          id: 1,
          name: '投放中'
        }, {
          id: 2,
          name: '已撤销'
        }, {
          id: 3,
          name: '已结束'
        } ],
        adStatus: '',
        devicesList: [{
          id: 0,
          name: 'screen'
        }, {
          id: 1,
          name: 'pad'
        }],
        areasList: [],

        fileReader: new FileReader(),
        showImgBase64s: '',
        pickerOptions: {
          disabledDate: time => {
            return (
              time < new Date()
            )
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'storeId'
      ])
    },
    watch: {
      StoreId: function(newVal, oldVal) {
        this.pagination.storeId = newVal
        this.pagination.page = 1
        this.adPage()
        this.getAreas(this.pagination.storeId)
      }
    },
    async created() {
      this.pagination.storeId = this.storeId
      this.adPage()
      this.getAreas()
    },
    methods: {
      adPage() {
        return new Promise(resolve => {
          const _pagination = Object.assign({}, this.pagination)
          delete _pagination.total
          if (!_pagination.name) {
            delete _pagination.name
          }
          console.log('初始数据', _pagination)
          adPage(_pagination).then(res => {
            console.log('广告列表', res)
            const {
              size,
              total,
              page,
              data
            } = res
            this.tableData = data
            this.pagination.total = total
            this.pagination.page = page
            this.pagination.size = size
            this.loading = false
            resolve(res)
          })
        })
      },
      getAreas() {
        return new Promise(resolve => {
          getAreas(this.pagination.storeId).then(res => {
            console.log('区域', res)
            this.areasList = res
            resolve(res)
          })
        })
      },
      areaFormatter(data) {
        const nameAry = []
        // console.log(data.area)
        if (data.area) {
          for (let i = 0; i < data.area.length; i++) {
            const _r = data.area[i].name
            if (_r) {
              nameAry.push(_r)
            }
          }
        }
        return nameAry.join('-')
      },
      dateToMs(date) {
        const result = new Date(date).getTime()
        return result
      },
      handleBannnerImg(file) {
        this.handlePreview(file, '1')
      },
      handleImg(file) {
        this.handlePreview(file, '2')
      },
      handlePreview(file, key) {
        console.log(file, key)
        const fileName = file.name
        const isLimt = file.size / 1024 < 12288
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              if (key === '1') {
                this.form.bannerImgBase64 = res.currentTarget.result
                // this.form.bannerImg = res.currentTarget.result
                this.bannerImgBase64Show = res.currentTarget.result
              } else {
                this.form.imgBase64s.push(res.currentTarget.result)
                this.imgsTableData.push({'imgsName':fileName,'imgBase64':res.currentTarget.result})
                // this.form.imgBase64s[0] = res.currentTarget.result
                this.imgBase64Show = this.form.imgBase64s[this.form.imgBase64s.length - 1]
                this.$nextTick(function () {// 获取弹窗table
                  this.rowDrop()
                })
              }
              this.form = Object.assign({}, this.form)
            }
          } else {
            this.$message.error('上传图片不能超过12MB')
          }
        } else {
          this.$message.error('只能上传jpg或png格式')
        }
      },
      btnSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('提交数据', this.form)
            this.loading = true
            this.form.areaIds = this.form.area
            this.form.begin = this.dateToMs(this.form.formTime[0])
            this.form.end = this.dateToMs(this.form.formTime[1])
            if (this.dialogType === 'edit') {
              if (!this.form.bannerImgBase64) {
                delete this.form.bannerImgBase64
              }
              if (this.form.imgBase64s.length === 0) {
                delete this.form.imgBase64s
              }
            }
            delete this.form.bannerImg
            delete this.form.imgs
            this.form.storeId = this.pagination.storeId
            const _data = this.form
            addAd(_data).then(() => {
              this.$message.success('操作成功')
            }).finally(() => {
              this.loading = false
              this.clearClose('reload')
              // this.dialogVisible = false
            })
          }
        })
      },
      async handleSelectStatus(key) {
        this.pagination.page = 1
        this.pagination.status = key
        await this.adPage()
        // if( key !== ''){
        //   const nameAry = []
        //   for(let i = 0; i< this.tableData.length; i++){
        //     if (this.tableData[i].status === key){
        //       nameAry.push(this.tableData[i])
        //     }
        //   }
        //   this.tableData = nameAry
        // }
      },
      cancelRow(id) {
        const _status = {}
        _status.id = id
        _status.status = 2
        console.log(typeof _status)
        this.$confirm('确认撤销此条数据吗？', '撤销数据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(_status)
          statusAd(_status).then(() => {
            // this.clearClose('reload')
            this.$message.success('操作成功')
            this.adPage()
          })
        })
      },
      editRow(data) {
        this.form = Object.assign({}, data)
        console.log('编辑初数据', this.form)
        const areaId = []
        for (let i = 0; i < data.area.length; i++) {
          areaId.push(data.area[i].id)
        }
        this.form.area = areaId
        this.form.formTime = []
        this.form.formTime[0] = this.timestampToTime(data.begin)
        this.form.formTime[1] = this.timestampToTime(data.end)
        this.form.imgBase64s = []
        if (data.imgs) {
          this.imgBase64Show = data.imgs[0]
          this.bannerImgBase64Show = data.bannerImg
          for(let i = 0; i<data.imgs.length;i++){
            this.getBase64(data.imgs[i], (base64) =>{
              this.imgsTableData.push({'imgsName':'name','imgBase64':base64})
              this.form.imgBase64s.push(base64)
            })
          }
          this.$nextTick(function () {// 获取弹窗table
            this.rowDrop()
          }) 
        }
        console.log('编辑', this.form)
        this.dialogType = 'edit'
        this.dialogVisible = true 
      },
      getBase64(url, callback) {
        let canvas = document.createElement('canvas')   // 创建canvas DOM元素
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = url
        img.onload = (res) => {
          canvas.width = img.width 
          canvas.height = img.height 
          ctx.drawImage(img, 0, 0, img.width, img.height)
          const dataURL = canvas.toDataURL('image/jpeg')
          callback(dataURL) // 回掉函数获取Base64编码
          canvas = null
        } 
      },
      async clearClose(reload) {
        this.dialogVisible = false
        if (reload === 'reload') {
          await this.adPage()
        }
        const _self = this
        setTimeout(function(){
          _self.form = {
            id: '',
            name: '',
            deviceType: '',
            begin: '',
            end: '',
            area: [],
            codeUrl: '',
            bannerImgBase64: '',
            imgBase64s: [],
            bannerImg: '',
            imgs: [],
            status: 0,
            createTime: '',
            areaIds: [],
            storeId: 0,
            formTime: []
          }
          _self.imgsTableData =[]
          _self.bannerImgBase64Show =''
        },200)
        // this.$refs['myform'].resetFields() 
      },
      async pageChange(val) {
        this.pagination.page = val
        await this.adPage()
      },
      addAd() {
        this.dialogType = 'add'
        this.imgBase64Show = ''
        this.dialogVisible = true
        this.$nextTick(function () {// 获取弹窗table
          this.rowDrop()
        })
      },
      timestampToTime(val) {
        const date = new Date(val)
        const Y = date.getFullYear() + '-'
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        const D = date.getDate() + ' '
        const h = date.getHours() + ':'
        const m = date.getMinutes() + ':'
        const s = date.getSeconds()
        return Y + M + D + h + m + s
      },
      detailRow(data) {
        data.begin = this.timestampToTime(data.begin)
        data.end = this.timestampToTime(data.end)
        data.createTime = this.timestampToTime(data.createTime)
        this.form = Object.assign({}, data)
        const areaId = []
        for (let i = 0; i < data.area.length; i++) {
          areaId.push(data.area[i].id)
        }
        this.form.area = areaId
        if (this.form.imgs[0]) {
          this.imgBase64Show = this.form.imgs[0]
          this.bannerImgBase64Show = this.form.bannerImg
        }
        console.log('详情弹窗', this.form)
        this.dialogType = 'detail'
        this.dialogVisible = true
      },
      handleImgListShow(rowData){
        console.log('showImg',rowData)
        this.imgBase64Show= rowData.imgBase64
      },
      delImgRow(rowIndex){
        console.log('delImg',rowIndex)
        this.form.imgBase64s.splice(rowIndex,1)
        this.imgsTableData.splice(rowIndex,1)
        this.imgBase64Show = this.form.imgBase64s[0]
        this.$nextTick(function () {// 获取弹窗table
          this.rowDrop()
        })
      },
      // 行拖拽
      rowDrop() {
        const tbody = document.querySelector('.imgsTable tbody')
        const _this = this
        if(tbody){
          Sortable.create(tbody, {
            onEnd({ newIndex, oldIndex }) {     
              _this.imgsTableData.splice(newIndex, 0, _this.imgsTableData.splice(oldIndex, 1)[0])
              const newArray = _this.imgsTableData.slice(0)
              _this.imgsTableData = []
              _this.$nextTick(function () {
                _this.imgsTableData = newArray
                const newImgBase64 = []
                for (let i = 0 ; i<newArray.length; i++) {
                   newImgBase64.push(newArray[i].imgBase64)
                }
                this.form.imgBase64s = newImgBase64
                // console.log('拖拽',newArray,this.form.imgBase64s)
              })
            }
          })
        } 
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dispose-ad {
    padding-top: 20px;
  }

  .imgshow-banner {
    width: 188px;
    height: 120px;
  }

  .imgshow {
    width: 188px;
    height:260px;
  }
  .padImgHeight{
    .imgshow {
      height:120px;
    }
  }
  img {
    width: 100%;
    height: 100%;
    border: 0;
  }

  .detail-item {
    .detail-img-banner {
      width: 220px;
      height: 150px;
    }
    .detail-img {
      margin-top: 20px;
      width: 220px;
      height: 260px;
    }
  }
  #imgs-dev{
    .el-form-item__content{
      .el-upload__tip{
        line-height: 1.5em;
      } 
    }
    .imgsTable{
      position:absolute;
      left: 50%;
      top: 100px;
      width: 50%;
    } 
    .hover-cursor{
      cursor: pointer;
    }
    .hover-cursor:hover{
      color: #67C23A;
    }
  }
</style>
