import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStoreSupabase'

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, init, isLoading } = useAuthStore()
  const [initialized, setInitialized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      await init()
      setInitialized(true)
      
      // Verificar si el usuario es admin
      // En Supabase, puedes tener un campo 'role' en profiles o verificar por email
      if (user) {
        // Opción 1: Verificar por campo role
        const admin = user.role === 'admin' || user.is_admin === true
        
        // Opción 2: Verificar por email (si tienes una lista de emails admin)
        // const adminEmails = ['admin@reto-rico.com']
        // const admin = adminEmails.includes(user.email?.toLowerCase())
        
        setIsAdmin(admin)
      }
    }
    initialize()
  }, [init, user])

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
          <p className="text-gray-300 mb-6">
            No tienes permisos para acceder a esta sección. Solo los administradores pueden ver este contenido.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    )
  }

  return children
}

export default AdminProtectedRoute

