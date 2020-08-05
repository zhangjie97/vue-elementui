import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/roles'
// import Cate from '@/components/goods/cate'
// import Params from '@/components/goods/Params'

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Login'),
      meta:{
        title:'登录页面'
      }
    },
    {
      path: '/home',    
      name:'home',
      component:() => import('@/components/Home'),
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',  
          name:'welcome',      
         component:() => import('@/components/Welcome'),
        },
        {
          path:'/users',       
          component:() => import('@/components/user/Users'),
        },
        {
          path:'/rights',       
          component:() => import('@/components/power/Rights'),
        },
        {
          path:'/roles',       
          component:() => import('@/components/power/Roles'),
        },
        {
          path:'/categories',      
          component:() => import('@/components/goods/Cate'),
        },
        {
          path:'/params',      
          component:() => import('@/components/goods/Params'),
        },
        {
          path:'/goods',      
          component:() => import('@/components/goods/List'),
        },
        {
          path:'/goods/add',      
          component:() => import('@/components/goods/Add'),
        },
        {
          path:'/orders',      
          component:() => import('@/components/order/Order'),
        },
        {
          path:'/reports',      
          component:() => import('@/components/report/Report'),
        },

      ]
    }
  ]
})


// 解决elementui设置路由重复点击报红
const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

// 为路由添加导航守卫
router.beforeEach((to,from,next)=>{
  // 如果用户访问的是登录页，直接放行
  console.log(to)
  console.log(from)
  // console.log(next)
  if(to.path==='/login') return next();

  // 从sessionStorage获取token值
  const tokenStr = sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');//强制跳转，不能省
  next()
})


export default router