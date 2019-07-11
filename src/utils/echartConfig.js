export default function (config) {
  const opt={
    tooltip:config.tooltip|| {// 提示框
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#2b76c5'
        }
      }
    },
    ...{toolbox:config.toolbox},
    grid:config.grid||{
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '18%'
    },
    // barWidth:2,
    // axisLine:config.axisLine|| {            // 坐标轴线
    //   show: true,        // 默认显示，属性show控制显示与否
    //   lineStyle: {       // 属性lineStyle控制线条样式
    //     color: 'red',
    //     width: 2,
    //     type: 'solid'
    //   }
    // },
    ...{visualMap:config.visualMap||null},
    // label:config.label|| {
    //   normal: {
    //     show: true,
    //     position: 'top',
    //     textStyle: {
    //       color: '#FFFFFF'
    //     }
    //   }
    // },
    color:config.color||['#00c0c0','#007fce'],
    // legend:config.legend,
    xAxis: config.xAxis,
    yAxis: config.yAxis,
    series:config.series
  }
  for(const i in opt){
    if(!opt[i]){
      delete  opt[i]
    }
  }
  return Object.assign(config,opt)
}
