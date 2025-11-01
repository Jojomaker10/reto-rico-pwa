import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStoreSupabase'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, init, isLoading } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      await init()
      setInitialized(true)
    }
    initialize()
  }, [init])

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-money border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

