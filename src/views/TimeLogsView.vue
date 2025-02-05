<template>
  <TimeLogManagement />
</template>

<script setup>
import TimeLogManagement from '../components/TimeLogManagement.vue'
import api from '@/services/api' // Updated import path
import { onMounted } from 'vue'

const fetchTimeLogs = async () => {
  try {
    const timeLogs = await api.getTimeLogs()
    console.log(timeLogs)
    // You can add further processing or store the timeLogs in a reactive state
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchTimeLogs()
})
</script>
