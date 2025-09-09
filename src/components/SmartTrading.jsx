import { useState, useEffect, useCallback } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import { useWallet } from '../hooks/useWallet'
import { API_URLS } from '../config/environment'
import { CRYPTO_PAIRS } from '../constants/cryptoPairs'
import '../styles/SmartTrading.css'

const SmartTrading = ({ onBack, isConnected, walletAddress }) => {
  const {  hapticFeedback, user } = useTelegram()
  const { t } = useTranslation()
  const { balance } = useWallet()
  const [isActive, setIsActive] = useState(false)
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [riskLevel, setRiskLevel] = useState('medium')
  const [tradingAmount, setTradingAmount] = useState(100)
  const [statistics, setStatistics] = useState({
    trades: 0,
    profit: 0,
    successRate: 0,
    balance: 0
  })
  const [loading, setLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [tradingUuid, setTradingUuid] = useState(null)



  // Логирование текущего состояния для отладки
  console.log('SmartTrading render state:', { isActive, selectedPair, riskLevel, tradingAmount })

  // Запрос на /sm/s при открытии компонента
  const fetchSmartTradingStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URLS.smartTrading()}/s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_id: user?.id || 101
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Smart Trading status received:', data)
        
        if (data.status === 'success') {
          // Используем данные из trading_state если они есть, иначе из корня ответа
          const tradingData = data.trading_state || data
          
          console.log('Updating state with data:', {
            isActive: tradingData.is_active,
            selectedPair: tradingData.pair,
            riskLevel: tradingData.risk_level,
            tradingAmount: tradingData.trading_amount
          })
          
          setIsActive(tradingData.is_active || false)
          setSelectedPair(tradingData.pair ? tradingData.pair.replace(/([A-Z]+)([A-Z]+)/, '$1/$2') : 'BTC/USDT')
          setRiskLevel(tradingData.risk_level || 'medium')
          setTradingAmount(tradingData.trading_amount || 100)
          setTradingUuid(tradingData.uuid || null)
          setStatistics({
            ...(data.statistics || { trades: 0, profit: 0, successRate: 0, balance: 0 }),
            tradingAmount: tradingData.trading_amount || 0
          })
          setLastUpdate(new Date())
        }
      }
    } catch (error) {
      console.log('Failed to fetch Smart Trading status:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Запрос при открытии компонента
  useEffect(() => {
    fetchSmartTradingStatus()
  }, [user?.id, fetchSmartTradingStatus])

  const handleToggle = async () => {
    hapticFeedback('impact', 'medium')
    const newActiveState = !isActive
    
    if (newActiveState) {
      // При запуске отправляем запрос на /sm с текущими параметрами
      setLoading(true)
      setIsRefreshing(true)
      try {
        const response = await fetch(API_URLS.smartTrading(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            person_id: user?.id || 101,
            pair: selectedPair.replace('/', ''),
            risk_level: riskLevel,
            trading_amount: tradingAmount,
            isActive: true
          }),
          signal: AbortSignal.timeout(10000)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Smart Trading started:', data)
          
          if (data.status === 'success') {
            setIsActive(true)
            setTradingUuid(data.uuid || null)
            setLastUpdate(new Date())
            // Обновляем статистику если пришла
            if (data.statistics) {
              setStatistics({
                ...data.statistics,
                tradingAmount: data.trading_amount || 0
              })
            }
          } else {
            console.log('Failed to start Smart Trading:', data.message)
          }
        } else {
          console.log('Failed to start Smart Trading: HTTP error')
        }
      } catch (error) {
        console.log('Failed to start Smart Trading:', error)
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    } else {
      // При остановке отправляем запрос с isActive: false
      setLoading(true)
      setIsRefreshing(true)
      try {
        const response = await fetch(API_URLS.smartTrading(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            person_id: user?.id || 101,
            pair: selectedPair.replace('/', ''),
            risk_level: riskLevel,
            trading_amount: tradingAmount,
            isActive: false,
            uuid: tradingUuid
          }),
          signal: AbortSignal.timeout(10000)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Smart Trading stopped:', data)
          
          if (data.status === 'success') {
            setIsActive(false)
            setTradingUuid(null)
            setLastUpdate(new Date())
            // Обновляем статистику если пришла
            if (data.statistics) {
              setStatistics({
                ...data.statistics,
                tradingAmount: data.trading_amount || 0
              })
            }
          } else {
            console.log('Failed to stop Smart Trading:', data.message)
          }
        } else {
          console.log('Failed to stop Smart Trading: HTTP error')
        }
      } catch (error) {
        console.log('Failed to stop Smart Trading:', error)
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    }
  }

  const handleBack = () => {
    hapticFeedback('impact', 'light')
    onBack()
  }

  const handlePairChange = (newPair) => {
    setSelectedPair(newPair)
  }

  const handleRiskLevelChange = (newRiskLevel) => {
    setRiskLevel(newRiskLevel)
  }

  const handleTradingAmountChange = (newAmount) => {
    const amount = parseFloat(newAmount) || 0
    if (amount >= 10 && amount <= 10000) {
      setTradingAmount(amount)
    }
  }

  const pairs = CRYPTO_PAIRS
  const riskLevels = [
    { value: 'low', label: t('low'), color: '#28a745' },
    { value: 'medium', label: t('medium'), color: '#ffc107' },
    { value: 'high', label: t('high'), color: '#dc3545' }
  ]

  // Check if wallet is connected
  if (!isConnected || !walletAddress) {
    return (
      <div>
        <div>
          <h2>🚀 {t('smartTrading')}</h2>
          <button onClick={onBack}>
            ← {t('back')}
          </button>
        </div>
        <div className="smart-trading-warning">
          <div className="smart-trading-warning-title">⚠️ {t('walletRequired')}</div>
          <div className="smart-trading-warning-text">
            {t('connectWalletFirst')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="smart-trading-container">
      {/* Preloader */}
      {isRefreshing && (
        <div className="smart-trading-preloader">
          <div className="smart-trading-preloader-content">
            <div className="smart-trading-preloader-icon">⏳</div>
            <div className="smart-trading-preloader-text">
              {!isActive ? t('startingTrading') : t('stoppingTrading')}
            </div>
          </div>
        </div>
      )}
      
      <div>
        {/* Header */}
        <div className="smart-trading-header">
          <h2 className="smart-trading-title">
            🚀 {t('smartTrading')}
          </h2>
          <button
            className="smart-trading-back-button"
            onClick={handleBack}
          >
            ← {t('back')}
          </button>
        </div>

        {/* Status */}
        <div className="smart-trading-status">
          <div>
            <h3 className="smart-trading-status-title">{t('status')}</h3>
            <div className="smart-trading-status-content">
              <div className="smart-trading-status-indicator-wrapper">
                <span className={`smart-trading-status-indicator ${isActive ? 'smart-trading-status-active' : 'smart-trading-status-inactive'}`}>
                  {isActive ? `🟢 ${t('active')}` : `🔴 ${t('inactive')}`}
                </span>
              </div>
              <div className="smart-trading-toggle-wrapper">
                <button
                  className="smart-trading-toggle-button"
                  onClick={handleToggle}
                  disabled={loading}
                >
                  {loading ? `⏳ ${t('processing')}` : (isActive ? t('stop') : t('start'))}
                </button>
              </div>
            </div>
          </div>
          <div>
            {isActive ? (
              <div>
                <div>🚀 {t('automaticTradingActive')}</div>
                <div>
                  {t('pair')}: {selectedPair} | {t('risk')}: {riskLevel} | {t('amount')}: {tradingAmount} {t('currency')}
                </div>
              </div>
            ) : (
              `⏸️ ${t('automaticTradingStopped')}`
            )}
          </div>
          <div>
            {t('lastUpdate')}: {lastUpdate.toLocaleTimeString()}
            {loading && <span>⏳ {t('loading')}</span>}
          </div>
        </div>

        {/* Pair Selection - скрываем если торговля активна */}
        {!isActive && (
          <div className="smart-trading-settings">
            <h3 className="smart-trading-settings-title">{t('tradingPair')}</h3>
            <div className="smart-trading-setting-group">
              <label className="smart-trading-setting-label">{t('selectPair')}</label>
              <select
                className="smart-trading-select"
                value={selectedPair}
                onChange={(e) => handlePairChange(e.target.value)}
              >
                {pairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Risk Level - скрываем если торговля активна */}
        {!isActive && (
          <div className="smart-trading-settings">
            <h3 className="smart-trading-settings-title">{t('riskLevel')}</h3>
            <div className="smart-trading-setting-group">
              <label className="smart-trading-setting-label">{t('selectRiskLevel')}</label>
              <div className="smart-trading-risk-buttons">
                {riskLevels.map(level => (
                  <button
                    key={level.value}
                    className={`smart-trading-risk-button ${riskLevel === level.value ? 'active' : ''}`}
                    onClick={() => handleRiskLevelChange(level.value)}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trading Amount - скрываем если торговля активна */}
        {!isActive && (
          <div className="smart-trading-settings">
            <h3 className="smart-trading-settings-title">{t('tradingAmount')}</h3>
            
            {/* TON Balance */}
            <div className="smart-trading-setting-group">
              <label className="smart-trading-setting-label">{t('tonBalance')}</label>
              <div className="smart-trading-balance-display">
                <span className="smart-trading-balance-amount">{balance}</span>
                <span className="smart-trading-balance-currency">TON</span>
              </div>
            </div>
            
            <div className="smart-trading-setting-group">
              <label className="smart-trading-setting-label">{t('enterAmount')}</label>
              <div className="smart-trading-input-wrapper">
                <input
                  className="smart-trading-input"
                  type="number"
                  value={tradingAmount}
                  onChange={(e) => handleTradingAmountChange(e.target.value)}
                  min="10"
                  max="10000"
                  step="10"
                  placeholder="100"
                />
                <span className="smart-trading-currency-label">
                  {t('currency')}
                </span>
              </div>
            </div>
            <div>
              {t('minimum')}: 10 {t('currency')} | {t('maximum')}: 10,000 {t('currency')}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="smart-trading-statistics">
          <h3 className="smart-trading-statistics-title">{t('statistics')}</h3>
          <div className="smart-trading-stats-grid">
            <div className="smart-trading-stat-item">
              <div className="smart-trading-stat-label">{t('trades')}</div>
              <div className="smart-trading-stat-value">{statistics.trades}</div>
            </div>
            <div className="smart-trading-stat-item">
              <div className="smart-trading-stat-label">{t('profit')}</div>
              <div className={`smart-trading-stat-value ${statistics.profit >= 0 ? 'positive' : 'negative'}`}>
                {statistics.profit >= 0 ? '+' : ''}{statistics.profit.toFixed(2)}%
              </div>
            </div>
            <div className="smart-trading-stat-item">
              <div className="smart-trading-stat-label">{t('successRate')}</div>
              <div className="smart-trading-stat-value">{statistics.successRate.toFixed(1)}%</div>
            </div>
            <div className="smart-trading-stat-item">
              <div className="smart-trading-stat-label">{t('currentAmount')}</div>
              <div className="smart-trading-stat-value">{statistics.tradingAmount || 0} {t('currency')}</div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="smart-trading-warning">
          <div className="smart-trading-warning-title">⚠️ {t('warning')}</div>
          <div className="smart-trading-warning-text">
            {t('smartTradingDev')}
          </div>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="smart-trading-last-update">
            {t('lastUpdate')}: {lastUpdate.toLocaleTimeString()}
            {loading && <span> ⏳ {t('loading')}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartTrading
