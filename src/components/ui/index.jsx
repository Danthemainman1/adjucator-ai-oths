import React from 'react'
import { cn } from '../../utils/helpers'

// Button Component - Sophisticated / Authoritative
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
    primary: 'bg-midnight-navy text-bone hover:bg-petrol-blue active:bg-anthracite shadow-[0_2px_4px_rgba(10,17,40,0.15)] border border-transparent',
    secondary: 'bg-white text-midnight-navy border border-greige hover:border-taupe hover:bg-bone active:bg-greige',
    ghost: 'bg-transparent text-taupe hover:text-midnight-navy hover:bg-greige/30',
    danger: 'bg-oxblood text-white border border-transparent hover:bg-red-950 shadow-sm',
    success: 'bg-verdigris text-white border border-transparent hover:bg-emerald-700 shadow-sm',
    accent: 'bg-ochre text-midnight-navy hover:bg-amber-500 font-bold'
  }

  const sizes = {
    sm: 'px-4 py-2 text-[10px] tracking-[0.1em]',
    md: 'px-6 py-3 text-xs tracking-[0.12em]',
    lg: 'px-8 py-4 text-xs tracking-[0.15em]',
    xl: 'px-10 py-5 text-sm tracking-[0.15em]'
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-3 font-bold uppercase rounded-[2px] transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-taupe',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:saturate-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

// Card Component - Atelier Style
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
        'bg-white border border-greige rounded-[2px] shadow-clean',
        'transition-all duration-500 ease-out',
        hover && 'hover:border-taupe hover:shadow-float cursor-pointer hover:-translate-y-[2px]',
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
      'flex items-center justify-between pb-5 border-b border-greige/50 mb-6',
      className
    )}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-2.5 rounded-sm bg-bone text-midnight-navy border border-greige">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-serif font-bold text-midnight-navy tracking-tight">{title}</h3>
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
    <div className="w-full group">
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-taupe mb-2 group-focus-within:text-midnight-navy transition-colors">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full bg-white border border-greige text-anthracite px-4 py-3 rounded-[2px]',
          'outline-none transition-all duration-300',
          'placeholder:text-stone-300',
          'focus:border-slate-blue focus:ring-0 focus:bg-bone',
          error 
            ? 'border-oxblood/40 focus:border-oxblood bg-red-50/10' 
            : 'hover:border-taupe',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-oxblood font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-oxblood"></span>
          {error}
        </p>
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
    <div className="w-full group">
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-taupe mb-2 group-focus-within:text-midnight-navy transition-colors">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-white border border-greige text-anthracite px-4 py-3 rounded-[2px]',
          'outline-none transition-all duration-300 resize-y min-h-[100px]',
          'placeholder:text-stone-300',
          'focus:border-slate-blue focus:ring-0 focus:bg-bone',
          error 
            ? 'border-oxblood/40 focus:border-oxblood bg-red-50/10' 
            : 'hover:border-taupe',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-oxblood font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-oxblood"></span>
          {error}
        </p>
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
    <div className="w-full group">
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-taupe mb-2 group-focus-within:text-midnight-navy transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full bg-white border border-greige text-anthracite px-4 py-3 rounded-[2px]',
            'outline-none appearance-none cursor-pointer',
            'transition-all duration-300',
            'focus:border-slate-blue focus:ring-0 focus:bg-bone',
            'hover:border-taupe',
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
          <svg className="w-4 h-4 text-taupe group-hover:text-midnight-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
})

Select.displayName = 'Select'

// Badge Component - Fine Labels
export const Badge = ({ className, variant = 'primary', children, ...props }) => {
  const variants = {
    primary: 'bg-midnight-navy text-bone border-transparent',
    secondary: 'bg-bone text-taupe border-greige',
    success: 'bg-sage/20 text-verdigris border-sage/30',
    warning: 'bg-champagne text-ochre border-ochre/20',
    danger: 'bg-red-50 text-oxblood border-red-100',
    purple: 'bg-mauve-taupe/10 text-mauve-taupe border-mauve-taupe/20'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] rounded-[1px] border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Progress Bar Component - Clean and thin
export const Progress = ({ value = 0, max = 100, className, showLabel = false, color = 'primary' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const colors = {
    primary: 'bg-primary',
    cyan: 'bg-cyan-600', // Keeping for legacy support if needed
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600',
    gradient: 'bg-primary'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="h-1.5 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            colors[color] || colors.primary
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-ink-light text-right font-mono">
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
        'bg-gray-100 rounded-sm animate-pulse',
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
          'absolute z-50 px-3 py-1.5 text-xs font-medium whitespace-nowrap',
          'bg-gray-900 text-white rounded-sm shadow-md',
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

// Modal Component - Clean, high contrast
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={cn(
          'relative w-full bg-white',
          'border border-gray-200 rounded-sm shadow-2xl',
          'animate-slide-up',
          sizes[size]
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-ink-black">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-ink-black hover:bg-gray-100 rounded-sm transition-colors"
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

// Tabs Component - Minimalist text tabs
export const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex gap-6 border-b border-gray-200 mb-6', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-1 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-200 border-b-2',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-ink-black hover:border-gray-300'
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
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-sm bg-gray-50/50">
      {Icon && (
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-serif font-semibold text-ink-black mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
