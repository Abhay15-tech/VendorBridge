import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useTheme } from '@/contexts/ThemeContext';
import {
  User, Bell, Shield, Palette, Globe, Building2,
  Mail, Phone, MapPin, Save, Camera, Sun, Moon, Monitor,
  Check, ChevronRight, Lock, Key, LogOut, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',           icon: User },
  { id: 'organization',  label: 'Organization',      icon: Building2 },
  { id: 'notifications', label: 'Notifications',     icon: Bell },
  { id: 'appearance',    label: 'Appearance',        icon: Palette },
  { id: 'security',      label: 'Security',          icon: Shield },
  { id: 'regional',      label: 'Regional & Locale', icon: Globe },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none',
        enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      )}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
        enabled ? 'translate-x-4' : 'translate-x-0.5'
      )} />
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-gray-800/70 last:border-0">
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: 'Admin', lastName: 'User',
    email: 'admin@vendorbridge.com', phone: '+1 (555) 100-2000',
    jobTitle: 'Procurement Manager', department: 'Operations',
  });

  // Organization state
  const [orgForm, setOrgForm] = useState({
    companyName: 'VendorBridge Corp', industry: 'Technology',
    taxId: 'TX-9900-4421', address: '123 Enterprise Blvd, San Francisco, CA',
    website: 'https://vendorbridge.com',
  });

  // Notifications state
  const [notifs, setNotifs] = useState({
    rfqPublished: true, newQuotation: true, poApproved: true,
    invoiceOverdue: true, vendorOnboarded: false, weeklyDigest: true,
    emailNotifs: true, inAppNotifs: true, smsNotifs: false,
  });

  // Security state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  // Regional state
  const [regional, setRegional] = useState({
    currency: 'USD', timezone: 'America/New_York', dateFormat: 'MM/DD/YYYY', language: 'English',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const section = activeSection;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account, organization, and platform preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-2 space-y-0.5">
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary-600 dark:text-primary-400' : '')} />
                  {sec.label}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
                </button>
              );
            })}

            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-150"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── Profile ──────────────────────────────────────────────── */}
          {section === 'profile' && (
            <>
              <SectionCard title="Your Profile" description="Update your personal information and photo.">
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                      AD
                    </div>
                    <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Admin User</p>
                    <p className="text-sm text-gray-500 mt-0.5">Administrator · Operations</p>
                    <button className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1.5 hover:underline">Change photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', key: 'firstName', placeholder: 'Jane' },
                    { label: 'Last Name', key: 'lastName', placeholder: 'Doe' },
                    { label: 'Email Address', key: 'email', placeholder: 'you@company.com' },
                    { label: 'Phone Number', key: 'phone', placeholder: '+1 (555) 000-0000' },
                    { label: 'Job Title', key: 'jobTitle', placeholder: 'Procurement Manager' },
                    { label: 'Department', key: 'department', placeholder: 'Operations' },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</label>
                      <Input
                        placeholder={f.placeholder}
                        value={(profileForm as any)[f.key]}
                        onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Profile</>}
                </Button>
              </div>
            </>
          )}

          {/* ── Organization ─────────────────────────────────────────── */}
          {section === 'organization' && (
            <>
              <SectionCard title="Organization Details" description="Information about your company used across the platform.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Company Name', key: 'companyName', icon: Building2 },
                    { label: 'Industry', key: 'industry', icon: Globe },
                    { label: 'Tax / VAT ID', key: 'taxId', icon: Key },
                    { label: 'Website', key: 'website', icon: Globe },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</label>
                      <Input
                        value={(orgForm as any)[f.key]}
                        onChange={e => setOrgForm(o => ({ ...o, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Office Address</label>
                    <Input
                      value={orgForm.address}
                      onChange={e => setOrgForm(o => ({ ...o, address: e.target.value }))}
                    />
                  </div>
                </div>
              </SectionCard>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Organization</>}
                </Button>
              </div>
            </>
          )}

          {/* ── Notifications ────────────────────────────────────────── */}
          {section === 'notifications' && (
            <SectionCard title="Notification Preferences" description="Choose when and how you receive alerts.">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Channels</p>
              {[
                { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive alerts at admin@vendorbridge.com' },
                { key: 'inAppNotifs', label: 'In-App Notifications', desc: 'Show the notification bell badge' },
                { key: 'smsNotifs', label: 'SMS Alerts', desc: 'Send critical alerts via SMS to +1 (555) 100-2000' },
              ].map(n => (
                <SettingRow key={n.key} label={n.label} description={n.desc}>
                  <Toggle enabled={(notifs as any)[n.key]} onChange={v => setNotifs(s => ({ ...s, [n.key]: v }))} />
                </SettingRow>
              ))}

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-3">Event Triggers</p>
              {[
                { key: 'rfqPublished', label: 'RFQ Published', desc: 'When a new RFQ goes live' },
                { key: 'newQuotation', label: 'New Quotation Received', desc: 'When a vendor submits a bid' },
                { key: 'poApproved', label: 'Purchase Order Approved', desc: 'When a PO is approved by a manager' },
                { key: 'invoiceOverdue', label: 'Invoice Overdue', desc: 'When an invoice passes its due date' },
                { key: 'vendorOnboarded', label: 'Vendor Onboarded', desc: 'When a new vendor is verified' },
                { key: 'weeklyDigest', label: 'Weekly Summary Digest', desc: 'Every Monday at 08:00 AM' },
              ].map(n => (
                <SettingRow key={n.key} label={n.label} description={n.desc}>
                  <Toggle enabled={(notifs as any)[n.key]} onChange={v => setNotifs(s => ({ ...s, [n.key]: v }))} />
                </SettingRow>
              ))}
            </SectionCard>
          )}

          {/* ── Appearance ───────────────────────────────────────────── */}
          {section === 'appearance' && (
            <SectionCard title="Appearance" description="Customize how VendorBridge looks for you.">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme Mode</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { value: 'light',  label: 'Light',  icon: Sun,     preview: 'bg-white border-gray-200' },
                  { value: 'dark',   label: 'Dark',   icon: Moon,    preview: 'bg-gray-900 border-gray-700' },
                  { value: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400' },
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value as any)}
                      className={cn(
                        'relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-150',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 h-5 w-5 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      <div className={`h-10 w-16 rounded-lg border ${opt.preview}`} />
                      <Icon className={cn('h-5 w-5', isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400')} />
                      <span className={cn('text-sm font-semibold', isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400')}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-t border-gray-100 dark:border-gray-800 pt-5">Sidebar</p>
              <SettingRow label="Compact Sidebar by Default" description="Start with the sidebar collapsed on every page load">
                <Toggle enabled={false} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Show Module Labels" description="Display text labels next to navigation icons">
                <Toggle enabled={true} onChange={() => {}} />
              </SettingRow>
            </SectionCard>
          )}

          {/* ── Security ─────────────────────────────────────────────── */}
          {section === 'security' && (
            <>
              <SectionCard title="Change Password" description="Use a strong password you don't use elsewhere.">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                    <Input type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                    <Input type="password" placeholder="Min. 8 characters" value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <Input type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                  <Button className="gap-2 mt-2">
                    <Lock className="h-4 w-4" /> Update Password
                  </Button>
                </div>
              </SectionCard>

              <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                <SettingRow label="Authenticator App (TOTP)" description="Use Google Authenticator or Authy">
                  <Button variant="outline" size="sm">Enable</Button>
                </SettingRow>
                <SettingRow label="SMS Verification" description="Receive a code via SMS on every login">
                  <Toggle enabled={false} onChange={() => {}} />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Active Sessions" description="Devices currently signed in to your account.">
                {[
                  { device: 'Chrome on macOS', location: 'San Francisco, CA', time: 'Active now', current: true },
                  { device: 'Safari on iPhone 15', location: 'San Jose, CA', time: '2 hours ago', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 dark:border-gray-800/70 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.device}</p>
                        {s.current && <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Revoke</Button>}
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Danger Zone" description="Irreversible actions for your account.">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and all associated data.</p>
                  </div>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </SectionCard>
            </>
          )}

          {/* ── Regional ─────────────────────────────────────────────── */}
          {section === 'regional' && (
            <>
              <SectionCard title="Regional & Locale" description="Configure currency, timezone, and date display format.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Currency', key: 'currency', options: ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY'] },
                    { label: 'Language', key: 'language', options: ['English', 'French', 'Arabic', 'German', 'Spanish'] },
                    { label: 'Date Format', key: 'dateFormat', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
                    { label: 'Time Zone', key: 'timezone', options: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Dubai'] },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</label>
                      <select
                        value={(regional as any)[f.key]}
                        onChange={e => setRegional(r => ({ ...r, [f.key]: e.target.value }))}
                        className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-3.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                      >
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Preferences</>}
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
