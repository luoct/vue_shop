<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="search">
        <el-input
          placeholder="请输入搜索内容"
          v-model="queryInfo.query"
          clearable
          @clear="getGoodsList"
          class="queryInput"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoodsList"
          ></el-button>
        </el-input>
        <el-button
          type="primary"
          @click="goAddPage"
        >添加商品</el-button>
      </div>

      <el-table
        stripe
        :data="goodsList"
      >
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          min-width="240"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      goodsList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      this.$http.get('/goods', { params: this.queryInfo }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(v) {
      this.queryInfo.pagesize = v
      this.getGoodsList()
    },
    handleCurrentChange(v) {
      this.queryInfo.pagenum = v
      this.getGoodsList()
    },
    deleteGoods(id) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/goods/' + id).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除成功!')
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    goAddPage() {
      this.$router.push('add-goods')
    }
  }
}
</script>

<style scoped>
  .queryInput {
    width: 40%;
    margin-right: 20px;
  }
  .el-dialog .el-input {
    width: 80%;
  }
  .el-pagination {
    padding: 20px 5px;
  }
</style>