import { useState, useEffect, useCallback, useMemo } from 'react'
import { TIME_PERIODS } from '../constants/cryptoPairs'
import TechnicalAnalysis from './TechnicalAnalysis'
import PriceChart from './PriceChart'
import ServerAnalysis from './ServerAnalysis'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import { API_URLS } from '../config/environment'
import '../styles/PairDetail.css'

export default function PairDetail({ pair, onBack }) {
    const [price, setPrice] = useState(0)
    const [change24h, setChange24h] = useState(0)
    const [volume24h, setVolume24h] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [loading, setLoading] = useState(true)
    const [priceLoading, setPriceLoading] = useState(false)
    const [analysisLoading, setAnalysisLoading] = useState(false)
    const [serverLoading, setServerLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [showAnalysis, setShowAnalysis] = useState(false)
    const [showChart, setShowChart] = useState(true)
    const [analysis, setAnalysis] = useState(null)
    const [chartData, setChartData] = useState([])
    const [serverAnalysis, setServerAnalysis] = useState(null)
    const [showServerAnalysis, setShowServerAnalysis] = useState(false)
    const [showScrollToTop, setShowScrollToTop] = useState(false)

    const [selectedPeriod, setSelectedPeriod] = useState('1d')
    
    const { user, hapticFeedback } = useTelegram()
    const { t } = useTranslation()

    // Get Binance symbol from trading pair - memoized
    const binanceSymbol = useMemo(() => {
        return pair ? pair.replace('/', '') : ''
    }, [pair])

    // Handle scroll to top
    const handleScrollToTop = () => {
        hapticFeedback('impact', 'light')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Show/hide scroll to top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])



    const fetchPrice = useCallback(async () => {
        if (!pair) return // Don't fetch if no pair selected
        
        setPriceLoading(true)
        try {
            const symbol = binanceSymbol

            // Fetch 24hr ticker from Binance
            const response = await fetch(
                API_URLS.binance(`/api/v3/ticker/24hr?symbol=${symbol}`)
            )

            if (!response.ok) {
                throw new Error('Failed to fetch price')
            }

            const data = await response.json()

            if (data) {
                setPrice(parseFloat(data.lastPrice))
                setChange24h(parseFloat(data.priceChangePercent))
                setVolume24h(parseFloat(data.volume))
                setMarketCap(0) // Binance doesn't provide market cap
                setLastUpdate(new Date())
            } else {
                setPrice(0)
                setChange24h(0)
                setVolume24h(0)
                setMarketCap(0)
            }
        } catch (error) {
            console.error('Error fetching price:', error)
            setPrice(0)
            setChange24h(0)
            setVolume24h(0)
            setMarketCap(0)
    } finally {
      setPriceLoading(false)
    }
  }, [pair, binanceSymbol])

  // Get Binance interval from selected period
  const getBinanceInterval = (period) => {
    const intervalMap = {
      '3m': '3m',
      '5m': '5m',
      '15m': '15m',
      '30m': '30m',
      '1h': '1h',
      '2h': '2h',
      '4h': '4h',
      '6h': '6h',
      '8h': '8h',
      '12h': '12h',
      '1d': '1d'
    }
    return intervalMap[period] || '1d'
  }

  // Get analysis parameters based on period
  const getAnalysisParams = (period) => {
    const params = {
      '3m': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '5m': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '15m': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '30m': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '1h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '2h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '4h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '6h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '8h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '12h': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 },
      '1d': { rsiPeriod: 14, macdFast: 12, macdSlow: 26, trendPeriod: 7, avgPeriod: 3 }
    }
    return params[period] || params['1d']
  }

  const fetchAnalysis = useCallback(async (period = selectedPeriod) => {
    if (!pair) return // Don't fetch if no pair selected
    
    setAnalysisLoading(true)
    try {
      const symbol = binanceSymbol
      const interval = getBinanceInterval(period)
      const limit = 150

      console.log(`Fetching ${symbol} data for interval: ${interval}, limit: ${limit}`)

      // Fetch candlestick data from Binance
      const response = await fetch(
        API_URLS.binance(`/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
      )

      if (!response.ok) return

      const klines = await response.json()

      if (klines && klines.length > 0) {
        // Binance klines format: [openTime, open, high, low, close, volume, closeTime, ...]
        const chartDataFormatted = klines.map((kline) => ({
          x: kline[0], // openTime
          o: parseFloat(kline[1]), // open
          h: parseFloat(kline[2]), // high
          l: parseFloat(kline[3]), // low
          c: parseFloat(kline[4])  // close
        }))

        setChartData(chartDataFormatted)

        // Get analysis parameters based on selected period
        const analysisParams = getAnalysisParams(period)
        
        // Calculate technical indicators from close prices
        const closePrices = klines.map(k => parseFloat(k[4]))
        const currentPrice = closePrices[closePrices.length - 1]
        const trendAgoPrice = closePrices[Math.max(0, closePrices.length - analysisParams.trendPeriod)]
        const periodChange = ((currentPrice - trendAgoPrice) / trendAgoPrice) * 100

        // Calculate technical indicators with period-specific parameters
        const rsi = calculateRSI(closePrices, analysisParams.rsiPeriod)
        const macd = calculateMACD(closePrices, analysisParams.macdFast, analysisParams.macdSlow)

        // Calculate moving averages
        const recentPrices = closePrices.slice(-analysisParams.avgPeriod)
        const avgPeriod = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length

        // Determine trend based on multiple factors (period-specific thresholds)
        let trend = 'trendNeutral'
        let signal = 'signalHold'
        
        // Adjust thresholds based on period
        const trendThreshold = selectedPeriod.includes('m') ? 2 : selectedPeriod.includes('h') ? 3 : 5
        const rsiOverbought = selectedPeriod.includes('m') ? 75 : selectedPeriod.includes('h') ? 72 : 70
        const rsiOversold = selectedPeriod.includes('m') ? 25 : selectedPeriod.includes('h') ? 28 : 30

        if (periodChange > trendThreshold && rsi < rsiOverbought) {
          trend = 'trendBullish'
          signal = 'signalBuy'
        } else if (periodChange < -trendThreshold && rsi > rsiOversold) {
          trend = 'trendBearish'
          signal = 'signalSell'
        } else if (rsi > rsiOverbought) {
          signal = 'signalOverbought'
        } else if (rsi < rsiOversold) {
          signal = 'signalOversold'
        }

        // Volume analysis from Binance data
        const volumes = klines.map(k => parseFloat(k[5]))
        const recentVolume = volumes.slice(-3)
        const avgVolume = recentVolume.reduce((a, b) => a + b, 0) / recentVolume.length
        const currentVolume = volumes[volumes.length - 1]
        const volumeTrend = currentVolume > avgVolume ? 'volumeHigh' : 'volumeLow'

        setAnalysis({
          trend,
          signal,
          periodChange: periodChange.toFixed(2),
          avgPeriod: avgPeriod.toFixed(2),
          volumeTrend,
          support: (currentPrice * 0.95).toFixed(2),
          resistance: (currentPrice * 1.05).toFixed(2),
          rsi: rsi.toFixed(2),
          macd: macd.macd,
          macdSignal: macd.signal,
          macdHistogram: macd.histogram,
          period: selectedPeriod
        })
      }
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setAnalysisLoading(false)
    }
  }, [pair, selectedPeriod, binanceSymbol])


    useEffect(() => {
        if (!pair) return // Don't load data if no pair selected
        
        const loadInitialData = async () => {
            await fetchPrice()
            await fetchAnalysis(selectedPeriod)
            setLoading(false) // Hide initial loader after first data fetch
        }
        loadInitialData()

        // Auto-refresh every minute (60000ms)
        const interval = setInterval(async () => {
            await fetchPrice()
            await fetchAnalysis(selectedPeriod)
        }, 60000)

        return () => clearInterval(interval)
    }, [fetchPrice, fetchAnalysis, pair, selectedPeriod])

    // Reset analysis when period changes (no automatic fetch)
    useEffect(() => {
        if (!loading && pair) { // Only reset if initial loading is complete and pair is selected
            setAnalysis(null)
            setServerAnalysis(null)
            setShowAnalysis(false)
            setShowServerAnalysis(false)
        }
    }, [selectedPeriod, loading, pair])

    const formatPrice = (price) => {
        if (!price || price === null || price === undefined) return '0.00'
        if (price < 1) return price.toFixed(6)
        if (price < 100) return price.toFixed(4)
        return price.toFixed(2)
    }

    const getChangeColor = (change) => {
        if (change === null || change === undefined) return '#999999'
        return change >= 0 ? '#22c55e' : '#ff4444'
    }

    const formatNumber = (num) => {
        if (!num || num === null || num === undefined) return '0.00'
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
        return num.toFixed(2)
    }

    const formatTime = (date) => {
        if (!date) return ''
        return date.toLocaleTimeString(t('locale') === 'ru' ? 'ru-RU' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    // Calculate RSI (Relative Strength Index)
    const calculateRSI = (prices, period = 14) => {
        if (prices.length < period + 1) return 50

        let gains = 0
        let losses = 0

        for (let i = 1; i <= period; i++) {
            const change = prices[i] - prices[i - 1]
            if (change > 0) gains += change
            else losses -= change
        }

        const avgGain = gains / period
        const avgLoss = losses / period

        if (avgLoss === 0) return 100

        const rs = avgGain / avgLoss
        return 100 - (100 / (1 + rs))
    }

    // Calculate MACD
    const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26) => {
        if (prices.length < slowPeriod) return { macd: 0, signal: 0, histogram: 0 }

        // Simple moving averages (simplified)
        const emaFast = prices.slice(-fastPeriod).reduce((a, b) => a + b, 0) / fastPeriod
        const emaSlow = prices.slice(-slowPeriod).reduce((a, b) => a + b, 0) / slowPeriod
        const macd = emaFast - emaSlow
        const signal = macd * 0.9 // Simplified signal line
        const histogram = macd - signal

        return { macd: macd.toFixed(4), signal: signal.toFixed(4), histogram: histogram.toFixed(4) }
    }



    const handleAnalysisClick = async () => {
        if (!showAnalysis) {
            setServerLoading(true)
            
            try {
                // Send statistics send request to server when button is clicked
                try {
                    const symbol = binanceSymbol
                    const statsForSend = {
                        person_id: user?.id || 101, // Telegram ID
                        pair: symbol,
                        period: selectedPeriod,
                        c: new Date().toISOString()
                    }
                    
                    const statisticsSendRequest = await fetch(API_URLS.statisticsSend(), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(statsForSend),
                        signal: AbortSignal.timeout(5000)
                    })
                    
                    if (statisticsSendRequest.ok) {
                        console.log('Analysis request sent successfully:', statsForSend)
                    }
                } catch (error) {
                    console.log('Analysis request failed:', error)
                    // Continue with analysis even if request fails
                }

                // Send analysis data request to /app/a
                try {
                    const symbol = binanceSymbol
                    const analysisData = {
                        pair: symbol,
                        interval: selectedPeriod,
                        person_id: user?.id || 101
                    }
                    
                    const analysisDataRequest = await fetch(API_URLS.analysis(), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(analysisData),
                        signal: AbortSignal.timeout(5000)
                    })
                    
                    if (analysisDataRequest.ok) {
                        const serverResponse = await analysisDataRequest.json()
                        console.log('Analysis data request sent successfully:', analysisData)
                        console.log('Server response:', serverResponse)
                        
                        // Save server analysis data
                        if (serverResponse.status === 'success') {
                            setServerAnalysis(serverResponse)
                            setShowServerAnalysis(true)
                        }
                    }
                } catch (error) {
                    console.log('Analysis data request failed:', error)
                    // Continue with analysis even if request fails
                }
                
                fetchAnalysis(selectedPeriod)
            } finally {
                setServerLoading(false)
            }
        }
        setShowAnalysis(!showAnalysis)
    }

    const handleChartClick = () => {
        setShowChart(!showChart)
    }

    const handleCloseServerAnalysis = () => {
        setShowServerAnalysis(false)
        setServerAnalysis(null)
    }



    const handlePeriodChange = (period) => {
        setSelectedPeriod(period)
        // Reset analysis state when period changes
        setAnalysis(null)
        setServerAnalysis(null)
        setShowAnalysis(false)
        setShowServerAnalysis(false)
    }

    return (
        <>
        <div className="pair-detail-main-container">
            <h2 className="pair-detail-title">{t('pairAnalysis', { pair })}</h2>

            {loading ? (
                <div className="pair-detail-loading-container">
                    <div className="pair-detail-loading-spinner"></div>
                    <div className="pair-detail-loading-text">{t('loading')}</div>
                </div>
            ) : (
                <div className="pair-detail-price-container">
                    <div className="pair-detail-price-main">
                        ${formatPrice(price)}
                    </div>
                    <div className="pair-detail-price-change" style={{ color: getChangeColor(change24h) }}>
                        {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24{t('hours')})
                    </div>

                    <div className="pair-detail-stats-container">
                        <div>{t('volume24h')}: ${formatNumber(volume24h)}</div>
                        <div>{t('marketCap')}: ${formatNumber(marketCap)}</div>
                        {lastUpdate && (
                            <div>{t('lastUpdate')}: {formatTime(lastUpdate)}</div>
                        )}
                    </div>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => handlePeriodChange(e.target.value)}
                        className="pair-detail-period-select"
                    >
                        {TIME_PERIODS.map(period => (
                            <option key={period.value} value={period.value}>
                                {t(period.labelKey)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showAnalysis && analysis && (
                <TechnicalAnalysis analysis={analysis} selectedPeriod={selectedPeriod} />
            )}

            {showServerAnalysis && serverAnalysis && (
                <ServerAnalysis 
                    analysisData={serverAnalysis} 
                    onClose={handleCloseServerAnalysis} 
                />
            )}

            {chartData.length > 0 && showChart && (
                <PriceChart 
                    chartData={chartData} 
                    selectedPeriod={selectedPeriod} 
                    analysisLoading={analysisLoading}
                    movingAveragesHistory={serverAnalysis?.analysis?.moving_averages_history}
                />
            )}

            <div className="pair-detail-buttons-container">
                <button onClick={fetchPrice} disabled={priceLoading} className="pair-detail-button">
                    {priceLoading ? t('updating') : t('refresh')}
                </button>
                <button onClick={handleAnalysisClick} disabled={analysisLoading || serverLoading} className="pair-detail-button">
                    {serverLoading ? t('loadingFromServer') : analysisLoading ? t('loading') : showAnalysis ? t('hideAnalysis') : t('analysis')}
                </button>
            </div>
            
            {/* Прелоадер для серверных запросов */}
            {serverLoading && (
                <div className="pair-detail-server-preloader">
                    <div className="pair-detail-server-preloader-spinner"></div>
                    <span className="pair-detail-server-preloader-text">
                        {t('loadingFromServer')}
                    </span>
                </div>
            )}
            
            {chartData.length > 0 && (
                <button onClick={handleChartClick} className="pair-detail-chart-button">
                    {showChart ? t('hideChart') : t('showChart')}
                </button>
            )}

            <button onClick={onBack} className="pair-detail-back-button">{t('back')}</button>
        </div>
        
        {/* Scroll to Top Button */}
        {showScrollToTop && (
            <button
                onClick={handleScrollToTop}
                className="scroll-to-top-button"
            >
                <div className="scroll-to-top-arrow">
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                </div>
                <div className="scroll-to-top-shine"></div>
            </button>
        )}
    </>
    )
}


