<template>
<!-- AI报警——实时报警——报警事件详情——现场取证-->
  <div class="hello">
    <top-bar :title="title"></top-bar>
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
      title: "现场取证",
    };
  },
  methods: {
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
