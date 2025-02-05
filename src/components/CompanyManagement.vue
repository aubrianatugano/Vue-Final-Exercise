<template>
  <el-container class="common-layout">
    <el-container>
      <!-- Sidebar for Adding Companies & Employees -->
      <el-aside class="aside">
        <el-form :model="newCompany" label-width="100px" class="form-section">
          <h2>Add Company</h2>
          <el-form-item label="Company Name">
            <el-input v-model="newCompany.name" placeholder="Enter company name"></el-input>
          </el-form-item>
          <el-form-item label="Company Code">
            <el-input v-model="newCompany.code" placeholder="Enter company code"></el-input>
          </el-form-item>

          <h2>Add Employees</h2>
          <div class="employee-fields">
            <div
              v-for="(employee, index) in newCompany.employees"
              :key="index"
              class="employee-container"
            >
              <el-form-item label="Name">
                <el-input v-model="employee.name" placeholder="Employee Name"></el-input>
              </el-form-item>
              <el-form-item label="Email">
                <el-input v-model="employee.email" placeholder="Employee Email"></el-input>
              </el-form-item>
              <el-form-item label="Position">
                <el-input v-model="employee.position" placeholder="Employee Position"></el-input>
              </el-form-item>
              <el-form-item label="Salary">
                <el-input
                  v-model="employee.salary"
                  type="number"
                  placeholder="Employee Salary"
                ></el-input>
              </el-form-item>
              <el-button type="danger" @click="removeEmployee(index)"> Remove </el-button>
            </div>
          </div>

          <el-button class="add-employee-button" type="primary" @click="addEmployee"
            >Add Employee</el-button
          >
        </el-form>

        <div class="button-container">
          <el-button type="success" class="add-company-button" @click="addCompany"
            >Add Company</el-button
          >
        </div>
      </el-aside>

      <!-- Main Content for Company Table -->
      <el-main>
        <el-input
          v-model="searchQuery"
          placeholder="Search Companies"
          @input="debouncedSearchCompanies"
          class="search-input"
          prefix-icon="el-icon-search"
        />

        <el-table :data="companies" class="company-table">
          <el-table-column prop="name" label="Company Name"></el-table-column>
          <el-table-column prop="code" label="Company Code"></el-table-column>
          <el-table-column label="Total Employees">
            <template #default="scope">
              {{ scope.row.employees ? scope.row.employees.length : 0 }}
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button type="primary" @click="openUpdateDialog(scope.row)">Edit</el-button>
              <el-button type="danger" @click="removeCompany(scope.row.id)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Pagination Controls (Fixed at Bottom) -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="companyPage"
            :page-size="companyPageSize"
            layout="prev, pager, next"
            :total="totalCompanies"
            @current-change="handleCompanyPageChange"
          />
        </div>

        <!-- Update Company Dialog -->
        <el-dialog v-model="updateDialogVisible" title="Update Company">
          <el-form :model="selectedCompany" label-width="100px">
            <el-form-item label="Company Name">
              <el-input v-model="selectedCompany.name"></el-input>
            </el-form-item>
            <el-form-item label="Company Code">
              <el-input v-model="selectedCompany.code"></el-input>
            </el-form-item>

            <h3>Employees</h3>
            <div
              v-for="(employee, index) in selectedCompany.employees"
              :key="index"
              class="employee-container"
            >
              <el-form-item label="Name">
                <el-input v-model="employee.name"></el-input>
              </el-form-item>
              <el-form-item label="Email">
                <el-input v-model="employee.email"></el-input>
              </el-form-item>
              <el-form-item label="Position">
                <el-input v-model="employee.position"></el-input>
              </el-form-item>
              <el-form-item label="Salary">
                <el-input v-model="employee.salary"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <template #footer>
            <el-button @click="updateDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="updateCompany">Save</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      newCompany: {
        name: '',
        code: '',
        employees: [],
      },
      companies: [],
      searchQuery: '',
      companyPage: 1,
      companyPageSize: 10,
      totalCompanies: 0,
      updateDialogVisible: false,
      selectedCompany: {
        name: '',
        code: '',
        employees: [],
      },
    }
  },
  methods: {
    addEmployee() {
      this.newCompany.employees.push({ name: '', email: '', position: '', salary: 0 })
    },
    removeEmployee(index) {
      this.newCompany.employees.splice(index, 1)
    },
    addCompany() {
      // Add company to the list
      this.companies.push({ ...this.newCompany })
      this.newCompany = { name: '', code: '', employees: [] }
    },
    removeCompany(companyId) {
      // Remove company from the list
      this.companies = this.companies.filter((company) => company.id !== companyId)
    },
    openUpdateDialog(company) {
      this.selectedCompany = { ...company }
      this.updateDialogVisible = true
    },
    updateCompany() {
      // Update company details
      const index = this.companies.findIndex((company) => company.id === this.selectedCompany.id)
      if (index !== -1) {
        this.companies.splice(index, 1, { ...this.selectedCompany })
      }
      this.updateDialogVisible = false
    },
    debouncedSearchCompanies() {
      // Search companies logic
    },
    handleCompanyPageChange(page) {
      this.companyPage = page
      // Fetch companies for the new page
    },
  },
}
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

.employee-fields {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 400px;
}

.add-employee-button {
  width: 100%;
  margin-top: auto;
}

.button-container {
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 10px;
  text-align: center;
}

.add-company-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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
