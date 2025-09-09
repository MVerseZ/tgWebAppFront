import React, { useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import InfoModal from './InfoModal'
import { analysisDescriptions } from '../data/analysisDescriptions'

const ServerAnalysis = ({ analysisData, onClose }) => {
    const { theme } = useTelegram()
    const { t } = useTranslation()
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState(null)

    if (!analysisData || !analysisData.analysis) {
        return null
    }

    const { analysis } = analysisData



    const getDirectionColor = (direction) => {
        switch (direction) {
            case 'up': return '#22c55e'
            case 'down': return '#ef4444'
            case 'sideways': return '#f59e0b'
            default: return '#6b7280'
        }
    }

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'bullish': return '#22c55e'
            case 'bearish': return '#ef4444'
            case 'volatile': return '#f59e0b'
            case 'stable': return '#3b82f6'
            default: return '#6b7280'
        }
    }

    const getSignalColor = (signal) => {
        switch (signal) {
            case 'buy': return '#22c55e'
            case 'sell': return '#ef4444'
            case 'hold': return '#f59e0b'
            case 'strong_buy': return '#16a34a'
            case 'strong_sell': return '#dc2626'
            default: return '#6b7280'
        }
    }

    const getTrendStrengthColor = (trend) => {
        switch (trend) {
            case 'strong_bullish': return '#16a34a'
            case 'bullish': return '#22c55e'
            case 'sideways': return '#f59e0b'
            case 'bearish': return '#ef4444'
            case 'strong_bearish': return '#dc2626'
            case 'no_trend': return '#6b7280'
            case 'insufficient_data': return '#9ca3af'
            default: return '#6b7280'
        }
    }

    const getVolumeTrendColor = (trend) => {
        switch (trend) {
            case 'increasing': return '#22c55e'
            case 'stable': return '#3b82f6'
            case 'decreasing': return '#ef4444'
            case 'insufficient_data': return '#9ca3af'
            default: return '#6b7280'
        }
    }

    const getMomentumColor = (momentum) => {
        switch (momentum) {
            case 'accelerating_up': return '#16a34a'
            case 'slowing_up': return '#22c55e'
            case 'neutral': return '#f59e0b'
            case 'slowing_down': return '#ef4444'
            case 'accelerating_down': return '#dc2626'
            case 'insufficient_data': return '#9ca3af'
            default: return '#6b7280'
        }
    }

    const getQualityColor = (quality) => {
        switch (quality) {
            case 'excellent': return '#16a34a'
            case 'good': return '#22c55e'
            case 'fair': return '#f59e0b'
            case 'poor': return '#ef4444'
            default: return '#6b7280'
        }
    }

    const getMarketConditionColor = (condition) => {
        switch (condition) {
            case 'bull_market': return '#16a34a'
            case 'bear_market': return '#dc2626'
            case 'volatile': return '#f59e0b'
            case 'consolidation': return '#6b7280'
            case 'normal': return '#3b82f6'
            default: return '#6b7280'
        }
    }

    const containerStyle = {
        padding: '16px',
        borderRadius: '12px',
        margin: '16px 0',
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
        color: theme === 'dark' ? '#f9fafb' : '#111827'
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
    }

    const titleStyle = (signalColor) => ({
        fontSize: '18px',
        fontWeight: 'bold',
        color: signalColor || (theme === 'dark' ? '#f9fafb' : '#111827')
    })

    const closeButtonStyle = {
        padding: '6px 12px',
        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        color: theme === 'dark' ? '#f9fafb' : '#111827',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
    }

    const sectionStyle = {
        marginBottom: '16px'
    }

    const sectionTitleStyle = {
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: theme === 'dark' ? '#d1d5db' : '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    }

    const infoIconStyle = {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: theme === 'dark' ? '#6b7280' : '#9ca3af',
        color: theme === 'dark' ? '#1f2937' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none'
    }


    const handleInfoClick = (sectionName) => {
        setSelectedSection(analysisDescriptions[sectionName])
        setIsInfoModalOpen(true)
    }

    const handleCloseInfoModal = () => {
        setIsInfoModalOpen(false)
        setSelectedSection(null)
    }

    // Function to translate analysis values
    const translateValue = (type, value) => {
        if (!value) return value
        
        switch (type) {
            case 'direction':
                if (value === 'up') return t('up')
                if (value === 'down') return t('down')
                if (value === 'sideways') return t('sideways')
                return value
            
            case 'condition':
                if (value === 'bullish') return t('bullish')
                if (value === 'bearish') return t('bearish')
                if (value === 'volatile') return t('volatile')
                if (value === 'stable') return t('stable')
                return value
            
            case 'signal':
                if (value === 'buy') return t('buy')
                if (value === 'sell') return t('sell')
                if (value === 'hold') return t('hold')
                if (value === 'strong_buy') return t('strongBuy')
                if (value === 'strong_sell') return t('strongSell')
                return value
            
            case 'trend':
                if (value === 'strong_bullish') return t('strongBullish')
                if (value === 'bullish') return t('bullish')
                if (value === 'sideways') return t('sideways')
                if (value === 'bearish') return t('bearish')
                if (value === 'strong_bearish') return t('strongBearish')
                if (value === 'no_trend') return t('noTrend')
                if (value === 'insufficient_data') return t('insufficientData')
                return value
            
            case 'volume_trend':
                if (value === 'increasing') return t('increasing')
                if (value === 'stable') return t('stable')
                if (value === 'decreasing') return t('decreasing')
                if (value === 'insufficient_data') return t('insufficientData')
                return value
            
            case 'momentum':
                if (value === 'accelerating_up') return t('acceleratingUp')
                if (value === 'slowing_up') return t('slowingUp')
                if (value === 'neutral') return t('neutral')
                if (value === 'slowing_down') return t('slowingDown')
                if (value === 'accelerating_down') return t('acceleratingDown')
                if (value === 'insufficient_data') return t('insufficientData')
                return value
            
            case 'quality':
                if (value === 'excellent') return t('excellent')
                if (value === 'good') return t('good')
                if (value === 'fair') return t('fair')
                if (value === 'poor') return t('poor')
                return value
            
            case 'market_condition':
                if (value === 'bull_market') return t('bullMarket')
                if (value === 'bear_market') return t('bearMarket')
                if (value === 'volatile') return t('volatile')
                if (value === 'consolidation') return t('consolidation')
                if (value === 'normal') return t('normal')
                return value
            
            case 'trend_strength':
                if (value === 'strong_trend') return t('strongTrend')
                if (value === 'weak_trend') return t('weakTrend')
                return value
            
            default:
                return value
        }
    }

    const InfoIcon = ({ sectionName }) => (
        <span 
            style={infoIconStyle}
            title={t('clickForInfo')}
            onClick={() => handleInfoClick(sectionName)}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme === 'dark' ? '#9ca3af' : '#6b7280'
                e.target.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme === 'dark' ? '#6b7280' : '#9ca3af'
                e.target.style.transform = 'scale(1)'
            }}
        >
            i
        </span>
    )

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
        fontSize: '14px'
    }

    const labelStyle = {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    }

    const valueStyle = {
        fontWeight: '500'
    }

    const badgeStyle = (color) => ({
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`
    })

    const levelsListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginTop: '4px'
    }

    const levelStyle = {
        padding: '2px 6px',
        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        borderRadius: '4px',
        fontSize: '12px',
        color: theme === 'dark' ? '#d1d5db' : '#374151'
    }

    // Smart rounding functions
    const formatPrice = (price) => {
        const num = parseFloat(price)
        if (num >= 1000) return num.toFixed(2)
        if (num >= 100) return num.toFixed(3)
        if (num >= 10) return num.toFixed(4)
        if (num >= 1) return num.toFixed(5)
        return num.toFixed(6)
    }

    const formatVolume = (volume) => {
        const num = parseFloat(volume)
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
        return num.toFixed(2)
    }

    const formatPercentage = (percent) => {
        const num = Math.abs(parseFloat(percent))
        if (num >= 100) return num.toFixed(1)
        if (num >= 10) return num.toFixed(2)
        if (num >= 1) return num.toFixed(3)
        return num.toFixed(4)
    }

    const formatChange = (change) => {
        const num = parseFloat(change)
        if (Math.abs(num) >= 1000) return num.toFixed(2)
        if (Math.abs(num) >= 100) return num.toFixed(3)
        if (Math.abs(num) >= 10) return num.toFixed(4)
        if (Math.abs(num) >= 1) return num.toFixed(5)
        return num.toFixed(6)
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle(analysis.signal ? getSignalColor(analysis.signal) : null)}>
                    gnulabtgapp_env_a_v.1.0.0
                </h3>
                <button style={closeButtonStyle} onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* Основная информация */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('basicInfo')}
                    <InfoIcon sectionName="Основная информация" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('pair')}:</span>
                    <span style={valueStyle}>{analysis.pair}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('interval')}:</span>
                    <span style={valueStyle}>{analysis.interval}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('currentPrice')}:</span>
                    <span style={valueStyle}>${formatPrice(analysis.current_price)}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('analysisQuality')}:</span>
                    <span style={badgeStyle(getQualityColor(analysis.analysis_quality))}>
                        {translateValue('quality', analysis.analysis_quality)}
                    </span>
                </div>
                {analysis.signal && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('signal')}:</span>
                        <span style={badgeStyle(getSignalColor(analysis.signal))}>
                            {translateValue('signal', analysis.signal)}
                        </span>
                    </div>
                )}
            </div>

            {/* Тренд и направление */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('trendDirection')}
                    <InfoIcon sectionName="Тренд и направление" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('trend')}:</span>
                    <span style={badgeStyle(getTrendStrengthColor(analysis.trend))}>
                        {translateValue('trend', analysis.trend)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('trendStrength')}:</span>
                    <span style={badgeStyle(getTrendStrengthColor(analysis.trend_strength))}>
                        {translateValue('trend_strength', analysis.trend_strength)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('priceMomentum')}:</span>
                    <span style={badgeStyle(getMomentumColor(analysis.price_momentum))}>
                        {translateValue('momentum', analysis.price_momentum)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('marketCondition')}:</span>
                    <span style={badgeStyle(getMarketConditionColor(analysis.market_condition))}>
                        {translateValue('market_condition', analysis.market_condition)}
                    </span>
                </div>
            </div>

            {/* Изменение цены */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('priceChange')}
                    <InfoIcon sectionName="Изменение цены" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('direction')}:</span>
                    <span style={badgeStyle(getDirectionColor(analysis.price_change.direction))}>
                        {translateValue('direction', analysis.price_change.direction)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('absoluteChange')}:</span>
                    <span style={{...valueStyle, color: getDirectionColor(analysis.price_change.direction)}}>
                        ${formatChange(analysis.price_change.absolute_change)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('percentChange')}:</span>
                    <span style={{...valueStyle, color: getDirectionColor(analysis.price_change.direction)}}>
                        {formatPercentage(analysis.price_change.percent_change)}%
                    </span>
                </div>
            </div>

            {/* Волатильность и объем */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('volatilityVolume')}
                    <InfoIcon sectionName="Волатильность и объем" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('volatility')}:</span>
                    <span style={badgeStyle(getConditionColor(analysis.volatility))}>
                        {translateValue('condition', analysis.volatility)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Уровень объема:</span>
                    <span style={badgeStyle(getConditionColor(analysis.volume_level))}>
                        {analysis.volume_level}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Тренд объема:</span>
                    <span style={badgeStyle(getVolumeTrendColor(analysis.volume_trend))}>
                        {analysis.volume_trend}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>Средний объем:</span>
                    <span style={valueStyle}>{formatVolume(analysis.average_volume)}</span>
                </div>
            </div>

            {/* Поддержка и сопротивление */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('supportResistance')}
                    <InfoIcon sectionName="Поддержка и сопротивление" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('support')}:</span>
                    <span style={{...valueStyle, color: '#22c55e'}}>
                        ${formatPrice(analysis.support_resistance.support)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('resistance')}:</span>
                    <span style={{...valueStyle, color: '#ef4444'}}>
                        ${formatPrice(analysis.support_resistance.resistance)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('levels')}:</span>
                    <div style={levelsListStyle}>
                        {analysis.support_resistance.levels.map((level, index) => (
                            <span key={index} style={levelStyle}>
                                ${formatPrice(level)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Статистика цены */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('priceStatistics')}
                    <InfoIcon sectionName="Статистика цены" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('averagePrice')}:</span>
                    <span style={valueStyle}>${formatPrice(analysis.price_statistics.average_price)}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('highest')}:</span>
                    <span style={{...valueStyle, color: '#22c55e'}}>
                        ${formatPrice(analysis.price_statistics.highest_price)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('lowest')}:</span>
                    <span style={{...valueStyle, color: '#ef4444'}}>
                        ${formatPrice(analysis.price_statistics.lowest_price)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('range')}:</span>
                    <span style={valueStyle}>${formatPrice(analysis.price_range.range)}</span>
                </div>
            </div>

            {/* Последняя свеча */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('latestCandle')}
                    <InfoIcon sectionName="Последняя свеча" />
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('open')}:</span>
                    <span style={valueStyle}>${formatPrice(analysis.latest_candle.open)}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('highest')}:</span>
                    <span style={{...valueStyle, color: '#22c55e'}}>
                        ${formatPrice(analysis.latest_candle.high)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('lowest')}:</span>
                    <span style={{...valueStyle, color: '#ef4444'}}>
                        ${formatPrice(analysis.latest_candle.low)}
                    </span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('close')}:</span>
                    <span style={valueStyle}>${formatPrice(analysis.latest_candle.close)}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('volume')}:</span>
                    <span style={valueStyle}>{formatVolume(analysis.latest_candle.volume)}</span>
                </div>
            </div>

            {/* Технические индикаторы */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    {t('technicalIndicators')}
                    <InfoIcon sectionName="Технические индикаторы" />
                </div>
                {analysis.rsi && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('rsi14')}:</span>
                        <span style={{...valueStyle, color: analysis.rsi.signal === 'overbought' ? '#ef4444' : analysis.rsi.signal === 'oversold' ? '#22c55e' : '#6b7280'}}>
                            {formatPercentage(analysis.rsi.rsi_14)} ({analysis.rsi.signal})
                        </span>
                    </div>
                )}
                {analysis.macd && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('macd')}:</span>
                        <span style={{...valueStyle, color: analysis.macd.signal === 'bullish' ? '#22c55e' : analysis.macd.signal === 'bearish' ? '#ef4444' : '#6b7280'}}>
                            {formatChange(analysis.macd.macd_line)} ({analysis.macd.signal})
                        </span>
                    </div>
                )}
                {analysis.stochastic && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>Stochastic:</span>
                        <span style={{...valueStyle, color: analysis.stochastic.signal === 'bullish' ? '#22c55e' : analysis.stochastic.signal === 'bearish' ? '#ef4444' : '#6b7280'}}>
                            K: {formatPercentage(analysis.stochastic.k_percent)}, D: {formatPercentage(analysis.stochastic.d_percent)} ({analysis.stochastic.signal})
                        </span>
                    </div>
                )}
                {analysis.williams_r && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>Williams %R:</span>
                        <span style={{...valueStyle, color: analysis.williams_r.signal === 'oversold' ? '#22c55e' : analysis.williams_r.signal === 'overbought' ? '#ef4444' : '#6b7280'}}>
                            {formatChange(analysis.williams_r.williams_r)} ({analysis.williams_r.signal})
                        </span>
                    </div>
                )}
                {analysis.cci && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>CCI:</span>
                        <span style={{...valueStyle, color: analysis.cci.signal === 'overbought' ? '#ef4444' : analysis.cci.signal === 'oversold' ? '#22c55e' : '#6b7280'}}>
                            {formatChange(analysis.cci.cci)} ({analysis.cci.signal})
                        </span>
                    </div>
                )}
                {analysis.adx && (
                    <div style={rowStyle}>
                        <span style={labelStyle}>ADX:</span>
                        <span style={{...valueStyle, color: analysis.adx.signal === 'strong_trend' ? '#22c55e' : analysis.adx.signal === 'weak_trend' ? '#ef4444' : '#6b7280'}}>
                            {formatChange(analysis.adx.adx)} ({analysis.adx.signal})
                        </span>
                    </div>
                )}
            </div>

            {/* Bollinger Bands */}
            {analysis.bollinger_bands && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>
                        {t('bollingerBands')}
                        <InfoIcon sectionName="Полосы Боллинджера" />
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('upperBand')}:</span>
                        <span style={{...valueStyle, color: '#ef4444'}}>
                            ${formatPrice(analysis.bollinger_bands.upper_band)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('middleBand')}:</span>
                        <span style={valueStyle}>
                            ${formatPrice(analysis.bollinger_bands.middle_band)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('lowerBand')}:</span>
                        <span style={{...valueStyle, color: '#22c55e'}}>
                            ${formatPrice(analysis.bollinger_bands.lower_band)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>{t('bandWidth')}:</span>
                        <span style={valueStyle}>
                            {formatChange(analysis.bollinger_bands.band_width)}
                        </span>
                    </div>
                </div>
            )}

            {/* Moving Averages */}
            {analysis.moving_averages && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>
                        {t('movingAverages')}
                        <InfoIcon sectionName="Скользящие средние" />
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>SMA 5:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.sma_5)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>SMA 10:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.sma_10)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>SMA 20:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.sma_20)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>SMA 50:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.sma_50)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>EMA 5:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.ema_5)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>EMA 12:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.ema_12)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>EMA 26:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.ema_26)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>EMA 50:</span>
                        <span style={valueStyle}>${formatPrice(analysis.moving_averages.ema_50)}</span>
                    </div>
                </div>
            )}

            {/* Price Action */}
            {analysis.price_action && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>
                        Price Action
                        <InfoIcon sectionName="Price Action" />
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Паттерн:</span>
                        <span style={badgeStyle(getConditionColor(analysis.price_action.pattern))}>
                            {analysis.price_action.pattern}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Размер тела:</span>
                        <span style={valueStyle}>{analysis.price_action.body_size}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Верхний фитиль:</span>
                        <span style={valueStyle}>{formatChange(analysis.price_action.upper_wick)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Нижний фитиль:</span>
                        <span style={valueStyle}>{formatChange(analysis.price_action.lower_wick)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Соотношение фитилей:</span>
                        <span style={valueStyle}>{formatChange(analysis.price_action.wick_ratio)}</span>
                    </div>
                </div>
            )}

            {/* Market Structure */}
            {analysis.market_structure && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>
                        Структура рынка
                        <InfoIcon sectionName="Структура рынка" />
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Структура:</span>
                        <span style={badgeStyle(getTrendStrengthColor(analysis.market_structure.structure))}>
                            {analysis.market_structure.structure}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Последний максимум:</span>
                        <span style={{...valueStyle, color: '#22c55e'}}>
                            ${formatPrice(analysis.market_structure.last_high)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Последний минимум:</span>
                        <span style={{...valueStyle, color: '#ef4444'}}>
                            ${formatPrice(analysis.market_structure.last_low)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Максимумы:</span>
                        <span style={valueStyle}>{analysis.market_structure.swing_highs}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Минимумы:</span>
                        <span style={valueStyle}>{analysis.market_structure.swing_lows}</span>
                    </div>
                </div>
            )}

            {/* Risk Metrics */}
            {analysis.risk_metrics && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>Метрики риска</div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Уровень риска:</span>
                        <span style={badgeStyle(getConditionColor(analysis.risk_metrics.risk_level))}>
                            {analysis.risk_metrics.risk_level}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Коэффициент Шарпа:</span>
                        <span style={valueStyle}>{formatChange(analysis.risk_metrics.sharpe_ratio)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Максимальная просадка:</span>
                        <span style={{...valueStyle, color: '#ef4444'}}>
                            {formatPercentage(analysis.risk_metrics.max_drawdown * 100)}%
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>VaR 95%:</span>
                        <span style={{...valueStyle, color: '#ef4444'}}>
                            {formatPercentage(analysis.risk_metrics.var_95 * 100)}%
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Волатильность (годовая):</span>
                        <span style={valueStyle}>
                            {formatPercentage(analysis.risk_metrics.volatility_annual * 100)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Volume Profile */}
            {analysis.volume_profile && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>Профиль объема</div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Средний объем:</span>
                        <span style={valueStyle}>{formatVolume(analysis.volume_profile.avg_volume)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Последний объем:</span>
                        <span style={valueStyle}>{formatVolume(analysis.volume_profile.last_volume)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Соотношение объемов:</span>
                        <span style={valueStyle}>{formatChange(analysis.volume_profile.volume_ratio)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Спайк объема:</span>
                        <span style={badgeStyle(analysis.volume_profile.volume_spike ? '#ef4444' : '#22c55e')}>
                            {analysis.volume_profile.volume_spike ? 'Да' : 'Нет'}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Тренд объема:</span>
                        <span style={badgeStyle(getVolumeTrendColor(analysis.volume_profile.volume_trend))}>
                            {analysis.volume_profile.volume_trend}
                        </span>
                    </div>
                </div>
            )}

            {/* Volume Statistics */}
            {analysis.volume_statistics && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>Статистика объема</div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Максимальный объем:</span>
                        <span style={{...valueStyle, color: '#22c55e'}}>
                            {formatVolume(analysis.volume_statistics.highest_volume)}
                        </span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Минимальный объем:</span>
                        <span style={{...valueStyle, color: '#ef4444'}}>
                            {formatVolume(analysis.volume_statistics.lowest_volume)}
                        </span>
                    </div>
                </div>
            )}

            {/* ATR */}
            {analysis.atr && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>ATR (Average True Range)</div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>ATR:</span>
                        <span style={valueStyle}>{formatPrice(analysis.atr.atr)}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Сигнал:</span>
                        <span style={badgeStyle(getConditionColor(analysis.atr.signal))}>
                            {analysis.atr.signal}
                        </span>
                    </div>
                </div>
            )}

            {/* Метаданные */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('metadata')}</div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('dataSource')}:</span>
                    <span style={valueStyle}>{analysis.data_source}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('candlesCount')}:</span>
                    <span style={valueStyle}>{analysis.candles_count}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('timeframeAnalysis')}:</span>
                    <span style={valueStyle}>{analysis.timeframe_analysis}</span>
                </div>
                <div style={rowStyle}>
                    <span style={labelStyle}>{t('analysisTime')}:</span>
                    <span style={valueStyle}>
                        {new Date(analysisData.timestamp).toLocaleString('ru-RU')}
                    </span>
                </div>
            </div>

            {/* Модальное окно с информацией */}
            <InfoModal 
                isOpen={isInfoModalOpen}
                onClose={handleCloseInfoModal}
                sectionData={selectedSection}
            />
        </div>
    )
}

export default ServerAnalysis
