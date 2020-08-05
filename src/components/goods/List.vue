<template>
  <div class="goods_list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getGoodsList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border stripe :data="goodsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称 "></el-table-column>
        <el-table-column prop="goods_price" width="95px" label="商品价格(元) "></el-table-column>
        <el-table-column prop="goods_number" width="70px" label="商品数量 "></el-table-column>
        <el-table-column prop="goods_weight" width="70px" label="商品重量 "></el-table-column>
        <el-table-column width="140px" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time | dataFormate}}</template>
        </el-table-column>
        <el-table-column label="操作 " width="140">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      //   获取商品列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 10,
      },
      // 商品总数量
      total: 0,
      //   商品列表数组
      goodsList: [],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getGoodsList();
  },
  methods: {
    //  获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败！");
      // 获取成功将数据赋值
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    //   监听当前页数改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },

    //删除商品
    async removeById(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
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
      const { data: res } = await this.$http.delete("goods/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("删除商品失败");
      }
      this.$message.success("删除商品成功");
      // 解决分页最后一条数据删除不刷新
      let total = Math.ceil((this.total - 1) / this.queryInfo.pagesize);
      let pagenum =this.queryInfo.pagenum > total ? total : this.queryInfo.pagenum;
      this.queryInfo.pagenum = pagenum < 1 ? 1 : pagenum;
      //  刷新列表
      this.getGoodsList();
    },

    // 跳到添加商品页面
    goAddpage(){
        this.$router.push('/goods/add')
    }
  },
};
</script>
<style lang="less" scoped>
</style>