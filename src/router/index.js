import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WorkBench',
      component: ()=>import("@/views/WorkBench")
    },
    {
      path: '/index',
      name: 'index',
      component: ()=>import("@/views/index")
    },
    {
      path: '/RealtimeAlarm',
      name: 'RealtimeAlarm',
      component: ()=>import("@/views/RealtimeAlarm/RealtimeAlarm")

    },
    {
      path: '/HistoricalAlarm',
      name: 'HistoricalAlarm',
      component: ()=>import("@/views/HistoricalAlarm/HistoricalAlarm")
    },
    {
      path: '/AlarmEventsDetails',
      name: 'AlarmEventsDetails',
      component: ()=>import("@/views/RealtimeAlarm/AlarmEventsDetails"),
      
    },
    {
      path: '/BrawlersList',
      name: 'BrawlersList',
      component: ()=>import("@/views/RealtimeAlarm/BrawlersList"),
    },
    {
      path: '/PersonnelDetails',
      name: 'PersonnelDetails',
      component: ()=>import("@/views/RealtimeAlarm/PersonnelDetails"),
    },
    {
      path: '/SenceEvidence',
      name: 'SenceEvidence',
      component: ()=>import("@/views/RealtimeAlarm/SenceEvidence"),
    },
    
    
  ]
})
