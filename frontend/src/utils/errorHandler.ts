/**
 * Error Handler Service
 * Gestiona errores HTTP y errores de la aplicación
 */

export type ErrorCode = 400 | 403 | 404 | 500 | 502 | 503 | 'unknown'

export interface AppError {
  code: ErrorCode
  message: string
  details?: unknown
}

export class ErrorHandler {
  /**
   * Mapea códigos HTTP a rutas de error
   */
  static getErrorRoute(code: ErrorCode | number | string): string {
    const codeNum = parseInt(String(code), 10)
    
    switch (codeNum) {
      case 403:
        return '/error/403'
      case 404:
        return '/error/404'
      case 500:
      case 502:
      case 503:
        return '/error/500'
      default:
        return '/error/404'
    }
  }

  /**
   * Extrae el código de error de una respuesta de error
   */
  static extractErrorCode(error: unknown): ErrorCode {
    if (error && typeof error === 'object') {
      const errorObj = error as any
      
      // Manejo de errores Axios
      if (errorObj.response?.status) {
        return this.normalizeErrorCode(errorObj.response.status)
      }
      
      // Manejo de errores de la aplicación
      if (errorObj.code) {
        return this.normalizeErrorCode(errorObj.code)
      }
      
      // Manejo de errores genéricos
      if (errorObj.statusCode) {
        return this.normalizeErrorCode(errorObj.statusCode)
      }
    }
    
    return 'unknown'
  }

  /**
   * Normaliza un código de error
   */
  private static normalizeErrorCode(code: unknown): ErrorCode {
    const validCodes: ErrorCode[] = [400, 403, 404, 500, 502, 503, 'unknown']
    
    if (validCodes.includes(code as ErrorCode)) {
      return code as ErrorCode
    }
    
    return 'unknown'
  }

  /**
   * Obtiene un mensaje amigable para el usuario basado en el código de error
   */
  static getErrorMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
      400: 'Solicitud inválida. Por favor, intenta de nuevo.',
      403: 'No tienes permiso para acceder a este recurso.',
      404: 'El recurso que buscas no fue encontrado.',
      500: 'Error en el servidor. Por favor, intenta más tarde.',
      502: 'Servicio temporalmente no disponible.',
      503: 'Servicio en mantenimiento. Por favor, intenta más tarde.',
      unknown: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }
    
    return messages[code]
  }

  /**
   * Verifica si un error es recoverable
   */
  static isRecoverable(error: unknown): boolean {
    if (error && typeof error === 'object') {
      const errorObj = error as any
      const code = this.extractErrorCode(errorObj)
      
      // Los errores 4xx generalmente no son recuperables
      // Los errores 5xx pueden ser recuperables
      return ![400, 403, 404].includes(code as unknown as number)
    }
    
    return true
  }

  /**
   * Maneja un error y retorna información formateada
   */
  static handle(error: unknown): AppError {
    const code = this.extractErrorCode(error)
    const message = this.getErrorMessage(code)
    
    return {
      code,
      message,
      details: error
    }
  }

  /**
   * Log error para debugging
   */
  static log(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Error${context ? ` - ${context}` : ''}]`,
        error
      )
    }
  }
}

/**
 * Hook para manejar errores en componentes React
 * Uso:
 * const { handleError, error, clearError } = useErrorHandler()
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<AppError | null>(null)

  const handleError = (err: unknown, context?: string) => {
    ErrorHandler.log(err, context)
    setError(ErrorHandler.handle(err))
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
}

// Re-export React para el hook
import React from 'react'
