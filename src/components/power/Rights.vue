<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <el-table
        :data="rightsList"
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限说明"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.$http.get('/rights/list').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsList = res.data
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
</style>