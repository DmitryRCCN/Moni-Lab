import React, { ReactNode } from 'react'
import { Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Aquí puedes hacer logging del error
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="animate-in fade-in duration-700 min-h-screen flex items-center justify-center px-4">
          <div className="moni-panel p-8 md:p-12 max-w-2xl w-full text-center">
            {/* Error Code */}
            <div className="mb-6">
              <h1 className="text-8xl md:text-9xl font-bold text-red-500 mb-2">
                ⚠️
              </h1>
              <div className="h-1 w-24 bg-red-500 mx-auto rounded"></div>
            </div>

            {/* Error Image */}
            <img
              src="/images/monaError.avif"
              alt="Error"
              loading="lazy"
              decoding="async"
              className="w-48 md:w-64 mx-auto mb-8 opacity-90 saturate-150"
            />

            {/* Error Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Algo saliómal!
            </h2>

            <p className="text-lg text-gray-300 mb-8">
              Parece que hubo un error inesperado en la aplicación. 
              Estamos trabajando para solucionarlo.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8 text-left">
                <p className="text-red-300 text-xs font-mono break-words">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <RefreshCw size={20} />
                Reintentar
              </button>

              <button
                onClick={this.handleRefresh}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <RefreshCw size={20} />
                Recargar Página
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <Home size={20} />
                Ir al Inicio
              </a>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 mt-8">
              Si el problema persiste, intenta limpiar tu caché o contacta con soporte.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
