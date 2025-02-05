<template>
  <el-container>
    <el-main>
      <h2>Employee List</h2>

      <el-table :data="paginatedEmployees" border style="width: 100%">
        <el-table-column prop="name" label="Employee Name"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="position" label="Position"></el-table-column>
        <el-table-column prop="salary" label="Salary"></el-table-column>
      </el-table>

      <!-- Pagination Controls -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="employees.length"
        @current-change="handlePageChange"
      />
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    employees: Array, // Receive employees from parent component
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 5, // Number of employees per page
    }
  },
  computed: {
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.employees.slice(start, end)
    },
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
    },
  },
}
</script>

<style scoped>
.el-main {
  padding: 20px;
}
</style>
