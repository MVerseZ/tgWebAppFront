// Environment configuration
const ENV = {
  // Current environment - change this to switch between environments
  CURRENT: 'development', // 'development' | 'production'
  
  // Environment settings
  environments: {
    development: {
      apiBaseUrl: 'http://localhost:4488',
      healthUrl: 'http://localhost:4488/app/health',
      statsUrl: 'http://localhost:4488/app/stat',
      statisticsSendUrl: 'http://localhost:4488/app/w',
      analysisUrl: 'http://localhost:4488/app/a',
      smartTradingUrl: 'http://localhost:4488/app/sm',
      binanceUrl: 'https://api.binance.com',
      manifestUrl: 'https://gnulabtgapp.xyz/tonconnect-manifest.json',
      tonNetwork: 'testnet', // TON testnet for development
      name: 'Development',
      color: '#f59e0b' // Orange
    },
    production: {
      apiBaseUrl: 'https://gnulabtgapp.xyz',
      healthUrl: 'https://gnulabtgapp.xyz/app/health',
      statsUrl: 'https://gnulabtgapp.xyz/app/stat',
      statisticsSendUrl: 'https://gnulabtgapp.xyz/app/w',
      analysisUrl: 'https://gnulabtgapp.xyz/app/a',
      smartTradingUrl: 'https://gnulabtgapp.xyz/app/sm',
      binanceUrl: 'https://api.binance.com',
      manifestUrl: 'https://gnulabtgapp.xyz/tonconnect-manifest.json',
      tonNetwork: 'mainnet', // TON mainnet for production
      name: 'Production',
      color: '#22c55e' // Green
    }
  }
}

// Get current environment config
export const getCurrentEnv = () => {
  return ENV.environments[ENV.CURRENT] || ENV.environments.development
}

// Get specific URL
export const getApiUrl = (endpoint) => {
  const env = getCurrentEnv()
  return `${env.apiBaseUrl}${endpoint}`
}

// Get Binance URL
export const getBinanceUrl = (endpoint) => {
  const env = getCurrentEnv()
  return `${env.binanceUrl}${endpoint}`
}

// Environment info
export const getEnvInfo = () => {
  const env = getCurrentEnv()
  return {
    name: env.name,
    color: env.color,
    current: ENV.CURRENT
  }
}

// Get TON Connect manifest URL
export const getTonConnectManifestUrl = () => {
  return getCurrentEnv().manifestUrl
}

// Get TON network
export const getTonNetwork = () => {
  return getCurrentEnv().tonNetwork
}

// Check if current environment is production
export const isProduction = () => {
  return ENV.CURRENT === 'production'
}

// Check if current environment is development
export const isDevelopment = () => {
  return ENV.CURRENT === 'development'
}

// URLs
export const API_URLS = {
  health: () => getCurrentEnv().healthUrl,
  stats: () => getCurrentEnv().statsUrl,
  statisticsSend: () => getCurrentEnv().statisticsSendUrl,
  analysis: () => getCurrentEnv().analysisUrl,
  smartTrading: () => getCurrentEnv().smartTradingUrl,
  binance: (endpoint) => getBinanceUrl(endpoint),
  tonConnectManifest: () => getTonConnectManifestUrl()
}

export default ENV
