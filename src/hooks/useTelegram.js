import { useState, useEffect } from 'react'

export const useTelegram = () => {
  const [tg, setTg] = useState(null)
  const [isTelegram, setIsTelegram] = useState(false)
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check if we're in Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp
      setTg(tg)
      setIsTelegram(true)
      
      // Log version info for debugging
      console.log('Telegram WebApp version:', tg.version)
      console.log('HapticFeedback available:', !!tg.HapticFeedback)
      console.log('hapticFeedback method available:', !!tg.hapticFeedback)
      
      // Initialize Telegram WebApp
      tg.ready()
      tg.expand()
      
      // Get user info
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user)
      }
      
      // Set theme
      setTheme(tg.colorScheme || 'light')
      
      // Listen for theme changes
      const handleThemeChanged = () => {
        setTheme(tg.colorScheme || 'light')
      }
      
      tg.onEvent('themeChanged', handleThemeChanged)
      
      // Cleanup
      return () => {
        tg.offEvent('themeChanged', handleThemeChanged)
      }
    } else {
      // Not in Telegram - use default values
      setIsTelegram(false)
      setTheme('light')
    }
  }, [])

  const showAlert = (message) => {
    if (isTelegram && tg) {
      tg.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message, callback) => {
    if (isTelegram && tg) {
      tg.showConfirm(message, callback)
    } else {
      const result = confirm(message)
      callback(result)
    }
  }

  const close = () => {
    if (isTelegram && tg) {
      tg.close()
    } else {
      // In browser, just show a message
      alert('Приложение закрыто')
    }
  }

  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (isTelegram && tg) {
      try {
        // Check if HapticFeedback is available (version 6.0+)
        if (tg.HapticFeedback) {
          switch (type) {
            case 'impact':
              tg.HapticFeedback.impactOccurred(style)
              break
            case 'notification':
              tg.HapticFeedback.notificationOccurred(style)
              break
            case 'selection':
              tg.HapticFeedback.selectionChanged()
              break
            default:
              tg.HapticFeedback.impactOccurred('medium')
          }
        } else if (tg.hapticFeedback) {
          // Fallback for older versions or alternative API
          tg.hapticFeedback(type, style)
        } else if (typeof tg.impactOccurred === 'function') {
          // Alternative API for version 6.0
          switch (type) {
            case 'impact':
              tg.impactOccurred(style)
              break
            case 'notification':
              tg.notificationOccurred(style)
              break
            case 'selection':
              tg.selectionChanged()
              break
            default:
              tg.impactOccurred('medium')
          }
        } else {
          // No haptic feedback available
          console.log('HapticFeedback not supported in this version')
        }
      } catch (error) {
        console.log('HapticFeedback error:', error)
      }
    }
  }

  return {
    tg,
    isTelegram,
    user,
    theme,
    showAlert,
    showConfirm,
    close,
    hapticFeedback
  }
}
