import { prisma } from '@/lib/prisma'
import { Settings2, IndianRupee, Box, Plus, TrendingUp } from 'lucide-react'
import { addMaterial } from '@/app/admin/actions'

export default async function RatesPage() {
  const materials = await prisma.material.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Settings2 className="text-gold" size={32} />
            Rate Management
          </h1>
          <p className="text-slate-300 mt-2 text-sm font-medium">Manage your material catalog and current market prices.</p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
           <Box className="text-gold" size={24} />
           <p className="font-bold text-sm tracking-wide">{materials.length} Items Listed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Side: Materials Grid */}
        <div className="grid sm:grid-cols-2 gap-4 h-fit">
          {materials.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-800 capitalize">{item.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">Stock: {item.stock} {item.unit}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400 group-hover:text-blue-600 transition-colors">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2">
                <IndianRupee size={18} className="text-slate-400" />
                <span className="text-2xl font-black text-slate-900">{item.currentRate}</span>
                <span className="text-sm font-bold text-slate-400">/ {item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Add New Material Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-fit sticky top-8">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
            <Plus className="text-blue-600" size={24} />
            Add New Item
          </h2>
          <form action={addMaterial} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Material Name</label>
              <input type="text" name="name" required placeholder="e.g. White Cement" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Unit</label>
                <input type="text" name="unit" required placeholder="e.g. Bag, Ton" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rate (₹)</label>
                <input type="number" name="currentRate" required placeholder="0.00" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
              <Plus size={18} /> Save Material
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}