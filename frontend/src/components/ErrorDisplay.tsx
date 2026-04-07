import { ReactNode } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ErrorDisplayProps {
  code: string | number
  title: string
  message: string
  image?: string
  actionButtons?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary' | 'danger'
  }>
  children?: ReactNode
}

export default function ErrorDisplay({
  code,
  title,
  message,
  image = '/images/monaError.avif',
  actionButtons,
  children
}: ErrorDisplayProps) {
  const navigate = useNavigate()

  // Color mapping for different error codes
  const getColorClass = (errorCode: string | number): string => {
    const code = String(errorCode)
    if (code.startsWith('4')) {
      if (code === '404') return 'yellow'
      if (code === '403') return 'orange'
      return 'blue'
    }
    if (code.startsWith('5')) return 'red'
    return 'purple'
  }

  const colorClass = getColorClass(code)
  const colorMap: Record<string, Record<string, string>> = {
    yellow: {
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-900/20',
      accent: 'from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'
    },
    orange: {
      text: 'text-orange-500',
      border: 'border-orange-500/30',
      bg: 'bg-orange-900/20',
      accent: 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
    },
    red: {
      text: 'text-red-500',
      border: 'border-red-500/30',
      bg: 'bg-red-900/20',
      accent: 'from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
    },
    blue: {
      text: 'text-blue-500',
      border: 'border-blue-500/30',
      bg: 'bg-blue-900/20',
      accent: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
    },
    purple: {
      text: 'text-purple-500',
      border: 'border-purple-500/30',
      bg: 'bg-purple-900/20',
      accent: 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
    }
  }

  const colors = colorMap[colorClass]

  // Default action buttons
  const defaultButtons = [
    {
      label: 'Ir al Inicio',
      action: () => navigate('/'),
      variant: 'primary' as const
    }
  ]

  const buttons = actionButtons || defaultButtons

  const getButtonClassName = (variant: string = 'primary'): string => {
    const baseClass = 'flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition-all duration-300 hover:shadow-lg'
    
    switch (variant) {
      case 'danger':
        return `${baseClass} bg-gradient-to-r ${colors.accent} text-white`
      case 'secondary':
        return `${baseClass} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white`
      case 'primary':
      default:
        return `${baseClass} bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black`
    }
  }

  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex items-center justify-center px-4">
      <div className="moni-panel p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-6">
          <h1 className={`text-8xl md:text-9xl font-bold ${colors.text} mb-2`}>
            {code}
          </h1>
          <div className={`h-1 w-24 mx-auto rounded ${colors.text.replace('text', 'bg')}`}></div>
        </div>

        {/* Error Image */}
        {image && (
          <img
            src={image}
            alt="Error"
            loading="lazy"
            decoding="async"
            className="w-48 md:w-64 mx-auto mb-8 opacity-90"
          />
        )}

        {/* Error Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-lg text-gray-300 mb-8">
          {message}
        </p>

        {/* Additional Content */}
        {children}

        {/* Action Buttons */}
        {buttons && buttons.length > 0 && (
          <div className={`flex flex-col ${buttons.length > 1 ? 'sm:flex-row' : ''} gap-4 justify-center ${children ? 'mt-8' : ''}`}>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className={getButtonClassName(button.variant)}
              >
                <Home size={20} />
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
