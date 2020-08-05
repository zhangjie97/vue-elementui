<template>
  <div class="add">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单项 -->
            <el-form-item label="商品名称:" prop="goods_name">
              <el-input v-model="addForm.goods_name "></el-input>
            </el-form-item>
            <el-form-item label="商品价格:" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量:" prop="goods_weight">
              <el-input v-model="addForm.goods_weight " type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量:" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类:" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                expandTrigger="hover"
                :props="cateProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染动态参数表单数据 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染静态属性表单数据 -->
            <el-form-item
              :label="item.attr_name+':'"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action	必选参数，上传的服务器地址； -->
            <el-upload
              action="http://rambuild.cn:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编译器组件 -->
            <quill-editor
              v-model="addForm.goods_introduce"
            
            />
            <!-- 添加商品 -->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  components: {},
  props: {},
  data() {
    return {
      // 步骤条默认激活索引---实现步骤条和tab页之间的联动
      activeIndex: "0",
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类键值id
        goods_cat: [],
        // 上传的图片数组
        pics: [],
        // 商品详情描述
        goods_introduce:'',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性` 
        attrs:[] ,         

      },
      //  添加商品的表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器定义
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传请求头对象---上传组件并没有用axios，所以需要手动添加请求头
      headerObj: {
        Authorization: sessionStorage.getItem("token"),
      },

      // 预览图片地址
      previewPath: "",
      //  图片预览对话框显示与隐藏
      previewVisible: false,
    };
  },
  watch: {},
  computed: {
    // 当前选中三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  created() {},
  mounted() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cateList = res.data;
    },
    // 级联选择器回调函数
    handleChange() {
      // 只能选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
      console.log(this.addForm.goods_cat);
    },
    // 标签页切换之前的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      console.log("即将离开的标签页" + oldActiveName);
      console.log("即将进入的标签页" + activeName);
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 被选中时触发
    async tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        // console.log('进入动态参数面板')
        // 发起数据请求获取数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );

        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败");
        // 将字符串拼接成数组，便于多选框遍历
        res.data.map((item) => {
          item.attr_vals =
            item.attr_vals.lenght == 0 ? [] : item.attr_vals.split(" ");
        });
        console.log(res);
        this.manyTableData = res.data;
      } else if (this.activeIndex == "2") {
        // console.log('进入静态属性面板')
        // 发起数据请求获取数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态列表失败");
        console.log(res);
        this.onlyTableData = res.data;
      }
    },

    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },

    // 图片长传成功的钩子函数
    handleSuccess(response) {
      console.log(response);
      // 1.拼接成一个对象，push到pics数组里面
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },
    // 图片移除的钩子函数
    handleRemove(file) {
      //  console.log(file)
      //  获取将要删除图片的路径，利用splice删除pics中对应的图片对象
      const filePath = file.response.data.tmp_path;
      console.log(filePath);
      const i = this.addForm.pics.findIndex((item) => {
        return item.pic === filePath;
      });
      console.log(i);
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm.pics);
    },
    // 添加商品
    add(){
     console.log(this.addForm)
      // 首先进行表单预验证
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return this.$message.error('请填写必要的表单信息！');
        // 1.发起请求前，将 goods_cat 处理以逗号成字符串
        // lodash:深拷贝
         const form= _.cloneDeep(this.addForm)
         form.goods_cat=this.addForm.goods_cat.join(',')
          console.log(form.goods_cat)

          // 2.处理动态参数和静态属性
          this.manyTableData.map(item=>{
            const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
      
            this.addForm.attrs.push(newInfo)
          })
            this.onlyTableData.map(item=>{
            const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals}
           this.addForm.attrs.push(newInfo)
          })
          form.attrs=this.addForm.attrs
           console.log(form)
          const { data: res } = await this.$http.post('goods',form);
          console.log(res)
          // if(res.meta.status!==201) return this.$message.error('添加商品失败！')
            // 成功则返回商品列表页面,提示用户成功添加
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
         });

    },






  },
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn{
  margin-top: 15px;
}
</style>