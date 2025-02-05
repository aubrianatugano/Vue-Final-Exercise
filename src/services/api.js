import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://localhost:44312/',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response)
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

export default {
  // Fetch Companies with Pagination & Search
  getCompanies(params) {
    return apiClient.get('/Companies', { params })
  },

  // Create Company (With Employees)
  createCompany(company) {
    return apiClient.post('/Companies', company)
  },

  // Get Single Company by ID
  getCompanyById(companyId) {
    return apiClient.get(`/Companies/${companyId}`)
  },

  // Update Company
  updateCompany(companyId, company) {
    return apiClient.put(`/Companies/${companyId}`, company)
  },

  // Delete Company
  deleteCompany(companyId) {
    return apiClient.delete(`/Companies/${companyId}`)
  },

  // ----------------------------

  // Get Employees for a Specific Company
  getCompanyEmployees(companyId, params) {
    return apiClient.get(`/Companies/${companyId}/Employees`, { params })
  },

  // Fetch Employees with Pagination & Search
  getEmployees(params) {
    return apiClient.get('/Employees', { params }).then((response) => {
      console.log('getEmployees Response:', response)
      // Ensure the response has the expected structure
      if (response.data && Array.isArray(response.data.data)) {
        return {
          data: response.data.data,
          total: response.data.total,
        }
      } else {
        console.error('Unexpected response structure:', response.data)
        return {
          data: [],
          total: 0,
        }
      }
    })
  },

  // Create Employee
  createEmployee(employee) {
    return apiClient.post('/Employees', employee)
  },

  // Get Single Employee by ID
  getEmployeeById(employeeId) {
    return apiClient.get(`/Employees/${employeeId}`)
  },

  // Update Employee
  updateEmployee(employeeId, employee) {
    return apiClient.put(`/Employees/${employeeId}`, employee)
  },

  // Delete Employee
  deleteEmployee(employeeId) {
    return apiClient.delete(`/Employees/${employeeId}`)
  },

  // ----------------------------

  // Fetch TimeLogs
  getTimeLogs() {
    return apiClient.get('/TimeLogs')
  },

  // Create TimeLog
  createTimeLog(timeLog) {
    return apiClient.post('/TimeLogs', timeLog)
  },

  // Update TimeLog
  updateTimeLog(timeLogId, timeLog) {
    return apiClient.put(`/TimeLogs/${timeLogId}`, timeLog)
  },
}
