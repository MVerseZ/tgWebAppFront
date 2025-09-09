import { useLocale } from '../hooks/useLocale'
import { useTranslation } from '../hooks/useTranslation'
import { useTelegram } from '../hooks/useTelegram'
import '../styles/LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale()
  const { t } = useTranslation()
  const { hapticFeedback, theme } = useTelegram()

  const handleLanguageChange = (newLocale) => {
    hapticFeedback('impact', 'light')
    
    // Add a small delay for better UX
    setTimeout(() => {
      changeLocale(newLocale)
    }, 100)
  }

  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#e1e5e9',
      textColor: '#374151',
      activeBackground: '#3b82f6',
      activeTextColor: '#ffffff',
      hoverBackground: '#f1f5f9',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    dark: {
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textColor: '#d1d5db',
      activeBackground: '#3b82f6',
      activeTextColor: '#ffffff',
      hoverBackground: '#374151',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
    }
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  return (
    <div 
      className={`language-switcher ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2px',
        backgroundColor: currentTheme.backgroundColor,
        borderRadius: '8px',
        border: `1px solid ${currentTheme.borderColor}`,
        boxShadow: currentTheme.shadow,
        position: 'absolute',
        top: '8px',
        right: '8px',
        overflow: 'hidden',
        width: 'fit-content',
        zIndex: 1000
      }}
    >
      {/* Background indicator */}
      <div 
        className={`language-indicator ${locale === 'en' ? 'slide-left' : 'slide-right'}`}
        style={{
          position: 'absolute',
          top: '2px',
          left: locale === 'en' ? '2px' : 'calc(50% + 1px)',
          width: 'calc(50% - 2px)',
          height: 'calc(100% - 4px)',
          backgroundColor: currentTheme.activeBackground,
          borderRadius: '6px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1
        }} 
      />
      
      <button
        className="language-button"
        data-active={locale === 'en'}
        onClick={() => handleLanguageChange('en')}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          color: locale === 'en' ? currentTheme.activeTextColor : currentTheme.textColor,
          border: 'none',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <span className="flag-emoji" style={{ fontSize: '12px' }}>🇺🇸</span>
        {t('english')}
      </button>
      
      <button
        className="language-button"
        data-active={locale === 'ru'}
        onClick={() => handleLanguageChange('ru')}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          color: locale === 'ru' ? currentTheme.activeTextColor : currentTheme.textColor,
          border: 'none',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        <span className="flag-emoji" style={{ fontSize: '12px' }}>🇷🇺</span>
        {t('russian')}
      </button>
    </div>
  )
}
