import { create } from 'zustand'
import secureStorage from '../utils/storage'

const useLanguageStore = create((set, get) => ({
  language: 'es', // 'es' | 'en' | 'fr'
  isLoading: true,

  // Initialize language from storage or browser
  init: async () => {
    try {
      // Try to load from storage
      const savedLanguage = await secureStorage.getItem('language')
      if (savedLanguage && ['es', 'en', 'fr'].includes(savedLanguage)) {
        set({ language: savedLanguage, isLoading: false })
        return
      }

      // Fallback to browser language
      const browserLang = navigator.language || navigator.userLanguage
      let detectedLang = 'es' // Default to Spanish
      
      if (browserLang.startsWith('en')) {
        detectedLang = 'en'
      } else if (browserLang.startsWith('fr')) {
        detectedLang = 'fr'
      }

      set({ language: detectedLang, isLoading: false })
      await secureStorage.setItem('language', detectedLang)
    } catch (error) {
      console.error('Error initializing language:', error)
      set({ language: 'es', isLoading: false })
    }
  },

  // Set language
  setLanguage: async (lang) => {
    if (!['es', 'en', 'fr'].includes(lang)) return
    
    set({ language: lang })
    try {
      await secureStorage.setItem('language', lang)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }
}))

export default useLanguageStore

