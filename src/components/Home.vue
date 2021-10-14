<template>
  <div>
    <h1>home</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>
</style>