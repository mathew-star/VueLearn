// store/index.js
import { createStore } from 'vuex'
import axios from 'axios'

const API_KEY = 'fefaa62c3b574788bc064826241711'
const BASE_URL = 'http://api.weatherapi.com/v1'

export default createStore({
  state: {
    currentWeather: null,
    searchHistory: [],
    favorites: [],
    isLoading: false,
    error: null,
    units: 'metric', // 'metric' or 'imperial'
    lastSearched: null
  },
  
  getters: {
    temperature: (state) => {
      if (!state.currentWeather) return null
      return state.units === 'metric' 
        ? state.currentWeather.current.temp_c 
        : state.currentWeather.current.temp_f
    },
    
    feelsLike: (state) => {
      if (!state.currentWeather) return null
      return state.units === 'metric'
        ? state.currentWeather.current.feelslike_c
        : state.currentWeather.current.feelslike_f
    },
    
    windSpeed: (state) => {
      if (!state.currentWeather) return null
      return state.units === 'metric'
        ? `${state.currentWeather.current.wind_kph} km/h`
        : `${state.currentWeather.current.wind_mph} mph`
    },
    
    isFavorite: (state) => (locationName) => {
      return state.favorites.includes(locationName)
    }
  },
  
  mutations: {
    SET_WEATHER(state, data) {
      state.currentWeather = data
      state.lastSearched = new Date().toISOString()
    },
    
    SET_LOADING(state, status) {
      state.isLoading = status
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    ADD_TO_HISTORY(state, location) {
      if (!state.searchHistory.includes(location)) {
        state.searchHistory = [location, ...state.searchHistory].slice(0, 5)
      }
    },
    
    TOGGLE_FAVORITE(state, location) {
      const index = state.favorites.indexOf(location)
      if (index === -1) {
        state.favorites.push(location)
      } else {
        state.favorites.splice(index, 1)
      }
    },
    
    SET_UNITS(state, units) {
      state.units = units
    }
  },

  actions: {
    async fetchWeather({ commit }, query) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
          params: {
            key: API_KEY,
            q: query
          }
        })
        
        commit('SET_WEATHER', response.data)
        commit('ADD_TO_HISTORY', response.data.location.name)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error?.message || 'Failed to fetch weather data')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    toggleFavorite({ commit }, location) {
      commit('TOGGLE_FAVORITE', location)
    },
    
    changeUnits({ commit }, units) {
      commit('SET_UNITS', units)
    }
  }
})