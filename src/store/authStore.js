import { create } from 'zustand'
import secureStorage from '../utils/storage'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,

  // Initialize auth from storage
  init: async () => {
    try {
      const savedUser = await secureStorage.getItem('user')
      const rememberMe = await secureStorage.getItem('rememberMe')
      
      if (savedUser && rememberMe) {
        set({ user: savedUser, isAuthenticated: true, rememberMe: true })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Generate unique referral code (6 alphanumeric characters)
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        referralCode,
        createdAt: new Date().toISOString(),
        balance: 0,
        invested: 0,
        earnings: 0,
        referrals: 0
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get existing users
      const allUsers = await getUsers()
      
      // If user was referred, update referrer's stats
      if (userData.referredBy) {
        const updatedUsers = allUsers.map(u => {
          if (u.referralCode === userData.referredBy) {
            return {
              ...u,
              referrals: (u.referrals || 0) + 1
            }
          }
          return u
        })
        await secureStorage.setItem('users', updatedUsers)
        allUsers.length = 0
        allUsers.push(...updatedUsers)
      }
      
      // Save new user
      await secureStorage.setItem('users', [...allUsers, newUser])
      
      set({ 
        user: newUser, 
        isAuthenticated: true,
        rememberMe: false 
      })

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  },

  // Login user
  login: async (email, password, rememberMe = false) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const users = await getUsers()
      const user = users.find(u => u.email === email)

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' }
      }

      if (user.password !== password) {
        return { success: false, error: 'Contraseña incorrecta' }
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user

      // Save to storage if remember me
      if (rememberMe) {
        await secureStorage.setItem('user', userWithoutPassword)
        await secureStorage.setItem('rememberMe', true)
      } else {
        await secureStorage.removeItem('user')
        await secureStorage.removeItem('rememberMe')
      }

      set({ 
        user: userWithoutPassword, 
        isAuthenticated: true,
        rememberMe 
      })

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  },

  // Logout
  logout: async () => {
    try {
      await secureStorage.removeItem('user')
      await secureStorage.removeItem('rememberMe')
      set({ user: null, isAuthenticated: false, rememberMe: false })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  // Password recovery
  forgotPassword: async (email) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const users = await getUsers()
      const user = users.find(u => u.email === email)
      
      if (user) {
        // In production, send email here
        return { success: true, message: 'Se ha enviado un enlace de recuperación a tu email' }
      } else {
        return { success: false, error: 'No se encontró una cuenta con ese email' }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, error: error.message }
    }
  },

  // Check if referral code exists
  checkReferralCode: async (code) => {
    try {
      const users = await getUsers()
      const user = users.find(u => u.referralCode === code.toUpperCase())
      return user ? { exists: true, user: user.name } : { exists: false }
    } catch (error) {
      return { exists: false }
    }
  }
}))

// Helper function to get all users
async function getUsers() {
  try {
    const users = await secureStorage.getItem('users')
    return users || []
  } catch (error) {
    return []
  }
}

export default useAuthStore

