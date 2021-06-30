<template>
<!-- AI报警Tab页面 -->
  <div id="index-container">
    <top-bar :title="title"></top-bar>
    <van-tabs type="">
      <van-tab title="实时报警">
        <realtime-alarm> </realtime-alarm>
      </van-tab>
      <van-tab title="历史报警">
     <historical-alarm></historical-alarm>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import TopBar from "../components/TopBar.vue";
import HistoricalAlarm from './HistoricalAlarm/HistoricalAlarm.vue';
import RealtimeAlarm from './RealtimeAlarm/RealtimeAlarm.vue';
export default {
  name: "",
  components: {
    TopBar,
    RealtimeAlarm,
    HistoricalAlarm
  },
  data() {
    return {
      active: 0,
      title: "报警列表",
    };
  },
};
</script>
<style scoped>
/* #index-container /deep/.van-tabs__nav{
line-height: 40px;
} */
</style>
<style lang=''>
  .van-tabs__nav{
   height: 40px !important;
   line-height: 40px !important;
}
</style>

