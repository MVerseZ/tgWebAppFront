import { useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import { useWallet } from '../hooks/useWallet'
import TonWallet from './TonWallet'
import SmartTrading from './SmartTrading'

const AlphaFeatures = ({ onBack }) => {
  const { theme } = useTelegram()
  const { t } = useTranslation()
  const { isConnected, walletAddress } = useWallet()
  const [isSmartTradingOpen, setIsSmartTradingOpen] = useState(false)

  // Debug logging
  console.log('AlphaFeatures - isConnected:', isConnected, 'walletAddress:', walletAddress)


  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#e0e0e0',
      cardBackground: '#f8f9fa'
    },
    dark: {
      backgroundColor: '#17212b',
      color: '#ffffff',
      borderColor: '#2b2b2b',
      cardBackground: '#1e2832'
    }
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  const handleSmartTrading = () => {
    setIsSmartTradingOpen(true)
  }

  const handleBackFromSmartTrading = () => {
    setIsSmartTradingOpen(false)
  }


  if (isSmartTradingOpen) {
    return <SmartTrading onBack={handleBackFromSmartTrading} isConnected={isConnected} walletAddress={walletAddress} />
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: `1px solid ${currentTheme.borderColor}`
      }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          {t('alphaFeaturesTitle')}
        </h2>
        <button
          onClick={onBack}
          style={{
            backgroundColor: currentTheme.cardBackground,
            color: currentTheme.color,
            border: `1px solid ${currentTheme.borderColor}`,
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← {t('back')}
        </button>
      </div>

      {/* TON Wallet */}
      <div style={{
        backgroundColor: currentTheme.cardBackground,
        padding: '12px',
        borderRadius: '8px',
        border: `1px solid ${currentTheme.borderColor}`
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{t('tonWallet')}</h3>
        <TonWallet />
      </div>

      {/* Smart Trading - only show if wallet is connected */}
      {isConnected && walletAddress ? (
        <div style={{
          backgroundColor: currentTheme.cardBackground,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${currentTheme.borderColor}`
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{t('smartTrading')}</h3>
          <button
            onClick={handleSmartTrading}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            🤖 {t('smartTrading')}
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: currentTheme.cardBackground,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${currentTheme.borderColor}`,
          textAlign: 'center',
          opacity: 0.7
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{t('smartTrading')}</h3>
          <p style={{ margin: '0', fontSize: '12px', color: currentTheme.color }}>
            {t('connectWalletFirst')}
          </p>
        </div>
      )}
    </div>
  )
}

export default AlphaFeatures
