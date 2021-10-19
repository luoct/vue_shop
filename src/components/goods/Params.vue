<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <div class="search">
        <span>请选择商品分类： </span>
        <el-cascader
          v-model="cascaderCateKeys"
          :options="cateList"
          :props="cascaderProps"
          @change="cascaderCateChange"
          clearable
        ></el-cascader>
      </div>
      <el-tabs
        v-model="tabActiveName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="tags">
                  <el-tag
                    v-for="(v,i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="closeTag(i, scope.row)"
                  >{{ v }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="addAttrValTag(scope.row)"
                    @blur="addAttrValTag(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showAddTagInput(scope.row)"
                  >+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="tags">
                  <el-tag
                    v-for="(v,i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="closeTag(i, scope.row)"
                  >{{ v }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="addAttrValTag(scope.row)"
                    @blur="addAttrValTag(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showAddTagInput(scope.row)"
                  >+ New Tag</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="addParamsDialogVisible"
      >
        <el-form
          :model="addParamsForm"
          ref="addParamsFormRef"
        >
          <el-form-item
            :label="'添加'+dialogTitle+'的名称：'"
            label-width="200px"
          >
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addParamsDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addParams"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="'修改'+dialogTitle"
        :visible.sync="editDialogVisible"
      >
        <el-form
          :model="addParamsForm"
          ref="addParamsFormRef"
        >
          <el-form-item
            :label="'修改名称为：'"
            label-width="200px"
          >
            <el-input v-model="editAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editAttr"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      cascaderCateKeys: [1, 3, 6],
      tabActiveName: 'many',
      manyData: [],
      onlyData: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      editDialogVisible: false,
      editAttrForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: '',
      },
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    isBtnDisabled() {
      return !this.cascaderCateKeys.length
    },
    cascaderCateId() {
      if (this.cascaderCateKeys.length !== 3) return null
      return this.cascaderCateKeys[2]
    },
    dialogTitle() {
      return this.tabActiveName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('/categories').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.data)
        this.cateList = res.data
      })
    },
    cascaderCateChange() {
      if (this.cascaderCateKeys.length !== 3) {
        this.manyData = []
        this.onlyData = []
        return
      }
      this.getParams()
    },
    handleTabClick() {
      this.getParams()
    },
    getParams() {
      this.$http.get('/categories/' + this.cascaderCateId + '/attributes', { params: { sel: this.tabActiveName } }).then(({ data: res }) => {

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('获取参数成功')
        res.data.forEach(element => {
          // 处理空字符串的分割
          element.attr_vals = element.attr_vals ? element.attr_vals.split(',') : []
          // 控制单独的 add-tag-input
          element.inputVisible = false
          element.inputValue = ''
        })
        this.tabActiveName === 'many' ? this.manyData = res.data : this.onlyData = res.data
      })
    },
    addParams() {
      this.$http.post('/categories/' + this.cascaderCateId + '/attributes',
        {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.tabActiveName
        }
      ).then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('获取参数成功')
        this.getParams()
        this.addParamsDialogVisible = false
        this.addParamsForm.attr_name = ''
      })
    },
    showEditDialog(attr) {
      this.editAttrForm = {}
      this.$http.get(`categories/${attr.cat_id}/attributes/${attr.attr_id}`, { params: { attr_sel: this.tabActiveName } }).then(({ data: res }) => {
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editAttrForm = res.data
        // this.$set(this.editAttrForm, 'attr_id', attr.attr_id)
        this.editDialogVisible = true
      })
    },
    editAttr() {
      this.$http.put(`categories/${this.cascaderCateId}/attributes/${this.editAttrForm.attr_id}`, { attr_sel: this.tabActiveName, attr_name: this.editAttrForm.attr_name }).then(({ data: res }) => {
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editAttrForm = res.data
        this.$message.success('修改成功！')
        this.getParams()
        this.editDialogVisible = false
      })
    },
    deleteAttr(attr) {
      this.$confirm('是否删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${attr.cat_id}/attributes/${attr.attr_id}`).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getParams()
          this.$message.success('删除成功!')
        })
      }).catch(() => {
        this.$message.error('已取消删除!')
      })
    },
    addAttrValTag(v) {
      // todo: 回车会发起两次请求
      if (v.inputValue.trim().length === 0) {
        v.inputValue
        v.inputVisible = false
        return
      }
      v.attr_vals.push(v.inputValue.trim())
      v.inputVisible = false
      this.saveAttrVals(v)
    },
    saveAttrVals(v) {
      this.$http.put(`categories/${this.cascaderCateId}/attributes/${v.attr_id}`,
        {
          attr_sel: v.attr_sel,
          attr_name: v.attr_name,
          attr_vals: v.attr_vals.join(',')
        }
      ).then(({ data: res }) => {
        console.log(res)

        if (res.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.$message.success('修改成功！')
      })
    },
    showAddTagInput(v) {
      v.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    closeTag(i, v) {
      v.attr_vals.splice(i, 1)
      this.saveAttrVals(v)
    }
  }
}
</script>

<style scoped>
  .search {
    margin-top: 20px;
  }
  .el-dialog .el-input {
    width: 80%;
  }
  .tags {
    padding: 0 42px !important;
  }
  .tags .el-tag {
    margin: 0 8px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>