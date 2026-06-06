import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border bg-white dark:bg-gray-800/60 px-3.5 py-2 text-sm",
            "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2 transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-rose-400 dark:border-rose-600 focus-visible:ring-rose-400/30"
              : "border-gray-200 dark:border-gray-700 focus-visible:ring-primary-500/30 focus-visible:border-primary-400 dark:focus-visible:border-primary-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
