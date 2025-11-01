import { useState } from 'react'
import { X, Check, Upload, Users, TrendingUp, Bitcoin, Banknote, FileText } from 'lucide-react'

const ConfirmInvestmentModal = ({ pack, onConfirm, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [bankInfoVisible, setBankInfoVisible] = useState(true)
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
      paymentMethod,
      proofUploaded: !!uploadedFile,
      fileName: uploadedFile ? fileName : null
    }
    onConfirm(paymentData)
  }

  const packInfo = getPackInfo()
  if (!packInfo) return null

  const Icon = packInfo.icon

  // Bank account info
  const bankDetails = {
    name: 'Banco Estado',
    accountNumber: '1234567890',
    accountType: 'Cuenta Corriente',
    rut: '77.777.777-7',
    email: 'pagos@reto-rico.com'
  }

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
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Método de Pago
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'transfer'
                        ? 'border-green-money bg-green-money/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'transfer' ? 'text-green-money' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className="font-semibold">Transferencia Bancaria</p>
                      <p className="text-sm text-gray-400">Datos de la empresa</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bank Details */}
              {paymentMethod === 'transfer' && (
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-400">Datos Bancarios</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Banco:</span>
                      <span className="text-gray-200 font-medium">{bankDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">N° Cuenta:</span>
                      <span className="text-gray-200 font-medium font-mono">{bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-gray-200 font-medium">{bankDetails.accountType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">RUT:</span>
                      <span className="text-gray-200 font-medium font-mono">{bankDetails.rut}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-gray-200 font-medium">{bankDetails.email}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-blue-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400 font-semibold">Monto:</span>
                        <span className="text-xl font-black text-blue-400">
                          ${pack.amount.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const bankInfo = `Banco: ${bankDetails.name}\nN° Cuenta: ${bankDetails.accountNumber}\nTipo: ${bankDetails.accountType}\nRUT: ${bankDetails.rut}\nMonto: $${pack.amount.toLocaleString('es-CL')} CLP`
                      navigator.clipboard.writeText(bankInfo)
                      alert('Información bancaria copiada')
                    }}
                    className="mt-4 w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    Copiar información bancaria
                  </button>
                </div>
              )}

              {/* Upload Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Subir Comprobante de Pago
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-green-money transition-colors">
                  <input
                    type="file"
                    id="proofUpload"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label htmlFor="proofUpload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="text-center">
                        <Check className="w-12 h-12 text-green-money mx-auto mb-2" />
                        <p className="font-semibold text-green-money">{fileName}</p>
                        <p className="text-sm text-gray-400 mt-1">Archivo cargado</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="font-semibold mb-1">Haz clic para subir</p>
                        <p className="text-sm text-gray-500">PDF, JPG o PNG (máx. 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </>
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
              disabled={pack.amount > 0 && !uploadedFile}
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

