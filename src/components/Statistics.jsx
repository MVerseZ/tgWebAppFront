import { useState, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import { API_URLS } from '../config/environment'

export default function Statistics({ onBack }) {
  const { theme, hapticFeedback } = useTelegram()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#f9f9f9',
      borderColor: '#ddd',
      textColor: '#000000',
      cardBackground: '#ffffff',
      accentColor: '#2481cc'
    },
    dark: {
      backgroundColor: '#2b2b2b',
      borderColor: '#444444',
      textColor: '#ffffff',
      cardBackground: '#1e1e1e',
      accentColor: '#2481cc'
    }
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  // Fetch statistics data
  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await fetch(API_URLS.stats(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }

      const data = await response.json()
      console.log('Statistics API response:', data) // Debug log
      
      // Process API data with safety checks
      const pairStatistics = data.pair_statistics || []
      const activeUsers = data.stat_person_count || 0
      const totalAnalysis = data.stat_data_count || 0
      
      // Process array format (already comes as array from server)
      const pairArray = pairStatistics.map(item => ({
        pair: item.pair ? item.pair.replace('USDT', '/USDT') : '', // Format pair name
        count: item.count || 0
      }))
      
      const totalPairs = pairArray.length
      
      // Sort pairs by count and take top 10
      const sortedPairs = pairArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      setStats({
        totalPairs,
        activeUsers,
        totalAnalysis,
        topPairs: sortedPairs,
        service: data.service || t('statistics')
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      // Fallback to mock data on error
      setStats({
        totalPairs: 0,
        activeUsers: 0,
        totalAnalysis: 0,
        topPairs: [],
        service: `${t('loadingError')}: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  const handleBack = () => {
    hapticFeedback('impact', 'light')
    onBack && onBack()
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
      }}>
        <h2 style={{ margin: 0, textAlign: 'center' }}>{t('statisticsTitle')}</h2>
       
       {stats && stats.service && (
         <div style={{
           fontSize: 12,
           opacity: 0.7,
           textAlign: 'center',
           marginBottom: '8px'
         }}>
           {stats.service}
         </div>
       )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{t('loadingStatistics')}</div>
        </div>
        <button onClick={handleBack} style={{ width: '100%' }}>{t('back')}</button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
      }}>
        <h2 style={{ margin: 0, textAlign: 'center' }}>{t('statisticsTitle')}</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>{t('loadingStatistics')}</div>
        </div>
        <button onClick={handleBack} style={{ width: '100%' }}>{t('back')}</button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%'
    }}>
      <h2 style={{ margin: 0, textAlign: 'center' }}>📊 Статистика</h2>

      {/* Main Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px'
      }}>
        <div style={{
          padding: '12px',
          backgroundColor: currentTheme.cardBackground,
          border: `1px solid ${currentTheme.borderColor}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.accentColor }}>
            {stats.totalPairs}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{t('pairs')}</div>
        </div>
        
        <div style={{
          padding: '12px',
          backgroundColor: currentTheme.cardBackground,
          border: `1px solid ${currentTheme.borderColor}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.accentColor }}>
            {formatNumber(stats.activeUsers)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{t('users')}</div>
        </div>
        
        <div style={{
          padding: '12px',
          backgroundColor: currentTheme.cardBackground,
          border: `1px solid ${currentTheme.borderColor}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: currentTheme.accentColor }}>
            {formatNumber(stats.totalAnalysis)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{t('analyses')}</div>
        </div>
      </div>

      {/* Top Pairs */}
      <div style={{
        padding: '12px',
        backgroundColor: currentTheme.cardBackground,
        border: `1px solid ${currentTheme.borderColor}`,
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>🏆 {t('topPairs')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {stats.topPairs.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: index < stats.topPairs.length - 1 ? `1px solid ${currentTheme.borderColor}` : 'none'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.pair}</div>
              </div>
              <div style={{
                color: currentTheme.accentColor,
                fontWeight: 'bold',
                fontSize: 14
              }}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleBack}
        style={{
          backgroundColor: currentTheme.accentColor,
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          width: '100%'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        {t('back')}
      </button>
    </div>
  )
}
