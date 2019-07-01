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
				grid: {
					top: '10%',
					left: '2%',
					right: '5%',
					bottom: '5%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: [],
					axisTick: {
						alignWithLabel: true
					}
				}],
				yAxis: [{
					type: 'value',
					axisTick: {
						show: false
					}
				}],
				series: []
			}
		}
	},
  created() {
    this.options.xAxis.data = this.data.xAxisData
    const series_data = []
    this.data.seriesData.map(item => {
      series_data.push({
        name: item.name,
        type: 'bar',
        stack: 'vistors',
        barWidth: '80%',
        data: item.data,
				itemStyle: {
					normal: {
						color: 'rgba(113,220,255,.9)',
						borderWidth: 12
					}
				},
        animationDuration
      })
    })
    this.options.series = series_data
    console.log(this.options)
  }
}
</script>
