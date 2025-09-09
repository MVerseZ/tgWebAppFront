import React from 'react'
import { useTelegram } from '../hooks/useTelegram'
import '../styles/InfoModal.css'

const InfoModal = ({ isOpen, onClose, sectionData }) => {
  const { theme } = useTelegram()

  if (!isOpen || !sectionData) return null

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className={`info-modal-content ${theme === 'dark' ? 'info-modal-content-dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={`info-modal-header ${theme === 'dark' ? 'info-modal-header-dark' : ''}`}>
          <h2 className={`info-modal-title ${theme === 'dark' ? 'info-modal-title-dark' : ''}`}>
            {sectionData.title}
          </h2>
          <button 
            className={`info-modal-close-button ${theme === 'dark' ? 'info-modal-close-button-dark' : ''}`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className={`info-modal-description ${theme === 'dark' ? 'info-modal-description-dark' : ''}`}>
          {sectionData.description}
        </div>

        <div className="info-modal-parameters">
          <h3 className={`info-modal-parameters-title ${theme === 'dark' ? 'info-modal-parameters-title-dark' : ''}`}>
            Параметры:
          </h3>
          
          {Object.entries(sectionData.parameters).map(([paramName, paramDesc]) => (
            <div key={paramName} className={`info-modal-parameter-item ${theme === 'dark' ? 'info-modal-parameter-item-dark' : ''}`}>
              <div className={`info-modal-parameter-name ${theme === 'dark' ? 'info-modal-parameter-name-dark' : ''}`}>
                {paramName}
              </div>
              <div className={`info-modal-parameter-desc ${theme === 'dark' ? 'info-modal-parameter-desc-dark' : ''}`}>
                {paramDesc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfoModal
