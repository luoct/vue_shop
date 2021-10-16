<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <el-button
        type="primary"
        class="addBtn"
        @click="addRoleDialogVisible=true"
      >添加角色</el-button>
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        class="addRoleDialog"
      >
        <el-form :model="addRoleForm">
          <el-form-item
            label="角色名："
            label-width="200px"
          >
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述："
            label-width="200px"
          >
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addRole"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="rolesList"
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              class="table-row"
            >
              <el-col :span="4">
                <el-tag
                  closable
                  @close="removeRoleRights(scope.row, item1.id)"
                >{{ item1.authName }}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row
                  class="table-row"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="4">
                    <el-tag
                      closable
                      @close="removeRoleRights(scope.row, item2.id)"
                      type="success"
                    >{{ item2.authName }}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      type="info"
                      closable
                      @close="removeRoleRights(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoleEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            ></el-button>
            <el-tooltip
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightsDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="修改角色"
        :visible.sync="editRoleDialogVisible"
      >
        <el-form :model="editRoleForm">
          <el-form-item
            label="角色名"
            label-width="200px"
          >
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            label-width="200px"
          >
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editUser"
          >确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="设置权限"
        :visible.sync="setRightsDialogVisible"
      >
        <el-tree
          :data="rightsTree"
          :props="rightsTreeProp"
          node-key="id"
          ref="rightsTreeRef"
          show-checkbox
          default-expand-all
          :default-checked-keys="rightsTreeDefaultCheckedKeys"
        ></el-tree>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="setRights"
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
      rolesList: [],
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      editRoleForm: {},
      setRightsDialogVisible: false,
      rightsTree: [],
      rightsTreeProp: {
        children: 'children',
        label: 'authName'
      },
      rightsTreeDefaultCheckedKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList() {
      this.$http.get('/roles').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rolesList = res.data
      })
    },
    addRole() {
      this.$http.post('/roles', this.addRoleForm).then(({ data: res }) => {
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.getRolesList()
        for (let i in this.addRoleForm) {
          this.addRoleForm[i] = ''
        }
        this.addRoleDialogVisible = false
      })
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/roles/' + id).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除成功!')
          this.getRolesList()
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    showRoleEditDialog(id) {
      this.$http.get('/roles/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoleForm = res.data
        this.$set(this.editRoleForm, 'id', id)
        this.editRoleDialogVisible = true
      })
    },
    editUser() {
      let { id, roleName, roleDesc } = this.editRoleForm
      let editData = { id, roleName, roleDesc }
      this.$http({
        method: 'put',
        url: '/roles/' + id,
        data: editData
      }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoleDialogVisible = false
        this.$message.success('修改用户成功')
        this.getRolesList()
      })
    },
    removeRoleRights(role, rightId) {
      this.$confirm('是否删除该权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + role.id + '/rights/' + rightId).then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          role.children = res.data
          this.$message.success(res.meta.msg)
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    showSetRightsDialog(role) {
      this.roleId = role.id
      this.$http.get('/rights/tree').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.rightsTree = res.data
        this.$message.success(res.meta.msg)
        this.rightsTreeDefaultCheckedKeys = []
        this.getRightsTreeDefaultCheckedKeys(role, this.rightsTreeDefaultCheckedKeys)
        this.setRightsDialogVisible = true
      })
    },
    getRightsTreeDefaultCheckedKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(elem => {
        this.getRightsTreeDefaultCheckedKeys(elem, arr)
      })

    },
    setRights() {
      let treeRef = this.$refs.rightsTreeRef
      let keys = [...treeRef.getCheckedKeys(), ...treeRef.getHalfCheckedKeys()]

      let rids = keys.join(',')

      this.$http.post('roles/' + this.roleId + '/rights', { rids }).then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('设置成功')
        this.getRolesList()
        this.setRightsDialogVisible = false

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
    min-width: 1000px;
  }
  .card .addBtn {
    margin-bottom: 20px;
  }
  .addRoleDialog .el-input {
    width: 60%;
  }
  .el-table .el-tag {
    margin: 8px;
  }
  .table-row {
    border-bottom: 1px solid #f4f4f4;
    margin-left: 50px;
    margin-right: 50px;
    display: flex;
    align-items: center;
  }
  .table-row:last-child {
    border-bottom: none;
  }
</style>