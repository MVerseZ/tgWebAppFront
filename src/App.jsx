import './App.css'
import { useState } from 'react'
import PairSelector from './components/PairSelector'
import PairDetail from './components/PairDetail'
import Statistics from './components/Statistics'
import AboutBot from './components/AboutBot'
import AlphaFeatures from './components/AlphaFeatures'
import StatusBar from './components/StatusBar'
import { useTelegram } from './hooks/useTelegram'
import { useTranslation } from './hooks/useTranslation'
import { LocaleProvider } from './contexts/LocaleContext.jsx'
import { WalletProvider } from './contexts/WalletProvider'

function AppContent() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedPair, setSelectedPair] = useState('')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false)
  const [isAboutBotOpen, setIsAboutBotOpen] = useState(false)
  const [isAlphaFeaturesOpen, setIsAlphaFeaturesOpen] = useState(false)
  
  const { isTelegram, user, theme, hapticFeedback, showAlert } = useTelegram()
  const { t } = useTranslation()

  const handleStart = () => {
    hapticFeedback('impact', 'light')
    setIsSelecting(true)
  }

  const handlePairSelect = (pair) => {
    hapticFeedback('impact', 'medium')
    setSelectedPair(pair)
    setIsSelecting(false)
    setIsDetailOpen(true)
    console.log(t('pairSelected', { pair }))
    
    if (isTelegram) {
      showAlert(t('pairSelected', { pair }))
    }
  }

  const handleCancel = () => {
    hapticFeedback('selection')
    setIsSelecting(false)
    setSelectedPair('') // Reset pair when canceling selection
  }

  const handleBackFromDetail = () => {
    hapticFeedback('impact', 'light')
    setIsDetailOpen(false)
    setSelectedPair('');
    // Don't reset selectedPair here - let it stay for potential reuse
  }

  const handleStatistics = () => {
    hapticFeedback('impact', 'light')
    setIsStatisticsOpen(true)
  }

  const handleBackFromStatistics = () => {
    hapticFeedback('impact', 'light')
    setIsStatisticsOpen(false)
  }

  const handleAboutBot = () => {
    hapticFeedback('impact', 'light')
    setIsAboutBotOpen(true)
  }

  const handleBackFromAboutBot = () => {
    hapticFeedback('impact', 'light')
    setIsAboutBotOpen(false)
  }

  const handleAlphaFeatures = () => {
    hapticFeedback('impact', 'light')
    setIsAlphaFeaturesOpen(true)
  }

  const handleBackFromAlphaFeatures = () => {
    hapticFeedback('impact', 'light')
    setIsAlphaFeaturesOpen(false)
  }

  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#e0e0e0'
    },
    dark: {
      backgroundColor: '#17212b',
      color: '#ffffff',
      borderColor: '#2b2b2b'
    }
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        maxWidth: isTelegram ? '100%' : 320, 
        margin: isTelegram ? '0' : '40px auto',
        padding: isTelegram ? '16px' : '2em',
        backgroundColor: currentTheme.backgroundColor,
        color: currentTheme.color,
        minHeight: isTelegram ? '100vh' : 'auto',
        position: 'relative'
      }}
    >
      <StatusBar />
      
      {isTelegram && user && (
        <div style={{ 
          fontSize: 12, 
          opacity: 0.7, 
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          {t('welcome', { name: user.first_name })}
        </div>
      )}
      
      {!isSelecting && !isDetailOpen && !isStatisticsOpen && !isAboutBotOpen && !isAlphaFeaturesOpen ? (
        <>
          <button 
            onClick={handleStart}
            style={{
              backgroundColor: isTelegram ? '#2481cc' : '#646cff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isTelegram ? t('startAnalysis') : t('startAnalysisShort')}
          </button>
          
          <button 
            onClick={handleStatistics}
            style={{
              backgroundColor: isTelegram ? '#6c757d' : '#f8f9fa',
              color: isTelegram ? 'white' : '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isTelegram ? t('statistics') : t('statisticsShort')}
          </button>

          <button 
            onClick={handleAboutBot}
            style={{
              backgroundColor: isTelegram ? '#17a2b8' : '#e9ecef',
              color: isTelegram ? 'white' : '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isTelegram ? t('aboutBot') : t('aboutBotShort')}
          </button>

          {/* Alpha Features button */}
          <button 
            onClick={handleAlphaFeatures}
            style={{
              backgroundColor: isTelegram ? '#dc3545' : '#f8d7da',
              color: isTelegram ? 'white' : '#721c24',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isTelegram ? t('alphaFeatures') : t('alphaFeaturesShort')}
          </button>

          
          {selectedPair && (
            <div style={{ fontSize: 14, opacity: 0.8, textAlign: 'center' }}>
              {t('currentPair', { pair: selectedPair })}
            </div>
          )}
        </>
      ) : isSelecting ? (
        <PairSelector onSelect={handlePairSelect} onCancel={handleCancel} />
      ) : isStatisticsOpen ? (
        <Statistics onBack={handleBackFromStatistics} />
      ) : isAboutBotOpen ? (
        <AboutBot onBack={handleBackFromAboutBot} />
      ) : isAlphaFeaturesOpen ? (
        <AlphaFeatures onBack={handleBackFromAlphaFeatures} />
      ) : (
        <PairDetail pair={selectedPair} onBack={handleBackFromDetail} />
      )}
    </div>
  )
}

function App() {
  return (
    <LocaleProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </LocaleProvider>
  )
}

export default App
