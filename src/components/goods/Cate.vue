<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="search">
        <el-button
          type="primary"
          @click="showAddCateDialog"
        >添加商品分类</el-button>
      </div>
      <tree-table
        :data="cateList"
        :columns="cateColumns"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="false"
      >
        <template
          slot="isOK"
          slot-scope="scope"
        >
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            circle
            v-if="scope.row.cat_deleted === false"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            size="mini"
            circle
            v-else
          ></el-button>
        </template>
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag>{{scope.row.cat_level + 1 + '级'}}</el-tag>
        </template>
        <template
          slot="option"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            size="mini"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="delete(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="添加商品分类"
      :visible.sync="addCateDialogVisible"
    >
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
      >
        <el-form-item
          label="分类名称： "
          label-width="200px"
        >
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类： "
          label-width="200px"
        >
          <el-cascader
            v-model="parentCateKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 0,
      cateColumns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', prop: 'cat_deleted', type: 'template', template: 'isOK' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'option' }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cate_pid: 0,
        cate_name: '',
        cate_level: 0,
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      parentCateKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('/categories', { parmas: this.queryInfo }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.data)
        this.cateList = res.data
        this.total = res.data.length
      })
    },
    handleSizeChange(v) {
      this.queryInfo.pagesize = v
      this.getCateList()
    },
    handleCurrentChange(v) {
      this.queryInfo.pagenum = v
      this.getCateList()
    },
    showAddCateDialog() {
      this.addCateForm.cate_name = ''
      this.addCateForm.cate_pid = 0
      this.addCateForm.cate_level = 0
      this.parentCateKeys = []
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    getParentCateList() {
      this.$http.get('/categories', { parmas: { type: 2 } }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.parentCateList = res.data
      })
    },
    parentCateChange() {
      let keysLen = this.parentCateKeys.length
      if (keysLen > 0) {
        this.addCateForm.cate_pid = this.
          parentCateKeys[keysLen - 1]
        this.addCateForm.cate_level = keysLen
        return
      } else {
        this.addCateForm.cate_pid = 0
        this.addCateForm.cate_level = 0
      }

    },
    addCate() {
      if (this.addCateForm.cate_name === '') return
      this.$http.post('/categories', this.addCateForm).then(({ data: res }) => {
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })

    }
  },
}
</script>

<style scoped>
  .card {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    margin-top: 20px;
    padding: 20px;
  }
  .search {
    padding-bottom: 20px;
  }
  .el-pagination {
    padding: 20px 5px;
  }
  .el-dialog .el-input {
    width: 80%;
  }
  .el-dialog .el-cascader {
    width: 80%;
  }
</style>