<!-- components/WeatherDashboard.vue -->
<template>
    <div 
      :class="[
        'min-h-screen transition-colors duration-700',
        weatherBackgroundClass
      ]"
    >

      <div class="min-h-screen backdrop-blur-sm py-8 px-4">
        <div class="max-w-5xl mx-auto">

          <div class="relative mb-8">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-gray-300 text-white"
              placeholder="Search for a city..."
              :disabled="isLoading"
            >
          </div>
  
          <!-- Main Weather Card -->
          <div v-if="currentWeather" class="mb-8">
            <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-white shadow-lg">
              <!-- Location Header -->
              <div class="flex justify-between items-start mb-8">
                <div>
                  <h1 class="text-4xl font-light mb-2">
                    {{ currentWeather.location.name }}
                    <button
                      @click="toggleFavorite(currentWeather.location.name)"
                      class="ml-2 transition-transform hover:scale-110"
                    >
                      <span class="text-3xl">{{ isFavorite(currentWeather.location.name) ? '★' : '☆' }}</span>
                    </button>
                  </h1>
                  <p class="text-lg opacity-80">
                    {{ currentWeather.location.region }}, {{ currentWeather.location.country }}
                  </p>
                </div>
                
                <!-- Temperature Units Toggle -->
                <div class="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
                  <button
                    v-for="unit in ['metric', 'imperial']"
                    :key="unit"
                    @click="changeUnits(unit)"
                    :class="[
                      'px-4 py-2 rounded-md transition-colors',
                      units === unit ? 'bg-white/20' : 'hover:bg-white/10'
                    ]"
                  >
                    {{ unit === 'metric' ? '°C' : '°F' }}
                  </button>
                </div>
              </div>
  
              <!-- Current Weather -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex items-center">
                  <div class="mr-6">
                    <img
                      :src="currentWeather.current.condition.icon"
                      :alt="currentWeather.current.condition.text"
                      class="w-24 h-24"
                    >
                  </div>
                  <div>
                    <div class="text-6xl font-extralight mb-2">
                      {{ temperature }}°
                    </div>
                    <p class="text-xl opacity-80">
                      {{ currentWeather.current.condition.text }}
                    </p>
                  </div>
                </div>
  
                <!-- Weather Details -->
                <div class="grid grid-cols-2 gap-6">
                  <WeatherDetailCard
                    v-for="(detail, index) in weatherDetails"
                    :key="index"
                    :icon="detail.icon"
                    :label="detail.label"
                    :value="detail.value"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <!-- Search History -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="location in searchHistory"
              :key="location"
              @click="searchQuery = location; handleSearch()"
              class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white"
            >
              {{ location }}
            </button>
          </div>
  
          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white p-4 rounded-xl"
          >
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import WeatherDetailCard from './WeatherDetailCard.vue'
  
  export default {
    name: 'WeatherDashboard',
    components: { WeatherDetailCard },
    
    data() {
      return {
        searchQuery: ''
      }
    },
    
    computed: {
      ...mapState([
        'currentWeather',
        'isLoading',
        'error',
        'searchHistory',
        'units'
      ]),
      ...mapGetters([
        'temperature',
        'feelsLike',
        'windSpeed',
        'isFavorite'
      ]),
  
      weatherDetails() {
        if (!this.currentWeather) return []
        return [
          {
            icon: '💨',
            label: 'Wind',
            value: this.windSpeed
          },
          {
            icon: '💧',
            label: 'Humidity',
            value: `${this.currentWeather.current.humidity}%`
          },
          {
            icon: '☀️',
            label: 'UV Index',
            value: this.currentWeather.current.uv
          },
          {
            icon: '👁️',
            label: 'Visibility',
            value: `${this.currentWeather.current.vis_km} km`
          }
        ]
      },
  
      weatherBackgroundClass() {
        if (!this.currentWeather) return 'bg-gradient-to-br from-blue-400 to-blue-600'
        
        const condition = this.currentWeather.current.condition.code
        const isDay = this.currentWeather.current.is_day
  
        // Map weather conditions to background classes
        if (condition === 1000) { // Clear
          return isDay 
            ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
            : 'bg-gradient-to-br from-blue-900 to-purple-900'
        }
        if (condition >= 1003 && condition <= 1030) { // Cloudy
          return 'bg-gradient-to-br from-gray-400 to-gray-600'
        }
        if (condition >= 1063 && condition <= 1201) { // Rain
          return 'bg-gradient-to-br from-blue-700 to-blue-900'
        }
        if (condition >= 1204 && condition <= 1237) { // Snow
          return 'bg-gradient-to-br from-blue-100 to-blue-300'
        }
        return 'bg-gradient-to-br from-blue-400 to-blue-600'
      }
    },
    
    methods: {
      ...mapActions([
        'fetchWeather',
        'toggleFavorite',
        'changeUnits'
      ]),
      
      async handleSearch() {
        if (!this.searchQuery.trim()) return
        await this.fetchWeather(this.searchQuery)
      }
    },
    
    mounted() {
      this.searchQuery = 'London'
      this.handleSearch()
    }
  }
  </script>