<template>
  <v-chart theme="dark" :class="className" :style="{height:height,width:width}" :options="options" />
</template>

<script>
const animationDuration = 2000
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
		grid:{
    	type:Object,
			default(){
    		return {
					top: '10%',
					left: '2%',
					right: '5%',
					bottom: '5%',
					containLabel: true
				}
			}
		},
    data: {
      type: Object,
      default() {

      }
    }
  },
  data() {
		return {
			options: {
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: this.grid,
				xAxis: {
					type: 'category',
					data: [],
					axisTick: {
						alignWithLabel: true
					}
				},
				yAxis: {
					type: 'value',
					name:'',
					axisTick: {
						show: false
					}
				},
				series: {
					name: '123',
					type: 'bar',
					stack: 'vistors',
					barWidth: '10',
					data: [],
					itemStyle: {
						normal: {
							color: 'rgba(113,220,255,.9)',
							borderWidth: 12
						}
					},
					animationDuration
				}
			}
		}
	},
  created() {
    this.options.xAxis.data = this.data.xAxisData
    this.options.series.data = this.data.seriesData
    this.options.yAxis.name = this.data.yAxisName
    console.log(this.options)
  }
}
</script>
