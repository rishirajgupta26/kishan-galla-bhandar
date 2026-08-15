'use client'

import { useState } from 'react'
import { Eye, EyeOff, User, Lock, HardHat } from 'lucide-react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Backend se check karwa rahe hain
    const res = await loginAction(username, password)
    
    if (!res.success) {
      setError(res.message)
      setLoading(false)
    } else {
      window.location.href = '/admin/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-6 flex flex-col items-center">
         <div className="p-3 border border-yellow-500 rounded-xl mb-3">
           <HardHat className="text-yellow-500 w-8 h-8" />
         </div>
         <h1 className="text-white text-2xl font-bold tracking-wider">OWNER LOGIN</h1>
         <p className="text-yellow-500 text-sm font-semibold tracking-widest mt-1">KISHAN GALLA BHANDAR</p>
      </div>

      {/* Login Card */}
      <div className="bg-[#112240] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2">USERNAME</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                required
                className="w-full bg-[#0A192F] text-white border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Password Input with 👁️ Eye Button */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full bg-[#0A192F] text-white border border-gray-700 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:border-yellow-500"
              />
              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            {loading ? 'CHECKING...' : 'SECURE LOGIN →'}
          </button>
        </form>
      </div>
      <p className="text-gray-500 text-xs mt-6">For authorised personnel only.</p>
    </div>
  )
}