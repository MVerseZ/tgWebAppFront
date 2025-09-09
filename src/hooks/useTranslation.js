import { useLocale } from './useLocale'
import { translations } from '../locales/translations'

export const useTranslation = () => {
  const { locale } = useLocale()
  
  const t = (key, params = {}) => {
    let translation = translations[locale]?.[key] || translations.en[key] || key
    
    // Заменяем параметры в строке
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param])
      })
    }
    
    return translation
  }
  
  return { t, locale }
}
