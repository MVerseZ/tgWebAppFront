import { useState, useEffect } from 'react'
import { useLocale } from '../hooks/useLocale'
import { useTranslation } from '../hooks/useTranslation'
import { useTelegram } from '../hooks/useTelegram'
import { getEnvInfo, API_URLS } from '../config/environment'
import '../styles/StatusBar.css'

export default function StatusBar() {
  const { locale, changeLocale } = useLocale()
  const { t } = useTranslation()
  const { hapticFeedback, theme } = useTelegram()
  const [serverStatus, setServerStatus] = useState('unknown') // 'healthy', 'unhealthy', 'unknown'
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false)
  
  // Get environment info from config
  const envInfo = getEnvInfo()
  
  // Environment-based colors
  const getEnvironmentColor = () => {
    return envInfo.color
  }
  
  // Server status color based on health check
  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'healthy':
        return '#22c55e' // Green
      case 'unhealthy':
        return '#ef4444' // Red
      case 'unknown':
      default:
        return '#6b7280' // Gray
    }
  }
  
  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      textColor: '#374151',
      activeBackground: '#3b82f6',
      activeTextColor: '#ffffff',
      hoverBackground: '#f1f5f9'
    },
    dark: {
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      borderColor: '#374151',
      textColor: '#d1d5db',
      activeBackground: '#3b82f6',
      activeTextColor: '#ffffff',
      hoverBackground: '#374151'
    }
  }

  const currentTheme = themeStyles[theme] || themeStyles.light
  const environmentColor = getEnvironmentColor()
  const serverStatusColor = getServerStatusColor()

  const handleLanguageChange = (newLocale) => {
    hapticFeedback('impact', 'light')
    setTimeout(() => {
      changeLocale(newLocale)
    }, 100)
  }

  const toggleLanguageSwitcher = () => {
    hapticFeedback('impact', 'light')
    setShowLanguageSwitcher(!showLanguageSwitcher)
  }

  // Health check function
  const checkServerHealth = async () => {
    try {
      const response = await fetch(API_URLS.health(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        setServerStatus('healthy')
      } else {
        setServerStatus('unhealthy')
      }
    } catch (error) {
      console.log('Health check failed:', error)
      setServerStatus('unhealthy')
    }
  }

  // Health check on mount and periodic checks
  useEffect(() => {
    checkServerHealth()
    const healthInterval = setInterval(checkServerHealth, 30000)
    return () => clearInterval(healthInterval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageSwitcher && !event.target.closest('.language-toggle') && !event.target.closest('.language-dropdown')) {
        setShowLanguageSwitcher(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLanguageSwitcher])

  return (
    <div className={`status-bar ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Status Indicators */}
      <div className="status-indicators">
        {/* Environment indicator */}
        <div 
          className="status-dot environment-dot"
          style={{
            backgroundColor: environmentColor,
            border: `1px solid ${currentTheme.backgroundColor}`
          }}
          title={`${t('environment')}: ${envInfo.name}`}
        >
          <div className="status-dot-inner" style={{ animation: 'pulse 2s infinite' }}></div>
        </div>
        
        {/* Server status indicator */}
        <div 
          className="status-dot server-dot"
          style={{
            backgroundColor: serverStatusColor,
            border: `1px solid ${currentTheme.backgroundColor}`
          }}
          title={`${t('server')}: ${t(serverStatus)}`}
        >
          <div 
            className="status-dot-inner" 
            style={{ 
              animation: serverStatus === 'healthy' ? 'pulse 2s infinite' : 'none' 
            }}
          ></div>
        </div>
      </div>

      {/* Language Switcher Toggle */}
      <button
        className={`language-toggle ${showLanguageSwitcher ? 'active' : ''}`}
        onClick={toggleLanguageSwitcher}
        style={{
          backgroundColor: 'transparent',
          color: currentTheme.textColor,
          border: 'none',
          padding: '2px 4px',
          borderRadius: '4px',
          fontSize: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '20px',
          height: '20px',
          position: 'relative'
        }}
        title={t('language')}
      >
        <span 
          className="flag-icon"
          style={{ 
            fontSize: '12px',
            display: 'block',
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        >
          {locale === 'en' ? '🇺🇸' : '🇷🇺'}
        </span>
        {showLanguageSwitcher && (
          <div 
            className="dropdown-arrow"
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '2px',
              width: 0,
              height: 0,
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
              borderTop: `3px solid ${currentTheme.textColor}`,
              opacity: 0.6
            }}
          />
        )}
      </button>

      {/* Language Switcher Dropdown */}
      {showLanguageSwitcher && (
        <div className="language-dropdown">
          <div className="language-dropdown-content">
            <button
              className={`language-option ${locale === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
              style={{
                backgroundColor: locale === 'en' ? currentTheme.activeBackground : 'transparent',
                color: locale === 'en' ? currentTheme.activeTextColor : currentTheme.textColor,
                border: 'none',
                padding: '6px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '10px' }}>🇺🇸</span>
              {t('english')}
            </button>
            
            <button
              className={`language-option ${locale === 'ru' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('ru')}
              style={{
                backgroundColor: locale === 'ru' ? currentTheme.activeBackground : 'transparent',
                color: locale === 'ru' ? currentTheme.activeTextColor : currentTheme.textColor,
                border: 'none',
                padding: '6px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '10px' }}>🇷🇺</span>
              {t('russian')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
