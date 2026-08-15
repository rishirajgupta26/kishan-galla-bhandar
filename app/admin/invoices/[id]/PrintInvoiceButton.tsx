'use client'

import { Printer } from 'lucide-react'

export default function PrintInvoiceButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#FBBF24] hover:bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all"
    >
      <Printer size={18} /> Print / Save PDF
    </button>
  )
}