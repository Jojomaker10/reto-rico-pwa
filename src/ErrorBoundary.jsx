import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 border border-red-500/50">
            <h1 className="text-3xl font-bold text-red-400 mb-4">⚠️ Error en la aplicación</h1>
            <p className="text-gray-300 mb-4">
              Ha ocurrido un error al cargar la aplicación. Por favor, verifica la consola del navegador para más detalles.
            </p>
            <details className="mb-4">
              <summary className="text-gray-400 cursor-pointer mb-2">Detalles del error</summary>
              <pre className="bg-gray-900 p-4 rounded text-sm text-red-300 overflow-auto">
                {this.state.error?.toString()}
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-money text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

