<template>
  <div class="Users">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          <el-button type="info" size="large" @click="reset">重置</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表表格表格区域 -->
      <el-table border stripe :data="userList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" @close="editDialogClosed" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" @close="setRoleDialogClosed" :visible.sync="setRoleDialogVisible" width="50%">
      <!-- 内容区域 -->
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    //   自定义校验规则:1.邮箱2.手机号
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //  合法邮箱
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };

    //    手机号校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };
    return {
      //   获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 2,
      },
      // 用户列表
      userList: [],
      // 总条数
      total: 0,
      //   添加用户对话框显示与隐藏
      addDialogVisible: false,

      //  添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //   添加表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //   编辑用户对话框
      editDialogVisible: false,
      // 查询到的用户信息
      editForm: {},
      // 修改表单的校验规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //   分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      // 需要分配角色从用户信息
      userInfo: {},

      // 所以角色数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId:'',
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getUserList();
  },
  methods: {
    //   获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    //   监听当前页数改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //   监听switch开关状态改变
    async userStateChanged(userInfo) {
      console.log(userInfo.mg_state);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success(res.meta.msg);
    },
    // 重置搜索
    reset() {
      (this.queryInfo = {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 2,
      }),
        this.getUserList();
    },

    // 添加用户对话框关闭回调
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },

    // 确认添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        // 关闭对话框，并且重新获取列表数据
        this.addDialogVisible = false;
        this.getUserList();
      });
    },

    // 编辑用户对话框--并且更具用户id获取用户信息
    async showEditDialog(id) {
      console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
    },
    // 监听编辑对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    // 确认编辑用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        // 更新成功之后1.关闭对话框，刷新数据列表，提示用户
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("更新信息成功");
      });
    },
    // 删除用户
    async removeUserById(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(err => err);
      // 如果用户确认，返回confirm，否则返回cancel
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");

      // 解决分页最后一条数据删除不刷新
      let total = Math.ceil((this.total - 1) / this.queryInfo.pagesize);
      let pagenum =
        this.queryInfo.pagenum > total ? total : this.queryInfo.pagenum;
      this.queryInfo.pagenum = pagenum < 1 ? 1 : pagenum;
      //  刷新列表
      this.getUserList();
    },
    // 分配角色
    async setRole(userInfo) {
      console.log(userInfo);
      this.userInfo = userInfo;
      //  在展示对话框之前获取所以的角色列表
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },

    // 确认分配角色
   async saveRoleInfo(){
     if(!this.selectedRoleId) return this.$message.error('请选择角色!');
     const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      console.log(res)
      if(res.meta.status!==200) return this.$message.error('分配角色失败!');
      this.$message.success('分配角色成功!');
      // 刷新列表，关闭弹框
      this.getUserList()
      this.setRoleDialogVisible=false
    },
    //分配角色 对话框关闭的回调
    setRoleDialogClosed(){
      this.selectedRoleId=''
      this.userInfo={}
    }
  },
};
</script>
<style lang="less" scoped>
</style>