<template>
	<div class="app-container">
		<div class="box-header">
			<span style="font-size: 1.8rem">总部广告成效分析</span>
			<div class="search" style="margin-top: 25px;">
				<el-form
					:inline="true"
					:model="formInline"
					class="demo-form-inline"
					label-width="10px"
				>
					<el-form-item label>
						<el-date-picker
							v-model="formInline.time"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="searchData()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="top report-margin">
			<el-row :gutter="24">
				<el-col :span="6">
					<div class="grid-content bg-purple report-line">
						<el-tooltip class="item" effect="dark" content="通过人脸识别，所监测到的人数" placement="top-start">
							<i class="el-icon-info report-tip"></i>
						</el-tooltip>
						<div class="report-title">观看总人数</div>
						<div class="report-num" style="color: #d8b104;">{{viewTotal}}</div>
						<div class="report-small"></div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple report-line">
						<el-tooltip
							class="item"
							effect="dark"
							content="根据观看人数，按天筛选同一个人"
							placement="top-start"
						>
							<i class="el-icon-info report-tip"></i>
						</el-tooltip>
						<div class="report-title">不重复观看人数</div>
						<div class="report-num" style="color: #50e3c2;">{{viewUniqueTotal}}</div>
						<div class="report-small"></div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple report-line">
						<el-tooltip
							class="item"
							effect="dark"
							content="扫描二维码并打开的人数"
							placement="top-start"
						>
							<i class="el-icon-info report-tip"></i>
						</el-tooltip>
						<div class="report-title">扫码人数</div>
						<div class="report-num" style="color: #d8b104;">{{qrcodeTotal}}</div>
						<div class="report-small"></div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple report-line">
						<el-tooltip class="item" effect="dark" content="扫码人数/不重复观看人数" placement="top-start">
							<i class="el-icon-info report-tip"></i>
						</el-tooltip>
						<div class="report-title">平均扫码转化率</div>
						<div class="report-num" style="color: #50e3c2;">{{converseRate}}</div>
						<div class="report-small"></div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="bottom">
			<el-row :gutter="24" class="report-margin">
				<el-col :span="12"><div class="grid-content bg-purple report-line">
					<div class="report-gang">
						<span>每日成效图</span>
<!--						<el-button size="mini" @click="saveImage('客流类型分布')">保存图片</el-button>-->
					</div>
					<div style="width:100%;height:100%;">
<!--						<pie-chart :data="vipData" ref="客流类型分布" :height="chartHeight"/>-->
					</div>

				</div></el-col>
				<el-col :span="12"><div class="grid-content bg-purple report-line">
					<div class="report-gang">
						<span>区域成效</span>
					</div>
					<div style="width:100%;height:100%;">
						<el-table
							:data="areaData"
							style="width: 100%"
						>
							<el-table-column
								prop="adArea"
								label="区域"
							>
							</el-table-column>
							<el-table-column
								prop="view"
								label="欢看人数"
								sortable>
							</el-table-column>
							<el-table-column
								prop="viewUnique"
								label="不重复欢看人数"
								sortable>
							</el-table-column>
							<el-table-column
								prop="converseRate"
								label="扫二维码人数"
								sortable>
							</el-table-column>
						</el-table>
					</div>
				</div></el-col>
			</el-row>
			<el-row :gutter="24" class="report-margin">
				<el-col :span="12"><div class="grid-content bg-purple report-line">
					<div class="report-gang">
						<span>广告内容成效</span>
					</div>
					<div style="width:100%;height:100%;">
						<el-table
							:data="contentData"
							style="width: 100%"
						>
							<el-table-column
								prop="adContent"
								label="广告内容"
								>
							</el-table-column>
							<el-table-column
								prop="view"
								label="欢看人数"
								sortable>
							</el-table-column>
							<el-table-column
								prop="viewUnique"
								label="不重复欢看人数"
								sortable>
							</el-table-column>
							<el-table-column
								prop="converseRate"
								label="扫二维码人数"
								sortable>
							</el-table-column>
						</el-table>
					</div>

				</div></el-col>
				<el-col :span="12"><div class="grid-content bg-purple report-line">
					<div class="report-gang">
						<span>每日区域成效</span>
<!--						<el-button size="mini" @click="saveImage('客流年龄分布')">保存图片</el-button>-->
					</div>
					<div style="width:100%;height:100%;">
<!--						<bar-chart-age :data="ageData" />-->

					</div>
				</div></el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import BarChartAge from "@/components/Charts/BarChartAge";
export default {
	name:'advertising',
	components:{BarChartAge},
	data(){
		return{
			formInline: {
				time: ''
			},
			viewTotal: 0,
			viewUniqueTotal: 0,
			qrcodeTotal: 0,
			converseRate: 0.1,
			contentData:[
				{
					adContent: "content1",
					view: 10,
					viewUnique: 1,
					converseRate: 0.1
				}
			],
			areaData:[
				{
					adArea: "area1",
					view: 10,
					viewUnique: 1,
					converseRate: 0.1
				}
			]
		}
	},
	mounted() {
	},
	methods:{
		searchData(){

		}
	}
}
</script>
<style lang="scss" scoped>
	@import "@/styles/report.scss";
	.app-container{
		background: none;
		.box-header {
			width: 100%;
			height: 30px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
			padding-left: 10px;
			color: #71dcff;
			position: relative;
			&::after {
				position: absolute;
				content: "";
				display: block;
				top: 14px;
				background: #71dcff;
				width: 0.2rem;
				height: 1.5rem;
				margin-top: -0.7rem;
				left: 0px;
				border-radius: 0.1rem;
			}
		}
	}

</style>
