import React from 'react';
import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-950 flex overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-surface-900 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-10%] right-[-10%] h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-5%] h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute top-[40%] left-[30%] h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">VendorBridge</span>
        </div>

        {/* Central content */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400"></span>
            Enterprise Procurement Platform
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
            Smarter<br />Procurement,<br />
            <span className="text-accent-300">Faster Decisions.</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Manage vendors, automate RFQs, compare bids and generate purchase orders — all in one powerful platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '1,200+', label: 'Vendors' },
              { value: '$12M+', label: 'Managed Spend' },
              { value: '99.9%', label: 'Uptime' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative text-white/40 text-xs">
          © 2025 VendorBridge Inc. · Trusted by 500+ enterprises
        </div>
      </div>

      {/* Right auth form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-white dark:bg-surface-900 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">VendorBridge</span>
        </div>

        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
