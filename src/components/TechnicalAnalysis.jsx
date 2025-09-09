import { TIME_PERIODS } from '../constants/cryptoPairs'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'

export default function TechnicalAnalysis({ analysis, selectedPeriod }) {
  const { theme } = useTelegram()
  const { t } = useTranslation()
  
  if (!analysis) return null
  
  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#f9f9f9',
      borderColor: '#ddd',
      textColor: '#000000'
    },
    dark: {
      backgroundColor: '#2b2b2b',
      borderColor: '#444444',
      textColor: '#ffffff'
    }
  }
  
  const currentTheme = themeStyles[theme] || themeStyles.light

  // Helper function to translate analysis values
  const translateValue = (type, value) => {
    switch (type) {
      case 'trend':
        if (value === 'trendBullish' || value === 'Бычий' || value === 'Bullish') return t('bullish')
        if (value === 'trendBearish' || value === 'Медвежий' || value === 'Bearish') return t('bearish')
        if (value === 'trendNeutral' || value === 'Нейтральный' || value === 'Neutral') return t('neutral')
        return t('neutral')
      
      case 'signal':
        if (value === 'signalBuy' || value === 'Покупка' || value === 'Buy') return t('buy')
        if (value === 'signalSell' || value === 'Продажа' || value === 'Sell') return t('sell')
        if (value === 'signalOverbought' || value === 'Перекупленность' || value === 'Overbought') return t('overbought')
        if (value === 'signalOversold' || value === 'Перепроданность' || value === 'Oversold') return t('oversold')
        if (value === 'signalHold' || value === 'Удержание' || value === 'Hold') return t('hold')
        return t('hold')
      
      case 'volume':
        if (value === 'volumeHigh' || value === 'Высокий' || value === 'High') return t('volumeHigh')
        if (value === 'volumeLow' || value === 'Низкий' || value === 'Low') return t('volumeLow')
        return value
      
      default:
        return value
    }
  }

  // Helper function to get color based on value type
  const getValueColor = (type, value) => {
    switch (type) {
      case 'trend':
        if (value === 'trendBullish' || value === 'Бычий' || value === 'Bullish') return '#22c55e'
        if (value === 'trendBearish' || value === 'Медвежий' || value === 'Bearish') return '#ff4444'
        return '#999'
      
      case 'signal':
        if (value === 'signalBuy' || value === 'Покупка' || value === 'Buy') return '#22c55e'
        if (value === 'signalSell' || value === 'Продажа' || value === 'Sell') return '#ff4444'
        if (value === 'signalOverbought' || value === 'Перекупленность' || value === 'Overbought') return '#ff8800'
        if (value === 'signalOversold' || value === 'Перепроданность' || value === 'Oversold') return '#0088ff'
        return '#999'
      
      case 'change': {
        const numValue = parseFloat(value)
        if (numValue > 0) return '#22c55e'
        if (numValue < 0) return '#ff4444'
        return '#999'
      }
      
      case 'volume':
        if (value === 'Высокий' || value === 'High') return '#22c55e'
        if (value === 'Низкий' || value === 'Low') return '#ff4444'
        return '#999'
      
      case 'rsi': {
        const rsiValue = parseFloat(value)
        if (rsiValue > 70) return '#ff8800' // Overbought
        if (rsiValue < 30) return '#0088ff' // Oversold
        if (rsiValue > 50) return '#22c55e' // Bullish
        return '#ff4444' // Bearish
      }
      
      case 'macd': {
        const macdValue = parseFloat(value)
        if (macdValue > 0) return '#22c55e'
        if (macdValue < 0) return '#ff4444'
        return '#999'
      }
      
      default:
        return '#333'
    }
  }

  return (
    <div style={{
      padding: '12px',
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.textColor,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>📊 {t('technicalAnalysis')}</h3>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {t('period')}: {TIME_PERIODS.find(p => p.value === selectedPeriod) ? t(TIME_PERIODS.find(p => p.value === selectedPeriod).labelKey) : selectedPeriod}
        </div>
      </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 12 }}>
         <div>
           <strong>{t('trend')}:</strong> 
           <span style={{ color: getValueColor('trend', analysis.trend), fontWeight: 'bold' }}>
             {translateValue('trend', analysis.trend)}
           </span>
         </div>
         <div>
           <strong>{t('signal')}:</strong> 
           <span style={{ color: getValueColor('signal', analysis.signal), fontWeight: 'bold' }}>
             {translateValue('signal', analysis.signal)}
           </span>
         </div>
         <div>
           <strong>{t('periodChange')}:</strong> 
           <span style={{ color: getValueColor('change', analysis.periodChange), fontWeight: 'bold' }}>
             {analysis.periodChange}%
           </span>
         </div>
         <div><strong>{t('avgPeriod')}:</strong> ${analysis.avgPeriod}</div>
         <div>
           <strong>{t('volume')}:</strong> 
           <span style={{ color: getValueColor('volume', analysis.volumeTrend), fontWeight: 'bold' }}>
             {translateValue('volume', analysis.volumeTrend)}
           </span>
         </div>
         <div><strong>{t('support')}:</strong> ${analysis.support}</div>
         <div><strong>{t('resistance')}:</strong> ${analysis.resistance}</div>
         <div style={{ borderTop: `1px solid ${currentTheme.borderColor}`, paddingTop: '4px', marginTop: '4px' }}>
           <div>
             <strong>{t('rsi14')}:</strong> 
             <span style={{ color: getValueColor('rsi', analysis.rsi), fontWeight: 'bold' }}>
               {analysis.rsi}
             </span>
           </div>
           <div>
             <strong>{t('macd')}:</strong> 
             <span style={{ color: getValueColor('macd', analysis.macd), fontWeight: 'bold' }}>
               {analysis.macd}
             </span>
           </div>
           <div>
             <strong>{t('macdSignal')}:</strong> 
             <span style={{ color: getValueColor('macd', analysis.macdSignal), fontWeight: 'bold' }}>
               {analysis.macdSignal}
             </span>
           </div>
           <div>
             <strong>{t('macdHistogram')}:</strong> 
             <span style={{ color: getValueColor('macd', analysis.macdHistogram), fontWeight: 'bold' }}>
               {analysis.macdHistogram}
             </span>
           </div>
         </div>
       </div>
    </div>
  )
}
