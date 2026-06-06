import * as React from "react";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-xl border bg-white dark:bg-gray-800/60 px-3.5 py-2 text-sm",
            "text-gray-900 dark:text-gray-100",
            "focus-visible:outline-none focus-visible:ring-2 transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-rose-400 dark:border-rose-600 focus-visible:ring-rose-400/30"
              : "border-gray-200 dark:border-gray-700 focus-visible:ring-primary-500/30 focus-visible:border-primary-400",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
Select.displayName = "Select";

export { Select };
