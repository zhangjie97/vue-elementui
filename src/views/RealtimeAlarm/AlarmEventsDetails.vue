<template>
<!-- AI报警——实时报警——报警事件详情-->
  <div class="hello">
    <top-bar :title="title"></top-bar>
    <div class="details-partone">
      <div class="details-top">
        <img src="" alt="" />
      <p>事件编号：F50820310628131350</p>
      <p>设备地址：F监区508室</p>
      <p>报警设备名称：TW-427</p>
      <p>报警时间：2021-06-28 13：13：50</p>
      <p>处理状态：未处理请及时处理</p>
      </div>
      
      <div class="seperate"></div>
    </div>
    <div class="details-parttwo">
      <div class="details-top">
           现场图片
      <div class="imgStyle">
        <img src="" alt="" />
        <van-icon name="arrow" color="#666" />
      </div>
      <p>
        事件描述：F监区508室设备TW-427检测有6人在2021-06-28
        13：13：50存在打架斗殴行为
      </p>
      <div class="imgStyle" @click="gotoBrawDetails">
        <p>斗殴人员列表</p>
        <van-icon name="arrow" color="#666" />
      </div>
      </div>
      <div class="seperate"></div>
    </div>
    <div class="details-partthree">
      <p>去处理</p>
      <p @click="gotoSenceEvidence">现场取证</p>
       <!-- <div class="seperate"></div> -->
    </div>
  </div>
</template>

<script>
import TopBar from "../../components/TopBar.vue";
export default {
  name: "AlarmEventsDetails",
  components: {
    TopBar,
  },
  data() {
    return {
      title: "报警事件详情",
    };
  },
  methods: {
    gotoBrawDetails() {
      this.$router.push('BrawlersList')
    },
    gotoSenceEvidence(){
       this.$router.push('SenceEvidence')
    }
  },
};
</script>
<style scoped>
.details-partone,
.details-parttwo,
.details-partthree{
  text-align: left;
}
.imgStyle{
  display: flex;
  justify-content: space-between;
}
.details-top{
  margin: 0 10px 10px;
}
.seperate {
  height: 5px;
  background-color: #f5f5f5;
}
.details-partthree{
  display: flex;
  justify-content: space-around;
}
</style>
