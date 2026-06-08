import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => {
      if (!state.user) return null;
      return {
        ...state.user,
        firstName: state.user.first_name || '',
        lastName: state.user.last_name || '',
        name: `${state.user.first_name || ''} ${state.user.last_name || ''}`.trim(),
        avatar: state.user.avatar || `https://ui-avatars.com/api/?name=${state.user.first_name || 'User'}&background=random`,
        role: state.user.role || 'Member',
        designation: state.user.designation || '',
        location: state.user.nationality || 'Not specified',
        phone: state.user.phone || '',
        skills: state.user.skills || 'None',
        nationality: state.user.nationality || ''
      };
    }
  },

  actions: {
    async login({ email, password }) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        console.error('Login failed:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async register({ first_name, last_name, email, password }) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/register', {
          first_name,
          last_name,
          email,
          password
        })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        console.error('Registration failed:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async updateProfile(profileData) {
      this.loading = true
      try {
        const response = await api.put('/auth/profile', profileData)
        this.user = { ...this.user, ...response.data }
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        // For demo: update locally
        this.user = { ...this.user, ...profileData }
        localStorage.setItem('user', JSON.stringify(this.user))
      } finally {
        this.loading = false
      }
    }
  }
})
