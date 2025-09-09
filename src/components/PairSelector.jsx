import { CRYPTO_PAIRS } from '../constants/cryptoPairs'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'

export default function PairSelector({ pairs = [], onSelect, onCancel }) {
  const defaultPairs = pairs.length ? pairs : CRYPTO_PAIRS
  const { isTelegram, hapticFeedback } = useTelegram()
  const { t } = useTranslation()

  const handlePairSelect = (pair) => {
    hapticFeedback('impact', 'light')
    onSelect && onSelect(pair)
  }

  const handleCancel = () => {
    hapticFeedback('selection')
    onCancel && onCancel()
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px',
      width: '100%'
    }}>
      <h2 style={{ margin: 0, textAlign: 'center' }}>
        {isTelegram ? t('selectPair') : t('selectPairShort')}
      </h2>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        width: '100%'
      }}>
        {defaultPairs.map((pair) => (
          <button 
            key={pair} 
            onClick={() => handlePairSelect(pair)}
            style={{
              backgroundColor: isTelegram ? '#2481cc' : '#646cff',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {pair}
          </button>
        ))}
      </div>
      <button 
        style={{ 
          marginTop: '8px',
          backgroundColor: isTelegram ? '#6c757d' : '#f8f9fa',
          color: isTelegram ? 'white' : '#000',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          width: '100%'
        }}
        onClick={handleCancel}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        {isTelegram ? t('back') : t('backShort')}
      </button>
    </div>
  )
}


