<template>
  <v-chart
    ref="chart"
    theme="dark"
    :class="className"
    :style="{height:height,width:width}"
    :options="options"
  />
</template>

<script>
import echarts from 'echarts'
const animationDuration = 3000
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
      options :{
          color: ['#D8B104', '#1583DF', '#71DCFF'],
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          legend: {
              data: []
          },
          grid: {
            left: '3%',
            right: '9%',
            bottom: '3%',
            containLabel: true
          },
          calculable: true,
          xAxis: [{
            name: '',
            type: 'category',
            axisTick: {show: false},
            data: []
          }],
          yAxis: [{
                  name: '人数',
                  type: 'value'
              }],
          series: [
              // {
              //     name: 'Forest',
              //     type: 'bar',
              //     barGap: 0,
              //     barWidth:12,
              //     itemStyle: {
              //       normal: {
              //           barBorderRadius: [10, 10, 0, 0],
              //           color:'#71DCFF',
              //           opacity: 0.85
              //       }
              //     },
              //     label: {
              //       normal: {
              //         show: true,
              //         color:"#fff",
              //         position: "top"
              //       },
              //     },
              //     data: [320, 332, 301, 334, 390]
              // },
            
          ]
      }
    }
  },
  watch:{
    data(val){
      const _val = JSON.parse(JSON.stringify(val))
			this.loadData(_val)
    }
  },
  beforeDestroy() {
    this.options = null
  },
  mounted() {
		const datas = this.data
		if (datas.data) {
			this.loadData(datas)
		}
  },
  methods: {
  	loadData(_data){
      this.options.legend.data = []
      this.options.series =[]
      const {xAxisData, xAxisName,legendData, data} = _data
			this.options.xAxis[0].data = xAxisData
      this.options.xAxis[0].name = xAxisName
      this.options.legend.data = legendData
			Object.keys(data).forEach(key => {
        this.options.series.push(
					 {
              name: key,
              type: 'bar',
              barGap: 0,
              barWidth:12,
              itemStyle: {
                normal: {
                    barBorderRadius: [10, 10, 0, 0],
                    opacity: 0.85
                }
              },
              label: {
                normal: {
                  show: true,
                  color:'#fff',
                  position: 'top'
                }
              },
              data: data[key]
          },
				)
      })
		},
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {
        type: contentType
      })
    },
    saveImage(fileName) {
      const aLink = document.createElement('a')
      const base64 = this.$refs.chart.getDataURL()
      const blob = this.base64ToBlob(base64) // new Blob([content]);
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    }
  }
}
</script>
