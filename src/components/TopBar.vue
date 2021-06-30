<template>
  <div class="topbar">
    <div @click="goBack"><van-icon name="arrow-left" color='#666' /></div>
    <div>{{title}}</div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  props: ['title'],
  data () {
    return {
    }
  },
  methods:{
    goBack(){
     this.$router.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.topbar{
  display: flex;
  /* padding: 0 16px; */
  margin: 0 6px;
  height: 48px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #666;
}
</style>
