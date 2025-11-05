import { useMemo } from 'react'
import useLanguageStore from '../store/languageStore'
import { translations } from '../i18n/translations'

/**
 * Custom hook for translations
 * @param {string} key - Translation key (e.g., 'nav.home', 'auth.login.title')
 * @param {object} params - Parameters to replace in the translation (e.g., {amount: 1000})
 * @returns {string} Translated text
 */
export const useTranslation = () => {
  const { language } = useLanguageStore()

  const t = useMemo(() => {
    return (key, params = {}) => {
      const keys = key.split('.')
      let translation = translations[language]

      // Navigate through nested keys
      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k]
        } else {
          console.warn(`Translation missing for key: ${key} in language: ${language}`)
          // Fallback to Spanish if translation not found
          let fallback = translations.es
          for (const fk of keys) {
            if (fallback && fallback[fk]) {
              fallback = fallback[fk]
            } else {
              return key // Return key if fallback also fails
            }
          }
          translation = fallback
          break
        }
      }

      // Replace parameters in translation string
      if (typeof translation === 'string' && Object.keys(params).length > 0) {
        return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? params[paramKey] : match
        })
      }

      return translation || key
    }
  }, [language])

  return { t, language }
}

export default useTranslation

