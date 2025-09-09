import React, { useState, useCallback } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'
import { useWallet } from '../hooks/useWallet'
import { API_URLS, getTonNetwork } from '../config/environment'
import '../styles/TonWallet.css'

const TonWallet = () => {
    const { theme, hapticFeedback } = useTelegram()
    const { t } = useTranslation()
    const { isConnected, walletAddress, balance, connectWallet, disconnectWallet, refreshBalance } = useWallet()
    const [isLoading, setIsLoading] = useState(false)
    const [jettonBalances, setJettonBalances] = useState([])
    const [isLoadingJettonBalance, setIsLoadingJettonBalance] = useState(false)


    // Function to fetch jetton balances
    const fetchJettonBalance = useCallback(async (address) => {
        if (!address) return
        
        setIsLoadingJettonBalance(true)
        try {
            const network = getTonNetwork()
            let apiUrl, response
            
            if (network === 'testnet') {
                // Use testnet.tonapi.io (more reliable than toncenter.com)
                apiUrl = 'https://testnet.tonapi.io/v2/accounts'
                response = await fetch(`${apiUrl}/${address}/jettons`)
                
                if (response.ok) {
                    const data = await response.json()
                    const balances = data.balances || []
                    
                    // Find only T jetton
                    const tJetton = balances.find(jetton => jetton.jetton?.symbol === 'T')
                    if (tJetton) {
                        const decimals = tJetton.jetton?.decimals || 9
                        const balance = (parseInt(tJetton.balance) / Math.pow(10, decimals)).toFixed(2)
                        setJettonBalances([{
                            balance: balance,
                            symbol: tJetton.jetton?.symbol || 'T',
                            name: tJetton.jetton?.name || 'T',
                            decimals: decimals,
                            address: tJetton.jetton?.address
                        }])
                    } else {
                        setJettonBalances([])
                    }
                    return
                } else {
                    throw new Error(`testnet.tonapi.io error: ${response.status}`)
                }
            } else {
                // Mainnet - use toncenter.com
                apiUrl = 'https://toncenter.com/api/v3/jetton/balances'
                response = await fetch(`${apiUrl}?address=${address}`)
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }
                
                const data = await response.json()
                const balances = data.balances || []
                
                // Find only T jetton
                const tJetton = balances.find(jetton => jetton.jetton?.symbol === 'T')
                if (tJetton) {
                    const decimals = tJetton.jetton?.decimals || 9
                    const balance = (parseInt(tJetton.balance) / Math.pow(10, decimals)).toFixed(2)
                    setJettonBalances([{
                        balance: balance,
                        symbol: tJetton.jetton?.symbol || 'T',
                        name: tJetton.jetton?.name || 'T',
                        decimals: decimals,
                        address: tJetton.jetton?.address
                    }])
                } else {
                    setJettonBalances([])
                }
            }
        } catch (error) {
            console.error('Error fetching jetton balances:', error)
            setJettonBalances([])
        } finally {
            setIsLoadingJettonBalance(false)
        }
    }, [])



    const handleConnectWallet = async () => {
        hapticFeedback('impact', 'light')
        setIsLoading(true)
        try {
            await connectWallet()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnectWallet = async () => {
        hapticFeedback('impact', 'light')
        setIsLoading(true)
        try {
            await disconnectWallet()
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefreshBalance = () => {
        hapticFeedback('impact', 'light')
        if (walletAddress) {
            refreshBalance()
            fetchJettonBalance(walletAddress)
        }
    }

    // Don't render if TON Connect UI is not available
    if (!window.TON_CONNECT_UI) {
        return null
    }

    return (
        <div className="ton-wallet-section" data-theme={theme}>
            <div className="ton-wallet-title">
                🔗 {t('tonWallet')} 
                <span style={{ 
                    fontSize: '12px', 
                    marginLeft: '8px', 
                    padding: '2px 6px', 
                    backgroundColor: getTonNetwork() === 'testnet' ? '#f59e0b' : '#22c55e',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'normal'
                }}>
                    {getTonNetwork() === 'testnet' ? 'TESTNET' : 'MAINNET'}
                </span>
            </div>
            <div className="ton-wallet-text">
                {t('connectTonWallet')}
                {getTonNetwork() === 'testnet' && (
                    <div style={{ 
                        marginTop: '8px', 
                        fontSize: '12px', 
                        color: '#f59e0b',
                        fontWeight: '600'
                    }}>
                        {t('testnetWarning')}
                    </div>
                )}
            </div>
            
            <button 
                className={`ton-wallet-button ${isConnected ? 'connected' : 'disconnected'}`}
                onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
                disabled={isLoading}
            >
                {isLoading ? `⏳ ${t('loading')}` : (isConnected ? `🔌 ${t('disconnectWallet')}` : `🔗 ${t('connectWallet')}`)}
            </button>

            {isLoading && (
                <div className="ton-wallet-loading">
                    {t('processingRequest')}
                </div>
            )}

            {isConnected && walletAddress && (
                <>
                    <div className="ton-wallet-address">
                        <strong>{t('walletAddress')}:</strong><br />
                        {walletAddress}
                    </div>
                    
                    <div className="ton-wallet-balance-section">
                        <div className="ton-wallet-balance-header">
                            <span className="ton-wallet-balance-title">💰 {t('tonBalance')}</span>
                            <button 
                                className="ton-wallet-refresh-button"
                                onClick={handleRefreshBalance}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳' : '🔄'}
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="ton-wallet-loading">
                                {t('loadingBalance')}
                            </div>
                        ) : (
                            <div className="ton-wallet-balance-amount">
                                {balance} TON
                            </div>
                        )}
                        
                        {/* T Jetton Balance */}
                        {jettonBalances.length > 0 && (
                            <div className="ton-wallet-jettons-section">
                                {isLoadingJettonBalance ? (
                                    <div className="ton-wallet-loading">
                                        {t('loadingTBalance')}
                                    </div>
                                ) : (
                                    <div className="ton-wallet-jettons-list">
                                        {jettonBalances.map((jetton, index) => (
                                            <div key={index} className="ton-wallet-jetton-item">
                                                <div className="ton-wallet-jetton-info">
                                                    <div className="ton-wallet-jetton-symbol">{jetton.symbol}</div>
                                                    <div className="ton-wallet-jetton-name">{jetton.name}</div>
                                                </div>
                                                <div className="ton-wallet-jetton-balance">
                                                    {jetton.balance} {jetton.symbol}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default TonWallet
