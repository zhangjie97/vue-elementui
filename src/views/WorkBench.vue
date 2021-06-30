<template>
  <!-- 工作台 -->
  <div id="Workbench-container">
    <div class="Workbench-header">
      <div></div>
      <div style="color: #fff">工作台</div>
      <div><van-icon name="setting-o" color="#fff" /></div>
    </div>
    <div class="application-container">
      <div>我的应用</div>
      <div>全部<van-icon name="arrow" color="#666" /></div>
    </div>
    <van-grid :column-num="5">
      <van-grid-item @click="alertInfo" icon="home-o" text="电子巡更" />
      <van-grid-item @click="alertInfo" icon="search" text="智慧押解" />
      <van-grid-item @click="alertInfo" icon="home-o" text="档案检索" />
      <van-grid-item @click="gotoAlarm" icon="search" text="AI报警" />
      <van-grid-item @click="alertInfo" icon="home-o" text="统计分析" />
      <van-grid-item @click="alertInfo" icon="search" text="人脸识别" />
      <van-grid-item @click="alertInfo" icon="home-o" text="集群对讲" />
      <van-grid-item @click="alertInfo" icon="search" text="视频监控" />
      <van-grid-item @click="alertInfo" icon="home-o" text="移动执法" />
      <van-grid-item @click="alertInfo" icon="search" text="警囚谈话" />
    </van-grid>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item icon=""></van-tabbar-item>
      <van-tabbar-item icon="notes-o">工作台</van-tabbar-item>
      <van-tabbar-item icon=""></van-tabbar-item>
    </van-tabbar>

    <van-dialog v-model="show" 
      title=""
       message-align='left' 
       confirm-button-text="请查看"
       @confirm="gotoalarmList">
      <div class="dialog-container">
        <div class="dialog-header">
          <van-icon name="chat-o" />
          紧急报警
        </div>
        <div class="dialog-main">
          <p>报警设备名称:TW-4277</p>
          <p>报警时间：2021-06-28 13:13:50</p>
          <p>报警设备地址：F监区508室西南角</p>
          <p>报警事件概要：检测F监区508室正在发生恶性斗殴事件，请及时处理！</p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import HistoricalAlarm from "./HistoricalAlarm/HistoricalAlarm.vue";
import RealtimeAlarm from "./RealtimeAlarm/RealtimeAlarm.vue";
export default {
  name: "",
  components: {
    TopBar,
    RealtimeAlarm,
    HistoricalAlarm,
  },
  data() {
    return {
      active: 1,
      title: "工作台",
      show: false,
    };
  },
  methods: {
    onChange() {},
    alertInfo() {
      this.$dialog.alert({
        message: "待规划",
      });
    },
    gotoAlarm() {
      this.show = true;
    },
    gotoalarmList(){
      this.$router.push('/index')
    }
  },
};
</script>
<style scoped>
.Workbench-header {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  height: 60px;
  line-height: 80px;
  background-color: #666;
  opacity: 0.5;
}
.application-container {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  line-height: 30px;
}
</style>
<style lang=''>
.van-tabs__nav {
  height: 40px !important;
  line-height: 40px !important;
}
</style>

