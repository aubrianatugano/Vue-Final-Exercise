<!-- components/EmployeeManagement.vue -->
<template>
  <div>
    <h1>List of Employees</h1>
    <div class="input-container">
      <fieldset class="employee-input">
        <legend>Input Employee</legend>
        <el-input v-model="newEmployee.name" placeholder="Enter Name" id="name" name="name" />
        <el-input v-model="newEmployee.email" placeholder="Enter Email" id="email" name="email" />
        <el-input
          v-model="newEmployee.position"
          placeholder="Enter Position"
          id="position"
          name="position"
        />
        <el-input-number
          v-model.number="newEmployee.salary"
          placeholder="Enter Salary"
          id="salary"
          name="salary"
        />
        <el-input
          v-model="newEmployee.sssNumber"
          placeholder="Enter SSS Number"
          id="sssNumber"
          name="sssNumber"
        />
        <el-input
          v-model="newEmployee.pagIbigNumber"
          placeholder="Enter Pag-IBIG Number"
          id="pagIbigNumber"
          name="pagIbigNumber"
        />
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
    <el-dialog v-model="updateDialogVisible" title="Update Employee">
      <el-form model="selectedEmployee">
        <el-form-item label="Name"
          ><el-input v-model="selectedEmployee.name" id="update-name" name="update-name"
        /></el-form-item>
        <el-form-item label="Email"
          ><el-input v-model="selectedEmployee.email" id="update-email" name="update-email"
        /></el-form-item>
        <el-form-item label="Position"
          ><el-input
            v-model="selectedEmployee.position"
            id="update-position"
            name="update-position"
        /></el-form-item>
        <el-form-item label="Salary"
          ><el-input-number
            v-model.number="selectedEmployee.salary"
            id="update-salary"
            name="update-salary"
        /></el-form-item>
        <el-form-item label="SSS Number"
          ><el-input
            v-model="selectedEmployee.sssNumber"
            id="update-sssNumber"
            name="update-sssNumber"
        /></el-form-item>
        <el-form-item label="Pag-IBIG Number"
          ><el-input
            v-model="selectedEmployee.pagIbigNumber"
            id="update-pagIbigNumber"
            name="update-pagIbigNumber"
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
import api from '@/services/api'

export default {
  name: 'EmployeeManagement',
  data() {
    return {
      newEmployee: {
        name: '',
        email: '',
        position: '',
        salary: 0, // Initialize with 0 instead of an empty string
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
      try {
        const response = await api.getEmployees({ search: this.searchQuery })
        console.log(response)
        this.employees = response.data.results
      } catch (error) {
        console.error('Error fetching employees:', error)
        ElMessage.error('Failed to fetch employees')
      }
    },
    async addEmployee() {
      if (
        !this.newEmployee.name ||
        !this.newEmployee.email ||
        !this.newEmployee.position ||
        this.newEmployee.salary === '' ||
        !this.newEmployee.sssNumber ||
        !this.newEmployee.pagIbigNumber
      ) {
        ElMessage.warning('Please fill all fields')
        return
      }

      try {
        await api.createEmployee(this.newEmployee)
        ElMessage.success('Employee added successfully')
        this.newEmployee = {
          name: '',
          email: '',
          position: '',
          salary: 0, // Reset to 0 after adding
          sssNumber: '',
          pagIbigNumber: '',
        }
        this.fetchEmployees()
      } catch (error) {
        console.error('Error adding employee:', error)
        ElMessage.error('Failed to add employee')
      }
    },
    async updateEmployee() {
      try {
        await api.updateEmployee(this.selectedEmployee.id, this.selectedEmployee)
        ElMessage.success('Employee updated successfully')
        this.updateDialogVisible = false
        this.fetchEmployees()
      } catch (error) {
        console.error('Error updating employee:', error)
        ElMessage.error('Failed to update employee')
      }
    },
    async deleteEmployee(id) {
      try {
        await api.deleteEmployee(id)
        ElMessage.success('Employee deleted')
        this.fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
        ElMessage.error('Failed to delete employee')
      }
    },
    openUpdateDialog(employee) {
      this.selectedEmployee = { ...employee }
      this.updateDialogVisible = true
    },
    debouncedSearchEmployees: debounce(function () {
      this.fetchEmployees()
    }, 500),
  },
  mounted() {
    this.fetchEmployees()
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
