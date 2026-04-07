import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { ErrorHandler, ErrorCode } from './errorHandler'

/**
 * Hook para manejar navegación a páginas de error
 * Uso:
 * const { navigateToError } = useErrorNavigation()
 * navigateToError(404, 'Página no encontrada')
 */
export function useErrorNavigation() {
  const navigate = useNavigate()

  const navigateToError = useCallback((code: ErrorCode | number, customMessage?: string) => {
    const route = ErrorHandler.getErrorRoute(code)
    
    // Guardar los detalles del error en el state para mostrar en la página de error
    navigate(route, {
      state: {
        errorCode: code,
        customMessage
      }
    })
  }, [navigate])

  const handleApiError = useCallback((error: unknown) => {
    const code = ErrorHandler.extractErrorCode(error)
    const route = ErrorHandler.getErrorRoute(code)
    
    navigate(route, {
      state: {
        errorCode: code,
        details: error
      }
    })
  }, [navigate])

  return { navigateToError, handleApiError }
}
