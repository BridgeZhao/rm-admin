<template>
  <v-chart
    ref="chart"
    theme="dark"
    :class="className"
    :style="{height:height,width:width}"
    :options="options"
    :show-num="showNum"
  />
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    showNum:{
      type:Boolean,
      default:true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    dataList: {
			type: Object,
			default() {
			}
    }
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : 人数 {c}'
        },
        toolbox: {
          right: '2%',
          feature: {
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['男', '女', '总客流']
        },
        grid: {
          left: '3%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            axisLabel: {
              formatter: val => {
                return val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val
              }
            }
          },
          {
            type: 'value',
						name: '总人数',
						zlevel:2,
            show: true
          }
        ],
        series: [
          {
            name: '男',
            type: 'bar',
            stack: '0',
            barMaxWidth: 60,
            itemStyle: {
              normal: { label: { show: true, position: 'insideTop'
              },
              color:'#50E3C2'}
            },
            data: [],
            label:this.showNum?{
              normal: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            }:false
          },
          {
            name: '女',
            type: 'bar',
            stack: '0',
            itemStyle: {
              normal: { label: { show: true, position: 'insideTop'
             },
              color:'#71DCFF'}
            },
            data: [],
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            }
          },
          {
            name: '总客流',
            type: 'line',
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    dataList(obj) {
        const data = Object.assign({},this.dataList)
        console.log('传过来的data---------', data)
      this.options.xAxis[0].data = data.xData
      this.options.series[0].data = data.s_male
      this.options.series[1].data = data.s_female
      this.options.series[2].data = data.s_all
    }
  },
  beforeDestroy() {
    this.options = null
  },
  mounted(){
    console.log('this.showNum',this.showNum)
  },
  created() {
    // const { xData, s_male, s_female, s_all} = this.data;
    console.log('传过来的dataddd', this.dataList)
    this.options.xAxis.data = this.dataList.xData
    this.options.series[0].data = this.dataList.s_male
    this.options.series[1].data = this.dataList.s_female
    this.options.series[2].data = this.dataList.s_all
  },
  methods: {
    initColor() {
      const r = Math.random() * 255
      const g = Math.random() * 255
      const b = Math.random() * 255
      const a = 0.8
      const colors = `rgba(${r},${g},${b},${a})`
      return colors
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
