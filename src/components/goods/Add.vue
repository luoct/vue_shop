<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <el-alert
        type="info"
        title="添加商品信息"
        show-icon
        center
      ></el-alert>
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addGoodsForm">

        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称："
              label-width="100px"
            >
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格："
              label-width="100px"
            >
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量："
              label-width="100px"
            >
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量："
              label-width="100px"
            >
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类："
              label-width="100px"
            >
              <el-cascader
                v-model="addGoodsForm.goods_catArr"
                :options="cateList"
                :props="cascaderProps"
                @change="cascaderCateChange"
                clearable
              ></el-cascader>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              v-for="v in manyData"
              :key="v.attr_id"
              :label="v.attr_name"
              label-width="100px"
            >
              <el-checkbox-group v-model="v.attr_vals">
                <el-checkbox
                  class="cb"
                  border
                  v-for="(cb, i) in v.attr_vals"
                  :key="i"
                  :label="cb"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              v-for="v in onlyData"
              :key="v.attr_id"
              :label="v.attr_name"
              label-width="200px"
            >
              <el-input v-model="v.attr_vals"></el-input>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              class="upload"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
            <el-dialog
              title="图片预览"
              :visible.sync="previewDialogVisible"
            >
              <img
                :src="previewPath"
                width="100%"
              >
            </el-dialog>
          </el-tab-pane>

          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="addGoodsForm.goods_introduce"
            >
            </el-input>
            <el-button
              type="primary"
              style="margin: 24px 0"
              @click="addGoods"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_catArr: [1, 3, 6],
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      cateList: [],
      cascaderProps: {
        expandTrigger: 'click',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      manyData: [],
      onlyData: [],
      uploadUrl: 'http://139.9.202.95:8888/api/private/v1/upload',
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewDialogVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_catArr.length === 3) {
        return this.addGoodsForm.goods_catArr[2]
      }
      return null
    },
  },
  methods: {
    getCateList() {
      this.$http.get('/categories').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.data)
        this.cateList = res.data
      })
    },
    cascaderCateChange() {
      if (this.addGoodsForm.goods_catArr.length !== 3) {
        this.addGoodsForm.goods_catArr = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_catArr.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    tabClicked() {
      if (this.activeIndex === '1') {  // 动态参数
        this.$http.get('categories/' + this.cateId + '/attributes',
          {
            params: {
              sel: 'many'
            }
          }
        ).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.data)
          res.data.forEach(element => {
            element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(',')
          })
          this.manyData = res.data
        })
      }
      else if (this.activeIndex === '2') {  // 静态属性
        this.$http.get('categories/' + this.cateId + '/attributes',
          {
            params: {
              sel: 'only'
            }
          }
        ).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.data)
          this.onlyData = res.data
        })
      }

    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addGoodsForm.pics.findIndex(x => {
        x.pic === filePath
      })
      this.addGoodsForm.pics.splice(i, 1)
    },
    handleSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path
      }
      this.addGoodsForm.pics.push(picInfo)
    },
    addGoods() {
      this.addGoodsForm.goods_cat = this.addGoodsForm.goods_catArr.join(',')

      // 处理addGoodsForm.attrs参数
      this.manyData.forEach(item => {
        const info = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        }
        this.addGoodsForm.attrs.push(info)
      })
      this.onlyData.forEach(item => {
        const info = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addGoodsForm.attrs.push(info)
      })

      this.$http.post('goods', this.addGoodsForm).then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.data)
        this.$message.success('添加成功')
        this.$router.push('goods')
      })
    }
  },
}
</script>

<style scoped>
  .el-steps {
    margin-top: 24px;
    margin-bottom: 36px;
  }
  .el-checkbox {
    margin: 0 4px !important;
  }
  .upload {
    width: 360px !important;
  }
</style>