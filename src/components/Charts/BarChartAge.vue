<template>
  <v-chart
    theme="dark"
    :class="className"
    :style="{height:height,width:width}"
    :options="options"
    ref="chart"
  />
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    },
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      options :{
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: "{a} <br/>{b} : {c}"
          },
          grid: {
            left: "3%",
            right: "9%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            name: '',
            nameGap: 0,
            type: "category",
            splitLine: { show: true },
            // data: ["0-18", "19-29", "30-39", "40-64", ">65"]
            data: []
          },
          yAxis: {
            name: "人数",
            type: "value",
            splitLine: { show: false }
          },
          series: [
            {
              name: "人数",
              type: "bar",
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
                  color:"#fff",
                  position: "top"
                },
              },
              data: []
            }
          ]
        }
    }
  },
  beforeDestroy() {
    this.options = null;
  },
  watch:{
    data(val){
      let _val = JSON.parse(JSON.stringify(val))
      console.log("传过来的数据是",_val)
      this.options.xAxis.data = _val.xAxisData
      this.options.xAxis.name = _val.xAxisName
      this.options.series[0].data = _val.data
    }
  },
  created() {
    this.options.xAxis.data = this.data.xAxisData;
    this.options.xAxis.name = this.data.xAxisName;
    this.options.series[0].data = this.data.data;
  },
  methods: {
    base64ToBlob(code) {
      let parts = code.split(";base64,")
      let contentType = parts[0].split(":")[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {
        type: contentType
      });
    },
    saveImage(fileName) {
      let aLink = document.createElement("a");
      let base64 = this.$refs.chart.getDataURL();
      let blob = this.base64ToBlob(base64); //new Blob([content]);
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    }
  }
};
</script>
