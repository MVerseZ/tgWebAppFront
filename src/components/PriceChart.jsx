import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, LineElement, PointElement } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'
import { TIME_PERIODS } from '../constants/cryptoPairs'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, CandlestickController, CandlestickElement, LineController, LineElement, PointElement)

export default function PriceChart({ chartData, selectedPeriod, analysisLoading, movingAveragesHistory }) {
  const { theme } = useTelegram()
  const { t } = useTranslation()
  
  // Состояние для переключения отображения
  const [showCandles, setShowCandles] = useState(true)
  const [showMovingAverages, setShowMovingAverages] = useState(true)
  
  if (!chartData || chartData.length === 0) return null
  
  // Theme-based styles
  const themeStyles = {
    light: {
      backgroundColor: '#f9f9f9',
      borderColor: '#ddd',
      textColor: '#000000',
      gridColor: 'rgba(0,0,0,0.1)',
      tickColor: '#666'
    },
    dark: {
      backgroundColor: '#2b2b2b',
      borderColor: '#444444',
      textColor: '#ffffff',
      gridColor: 'rgba(255,255,255,0.1)',
      tickColor: '#ccc'
    }
  }
  
  const currentTheme = themeStyles[theme] || themeStyles.light

  // Функция для преобразования данных скользящих средних
  const prepareMovingAveragesData = () => {
    if (!showMovingAverages || !movingAveragesHistory || !movingAveragesHistory.candles_with_ma || !chartData || chartData.length === 0) {
      return []
    }

    const maData = []
    // Показываем только основные MA для лучшей читаемости
    const maTypes = ['sma_20', 'sma_50', 'ema_12', 'ema_26']
    const maColors = {
      'sma_20': '#00d4ff',  // Яркий голубой
      'sma_50': '#ff6b35',  // Оранжевый
      'ema_12': '#ff1744',  // Красный
      'ema_26': '#00e676'   // Зеленый
    }





    maTypes.forEach(maType => {
      const data = []
      
      // Проходим по данным MA в правильном порядке
      movingAveragesHistory.candles_with_ma.forEach((maCandle) => {
        // Находим соответствующую свечу в chartData по индексу
        const correspondingCandle = chartData[maCandle.index]
        
        if (correspondingCandle && maCandle[maType]) {
          data.push({
            x: correspondingCandle.x, // Используем openTime из chartData
            y: parseFloat(maCandle[maType].replace('$', ''))
          })
        }
      })

      // Добавляем линию только если есть данные
      if (data.length > 0) {
        maData.push({
          label: maType.toUpperCase(),
          data: data,
          borderColor: maColors[maType],
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0,
          type: 'line',
          fill: false
        })
      }
    })

    return maData
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        maxHeight: 30,
        labels: {
          color: currentTheme.textColor,
          font: {
            size: 9
          },
          usePointStyle: true,
          pointStyle: 'line',
          padding: 8,
          boxWidth: 12
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'linear',
        display: false,
        ticks: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        position: 'right',
        grid: {
          color: currentTheme.gridColor
        },
        ticks: {
          color: currentTheme.tickColor,
          font: {
            size: 10
          }
        }
      }
    },
         elements: {
       candlestick: {
         color: {
           up: '#22c55e',
           down: '#ff4444',
           unchanged: '#999'
         }
       }
     }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px',
      padding: '12px',
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.textColor
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>📈 {t('priceChart')}</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {t('interval')}: {TIME_PERIODS.find(p => p.value === selectedPeriod) ? t(TIME_PERIODS.find(p => p.value === selectedPeriod).labelKey) : selectedPeriod}
          </div>
        </div>
      </div>
      
      {/* Кнопки переключения */}
      <div className="price-chart-toggle-buttons">
        <button
          onClick={() => setShowCandles(!showCandles)}
          className={`price-chart-toggle-button ${showCandles ? 'price-chart-toggle-button-candles' : 'price-chart-toggle-button-candles-inactive'}`}
        >
          {showCandles ? `🕯️ ${t('hideCandles')}` : `🕯️ ${t('showCandles')}`}
        </button>
        
        {/* Показываем кнопку MA только если данные рассчитаны */}
        {movingAveragesHistory && movingAveragesHistory.candles_with_ma && movingAveragesHistory.candles_with_ma.length > 0 && (
          <button
            onClick={() => setShowMovingAverages(!showMovingAverages)}
            className={`price-chart-toggle-button ${showMovingAverages ? 'price-chart-toggle-button-ma' : 'price-chart-toggle-button-ma-inactive'}`}
          >
            {showMovingAverages ? `📈 ${t('hideMA')}` : `📈 ${t('showMA')}`}
          </button>
        )}
      </div>
      <div style={{ height: '200px', position: 'relative', width: '100%' }}>
        {analysisLoading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '200px',
            width: '100%',
            flexDirection: 'column',
            gap: '8px',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>{t('loadingChart')}</div>
          </div>
        ) : null}
        <Chart
          type="candlestick"
          data={{
            datasets: [
              ...(showCandles ? [{
                label: t('price'),
                data: chartData,
                borderColor: '#333',
                backgroundColor: 'rgba(0,0,0,0.1)'
              }] : []),
              ...prepareMovingAveragesData()
            ]
          }}
          options={chartOptions}
        />
      </div>
    </div>
  )
}
