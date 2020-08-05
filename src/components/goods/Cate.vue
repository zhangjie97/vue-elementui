<template>
  <div class="categories">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形结构表格部分 -->
      <!-- <el-table border stripe :data="cateList" style="width: 100%">
         <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="手机相机"></el-table-column>
      </el-table>-->

      <tree-table
        style="margin-top:15px"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        show-index
        index-text="#"
      >
        <template slot="is-ok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="action" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editCate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品分类弹框 -->
    <el-dialog title="添加分类" @close="addCateClosed" :visible.sync="addCateVisible" width="50%">
      <!-- 内容区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- props:指定配置对象 -->
          <el-cascader
            change-on-select
            :options="parentCateList"
            v-model="selectedKeys"
            expandTrigger="hover"
            clearable
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑商品分类弹框 -->
    <el-dialog title="编辑分类" @close="editCateClosed" :visible.sync="editCateVisible" width="50%">
      <!-- 内容区域 -->
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateSure">确 定</el-button>
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
      //获取商品分类的 请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 分类数据列表
      cateList: [],
      // 总数据
      total: 0,
      // 表格列配置
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //  自定义插槽
          type: "template",
          template: "is-ok",
        },
        {
          label: "排序",
          //  自定义插槽
          type: "template",
          template: "cat_level",
        },
        {
          label: "操作",
          //  自定义插槽
          type: "template",
          template: "action",
          width: 200,
        },
      ],

      //   添加商品分类弹框显示与隐藏
      addCateVisible: false,
      // 添加分类表单的数据
      addCateForm: {
        cat_name: "",
        //  父级分类的id
        cat_pid: 0,
        // 默认添加一级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类列表
      parentCateList: [],

      // 指定级联选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中父级分类的id数组
      selectedKeys: [],

      //  编辑分类弹框部分----控制弹框显示隐藏
      editCateVisible: false,
      //编辑分类的表单数据
      editCateForm: {},
      // 编辑表单的校验规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    // 监听pagesize事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //   监听当前页数改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    //  点击按钮添加分类并且显示弹框
    addCate() {
      this.getParentCateList();
      this.addCateVisible = true;
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类列表失败");
      this.parentCateList = res.data;
    },
    // 级联选择器选择项回调函数
    parentCateChange() {
      console.log(this.selectedKeys);
      // 根据数组长度来判断当前是选中的父级分类，反之，没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 重新置为0
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 最终确定添加分类按钮事件
    addCateSure() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        //  成功重新刷新列表，关闭弹窗

        this.getCateList();
        this.addCateVisible = false;
        this.$message.success("添加分类成功");
      });
    },
    //监听添加分类弹框关闭----重置表单数据，绑定id，以及传参的对象
    addCateClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 编辑分类-----------
    // 编辑按钮事件
    async editCate(id) {
      console.log(id);
      this.editCateVisible = true;
      const { data: res } = await this.$http.get("categories/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询分类失败");
      }
      this.editCateForm = res.data;
    },
    //监听弹框关闭的回调函数
    editCateClosed() {
      this.$refs.editCateFormRef.resetFields();
    },
    //  最终确认编辑
    editCateSure() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          { cat_name: this.editCateForm.cat_name }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("编辑分类失败");
        }
        // 更新成功之后1.关闭对话框，刷新数据列表，提示用户
        this.editCateVisible = false;
        this.getCateList();
        this.$message.success("更新信息成功");
      });
    },

    // 根据id删除分类
    async removeCate(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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

      const { data: res } = await this.$http.delete("categories/" + id);
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
      this.getCateList();
    },
  },
};
</script>
<style lang="less" scoped>
</style>