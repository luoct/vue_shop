<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  html,
  body,
  #app {
    height: 100%;
  }
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
</style>
