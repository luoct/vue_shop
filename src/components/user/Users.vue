<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="search">

        <el-input
          placeholder="请输入搜索内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
        <el-button
          type="primary"
          @click="addDialogVisible = true"
        >添加用户</el-button>
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
        >
          <el-form :model="addUserForm">
            <el-form-item
              label="用户名"
              label-width="200px"
            >
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              label-width="200px"
            >
              <el-input
                v-model="addUserForm.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              label-width="200px"
            >
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              label-width="200px"
            >
              <el-input v-model="addUserForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addUser"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table
        stripe
        :data="userList"
      >
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
      >
        <el-form :model="editUserForm">
          <el-form-item
            label="用户名"
            label-width="200px"
          >
            <el-input
              v-model="editUserForm.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            label-width="200px"
          >
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            label-width="200px"
          >
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editUser"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
      >
        <el-form :model="setRoleForm">
          <el-form-item
            label="当前的用户"
            label-width="200px"
          >
            <el-input
              v-model="setRoleForm.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="当前的角色"
            label-width="200px"
          >
            <el-input
              v-model="setRoleForm.role_name"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="分配新角色"
            label-width="200px"
          >
            <el-select
              v-model="selectRoleId"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="setRole"
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
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editDialogVisible: false,
      editUserForm: {
        id: undefined,
        username: '',
        email: '',
        mobile: '',
      },
      setRoleDialogVisible: false,
      roleList: [],
      setRoleForm: {},
      selectRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$http.get('users', { params: this.queryInfo }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    changeUserState(v) {
      this.$http.put(`users/${v.id}/state/${v.mg_state}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          v.mg_state = !v.mg_state
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      })
    },
    handleSizeChange(v) {
      this.queryInfo.pagesize = v
      this.getUserList()
    },
    handleCurrentChange(v) {
      this.queryInfo.pagenum = v
      this.getUserList()
    },
    addUser() {
      this.$http.post('/users', this.addUserForm).then(({ data: res }) => {
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加用户成功')
        this.getUserList()
      })
      for (let i in this.addUserForm) {
        this.addUserForm[i] = ''
      }
      this.addDialogVisible = false
    },
    showEditDialog(id) {
      this.$http.get('/users/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editUserForm = res.data
        this.$set(this.editUserForm, 'id', id)
        this.editDialogVisible = true
      })
    },
    editUser() {
      let { id, email, mobile } = this.editUserForm
      let editData = { id, email, mobile }
      this.$http({
        method: 'put',
        url: '/users/' + id,
        data: editData
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisible = false
        this.$message.success('修改用户成功')
        this.getUserList()
      })
    },
    deleteUser(id) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/users/' + id).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除成功!')
          this.getUserList()
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    showSetRoleDialog(user) {
      this.selectRoleId = ''
      this.setRoleForm.username = user.username
      this.setRoleForm.role_name = user.role_name
      this.setRoleForm.id = user.id
      this.$http.get('/roles').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.roleList = res.data
      })
      this.setRoleDialogVisible = true
    },
    setRole() {
      if (!this.selectRoleId) return this.$message.error('请选择一个角色')
      this.$http.put('/users/' + this.setRoleForm.id + '/role', { rid: this.selectRoleId }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('分配鑫角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    }

  }
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
    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 20px;
  }
  .card .el-input {
    width: 40%;
    margin-right: 20px;
  }
  .el-pagination {
    padding: 20px 5px;
  }
</style>