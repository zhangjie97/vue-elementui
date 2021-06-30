<template>
<!-- AI报警——实时报警——人员详情 -->
  <div class="hello">
    <top-bar :title="title"></top-bar>
   
  </div>
</template>

<script>
import TopBar from "../../components/TopBar.vue";
export default {
  name: "PersonnelDetails",
  components: {
    TopBar,
  },
  data() {
    return {
      title: "人员详情",
    };
  },
  methods: {
  },
};
</script>
<style scoped>
.seperate {
  height: 5px;
  background-color: #f5f5f5;
}
</style>
