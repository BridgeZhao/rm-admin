<template>
  <v-chart theme="dark" :class="className" :style="{height:height,width:width}" :options="options" :showNum="showNum"/>
</template>

<script>
import echarts from "echarts";
const animationDuration = 3000;
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    showNum:{
      type:Boolean,
      default:true
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "200px"
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
          trigger: "item",
          formatter: "{a} <br/>{b} : 人数 {c}"
        },
        toolbox: {
          right: "2%",
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["男", "女", "总客流"]
        },
        grid: {
          left: "3%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "人数",
            axisLabel: {
              formatter: val => {
                return val >= 1000 ? (val / 1000).toFixed(0) + "k" : val;
              }
            }
          },
          {
            type: "value",
            show: true
          }
        ],
        series: [
          {
            name: "男",
            type: "bar",
            stack: "0",
            barMaxWidth: 60,
            itemStyle: {
              normal: { label: { show: true, position: "insideRight" },
              color:'#50E3C2'},
            },
            data: [],
            label:this.showNum?{
              normal: {
                show: true,
                textStyle: {
                  color: '#00152E'
                }
              }
            }:false
          },
          {
            name: "女",
            type: "bar",
            stack: "0",
            itemStyle: {
              normal: { label: { show: true, position: "insideRight" },
                color:'#71DCFF'}
            },
            data: [],
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#00152E "
                }
              }
            }
          },
          {
            name: "总客流",
            type: "line",
            yAxisIndex: 1,
            data: []
          }
        ]
      }
    };
  },
  beforeDestroy() {
    this.options = null;
  },
  mounted(){
    console.log("this.showNum",this.showNum)
  },
  watch: {
    dataList(obj) {
        let data = Object.assign({},this.dataList);
        console.log("传过来的data---------", data)
      this.options.xAxis[0].data = data.xData
      this.options.series[0].data = data.s_male
      this.options.series[1].data = data.s_female
      this.options.series[2].data = data.s_all

    }
  },
  created() {
    // const { xData, s_male, s_female, s_all} = this.data;
    console.log("传过来的dataddd", this.dataList);
    this.options.xAxis.data = this.dataList.xData;
    this.options.series[0].data = this.dataList.s_male;
    this.options.series[1].data = this.dataList.s_female;
    this.options.series[2].data = this.dataList.s_all;
  },
  methods: {
    initColor() {
      let r = Math.random() * 255;
      let g = Math.random() * 255;
      let b = Math.random() * 255;
      let a = 0.8;
      const colors = `rgba(${r},${g},${b},${a})`;
      return colors;
    }
  }
};
</script>
