<template>
  <div class="chart-container">
    <el-card class="chart-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <div style="float: right; padding: 3px 0">
          <svg-icon icon-class="link" @click="openChart(optionData,'line')" />
        </div>
      </div>
      <div class="chart-card-item">
        <line-chart :data="optionData" />
      </div>
    </el-card>
    <el-card class="chart-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <div style="float: right; padding: 3px 0">
          <svg-icon icon-class="link" @click="openChart(optionBarData,'bar')" />
        </div>
      </div>
      <div class="chart-card-item">
        <bar-chart :data="optionBarData" />
      </div>
    </el-card>
    <dialog-chart :show="showFullChart" :data="dialogChartData" :type="typeFullchart" @close="showFullChart=false" />
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart'
import BarChart from '@/components/Charts/BarChart'
import dialogChart from '@/components/Charts/dialogChart'
export default {
  components: { LineChart, BarChart, dialogChart },
  data() {
    return {
      typeFullchart: 'line',
      showFullChart: false,
      dialogChartData: {},
      optionData: {
        seriesData: [[220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122], [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]],
        legendData: ['CMCC', 'CTCC'],
        xAxisData: [['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']]
      },
      optionBarData: {
        xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        seriesData: [
          { name: 'name1', data: [79, 52, 200, 334, 390, 330, 220] },
          { name: 'name2', data: [29, 32, 100, 234, 290, 230, 120] }]
      }
    }
  },
  methods: {
    openChart(data, type) {
      this.showFullChart= true
      this.typeFullchart= type
      this.dialogChartData= Object.assign({}, data)
    }
  }
}
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>

