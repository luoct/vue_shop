<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="search">
        <el-input
          placeholder="请输入搜索内容"
          v-model="queryInfo.query"
          clearable
          @clear="getOrderList"
          class="queryInput"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOrderList"
          ></el-button>
        </el-input>
      </div>

      <el-table
        stripe
        :data="orderList"
      >
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          min-width="160"
        >
        </el-table-column>

        <el-table-column
          prop="order_price"
          label="订单价格"
        >
        </el-table-column>

        <el-table-column
          prop="pay_status"
          label="是否付款"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.pay_status === 1"
            >已付款</el-tag>
            <el-tag
              type="danger"
              v-else
            >未付款</el-tag>

          </template>
        </el-table-column>

        <el-table-column
          prop="is_send"
          label="是否发货"
        >
        </el-table-column>

        <el-table-column
          prop="create_time"
          label="下单时间"
          min-width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <el-dialog
        title="修改地址"
        :visible.sync="editAddrDialogVisible"
      >
        <el-form :model="addressForm">
          <el-form-item
            label="省市区/县"
            label-width="160px"
          >
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
            ></el-cascader>
          </el-form-item>

          <el-form-item
            label="详细地址"
            label-width="160px"
          >
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editAddrDialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(v, i) in progressInfo"
            :key="i"
            :timestamp="v.time"
          >
            {{v.c}}
          </el-timeline-item>
        </el-timeline>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="progressDialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import cityData from '../../assets/citydata.js'

export default {
  data() {
    return {
      orderList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      editAddrDialogVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [
        { time: '1614649904216', c: 'aaa' },
        { time: '1604649904216', c: 'aaa' },
        { time: '1630649904216', c: 'aaa' },
        { time: '1535649904216', c: 'aaa' },
        { time: '1534659904216', c: 'aaa' },
        { time: '1534649944216', c: 'aaa' },
        { time: '1534649904216', c: 'aaa' },
      ],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$http.get('/orders', { params: this.queryInfo }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(v) {
      this.queryInfo.pagesize = v
      this.getOrderList()
    },
    handleCurrentChange(v) {
      this.queryInfo.pagenum = v
      this.getOrderList()
    },
    showEditDialog() {
      this.editAddrDialogVisible = true
    },
    showProgressDialog() {
      this.$http.get('/kuaidi/1106975712662').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.progressInfo = res.data
      })
      this.progressDialogVisible = true
    }
  }
}
</script>

<style scoped>
  .queryInput {
    width: 40%;
    margin-right: 20px;
  }
  .el-pagination {
    padding: 20px 5px;
  }
  .el-dialog .el-input,
  .el-cascader {
    width: 80%;
  }
  .el-timeline {
    padding: 0 32px;
  }
</style>