import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check, Upload, Users, TrendingUp, Bitcoin, Gift } from 'lucide-react'

const ConfirmInvestmentModal = ({ pack, onConfirm, onClose }) => {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileName, setFileName] = useState('')

  const getPackInfo = () => {
    switch (pack.type) {
      case 'inicio':
        return {
          name: 'Pack Inicio',
          icon: Users,
          gradient: 'from-blue-500 to-cyan-500',
          amount: 0,
          description: 'Invita 10 amigos y gana 10,000 CLP',
          features: ['Sin inversión', '100% gratuito', 'Gana al completar objetivo']
        }
      case 'trading':
        return {
          name: 'Pack Trading',
          icon: TrendingUp,
          gradient: 'from-green-money to-emerald-600',
          amount: pack.amount,
          description: '10% de retorno semanal',
          features: ['Retornos semanales', 'Dashboard en tiempo real', 'Soporte 24/7']
        }
      case 'crypto':
        return {
          name: 'Pack Crypto',
          icon: Bitcoin,
          gradient: 'from-purple-500 to-pink-500',
          amount: pack.amount,
          description: 'Multiplica x3 en 2 meses',
          features: ['Retorno garantizado', 'Plazo fijo', 'Máxima seguridad']
        }
      case 'misterio':
        return {
          name: 'Pack Misterio',
          icon: Gift,
          gradient: 'from-yellow-500 to-orange-500',
          amount: pack.amount,
          description: 'Multiplica x3 en 3 meses',
          features: ['Retorno garantizado', 'Pack exclusivo', 'Máxima seguridad']
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

  const handleConfirm = () => {
    const paymentData = {
      paymentMethod: pack.amount > 0 ? 'USDT' : 'gratis',
      proofUploaded: !!uploadedFile,
      fileName: uploadedFile ? fileName : null
    }
    onConfirm(paymentData)
  }

  const packInfo = getPackInfo()
  if (!packInfo) return null

  const Icon = packInfo.icon

  // Depósitos únicamente en USDT (TRC20)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">Confirmar Inversión</h2>
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
                  <span className="text-gray-400">Monto a depositar:</span>
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

          {/* Payment Method */}
            {pack.amount > 0 && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="font-semibold text-emerald-400 mb-2">Depósito en USDT (TRC20)</p>
                <p className="text-sm text-gray-300 mb-4">Los depósitos se realizan exclusivamente en USDT. Genera tu dirección y escanea el QR en la sección de Depósitos.</p>
                <button onClick={() => navigate('/deposit')} className="btn-primary">Ir a Depositar (USDT)</button>
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
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-money/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Inversión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmInvestmentModal

