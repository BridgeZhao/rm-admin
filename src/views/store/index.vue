<template>
  <div class="app-container store-list">
    <!--头部按钮-->
    <el-row :gutter="20" class="table-head-btns">
      <el-col :span="12" class="flex">
        <el-input
          v-model="pagination.name"
          style="width: 300px;margin-right: 10px"
          placeholder="请输入门店名称"
        >
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="getTableData">
          搜索
        </el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button v-permission="'add'" type="primary" @click="btnAddStore">
          + 添加门店
        </el-button>
      </el-col>
    </el-row>
    <!--弹框-->
    <!--添加-->
    <el-dialog v-if="dialogVisible" v-drag-dialog :title="dialogType==='add'?'门店添加':stepNameTransform()+'修改'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}" @closed="steps=0">
      <el-steps v-if="dialogType==='add'" :active="steps" align-center finish-status="success">
        <el-step title="基本信息" />
        <el-step title="区域管理" />
        <el-step title="区域绘制" />
      </el-steps>
      <!--基本信息-->
      <el-form v-if="steps===0" ref="myform0" v-loading="fromLoading" :model="fromInfo" :rules="rules">
        <el-form-item label="门店名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="fromInfo.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属省市" prop="regionId" :label-width="formLabelWidth">
          <div class="flex">
            <div class="col">
              <el-select v-model="regionVal" placeholder="请选择" @change="regionChange">
                <el-option
                  v-for="item in regionAry"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="col">
              <el-select v-model="fromInfo.regionId" placeholder="请选择">
                <el-option
                  v-for="item in cityAry"
                  :key="item.id"
                  :label="item.cityName"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="平面图" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-img"
            action=""
            name="imgBase64"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePreview"
          >
            <div v-if="fromInfo.imgBase64" class="leave" @mouseenter="enterUploadBtn" @mouseleave="leaveUploadBtn">
              <div class="upload-imgshow rel">
                <img :src="fromInfo.imgBase64" alt="">
              </div>
              <div class="has-upload abs abs-center">
                <el-button><i class="el-icon-upload el-icon--plus" /> 点击修改</el-button>
              </div>
            </div>
            <div v-else class="has-upload abs abs-center">
              <el-button><i class="el-icon-upload el-icon--plus" /> 点击上传</el-button>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!--区域添加-->
      <el-form v-if="steps===1" v-loading="fromLoading" :model="areaData">
        <el-row>
          <el-col :span="24">
            <el-tag
              v-for="tag in areaList"
              :key="tag.id"
              class="area-list"
              closable
              :disable-transitions="false"
              @click="handleEdti(tag)"
              @close="handleClose(tag)"
            >
              {{ tag.name +'(' + tag.num +'人)' }}
            </el-tag>
            <el-form ref="myform1" :inline="true" :model="areaData" :rules="rulesArea">
              <el-form-item label="区域名称" prop="name">
                <el-input v-model="areaData.name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="预警人数" prop="num">
                <el-input v-model.number="areaData.num" type="number" placeholder="请输入整数" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="btnAddUpdateArea">
                  {{ areaData.id?'修改':'新增' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-form>
      <!--区域绘制-->
      <el-form v-if="steps===2" v-loading="fromLoading" :model="fromInfo">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="16">
                <el-select
                  v-model="selectedArea"
                  placeholder="绘制区域选择"
                  @change="onareaSelect"
                >
                  <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.name+'(预警人数'+item.num+')'"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="8" style="text-align: left;padding-left: 20px">
                <el-checkbox-group v-model="checkType[selectedArea]" class="ck-type" @change="checkChange">
                  <el-checkbox label="0">
                    空岗监测
                  </el-checkbox>
                  <el-checkbox label="1">
                    超员监测
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button-group>
              <el-button @click="cancelArea">
                <svg-icon icon-class="cancel" />撤销
              </el-button>
              <el-button @click="setAllPoint">
                <svg-icon icon-class="all" />全绘
              </el-button>
              <el-button @click="clearArea">
                <svg-icon icon-class="clear" />清除
              </el-button>
              <el-button @click="clearAllAreaData">
                <svg-icon icon-class="del" />全清
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <div class="info-tips">
          <i class="el-icon-time" /> 请按顺时针方向点击绘制点位，不得超过10个，下拉可选择对应的绘制区域
        </div>
        <div v-waves class="perview-warp">
          <canvas id="canvasDom" />
          <img :src="fromInfo.imgBase64" onerror="notfound(this)">
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button v-if="dialogType==='add'&&steps===2" @click="stepUp">
          上一步
        </el-button>
        <el-button v-if="dialogType==='add'&&steps!==2" type="primary" :disabled="disabledBtn" @click="checkForm">
          下一步
        </el-button>
        <el-button v-if="dialogType==='add'&&steps===2" type="primary" :disabled="disabledBtn" @click="checkForm('close')">
          完 成
        </el-button>
        <el-button v-if="dialogType==='edit'&&(steps===0||steps===2)" type="primary" :disabled="disabledBtn" @click="checkForm('close')">
          确定修改
        </el-button>
      </div>
    </el-dialog>
    <!--数据列表-->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="门店名"
      />
      <el-table-column
        label="地区"
      >
        <template slot-scope="scope">
          <el-tag type="info">
            {{ transIdtoName(scope.row.regionId) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="平面图"
        width="150"
      >
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.floorGraph" type="danger">
            无
          </el-tag>
          <div v-else>
            <img :src="scope.row.floorGraph" onerror="notfound(this)" class="store-img">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="区域绘制"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.pointData.point&&JSON.stringify(scope.row.pointData.point).length>5?'success':'danger'">
            {{ scope.row.pointData.point&&JSON.stringify(scope.row.pointData.point).length>5?'已绘制':'未绘制' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-dropdown v-permission="'edit'" @command="(idx)=>{edtiData(idx,scope.row)}">
            <el-button size="small" split-button>
              编辑<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">
                基本信息
              </el-dropdown-item>
              <el-dropdown-item command="1">
                区域管理
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.floorGraph" command="2">
                区域绘制
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-permission="'delete'" type="danger" size="small" @click.native.prevent="deleteRow(scope.row.id)">
            删除
          </el-button>
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
import {getAllStores,delStore, addUpdateStore, getRegions } from '@/api/store'
import { addUpdateArea,getAreas,deleteArea} from '@/api/area'
import { AutoImage,DrawImage } from '@/utils/drawImage'

export default {
	data() {
		const validatePass = (rule, value, callback) => {
			console.log(value)
			if (value > 99 || value < 1) {
				callback(new Error('请输入1~99的值'))
			} else {
				callback()
			}
		}
		return {
			steps: 0,
			disabledBtn: false,
			fromLoading: false,
			tableLoading: false,
			formLabelWidth: '80px',
			dialogVisible: false,
			dialogType: 'add',
			fileReader: new FileReader(),
			selectedArea: undefined,
			drawLayer: undefined,
			areaText: undefined,
			checkType: {},
			areaData: {name: '', num: ''},
			areaList: [],
			regionAry: [],
			cityAry: [],
			changeImgBase64: false,
			allRegion: undefined,
			regionVal: '',
			rules: {
				name: [
					{required: true, message: '请输入门店名称', trigger: 'blur'},
					{min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
				],
				regionId: [{required: true, message: '所属省市不能为空', trigger: 'change'}]
			},
			rulesArea: {
				name: [
					{required: true, message: '请输入区域名称', trigger: 'blur'},
					{min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
				],
				num: [{required: true, type: 'number', message: '请输入预警人数', trigger: 'blur'},
					{validator: validatePass}
				]
			},
			fromInfo: {
				name: '',
				regionId: undefined,
				pointData: undefined,
				imgBase64: undefined,
				storeId: undefined
			},
			pagination: {
				page: 1,
				size: 8,
				name: '',
				total: 0
			},
			tableData: [],
			canvas: undefined
		}
	},
	created() {
		this.getTableData()
		// 获取省市列表
		this._getOrgions()
	},
	methods: {
		setProintImg() {
			// 动态生成多选
			this.areaList.map((item) => {
				this.checkType[item.id] = []
			})
			const p_data = this.fromInfo.pointData.point || {}
			for (const key in p_data) {
				const ck=p_data[key].checkType||[]
				this.checkType[p_data[key].areaId] =typeof(ck)==='boolean'?[~~ck]:ck
			}
			this.checkType = Object.assign({}, this.checkType)
			console.log('this.checkType', this.checkType)
		},
		getTableData() {
			this.tableLoading = true
			const _pagination = Object.assign({}, this.pagination)
			delete _pagination.total
			if(!_pagination.name){
				delete _pagination.name
			}
			getAllStores(_pagination).then(res => {
				const {size, total, page, data} = res
				this.tableData = data
				this.pagination.total = total
				this.pagination.page = page
				this.pagination.size = size
			}).finally(() => {
				this.tableLoading = false
			})
		},
		deleteRow(id) {
			this.$confirm('还将删除门店下的所有区域、设备吗？', '删除门店', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				delStore(id).then(() => {
					this.clearClose('reload')
					this.$message.success('删除成功')
				})
			})
		},
		regionChange(val) {
			this.cityAry = this.allRegion[val]
			this.fromInfo.regionId = this.cityAry[0].id
			console.log(this.regionVal)
		},
		pageChange(val) {
			this.pagination.page = val
			this.getTableData()
		},
		onareaSelect(value) {
			console.log(value)
			this.areaText = this.areaList.find(item => item.id === value)['name']
			if (this.pointData) {
				for (const key in this.pointData) {
					if (value === this.pointData[key].areaId) {
						const ck=this.pointData[key].checkType
						this.checkType[value] =typeof(ck)==='boolean'?[~~ck]:ck
						this.selectedArea = this.pointData[key].areaId
						this.areaText = this.pointData[key].areaText
						break
					}
				}
			}
			this.checkType = Object.assign({}, this.checkType)
			this.drawLayer.add(value, this.areaText, this.checkType[value])
		},
		cancelArea() {
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
		async edtiData(idx, data) {
			this.dialogType = 'edit'
			this.steps = idx - 0
			this.fromInfo.name = data.name
			this.fromInfo.imgBase64 = data.floorGraph
			this.fromInfo.storeId = this.fromInfo.id = data.id
			this.fromInfo.regionId = data.regionId
			this.fromInfo.pointData = data.pointData
			if (this.steps === 0) {
				const cityObj = this.regionIdTransName(data.regionId)
				this.regionVal = cityObj.province
				this.cityAry = this.allRegion[this.regionVal]
			}else{
				await this.getAreasData()
			}
			this.dialogVisible = true
			if(this.steps === 2){
				// 设置复选框
				this.setProintImg()
				this.$nextTick(()=>{
					this.setAreasProintData()
				})
			}
			this._resetFields()
		},
		regionIdTransName(id) {
			const obj = {province: '', city: ''}
			const _region = this.allRegion
			for (const key in _region) {
				for (let i = 0; i < _region[key].length; i++) {
					if (_region[key][i]['id'] === id) {
						obj.province = key
						obj.city = _region[key][i]
						break
					}
				}
			}
			return obj
		},
		transIdtoName(id) {
			const cityObj = this.regionIdTransName(id)
			let r_str='未知'
			if(cityObj.province) {
				const city = this.allRegion[cityObj.province].find(item => {
					return item.id === id
				}) || {cityName: '-'}
				if (city) {
					cityObj.city = city.cityName
					r_str=cityObj.province + ' — ' + cityObj.city
				}
			}
			return r_str
		},
		checkForm(type) {
			if (!this.steps) {
				this.$refs['myform' + this.steps].validate((valid) => {
					if (valid) {
						this.stepNext(type)
					}
				})
			} else {
				this.stepNext(type)
			}
		},
		enterUploadBtn($event){
			const name=$event.currentTarget.className.replace(/\s*(leave)/g,'')
			$event.currentTarget.className=name+' enter'
		},
		leaveUploadBtn($event){
			const name=$event.currentTarget.className.replace(/\s*(enter)/g,'')
			$event.currentTarget.className=name+' leave'
		},
		stepNext(type = 'normal') {
			if (this.steps > 2) {
				return
			}
			if (this.steps === 0 || this.steps === 2) {
				this.disabledBtn = this.fromLoading = true
				const data = this.fromInfo
				// this.dialogType==='edit'&&
				if (this.steps === 2) {
					data.pointData = Object.assign(this.size, this.drawLayer.getPoint())
					console.log(data.pointData)
				}
				// 不修改平面图
				if (!this.changeImgBase64) {
					delete this.fromInfo.imgBase64
				}
				if (this.steps === 2) {
					delete this.fromInfo.imgBase64
				}
				addUpdateStore(data).then((res) => {
					this.fromLoading = false
					if (type === 'close') {
						this.$message.success('操作成功')
						this.clearClose('reload')
					} else {
						this.fromInfo.id = this.fromInfo.storeId = res.id
						this.fromInfo.imgBase64 = res.floorGraph
						this.fromInfo.pointData = res.pointData
						if (this.steps === 0) {
							this.$emit('updateStoreList')
							this.getTableData()
						}
						this.steps++
					}
				}).finally(() => {
					this.disabledBtn = this.fromLoading = false
				})
			} else if (this.steps === 1) {
				if (!this.areaList.length) {
					this.$message.error('请先添加区域')
				} else {
					this.steps++
					if(this.steps === 2){
						this.$nextTick(()=>{
							this.setAreasProintData()
						})
					}
				}
			}
		},
		stepUp() {
			if (this.steps <= 0) {
				return
			}
			this.steps--
		},
		handlePreview(file) {
			this.changeImgBase64 = true
			const fileName = file.name
			const isLimt = file.size / 1024 < 500
			const regex = /(.jpg|.jpeg|.png)$/
			if (regex.test(fileName.toLowerCase())) {
				if (isLimt) {
					this.fileReader.readAsDataURL(file.raw)
					this.fileReader.onload = (res) => {
						this.fromInfo.imgBase64 = res.currentTarget.result
						this.fromInfo = Object.assign({}, this.fromInfo)
					}
				} else {
					this.$message.error('上传图片不能超过500KB')
				}
			} else {
				this.$message.error('只能上传jpg或png格式')
			}
		},
		btnAddUpdateArea() {
			this.$refs['myform' + this.steps].validate((valid) => {
				if (valid) {
					this.fromLoading = true
					this.areaData.storeId = this.fromInfo.storeId
					addUpdateArea(this.areaData).then(() => {
						this.fromLoading = false
						if(this.areaData.hasOwnProperty('id')){
							delete this.areaData.id
						}else{
							// 添加门店成功
							this.getAreasData()
							// updateStoreList
						}
						this.areaData.name = ''
						this.areaData.num = ''
						this.$message.success('操作成功')
						this.$refs['myform' + this.steps].resetFields()
					})
				}
			})
		},
		getAreasData() {
			return new Promise(resolve => {
				getAreas(this.fromInfo.storeId).then(res => {
					if (res.length) {
						this.areaList = res
						this.selectedArea = res[0].id
						this.areaText = res[0].name
					}else{
						this.areaList = []
						this.selectedArea=undefined
						this.areaText = ''
					}
					resolve()
				})
			})
		},
		async setAreasProintData() {
			const canvas = document.getElementById('canvasDom')
			const {point, scale} = this.fromInfo.pointData
			canvas.width = canvas.offsetWidth
			this.size = await AutoImage(this.fromInfo.imgBase64, canvas.width)
			canvas.height = this.size.height
			document.querySelector('.perview-warp').style.height = canvas.height + 'px'
			this.drawLayer = new DrawImage(canvas, {
				prointSize: 5,
				scale: scale,
				aryNum: this.selectedArea,
				areaText: this.areaText
			})
			this.drawLayer.init(point || {})
		},
		handleEdti(tag) {
			this.areaData = Object.assign({}, tag)
		},
		handleClose(tag) {
			this.$confirm('确定要删除此区域吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteArea(tag.id).then(res => {
					console.error(res)
					this.$message({
						type: 'success',
						message: '删除成功!'
					})
					this.areaList.splice(this.areaList.indexOf(tag), 1)
				})
			})
		},
		btnAddStore() {
			this.dialogVisible = true
			this.dialogType = 'add'
			this.steps = 0
			this._resetFields()
		},
		clearClose(reload) {
			this.changeImgBase64 = false
			this.dialogVisible = false
			this.checkType = {}
			if (reload) {
				this.getTableData()
			}
			for (const key in this.fromInfo) {
				this.fromInfo[key] = undefined
			}
			this.regionVal = undefined
			this.areaData = {name: '', num: undefined}
			this.cityAry = []
			this.areaList = []
			console.log(this.fromInfo)
		},
		stepNameTransform() {
			let str = ''
			switch (this.steps) {
				case 0:
					str = '基本信息'
					break
				case 1:
					str = '区域管理'
					break
				case 2:
					str = '区域绘制'
					break
			}
			return str
		},
		_resetFields(){
			this.$nextTick(()=>{
				const  t=this.$refs['myform']
				if(t){
					t.resetFields()
				}
			})
		},
		_getOrgions() {
			getRegions().then(res => {
				console.log(res)
				this.allRegion = res
				const ary = []
				for (const key in res) {
					ary.push({value: key, label: key})
				}
				this.regionAry = ary
			})
		}
	}
}
</script>
<style lang="scss" scoped>
/*@import '@/styles/variables.scss';*/
  .el-upload{
		display: block;
    width: 100%!important;
    height: 300px;
    position: relative;
  }
  .store-img{
    max-width: 100%;
    max-height: 60px;
  }
	img.error{
		width: 40px;
	}
  .area-list{
    margin:0 10px 20px 0;
    cursor: pointer;
  }
  .el-upload{
    width: 100%;
  }
	.perview-warp{
		position: relative;
		text-align: center;
		min-height: 100px;
		img.error{
			width: 100px;
			position: absolute;
			left:0;right:0;bottom:0;top:0;
			margin: auto;
		}
		p{
			color: #3d5063;
			text-align: center;
		  padding-top: 35px;
			font-size: 16px;
		}
	}
	.el-upload__tip{
		margin: 0;
		text-shadow: 1px 1px 1px #000;
	}
	.upload-img{
		border: 1px solid #195569;
		border-radius: 5px;
	}
	.enter{
		.has-upload{
			display:block;
		}
	}
	.leave {
		.has-upload {
			display: none;
		}
	}
  .upload-imgshow,.upload-img{
    color: #418aaa;
    width: 100%;
		background: #00172f;
		text-align: center;
    min-width: 550px;
    min-height: 100px;
    display: block;
		.has-upload{
			z-index: 2;
			height: 45px;
		}
		img{
      max-width: 100%;
      max-height: 200px;
      opacity: .5;
			filter: blur(.5px);
			z-index: 1;
      vertical-align: middle;
    }
  }
</style>
