import { prisma } from '@/lib/prisma'
import { 
  TrendingUp, TrendingDown, CircleDollarSign, AlertCircle, PackageOpen, CalendarDays
} from 'lucide-react'

export default async function ReportsPage() {
  // 1. Fetch materials for current stock valuation
  const materials = await prisma.material.findMany()
  
  const totalStockValue = materials.reduce((sum, item) => {
    return sum + (item.stock * item.currentRate)
  }, 0)
  
  const lowStockItems = materials.filter(item => item.stock <= 10)

  // 2. Fetch all ledger transactions for total Aaya/Bika stats
  const ledger = await prisma.ledger.findMany({
    include: { material: true }
  })

  let totalAayaValue = 0
  let totalBikaValue = 0
  let thisMonthAaya = 0
  let thisMonthBika = 0

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  ledger.forEach(entry => {
    const value = entry.quantity * entry.material.currentRate
    const isThisMonth = new Date(entry.createdAt) >= startOfMonth

    if (entry.type === 'AAYA') {
      totalAayaValue += value
      if (isThisMonth) thisMonthAaya += value
    } else if (entry.type === 'BIKA') {
      totalBikaValue += value
      if (isThisMonth) thisMonthBika += value
    }
  })

  // Currency Formatter
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Section - Premium Dark Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Business Reports & Analytics</h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Comprehensive overview of your inventory and financial performance.</p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-4">
           <div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-400">
             <CalendarDays size={24} />
           </div>
           <div>
             <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Current Month</p>
             <p className="font-bold text-lg leading-tight">{new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</p>
           </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 text-yellow-500">
             <CircleDollarSign size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <CircleDollarSign size={28} />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Stock Value</h3>
            <p className="text-3xl font-black text-slate-900">{formatCurrency(totalStockValue)}</p>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 text-blue-500">
             <TrendingDown size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <TrendingDown size={28} />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">All-Time Sales</h3>
            <p className="text-3xl font-black text-slate-900">{formatCurrency(totalBikaValue)}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 text-emerald-500">
             <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">All-Time Purchases</h3>
            <p className="text-3xl font-black text-slate-900">{formatCurrency(totalAayaValue)}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500 text-red-500">
             <AlertCircle size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock Items</h3>
            <p className="text-3xl font-black text-slate-900">{lowStockItems.length} <span className="text-base font-semibold text-slate-500">Items</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* This month summary */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">This Month's Summary</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Performance for August</p>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-black text-blue-600/70 uppercase tracking-widest">Total Sales (Maal Bika)</p>
                <div className="bg-blue-100 p-2 rounded-lg"><TrendingDown className="text-blue-600" size={18} /></div>
              </div>
              <p className="text-4xl font-black text-blue-700 tracking-tight">{formatCurrency(thisMonthBika)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-black text-emerald-600/70 uppercase tracking-widest">Total Purchases (Maal Aaya)</p>
                <div className="bg-emerald-100 p-2 rounded-lg"><TrendingUp className="text-emerald-600" size={18} /></div>
              </div>
              <p className="text-4xl font-black text-emerald-700 tracking-tight">{formatCurrency(thisMonthAaya)}</p>
            </div>
          </div>
        </div>

        {/* Low stock items table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
                <PackageOpen size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Action Required</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Items needing restock</p>
              </div>
            </div>
            {lowStockItems.length > 0 && (
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black tracking-wide shadow-sm animate-pulse">
                {lowStockItems.length} Warnings
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Material Name</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Stock Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {lowStockItems.map(item => (
                    <tr key={item.id} className="hover:bg-red-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{item.name}</td>
                      <td className="p-4 text-right">
                        <span className="bg-red-100 text-red-700 font-black px-3 py-1 rounded-lg text-sm">
                          {item.stock} <span className="text-xs text-red-500 ml-1">{item.unit}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {lowStockItems.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-16 px-4">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                            <PackageOpen size={36} />
                          </div>
                          <p className="text-slate-900 font-black text-xl">All Good!</p>
                          <p className="text-slate-500 text-sm mt-2 max-w-[200px]">Aapke godown mein saara maal bharpur matra mein hai.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}