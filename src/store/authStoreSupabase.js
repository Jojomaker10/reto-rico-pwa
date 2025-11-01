import { create } from 'zustand'
import supabase from '../config/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,

  // Initialize auth from Supabase
  init: async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Get user profile from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!error && profile) {
          set({ 
            user: { ...profile, email: session.user.email }, 
            isAuthenticated: true,
            isLoading: false 
          })
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  // Register new user with Supabase Auth + Profile
  register: async (userData) => {
    try {
      // Create auth user in Supabase (trigger will create profile automatically)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            referredBy: userData.referredBy || null
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      // Wait a bit for the trigger to create the profile
      // Retry up to 5 times with increasing delay
      let profile = null
      let profileError = null
      
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()
        
        if (data && !error) {
          profile = data
          profileError = null
          break
        }
        profileError = error
      }

      // If profile still not found, trigger might have failed
      // Try to create it manually as fallback
      if (profileError || !profile) {
        console.error('Profile not found after retries, trying manual creation...')
        console.log('User ID:', authData.user.id)
        console.log('User email:', authData.user.email)
        
        // Generate referral code
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        
        // Try to create profile manually
        const { data: manualProfile, error: manualError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              referral_code: referralCode,
              referred_by: userData.referredBy || null
            }
          ])
          .select()
          .single()
        
        if (manualError || !manualProfile) {
          console.error('Manual profile creation also failed:', manualError)
          return { 
            success: false, 
            error: `Error creating profile: ${manualError?.message || 'Profile creation failed'}` 
          }
        }
        
        profile = manualProfile
      }

      // If user was referred, update referrer's count
      if (userData.referredBy) {
        await supabase.rpc('increment_referrals', { 
          referral_code: userData.referredBy 
        })
      }

      set({ 
        user: { ...profile, email: authData.user.email }, 
        isAuthenticated: true,
        rememberMe: false 
      })

      return { success: true, user: profile }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  },

  // Login user with Supabase
  login: async (email, password, rememberMe = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        return { success: false, error: 'Error loading user profile' }
      }

      set({ 
        user: { ...profile, email: data.user.email }, 
        isAuthenticated: true,
        rememberMe 
      })

      return { success: true, user: profile }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  },

  // Logout from Supabase
  logout: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, isAuthenticated: false, rememberMe: false })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  // Password recovery with Supabase
  forgotPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        message: 'Se ha enviado un enlace de recuperación a tu email' 
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { success: false, error: error.message }
    }
  },

  // Check if referral code exists
  checkReferralCode: async (code) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('referral_code', code.toUpperCase())
        .single()

      if (error || !data) {
        return { exists: false }
      }

      return { exists: true, user: data.name }
    } catch (error) {
      return { exists: false }
    }
  },

  // Save investment to Supabase
  saveInvestment: async (investmentData) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([investmentData])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user invested amount
      await supabase
        .from('profiles')
        .update({ invested: get().user.invested + investmentData.amount })
        .eq('id', get().user.id)

      return { success: true, investment: data }
    } catch (error) {
      console.error('Save investment error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user investments
  getInvestments: async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', get().user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get investments error:', error)
      return []
    }
  },

  // Get referrals
  getReferrals: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          investments (*)
        `)
        .eq('referred_by', get().user.referral_code)

      if (error) {
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get referrals error:', error)
      return []
    }
  }
}))

export default useAuthStore

