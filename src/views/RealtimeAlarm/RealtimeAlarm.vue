<template>
<!-- AI报警——实时报警 -->
  <div class="hello">
    <ul>
      <li v-for="(item, index) in realAlarmList" :key="index">
        <div>
          <div class="seperate"></div>
          <div class="real-content">
            <div class="content-left">
              <van-icon name="chat-o" />
              <div class="infolist">
                <p>
                  {{ item.title }}<span>({{ item.isDone }})</span>
                </p>
                <p>
                  设备名称：{{ item.Equipmenename }}【报警时间】{{ item.time }}
                </p>
              </div>
            </div>
            <van-icon name="arrow" />
          </div>
          <div class="content-bottom">
            <p @click="gotoDeatails">报警详情</p>
            <p>解除报警</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "RealtimeAlarm",
  data() {
    return {
      realAlarmList: [
        {
          title: "打架斗殴检测：F监区508室",
          isDone: "未处理",
          Equipmenename: "TW-4277",
          time: "2021-06-28 13:13:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
          isDone: "已处理",
          Equipmenename: "TW-4277",
          time: "2021-05-28 13:13:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
          isDone: "未处理",
          Equipmenename: "TW-4277",
          time: "2021-06-22 13:03:52",
        },
        {
          title: "打架斗殴检测：F监区508室",
          isDone: "已处理",
          Equipmenename: "TW-4277",
          time: "2021-06-27 13:13:52",
        },
      ],
    };
  },
  methods: {
    gotoDeatails() {
      this.$router.push('/AlarmEventsDetails')
    },
  },
};
</script>
<style scoped>
.real-content {
  display: flex;
  justify-content: space-between;
  padding: 16px 0 8px;
  margin: 0 10px;
  border-bottom: 1px solid #eee;
}
.content-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-bottom {
  height: 36px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: blue;
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
