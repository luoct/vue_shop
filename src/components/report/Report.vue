<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div
        id="chart"
        style="width: 600px;height:400px;"
      ></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
    }
  },
  mounted() {
    const myChart = echarts.init(document.querySelector('#chart'))

    this.$http('reports/type/1').then(({ data: res }) => {
      if (res.meta.status !== 200) return this.$message.error(res.meat.msg)

      let op = Object.assign(this.options, res.data)

      myChart.setOption(op);
    })

  },

  methods: {

  },

}
</script>

<style scoped>
</style>