'use client'

import { useState } from 'react'
import { KeyRound, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ShieldAlert, User } from 'lucide-react'
import { updateAdminCredentials } from '@/app/actions/settings' 

export default function ChangeCredentialsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const formData = new FormData(e.currentTarget)
    const currentUsername = formData.get('currentUsername') as string
    const currentPassword = formData.get('currentPassword') as string
    const newUsername = formData.get('newUsername') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Naya password aur confirm password match nahi ho rahe.', type: 'error' })
      setLoading(false)
      return
    }

    // Backend Action Call (Username aur Password dono bhej rahe hain)
    const res = await updateAdminCredentials(currentUsername, currentPassword, newUsername, newPassword)
    
    if (res.success) {
      setMessage({ text: res.message, type: 'success' })
      e.currentTarget.reset() // Form clear kar dega
    } else {
      setMessage({ text: res.message, type: 'error' })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f3f6f8] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mb-4 border border-gray-100">
            <KeyRound className="w-8 h-8 text-yellow-500" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight font-heading">
            Security Settings
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Kishan Galla Bhandar • Owner Authorization
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-[#0A192F] px-8 py-5 flex items-center gap-3">
            <ShieldAlert className="text-yellow-500 w-5 h-5" />
            <p className="text-white text-sm font-semibold tracking-wide">Update Your Admin Credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* PURANI DETAILS SECTION */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    name="currentUsername"
                    placeholder="Enter current username (e.g. sachin)"
                    required
                    className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    required
                    className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-6"></div>

            {/* NAYI DETAILS SECTION */}
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider ml-1">New Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#0A192F] transition-colors" />
                  <input
                    type="text"
                    name="newUsername"
                    placeholder="Enter new username"
                    required
                    className="w-full bg-white text-gray-800 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 focus:border-[#0A192F] transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#0A192F] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                    className="w-full bg-white text-gray-800 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 focus:border-[#0A192F] transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-[#0A192F] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter new password"
                    required
                    className="w-full bg-white text-gray-800 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0A192F]/20 focus:border-[#0A192F] transition-all shadow-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-gray-500 hover:text-[#0A192F] flex items-center gap-2 transition-colors font-semibold"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
            </div>

            {/* Status Message */}
            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-center text-center transition-all animate-in zoom-in duration-300 ${
                message.type === 'error' 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#0A192F] hover:bg-[#112240] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                'UPDATING SECURITY...'
              ) : (
                <>
                  CONFIRM & UPDATE <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8 font-medium">
          Note: You will need to log in again with your new credentials after updating.
        </p>
      </div>
    </div>
  )
}