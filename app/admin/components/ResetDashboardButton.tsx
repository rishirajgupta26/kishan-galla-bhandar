'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, X, CheckCircle2 } from 'lucide-react'
import { clearEntireDashboard } from '@/app/admin/actions' 

export default function ResetDashboardButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // YEH FUNCTION AB DIRECT DATABASE CALL KAREGA (KOI WHITE POPUP NAHI AAYEGA)
  const executeDelete = async () => {
    setIsDeleting(true)
    const result = await clearEntireDashboard();
    setIsDeleting(false)
    
    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setIsOpen(false)
      }, 2500) // 2.5 second baad success message apne aap band ho jayega
    } else {
      alert("❌ Error: Delete nahi ho paya.") 
    }
  }

  return (
    <>
      {/* 1. Main Page ka Button */}
      <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-lg md:text-xl">Danger Zone (खतरे का क्षेत्र)</h3>
            </div>
            <p className="mt-2 text-sm text-red-700 font-medium max-w-2xl">
              Yahan se aap pichla saara data (Maal Aaya / Bika ki history) clear kar sakte hain. Aapka Current Stock delete <strong className="font-black underline">NAHI</strong> hoga.
            </p>
          </div>
          
          {/* IS BUTTON KO DABANE SE HAMARA NAYA MODAL KHULEGA */}
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all hover:scale-105 whitespace-nowrap"
          >
            <Trash2 size={18} />
            Clear Activity History
          </button>
        </div>
      </div>

      {/* 2. Naya Premium Dark Blur Modal (Center wala) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 transition-all">
          
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header with Close Button */}
            <div className="flex items-start justify-between">
              {!showSuccess ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 border-[6px] border-red-50/50">
                  <AlertTriangle size={28} />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-[6px] border-emerald-50/50">
                  <CheckCircle2 size={28} />
                </div>
              )}
              
              <button 
                onClick={() => !isDeleting && !showSuccess && setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                disabled={isDeleting || showSuccess}
              >
                <X size={20} />
              </button>
            </div>
            
            {showSuccess ? (
              /* Success State UI */
              <div className="py-6 text-center">
                <h3 className="text-2xl font-black text-emerald-600 tracking-tight">Success!</h3>
                <p className="mt-3 text-sm text-slate-500 font-medium">
                  Activity History clear ho gayi hai. Aapka Stock safe hai.
                </p>
              </div>
            ) : (
              /* Default Warning State UI */
              <>
                <h3 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">Are you absolutely sure?</h3>
                <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                  Kya aap sach mein saari activity (Maal Aaya/Bika) delete karna chahte hain? Yeh data wapas nahi aayega.
                </p>
                
                <div className="mt-5 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                  <div className="text-emerald-600 font-black mt-0.5">✓</div>
                  <p className="text-emerald-800 text-sm font-bold leading-snug">
                    Aapka Current Stock (Quantity) safe rahega aur delete nahi hoga.
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Yes, Delete Data
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}