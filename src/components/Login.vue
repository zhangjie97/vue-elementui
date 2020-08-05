<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
         ref="loginFormRef"
        label-width="0px"
        
      >
      <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="el-icon-info"></el-input>
        </el-form-item>

        <!-- 密码 -->
         <el-form-item prop="password">
          <el-input type="password"  v-model="loginForm.password"  prefix-icon="el-icon-view"></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item  class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 登录数据绑定对象
      loginForm:{
         username:'admin',
         password:'123456'
      },
      // 表单验证规则对象
      loginFormRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
   
  },
  methods: {
    // 表单重置
    reset(){
      console.log(this.$refs)
     this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        console.log(valid)
        if(!valid) return;
        // 1.用promise方法写
        // this.$http.post('login',this.loginForm).then(res=>{
        //    console.log(res)
        // }).catch(err=>{
        //       console.log(err)
        // })

        // 2.使用async和await来处理;并且解构赋值给res
        const {data:res}=await this.$http.post('login',this.loginForm);
        console.log(res)
        if(res.meta.status!==200) return this.$message.error('登录失败！')
           this.$message.success('登录成功')
          //  1.将获取到的token存到sessionStorage中
          sessionStorage.setItem('token',res.data.token)
          // 2.跳到主页面/home
          this.$router.push('/home')


      })
    },

  }
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom:0;
  width: 100%;
  box-sizing: border-box;
  padding:0 20px;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>