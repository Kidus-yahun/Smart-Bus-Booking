import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { amharicTranslations } from '../i18n/translations'

export type Language = 'en' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, ...args: (string | number)[]) => string
  formatDate: (dateString: string) => string
  formatTime: (dateString: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved === 'en' || saved === 'am') {
      setLanguageState(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.title =
      language === 'am'
        ? 'SmartBus - የአውቶቡስ ቦታ ማስያዣ መተግበሪያ'
        : 'SmartBus - Your Smart Bus Booking App'
  }, [language])

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), [])

  const t = useCallback(
    (key: string, ...args: (string | number)[]): string => {
      let str = language === 'am' ? (amharicTranslations[key] ?? key) : key
      args.forEach((arg, i) => {
        str = str.split(`{${i}}`).join(String(arg))
      })
      return str
    },
    [language],
  )

  const locale = language === 'am' ? 'am-ET' : 'en-US'

  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    [locale],
  )

  const formatTime = useCallback(
    (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    [locale],
  )

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatDate,
        formatTime,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
