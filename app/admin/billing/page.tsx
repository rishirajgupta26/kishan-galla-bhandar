import { prisma } from '@/lib/prisma'
import { FileText } from 'lucide-react'
import BillingSystem from '@/app/admin/components/BillingSystem'

export default async function BillingPage() {
  // Database se current rates aur items laayenge
  const materials = await prisma.material.findMany({ 
    orderBy: { name: 'asc' } 
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Navy/Gold Premium Header - Hide during Print */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <FileText className="text-yellow-500" size={32} />
            Bill / Invoice Generator
          </h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Create and print instant bills for your customers.</p>
        </div>
      </div>

      {/* Humara interactive client component jisme saara logic hai */}
      <BillingSystem materials={materials} />
    </div>
  )
}
