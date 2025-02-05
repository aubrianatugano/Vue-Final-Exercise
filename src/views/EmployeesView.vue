<template>
  <div>
    <h1>List of Employees</h1>

    <div class="input-container">
      <fieldset class="employee-input">
        <legend>Input Employee</legend>
        <el-input v-model="newEmployee.name" placeholder="Enter Name" />
        <el-input v-model="newEmployee.email" placeholder="Enter Email" />
        <el-input v-model="newEmployee.position" placeholder="Enter Position" />
        <el-input-number v-model="newEmployee.salary" placeholder="Enter Salary" />
        <el-input v-model="newEmployee.sssNumber" placeholder="Enter SSS Number" />
        <el-input v-model="newEmployee.pagIbigNumber" placeholder="Enter Pag-IBIG Number" />
        <el-button type="primary" round @click="addEmployee">Add Employee</el-button>
      </fieldset>

      <el-input
        v-model="searchQuery"
        placeholder="Search Employees"
        @input="debouncedSearchEmployees"
      />
    </div>

    <el-table :data="employees">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="position" label="Position" />
      <el-table-column prop="salary" label="Salary" />
      <el-table-column prop="sssNumber" label="SSS Number" />
      <el-table-column prop="pagIbigNumber" label="Pag-IBIG Number" />
      <el-table-column label="Actions">
        <template #default="scope">
          <el-button type="primary" round @click="openUpdateDialog(scope.row)">Edit</el-button>
          <el-popconfirm
            title="Are you sure you want to delete this employee?"
            @confirm="deleteEmployee(scope.row.id)"
            ok-text="Yes"
            cancel-text="No"
          >
            <template #reference>
              <el-button type="danger" round>Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- Edit Employee Dialog -->
    <el-dialog v-model="updateDialogVisible" title="Update Employee">
      <el-form model="selectedEmployee">
        <el-form-item label="Name"><el-input v-model="selectedEmployee.name" /></el-form-item>
        <el-form-item label="Email"><el-input v-model="selectedEmployee.email" /></el-form-item>
        <el-form-item label="Position"
          ><el-input v-model="selectedEmployee.position"
        /></el-form-item>
        <el-form-item label="Salary"
          ><el-input-number v-model="selectedEmployee.salary"
        /></el-form-item>
        <el-form-item label="SSS Number"
          ><el-input v-model="selectedEmployee.sssNumber"
        /></el-form-item>
        <el-form-item label="Pag-IBIG Number"
          ><el-input v-model="selectedEmployee.pagIbigNumber"
        /></el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="updateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" round @click="updateEmployee">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import api from '@/services/Api'

export default {
  name: 'EmployeeManagement', // <-- Change the name here
  data() {
    return {
      newEmployee: {
        name: '',
        email: '',
        position: '',
        salary: '',
        sssNumber: '',
        pagIbigNumber: '',
      },
      employees: [],
      searchQuery: '',
      updateDialogVisible: false,
      selectedEmployee: {},
    }
  },
  methods: {
    async fetchEmployees() {
      const response = await api.getEmployees()
      this.employees = response.data.results
    },
    async addEmployee() {
      await api.createEmployee(this.newEmployee)
      ElMessage.success('Employee added successfully')
      this.fetchEmployees()
    },
    async updateEmployee() {
      await api.updateEmployee(this.selectedEmployee.id, this.selectedEmployee)
      ElMessage.success('Employee updated successfully')
      this.updateDialogVisible = false
      this.fetchEmployees()
    },
    deleteEmployee(id) {
      api.deleteEmployee(id).then(() => {
        ElMessage.success('Employee deleted')
        this.fetchEmployees()
      })
    },
    openUpdateDialog(employee) {
      this.selectedEmployee = { ...employee }
      this.updateDialogVisible = true
    },
    debouncedSearchEmployees: debounce(function () {
      this.fetchEmployees()
    }, 1000),
  },
  mounted() {
    this.fetchEmployees()
  },
}
</script>
