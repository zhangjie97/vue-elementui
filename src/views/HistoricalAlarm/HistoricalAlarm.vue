<template>
<!-- AI报警——历史报警 -->
  <div class="hello">
    <ul>
      <li v-for="(item, index) in historyAlarmList" :key="index">
        <div>
          <div class="seperate"></div>
          <div class="history-content">
              <div class="infolist">
                <p>
                  {{ item.title }}
                </p>
                <p>
                  设备名称：{{ item.Equipmenename }}【报警时间】{{ item.time }}
                </p>
                 <p>
                  处理民警{{ item.hander }}【解除时间】{{ item.time1 }}
                </p>
              </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HistoricalAlarm",
  data() {
    return {
      historyAlarmList: [
        {
          title: "打架斗殴检测：F监区508室",
          Equipmenename: "TW-4277",
          time: "2021-06-27 13:13:52",
           hander: "王队长",
          time1: "2021-06-28 13:13:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
            hander: "王队长",
          time1: "2021-06-28 13:13:52",
          Equipmenename: "TW-4277",
          time: "2021-05-28 13:13:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
            hander: "王队长",
          time1: "2021-06-28 13:13:52",
          Equipmenename: "TW-4277",
          time: "2021-06-22 13:03:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
           hander: "王队长",
          time1: "2021-06-28 13:13:52",
          Equipmenename: "TW-4277",
          time: "2021-06-27 13:13:52",
        },
      ],
    };
  },
  methods: {
  },
};
</script>
<style scoped>
.history-content {
  display: flex;
  justify-content: space-between;
  padding: 16px 0 8px;
  margin: 0 10px;
  border-bottom: 1px solid #eee;
  align-items: center;
}
.seperate {
  height: 5px;
  background-color: #f5f5f5;
}
.infolist {
  text-align: left;
  margin: 0 8px;
}
</style>
