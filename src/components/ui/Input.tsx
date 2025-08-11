import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', type, rows, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;
    const isTextarea = type === 'textarea';

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          {isTextarea ? (
            <textarea
              ref={ref as any}
              rows={rows || 3}
              className={`
                w-full px-4 py-3 ${icon ? 'pl-10' : ''}
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                outline-none transition-colors resize-none
                ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                ${className}
              `}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref}
              type={inputType}
              className={`
                w-full px-4 py-3 ${icon ? 'pl-10' : ''} ${type === 'password' ? 'pr-10' : ''}
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                outline-none transition-colors
                ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                ${className}
              `}
              {...props}
            />
          )}
          
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);