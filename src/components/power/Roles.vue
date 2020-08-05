<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table border stripe :data="roleList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 遍历一级权限 -->
            <el-row
              :class="['bdbottom',index1===0? 'bdtop':'','vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                    @close="removeRightById(scope.row,item1.id)">
                    {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级，三级权限 -->
              <el-col :span="19">
                <!-- 遍历二级权限 -->
                <el-row
                  :class="[index2===0? '':'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success"
                    closable
                    @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag closable
                    @close="removeRightById(scope.row,item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
           
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <!-- 分配角色 -->
            <el-button type="warning" icon="el-icon-setting" size="mini"
             @click="showSetrightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑用户" @close="editDialogClosed" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName "></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
       <el-dialog title="分配权限"  :visible.sync="setRightDialogVisible" @close="setRightDialogClose" width="50%">
      <!-- 内容区域 ----树形控件-->
      <el-tree  ref="treeRef" :data="rightsList" node-key="id" default-expand-all  :default-checked-keys="defKeys"
       show-checkbox :props="treeProps"></el-tree>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 所以角色列表
      roleList: [],
      // 添加表单角色数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //   添加角色表单的验证规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },       
        ],
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //   添加角色对话框显示与隐藏
      addDialogVisible: false,

      //  编辑角色对话框显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息
      editForm: {},
      // 修改表单的校验规则
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },

    // 分配权限对话框显示与隐藏 
    setRightDialogVisible:false,
    // 所以权限的数据
    rightsList:[],

    // 指定树结构  
      treeProps:{
          children: 'children',
          label: 'authName'
        },
        // 默认选中的节点ID值数组
        defKeys:[],
        // 当前即将分配权限的角色Id
        roleId:'',
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.roleList = res.data;
    },

    // 添加角色对话框关闭回调
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.addDialogVisible = false;
    },
    // 确认添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加用户成功");
        // 关闭对话框，并且重新获取列表数据
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },

    // 编辑角色对话框--并且根据用户id获取角色信息
    async showEditDialog(id) {
      console.log(id);
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败");
      }
      this.editForm = res.data;
    },
    // 监听编辑对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    // 确认编辑角色信息
    editRoleInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败");
        }
        // 更新成功之后1.关闭对话框，刷新数据列表，提示用户
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("更新角色信息成功");
      });
    },

    // 删除角色
    async removeRoleById(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认，返回confirm，否则返回cancel
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete("roles/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("删除角色失败");
      }
      this.$message.success("删除用户成功");

      //  刷新列表
      this.getRolesList();
    },

    // 根据id删除权限---对应一级二级三级，封装成一个函数即可
  async removeRightById(role,rightId){
    //   弹框提示用户是否删除
    const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
       if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res)
      if(res.meta.status!==200) return this.$message.error('删除权限失败!');
    // 避免用户体验，不重新调用方法，直接赋值返回的最新数据
    //   this.getRolesList()
    role.children=res.data
    },

    // 分配权限对话框
    async showSetrightDialog(role){
        console.log(role)
        this.roleId=role.id
        // 获取所有权限数据
        const{data:res}=await this.$http.get('rights/tree');
        console.log(res)
        if(res.meta.status!==200) return this.$message.error('获取权限失败');
        this.rightsList=res.data

        // 递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
       this.setRightDialogVisible=true
    },
    // 通过递归形式获取所有三级权限的节点id，并保存到defKeys数组中
    getLeafKeys(node,arr){
        // 如果当前node节点不包含children属性，则是三级节点
      if(!node.children){
          return arr.push(node.id)
      }
      node.children.map(item=>{
          this.getLeafKeys(item,arr)
      })

    },
    // 监听分配权限对话框的关闭
    setRightDialogClose(){
     this.defKeys=[]
    },
    // 确定分配角色权限
   async allotRights(){
      const Keys=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idStr=Keys.join(',')
          console.log(idStr)
          const{data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
          console.log(res)
          if(res.meta.status!==200) return this.$message.error('分配角色权限失败')
          this.$message.success('分配权限成功')
        //   刷新列表数据
        this.getRolesList()
        // 关闭对话框
        this.setRightDialogVisible=false
      
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>