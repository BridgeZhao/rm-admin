<template>
  <div class="app-container store-device">
    <!--头部按钮-->
    <el-row :gutter="20" class="table-head-btns">
      <el-col style="text-align: right">
        <el-button v-permission="'add'" type="primary" @click="btnDevice('add')">+ 添加设备</el-button>
      </el-col>
    </el-row>
    <!--弹框-->
    <el-dialog v-drag-dialog :title="dialogType==='add'?'添 加':'编 辑'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
      <!--基本信息-->
      <el-form v-if="drawType==='info'" v-loading="dgLoading" :model="fromInfo" :rules="rules"  ref="myform">
        <el-form-item label="设备名称" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="fromInfo.name" autocomplete="off" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" :label-width="formLabelWidth" prop="areaId">
          <el-select v-model="fromInfo.areaId" placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="deviceType">
          <el-row :gutter="24">
            <el-col :span="8" class="no-padding">
              <el-select v-model="fromInfo.deviceType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col v-if="fromInfo.deviceType==='camera'" :span="12" prop="usage">
              <el-radio v-model="fromInfo.usage" :label="0">人头摄像头</el-radio>
              <el-radio v-model="fromInfo.usage" :label="1">人脸摄像头</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
				<el-form-item v-if="dialogType!=='add'&&fromInfo.deviceType!=='camera'" label="登录名" :label-width="formLabelWidth">
					<el-input v-model="fromInfo.authName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item v-if="fromInfo.deviceType!=='camera'" label="登陆密码" :label-width="formLabelWidth">
					<el-input v-model="fromInfo.password" type="password" autocomplete="off" placeholder="123456"></el-input>
				</el-form-item>
        <el-form-item v-if="fromInfo.deviceType==='camera'" label="RTSP" :label-width="formLabelWidth" prop="rtsp">
          <el-input v-model="fromInfo.rtsp" autocomplete="off" placeholder="请输入设备rtsp流地址"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else v-loading="dgLoading" :model="fromInfo"  ref="myform">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="16">
                <el-select
              class="mg-bot20"
              v-model="selectedArea"
              placeholder="绘制区域选择"
              @change="onareaSelect">
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.name+'(预警人数'+item.num+')'"
                :value="item.id">
              </el-option>
                </el-select>
              </el-col>
              <el-col :span="8" style="text-align: left;padding-left: 20px">
								<el-checkbox-group v-model="checkType[selectedArea]" @change="checkChange" class="ck-type">
              <el-checkbox label="0">空岗监测</el-checkbox>
              <el-checkbox label="1">超员监测</el-checkbox>
            </el-checkbox-group>
          </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button-group>
              <el-button @click="cancelArea"><svg-icon icon-class="cancel" />撤销</el-button>
              <el-button @click="setAllPoint"><svg-icon icon-class="all" />全绘</el-button>
              <el-button @click="clearArea" ><svg-icon icon-class="clear" />清除</el-button>
              <el-button @click="clearAllAreaData"><svg-icon icon-class="del" />全清</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <div class="perview-warp">
          <canvas id="canvasDevice" />
          <img :src="fromInfo.snapshot">
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" :disabled="disabledBtn||!areaList.length" @click="btnSubmit">{{dialogType==='add'?'确定添加':'确定修改'}}</el-button></div>
    </el-dialog>
    <!--数据列表-->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        label="ID"
        width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="设备名" />
			<el-table-column
				label="登录名" >
				<template slot-scope="scope">
					<el-tag type="danger">
						{{ scope.row.authName }}
					</el-tag>
				</template>
			</el-table-column>
      <el-table-column
        label="设备类型"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.deviceType==='camera'?'success':scope.row.deviceType==='pad'?'':'warning'">
            {{ scope.row.deviceType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="所属区域">
        <template slot-scope="scope">
          <el-tag type="info">{{ areaIdTransText(scope.row.areaId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280">
        <template slot-scope="scope">
          <el-button v-permission="'edit'" size="small" @click.native.prevent="edtiData(scope.row.id,'info')">
            编辑
          </el-button>
          <el-button v-if="scope.row.deviceType==='camera'&&scope.row.snapshot" v-permission="'edit'" type="primary" size="small" @click.native.prevent="edtiData(scope.row.id,'draw')">
						区域绘制
          </el-button>
          <el-button v-permission="'delete'" type="danger" size="small" @click.native.prevent="deleteRow(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addUser ,updateUser } from '@/api/user'
import { getDevices,addUpdateDevice,delDevice,getDeviceInfo } from '@/api/device'
import { getAreas } from '@/api/area'
import { AutoImage,DrawImage } from '@/utils/drawImage'
export default {
  data() {
    return {
      disabledBtn:false,
      drawType:'info',
      dialogType: 'add',
      dgLoading: false,
      tableLoading: false,
      formLabelWidth: '80px',
      dialogVisible: false,
      selectedArea:undefined,
      drawLayer:undefined,
      areaText:undefined,
      canvas:undefined,
      checkType:{},
      areaData:{name:'',num:1},
      areaList:[],
      options:[{
        value:'camera',
        label:'摄像头'
      },{
        value:'screen',
        label:'互动屏'
      },{
        value:'pospad',
        label:'收银Pad'
      }],
			rules: {
				name: [
					{required: true, message: '请输入门店名称', trigger: 'blur'},
					{min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
				],
				areaId:[{ required: true, message: '请先添加门店区域', trigger: 'change'}],
				rtsp:[{ required: true, message: '所属省市不能为空', trigger: 'blur'}]
			},
      fromInfo: {
        name:'',
				authName:'',
				password:'',
        areaId:undefined,
        pointData:{},
        rtsp:'',
        usage:0,
        deviceType:'camera'
      },
      tableData: []
    }
  },
	computed: {
		...mapGetters([
			'storeId'
		])
	},
  created() {
  	this.fromInfo.storeId=this.storeId
    this.getAreasData().then(()=>{
			this.getTableData()
		})
  },
  methods: {
    getTableData() {
      this.tableLoading=true
      getDevices(this.fromInfo.storeId).then(res => {
        this.tableData = res
      }).finally(()=>{
        this.tableLoading=false
      })
    },
    btnDevice(type='add'){
			this.dialogType=type
			this.drawType='info'
      this.dialogVisible=true
    },
    btnSubmit() {
			if (this.drawType === 'draw') {
				this.fromInfo.pointData = Object.assign(this.size || {}, this.drawLayer.getPoint())
			}
			const { deviceType }=this.fromInfo
			this.$refs['myform'].validate((valid) => {
				if (valid) {
					this.dgLoading = true
					addUpdateDevice(this.fromInfo).then(res => {
						const fn_user=this.dialogType==='add'?addUser:updateUser
						if(deviceType!=='camera'){
							// 添加设备账号
							fn_user({
								username: res.authName,
								password:this.fromInfo.password,
								storeIds: [this.storeId],
								enabled: true,
								userType: 'device'
							}).then(() => {
								this.dgLoading = false
								this.clearClose('reload')
								this.$message.success('操作成功')
							})
						}else{
							this.dgLoading = false
							this.clearClose('reload')
							this.$message.success('操作成功')
						}
					})
				}
			})
		},
    deleteRow(id) {
      console.log(this)
      this.$confirm('确定要删除这条数据吗？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDevice(id).then(() => {
          this.clearClose('reload')
          this.$message.success('删除成功')
        })
      })
    },
    async edtiData(id,type='draw'){
			this.dialogVisible=true
      this.dialogType='edit'
      this.drawType=type
      this.fromInfo=await getDeviceInfo(id)
			if(!this.areaList.length){
				this.fromInfo.areaId=undefined
			}
      if(type==='draw'){
        await  this.getAreasData()
        // 设置复选框
        this.setProintImg()
        // 渲染canvas
        this.$nextTick(()=>{
          this.setAreasProintData()
        })
      }
    },
    setProintImg(){
      // 动态生成多选
      this.areaList.map((item)=>{
        this.checkType[item.id] = []
      })
      const p_data=this.fromInfo.pointData.point||{}
      for (const key in p_data) {
        this.checkType[p_data[key].areaId] = p_data[key].checkType
      }
      this.checkType=Object.assign({},this.checkType)
      console.log('this.checkType',this.checkType)
    },
    async setAreasProintData() {
      const canvas=document.getElementById('canvasDevice')
      const {point,scale}=this.fromInfo.pointData
			canvas.width = canvas.offsetWidth
			this.size=await AutoImage(this.fromInfo.snapshot,canvas.width)
			canvas.height = this.size.height
      this.drawLayer = new DrawImage(canvas, {
        prointSize: 5,
        scale:scale,
        aryNum: this.selectedArea,
        areaText: this.areaText
      })
      this.drawLayer.init(point||{})
    },
    clearClose(reload){
      this.dialogVisible = false
      if(reload){
        this.getTableData()
      }
			this.$refs['myform'].resetFields()
      this.fromInfo.name=''
      this.fromInfo.rtsp=''
      delete this.fromInfo.id

      console.log(this.fromInfo)
    },
    areaIdTransText(id) {
      const obj=this.areaList.find(item=>{
        return id===item.id
      })
      return obj?obj.name:'未知'
    },
    getAreasData() {
      return new Promise(resolve => {
        getAreas(this.fromInfo.storeId).then(res => {
					if (res.length) {
						this.areaList = res
						this.fromInfo.areaId=res[0].id
						this.selectedArea = res[0].id
						this.areaText = res[0].name
					}else{
						this.areaList = []
					}
					this.fromInfo=Object.assign({}, this.fromInfo)
          resolve()
        })
      })
    },
    onareaSelect(value) {
      console.log(value)
      this.areaText = this.areaList.find(item => item.id === value)['name']
      if(this.pointData) {
        for (const key in this.pointData) {
          if (value === this.pointData[key].areaId) {
            this.checkType[value] = this.pointData[key].checkType
            this.selectedArea = this.pointData[key].areaId
            this.areaText = this.pointData[key].areaText
            break
          }
        }
      }
      this.checkType=Object.assign({},this.checkType)
      this.drawLayer.add(value, this.areaText, this.checkType[value])
    },
    cancelArea(){
      this.drawLayer.cancel()
    },
    setAllPoint() {
      this.drawLayer.setAllPoint(
        this.selectedArea,
        this.areaText,
        this.checkType[this.selectedArea]
      )
    },
    clearArea() {
      this.$confirm('确认要删除' + this.areaText + '吗？')
        .then(() => {
          this.drawLayer.clear(this.selectedArea)
          this.checkType[this.selectedArea] = []
        })
    },
    clearAllAreaData() {
      this.$confirm('确认要删除所有区域吗？').then(() => {
        const tmp_point = this.drawLayer.getPoint()
        const point = tmp_point.point
        for (const item in point) {
          this.checkType[point[item].areaId] = []
        }
        this.drawLayer.clearaAll()
      })
    },
    checkChange() {
      this.drawLayer.add(
        this.selectedArea,
        this.areaText,
        this.checkType[this.selectedArea]
      )
    },
    // 全局门店下拉修改
    $storeIdChanged(storeId){
      if(storeId){
        this.fromInfo.storeId=storeId
				this.getAreasData()
      }
      this.getTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-upload{
    width: 100%!important;
    height: 300px;
    position: relative;
  }
  .store-img{
    max-width: 100%;
    max-height: 60px;
  }
  .area-list{
    margin:0 10px 20px 0;
    cursor: pointer;
  }
  .perview-warp{
    position: relative;
    cursor:crosshair;
		text-align: center;
    canvas{
      width: 100%;
      position: absolute;
      left: 0;
      top:0;
      z-index: 2;
    }
		&.img-error{
			canvas{display:none}
		}
    img{ width: 100%;vertical-align: middle;
			&.error{
				width: 100px;
				margin: 30px auto;
			}
		}
  }
  .el-upload{
    width: 100%;
  }
  .upload-imgshow{
    color: #418aaa;
    width: 100%;
    min-width: 550px;
    min-height: 100px;
    background: #00172f;
    display: block;
    img{
      width: 100%;
      max-height:200px;
      vertical-align: middle;
    }
  }
</style>
