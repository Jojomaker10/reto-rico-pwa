import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check, Upload, Users, TrendingUp, Bitcoin, Gift, Copy } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../store/authStoreSupabase'
import useTranslation from '../hooks/useTranslation'

const ConfirmInvestmentModal = ({ pack, onConfirm, onClose }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [txHash, setTxHash] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [addressError, setAddressError] = useState('')

  // Cargar dirección de depósito cuando el pack requiere pago
  useEffect(() => {
    const loadDepositAddress = async () => {
      if (pack.amount > 0 && user?.id) {
        setLoadingAddress(true)
        setAddressError('')
        try {
          const { data } = await api.post('/deposits/request', null, {
            headers: { 'x-user-id': user.id }
          })
          setDepositAddress(data.address)
        } catch (error) {
          console.error('Error loading deposit address:', error)
          setAddressError('No se pudo cargar la dirección de depósito. Intenta más tarde.')
        } finally {
          setLoadingAddress(false)
        }
      }
    }

    loadDepositAddress()
  }, [pack.amount, user?.id])

  const getPackInfo = () => {
    switch (pack.type) {
      case 'inicio':
        return {
          name: t('packs.inicio.name'),
          icon: Users,
          gradient: 'from-blue-500 to-cyan-500',
          amount: 0,
          description: t('packs.inicio.description'),
          features: ['Sin inversión', '100% gratuito', 'Gana al completar objetivo'] // TODO: Translate features
        }
      case 'trading':
        return {
          name: t('packs.trading.name'),
          icon: TrendingUp,
          gradient: 'from-green-money to-emerald-600',
          amount: pack.amount,
          description: t('packs.trading.description'),
          features: ['Retornos semanales', 'Dashboard en tiempo real', 'Soporte 24/7'] // TODO: Translate features
        }
      case 'crypto':
        return {
          name: t('packs.crypto.name'),
          icon: Bitcoin,
          gradient: 'from-purple-500 to-pink-500',
          amount: pack.amount,
          description: t('packs.crypto.description'),
          features: ['Retorno garantizado', 'Plazo fijo', 'Máxima seguridad'] // TODO: Translate features
        }
      case 'misterio':
        return {
          name: t('packs.misterio.name'),
          icon: Gift,
          gradient: 'from-yellow-500 to-orange-500',
          amount: pack.amount,
          description: t('packs.misterio.description'),
          features: ['Retorno garantizado', 'Pack exclusivo', 'Máxima seguridad'] // TODO: Translate features
        }
      default:
        return null
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      setFileName(file.name)
    }
  }

  const handleCopyAddress = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress)
      alert(t('packs.confirm.copyAddress'))
    }
  }

  const handleConfirm = () => {
    // Validar que el hash esté ingresado para packs con monto
    if (pack.amount > 0 && !txHash.trim()) {
      alert(t('packs.confirm.enterHashFirst'))
      return
    }

    const paymentData = {
      paymentMethod: pack.amount > 0 ? 'USDT' : 'gratis',
      proofUploaded: !!uploadedFile,
      fileName: uploadedFile ? fileName : null,
      txHash: txHash.trim() || null
    }
    onConfirm(paymentData)
  }

  const packInfo = getPackInfo()
  if (!packInfo) return null

  const Icon = packInfo.icon
  const canConfirm = pack.amount === 0 || (pack.amount > 0 && txHash.trim().length > 0)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">{t('packs.confirm.title')}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pack Summary */}
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${packInfo.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{packInfo.name}</h3>
                <p className="text-gray-400">{packInfo.description}</p>
              </div>
            </div>
            
            {pack.amount > 0 && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">{t('packs.confirm.amount')}:</span>
                  <span className="text-3xl font-black gradient-text">
                    ${pack.amount.toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              {packInfo.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-money" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section - Solo para packs con monto */}
          {pack.amount > 0 && (
            <div className="space-y-4">
              {/* Instrucciones de pago */}
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="font-semibold text-emerald-400 mb-2">⚠️ {t('packs.confirm.instructions')}</p>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>{t('packs.confirm.step1', { amount: pack.amount.toLocaleString('es-CL') })}</li>
                  <li>{t('packs.confirm.step2')}</li>
                  <li>{t('packs.confirm.step3')}</li>
                </ol>
              </div>

              {/* Dirección de depósito */}
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <p className="font-semibold text-gray-300 mb-3">{t('packs.confirm.depositAddress')}:</p>
                {loadingAddress ? (
                  <p className="text-gray-400">{t('packs.confirm.loadingAddress')}</p>
                ) : addressError ? (
                  <p className="text-red-400">{t('packs.confirm.addressError')}</p>
                ) : depositAddress ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <code className="flex-1 text-sm text-gray-300 break-all font-mono">
                        {depositAddress}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
                        title={t('packs.confirm.copyAddress')}
                      >
                        <Copy className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      ⚠️ Solo envía USDT (TRC20) a esta dirección. Otras criptomonedas se perderán.
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400">No se pudo cargar la dirección</p>
                )}
              </div>

              {/* Campo para hash de transacción */}
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <label className="block font-semibold text-gray-300 mb-3">
                  {t('packs.confirm.txHash')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder={t('packs.confirm.txHashPlaceholder')}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-money focus:ring-2 focus:ring-green-money/20"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {t('packs.confirm.txHashHint')}
                </p>
                {txHash.trim() && (
                  <div className="mt-3 p-2 bg-green-money/10 border border-green-money/30 rounded text-sm text-green-money">
                    ✓ Hash ingresado correctamente
                  </div>
                )}
              </div>

              {/* Opción para subir comprobante (opcional) */}
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                <label className="block font-semibold text-gray-300 mb-3">
                  {t('packs.confirm.proof')}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                    <div className="p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-green-money transition-colors text-center">
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-money">
                          <Check className="w-5 h-5" />
                          <span>{fileName}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Upload className="w-6 h-6" />
                          <span>{t('packs.confirm.uploadProof')}</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700 px-6 py-4">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-money/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pack.amount > 0 && !txHash.trim() 
                ? t('packs.confirm.enterHashFirst') 
                : t('packs.confirm.confirmButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmInvestmentModal

