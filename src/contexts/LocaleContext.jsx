import { useState, useEffect } from 'react'
import { LocaleContext } from './LocaleContext'

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    // Попробуем получить язык из localStorage или использовать язык браузера
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
      return savedLocale
    }
    
    // Определяем язык браузера
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('ru')) {
      return 'ru'
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('locale', locale)
  }, [locale])

  const changeLocale = (newLocale) => {
    setLocale(newLocale)
  }

  const value = {
    locale,
    changeLocale,
    isRussian: locale === 'ru',
    isEnglish: locale === 'en'
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export { LocaleProvider }
