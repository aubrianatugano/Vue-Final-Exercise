<template>
  <el-container class="common-layout">
    <el-header class="header">
      <h1 class="header-title">Employee Management</h1>
      <div class="nav-links">
        <el-link type="primary" href="/companies">Companies</el-link>
        <el-link type="primary" href="/employees">Employees</el-link>
        <el-link type="primary" href="/timelogs">TimeLogs</el-link>
      </div>
    </el-header>

    <el-main>
      <router-view />
      <!-- This will load the respective views based on the route -->
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
* {
  font-family: 'Trebuchet MS', sans-serif;
}

.common-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #a8dadc;
  padding: 15px;
  background-color: #f1faee;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.header-title {
  margin-left: auto;
  font-size: 24px;
  margin-right: 20px; /* Move title to the right */
}
</style>
