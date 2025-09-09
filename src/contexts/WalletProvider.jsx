import { useState, useEffect, useCallback } from 'react'
import { WalletContext } from './WalletContext'
import { API_URLS, getTonNetwork } from '../config/environment'

const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [tonConnectUI, setTonConnectUI] = useState(null)

  // Function to fetch TON balance
  const fetchBalance = useCallback(async (address) => {
    try {
      const network = getTonNetwork()
      let apiUrl, response

      if (network === 'testnet') {
        // Use testnet.tonapi.io (more reliable than toncenter.com)
        apiUrl = 'https://testnet.tonapi.io/v2/accounts'
        response = await fetch(`${apiUrl}/${address}`)
        
        if (response.ok) {
          const data = await response.json()
          const tonBalance = (data.balance / 1000000000).toFixed(2)
          setBalance(tonBalance)
        } else {
          throw new Error(`testnet.tonapi.io error: ${response.status}`)
        }
      } else {
        // Mainnet - use toncenter.com
        apiUrl = 'https://toncenter.com/api/v3/address'
        response = await fetch(`${apiUrl}/${address}`)
        
        if (response.ok) {
          const data = await response.json()
          const tonBalance = (data.balance / 1000000000).toFixed(2) // Convert from nanoTON
          setBalance(tonBalance)
        } else {
          throw new Error(`toncenter.com error: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance('0')
    }
  }, [])

  // Setup event listeners for TON Connect
  const setupEventListeners = useCallback((ui) => {
    // Check if already connected
    ui.getWallets().then(wallets => {
      if (wallets && wallets.length > 0 && wallets[0].account) {
        const address = wallets[0].account.address || ''
        setIsConnected(true)
        setWalletAddress(address)
        fetchBalance(address)
      }
    }).catch(error => {
      console.log('No wallets connected:', error)
    })

    // Listen for connection events
    ui.onStatusChange((wallet) => {
      if (wallet && wallet.account) {
        const address = wallet.account.address || ''
        setIsConnected(true)
        setWalletAddress(address)
        fetchBalance(address)
      } else {
        setIsConnected(false)
        setWalletAddress('')
        setBalance('0')
      }
    })
  }, [fetchBalance])

  // Initialize TON Connect UI
  useEffect(() => {
    if (window.TON_CONNECT_UI && !tonConnectUI) {
      try {
        // Check if TON Connect UI is already initialized globally
        if (window.tonConnectUI) {
          setTonConnectUI(window.tonConnectUI)
          setupEventListeners(window.tonConnectUI)
        } else {
          const ui = new window.TON_CONNECT_UI.TonConnectUI({
            manifestUrl: API_URLS.tonConnectManifest(),
            network: getTonNetwork()
          })
          
          window.tonConnectUI = ui
          setTonConnectUI(ui)
          setupEventListeners(ui)
        }
      } catch (error) {
        console.error('Error initializing TON Connect UI:', error)
      }
    }
  }, [tonConnectUI, setupEventListeners])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect the global TON Connect UI instance
      setIsConnected(false)
      setWalletAddress('')
      setBalance('0')
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (tonConnectUI && window.TON_CONNECT_UI) {
        await tonConnectUI.openModal()
      } else {
        console.log('TON Connect UI not available')
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    }
  }

  const disconnectWallet = async () => {
    try {
      if (tonConnectUI && window.TON_CONNECT_UI) {
        await tonConnectUI.disconnect()
      } else {
        console.log('TON Connect UI not available')
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const refreshBalance = () => {
    if (walletAddress) {
      fetchBalance(walletAddress)
    }
  }

  const value = {
    isConnected,
    walletAddress,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export { WalletProvider }
