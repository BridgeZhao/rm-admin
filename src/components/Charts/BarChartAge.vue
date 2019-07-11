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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{a} <br/>{b} : {c}'
          },
          legend:{
            data:[]
          },
          grid: {
            left: '3%',
            right: '9%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            name: '',
            nameGap: 0,
            type: 'category',
            splitLine: { show: true },
            // data: ["0-18", "19-29", "30-39", "40-64", ">65"]
            data: []
          },
          yAxis: {
            name: '人数',
            type: 'value',
            splitLine: { show: false }
          },
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth:12,
              itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 0, 0],
                        color:'#71DCFF',
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
              data: []
            }
          ]
        }
    }
  },
  watch:{
    data(val){
      const _val = JSON.parse(JSON.stringify(val))
      console.log('barCHartAge-watch',_val.data)
			this.loadData(_val)
    }
  },
  beforeDestroy() {
    this.options = null
  },
  mounted() {
		console.log('barCHartAge-mounted',this.data)
		const datas = this.data
		if (datas.data) {
			this.loadData(datas)
		}
  },
  methods: {
  	loadData(_data){
      const arrData = []
      const {xAxisData, xAxisName, data} = _data
			this.options.xAxis.data = xAxisData
      this.options.xAxis.name = xAxisName
			this.options.series[0].data = data
			// data.forEach((value, index) => {
      //   console.log('!!!!~~~',arrData[index])
      //   this.options.series.push(
			// 		{
      //         name: "人数",
      //         type: "bar",
      //         barWidth:12,
      //         itemStyle: {
      //               normal: {
      //                   barBorderRadius: [10, 10, 0, 0],
      //                   color:'#71DCFF',
      //                   opacity: 0.85
      //               }
      //           },
      //         label: {
      //           normal: {
      //             show: true,
      //             color:"#fff",
      //             position: "top"
      //           },
      //         },
      //         data: arrData[index]
      //       }
			// 	)
      // })
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
