import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import secureStorage from '../utils/storage'
import useTranslation from '../hooks/useTranslation'

const InstallPrompt = () => {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  const checkIfShouldShowPrompt = async () => {
    try {
      // Verificar si ya está instalada
      if (isInstalled) {
        return
      }

      // Verificar si el usuario ya rechazó el prompt
      const dismissed = await secureStorage.getItem('pwa-prompt-dismissed')
      const dismissedTime = dismissed ? new Date(dismissed).getTime() : null
      const now = new Date().getTime()
      
      // Si fue rechazado hace menos de 7 días, no mostrar
      if (dismissedTime && (now - dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
        return
      }

      // Esperar un poco antes de mostrar (después del refresh)
      setTimeout(() => {
        setShowPrompt(true)
      }, 1500) // 1.5 segundos después del refresh
    } catch (error) {
      console.error('Error checking prompt:', error)
    }
  }

  useEffect(() => {
    // Detectar si es un refresh (no primera carga)
    const isRefresh = sessionStorage.getItem('page-loaded') === 'true'
    
    if (!isRefresh) {
      // Primera carga - marcar como cargada
      sessionStorage.setItem('page-loaded', 'true')
      return // No mostrar prompt en primera carga
    }

    // Verificar si la app ya está instalada
    const checkIfInstalled = async () => {
      // Para iOS
      if (window.navigator.standalone) {
        setIsInstalled(true)
        return
      }

      // Para Android/Chrome - verificar si está en modo standalone
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }

      // Verificar si está en la pantalla de inicio
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setIsInstalled(true)
        return
      }

      // Verificar en storage si ya está instalada
      try {
        const installed = await secureStorage.getItem('pwa-installed')
        if (installed) {
          setIsInstalled(true)
          return
        }
      } catch (error) {
        console.error('Error checking installation:', error)
      }
    }

    checkIfInstalled()

    // Escuchar el evento beforeinstallprompt (Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Verificar si el usuario ya rechazó el prompt antes
      checkIfShouldShowPrompt()
    }

    // Escuchar cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      secureStorage.setItem('pwa-installed', true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Para iOS, mostrar instrucciones personalizadas
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = window.navigator.standalone

    if (isIOS && !isInStandaloneMode) {
      checkIfShouldShowPrompt()
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Mostrar el prompt de instalación nativo
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        await secureStorage.setItem('pwa-installed', true)
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } else {
      // Para iOS, mostrar instrucciones
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        alert(
          'Para instalar la app:\n\n' +
          '1. Toca el botón de compartir (cuadro con flecha)\n' +
          '2. Selecciona "Agregar a pantalla de inicio"\n' +
          '3. Toca "Agregar"'
        )
      }
    }
  }

  const handleDismiss = async () => {
    setShowPrompt(false)
    // Guardar que el usuario rechazó el prompt
    await secureStorage.setItem('pwa-prompt-dismissed', new Date().toISOString())
  }

  if (!showPrompt || isInstalled) {
    return null
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-6 pt-12">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-money to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              {isIOS ? 'Instala Reto-Rico' : 'Instala la App'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isIOS
                ? 'Agrega Reto-Rico a tu pantalla de inicio para acceso rápido y mejor experiencia'
                : 'Instala Reto-Rico en tu dispositivo para acceso rápido y mejor experiencia'}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-money rounded-full"></div>
              <span>Acceso rápido sin abrir el navegador</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-money rounded-full"></div>
              <span>Funciona sin conexión</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-money rounded-full"></div>
              <span>Notificaciones en tiempo real</span>
            </div>
          </div>

          {/* Install Button */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-colors"
            >
              Ahora No
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-money to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-money/50 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {isIOS ? 'Mostrar Instrucciones' : 'Instalar'}
            </button>
          </div>

          {isIOS && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Después de instalar, podrás abrir Reto-Rico desde tu pantalla de inicio
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt

