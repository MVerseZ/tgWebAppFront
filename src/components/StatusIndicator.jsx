import { useState, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { getEnvInfo, API_URLS } from '../config/environment'

export default function StatusIndicator() {
  const { theme } = useTelegram()
  const [serverStatus, setServerStatus] = useState('unknown') // 'healthy', 'unhealthy', 'unknown'
  
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
      backgroundColor: '#ffffff',
      panelBackground: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb'
    },
    dark: {
      backgroundColor: '#17212b',
      panelBackground: 'rgba(23, 33, 43, 0.9)',
      borderColor: '#374151'
    }
  }
  
  const currentTheme = themeStyles[theme] || themeStyles.light
  const environmentColor = getEnvironmentColor()
  const serverStatusColor = getServerStatusColor()

  // Health check function
  const checkServerHealth = async () => {
    try {
      const response = await fetch(API_URLS.health(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        // Add timeout
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
    // Initial check
    checkServerHealth()

    // Check every 30 seconds
    const healthInterval = setInterval(checkServerHealth, 30000)

    return () => clearInterval(healthInterval)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      gap: '6px',
      padding: '4px',
      backgroundColor: currentTheme.panelBackground,
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '12px',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      {/* Environment indicator */}
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: environmentColor,
        border: `1px solid ${currentTheme.backgroundColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'white',
          animation: 'pulse 2s infinite'
        }}></div>
      </div>
      
      {/* Server status indicator */}
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: serverStatusColor,
        border: `1px solid ${currentTheme.backgroundColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'white',
          animation: serverStatus === 'healthy' ? 'pulse 2s infinite' : 'none'
        }}></div>
      </div>
    </div>
  )
}
