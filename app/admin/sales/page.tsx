import { prisma } from '@/lib/prisma'
import { ShoppingCart, PackageMinus, History } from 'lucide-react'
import { recordLedgerEntry } from '@/app/admin/actions'

export default async function SalesPage() {
  const materials = await prisma.material.findMany({ orderBy: { name: 'asc' } })
  
  const recentSales = await prisma.ledger.findMany({
    where: { type: 'BIKA' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { material: true }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Navy/Gold Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-yellow-500" size={32} />
            Maal Bika (Sales)
          </h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Record outgoing inventory and sales transactions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
        {/* Form Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-8">
            <PackageMinus className="text-slate-900" size={28} />
            New Outgoing Entry
          </h2>
          
          <form action={recordLedgerEntry} className="space-y-6">
            <input type="hidden" name="type" value="BIKA" />
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Material</label>
              <select name="materialId" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none appearance-none transition-all">
                <option value="">-- Select Item --</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.name} (Available: {m.stock} {m.unit})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Quantity Sold</label>
              <input type="number" step="0.01" name="quantity" required placeholder="Enter amount..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-lg font-black focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Remarks / Customer (Optional)</label>
              <input type="text" name="description" placeholder="e.g. Sold to Ramesh Ji" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
            </div>

            <button type="submit" className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5">
              Record Sale
            </button>
          </form>
        </div>

        {/* Recent Sales List */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
            <History className="text-slate-400" size={24} />
            Recent Maal Bika
          </h2>
          
          <div className="space-y-4">
            {recentSales.length === 0 ? (
              <p className="text-slate-500 font-medium text-sm text-center py-8">No recent sales recorded.</p>
            ) : (
              recentSales.map(entry => (
                <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-slate-300 transition-colors">
                  <div>
                    <h4 className="font-black text-slate-800 text-lg capitalize">{entry.material.name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-black tracking-wide border border-blue-100">
                      -{entry.quantity} <span className="text-xs">{entry.material.unit}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}