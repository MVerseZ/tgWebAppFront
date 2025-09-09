// Crypto trading pairs
export const CRYPTO_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'SOL/USDT',
  'XRP/USDT',
  'TON/USDT',  
  'ADA/USDT',
  'DOGE/USDT',
  'TRX/USDT',
  'MATIC/USDT',
  'DOT/USDT',
  'AVAX/USDT',
  'NEAR/USDT',
  'ATOM/USDT',
  'OP/USDT',
  'ARB/USDT',
  'LINK/USDT',
  'LTC/USDT',
  'BCH/USDT'
]

// Map trading pairs to CoinGecko coin IDs
export const COIN_ID_MAP = {
  'BTC/USDT': 'bitcoin',
  'ETH/USDT': 'ethereum',
  'BNB/USDT': 'binancecoin',
  'SOL/USDT': 'solana',
  'TON/USDT': 'the-open-network',
  'XRP/USDT': 'ripple',
  'ADA/USDT': 'cardano',
  'DOGE/USDT': 'dogecoin',
  'TRX/USDT': 'tron',
  'MATIC/USDT': 'matic-network',
  'DOT/USDT': 'polkadot',
  'AVAX/USDT': 'avalanche-2',
  'NEAR/USDT': 'near',
  'ATOM/USDT': 'cosmos',
  'OP/USDT': 'optimism',
  'ARB/USDT': 'arbitrum',
  'LINK/USDT': 'chainlink',
  'LTC/USDT': 'litecoin',
  'BCH/USDT': 'bitcoin-cash'
}

// Time period options for analysis
export const TIME_PERIODS = [
  { value: '3m', labelKey: 'time3m' },
  { value: '5m', labelKey: 'time5m' },
  { value: '15m', labelKey: 'time15m' },
  { value: '30m', labelKey: 'time30m' },
  { value: '1h', labelKey: 'time1h' },
  { value: '2h', labelKey: 'time2h' },
  { value: '4h', labelKey: 'time4h' },
  { value: '6h', labelKey: 'time6h' },
  { value: '8h', labelKey: 'time8h' },
  { value: '12h', labelKey: 'time12h' },
  { value: '1d', labelKey: 'time1d' }
]

// API parameters for different time periods
export const PERIOD_PARAMS = {
  '3m': { days: 1, interval: 'minutely' },
  '5m': { days: 1, interval: 'minutely' },
  '15m': { days: 1, interval: 'minutely' },
  '30m': { days: 1, interval: 'minutely' },
  '1h': { days: 1, interval: 'hourly' },
  '2h': { days: 2, interval: 'hourly' },
  '4h': { days: 4, interval: 'hourly' },
  '6h': { days: 6, interval: 'hourly' },
  '8h': { days: 8, interval: 'hourly' },
  '12h': { days: 12, interval: 'hourly' },
  '1d': { days: 30, interval: 'daily' }
}
