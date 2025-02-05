<template>
  <el-container class="common-layout">
    <el-container>
      <el-aside class="aside">
        <el-form :model="newEmployee" label-width="100px" class="form-section">
          <h2>Add Employee</h2>
          <el-form-item label="Name">
            <el-input v-model="newEmployee.name" placeholder="Enter employee name"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="newEmployee.email" placeholder="Enter employee email"></el-input>
          </el-form-item>
          <el-form-item label="Position">
            <el-input
              v-model="newEmployee.position"
              placeholder="Enter employee position"
            ></el-input>
          </el-form-item>
          <el-form-item label="Salary">
            <el-input
              v-model="newEmployee.salary"
              type="number"
              placeholder="Enter employee salary"
            ></el-input>
          </el-form-item>
          <el-form-item label="SSS Number">
            <el-input v-model="newEmployee.sssNumber" placeholder="Enter SSS number"></el-input>
          </el-form-item>
          <el-form-item label="Pag-IBIG Number">
            <el-input
              v-model="newEmployee.pagIbigNumber"
              placeholder="Enter Pag-IBIG number"
            ></el-input>
          </el-form-item>
          <el-form-item label="Company">
            <el-input v-model="newEmployee.company" placeholder="Enter company"></el-input>
          </el-form-item>
          <div class="button-container">
            <el-button type="success" @click="addEmployee">Add Employee</el-button>
          </div>
        </el-form>
      </el-aside>

      <el-main>
        <el-input
          v-model="searchQuery"
          placeholder="Search Employees"
          @input="debouncedSearchEmployees"
          class="search-input"
          prefix-icon="el-icon-search"
        />

        <el-table :data="employees" class="employee-table">
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column prop="position" label="Position"></el-table-column>
          <el-table-column prop="salary" label="Salary"></el-table-column>
          <el-table-column prop="sssNumber" label="SSS Number"></el-table-column>
          <el-table-column prop="pagIbigNumber" label="Pag-IBIG Number"></el-table-column>
          <el-table-column prop="company" label="Company"></el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button type="primary" @click="openUpdateDialog(scope.row)">Edit</el-button>
              <el-button type="danger" @click="removeEmployee(scope.row.id)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="employeePage"
            :page-size="employeePageSize"
            layout="prev, pager, next"
            :total="totalEmployees"
            @current-change="handleEmployeePageChange"
          />
        </div>

        <el-dialog v-model="updateDialogVisible" title="Update Employee">
          <el-form :model="selectedEmployee" label-width="100px">
            <el-form-item label="Name">
              <el-input v-model="selectedEmployee.name"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="selectedEmployee.email"></el-input>
            </el-form-item>
            <el-form-item label="Position">
              <el-input v-model="selectedEmployee.position"></el-input>
            </el-form-item>
            <el-form-item label="Salary">
              <el-input v-model="selectedEmployee.salary" type="number"></el-input>
            </el-form-item>
            <el-form-item label="SSS Number">
              <el-input v-model="selectedEmployee.sssNumber"></el-input>
            </el-form-item>
            <el-form-item label="Pag-IBIG Number">
              <el-input v-model="selectedEmployee.pagIbigNumber"></el-input>
            </el-form-item>
            <el-form-item label="Company">
              <el-input v-model="selectedEmployee.company"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="updateDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="updateEmployee">Save</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const newEmployee = ref({
  name: '',
  email: '',
  position: '',
  salary: 0,
  sssNumber: '',
  pagIbigNumber: '',
  company: '',
})

const employees = ref([])
const searchQuery = ref('')
const employeePage = ref(1)
const employeePageSize = ref(10)
const totalEmployees = ref(0)
const updateDialogVisible = ref(false)
const selectedEmployee = ref({
  name: '',
  email: '',
  position: '',
  salary: 0,
  sssNumber: '',
  pagIbigNumber: '',
  company: '',
})

const fetchEmployees = async () => {
  try {
    const response = await api.getEmployees({
      page: employeePage.value,
      pageSize: employeePageSize.value,
      searchQuery: searchQuery.value,
    })
    console.log('Fetch Employees Response Data:', response.data)
    if (response.data && Array.isArray(response.data.data)) {
      employees.value = response.data.data
      totalEmployees.value = response.data.total
    } else {
      console.error('Unexpected response structure:', response.data)
    }
  } catch (error) {
    console.error('Failed to fetch employees:', error)
  }
}

const addEmployee = async () => {
  try {
    await api.createEmployee(newEmployee.value)
    fetchEmployees()
    newEmployee.value = {
      name: '',
      email: '',
      position: '',
      salary: 0,
      sssNumber: '',
      pagIbigNumber: '',
      company: '',
    }
  } catch (error) {
    console.error('Failed to add employee:', error)
  }
}

const removeEmployee = async (employeeId) => {
  try {
    await api.deleteEmployee(employeeId)
    fetchEmployees()
  } catch (error) {
    console.error('Failed to delete employee:', error)
  }
}

const openUpdateDialog = (employee) => {
  selectedEmployee.value = { ...employee }
  updateDialogVisible.value = true
}

const updateEmployee = async () => {
  try {
    await api.updateEmployee(selectedEmployee.value.id, selectedEmployee.value)
    fetchEmployees()
    updateDialogVisible.value = false
  } catch (error) {
    console.error('Failed to update employee:', error)
  }
}

const debouncedSearchEmployees = () => {
  fetchEmployees()
}

const handleEmployeePageChange = (page) => {
  employeePage.value = page
  fetchEmployees()
}

onMounted(() => {
  fetchEmployees()
})
</script>

<style scoped>
* {
  font-family: 'Trebuchet MS', sans-serif;
}

.aside {
  border-right: 2px solid #a8dadc;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f1faee;
  position: relative;
}

.button-container {
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 10px;
  text-align: center;
}

.search-input {
  width: 100%;
  margin-bottom: 20px;
}

.pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 10px;
  left: 0;
}
</style>
