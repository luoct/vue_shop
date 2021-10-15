<template>
  <el-container>
    <el-aside :width="asideWidth">

      <el-menu
        unique-opened
        background-color="#232526"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="iscollapse"
        :collapse-transition="false"
        router
      >
        <div class="tx"></div>
        <el-submenu
          :index="submenu.id+''"
          v-for="submenu in meunList"
          :key="submenu.id"
        >
          <template slot="title">
            <i :class="meunIconsObj[submenu.id]"></i>
            <span>{{ submenu.authName }}</span>
          </template>
          <el-menu-item
            :index="'/home/'+menuIetm.path"
            v-for="menuIetm in submenu.children"
            :key="menuIetm.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ menuIetm.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="40px">
        <el-button
          :icon="toggleIcon"
          type="text"
          @click="toggleCollapse"
        ></el-button>
        <span>后台管理</span>
        <el-button
          class="logout"
          type="text"
          @click="logout"
        >登出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

  data() {
    return {
      meunList: [],
      meunIconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-opportunity',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing',
      },
      iscollapse: false,
      toggleIcon: 'el-icon-s-fold',
    }
  },
  computed: {
    asideWidth() {
      return this.iscollapse ? '64px' : '18%'
    }
  },
  created() {
    this.getMeunList()
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    getMeunList() {
      this.$http.get('/menus').then(({ data: res }) => {
        if (res.meta.status !== 200) return this.$message(res.meta.msg)
        this.meunList = res.data
      })
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    }
  },
}
</script>

<style scoped>
  .el-container {
    height: 100%;
  }
  .tx {
    height: 40px;
  }
  .el-menu {
    height: 100%;
    border-right: 0;
  }
  .el-header {
    border-bottom: 1px solid #f4f4f4;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>