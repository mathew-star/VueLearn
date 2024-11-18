<!-- components/WeatherDetailCard.vue -->
<template>
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <div class="text-2xl mb-2">{{ icon }}</div>
      <div class="text-sm opacity-80">{{ label }}</div>
      <div class="text-lg font-medium">{{ value }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WeatherDetailCard',
    props: {
      icon: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      value: {
        type: [String, Number],
        required: true
      }
    }
  }
  </script>