import React from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useTranslation } from '../hooks/useTranslation'

const AboutBot = ({ onBack }) => {
    const { theme, hapticFeedback } = useTelegram()
    const { t } = useTranslation()

    const handleBack = () => {
        hapticFeedback('impact', 'light')
        onBack()
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

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: theme === 'dark' ? '#f9fafb' : '#111827'
    }

    const backButtonStyle = {
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
        color: theme === 'dark' ? '#d1d5db' : '#374151'
    }

    const textStyle = {
        fontSize: '14px',
        lineHeight: '1.5',
        color: theme === 'dark' ? '#d1d5db' : '#374151',
        marginBottom: '12px'
    }

    const featureStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        fontSize: '14px',
        color: theme === 'dark' ? '#d1d5db' : '#374151'
    }

    const iconStyle = {
        marginRight: '8px',
        fontSize: '16px'
    }

    const versionStyle = {
        fontSize: '12px',
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        textAlign: 'center',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
    }



    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>{t('aboutBotTitle')}</h3>
                <button style={backButtonStyle} onClick={handleBack}>
                    ← {t('back')}
                </button>
            </div>

            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('description')}</div>
                <div style={textStyle}>
                    {t('aboutBotDescription')}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('mainFeatures')}</div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>📊</span>
                    <span>{t('realTimeAnalysis')}</span>
                </div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>📈</span>
                    <span>{t('candlestickCharts')}</span>
                </div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>🎯</span>
                    <span>{t('supportResistance')}</span>
                </div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>⚡</span>
                    <span>{t('momentumTrendAnalysis')}</span>
                </div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>📊</span>
                    <span>{t('pairsUsersStats')}</span>
                </div>
                
                <div style={featureStyle}>
                    <span style={iconStyle}>🔄</span>
                    <span>{t('autoUpdate30s')}</span>
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('supportedPairs')}</div>
                <div style={textStyle}>
                    {t('supportedPairsList')}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('timeIntervals')}</div>
                <div style={textStyle}>
                    {t('timeIntervalsList')}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>⚠️ {t('importantWarning')}</div>
                <div style={{
                    ...textStyle,
                    backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                    border: `1px solid ${theme === 'dark' ? '#dc2626' : '#fecaca'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    color: theme === 'dark' ? '#fca5a5' : '#dc2626'
                }}>
                    <strong>{t('investmentRisks')}:</strong> {t('investmentRisksText')}
                </div>
                <div style={{
                    ...textStyle,
                    backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                    border: `1px solid ${theme === 'dark' ? '#dc2626' : '#fecaca'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    color: theme === 'dark' ? '#fca5a5' : '#dc2626'
                }}>
                    <strong>{t('disclaimer')}:</strong> {t('disclaimerText')}
                </div>
            </div>

            <div style={versionStyle}>
                gnulabtgapp_env_analitics_v.1.0.0
            </div>
        </div>
    )
}

export default AboutBot
