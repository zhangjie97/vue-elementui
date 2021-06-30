import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:() => import('@/views/Login/index')
    },
    {
      path: '/WorkBench',
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


  const router = new Router({
    mode: 'history',
    // base: process.env.BASE_URL,
    // base:'fda-admin',
    routes
  });

  // 路由守卫
  router.beforeEach((to,from,next) => {
  const isLogin = localStorage.eleToken?true:false;
  if(
    to.path == "/login"
  
  ) {
    next();
  }else{
    isLogin?next():next('/login');
  }
});

export default router

