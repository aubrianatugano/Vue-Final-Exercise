import { createRouter, createWebHistory } from 'vue-router'
import CompaniesView from '@/views/CompaniesView.vue' // Correct import for Companies View
import EmployeesView from '@/views/EmployeesView.vue' // Correct import for Employees View
import TimeLogsView from '@/views/TimeLogsView.vue' // Import the TimeLogs View

const routes = [
  { path: '/', redirect: '/companies' }, // Redirect root to Companies
  { path: '/companies', component: CompaniesView },
  { path: '/employees', component: EmployeesView },
  { path: '/timelogs', component: TimeLogsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
