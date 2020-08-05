<template>
  <div class="order">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getOrdersList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border stripe :data="ordersList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号 "></el-table-column>
        <el-table-column prop="order_price" label="订单价格 "></el-table-column>
        <el-table-column label="是否付款 ">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay=='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" prop="is_send" label="是否发货 "></el-table-column>
        <el-table-column width="140px" prop="create_time" label="下单时间 ">
          <template slot-scope="scope">{{scope.row.create_time | dataFormate}}</template>
        </el-table-column>
        <el-table-column label="操作 " width="140">
          <template>
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <!-- 物流 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog title="修改地址" @close="addressDialogClosed" :visible.sync="addressVisible" width="50%">
      <!-- 内容区域 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <!-- 编辑弹窗 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <!-- 内容区域 -->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in logistics"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 订单列表数据
      ordersList: [],
      //   获取商品列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 5,
      },
      // 商品总数量
      total: 0,

      //   编辑弹框是否显示
      addressVisible: false,

      addressForm: {
        address1: [],
        address2: "",
      },
      // 校验规则
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      //   省市区县数据
      cityData: cityData,

      //   物流信息匡是否可见
      progressVisible: false,
    //   物流信息
      logistics:[],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getOrdersList();
  },
  methods: {
    //  获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败！");
      // 获取成功将数据赋值
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrdersList();
    },
    //   监听当前页数改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getOrdersList();
    },
    // 显示编辑对话框
    showBox() {
      this.addressVisible = true;
    },
    // 监听编辑对话框关闭
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    // 打开物流弹框
  async showProgressBox() {
        // 获取物流信息
        const {data:res} = await this.$http.get('/kuaidi/1106975712662')
         console.log(res)
         if(res.meta.status!==200) return this.$message.error('获取物流信息失败！')
          this.logistics =res.data 
         this.progressVisible = true;
    },
    
    
  },
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>