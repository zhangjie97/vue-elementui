<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'
export default {
  components: {},
  props: {},
  data() {
    return {
      // 需要合并的选项
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    //   请求得到的optios项
      options1:{},
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getEcharts().then(()=>{
        this.initEcharts()
    })
  },
  methods: {
    //   通过请求获取option项
   async getEcharts(){
      const {data:res}=await this.$http.get('reports/type/1')
       console.log(res)
      if(res.meta.status!==200) return this.$message.error('获取报表信息失败！')
       //   成功则将两个options对象合并，采用lodash
      this.options1=_.merge(res.data,this.options)
   

     
    },
    //   初始化echarts
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
     let option=this.options1
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
</style>