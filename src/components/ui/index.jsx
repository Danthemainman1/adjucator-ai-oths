import React from 'react'
import { cn } from '../../utils/helpers'

// Button Component
export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

// Card Component
export const Card = React.forwardRef(({
  className,
  hover = false,
  glow = false,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl',
        'transition-all duration-300',
        hover && 'hover:border-slate-700/50 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer',
        glow && 'shadow-lg shadow-cyan-500/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = ({ title, icon, action, className }) => {
  return (
    <div className={cn(
      'flex items-center justify-between pb-4 border-b border-slate-800/50',
      className
    )}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-slate-800/50">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {action}
    </div>
  )
}

// Input Component
export const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  label,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full bg-slate-800/50 border text-white px-4 py-3 rounded-xl',
          'outline-none transition-all duration-200',
          'placeholder:text-slate-500',
          'focus:ring-2 focus:ring-offset-0',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea Component
export const Textarea = React.forwardRef(({
  className,
  error,
  label,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-slate-800/50 border text-white px-4 py-3 rounded-xl',
          'outline-none transition-all duration-200 resize-none',
          'placeholder:text-slate-500',
          'focus:ring-2 focus:ring-offset-0',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select Component
export const Select = React.forwardRef(({
  className,
  options = [],
  label,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 px-4 py-3 rounded-xl',
            'outline-none appearance-none cursor-pointer',
            'transition-all duration-200',
            'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={typeof option === 'string' ? option : option.value} 
              value={typeof option === 'string' ? option : option.value}
            >
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
})

Select.displayName = 'Select'

// Badge Component
export const Badge = ({ className, variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    secondary: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Progress Bar Component
export const Progress = ({ value = 0, max = 100, className, showLabel = false, color = 'cyan' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const colors = {
    cyan: 'from-cyan-500 to-cyan-400',
    purple: 'from-purple-500 to-purple-400',
    emerald: 'from-emerald-500 to-emerald-400',
    amber: 'from-amber-500 to-amber-400',
    red: 'from-red-500 to-red-400',
    gradient: 'from-cyan-500 via-purple-500 to-pink-500'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-slate-400 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

// Skeleton Loader
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-slate-800/50 rounded animate-pulse',
        className
      )}
      {...props}
    />
  )
}

// Tooltip Component
export const Tooltip = ({ children, content, side = 'top' }) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          'absolute z-50 px-3 py-2 text-sm whitespace-nowrap',
          'bg-slate-900 border border-slate-700 rounded-lg shadow-xl',
          'invisible opacity-0 group-hover:visible group-hover:opacity-100',
          'transition-all duration-200',
          positions[side]
        )}
      >
        {content}
      </div>
    </div>
  )
}

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={cn(
          'relative w-full bg-slate-900/95 backdrop-blur-xl',
          'border border-slate-700/50 rounded-2xl shadow-2xl',
          'animate-slide-up',
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Tabs Component
export const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex gap-1 p-1 bg-slate-800/50 rounded-xl', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === tab.id
              ? 'bg-slate-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-400 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}
