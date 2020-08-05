<template>
  <div class="Params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row style="margin:15px 0">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <!-- props:指定配置对象 -->
          <el-cascader
            :options="cateList"
            v-model="selectedCateKeys"
            expandTrigger="hover"
            clearable
            :props="cateProps"
            @change="CateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环遍历标签 -->
                <el-tag
                  closable
                  @close="handleClose(index,scope.row)"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="190">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板  -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
          >添加属性</el-button>

          <!-- 表格 -->
          <el-table :data="onlyTableData" border stripe style="width: 100%">
            <!-- 展开列 -->
              <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环遍历标签 -->
                <el-tag
                  closable
                  @close="handleClose(index,scope.row)"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="190">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框，将两个弹框合并，通过判断即可 -->
    <el-dialog
      :title="'添加'+titleText"
      @close="addDialogClosed"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 内容区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name "></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框，将两个弹框合并，通过判断即可 -->
    <el-dialog
      :title="'编辑'+titleText"
      @close="editDialogClosed"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name "></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      // 商品分类列表
      cateList: [],
      // 指定级联选择器配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //  级联选择器双向绑定到的数组
      selectedCateKeys: [],

      // 当前激活的页签
      activeName: "many",

      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],

      // 控制弹框的显示与隐藏
      addDialogVisible: false,

      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      // 添加参数的表单数据校验规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // 编辑对话框----------
      // 控制编辑弹框的显示与隐藏
      editDialogVisible: false,
      //编辑参数的表单数据对象
      editForm: {
        attr_name: "",
      },
      // 编辑参数的表单数据校验规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中三级分类的id
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 弹框动态标题文本
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  created() {},
  mounted() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data;
    },

    // 获取参数列表
    async getParamsData() {
      // 只允许选择三级，所以根据对应id数组长度来判断

      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 表格内容动态清空
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      console.log(this.selectedCateKeys);
      // 此时，根据当前所选的三级分类id和当前所处面板种类，获取参数列表
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败！");

      // 将可选项遍历改成数组
      res.data.map((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框输入的值
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName == "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 级联选择器回调函数----
    CateChange() {
      this.getParamsData();
    },

    // 页签选择函数
    handleClick() {
      console.log(this.activeName);
      this.getParamsData();
    },

    // 弹框关闭的回调
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 确认添加参数
    addParams() {
      //  先进行表单验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类参数失败！");
        }
        // 更新成功之后1.关闭对话框，刷新数据列表，提示用户
        this.addDialogVisible = false;
        this.getParamsData();
        this.$message.success("添加分类参数成功");
      });
    },

    // 编辑参数按钮，点击弹出对话框事件
    async showEditDialog(attr_id) {
      console.log(attr_id);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("查询分类参数失败！");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //编辑弹框关闭的回调
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 确认编辑分类参数
    editParams() {
      // 进行表单验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("编辑分类参数失败");
        // 成功后执行刷新，关闭弹窗，给出提示
        this.editDialogVisible = false;
        this.getParamsData();
        this.$message.success("编辑分类参数成功");
      });
    },

    //根据id来 删除对应的参数
    async removeParams(attr_id) {
      console.log(attr_id);
      const cinfirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (cinfirmResult !== "confirm") return this.$message.info("已取消删除");
      //  删除业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      console.log(res);
      if (res.meta.status !== 200) this.$message.error("删除参数失败！");
      // 删除成功，提示用户，刷新列表
      this.getParamsData();
      this.$message.success("删除分类参数成功");
    },

    async saveAttrVals(row) {
      // 发起请求，将数据存到服务器
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("更新参数失败");
      // 成功提示用户，刷新列表
      this.$message.success("更新参数成功");
    },
    // 文本框失去焦点或者按下enter键触发
    handleInputConfirm(row) {
      console.log(row);
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 否则输入了数据，将东西添加到数组中即可
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      console.log(row.attr_vals.join(" "));
      this.saveAttrVals(row);
    },
    // 显示输入框
    showInput(row) {
      row.inputVisible = true;
      //  让文本框聚焦，在页面dom元素渲染完成后，再执行回调函数的东西
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
}
</style>