<!-- components/TimeLogManagement.vue -->
<template>
  <div>
    <h1>Time Logs</h1>

    <div class="input-container">
      <el-select v-model="employeeId" placeholder="Select Employee">
        <el-option v-for="emp in employees" :key="emp.id" :label="emp.name" :value="emp.id" />
      </el-select>
      <el-button type="primary" @click="createTimeLog">Clock In</el-button>
    </div>

    <el-table :data="timeLogs">
      <el-table-column prop="employeeName" label="Employee" />
      <el-table-column prop="dateTimeInUtc" label="Time In" />
      <el-table-column prop="dateTimeOutUtc" label="Time Out" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button
            v-if="!scope.row.dateTimeOutUtc"
            type="success"
            @click="updateTimeLog(scope.row.employeeTimeLogId)"
          >
            Clock Out
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'TimeLogManagement',
  data() {
    return {
      employees: [],
      timeLogs: [],
      employeeId: '',
    }
  },
  mounted() {
    this.fetchEmployees()
    this.fetchTimeLogs()
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await api.getEmployees()
        console.log(response)
        this.employees = response.data.results
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    },
    async fetchTimeLogs() {
      try {
        const response = await api.getTimeLogs()
        console.log(response)
        this.timeLogs = response.data.results
      } catch (error) {
        console.error('Error fetching time logs:', error)
      }
    },
    async createTimeLog() {
      if (!this.employeeId) return
      try {
        await api.createTimeLog({ employeeId: this.employeeId })
        this.fetchTimeLogs()
      } catch (error) {
        console.error('Error creating time log:', error)
      }
    },
    async updateTimeLog(id) {
      try {
        await api.updateTimeLog(id)
        this.fetchTimeLogs()
      } catch (error) {
        console.error('Error updating time log:', error)
      }
    },
  },
}
</script>

<style scoped>
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
