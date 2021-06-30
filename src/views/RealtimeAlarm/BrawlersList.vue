<template>
<!-- AI报警——实时报警——斗殴人员列表 -->
  <div class="hello">
    <top-bar :title="title"></top-bar>
    <div class="list-content">
      <img src="" alt="" />
      <ul>
        <li v-for="(item,index) in BrawlersList" :key=index @click='gotoPersonnelDetails'>
          <div class="listitem">
            <div class="listitem-left">
              <van-icon name="arrow-left" color="#666" />
              <div class="listitem-content">
                <p>{{item.title}}</p>
                <p>所属监区监室：{{item.belones}}</p>
              </div>
            </div>
            <div class="listitem-right">
              <van-icon name="arrow" color="#666" />
            </div>
          </div>
          <div class="seperate"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TopBar from "../../components/TopBar.vue";
export default {
  name: "BrawlersList",
  components: {
    TopBar,
  },
  data() {
    return {
      title: "斗殴人员列表",
      BrawlersList:[
        {title:'斗殴嫌疑人1：张三（编号：215081113）',belones:'F监区508室'},
        {title:'斗殴嫌疑人1：张三（编号：215081113）',belones:'F监区508室'},
        {title:'斗殴嫌疑人1：张三（编号：215081113）',belones:'F监区508室'},
        {title:'斗殴嫌疑人1：张三（编号：215081113）',belones:'F监区508室'},
        {title:'斗殴嫌疑人1：张三（编号：215081113）',belones:'F监区508室'},
      ]
    };
  },
  methods: {
    gotoPersonnelDetails() {
      this.$router.push('/PersonnelDetails')
    },
  },
};
</script>
<style scoped>
.list-content {
  text-align: left;
}
.listitem{
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.listitem-left{
   display: flex;
  justify-content: space-between;
  align-items: center;
}
.listitem-content{
  margin-left: 6px;
}
.seperate {
  height: 5px;
  background-color: #f5f5f5;
}
</style>
